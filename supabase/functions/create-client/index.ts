import { createClient } from "@supabase/supabase-js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CIF_DIGITS_REGEX = /^\d{2,10}$/;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization header" }, 401);

    const token = authHeader.replace("Bearer ", "");
    const parts = token.split(".");
    if (parts.length !== 3) return json({ error: "Invalid token format" }, 401);

    const payload = JSON.parse(atob(parts[1]));
    const callerId = payload.sub;
    if (!callerId) return json({ error: "User ID not found in token" }, 401);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: userRole, error: roleError } = await supabaseAdmin
      .from("USER_ROLES")
      .select("role")
      .eq("user_id", callerId)
      .single();

    if (roleError || !userRole || userRole.role !== "admin") {
      return json({ error: "Forbidden: You do not have access to this resource" }, 403);
    }

    const body = await req.json();
    const {
      cif,
      denumire,
      tipFirma,
      tipImpozitare,
      perioadaFiscala,
      estePlatitorTva,
      areSalariati,
      telefon,
      adresa,
      localitate,
      judet,
      codJudet,
      nrRegCom,
      email,
      password,
    } = body;

    // Validate inputs before any side effects
    // TODO: Daca e nevoie pe viitor, las si RO in fata (pt efacturi sau
    // alte integrari, daca cer asta), dar pentru validare si unicitate e mai simplu fara
    const cifClean = String(cif ?? "").replace(/^RO/i, "").trim();
    if (!CIF_DIGITS_REGEX.test(cifClean)) {
      return json({ error: "CIF invalid: trebuie să conțină 2-10 cifre." }, 400);
    }

    if (!String(denumire ?? "").trim()) {
      return json({ error: "Denumirea este obligatorie." }, 400);
    }

    const emailClean = String(email ?? "").trim();
    if (!EMAIL_REGEX.test(emailClean)) {
      return json({ error: "Adresa de email nu este validă." }, 400);
    }

    if (String(password ?? "").length < 8) {
      return json({ error: "Parola trebuie să aibă cel puțin 8 caractere." }, 400);
    }

    // Create auth user first — if this fails, nothing to clean up
    const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: emailClean,
      password,
      email_confirm: true,
    });

    if (createUserError) {
      return json({
        error: createUserError.message.includes("already registered")
          ? "Această adresă de email este deja înregistrată în sistem."
          : createUserError.message,
      }, 409);
    }

    const newUserId = newUser.user.id;

    // Insert CLIENT — if this fails, delete the auth user (compensation)
    const { data: insertedClient, error: clientError } = await supabaseAdmin
      .from("CLIENT")
      .insert({
        user_id: newUserId,
        cif: cifClean,
        denumire: String(denumire).trim(),
        tip_firma: tipFirma,
        tip_impozitare: tipImpozitare,
        perioada_fiscala: perioadaFiscala,
        este_platitor_tva: estePlatitorTva,
        are_salariati: areSalariati,
        email: emailClean,
        telefon: telefon ?? null,
        adresa: adresa ?? null,
        localitate: localitate ?? null,
        judet: judet ?? null,
        cod_judet: codJudet ?? null,
        nr_reg_com: nrRegCom ?? null,
      })
      .select("id")
      .single();

    if (clientError) {
      await supabaseAdmin.auth.admin.deleteUser(newUserId);

      // Map unique constraint violations to user-friendly messages
      if (clientError.code === "23505") {
        if (clientError.message.includes("CLIENT_cif_key")) {
          return json({ error: "Un client cu acest CIF există deja." }, 409);
        }
        if (clientError.message.includes("CLIENT_denumire_key")) {
          return json({ error: "Un client cu această denumire există deja." }, 409);
        }
      }

      return json({ error: "Nu am putut crea clientul: " + clientError.message }, 500);
    }

    return json({ clientId: insertedClient.id, userId: newUserId });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ error: message }, 500);
  }
});
