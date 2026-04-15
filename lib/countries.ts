import type { Country } from "@/types"

export const COUNTRIES: { code: Country; name: string; flag: string }[] = [
  { code: "fr", name: "Franța", flag: "🇫🇷" },
  { code: "de", name: "Germania", flag: "🇩🇪" },
  { code: "it", name: "Italia", flag: "🇮🇹" },
  { code: "uk", name: "Marea Britanie", flag: "🇬🇧" },
]

export function getCountryName(code: Country): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code
}

export function getCountryFlag(code: Country): string {
  return COUNTRIES.find((c) => c.code === code)?.flag ?? ""
}

export const COUNTRY_COOKIE = "country"
export const COUNTRY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year
