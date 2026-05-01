import type { Database } from '@/types/database'

export type StatusPlata = Database['public']['Enums']['status_plata_enum']
export type TipPlata = Database['public']['Enums']['tip_plata_enum']
export type MetodaPlata = Database['public']['Enums']['metoda_plata_enum']

export type PaymentStatusFilter = 'all' | StatusPlata
export type PaymentTipFilter = 'all' | TipPlata

export type StatsPeriod = 'last_30_days' | 'last_3_months' | 'current_year'

export type PaymentStats = {
  total_incasat: number
  total_neincasat: number
  total_depasit: number
}

export type PaymentRow = {
  id: number
  data_emitere: string
  data_scadenta: string
  data_plata: string | null
  suma: number
  status: StatusPlata
  tip: TipPlata
  metoda: MetodaPlata | null
  nota: string | null
  contract_id: number | null
  client_id: number | null
  client_denumire: string | null
  client_cif: string | null
}

export type PaymentListFilter = {
  page: number
  year: number
  month: number | null
  status: PaymentStatusFilter
  tip: PaymentTipFilter
  clientId: number | null
}

export type PaymentCountFilter = Omit<PaymentListFilter, 'page'>

export type PaymentUpdatePatch = {
  suma: number
  tip: TipPlata
  status: StatusPlata
  data_scadenta: string
  modified_at: string
}
