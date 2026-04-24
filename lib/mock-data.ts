// Données fictives pour le développement.
// Ces données seront remplacées par des appels à la base de données plus tard.

export const mockArticleCategories = [
  { slug: "viata-practica", name: "Viață practică" },
  { slug: "finante", name: "Finanțe" },
  { slug: "afaceri", name: "Afaceri" },
  { slug: "drepturi", name: "Drepturi & Admin" },
  { slug: "cultura", name: "Cultură & Rețete" },
]

export const mockArticles = [
  {
    id: "1",
    title: "Cum să faci o mutuelle în Franța",
    slug: "cum-sa-faci-mutuelle-franta",
    category: "viata-practica",
    excerpt:
      "Ghid complet pentru alegerea unei mutuelle de sănătate în Franța. Ce trebuie să știi, cum să compari ofertele și cum să te înscrii.",
    content: `<p>Mutuelle este o asigurare complementară de sănătate, obligatorie pentru angajații din Franța. Ea completează rambursările Securității Sociale, care acoperă în medie doar 70% din cheltuielile medicale.</p>
<h2>Ce este mutuelle?</h2>
<p>Mutuelle (sau complémentaire santé) este o asigurare privată care acoperă restul cheltuielilor medicale nedecontate de Assurance Maladie. De exemplu, dacă medicul tău taxează 25€ și Securitatea Socială îți rambursează 17€, mutuelle poate acoperi diferența de 8€.</p>
<h2>Cine are dreptul?</h2>
<p>Orice persoană rezidentă în Franța poate încheia o mutuelle. Angajatorii sunt obligați să ofere o mutuelle colectivă angajaților lor. Dacă ești angajat, poți aderara la mutuelle patronale (parțial plătită de angajator) sau să alegi una individuală.</p>
<h2>Cum să alegi?</h2>
<p>Compară ofertele pe site-uri precum <strong>Meilleurtaux</strong> sau <strong>LeLynx</strong>. Verifică nivelul de acoperire pentru:</p>
<ul>
<li>Optică (ochelari, lentile)</li>
<li>Dentară (proteze, aparate)</li>
<li>Spitalizare</li>
<li>Consultații specialiști</li>
</ul>
<h2>Pașii de înregistrare</h2>
<p>1. Alege un nivel de acoperire (de bază, mediu, premium)<br/>2. Completează un formulaire online sau mergi la agenție<br/>3. Furnizează atestatul de Sécurité Sociale (carte vitale)<br/>4. Semnează contractul și plătești prima lună</p>`,
    coverImage: "https://placehold.co/800x450/e2e8f0/475569?text=Mutuelle+FR",
    countries: ["fr"],
    published: true,
    createdAt: new Date("2026-01-15"),
    readingTime: 5,
  },
  {
    id: "2",
    title: "Livretul de economii solidar — la ce servește?",
    slug: "livretul-de-economii-solidar",
    category: "finante",
    excerpt:
      "Totul despre Livret A și Livret de Développement Durable. Cum funcționează, cât poți economisi și care sunt avantajele.",
    content: `<p>Livret A este cel mai popular produs de economii din Franța — simplu, garantat de stat și scutit de impozite. Iată tot ce trebuie să știi.</p>
<h2>Ce este Livret A?</h2>
<p>Este un cont de economii reglementat de stat, disponibil la orice bancă franceză. Dobânda actuală este de 3% pe an (2026), scutită de impozit și de cotizații sociale.</p>
<h2>Plafon</h2>
<p>Poți depune maximum 22.950€ pe un Livret A. Dobânzile câștigate nu se calculează în acest plafon.</p>
<h2>Livret de Développement Durable (LDDS)</h2>
<p>Similar cu Livret A, cu un plafon de 12.000€. Fondurile investite finanțează proiecte de dezvoltare durabilă.</p>
<h2>Cum să deschizi un Livret A</h2>
<p>Mergi la bancă (sau online) cu actul de identitate și justificatif de domiciliu. Poți deschide un singur Livret A per persoană. Minoriii pot și ei deschide, cu acordul părinților.</p>`,
    coverImage: "https://placehold.co/800x450/e2e8f0/475569?text=Livret+A",
    countries: ["fr"],
    published: true,
    createdAt: new Date("2026-02-10"),
    readingTime: 4,
  },
  {
    id: "3",
    title: "Cum să-ți deschizi o afacere în Germania",
    slug: "afacere-in-germania",
    category: "afaceri",
    excerpt:
      "Pașii necesari pentru a deschide o firmă în Germania. Documente, taxe și sfaturi practice pentru antreprenori din diaspora.",
    content: `<p>Germania este una dintre cele mai atractive țări din Europa pentru antreprenori. Procesul de înregistrare este transparent și relativ rapid.</p>
<h2>Tipuri de firme</h2>
<p><strong>Einzelunternehmer (freelancer):</strong> Cea mai simplă formă, fără capital minim. Ideal pentru activități independente.<br/><strong>GmbH (SRL):</strong> Capital minim 25.000€ (din care 12.500€ la înregistrare). Răspundere limitată.<br/><strong>UG (micro-GmbH):</strong> Capital minim 1€. Variantă accesibilă a GmbH.</p>
<h2>Pașii de înregistrare</h2>
<p>1. Alege forma juridică<br/>2. Înregistrează-te la Gewerbeamt (Oficiul Comercial) din orașul tău<br/>3. Deschide un cont bancar de firmă<br/>4. Înregistrează-te la Finanzamt (administrația fiscală)<br/>5. Dacă cifra de afaceri > 22.000€/an, înregistrează TVA</p>
<h2>Costuri</h2>
<p>Înregistrarea la Gewerbeamt costă între 15-65€. Notarul pentru GmbH costă ~1.500-3.000€.</p>`,
    coverImage: "https://placehold.co/800x450/e2e8f0/475569?text=Afacere+DE",
    countries: ["de"],
    published: true,
    createdAt: new Date("2026-03-05"),
    readingTime: 6,
  },
  {
    id: "4",
    title: "Drepturile tale ca angajat în Italia",
    slug: "drepturi-angajat-italia",
    category: "drepturi",
    excerpt:
      "Ce drepturi ai ca angajat în Italia: concediu, salariu minim, protecție socială. Ghid pentru muncitorii din diaspora.",
    content: `<p>Italia oferă o protecție socială solidă pentru angajați. Iată drepturile esențiale pe care trebuie să le cunoști.</p>
<h2>Contractul de muncă</h2>
<p>Orice angajator este obligat să îți ofere un contract scris. Tipuri principale: <strong>contratto a tempo indeterminato</strong> (nedeterminat), <strong>a tempo determinato</strong> (determinat) și <strong>part-time</strong>.</p>
<h2>Salariu și ore</h2>
<p>Nu există un salariu minim legal național, dar fiecare sector are un CCNL (contract colectiv) care stabilește minimul. Programul standard este de 40 ore/săptămână. Orele suplimentare trebuie plătite cu 25-50% majorare.</p>
<h2>Concediu</h2>
<p>Minim 4 săptămâni de concediu plătit pe an. Plus zilele de sărbătoare națională (12 zile/an).</p>
<h2>Protecție socială</h2>
<p>Angajatorul plătește INPS (pensie + asigurări sociale). Ai dreptul la indemnizație de șomaj (NASpI) dacă ești concediat fără vina ta.</p>`,
    coverImage: "https://placehold.co/800x450/e2e8f0/475569?text=Drepturi+IT",
    countries: ["it"],
    published: true,
    createdAt: new Date("2026-03-20"),
    readingTime: 5,
  },
  {
    id: "5",
    title: "Rețete tradiționale moldovenești",
    slug: "retete-traditionale-moldovenesti",
    category: "cultura",
    excerpt:
      "Plăcinte, mămăligă, sarmale — rețetele bunicii adaptate pentru ingredientele disponibile în Europa.",
    content: `<p>Fie că ești nostalgic sau vrei să păstrezi tradiția, aceste rețete adaptate pentru supermarketurile europene îți vor aduce un pic de acasă.</p>
<h2>Plăcinte cu brânză</h2>
<p><strong>Ingrediente:</strong> 500g făină, 250ml apă călduță, 1 plic drojdie, 400g brânză feta (înlocuitor pentru brânza de oi), 2 ouă, sare.</p>
<p>Frământă aluatul și lasă-l să dospească 1 oră. Formează plăcintele, umple cu brânza amestecată cu ou, și coace la 200°C timp de 25 minute.</p>
<h2>Mămăligă</h2>
<p>Fierbe 1L apă cu sare. Adaugă treptat 250g mălai (polenta în Italia, Maisgrieß în Germania) amestecând continuu. Gătește 20-25 minute la foc mic.</p>
<h2>Sarmale</h2>
<p>Folosește frunze de varză murată (în conservă la magazinele românești) sau frunze proaspete opărite. Umplutura: 500g carne tocată, 1 ceapă, 100g orez, mărar, sare, piper. Gătește la foc mic 2-3 ore.</p>`,
    coverImage: "https://placehold.co/800x450/e2e8f0/475569?text=Retete",
    countries: ["fr", "de", "it", "uk"],
    published: true,
    createdAt: new Date("2026-04-01"),
    readingTime: 4,
  },
]

export const mockServiceCategories = [
  { id: "1", name: "Contabil", slug: "contabil", icon: "📊" },
  { id: "2", name: "Avocat / Jurist", slug: "avocat", icon: "⚖️" },
  { id: "3", name: "Magazin românesc", slug: "magazin", icon: "🛒" },
  { id: "4", name: "Traducător", slug: "traducator", icon: "🈯" },
  { id: "5", name: "Livrare", slug: "livrare", icon: "📦" },
  { id: "6", name: "Medic", slug: "medic", icon: "🩺" },
  { id: "7", name: "Frizer / Coafor", slug: "frizer", icon: "💇" },
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

export const mockProductCategories = [
  { slug: "miere", name: "Miere", icon: "🍯" },
  { slug: "vinuri", name: "Vinuri", icon: "🍷" },
  { slug: "dulciuri", name: "Dulciuri & Patiserie", icon: "🥮" },
  { slug: "branzeturi", name: "Brânzeturi", icon: "🧀" },
  { slug: "muraturi", name: "Murături & Conserve", icon: "🥒" },
  { slug: "uleiuri", name: "Uleiuri", icon: "🫒" },
]

export const mockProducers = [
  {
    id: "p1",
    slug: "ferma-codreanu",
    name: "Ferma Codreanu",
    region: "Cahul, Moldova",
    since: 1998,
    shortStory: "Apicultori de 3 generații, cu peste 400 de stupi în sudul Moldovei.",
    story:
      "Familia Codreanu a început apicultura în 1998, cu doar 20 de stupi moșteniți de la bunicul. Astăzi, ferma numără peste 400 de stupi amplasați în livezile de salcâm și câmpurile de floarea-soarelui din raionul Cahul. Mierea este extrasă la rece, fără filtrare industrială.",
    image: "https://placehold.co/800x600/fef3c7/92400e?text=Ferma+Codreanu",
  },
  {
    id: "p2",
    slug: "vinaria-purcari",
    name: "Vinăria Purcari",
    region: "Ștefan Vodă, Moldova",
    since: 1827,
    shortStory: "Una dintre cele mai vechi vinării din Moldova, fondată în 1827.",
    story:
      "Fondată în 1827, Vinăria Purcari a servit vinuri la curtea țarului Nicolae I. Blendurile clasice — Negru de Purcari, Rara Neagră — sunt recunoscute internațional pentru caracterul lor unic, obținut din soiuri autohtone.",
    image: "https://placehold.co/800x600/fecaca/991b1b?text=Vinaria+Purcari",
  },
  {
    id: "p3",
    slug: "dulciuri-moldovenesti",
    name: "Dulciuri Moldovenești",
    region: "Chișinău, Moldova",
    since: 2010,
    shortStory: "Cozonaci și plăcinte tradiționale, făcute manual după rețete de familie.",
    story:
      "Atelierul produce cozonaci și plăcinte după rețete transmise din generație în generație. Totul se face manual, cu ingrediente naturale: unt, ouă de la țară, nuci din Moldova și miere locală.",
    image: "https://placehold.co/800x600/fde68a/854d0e?text=Dulciuri",
  },
  {
    id: "p4",
    slug: "branzeturi-orhei",
    name: "Brânzeturi Orhei",
    region: "Orhei, Moldova",
    since: 2015,
    shortStory: "Brânzeturi artizanale din lapte de oaie și capră, maturate în pivnițele din Orhei.",
    story:
      "Ferma crește 150 de oi și 80 de capre pe pășunile din Codrii Orheiului. Toate brânzeturile sunt maturate natural în pivnițe de piatră calcaroasă. Cașcavalul și brânza de burduf sunt vedetele casei.",
    image: "https://placehold.co/800x600/fef9c3/713f12?text=Branzeturi+Orhei",
  },
  {
    id: "p5",
    slug: "conserve-stauceni",
    name: "Conserve Stăuceni",
    region: "Stăuceni, Moldova",
    since: 2008,
    shortStory: "Murături și conserve de casă, fără conservanți, după rețete de bunică.",
    story:
      "Familia Rotaru face murături de peste 15 ani, folosind legume crescute în propria grădină. Fără conservanți chimici — doar rețeta clasică: sare, oțet, usturoi, mărar.",
    image: "https://placehold.co/800x600/d9f99d/365314?text=Conserve+Stauceni",
  },
  {
    id: "p6",
    slug: "presa-nistru",
    name: "Presă Artizanală Nistru",
    region: "Soroca, Moldova",
    since: 2018,
    shortStory: "Uleiuri presate la rece din semințe crescute pe malurile Nistrului.",
    story:
      "Presa lucrează exclusiv cu semințe cultivate local: floarea-soarelui, nucă, in. Presarea la rece păstrează toate vitaminele și aromele naturale. Fiecare sticlă este îmbuteliată manual.",
    image: "https://placehold.co/800x600/fef3c7/78350f?text=Ulei+Artizanal",
  },
]

export const mockProducts = [
  {
    id: "1",
    producerId: "p1",
    category: "miere",
    sellerName: "Ferma Codreanu",
    name: "Miere de salcâm — 1kg",
    description: "Miere naturală de salcâm din sudul Moldovei. Recoltă 2026.",
    price: 15,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/fef3c7/92400e?text=Miere+Salcam",
    deliveriesTo: ["fr", "de", "it"],
  },
  {
    id: "2",
    producerId: "p1",
    category: "miere",
    sellerName: "Ferma Codreanu",
    name: "Miere de floarea-soarelui — 500g",
    description: "Miere cremoasă, aromă intensă. Recoltă de vară.",
    price: 9,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/fde68a/78350f?text=Miere+FS",
    deliveriesTo: ["fr", "de", "it", "uk"],
  },
  {
    id: "3",
    producerId: "p2",
    category: "vinuri",
    sellerName: "Vinăria Purcari",
    name: "Negru de Purcari 2023",
    description: "Vin roșu sec, blend tradițional moldovenesc. 750ml.",
    price: 18,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/fecaca/991b1b?text=Negru+Purcari",
    deliveriesTo: ["fr", "de", "it", "uk"],
  },
  {
    id: "4",
    producerId: "p2",
    category: "vinuri",
    sellerName: "Vinăria Purcari",
    name: "Rara Neagră 2022",
    description: "Vin roșu sec, soi autohton. Note de fructe negre. 750ml.",
    price: 22,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/fca5a5/7f1d1d?text=Rara+Neagra",
    deliveriesTo: ["fr", "de", "it", "uk"],
  },
  {
    id: "5",
    producerId: "p3",
    category: "dulciuri",
    sellerName: "Dulciuri Moldovenești",
    name: "Cozonac tradițional — 800g",
    description: "Cozonac cu nucă și rahat, rețetă tradițională.",
    price: 18,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/fde68a/854d0e?text=Cozonac",
    deliveriesTo: ["fr", "it", "de"],
  },
  {
    id: "6",
    producerId: "p3",
    category: "dulciuri",
    sellerName: "Dulciuri Moldovenești",
    name: "Plăcinte cu brânză — 6 buc.",
    description: "Plăcinte moldovenești cu brânză de vaci, la cuptor. Congelate.",
    price: 12,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/fef9c3/713f12?text=Placinte",
    deliveriesTo: ["fr", "it"],
  },
  {
    id: "7",
    producerId: "p4",
    category: "branzeturi",
    sellerName: "Brânzeturi Orhei",
    name: "Cașcaval de oaie — 500g",
    description: "Cașcaval maturat 3 luni în pivniță de piatră. Gust intens.",
    price: 16,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/fef9c3/713f12?text=Cascaval",
    deliveriesTo: ["fr", "de"],
  },
  {
    id: "8",
    producerId: "p4",
    category: "branzeturi",
    sellerName: "Brânzeturi Orhei",
    name: "Brânză de burduf — 400g",
    description: "Brânză sărată ambalată în coajă de brad. Specialitate moldovenească.",
    price: 14,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/fef3c7/78350f?text=Burduf",
    deliveriesTo: ["fr", "de", "it"],
  },
  {
    id: "9",
    producerId: "p5",
    category: "muraturi",
    sellerName: "Conserve Stăuceni",
    name: "Castraveți murați — borcan 1L",
    description: "Castraveți murați după rețeta bunicii, cu mărar și usturoi.",
    price: 7,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/d9f99d/365314?text=Castraveti",
    deliveriesTo: ["fr", "de", "it", "uk"],
  },
  {
    id: "10",
    producerId: "p5",
    category: "muraturi",
    sellerName: "Conserve Stăuceni",
    name: "Zacuscă de vinete — 500g",
    description: "Pastă de vinete cu ardei copți. Ideală pe pâine prăjită.",
    price: 6,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/a3a380/3f3f1f?text=Zacusca",
    deliveriesTo: ["fr", "de", "it", "uk"],
  },
  {
    id: "11",
    producerId: "p6",
    category: "uleiuri",
    sellerName: "Presă Artizanală Nistru",
    name: "Ulei de floarea-soarelui — 500ml",
    description: "Ulei presat la rece, nefiltrat. Aromă intensă, culoare aurie.",
    price: 10,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/fef3c7/78350f?text=Ulei+FS",
    deliveriesTo: ["fr", "de"],
  },
  {
    id: "12",
    producerId: "p6",
    category: "uleiuri",
    sellerName: "Presă Artizanală Nistru",
    name: "Ulei de nucă — 250ml",
    description: "Ulei rar și prețios, presat din nuci moldovenești. Ideal în salate.",
    price: 15,
    currency: "EUR" as const,
    image: "https://placehold.co/400x300/d6d3d1/44403c?text=Ulei+Nuca",
    deliveriesTo: ["fr", "de", "it", "uk"],
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
