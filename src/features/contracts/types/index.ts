import type { Database } from '@/types/database'

export type ContractStatus = 'all' | 'active' | 'inactive'

export type Moneda = Database['public']['Enums']['moneda_enum']
export type MotivIncetare = Database['public']['Enums']['motiv_incetare_enum']

export type ContractRow = {
   id: number
   este_activ: boolean
   data_inceput: string | null
   data_sfarsit: string | null
   tarif_lunar: number
   moneda: Moneda
   motiv_incetare: MotivIncetare | null
   contabil_uid: string | null
   created_at: string
   modified_at: string
   client: { id: number; denumire: string; cif: string } | null
   contabil: { id: number; denumire: string } | null
}
