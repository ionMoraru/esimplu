export interface EmailMessage {
  to: string
  subject: string
  text: string
}

export interface EmailService {
  send(message: EmailMessage): Promise<void>
}

class ConsoleEmailService implements EmailService {
  async send(message: EmailMessage): Promise<void> {
    console.log("\n=== EMAIL (console) ===")
    console.log(`To:      ${message.to}`)
    console.log(`Subject: ${message.subject}`)
    console.log("Body:")
    console.log(message.text)
    console.log("=======================\n")
  }
}

let cached: EmailService | null = null

export function getEmailService(): EmailService {
  if (cached) return cached
  cached = new ConsoleEmailService()
  return cached
}

// === Templates ===

export type OrderEmailVars = {
  orderId: string
  productsLine: string // "Pommes 5kg x1 — 25,00 €"
  totalEur: string // "25,00"
  customerName: string
}

export function tplSellerNewOrder(vars: OrderEmailVars): EmailMessage {
  return {
    to: "", // filled by caller
    subject: `Nouvelle commande eSimplu — ${vars.orderId}`,
    text: [
      `Bonjour,`,
      ``,
      `Vous avez reçu une nouvelle commande.`,
      ``,
      `Commande : ${vars.orderId}`,
      `Produits : ${vars.productsLine}`,
      `Total client : ${vars.totalEur} €`,
      `Client : ${vars.customerName}`,
      ``,
      `Préparez le colis et remettez-le au livreur quand il viendra.`,
      `eSimplu`,
    ].join("\n"),
  }
}

export function tplCourierNewAssignment(vars: OrderEmailVars & { pickupSeller: string; deliveryAddress: string }): EmailMessage {
  return {
    to: "",
    subject: `Nouvelle livraison à prendre en charge — ${vars.orderId}`,
    text: [
      `Bonjour,`,
      ``,
      `Une nouvelle commande vous est assignée.`,
      ``,
      `Commande : ${vars.orderId}`,
      `À récupérer chez : ${vars.pickupSeller}`,
      `À livrer à : ${vars.deliveryAddress}`,
      ``,
      `Connectez-vous à votre tableau de bord pour confirmer la prise en charge puis la livraison.`,
      `eSimplu`,
    ].join("\n"),
  }
}

export function tplCustomerOrderConfirmation(vars: OrderEmailVars): EmailMessage {
  return {
    to: "",
    subject: `Votre commande eSimplu est confirmée — ${vars.orderId}`,
    text: [
      `Bonjour ${vars.customerName},`,
      ``,
      `Merci pour votre commande !`,
      ``,
      `Commande : ${vars.orderId}`,
      `Produits : ${vars.productsLine}`,
      `Total : ${vars.totalEur} €`,
      ``,
      `Nous vous tiendrons informé(e) de l'avancement par email.`,
      `eSimplu`,
    ].join("\n"),
  }
}

export function tplCustomerHandedOver(vars: OrderEmailVars & { courierName: string }): EmailMessage {
  return {
    to: "",
    subject: `Votre commande est en route — ${vars.orderId}`,
    text: [
      `Bonjour ${vars.customerName},`,
      ``,
      `Bonne nouvelle : ${vars.courierName} a pris en charge votre commande et est en route pour vous la livrer.`,
      ``,
      `Commande : ${vars.orderId}`,
      ``,
      `Vous pourrez confirmer la réception une fois que le livreur vous remettra le colis.`,
      `eSimplu`,
    ].join("\n"),
  }
}

export function tplAdminNewSellerRequest(vars: {
  sellerEmail: string
  displayName: string
  city: string
  country: string
  reviewUrl: string
}): EmailMessage {
  return {
    to: "",
    subject: `Nouvelle demande vendeur — ${vars.displayName}`,
    text: [
      `Bonjour,`,
      ``,
      `Une nouvelle demande de compte vendeur est en attente.`,
      ``,
      `Email : ${vars.sellerEmail}`,
      `Nom commercial : ${vars.displayName}`,
      `Ville/Pays : ${vars.city}, ${vars.country.toUpperCase()}`,
      ``,
      `Vérifiez et approuvez la demande ici : ${vars.reviewUrl}`,
      `eSimplu`,
    ].join("\n"),
  }
}

export function tplCourierNewBookingRequest(vars: {
  bookingId: string
  tripId: string
  type: "PASSENGER" | "PARCEL"
  quantity: number
  originCity: string
  destinationCity: string
  departureDate: string
  customerName: string
  customerPhone: string
  customerMessage: string | null
  reviewUrl: string
}): EmailMessage {
  const typeLabel = vars.type === "PASSENGER" ? `${vars.quantity} loc(uri) pasager` : `colet de ${vars.quantity} kg`
  return {
    to: "",
    subject: `Cerere nouă pe cursa ${vars.originCity} → ${vars.destinationCity}`,
    text: [
      `Bună ziua,`,
      ``,
      `Ai primit o nouă cerere de rezervare.`,
      ``,
      `Cursă: ${vars.originCity} → ${vars.destinationCity}`,
      `Plecare: ${vars.departureDate}`,
      `Cerere: ${typeLabel}`,
      `Client: ${vars.customerName} (${vars.customerPhone})`,
      vars.customerMessage ? `Mesaj: ${vars.customerMessage}` : "",
      ``,
      `Validează sau refuză cererea aici: ${vars.reviewUrl}`,
      `eSimplu`,
    ].filter(Boolean).join("\n"),
  }
}

export function tplCustomerBookingConfirmed(vars: {
  bookingId: string
  originCity: string
  destinationCity: string
  departureDate: string
  courierName: string
  courierPhone: string
  trackingUrl: string
}): EmailMessage {
  return {
    to: "",
    subject: `Rezervare confirmată — ${vars.originCity} → ${vars.destinationCity}`,
    text: [
      `Bună ziua,`,
      ``,
      `Vești bune: cererea ta de rezervare a fost acceptată de transportator.`,
      ``,
      `Cursă: ${vars.originCity} → ${vars.destinationCity}`,
      `Plecare: ${vars.departureDate}`,
      ``,
      `Date de contact transportator:`,
      `  ${vars.courierName}`,
      `  ${vars.courierPhone}`,
      ``,
      `Contactează-l direct pentru a stabili detaliile (locul de întâlnire, plata).`,
      `eSimplu nu intervine nici în plată, nici în livrare.`,
      ``,
      `Urmărire: ${vars.trackingUrl}`,
      `eSimplu`,
    ].join("\n"),
  }
}

export function tplCustomerBookingRejected(vars: {
  bookingId: string
  originCity: string
  destinationCity: string
  reason: string | null
  trackingUrl: string
}): EmailMessage {
  return {
    to: "",
    subject: `Rezervare refuzată — ${vars.originCity} → ${vars.destinationCity}`,
    text: [
      `Bună ziua,`,
      ``,
      `Cererea ta de rezervare pentru ${vars.originCity} → ${vars.destinationCity} a fost refuzată de transportator.`,
      vars.reason ? `Motiv: ${vars.reason}` : "",
      ``,
      `Poți căuta alte curse disponibile pe eSimplu.`,
      `Urmărire: ${vars.trackingUrl}`,
      `eSimplu`,
    ].filter(Boolean).join("\n"),
  }
}

export function tplCustomerCourierDelivered(vars: OrderEmailVars & { trackingUrl: string }): EmailMessage {
  return {
    to: "",
    subject: `Votre commande a été livrée — confirmez la réception (${vars.orderId})`,
    text: [
      `Bonjour ${vars.customerName},`,
      ``,
      `Le livreur indique que votre commande vous a été remise.`,
      ``,
      `Commande : ${vars.orderId}`,
      ``,
      `Confirmez la bonne réception ici : ${vars.trackingUrl}`,
      ``,
      `Si vous ne confirmez pas sous 7 jours, la livraison sera considérée comme réussie automatiquement.`,
      `eSimplu`,
    ].join("\n"),
  }
}
