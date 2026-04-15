// === Country ===

export type Country = "fr" | "de" | "it" | "uk"

export const COUNTRIES: { code: Country; name: string; flag: string }[] = [
  { code: "fr", name: "Franța", flag: "🇫🇷" },
  { code: "de", name: "Germania", flag: "🇩🇪" },
  { code: "it", name: "Italia", flag: "🇮🇹" },
  { code: "uk", name: "Marea Britanie", flag: "🇬🇧" },
]

// === Service ===

export type ServiceStatus = "PENDING" | "PUBLISHED" | "REJECTED"

// === Marketplace (Phase 2) ===

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

export type Currency = "EUR" | "RON" | "MDL"

// === Delivery (Phase 3) ===

export type TripStatus = "open" | "full" | "completed" | "cancelled"

export type BookingStatus = "pending" | "confirmed" | "delivered"

export type Location = {
  city: string
  country: string
  address?: string
}
