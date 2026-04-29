export type Judet = { cod: string; denumire: string }

export const JUDETE: Judet[] = [
  { cod: 'AB', denumire: 'ALBA' },           { cod: 'AR', denumire: 'ARAD' },
  { cod: 'AG', denumire: 'ARGEȘ' },          { cod: 'BC', denumire: 'BACĂU' },
  { cod: 'BH', denumire: 'BIHOR' },          { cod: 'BN', denumire: 'BISTRIȚA-NĂSĂUD' },
  { cod: 'BT', denumire: 'BOTOȘANI' },       { cod: 'BV', denumire: 'BRAȘOV' },
  { cod: 'BR', denumire: 'BRĂILA' },         { cod: 'B',  denumire: 'BUCUREȘTI' },
  { cod: 'BZ', denumire: 'BUZĂU' },          { cod: 'CS', denumire: 'CARAȘ-SEVERIN' },
  { cod: 'CL', denumire: 'CĂLĂRAȘI' },       { cod: 'CJ', denumire: 'CLUJ' },
  { cod: 'CT', denumire: 'CONSTANȚA' },      { cod: 'CV', denumire: 'COVASNA' },
  { cod: 'DB', denumire: 'DÂMBOVIȚA' },      { cod: 'DJ', denumire: 'DOLJ' },
  { cod: 'GL', denumire: 'GALAȚI' },         { cod: 'GR', denumire: 'GIURGIU' },
  { cod: 'GJ', denumire: 'GORJ' },           { cod: 'HR', denumire: 'HARGHITA' },
  { cod: 'HD', denumire: 'HUNEDOARA' },      { cod: 'IL', denumire: 'IALOMIȚA' },
  { cod: 'IS', denumire: 'IAȘI' },           { cod: 'IF', denumire: 'ILFOV' },
  { cod: 'MM', denumire: 'MARAMUREȘ' },      { cod: 'MH', denumire: 'MEHEDINȚI' },
  { cod: 'MS', denumire: 'MUREȘ' },          { cod: 'NT', denumire: 'NEAMȚ' },
  { cod: 'OT', denumire: 'OLT' },            { cod: 'PH', denumire: 'PRAHOVA' },
  { cod: 'SM', denumire: 'SATU MARE' },      { cod: 'SJ', denumire: 'SĂLAJ' },
  { cod: 'SB', denumire: 'SIBIU' },          { cod: 'SV', denumire: 'SUCEAVA' },
  { cod: 'TR', denumire: 'TELEORMAN' },      { cod: 'TM', denumire: 'TIMIȘ' },
  { cod: 'TL', denumire: 'TULCEA' },         { cod: 'VS', denumire: 'VASLUI' },
  { cod: 'VL', denumire: 'VÂLCEA' },         { cod: 'VN', denumire: 'VRANCEA' },
]

export function getJudetByCod(cod: string): Judet | undefined {
  return JUDETE.find(j => j.cod === cod)
}
