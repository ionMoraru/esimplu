export type Locale = "fr" | "de" | "it" | "uk"

export type Role = "reader" | "seller" | "buyer" | "carrier"

export type User = {
  id: string         // WP user ID (numérique sous forme de string)
  email: string
  displayName: string
  locales: Locale[]  // pays où l'utilisateur est actif
  roles: Role[]      // rôles cumulables
}

export type Seller = {
  userId: string
  businessName: string
  country: "ro" | "md"
  deliveriesTo: Locale[]
  description: string
  verified: boolean
}

export type Product = {
  id: string
  sellerId: string
  name: string
  description: string
  price: number
  currency: "EUR" | "RON" | "MDL"
  category: string
  attributes: Record<string, unknown>
  availableIn: Locale[]
  stock: number
  images: string[]
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

export type OrderItem = {
  productId: string
  quantity: number
  unitPrice: number
}

export type Order = {
  id: string
  buyerId: string
  sellerId: string
  items: OrderItem[]
  status: OrderStatus
  deliveryLocale: Locale
  createdAt: Date
}

export type Carrier = {
  userId: string
  name: string
  phone: string
  vehicleType: string
  rating: number
}

export type Location = {
  city: string
  country: string
  address?: string
}

export type TripStatus = "open" | "full" | "completed" | "cancelled"

export type Trip = {
  id: string
  carrierId: string
  origin: Location
  destination: Location
  departureDate: Date
  arrivalDate: Date
  availableCapacity: number  // kg
  pricePerKg: number
  currency: "EUR" | "RON" | "MDL"
  status: TripStatus
}

export type BookingStatus = "pending" | "confirmed" | "delivered"

export type Booking = {
  id: string
  tripId: string
  userId: string
  weight: number
  description: string
  status: BookingStatus
  createdAt: Date
}

// Payload décodé du JWT WordPress
export type WpJwtPayload = {
  iss: string   // URL du site WP
  iat: number   // issued at (timestamp)
  nbf: number   // not before
  exp: number   // expiration
  data: {
    user: {
      id: string
    }
  }
}
