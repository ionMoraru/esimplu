import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const SYSTEM_USER_EMAIL = "system@esimplu.com"

const categories = [
  { slug: "consulat", name: "Consulat / Ambasadă" },
  { slug: "administratie-publica", name: "Administrație publică" },
  { slug: "urgenta", name: "Urgențe" },
  { slug: "sanatate-publica", name: "Sănătate publică" },
  { slug: "asociatie", name: "Asociații diaspora" },
]

type Service = {
  title: string
  categorySlug: string
  description: string
  languages: string[]
  city: string
  countries: string[]
  phone: string
  email: string
  whatsapp?: string
  photo?: string
}

const services: Service[] = [
  // ============== FRANCE (FR) — 20 ==============
  // Consulats / Ambasade
  {
    title: "Ambasada României în Franța",
    categorySlug: "consulat",
    description:
      "Ambasada României la Paris — secția consulară pentru pașapoarte, certificate, vize, asistență cetățeni români. Programare online obligatorie pe econsulat.ro.",
    languages: ["ro", "fr"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33147051040",
    email: "paris@mae.ro",
    photo:
      "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Consulatul General al României la Marsilia",
    categorySlug: "consulat",
    description:
      "Servicii consulare pentru românii din sudul Franței. Pașapoarte, acte de stare civilă, certificate, asistență juridică. Programare pe econsulat.ro.",
    languages: ["ro", "fr"],
    city: "Marsilia",
    countries: ["fr"],
    phone: "+33491545595",
    email: "marsilia@mae.ro",
  },
  {
    title: "Consulatul General al României la Lyon",
    categorySlug: "consulat",
    description:
      "Consulatul deservește regiunea Auvergne-Rhône-Alpes. Pașapoarte, acte civile, recunoașteri, succesiuni. Programare obligatorie online.",
    languages: ["ro", "fr"],
    city: "Lyon",
    countries: ["fr"],
    phone: "+33478939260",
    email: "lyon@mae.ro",
  },
  {
    title: "Consulatul General al României la Strasbourg",
    categorySlug: "consulat",
    description:
      "Servicii consulare pentru românii din nord-estul Franței. Documente de identitate, vize Schengen pentru rude din afara UE.",
    languages: ["ro", "fr"],
    city: "Strasbourg",
    countries: ["fr"],
    phone: "+33388368860",
    email: "strasbourg@mae.ro",
  },
  {
    title: "Ambasada Republicii Moldova în Franța",
    categorySlug: "consulat",
    description:
      "Ambasada Moldovei la Paris — pașapoarte moldovenești, vize, apostilă, acte notariale, certificate. Singurul consulat Moldova în Franța.",
    languages: ["ro", "ru", "fr"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33140675000",
    email: "paris@mfa.gov.md",
  },
  // Administrație publică
  {
    title: "CPAM — Assurance Maladie",
    categorySlug: "administratie-publica",
    description:
      "Caisse Primaire d'Assurance Maladie — afilierea la sistemul public de sănătate, Carte Vitale, rambursări medicale. Apel gratuit la 3646.",
    languages: ["fr"],
    city: "Național",
    countries: ["fr"],
    phone: "3646",
    email: "contact@ameli.fr",
  },
  {
    title: "CAF — Caisse d'Allocations Familiales",
    categorySlug: "administratie-publica",
    description:
      "Pentru APL (chirie), alocații familiale, RSA, prime de naștere și alte ajutoare sociale. Cerere online pe caf.fr.",
    languages: ["fr"],
    city: "Național",
    countries: ["fr"],
    phone: "3230",
    email: "contact@caf.fr",
  },
  {
    title: "France Travail (fost Pôle Emploi)",
    categorySlug: "administratie-publica",
    description:
      "Înscriere ca șomer, indemnizație de șomaj, oferte de muncă, formare profesională. Pentru românii sosiți cu formular U1 din România.",
    languages: ["fr"],
    city: "Național",
    countries: ["fr"],
    phone: "3949",
    email: "contact@francetravail.fr",
  },
  {
    title: "Allô Service Public — 3939",
    categorySlug: "administratie-publica",
    description:
      "Linie telefonică oficială pentru orice întrebare administrativă: cărți de identitate, viză, fiscal, locuință. Răspuns în 3 minute.",
    languages: ["fr"],
    city: "Național",
    countries: ["fr"],
    phone: "3939",
    email: "contact@service-public.fr",
  },
  {
    title: "Impôts — Service de renseignement",
    categorySlug: "administratie-publica",
    description:
      "Linie telefonică pentru întrebări fiscale: declarație de impozite, prelevare la sursă, rezidență fiscală. Apel local.",
    languages: ["fr"],
    city: "Național",
    countries: ["fr"],
    phone: "0809401401",
    email: "contact@dgfip.finances.gouv.fr",
  },
  {
    title: "ANTS — Titres Sécurisés",
    categorySlug: "administratie-publica",
    description:
      "Agenția Națională a Titlurilor Sigure — pașapoarte, permis de conducere, carte națională identitate. Procedee online pe ants.gouv.fr.",
    languages: ["fr"],
    city: "Național",
    countries: ["fr"],
    phone: "34000",
    email: "contact@ants.gouv.fr",
  },
  {
    title: "URSSAF — Auto-Entrepreneur",
    categorySlug: "administratie-publica",
    description:
      "Pentru cei care vor să se înscrie ca micro-entrepreneur (auto-întreprinzător). Cotizații sociale, declarații, asigurări.",
    languages: ["fr"],
    city: "Național",
    countries: ["fr"],
    phone: "3957",
    email: "contact@urssaf.fr",
  },
  {
    title: "OFII — Office Français de l'Immigration",
    categorySlug: "administratie-publica",
    description:
      "Pentru moldoveni cu viză VLS-TS: validare viză, vizita medicală obligatorie. Cerințe de integrare pentru titlu de ședere.",
    languages: ["fr", "en"],
    city: "Național",
    countries: ["fr"],
    phone: "+33155218390",
    email: "contact@ofii.fr",
  },
  // Urgențe
  {
    title: "SAMU — Urgență medicală 15",
    categorySlug: "urgenta",
    description:
      "Service d'Aide Médicale Urgente — apel pentru urgențe medicale grave. Disponibil 24/7. Apel gratuit din orice telefon, chiar fără carte SIM.",
    languages: ["fr"],
    city: "Național",
    countries: ["fr"],
    phone: "15",
    email: "contact@samu.fr",
  },
  {
    title: "Police-Secours 17",
    categorySlug: "urgenta",
    description:
      "Apel poliția franceză pentru urgențe (agresiune, furt în desfășurare, accident). Disponibil 24/7, gratuit.",
    languages: ["fr"],
    city: "Național",
    countries: ["fr"],
    phone: "17",
    email: "contact@interieur.gouv.fr",
  },
  {
    title: "Pompiers 18",
    categorySlug: "urgenta",
    description:
      "Apel pompieri pentru incendii, accidente, prim ajutor, salvare. Disponibil 24/7, gratuit. Numărul european 112 funcționează și el.",
    languages: ["fr"],
    city: "Național",
    countries: ["fr"],
    phone: "18",
    email: "contact@pompiers.fr",
  },
  {
    title: "Violences Femmes Info — 3919",
    categorySlug: "urgenta",
    description:
      "Linie telefonică gratuită și anonimă pentru femeile victime ale violenței conjugale. Disponibil 24/7. Confidențial, nu apare pe factură.",
    languages: ["fr"],
    city: "Național",
    countries: ["fr"],
    phone: "3919",
    email: "contact@solidaritefemmes.org",
  },
  {
    title: "SOS Médecins",
    categorySlug: "sanatate-publica",
    description:
      "Vizite medicale la domiciliu pentru urgențe non-vitale, în special seara, weekenduri și sărbători. Acoperă majoritatea orașelor mari.",
    languages: ["fr"],
    city: "Național",
    countries: ["fr"],
    phone: "3624",
    email: "contact@sosmedecins-france.fr",
  },
  // Asociații diaspora
  {
    title: "ICR Paris — Institutul Cultural Român",
    categorySlug: "asociatie",
    description:
      "Institutul Cultural Român la Paris — evenimente culturale, cursuri de română, bibliotecă, expoziții. Punct de întâlnire pentru diaspora.",
    languages: ["ro", "fr"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33147051040",
    email: "icr.paris@icr.ro",
  },
  {
    title: "Mission Locale — inserție tineri",
    categorySlug: "administratie-publica",
    description:
      "Pentru tineri 16-25 ani — ajutor în căutare de muncă, formare, locuință. Util pentru tinerii din diaspora la primul loc de muncă în Franța.",
    languages: ["fr"],
    city: "Național",
    countries: ["fr"],
    phone: "0184794070",
    email: "contact@unml.info",
  },
  // ============== GERMANY (DE) — 20 ==============
  // Consulate / Ambasade
  {
    title: "Ambasada României la Berlin",
    categorySlug: "consulat",
    description:
      "Ambasada României în Germania — secția consulară pentru pașapoarte, acte civile, asistență cetățeni români. Programare obligatorie pe econsulat.ro.",
    languages: ["ro", "de"],
    city: "Berlin",
    countries: ["de"],
    phone: "+49302103930",
    email: "berlin@mae.ro",
    photo:
      "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Consulatul General al României la München",
    categorySlug: "consulat",
    description:
      "Consulatul General pentru Bavaria. Pașapoarte, certificate de naștere/căsătorie, recunoașteri, succesiuni. Programare online.",
    languages: ["ro", "de"],
    city: "München",
    countries: ["de"],
    phone: "+498929161930",
    email: "munchen@mae.ro",
  },
  {
    title: "Consulatul General al României la Bonn",
    categorySlug: "consulat",
    description:
      "Consulatul General pentru Renania de Nord-Vestfalia. Acte de stare civilă, pașapoarte, vize Schengen, apostilă pentru documente germane.",
    languages: ["ro", "de"],
    city: "Bonn",
    countries: ["de"],
    phone: "+492281059318",
    email: "bonn@mae.ro",
  },
  {
    title: "Consulatul General al României la Stuttgart",
    categorySlug: "consulat",
    description:
      "Consulatul deservește Baden-Württemberg. Pașapoarte, acte civile, certificate, asistență juridică pentru români din zonă.",
    languages: ["ro", "de"],
    city: "Stuttgart",
    countries: ["de"],
    phone: "+497112621090",
    email: "stuttgart@mae.ro",
  },
  {
    title: "Ambasada Republicii Moldova la Berlin",
    categorySlug: "consulat",
    description:
      "Ambasada Moldovei în Germania — pașapoarte, vize, apostilă, acte notariale. Singura reprezentanță Moldova în Germania.",
    languages: ["ro", "ru", "de"],
    city: "Berlin",
    countries: ["de"],
    phone: "+49302063300",
    email: "berlin@mfa.gov.md",
  },
  // Administrație publică
  {
    title: "Bundeszentralamt für Steuern (Steuer-ID)",
    categorySlug: "administratie-publica",
    description:
      "Pentru obținerea sau confirmarea Steuer-Identifikationsnummer (codul fiscal). Apel pentru întrebări legate de codul fiscal.",
    languages: ["de", "en"],
    city: "Național",
    countries: ["de"],
    phone: "+4922840612400",
    email: "info@bzst.bund.de",
  },
  {
    title: "Familienkasse — Kindergeld",
    categorySlug: "administratie-publica",
    description:
      "Pentru cererile de Kindergeld, Kinderzuschlag, Unterhaltsvorschuss. Cerere online pe arbeitsagentur.de.",
    languages: ["de"],
    city: "Național",
    countries: ["de"],
    phone: "+4980040555530",
    email: "Familienkasse@arbeitsagentur.de",
  },
  {
    title: "Bundesagentur für Arbeit",
    categorySlug: "administratie-publica",
    description:
      "Înscriere ca șomer (Arbeitslosengeld I), oferte de muncă, formare profesională, recunoaștere diplome. Apel gratuit.",
    languages: ["de", "en"],
    city: "Național",
    countries: ["de"],
    phone: "+498004555500",
    email: "info@arbeitsagentur.de",
  },
  {
    title: "BAMF — Bundesamt für Migration",
    categorySlug: "administratie-publica",
    description:
      "Pentru moldoveni: integrare, cursuri de germană finanțate, recunoaștere diplome. Pentru români: programe de cursuri integrare opționale.",
    languages: ["de", "en"],
    city: "Național",
    countries: ["de"],
    phone: "+499119430",
    email: "info@bamf.bund.de",
  },
  {
    title: "Bürgertelefon — 115",
    categorySlug: "administratie-publica",
    description:
      "Numărul oficial pentru întrebări administrative: înregistrare la primărie, taxe, locuință, școală. Răspuns rapid de la birocrați germani.",
    languages: ["de", "en"],
    city: "Național",
    countries: ["de"],
    phone: "115",
    email: "info@115.de",
  },
  {
    title: "Verbraucherzentrale — Protecția consumatorului",
    categorySlug: "administratie-publica",
    description:
      "Sprijin gratuit / cu cost redus în litigii cu furnizori energie, telecom, asigurări, contracte abuzive. 16 birouri pe land.",
    languages: ["de"],
    city: "Național",
    countries: ["de"],
    phone: "+4930258004580",
    email: "info@vzbv.de",
  },
  {
    title: "Mietverein — Asociația chiriașilor",
    categorySlug: "administratie-publica",
    description:
      "Deutscher Mieterbund — sprijin juridic pentru chiriași: probleme cu proprietarul, depozit, evicțiune. Membri plătesc 70-90€/an.",
    languages: ["de"],
    city: "Național",
    countries: ["de"],
    phone: "+4930223230",
    email: "info@mieterbund.de",
  },
  // Urgențe
  {
    title: "Polizei — 110",
    categorySlug: "urgenta",
    description:
      "Apel poliția germană pentru urgențe (agresiune, furt, accident). Disponibil 24/7, gratuit din orice telefon.",
    languages: ["de", "en"],
    city: "Național",
    countries: ["de"],
    phone: "110",
    email: "info@polizei.de",
  },
  {
    title: "Feuerwehr / Rettungsdienst — 112",
    categorySlug: "urgenta",
    description:
      "Apel pompieri și ambulanță pentru urgențe medicale grave, incendii, accidente. Numărul european 112 valabil în toată UE.",
    languages: ["de", "en"],
    city: "Național",
    countries: ["de"],
    phone: "112",
    email: "info@feuerwehr.de",
  },
  {
    title: "Hilfetelefon — Violență împotriva femeilor",
    categorySlug: "urgenta",
    description:
      "Linie telefonică gratuită, anonimă și confidențială pentru femei victime ale violenței. Disponibil 24/7 în 17 limbi (inclusiv română).",
    languages: ["de", "ro", "ru", "en"],
    city: "Național",
    countries: ["de"],
    phone: "+498000116016",
    email: "info@hilfetelefon.de",
  },
  {
    title: "Telefonseelsorge — Linie ajutor psihologic",
    categorySlug: "urgenta",
    description:
      "Linie de ajutor psihologic gratuită și anonimă pentru cei în criză sau cu gânduri suicidale. Disponibil 24/7. Confidențial.",
    languages: ["de"],
    city: "Național",
    countries: ["de"],
    phone: "+498001110111",
    email: "info@telefonseelsorge.de",
  },
  {
    title: "Giftnotruf — Intoxicații",
    categorySlug: "urgenta",
    description:
      "Linie pentru intoxicații (medicamente, plante, produse chimice). Răspuns medical specializat 24/7. Numere diferite per land.",
    languages: ["de"],
    city: "Berlin",
    countries: ["de"],
    phone: "+4930192240",
    email: "giftnotruf@charite.de",
  },
  // Sănătate
  {
    title: "Ärztlicher Bereitschaftsdienst — 116 117",
    categorySlug: "sanatate-publica",
    description:
      "Linie pentru îngrijiri medicale non-urgente seara, weekend, sărbători când GP-ul este închis. Trimite medic la domiciliu sau redirecționează.",
    languages: ["de", "en"],
    city: "Național",
    countries: ["de"],
    phone: "116117",
    email: "info@kbv.de",
  },
  // Asociații
  {
    title: "Caritas Deutschland — Migranten",
    categorySlug: "asociatie",
    description:
      "Sprijin gratuit pentru migranți: orientare, traduceri, asistență juridică, ajutor social. Birouri în fiecare oraș mare.",
    languages: ["de", "ro", "en"],
    city: "Național",
    countries: ["de"],
    phone: "+49761200445",
    email: "info@caritas.de",
  },
  {
    title: "ICR Berlin — Institutul Cultural Român",
    categorySlug: "asociatie",
    description:
      "Institutul Cultural Român la Berlin — cursuri de română, evenimente culturale, bibliotecă, programe pentru copii. Inima diasporei.",
    languages: ["ro", "de"],
    city: "Berlin",
    countries: ["de"],
    phone: "+49303100798",
    email: "icr.berlin@icr.ro",
  },
  // ============== ITALY (IT) — 20 ==============
  // Consolati / Ambasciate
  {
    title: "Ambasada României la Roma",
    categorySlug: "consulat",
    description:
      "Ambasada României în Italia — secția consulară pentru pașapoarte, certificate, vize. Programare obligatorie pe econsulat.ro.",
    languages: ["ro", "it"],
    city: "Roma",
    countries: ["it"],
    phone: "+390684273611",
    email: "roma@mae.ro",
    photo:
      "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Consulatul General al României la Milano",
    categorySlug: "consulat",
    description:
      "Consulatul General pentru nordul Italiei. Pașapoarte, acte civile, recunoașteri, asistență juridică. Cea mai mare circumscripție din Italia.",
    languages: ["ro", "it"],
    city: "Milano",
    countries: ["it"],
    phone: "+390267100848",
    email: "milano@mae.ro",
  },
  {
    title: "Consulatul General al României la Torino",
    categorySlug: "consulat",
    description:
      "Servicii consulare pentru Piemonte, Liguria, Valle d'Aosta. Pașapoarte, acte civile, succesiuni. Programare online obligatorie.",
    languages: ["ro", "it"],
    city: "Torino",
    countries: ["it"],
    phone: "+390116691146",
    email: "torino@mae.ro",
  },
  {
    title: "Consulatul General al României la Bologna",
    categorySlug: "consulat",
    description:
      "Consulatul deservește Emilia-Romagna și Marche. Acte de stare civilă, pașapoarte, vize, asistență cetățeni români.",
    languages: ["ro", "it"],
    city: "Bologna",
    countries: ["it"],
    phone: "+390519918454",
    email: "bologna@mae.ro",
  },
  {
    title: "Consulatul General al României la Trieste",
    categorySlug: "consulat",
    description:
      "Servicii consulare pentru Friuli-Venezia Giulia, Veneto. Acte civile, pașapoarte, succesiuni, recunoașteri.",
    languages: ["ro", "it"],
    city: "Trieste",
    countries: ["it"],
    phone: "+390406723125",
    email: "trieste@mae.ro",
  },
  {
    title: "Consulatul General al României la Bari",
    categorySlug: "consulat",
    description:
      "Consulatul pentru Apulia, Basilicata, Calabria. Pașapoarte, acte civile, asistență consulară pentru românii din sudul Italiei.",
    languages: ["ro", "it"],
    city: "Bari",
    countries: ["it"],
    phone: "+390805210410",
    email: "bari@mae.ro",
  },
  {
    title: "Ambasada Republicii Moldova la Roma",
    categorySlug: "consulat",
    description:
      "Ambasada Moldovei în Italia — pașapoarte moldovenești, vize, apostilă, acte notariale, certificate. Una dintre cele mai mari diaspore moldovenești.",
    languages: ["ro", "ru", "it"],
    city: "Roma",
    countries: ["it"],
    phone: "+390636309022",
    email: "roma@mfa.gov.md",
  },
  // Amministrazione pubblica
  {
    title: "Agenzia delle Entrate — Codice Fiscale",
    categorySlug: "administratie-publica",
    description:
      "Pentru obținerea Codice Fiscale, dichiarazione redditi, F24, Tessera Sanitaria. Linie telefonică oficială.",
    languages: ["it", "en"],
    city: "Național",
    countries: ["it"],
    phone: "800909696",
    email: "info@agenziaentrate.it",
  },
  {
    title: "INPS — Istituto Nazionale Previdenza Sociale",
    categorySlug: "administratie-publica",
    description:
      "Pentru Assegno Unico, pensii, șomaj (NASpI), maternitate, Bonus Asilo Nido. Cerere online pe inps.it.",
    languages: ["it"],
    city: "Național",
    countries: ["it"],
    phone: "803164",
    email: "info@inps.it",
  },
  {
    title: "Centro per l'Impiego",
    categorySlug: "administratie-publica",
    description:
      "Înscriere ca șomer, oferte de muncă, programe de formare, ajutor pentru CV. Birouri în fiecare provincie.",
    languages: ["it"],
    city: "Național",
    countries: ["it"],
    phone: "+390655684900",
    email: "info@anpal.gov.it",
  },
  {
    title: "Sportello Unico Immigrazione",
    categorySlug: "administratie-publica",
    description:
      "Pentru moldoveni: cereri Permesso di Soggiorno, Decreto Flussi, ricongiungimento familiar. Birou în fiecare prefectură (Prefettura).",
    languages: ["it", "en"],
    city: "Național",
    countries: ["it"],
    phone: "+39064651",
    email: "info@interno.gov.it",
  },
  {
    title: "Comune — Anagrafe",
    categorySlug: "administratie-publica",
    description:
      "Înregistrarea residenței la primărie. Pas obligatoriu pentru Tessera Sanitaria, contract de muncă, școală. Programare la primăria locală.",
    languages: ["it"],
    city: "Național",
    countries: ["it"],
    phone: "060606",
    email: "anagrafe@comune.roma.it",
  },
  {
    title: "Patronato CAF / ACLI",
    categorySlug: "administratie-publica",
    description:
      "Patronat sindical care oferă asistență gratuită: ISEE, declarații, pensii, indemnizații. Foarte util pentru muncitori migranți.",
    languages: ["it", "ro"],
    city: "Național",
    countries: ["it"],
    phone: "+39065840121",
    email: "info@acli.it",
  },
  // Emergenze
  {
    title: "Carabinieri — 112",
    categorySlug: "urgenta",
    description:
      "Numărul european de urgență, în Italia răspunde Carabinieri. Pentru poliție, urgențe, accident. 24/7, gratuit.",
    languages: ["it", "en"],
    city: "Național",
    countries: ["it"],
    phone: "112",
    email: "info@carabinieri.it",
  },
  {
    title: "Polizia di Stato — 113",
    categorySlug: "urgenta",
    description:
      "Apel poliția italiană pentru urgențe (agresiune, furt în desfășurare). Disponibil 24/7, gratuit.",
    languages: ["it"],
    city: "Național",
    countries: ["it"],
    phone: "113",
    email: "info@poliziadistato.it",
  },
  {
    title: "Vigili del Fuoco — 115",
    categorySlug: "urgenta",
    description:
      "Apel pompieri pentru incendii, accidente, salvare. Disponibil 24/7, gratuit din orice telefon.",
    languages: ["it"],
    city: "Național",
    countries: ["it"],
    phone: "115",
    email: "info@vigilfuoco.it",
  },
  {
    title: "Soccorso Sanitario — 118",
    categorySlug: "urgenta",
    description:
      "Apel ambulanță pentru urgențe medicale grave (infarct, accident, naștere). 24/7, gratuit. 112 funcționează și el.",
    languages: ["it"],
    city: "Național",
    countries: ["it"],
    phone: "118",
    email: "info@salute.gov.it",
  },
  {
    title: "1522 — Antiviolență și Stalking",
    categorySlug: "urgenta",
    description:
      "Linie gratuită și anonimă pentru femei victime ale violenței conjugale sau stalking. Disponibil 24/7. Confidențial.",
    languages: ["it"],
    city: "Național",
    countries: ["it"],
    phone: "1522",
    email: "info@1522.it",
  },
  // Asociații
  {
    title: "Caritas Italiana — Migranti",
    categorySlug: "asociatie",
    description:
      "Sprijin gratuit pentru migranți: orientare, ajutor alimentar, asistență juridică, locuințe de urgență. Birouri în toate diocezele.",
    languages: ["it", "ro"],
    city: "Național",
    countries: ["it"],
    phone: "+390666177001",
    email: "segreteria@caritas.it",
  },
  {
    title: "Accademia di Romania — Roma",
    categorySlug: "asociatie",
    description:
      "Institutul Cultural Român la Roma — bibliotecă, expoziții, concerte, cursuri de română. Cea mai veche academie de stat român în străinătate (din 1922).",
    languages: ["ro", "it"],
    city: "Roma",
    countries: ["it"],
    phone: "+390632086845",
    email: "icr.roma@icr.ro",
  },
  // ============== UNITED KINGDOM (UK) — 20 ==============
  // Embassies / Consulates
  {
    title: "Embassy of Romania — London",
    categorySlug: "consulat",
    description:
      "Ambasada României la Londra — secția consulară pentru pașapoarte, acte civile, certificate, asistență cetățeni români. Programare pe econsulat.ro.",
    languages: ["ro", "en"],
    city: "Londra",
    countries: ["uk"],
    phone: "+442079378125",
    email: "londra@mae.ro",
    photo:
      "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Romanian Consulate Manchester",
    categorySlug: "consulat",
    description:
      "Consulatul General al României la Manchester — deservește nordul Angliei și Scoția. Pașapoarte, acte civile, certificate.",
    languages: ["ro", "en"],
    city: "Manchester",
    countries: ["uk"],
    phone: "+441617050000",
    email: "manchester@mae.ro",
  },
  {
    title: "Romanian Consulate Edinburgh",
    categorySlug: "consulat",
    description:
      "Consulatul Onorific al României la Edinburgh — pentru românii din Scoția. Asistență consulară de bază, certificate.",
    languages: ["ro", "en"],
    city: "Edinburgh",
    countries: ["uk"],
    phone: "+441312202345",
    email: "edinburgh@mae.ro",
  },
  {
    title: "Embassy of Republic of Moldova — London",
    categorySlug: "consulat",
    description:
      "Ambasada Moldovei în UK — pașapoarte moldovenești, vize, apostilă, acte notariale. Singura reprezentanță Moldova în Marea Britanie.",
    languages: ["ro", "ru", "en"],
    city: "Londra",
    countries: ["uk"],
    phone: "+442075842775",
    email: "london@mfa.gov.md",
  },
  // Public administration
  {
    title: "HMRC — Income Tax Helpline",
    categorySlug: "administratie-publica",
    description:
      "Linie telefonică pentru întrebări fiscale: PAYE, tax codes, refunds, Self-Assessment. Luni-Vineri 8-18, Sâmbătă 8-16.",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "+443002003300",
    email: "contact@hmrc.gov.uk",
  },
  {
    title: "HMRC — Self-Assessment",
    categorySlug: "administratie-publica",
    description:
      "Linie dedicată pentru Self-Assessment: înregistrare UTR, declarație online, plata impozitelor. Pentru self-employed și landlords.",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "+443002003310",
    email: "self-assessment@hmrc.gov.uk",
  },
  {
    title: "DWP — Universal Credit Helpline",
    categorySlug: "administratie-publica",
    description:
      "Pentru cereri și întrebări Universal Credit: cont online, plăți, condiții. Luni-Vineri 8-18.",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "+448003285644",
    email: "uc@dwp.gov.uk",
  },
  {
    title: "Home Office — UKVI Visa & Immigration",
    categorySlug: "administratie-publica",
    description:
      "Pentru întrebări despre vize, BRP, eVisa, Settled Status. Important pentru moldoveni cu Skilled Worker, Student, Family visa.",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "+443001232241",
    email: "ukvi@homeoffice.gov.uk",
  },
  {
    title: "EU Settlement Scheme Resolution Centre",
    categorySlug: "administratie-publica",
    description:
      "Pentru românii cu Pre-Settled / Settled Status: probleme cu aplicare, conversie, trecerea la Settled după 5 ani.",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "+443001237379",
    email: "euss@homeoffice.gov.uk",
  },
  {
    title: "DVLA — Driving Licence",
    categorySlug: "administratie-publica",
    description:
      "Pentru schimbul permisului român/moldovenesc cu permis britanic, examen teorie/practic, întrebări licență.",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "+443007900101",
    email: "drivers@dvla.gov.uk",
  },
  {
    title: "ACAS — Drepturi muncă",
    categorySlug: "administratie-publica",
    description:
      "Sprijin gratuit pentru disputele angajator-angajat: salariu nedatat, concediere abuzivă, contract abuziv, hărțuire.",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "+443001231100",
    email: "info@acas.org.uk",
  },
  {
    title: "Citizens Advice — Sfat gratuit",
    categorySlug: "administratie-publica",
    description:
      "Consiliere gratuită pe orice problemă legală sau administrativă: locuință, datorii, beneficii, drepturi muncă, imigrare. Birouri în toată țara.",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "+448001448848",
    email: "info@citizensadvice.org.uk",
  },
  // Health
  {
    title: "NHS 111 — Sfat medical non-urgent",
    categorySlug: "sanatate-publica",
    description:
      "Sfat medical 24/7 când nu e o urgență vitală. Te direcționează către GP, A&E sau farmacie. Apel gratuit de pe orice telefon.",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "111",
    email: "info@nhs.uk",
  },
  // Emergencies
  {
    title: "Emergency Services — 999",
    categorySlug: "urgenta",
    description:
      "Apel pentru urgențe vitale: poliție, pompieri, ambulanță. Disponibil 24/7, gratuit din orice telefon. Pentru non-urgent: 101 (poliție) sau 111 (medical).",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "999",
    email: "info@gov.uk",
  },
  {
    title: "Police Non-Emergency — 101",
    categorySlug: "urgenta",
    description:
      "Pentru raportarea unui delict deja comis (furt, vandalizare) sau întrebări non-urgente. Apel cu cost mic.",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "101",
    email: "info@police.uk",
  },
  {
    title: "National Domestic Abuse Helpline",
    categorySlug: "urgenta",
    description:
      "Linie gratuită 24/7 pentru victime ale violenței domestice. Confidențial, nu apare pe factură. Operat de Refuge.",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "+448082000247",
    email: "info@refuge.org.uk",
  },
  {
    title: "Samaritans — Linie ajutor psihologic",
    categorySlug: "urgenta",
    description:
      "Linie gratuită 24/7 pentru cei în criză sau cu gânduri suicidale. Confidențial și anonim. Apel sau email.",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "116123",
    email: "jo@samaritans.org",
  },
  // Charities / Asociații
  {
    title: "Shelter — Drepturi locative",
    categorySlug: "asociatie",
    description:
      "ONG britanic pentru drepturile chiriașilor și fără adăpost. Sprijin gratuit pentru evicție, depozit, condiții insalubre. Recomandat de gov.uk.",
    languages: ["en"],
    city: "Național",
    countries: ["uk"],
    phone: "+448088004444",
    email: "info@shelter.org.uk",
  },
  {
    title: "Romanian Cultural Institute London",
    categorySlug: "asociatie",
    description:
      "Institutul Cultural Român la Londra — evenimente culturale, cursuri de română, bibliotecă, programe pentru copii. Inima diasporei UK.",
    languages: ["ro", "en"],
    city: "Londra",
    countries: ["uk"],
    phone: "+442077520134",
    email: "icr.london@icr.ro",
  },
  {
    title: "Migrants Rights Network",
    categorySlug: "asociatie",
    description:
      "ONG britanic pentru drepturile migranților. Asistență juridică, advocacy, ghiduri pentru noi sosiți, grupuri de sprijin.",
    languages: ["en", "ro"],
    city: "Național",
    countries: ["uk"],
    phone: "+442079527414",
    email: "info@migrantsrights.org.uk",
  },
]

async function main() {
  console.log("🌱 Setting up system user...")
  const systemUser = await prisma.user.upsert({
    where: { email: SYSTEM_USER_EMAIL },
    update: { role: "ADMIN", name: "eSimplu Officials" },
    create: {
      email: SYSTEM_USER_EMAIL,
      name: "eSimplu Officials",
      role: "ADMIN",
    },
  })

  console.log("🌱 Seeding service categories...")
  for (const cat of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    })
  }

  console.log(`🌱 Seeding ${services.length} services...`)
  for (const s of services) {
    const category = await prisma.serviceCategory.findUnique({
      where: { slug: s.categorySlug },
    })
    if (!category) {
      console.warn(`⚠️  Category ${s.categorySlug} not found, skipping ${s.title}`)
      continue
    }

    const existing = await prisma.serviceListing.findFirst({
      where: { title: s.title, countries: { hasSome: s.countries } },
    })

    const data = {
      userId: systemUser.id,
      title: s.title,
      categoryId: category.id,
      description: s.description,
      languages: s.languages,
      city: s.city,
      countries: s.countries,
      phone: s.phone,
      email: s.email,
      whatsapp: s.whatsapp ?? null,
      photo: s.photo ?? null,
      status: "PUBLISHED" as const,
    }

    if (existing) {
      await prisma.serviceListing.update({ where: { id: existing.id }, data })
    } else {
      await prisma.serviceListing.create({ data })
    }
  }

  const count = await prisma.serviceListing.count()
  console.log(`✅ Done. ${count} services in DB.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
