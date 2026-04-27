"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { COUNTRIES } from "@/lib/countries"

export interface ProductFormInitial {
  id?: string
  name: string
  description: string
  imageUrl: string
  priceEur: string
  stock: string
  countriesAvailable: string[]
  category: string
  isPublished: boolean
}

interface Props {
  initial: ProductFormInitial
  mode: "create" | "edit"
}

export function ProductForm({ initial, mode }: Props) {
  const [name, setName] = useState(initial.name)
  const [description, setDescription] = useState(initial.description)
  const [imageUrl, setImageUrl] = useState(initial.imageUrl)
  const [priceEur, setPriceEur] = useState(initial.priceEur)
  const [stock, setStock] = useState(initial.stock)
  const [countries, setCountries] = useState<string[]>(initial.countriesAvailable)
  const [category, setCategory] = useState(initial.category)
  const [isPublished, setIsPublished] = useState(initial.isPublished)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function toggleCountry(code: string) {
    setCountries((curr) => (curr.includes(code) ? curr.filter((c) => c !== code) : [...curr, code]))
  }

  function priceCentsFromInput(value: string): number {
    const normalized = value.replace(",", ".").trim()
    const num = Number.parseFloat(normalized)
    if (Number.isNaN(num)) throw new Error("Le prix doit être un nombre")
    return Math.round(num * 100)
  }

  function submit() {
    setError(null)
    let priceCents: number
    try {
      priceCents = priceCentsFromInput(priceEur)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prix invalide")
      return
    }
    const stockNum = Number.parseInt(stock, 10)
    if (Number.isNaN(stockNum) || stockNum < 0) {
      setError("Le stock doit être un entier ≥ 0")
      return
    }
    if (countries.length === 0) {
      setError("Sélectionnez au moins un pays")
      return
    }

    const body = {
      name,
      description,
      imageUrl: imageUrl.trim() || null,
      priceCents,
      stock: stockNum,
      countriesAvailable: countries,
      category: category.trim() || null,
      isPublished,
    }

    const url = mode === "create" ? "/api/seller/products" : `/api/seller/products/${initial.id}`
    const method = mode === "create" ? "POST" : "PATCH"

    startTransition(async () => {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = (await res.json()) as { error?: string; product?: { id: string } }
      if (!res.ok) {
        setError(json.error ?? "Erreur inconnue")
        return
      }
      router.push("/dashboard/seller")
      router.refresh()
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Nom du produit</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">URL de l&apos;image (externe)</label>
        <Input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prix (EUR)</label>
          <Input value={priceEur} onChange={(e) => setPriceEur(e.target.value)} required placeholder="12,50" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <Input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Catégorie (libre)</label>
        <Input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="ferme, viande, artisanat..."
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium mb-1">Pays de livraison</legend>
        <div className="flex gap-3 flex-wrap">
          {COUNTRIES.map((c) => (
            <label key={c.code} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={countries.includes(c.code)}
                onChange={() => toggleCountry(c.code)}
              />
              {c.flag} {c.name}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        Publier (visible sur la marketplace)
      </label>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement..." : mode === "create" ? "Créer le produit" : "Enregistrer"}
        </Button>
      </div>
    </form>
  )
}
