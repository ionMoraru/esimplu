// Données fictives pour le développement.
// Ces données seront remplacées par des appels à la base de données plus tard.

export const mockArticles = [
  {
    id: "1",
    title: "Cum să faci o mutuelle în Franța",
    slug: "cum-sa-faci-mutuelle-franta",
    excerpt:
      "Ghid complet pentru alegerea unei mutuelle de sănătate în Franța. Ce trebuie să știi, cum să compari ofertele și cum să te înscrii.",
    coverImage: "https://placehold.co/600x400/e2e8f0/475569?text=Mutuelle",
    countries: ["fr"],
    published: true,
    createdAt: new Date("2026-01-15"),
  },
  {
    id: "2",
    title: "Livretul de economii solidar — la ce servește?",
    slug: "livretul-de-economii-solidar",
    excerpt:
      "Totul despre Livret A și Livret de Développement Durable. Cum funcționează, cât poți economisi și care sunt avantajele.",
    coverImage: "https://placehold.co/600x400/e2e8f0/475569?text=Livret",
    countries: ["fr"],
    published: true,
    createdAt: new Date("2026-02-10"),
  },
  {
    id: "3",
    title: "Cum să-ți deschizi o afacere în Germania",
    slug: "afacere-in-germania",
    excerpt:
      "Pașii necesari pentru a deschide o firmă în Germania. Documente, taxe și sfaturi practice pentru antreprenori din diaspora.",
    coverImage: "https://placehold.co/600x400/e2e8f0/475569?text=Afacere+DE",
    countries: ["de"],
    published: true,
    createdAt: new Date("2026-03-05"),
  },
  {
    id: "4",
    title: "Drepturile tale ca angajat în Italia",
    slug: "drepturi-angajat-italia",
    excerpt:
      "Ce drepturi ai ca angajat în Italia: concediu, salariu minim, protecție socială. Ghid pentru muncitorii din diaspora.",
    coverImage: "https://placehold.co/600x400/e2e8f0/475569?text=Drepturi+IT",
    countries: ["it"],
    published: true,
    createdAt: new Date("2026-03-20"),
  },
  {
    id: "5",
    title: "Rețete tradiționale moldovenești",
    slug: "retete-traditionale-moldovenesti",
    excerpt:
      "Plăcinte, mămăligă, sarmale — rețetele bunicii adaptate pentru ingredientele disponibile în Europa.",
    coverImage: "https://placehold.co/600x400/e2e8f0/475569?text=Retete",
    countries: ["fr", "de", "it", "uk"],
    published: true,
    createdAt: new Date("2026-04-01"),
  },
]

export const mockServiceCategories = [
  { id: "1", name: "Contabil", slug: "contabil" },
  { id: "2", name: "Avocat / Jurist", slug: "avocat" },
  { id: "3", name: "Magazin românesc", slug: "magazin" },
  { id: "4", name: "Traducător", slug: "traducator" },
  { id: "5", name: "Livrare", slug: "livrare" },
  { id: "6", name: "Medic", slug: "medic" },
  { id: "7", name: "Frizer / Coafor", slug: "frizer" },
]

export const mockServices = [
  {
    id: "1",
    title: "Cabinet Contabil Popescu",
    category: "contabil",
    description:
      "Servicii de contabilitate pentru persoane fizice și firme. Declarații fiscale, TVA, salarii. Vorbim română și franceză.",
    languages: ["ro", "fr"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33 6 12 34 56 78",
    email: "contact@popescu-compta.fr",
    status: "PUBLISHED" as const,
  },
  {
    id: "2",
    title: "Magazin Moldova — Produse tradiționale",
    category: "magazin",
    description:
      "Produse alimentare din Moldova și România: brânză, mezeluri, dulcețuri, vin. Livrare în toată Franța.",
    languages: ["ro", "ru", "fr"],
    city: "Lyon",
    countries: ["fr"],
    phone: "+33 7 98 76 54 32",
    email: "info@moldova-shop.fr",
    status: "PUBLISHED" as const,
  },
  {
    id: "3",
    title: "Traduceri Oficiale — Maria Ionescu",
    category: "traducator",
    description:
      "Traduceri autorizate română-franceză-germană. Acte de stare civilă, diplome, contracte. Apostilă și legalizare.",
    languages: ["ro", "fr", "de"],
    city: "Berlin",
    countries: ["fr", "de"],
    phone: "+49 170 123 4567",
    email: "maria.traduceri@gmail.com",
    status: "PUBLISHED" as const,
  },
  {
    id: "4",
    title: "Avvocato Dragomir — Studio Legale",
    category: "avocat",
    description:
      "Avvocato specializat în drept al muncii și imigrare în Italia. Consultații în limba română.",
    languages: ["ro", "it"],
    city: "Milano",
    countries: ["it"],
    phone: "+39 02 1234 5678",
    email: "dragomir.avvocato@pec.it",
    status: "PUBLISHED" as const,
  },
  {
    id: "5",
    title: "Transport Moldova-Franța — Ion Delivery",
    category: "livrare",
    description:
      "Transport de colete și persoane Moldova ↔ Franța. Plecări săptămânale din Paris și Chișinău.",
    languages: ["ro", "ru", "fr"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33 6 11 22 33 44",
    email: "ion.delivery@gmail.com",
    status: "PUBLISHED" as const,
  },
]

export const mockProducts = [
  {
    id: "1",
    sellerName: "Ferma Codreanu",
    name: "Miere de salcâm — 1kg",
    description: "Miere naturală de salcâm din sudul Moldovei. Recoltă 2026.",
    price: 15,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/fef3c7/92400e?text=Miere",
    deliveriesTo: ["fr", "de"],
  },
  {
    id: "2",
    sellerName: "Vinăria Purcari",
    name: "Negru de Purcari 2023",
    description: "Vin roșu sec, blend tradițional moldovenesc. 750ml.",
    price: 12,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/fecaca/991b1b?text=Vin",
    deliveriesTo: ["fr", "de", "it", "uk"],
  },
  {
    id: "3",
    sellerName: "Dulciuri Moldovenești",
    name: "Cozonac tradițional — 800g",
    description: "Cozonac cu nucă și rahat, rețetă tradițională.",
    price: 18,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/fde68a/854d0e?text=Cozonac",
    deliveriesTo: ["fr", "it"],
  },
]

export const mockTrips = [
  {
    id: "1",
    carrierName: "Ion Transport",
    origin: { city: "Paris", country: "Franța" },
    destination: { city: "Chișinău", country: "Moldova" },
    departureDate: new Date("2026-05-01"),
    arrivalDate: new Date("2026-05-03"),
    availableCapacity: 150,
    pricePerKg: 3,
    currency: "EUR" as const,
    status: "open" as const,
  },
  {
    id: "2",
    carrierName: "MoldoExpress",
    origin: { city: "Berlin", country: "Germania" },
    destination: { city: "Bălți", country: "Moldova" },
    departureDate: new Date("2026-05-05"),
    arrivalDate: new Date("2026-05-07"),
    availableCapacity: 80,
    pricePerKg: 4,
    currency: "EUR" as const,
    status: "open" as const,
  },
  {
    id: "3",
    carrierName: "EuroTrans MD",
    origin: { city: "Milano", country: "Italia" },
    destination: { city: "Chișinău", country: "Moldova" },
    departureDate: new Date("2026-05-10"),
    arrivalDate: new Date("2026-05-12"),
    availableCapacity: 200,
    pricePerKg: 2.5,
    currency: "EUR" as const,
    status: "open" as const,
  },
]
