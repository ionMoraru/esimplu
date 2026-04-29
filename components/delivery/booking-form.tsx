"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  tripId: string
  defaultType: "PASSENGER" | "PARCEL"
  passengerSeatsOffered: number
  parcelCapacityKg: number
}

export function BookingForm({ tripId, defaultType, passengerSeatsOffered, parcelCapacityKg }: Props) {
  const [type, setType] = useState<"PASSENGER" | "PARCEL">(defaultType)
  const [quantity, setQuantity] = useState("1")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [parcelDescription, setParcelDescription] = useState("")
  const [pickupAddress, setPickupAddress] = useState("")
  const [dropoffAddress, setDropoffAddress] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function submit() {
    setError(null)
    const q = Number.parseInt(quantity, 10)
    if (Number.isNaN(q) || q < 1) {
      setError("Cantitate invalidă")
      return
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setError("Telefonul este obligatoriu")
      return
    }
    if (type === "PARCEL") {
      if (!parcelDescription.trim() || !pickupAddress.trim() || !dropoffAddress.trim()) {
        setError("Descrierea, adresa de ridicare și de livrare sunt obligatorii pentru un colet")
        return
      }
    }

    startTransition(async () => {
      const res = await fetch("/api/delivery/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          type,
          quantity: q,
          customerPhone: phone,
          customerMessage: message || undefined,
          parcelDescription: type === "PARCEL" ? parcelDescription : undefined,
          pickupAddress: type === "PARCEL" ? pickupAddress : undefined,
          dropoffAddress: type === "PARCEL" ? dropoffAddress : undefined,
        }),
      })
      const json = (await res.json()) as { error?: string; booking?: { id: string } }
      if (!res.ok || !json.booking) {
        setError(json.error ?? "Eroare la rezervare")
        return
      }
      router.push(`/delivery/booking/${json.booking.id}`)
    })
  }

  const maxQty = type === "PASSENGER" ? passengerSeatsOffered : parcelCapacityKg
  const qLabel = type === "PASSENGER" ? "Număr de pasageri" : "Greutatea coletului (kg)"

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="space-y-5"
    >
      <section className="space-y-3">
        <h2 className="font-medium">Tip cerere</h2>
        <div className="flex gap-3">
          {passengerSeatsOffered > 0 && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={type === "PASSENGER"}
                onChange={() => {
                  setType("PASSENGER")
                  setQuantity("1")
                }}
              />
              Pasageri
            </label>
          )}
          {parcelCapacityKg > 0 && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={type === "PARCEL"}
                onChange={() => {
                  setType("PARCEL")
                  setQuantity("1")
                }}
              />
              Colet
            </label>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <label className="block text-sm mb-1">{qLabel} (max {maxQty}) *</label>
          <Input
            type="number"
            min={1}
            max={maxQty}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Telefonul tău *</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+33..."
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Comunicat transportatorului doar după acceptare.
          </p>
        </div>
      </section>

      {type === "PARCEL" && (
        <section className="space-y-3">
          <h2 className="font-medium">Detalii colet</h2>
          <div>
            <label className="block text-sm mb-1">Descriere *</label>
            <Input
              value={parcelDescription}
              onChange={(e) => setParcelDescription(e.target.value)}
              placeholder="Documente, haine, medicamente..."
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Adresa de ridicare *</label>
            <Input
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Adresa de livrare *</label>
            <Input
              value={dropoffAddress}
              onChange={(e) => setDropoffAddress(e.target.value)}
              required
            />
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-medium">Mesaj pentru transportator (opțional)</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </section>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Se trimite..." : "Trimite cererea"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Transportatorul va primi cererea ta pe email. Are 48 h pentru a confirma.
      </p>
    </form>
  )
}
