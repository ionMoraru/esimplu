"use client"

import { useEffect, useState } from "react"

const slides = [
  {
    gradient: "from-[#1b4332] via-[#2D6A4F] to-[#40916C]",
    label: "Franța",
  },
  {
    gradient: "from-[#1b4332] via-[#2d6a4f] to-[#74c69d]",
    label: "Germania",
  },
  {
    gradient: "from-[#7f4f24] via-[#b5631a] to-[#F4A261]",
    label: "Italia",
  },
  {
    gradient: "from-[#1b4332] via-[#2D6A4F] to-[#52b788]",
    label: "Marea Britanie",
  },
]

export function HeroSlider({ children }: { children: React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Background slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.label}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay pour lisibilité du texte */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenu */}
      <div className="relative z-10 text-white">
        {children}
      </div>

      {/* Indicateurs (petits points) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((slide, index) => (
          <button
            key={slide.label}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
