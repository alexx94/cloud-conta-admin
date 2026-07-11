export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ANAF_AUTH_STATE: {
        Row: {
          client_id: number | null
          created_at: string | null
          expires_at: string
          initiated_by: string | null
          state: string
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          expires_at?: string
          initiated_by?: string | null
          state?: string
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          expires_at?: string
          initiated_by?: string | null
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "ANAF_AUTH_STATE_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "CLIENT"
            referencedColumns: ["id"]
          },
        ]
      }
      ANAF_TOKEN: {
        Row: {
          access_token: string
          client_id: number | null
          expires_at: string
          id: string
          refresh_token: string
          refresh_token_expires_at: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          client_id?: number | null
          expires_at: string
          id?: string
          refresh_token: string
          refresh_token_expires_at: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          client_id?: number | null
          expires_at?: string
          id?: string
          refresh_token?: string
          refresh_token_expires_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anaf_token_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "CLIENT"
            referencedColumns: ["id"]
          },
        ]
      }
      CLIENT: {
        Row: {
          adresa: string | null
          are_salariati: boolean
          banca: string | null
          cif: string
          cod_judet: string | null
          created_at: string
          denumire: string
          email: string | null
          este_platitor_tva: boolean
          iban: string | null
          id: number
          judet: string | null
          localitate: string | null
          modified_at: string
          nr_reg_com: string | null
          perioada_fiscala: Database["public"]["Enums"]["perioada_fiscala_enum"]
          tara: string | null
          telefon: string | null
          tip_firma: Database["public"]["Enums"]["tip_firma_enum"]
          tip_impozitare: Database["public"]["Enums"]["tip_impozitare_enum"]
          user_id: string | null
        }
        Insert: {
          adresa?: string | null
          are_salariati: boolean
          banca?: string | null
          cif: string
          cod_judet?: string | null
          created_at?: string
          denumire: string
          email?: string | null
          este_platitor_tva: boolean
          iban?: string | null
          id?: number
          judet?: string | null
          localitate?: string | null
          modified_at?: string
          nr_reg_com?: string | null
          perioada_fiscala: Database["public"]["Enums"]["perioada_fiscala_enum"]
          tara?: string | null
          telefon?: string | null
          tip_firma: Database["public"]["Enums"]["tip_firma_enum"]
          tip_impozitare?: Database["public"]["Enums"]["tip_impozitare_enum"]
          user_id?: string | null
        }
        Update: {
          adresa?: string | null
          are_salariati?: boolean
          banca?: string | null
          cif?: string
          cod_judet?: string | null
          created_at?: string
          denumire?: string
          email?: string | null
          este_platitor_tva?: boolean
          iban?: string | null
          id?: number
          judet?: string | null
          localitate?: string | null
          modified_at?: string
          nr_reg_com?: string | null
          perioada_fiscala?: Database["public"]["Enums"]["perioada_fiscala_enum"]
          tara?: string | null
          telefon?: string | null
          tip_firma?: Database["public"]["Enums"]["tip_firma_enum"]
          tip_impozitare?: Database["public"]["Enums"]["tip_impozitare_enum"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "CLIENT_cod_judet_fkey"
            columns: ["cod_judet"]
            isOneToOne: false
            referencedRelation: "JUDET"
            referencedColumns: ["cod"]
          },
          {
            foreignKeyName: "CLIENT_tara_fkey"
            columns: ["tara"]
            isOneToOne: false
            referencedRelation: "TARA"
            referencedColumns: ["cod"]
          },
        ]
      }
      CONTABIL: {
        Row: {
          created_at: string
          denumire: string
          email: string | null
          id: number
          modified_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          denumire: string
          email?: string | null
          id?: number
          modified_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          denumire?: string
          email?: string | null
          id?: number
          modified_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      CONTRACT_SERVICII: {
        Row: {
          client_id: number | null
          client_uid: string | null
          contabil_id: number | null
          contabil_uid: string | null
          created_at: string
          data_inceput: string | null
          data_sfarsit: string | null
          este_activ: boolean
          id: number
          modified_at: string
          moneda: Database["public"]["Enums"]["moneda_enum"]
          motiv_incetare:
            | Database["public"]["Enums"]["motiv_incetare_enum"]
            | null
          tarif_lunar: number
        }
        Insert: {
          client_id?: number | null
          client_uid?: string | null
          contabil_id?: number | null
          contabil_uid?: string | null
          created_at?: string
          data_inceput?: string | null
          data_sfarsit?: string | null
          este_activ?: boolean
          id?: number
          modified_at?: string
          moneda: Database["public"]["Enums"]["moneda_enum"]
          motiv_incetare?:
            | Database["public"]["Enums"]["motiv_incetare_enum"]
            | null
          tarif_lunar: number
        }
        Update: {
          client_id?: number | null
          client_uid?: string | null
          contabil_id?: number | null
          contabil_uid?: string | null
          created_at?: string
          data_inceput?: string | null
          data_sfarsit?: string | null
          este_activ?: boolean
          id?: number
          modified_at?: string
          moneda?: Database["public"]["Enums"]["moneda_enum"]
          motiv_incetare?:
            | Database["public"]["Enums"]["motiv_incetare_enum"]
            | null
          tarif_lunar?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_contract_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "CLIENT"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contract_contabil"
            columns: ["contabil_id"]
            isOneToOne: false
            referencedRelation: "CONTABIL"
            referencedColumns: ["id"]
          },
        ]
      }
      DECLARATIE: {
        Row: {
          an: number
          client_id: number | null
          created_at: string
          data_depunere: string | null
          data_programata: string
          este_rectificativa: boolean
          id: number
          index: string | null
          luna: number
          modified_at: string | null
          status: Database["public"]["Enums"]["status_declaratie_enum"]
          tip: Database["public"]["Enums"]["tip_declalratie_enum"]
        }
        Insert: {
          an: number
          client_id?: number | null
          created_at?: string
          data_depunere?: string | null
          data_programata: string
          este_rectificativa?: boolean
          id?: number
          index?: string | null
          luna: number
          modified_at?: string | null
          status?: Database["public"]["Enums"]["status_declaratie_enum"]
          tip: Database["public"]["Enums"]["tip_declalratie_enum"]
        }
        Update: {
          an?: number
          client_id?: number | null
          created_at?: string
          data_depunere?: string | null
          data_programata?: string
          este_rectificativa?: boolean
          id?: number
          index?: string | null
          luna?: number
          modified_at?: string | null
          status?: Database["public"]["Enums"]["status_declaratie_enum"]
          tip?: Database["public"]["Enums"]["tip_declalratie_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "DECLARATIE_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "CLIENT"
            referencedColumns: ["id"]
          },
        ]
      }
      DOCUMENT: {
        Row: {
          cale_fisier: string
          client_id: number | null
          created_at: string
          data_document: string
          data_incarcare: string
          id: number
          metadata: Json | null
          modified_at: string | null
          nume: string
          status: Database["public"]["Enums"]["status_document_enum"]
          tip_document: Database["public"]["Enums"]["tip_document_enum"]
          validated_at: string | null
          validation_notes: string | null
          validation_status: Database["public"]["Enums"]["validation_status_enum"]
        }
        Insert: {
          cale_fisier: string
          client_id?: number | null
          created_at?: string
          data_document?: string
          data_incarcare?: string
          id?: number
          metadata?: Json | null
          modified_at?: string | null
          nume: string
          status?: Database["public"]["Enums"]["status_document_enum"]
          tip_document: Database["public"]["Enums"]["tip_document_enum"]
          validated_at?: string | null
          validation_notes?: string | null
          validation_status?: Database["public"]["Enums"]["validation_status_enum"]
        }
        Update: {
          cale_fisier?: string
          client_id?: number | null
          created_at?: string
          data_document?: string
          data_incarcare?: string
          id?: number
          metadata?: Json | null
          modified_at?: string | null
          nume?: string
          status?: Database["public"]["Enums"]["status_document_enum"]
          tip_document?: Database["public"]["Enums"]["tip_document_enum"]
          validated_at?: string | null
          validation_notes?: string | null
          validation_status?: Database["public"]["Enums"]["validation_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "DOCUMENT_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "CLIENT"
            referencedColumns: ["id"]
          },
        ]
      }
      EFACTURA: {
        Row: {
          client_id: number | null
          created_at: string | null
          cumparator_adresa: string | null
          cumparator_cif: string | null
          cumparator_denumire: string
          cumparator_judet: string | null
          cumparator_nr_reg_com: string | null
          cumparator_oras: string | null
          cumparator_platitor_tva: boolean
          cumparator_tara: string
          cumparator_telefon: string | null
          data_emitere: string
          data_scadenta: string
          data_taxa: string | null
          erori_anaf: string | null
          este_persoana_fizica: boolean
          furnizor_adresa: string | null
          furnizor_banca: string | null
          furnizor_cif: string
          furnizor_cont_bancar: string | null
          furnizor_contact_nume: string | null
          furnizor_denumire: string
          furnizor_email: string | null
          furnizor_forma_juridica: string | null
          furnizor_judet: string | null
          furnizor_nr_reg_com: string | null
          furnizor_oras: string | null
          furnizor_platitor_tva: boolean
          furnizor_swift: string | null
          furnizor_telefon: string | null
          id: string
          index_descarcare: string | null
          index_incarcare: string | null
          mesaj_anaf: string | null
          modified_at: string | null
          moneda: Database["public"]["Enums"]["moneda_enum"]
          nota: string | null
          numar: number
          raspuns_anaf: Json | null
          recipisa: string | null
          rotunjire: number | null
          serie_id: number
          status_factura: Database["public"]["Enums"]["status_factura_enum"]
          status_spv: Database["public"]["Enums"]["status_spv_enum"]
          storage_path: string | null
          suma_platita_la_emitere: number
          tip_factura: Database["public"]["Enums"]["tip_factura_enum"]
          total_cu_tva: number
          total_fara_tva: number
          total_tva: number
          tva_incasare: boolean
          xml_generat: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          cumparator_adresa?: string | null
          cumparator_cif?: string | null
          cumparator_denumire: string
          cumparator_judet?: string | null
          cumparator_nr_reg_com?: string | null
          cumparator_oras?: string | null
          cumparator_platitor_tva?: boolean
          cumparator_tara?: string
          cumparator_telefon?: string | null
          data_emitere: string
          data_scadenta: string
          data_taxa?: string | null
          erori_anaf?: string | null
          este_persoana_fizica?: boolean
          furnizor_adresa?: string | null
          furnizor_banca?: string | null
          furnizor_cif: string
          furnizor_cont_bancar?: string | null
          furnizor_contact_nume?: string | null
          furnizor_denumire: string
          furnizor_email?: string | null
          furnizor_forma_juridica?: string | null
          furnizor_judet?: string | null
          furnizor_nr_reg_com?: string | null
          furnizor_oras?: string | null
          furnizor_platitor_tva?: boolean
          furnizor_swift?: string | null
          furnizor_telefon?: string | null
          id?: string
          index_descarcare?: string | null
          index_incarcare?: string | null
          mesaj_anaf?: string | null
          modified_at?: string | null
          moneda?: Database["public"]["Enums"]["moneda_enum"]
          nota?: string | null
          numar: number
          raspuns_anaf?: Json | null
          recipisa?: string | null
          rotunjire?: number | null
          serie_id: number
          status_factura?: Database["public"]["Enums"]["status_factura_enum"]
          status_spv?: Database["public"]["Enums"]["status_spv_enum"]
          storage_path?: string | null
          suma_platita_la_emitere?: number
          tip_factura?: Database["public"]["Enums"]["tip_factura_enum"]
          total_cu_tva: number
          total_fara_tva: number
          total_tva?: number
          tva_incasare?: boolean
          xml_generat?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          cumparator_adresa?: string | null
          cumparator_cif?: string | null
          cumparator_denumire?: string
          cumparator_judet?: string | null
          cumparator_nr_reg_com?: string | null
          cumparator_oras?: string | null
          cumparator_platitor_tva?: boolean
          cumparator_tara?: string
          cumparator_telefon?: string | null
          data_emitere?: string
          data_scadenta?: string
          data_taxa?: string | null
          erori_anaf?: string | null
          este_persoana_fizica?: boolean
          furnizor_adresa?: string | null
          furnizor_banca?: string | null
          furnizor_cif?: string
          furnizor_cont_bancar?: string | null
          furnizor_contact_nume?: string | null
          furnizor_denumire?: string
          furnizor_email?: string | null
          furnizor_forma_juridica?: string | null
          furnizor_judet?: string | null
          furnizor_nr_reg_com?: string | null
          furnizor_oras?: string | null
          furnizor_platitor_tva?: boolean
          furnizor_swift?: string | null
          furnizor_telefon?: string | null
          id?: string
          index_descarcare?: string | null
          index_incarcare?: string | null
          mesaj_anaf?: string | null
          modified_at?: string | null
          moneda?: Database["public"]["Enums"]["moneda_enum"]
          nota?: string | null
          numar?: number
          raspuns_anaf?: Json | null
          recipisa?: string | null
          rotunjire?: number | null
          serie_id?: number
          status_factura?: Database["public"]["Enums"]["status_factura_enum"]
          status_spv?: Database["public"]["Enums"]["status_spv_enum"]
          storage_path?: string | null
          suma_platita_la_emitere?: number
          tip_factura?: Database["public"]["Enums"]["tip_factura_enum"]
          total_cu_tva?: number
          total_fara_tva?: number
          total_tva?: number
          tva_incasare?: boolean
          xml_generat?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "efactura_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "CLIENT"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EFACTURA_cumparator_tara_fkey"
            columns: ["cumparator_tara"]
            isOneToOne: false
            referencedRelation: "TARA"
            referencedColumns: ["cod"]
          },
          {
            foreignKeyName: "EFACTURA_serie_id_fkey"
            columns: ["serie_id"]
            isOneToOne: false
            referencedRelation: "SERIE_FACTURA"
            referencedColumns: ["id"]
          },
        ]
      }
      EFACTURA_LINIE: {
        Row: {
          cantitate: number
          cod_categorie_tva: Database["public"]["Enums"]["categorie_tva_enum"]
          denumire: string
          descriere: string | null
          discount_motiv: string | null
          discount_suma: number | null
          efactura_id: string | null
          id: string
          pozitie: number
          pret_unitar: number
          procent_tva: number
          um: string
          valoare_fara_tva: number
          valoare_totala: number
          valoare_tva: number
        }
        Insert: {
          cantitate: number
          cod_categorie_tva?: Database["public"]["Enums"]["categorie_tva_enum"]
          denumire: string
          descriere?: string | null
          discount_motiv?: string | null
          discount_suma?: number | null
          efactura_id?: string | null
          id?: string
          pozitie: number
          pret_unitar: number
          procent_tva?: number
          um?: string
          valoare_fara_tva: number
          valoare_totala: number
          valoare_tva?: number
        }
        Update: {
          cantitate?: number
          cod_categorie_tva?: Database["public"]["Enums"]["categorie_tva_enum"]
          denumire?: string
          descriere?: string | null
          discount_motiv?: string | null
          discount_suma?: number | null
          efactura_id?: string | null
          id?: string
          pozitie?: number
          pret_unitar?: number
          procent_tva?: number
          um?: string
          valoare_fara_tva?: number
          valoare_totala?: number
          valoare_tva?: number
        }
        Relationships: [
          {
            foreignKeyName: "EFACTURA_LINIE_efactura_id_fkey"
            columns: ["efactura_id"]
            isOneToOne: false
            referencedRelation: "EFACTURA"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EFACTURA_LINIE_efactura_id_fkey"
            columns: ["efactura_id"]
            isOneToOne: false
            referencedRelation: "EFACTURA_VIEW"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EFACTURA_LINIE_um_fkey"
            columns: ["um"]
            isOneToOne: false
            referencedRelation: "UM"
            referencedColumns: ["cod"]
          },
        ]
      }
      INCARCARE_DECLARATIE: {
        Row: {
          created_at: string
          declaratie_id: number | null
          declaratie_url: string | null
          id: number
          modified_at: string | null
          recipisa_url: string | null
        }
        Insert: {
          created_at?: string
          declaratie_id?: number | null
          declaratie_url?: string | null
          id?: number
          modified_at?: string | null
          recipisa_url?: string | null
        }
        Update: {
          created_at?: string
          declaratie_id?: number | null
          declaratie_url?: string | null
          id?: number
          modified_at?: string | null
          recipisa_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "INCARCARE_DECLARATIE_declaratie_id_fkey"
            columns: ["declaratie_id"]
            isOneToOne: false
            referencedRelation: "DECLARATIE"
            referencedColumns: ["id"]
          },
        ]
      }
      INCASARE_FACTURA: {
        Row: {
          created_at: string
          created_by: string | null
          data_incasare: string
          efactura_id: string
          id: string
          metoda: Database["public"]["Enums"]["metoda_plata_enum"]
          observatii: string | null
          suma: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data_incasare?: string
          efactura_id: string
          id?: string
          metoda: Database["public"]["Enums"]["metoda_plata_enum"]
          observatii?: string | null
          suma: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data_incasare?: string
          efactura_id?: string
          id?: string
          metoda?: Database["public"]["Enums"]["metoda_plata_enum"]
          observatii?: string | null
          suma?: number
        }
        Relationships: [
          {
            foreignKeyName: "INCASARE_FACTURA_efactura_id_fkey"
            columns: ["efactura_id"]
            isOneToOne: false
            referencedRelation: "EFACTURA"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "INCASARE_FACTURA_efactura_id_fkey"
            columns: ["efactura_id"]
            isOneToOne: false
            referencedRelation: "EFACTURA_VIEW"
            referencedColumns: ["id"]
          },
        ]
      }
      JUDET: {
        Row: {
          cod: string
          denumire: string
        }
        Insert: {
          cod: string
          denumire: string
        }
        Update: {
          cod?: string
          denumire?: string
        }
        Relationships: []
      }
      PARTENER: {
        Row: {
          adresa: string
          banca: string | null
          client_id: number
          cod_client: string | null
          cod_fiscal: string | null
          cod_judet: string | null
          created_at: string
          denumire: string
          email: string | null
          este_persoana_fizica: boolean
          este_platitor_tva: boolean
          iban: string | null
          id: string
          judet: string | null
          localitate: string
          modified_at: string | null
          nr_reg_com: string | null
          persoana_contact: string | null
          tara: string
          telefon: string | null
        }
        Insert: {
          adresa: string
          banca?: string | null
          client_id: number
          cod_client?: string | null
          cod_fiscal?: string | null
          cod_judet?: string | null
          created_at?: string
          denumire: string
          email?: string | null
          este_persoana_fizica?: boolean
          este_platitor_tva?: boolean
          iban?: string | null
          id?: string
          judet?: string | null
          localitate: string
          modified_at?: string | null
          nr_reg_com?: string | null
          persoana_contact?: string | null
          tara?: string
          telefon?: string | null
        }
        Update: {
          adresa?: string
          banca?: string | null
          client_id?: number
          cod_client?: string | null
          cod_fiscal?: string | null
          cod_judet?: string | null
          created_at?: string
          denumire?: string
          email?: string | null
          este_persoana_fizica?: boolean
          este_platitor_tva?: boolean
          iban?: string | null
          id?: string
          judet?: string | null
          localitate?: string
          modified_at?: string | null
          nr_reg_com?: string | null
          persoana_contact?: string | null
          tara?: string
          telefon?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "PARTENER_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "CLIENT"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PARTENER_cod_judet_fkey"
            columns: ["cod_judet"]
            isOneToOne: false
            referencedRelation: "JUDET"
            referencedColumns: ["cod"]
          },
          {
            foreignKeyName: "PARTENER_tara_fkey"
            columns: ["tara"]
            isOneToOne: false
            referencedRelation: "TARA"
            referencedColumns: ["cod"]
          },
        ]
      }
      PLATA: {
        Row: {
          contract_servicii: number | null
          created_at: string
          data_emitere: string
          data_plata: string | null
          data_scadenta: string
          id: number
          metoda: Database["public"]["Enums"]["metoda_plata_enum"] | null
          modified_at: string
          nota: string | null
          status: Database["public"]["Enums"]["status_plata_enum"]
          suma: number
          tip: Database["public"]["Enums"]["tip_plata_enum"]
        }
        Insert: {
          contract_servicii?: number | null
          created_at?: string
          data_emitere: string
          data_plata?: string | null
          data_scadenta: string
          id?: number
          metoda?: Database["public"]["Enums"]["metoda_plata_enum"] | null
          modified_at?: string
          nota?: string | null
          status?: Database["public"]["Enums"]["status_plata_enum"]
          suma: number
          tip?: Database["public"]["Enums"]["tip_plata_enum"]
        }
        Update: {
          contract_servicii?: number | null
          created_at?: string
          data_emitere?: string
          data_plata?: string | null
          data_scadenta?: string
          id?: number
          metoda?: Database["public"]["Enums"]["metoda_plata_enum"] | null
          modified_at?: string
          nota?: string | null
          status?: Database["public"]["Enums"]["status_plata_enum"]
          suma?: number
          tip?: Database["public"]["Enums"]["tip_plata_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "PLATA_contract_servicii_fkey"
            columns: ["contract_servicii"]
            isOneToOne: false
            referencedRelation: "CONTRACT_SERVICII"
            referencedColumns: ["id"]
          },
        ]
      }
      SERIE_FACTURA: {
        Row: {
          client_id: number
          created_at: string
          id: number
          serie: string
        }
        Insert: {
          client_id: number
          created_at?: string
          id?: number
          serie: string
        }
        Update: {
          client_id?: number
          created_at?: string
          id?: number
          serie?: string
        }
        Relationships: [
          {
            foreignKeyName: "SERIE_FACTURA_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "CLIENT"
            referencedColumns: ["id"]
          },
        ]
      }
      SITUATIE_LUNARA: {
        Row: {
          an: number
          cale_fisier: string
          client_id: number
          created_at: string
          id: number
          luna: number
          modified_at: string | null
          tip_document: Database["public"]["Enums"]["tip_document_contabil"]
          uploaded_by: string | null
        }
        Insert: {
          an: number
          cale_fisier: string
          client_id: number
          created_at?: string
          id?: number
          luna: number
          modified_at?: string | null
          tip_document: Database["public"]["Enums"]["tip_document_contabil"]
          uploaded_by?: string | null
        }
        Update: {
          an?: number
          cale_fisier?: string
          client_id?: number
          created_at?: string
          id?: number
          luna?: number
          modified_at?: string | null
          tip_document?: Database["public"]["Enums"]["tip_document_contabil"]
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "SITUATIE_LUNARA_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "CLIENT"
            referencedColumns: ["id"]
          },
        ]
      }
      STORNARE: {
        Row: {
          created_at: string
          created_by: string | null
          factura_originala_id: string
          factura_storno_id: string
          id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          factura_originala_id: string
          factura_storno_id: string
          id?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          factura_originala_id?: string
          factura_storno_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "STORNARE_factura_originala_id_fkey"
            columns: ["factura_originala_id"]
            isOneToOne: false
            referencedRelation: "EFACTURA"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "STORNARE_factura_originala_id_fkey"
            columns: ["factura_originala_id"]
            isOneToOne: false
            referencedRelation: "EFACTURA_VIEW"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "STORNARE_factura_storno_id_fkey"
            columns: ["factura_storno_id"]
            isOneToOne: true
            referencedRelation: "EFACTURA"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "STORNARE_factura_storno_id_fkey"
            columns: ["factura_storno_id"]
            isOneToOne: true
            referencedRelation: "EFACTURA_VIEW"
            referencedColumns: ["id"]
          },
        ]
      }
      TARA: {
        Row: {
          activ: boolean
          cod: string
          denumire: string
        }
        Insert: {
          activ?: boolean
          cod: string
          denumire: string
        }
        Update: {
          activ?: boolean
          cod?: string
          denumire?: string
        }
        Relationships: []
      }
      UM: {
        Row: {
          activ: boolean
          cod: string
          denumire: string
        }
        Insert: {
          activ?: boolean
          cod: string
          denumire: string
        }
        Update: {
          activ?: boolean
          cod?: string
          denumire?: string
        }
        Relationships: []
      }
      USER_ROLES: {
        Row: {
          created_at: string
          id: number
          modified_at: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          modified_at?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          modified_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      EFACTURA_VIEW: {
        Row: {
          client_id: number | null
          created_at: string | null
          cumparator_adresa: string | null
          cumparator_cif: string | null
          cumparator_denumire: string | null
          cumparator_judet: string | null
          cumparator_nr_reg_com: string | null
          cumparator_oras: string | null
          cumparator_platitor_tva: boolean | null
          cumparator_tara: string | null
          cumparator_telefon: string | null
          data_emitere: string | null
          data_scadenta: string | null
          data_taxa: string | null
          erori_anaf: string | null
          este_persoana_fizica: boolean | null
          furnizor_adresa: string | null
          furnizor_banca: string | null
          furnizor_cif: string | null
          furnizor_cont_bancar: string | null
          furnizor_contact_nume: string | null
          furnizor_denumire: string | null
          furnizor_email: string | null
          furnizor_forma_juridica: string | null
          furnizor_judet: string | null
          furnizor_nr_reg_com: string | null
          furnizor_oras: string | null
          furnizor_platitor_tva: boolean | null
          furnizor_swift: string | null
          furnizor_telefon: string | null
          id: string | null
          index_descarcare: string | null
          index_incarcare: string | null
          mesaj_anaf: string | null
          modified_at: string | null
          moneda: Database["public"]["Enums"]["moneda_enum"] | null
          nota: string | null
          numar: number | null
          raspuns_anaf: Json | null
          recipisa: string | null
          rotunjire: number | null
          serie_id: number | null
          status_factura:
            | Database["public"]["Enums"]["status_factura_enum"]
            | null
          status_factura_calculat:
            | Database["public"]["Enums"]["status_incasare_enum"]
            | null
          status_spv: Database["public"]["Enums"]["status_spv_enum"] | null
          storage_path: string | null
          suma_incasata: number | null
          suma_platita_la_emitere: number | null
          tip_factura: Database["public"]["Enums"]["tip_factura_enum"] | null
          total_cu_tva: number | null
          total_fara_tva: number | null
          total_incasat: number | null
          total_tva: number | null
          tva_incasare: boolean | null
          xml_generat: string | null
        }
        Relationships: [
          {
            foreignKeyName: "efactura_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "CLIENT"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EFACTURA_cumparator_tara_fkey"
            columns: ["cumparator_tara"]
            isOneToOne: false
            referencedRelation: "TARA"
            referencedColumns: ["cod"]
          },
          {
            foreignKeyName: "EFACTURA_serie_id_fkey"
            columns: ["serie_id"]
            isOneToOne: false
            referencedRelation: "SERIE_FACTURA"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_dashboard_chart_stats: {
        Args: { p_client_id: number }
        Returns: Json
      }
      get_document_with_declaratii: {
        Args: { p_document_id: number; p_limit?: number }
        Returns: Json
      }
      get_documente_in_lucru_grupate: {
        Args: never
        Returns: {
          client_id: number
          denumire_client: string
          doc_count: number
          oldest_created_at: string
          total_doc_count: number
        }[]
      }
      get_efacturi_stats: {
        Args: { p_client_id: number }
        Returns: {
          erori_anaf: number
          incasari_an: number
          incasari_an_prec: number
          incasari_luna: number
          incasari_luna_prec: number
          neincasate: number
          scadenta_depasita: number
        }[]
      }
      get_next_numar_factura: { Args: { p_serie_id: number }; Returns: number }
      get_payment_stats: {
        Args: { p_date_from: string; p_date_to: string }
        Returns: Json
      }
      get_plati_an_stats: { Args: { p_an: number }; Returns: Json }
    }
    Enums: {
      app_role: "contabil_admin" | "client_admin" | "admin"
      categorie_tva_enum: "O" | "S" | "R" | "E" | "AE" | "Z"
      metoda_plata_enum:
        | "cash"
        | "transfer_bancar"
        | "card"
        | "altele"
        | "compensare"
      moneda_enum: "RON" | "EUR" | "USD" | "GBP" | "CHF"
      motiv_incetare_enum:
        | "expirare_naturala"
        | "reziliere_client"
        | "reziliere_contabil"
        | "neplata"
        | "alt_motiv"
      perioada_fiscala_enum: "lunar" | "trimestrial"
      status_declaratie_enum: "neincarcat" | "incarcat" | "depasit"
      status_document_enum: "in lucru" | "lucrat"
      status_factura_enum: "nefinalizata" | "emisa"
      status_incasare_enum:
        | "nefinalizata"
        | "neincasata"
        | "partial_incasata"
        | "incasata"
      status_plata_enum: "in_lucru" | "platit" | "anulat" | "depasit"
      status_spv_enum:
        | "netrimisa"
        | "in_asteptare"
        | "trimisa"
        | "validata"
        | "respinsa"
      tip_declalratie_enum:
        | "D100"
        | "D300"
        | "D390"
        | "D406"
        | "D101"
        | "D700"
        | "D112"
        | "D394"
      tip_document_contabil:
        | "balanta"
        | "bilant"
        | "jurnal_cumparari"
        | "jurnal_vanzari"
        | "registru_jurnal"
        | "calcul_impozit"
        | "declaratie"
        | "op_taxe"
        | "raport_salarizare"
        | "altele"
      tip_document_enum:
        | "factura_intrare"
        | "factura_intrare_valuta"
        | "factura_iesire"
        | "factura_iesire_valuta"
        | "extras_bancar"
        | "extras_bancar_valuta"
        | "declaratie"
        | "altele"
      tip_factura_enum: "380" | "381" | "389" | "384" | "751"
      tip_firma_enum: "SRL" | "PFA" | "II" | "SA" | "ONG"
      tip_impozitare_enum: "profit" | "micro"
      tip_plata_enum: "contractuala" | "manuala" | "penalizare"
      validation_status_enum: "in_asteptare" | "validat" | "respins"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["contabil_admin", "client_admin", "admin"],
      categorie_tva_enum: ["O", "S", "R", "E", "AE", "Z"],
      metoda_plata_enum: [
        "cash",
        "transfer_bancar",
        "card",
        "altele",
        "compensare",
      ],
      moneda_enum: ["RON", "EUR", "USD", "GBP", "CHF"],
      motiv_incetare_enum: [
        "expirare_naturala",
        "reziliere_client",
        "reziliere_contabil",
        "neplata",
        "alt_motiv",
      ],
      perioada_fiscala_enum: ["lunar", "trimestrial"],
      status_declaratie_enum: ["neincarcat", "incarcat", "depasit"],
      status_document_enum: ["in lucru", "lucrat"],
      status_factura_enum: ["nefinalizata", "emisa"],
      status_incasare_enum: [
        "nefinalizata",
        "neincasata",
        "partial_incasata",
        "incasata",
      ],
      status_plata_enum: ["in_lucru", "platit", "anulat", "depasit"],
      status_spv_enum: [
        "netrimisa",
        "in_asteptare",
        "trimisa",
        "validata",
        "respinsa",
      ],
      tip_declalratie_enum: [
        "D100",
        "D300",
        "D390",
        "D406",
        "D101",
        "D700",
        "D112",
        "D394",
      ],
      tip_document_contabil: [
        "balanta",
        "bilant",
        "jurnal_cumparari",
        "jurnal_vanzari",
        "registru_jurnal",
        "calcul_impozit",
        "declaratie",
        "op_taxe",
        "raport_salarizare",
        "altele",
      ],
      tip_document_enum: [
        "factura_intrare",
        "factura_intrare_valuta",
        "factura_iesire",
        "factura_iesire_valuta",
        "extras_bancar",
        "extras_bancar_valuta",
        "declaratie",
        "altele",
      ],
      tip_factura_enum: ["380", "381", "389", "384", "751"],
      tip_firma_enum: ["SRL", "PFA", "II", "SA", "ONG"],
      tip_impozitare_enum: ["profit", "micro"],
      tip_plata_enum: ["contractuala", "manuala", "penalizare"],
      validation_status_enum: ["in_asteptare", "validat", "respins"],
    },
  },
} as const
