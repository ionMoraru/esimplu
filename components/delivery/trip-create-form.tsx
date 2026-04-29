"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const COUNTRIES = [
  { code: "fr", label: "🇫🇷 France" },
  { code: "de", label: "🇩🇪 Allemagne" },
  { code: "it", label: "🇮🇹 Italie" },
  { code: "uk", label: "🇬🇧 Royaume-Uni" },
  { code: "ro", label: "🇷🇴 Roumanie" },
  { code: "md", label: "🇲🇩 Moldavie" },
  { code: "be", label: "🇧🇪 Belgique" },
  { code: "es", label: "🇪🇸 Espagne" },
]

const VEHICLES = [
  { value: "CAR", label: "🚗 Voiture" },
  { value: "VAN", label: "🚐 Camionnette" },
  { value: "BUS", label: "🚌 Bus" },
  { value: "PLANE", label: "✈️ Avion" },
  { value: "TRAIN", label: "🚆 Train" },
  { value: "OTHER", label: "Autre" },
]

export function TripCreateForm() {
  const [originCity, setOriginCity] = useState("")
  const [originCountry, setOriginCountry] = useState("fr")
  const [destinationCity, setDestinationCity] = useState("")
  const [destinationCountry, setDestinationCountry] = useState("md")
  const [departureDate, setDepartureDate] = useState("")
  const [arrivalDate, setArrivalDate] = useState("")
  const [vehicleType, setVehicleType] = useState("CAR")
  const [passengerSeats, setPassengerSeats] = useState("0")
  const [parcelKg, setParcelKg] = useState("0")
  const [pricePerSeat, setPricePerSeat] = useState("")
  const [pricePerKg, setPricePerKg] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function eurToCents(v: string): number | null {
    if (!v.trim()) return null
    const num = Number.parseFloat(v.replace(",", "."))
    if (Number.isNaN(num) || num < 0) return null
    return Math.round(num * 100)
  }

  function submit() {
    setError(null)
    const passengerSeatsN = Number.parseInt(passengerSeats, 10) || 0
    const parcelKgN = Number.parseInt(parcelKg, 10) || 0
    if (passengerSeatsN === 0 && parcelKgN === 0) {
      setError("Indiquez au moins une capacité passager OU colis")
      return
    }
    if (!departureDate) {
      setError("Date de départ requise")
      return
    }

    startTransition(async () => {
      const res = await fetch("/api/courier/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originCity,
          originCountry,
          destinationCity,
          destinationCountry,
          departureDate: new Date(departureDate).toISOString(),
          arrivalDate: arrivalDate ? new Date(arrivalDate).toISOString() : null,
          vehicleType,
          passengerSeatsOffered: passengerSeatsN,
          parcelCapacityKg: parcelKgN,
          pricePerSeatCents: eurToCents(pricePerSeat),
          pricePerKgCents: eurToCents(pricePerKg),
          notes: notes || null,
        }),
      })
      const json = (await res.json()) as { error?: string; trip?: { id: string } }
      if (!res.ok) {
        setError(json.error ?? "Erreur lors de la création")
        return
      }
      router.push("/dashboard/courier/trips")
      router.refresh()
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="space-y-5"
    >
      <section className="space-y-3">
        <h2 className="font-medium">Itinéraire</h2>
        <div className="grid grid-cols-[1fr_140px] gap-3">
          <div>
            <label className="block text-sm mb-1">Ville de départ *</label>
            <Input value={originCity} onChange={(e) => setOriginCity(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Pays *</label>
            <select
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm bg-background"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_140px] gap-3">
          <div>
            <label className="block text-sm mb-1">Ville d&apos;arrivée *</label>
            <Input
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Pays *</label>
            <select
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm bg-background"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Horaires</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Départ *</label>
            <Input
              type="datetime-local"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Arrivée (facultatif)</label>
            <Input
              type="datetime-local"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Véhicule et capacité</h2>
        <div>
          <label className="block text-sm mb-1">Type de véhicule</label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm bg-background"
          >
            {VEHICLES.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Places passager</label>
            <Input
              type="number"
              min={0}
              max={50}
              value={passengerSeats}
              onChange={(e) => setPassengerSeats(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Capacité colis (kg)</label>
            <Input
              type="number"
              min={0}
              max={5000}
              value={parcelKg}
              onChange={(e) => setParcelKg(e.target.value)}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Indiquez 0 pour le service que vous ne proposez pas. Au moins l&apos;un des deux doit être &gt; 0.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Tarifs indicatifs (optionnels)</h2>
        <p className="text-xs text-muted-foreground">
          La plateforme ne perçoit pas de commission. Ces prix servent à informer le client avant
          qu&apos;il vous contacte.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Prix par place (EUR)</label>
            <Input
              value={pricePerSeat}
              onChange={(e) => setPricePerSeat(e.target.value)}
              placeholder="50"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Prix par kg (EUR)</label>
            <Input
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              placeholder="2,50"
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Notes (facultatif)</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={1000}
          rows={3}
          className="w-full rounded border px-3 py-2 text-sm"
          placeholder="Pas de fumeurs, pas de produits frais, départ devant la gare..."
        />
      </section>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Publication..." : "Publier le trajet"}
      </Button>
    </form>
  )
}
