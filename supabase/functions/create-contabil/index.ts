import { createClient } from "jsr:@supabase/supabase-js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    const { data: callerRole, error: callerRoleError } = await supabaseAdmin
      .from("USER_ROLES")
      .select("role")
      .eq("user_id", callerId)
      .single();

    if (callerRoleError || !callerRole || callerRole.role !== "admin") {
      return json({ error: "Forbidden: You do not have access to this resource" }, 403);
    }

    const body = await req.json();
    const { denumire, email, password } = body;

    // Validate inputs before any side effects
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

    // Insert CONTABIL — if this fails, delete the auth user (compensation)
    const { data: insertedContabil, error: contabilError } = await supabaseAdmin
      .from("CONTABIL")
      .insert({
        user_id: newUserId,
        denumire: String(denumire).trim(),
        email: emailClean,
      })
      .select("id")
      .single();

    if (contabilError) {
      await supabaseAdmin.auth.admin.deleteUser(newUserId);

      if (contabilError.code === "23505" && contabilError.message.includes("CONTABIL_denumire_key")) {
        return json({ error: "Un contabil cu această denumire există deja." }, 409);
      }

      return json({ error: "Nu am putut crea contabilul: " + contabilError.message }, 500);
    }

    // Insert USER_ROLES — if this fails, delete CONTABIL row and auth user (compensation)
    const { error: insertRoleError } = await supabaseAdmin
      .from("USER_ROLES")
      .insert({ user_id: newUserId, role: "contabil_admin" });

    if (insertRoleError) {
      await supabaseAdmin.from("CONTABIL").delete().eq("id", insertedContabil.id);
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return json({ error: "Nu am putut atribui rolul contabilului: " + insertRoleError.message }, 500);
    }

    return json({ contabilId: insertedContabil.id, userId: newUserId });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ error: message }, 500);
  }
});
