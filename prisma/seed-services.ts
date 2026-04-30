import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const SYSTEM_USER_EMAIL = "system@esimplu.com"

const categories = [
  { slug: "magazin", name: "Magazin românesc / moldovenesc" },
  { slug: "frizer", name: "Frizer / Coafor / Unghii" },
  { slug: "transport", name: "Transport pasageri" },
  { slug: "livrare", name: "Livrare colete" },
  { slug: "mutari-transport", name: "Mutări & Transport" },
  { slug: "restaurant", name: "Restaurant" },
  { slug: "traducator", name: "Traducător autorizat" },
  { slug: "contabil", name: "Contabil" },
  { slug: "avocat", name: "Avocat / Jurist" },
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
  // ============== FRANCE (FR) ==============
  {
    title: "Epicerie Roumaine Miorita",
    categorySlug: "magazin",
    description:
      "Lanț familial de magazine românești deschis din 2009 în regiunea pariziană, cu cinci puncte de lucru. Mezeluri, brânzeturi, pâine, dulciuri și vinuri aduse direct din România, într-o atmosferă primitoare.",
    languages: ["ro", "fr"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33986325826",
    email: "epicerie.roumaine@hotmail.fr",
  },
  {
    title: "Pe Gustul Nostru",
    categorySlug: "magazin",
    description:
      "Mică epicerie tradițională românească în inima cartierului Grenelle, condusă de o familie de români. Telemea, mititei, sarmale congelate, dulciuri și vin românesc atent selectate.",
    languages: ["ro", "fr"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33667348914",
    email: "",
  },
  {
    title: "Chez Maria — Epicerie Fine Roumaine",
    categorySlug: "magazin",
    description:
      "Epicerie fină cu specific românesc în arondismentul 20, cunoscută pentru calitatea produselor și serviciul de catering cu rețete tradiționale. Zacuscă, mezeluri, condimente.",
    languages: ["ro", "fr"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33970352702",
    email: "",
  },
  {
    title: "Epicerie Roumaine Nicolae — Maramures",
    categorySlug: "magazin",
    description:
      "Magazin românesc independent în Cartierul Latin, cu produse aduse din Maramureș și din toată țara. Afumături, brânzeturi de oaie, dulciuri și băuturi tradiționale.",
    languages: ["ro", "fr"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33623651358",
    email: "",
  },
  {
    title: "L'Utile — Magazin Romanesc Lyon",
    categorySlug: "magazin",
    description:
      "Cel mai cunoscut magazin românesc din Lyon, situat pe malul Saônei în arondismentul 9. Mezeluri, brânzeturi, conserve, mititei, condimente și vinuri românești la preț excelent.",
    languages: ["ro", "fr"],
    city: "Lyon",
    countries: ["fr"],
    phone: "+33426557200",
    email: "",
  },
  {
    title: "Bunătăți de Acasă",
    categorySlug: "magazin",
    description:
      "Colțișor de România în inima Bretaniei, deschis de o familie de români în Pontivy. Livrează în Loudéac, Rennes și Morlaix mezeluri, brânzeturi, dulciuri și băuturi tradiționale.",
    languages: ["ro", "fr"],
    city: "Pontivy",
    countries: ["fr"],
    phone: "+33688606395",
    email: "",
  },
  {
    title: "Alimentation Balkanique",
    categorySlug: "magazin",
    description:
      "Mică băcănie cu specific balcanic și românesc în centrul Toulouse, deschisă în 2017. Produse românești, bulgărești și est-europene, de la afumături la dulciuri și băuturi.",
    languages: ["ro", "fr"],
    city: "Toulouse",
    countries: ["fr"],
    phone: "+33620640089",
    email: "",
  },
  {
    title: "DVIN — Épicerie Roumaine",
    categorySlug: "magazin",
    description:
      "Magazin cu produse românești și armenești în Villefranche-sur-Saône, lângă Lyon. Mezeluri, conserve, băuturi, dulciuri și produse tradiționale.",
    languages: ["ro", "fr"],
    city: "Villefranche-sur-Saône",
    countries: ["fr"],
    phone: "+33482839299",
    email: "epicerie-dvin@hotmail.com",
  },
  {
    title: "Romina Chiriac — Nail Designer",
    categorySlug: "frizer",
    description:
      "Romina Chiriac este referința pariziană pentru manichiura rusească, formată din 2015 și formator profesionist din 2018. Salon în arondismentul 11: manichiură, pedichiură, nail art.",
    languages: ["ro", "fr", "en"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33613768040",
    email: "contact@rcnaildesigner.com",
  },
  {
    title: "Color and Cut",
    categorySlug: "frizer",
    description:
      "Salon de coafură intim și profesionist în Saint-Mandé, condus de Cristina și Ana. Tunsori, vopsit, șuvițe, balayage și tratamente tehnice cu produse L'Oréal Professionnel.",
    languages: ["ro", "fr"],
    city: "Saint-Mandé",
    countries: ["fr"],
    phone: "+33148084467",
    email: "",
  },
  {
    title: "Atlassib Franța — Paris",
    categorySlug: "transport",
    description:
      "Una dintre cele mai vechi companii de transport pasageri și colete între Franța și România, cu birou în Paris și agenții în Lyon, Bordeaux. Curse regulate spre principalele orașe din România.",
    languages: ["ro", "fr"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33144746690",
    email: "",
  },
  {
    title: "Eurolines Paris",
    categorySlug: "transport",
    description:
      "Birou Eurolines în centrul Parisului, cu legături de autocar zilnice spre România prin rețeaua europeană. Plecări pentru pasageri și colete spre București, Cluj, Timișoara.",
    languages: ["fr", "ro", "en"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33143541199",
    email: "",
  },
  {
    title: "AlexaTrans",
    categorySlug: "transport",
    description:
      "Companie românească de transport persoane și colete pe ruta România-Paris, cu plecări săptămânale și livrare directă la adresă. Activează din 2004, transportă și autoturisme pe platforme.",
    languages: ["ro", "fr"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33632430551",
    email: "alexa.trans@yahoo.com",
  },
  {
    title: "Romfour Transport Internațional",
    categorySlug: "livrare",
    description:
      "Transportator românesc cu peste 20 de ani de experiență, curse regulate spre Paris, Lyon, Marseille, Reims. Livrare la adresă în 3-7 zile lucrătoare, plus transport pasageri.",
    languages: ["ro", "fr", "en"],
    city: "Paris",
    countries: ["fr"],
    phone: "+40374557200",
    email: "colete.romania@romfour-tur.ro",
  },
  {
    title: "Restaurant Doina",
    categorySlug: "restaurant",
    description:
      "Instituție a comunității românești din Paris, deschis din 1983, la câțiva pași de Turnul Eiffel. Sarmale cu mămăligă, mititei și una dintre cele mai mari selecții de vinuri românești din Europa.",
    languages: ["ro", "fr", "en"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33145504957",
    email: "restaurantdoina@gmail.com",
  },
  {
    title: "Restaurant Le 76",
    categorySlug: "restaurant",
    description:
      "Singurul restaurant românesc din Lyon, situat pe rue Paul Bert. Bucătărie tradițională, primire călduroasă, atmosferă de bistrou — sarmale, ciorbă de burtă, mititei și papanași.",
    languages: ["ro", "fr"],
    city: "Lyon",
    countries: ["fr"],
    phone: "+33669018558",
    email: "",
  },
  {
    title: "Moldova Restaurant Bar",
    categorySlug: "restaurant",
    description:
      "Restaurant moldovenesc în Mérignac, lângă Bordeaux, cu specialități tradiționale și atmosferă familială. Locul de întâlnire al comunității moldoveni și români din regiune.",
    languages: ["ro", "ru", "fr"],
    city: "Mérignac",
    countries: ["fr"],
    phone: "+33554786685",
    email: "",
  },
  {
    title: "SRM — Société de Restauration Moldave",
    categorySlug: "restaurant",
    description:
      "Restaurant moldovenesc în Villemomble, condus de Ștefan Ghețivu. Bucătărie moldovenească, pizzeria, brasserie și vânzări la pachet — preferatul diasporei din nord-estul Parisului.",
    languages: ["ro", "ru", "fr"],
    city: "Villemomble",
    countries: ["fr"],
    phone: "+33148949714",
    email: "",
  },
  {
    title: "Maria Goraș-Răduleț — Traducător Autorizat",
    categorySlug: "traducator",
    description:
      "Traducătoare și interpretă autorizată pe lângă Curtea de Apel Paris pentru limba română, master în Litere și specializare în traducere juridică. Traduceri certificate pentru acte oficiale.",
    languages: ["ro", "fr"],
    city: "Montgeron",
    countries: ["fr"],
    phone: "+33685366003",
    email: "",
  },
  {
    title: "Carmen Toniță-Ciornea — Traducător Autorizat",
    categorySlug: "traducator",
    description:
      "Traducătoare și interpretă autorizată pe lângă Curtea de Apel Paris, diplomă INALCO și specializare în traducere juridică. Traduceri rapide pentru documente oficiale RO-FR și FR-RO.",
    languages: ["ro", "fr"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33644797649",
    email: "",
  },
  {
    title: "FLH Expertise — Florentina Cocoș",
    categorySlug: "contabil",
    description:
      "Cabinet de expertiză contabilă fondat în 2013 de Florentina Cocoș, înscrisă în Ordinul din Île-de-France și CECCAR București. Specializat în micro-întreprinderi și optimizare fiscală.",
    languages: ["ro", "fr", "en"],
    city: "Villiers-sur-Marne",
    countries: ["fr"],
    phone: "+33148815335",
    email: "contact@flh-expertise.com",
  },
  {
    title: "Cabinet Avocat Geanina Munteanu Millet",
    categorySlug: "avocat",
    description:
      "Avocat la Baroul Paris și Baroul București din 1999, specializată în drept francez și românesc, drept de afaceri, drept penal și dreptul familiei. Vorbește 6 limbi.",
    languages: ["ro", "fr", "en"],
    city: "Paris",
    countries: ["fr"],
    phone: "+33142665945",
    email: "",
  },

  // ============== GERMANY (DE) ==============
  {
    title: "Magazin Românesc La Neamțu",
    categorySlug: "magazin",
    description:
      "Băcănie românească mică în cartierul Wedding, deținută de o familie din România. Mezeluri, brânzeturi, conserve, dulciuri și pâine adusă din țară.",
    languages: ["ro", "de"],
    city: "Berlin",
    countries: ["de"],
    phone: "+491727783407",
    email: "",
  },
  {
    title: "Magazin Românesc La Bebe Caraian",
    categorySlug: "magazin",
    description:
      "Magazin românesc independent pe Sonnenallee, în inima cartierului Neukölln. Produse tradiționale românești, mezeluri proaspete și mămăligă pe loc.",
    languages: ["ro", "de"],
    city: "Berlin",
    countries: ["de"],
    phone: "+4915209898812",
    email: "samuelcaraian@yahoo.com",
  },
  {
    title: "Magazin Românesc Oltenia (Laim)",
    categorySlug: "magazin",
    description:
      "Magazin românesc deținut de o familie din Oltenia, în cartierul Laim din München. Specializat în brânzeturi, telemea, mezeluri și vinuri românești.",
    languages: ["ro", "de"],
    city: "München",
    countries: ["de"],
    phone: "+4917680779723",
    email: "",
  },
  {
    title: "La Nea Ion — Băcănie Românească",
    categorySlug: "magazin",
    description:
      "Băcănie românească tradițională în Frankfurt-Bornheim. Are și mic colț de bistro cu mici și sarmale la pachet.",
    languages: ["ro", "de"],
    city: "Frankfurt am Main",
    countries: ["de"],
    phone: "+49694980094",
    email: "",
  },
  {
    title: "Schuster Markt",
    categorySlug: "magazin",
    description:
      "Magazin românesc independent în nord-vestul Stuttgart-ului, cu accent pe produse din Banat și Transilvania. Mezeluri proaspete, brânzeturi și produse de panificație.",
    languages: ["ro", "de"],
    city: "Stuttgart",
    countries: ["de"],
    phone: "+4915150238999",
    email: "",
  },
  {
    title: "RoMarkt — Rumänische Feinkost",
    categorySlug: "magazin",
    description:
      "Magazin de delicatese românești lângă Stuttgart. Specializat în vinuri, carne proaspătă, mezeluri (mici, cârnați), brânzeturi și specialități tradiționale.",
    languages: ["ro", "de"],
    city: "Kirchheim unter Teck",
    countries: ["de"],
    phone: "+4970218660884",
    email: "info@romarkt.de",
  },
  {
    title: "Stefani Feinkost",
    categorySlug: "magazin",
    description:
      "Magazin de specialități transilvănene în regiunea Ludwigsburg. Mici, cârnați, brânzeturi (telemea, brânză de burduf), zacuscă, cozonaci, țuică și vinuri.",
    languages: ["ro", "de"],
    city: "Ludwigsburg",
    countries: ["de"],
    phone: "+4971412982359",
    email: "info@stefani-feinkost.de",
  },
  {
    title: "Feinkost Maurer (Măcelărie)",
    categorySlug: "magazin",
    description:
      "Măcelărie și delicatese românești în Nürnberg. Specialități bănățene și transilvănene: mici, cârnați cu usturoi, costiță afumată. Servicii de catering.",
    languages: ["ro", "de"],
    city: "Nürnberg",
    countries: ["de"],
    phone: "+499116426099",
    email: "info@feinkost-maurer.de",
  },
  {
    title: "Studio4U Nagelstudio",
    categorySlug: "frizer",
    description:
      "Salon de unghii din Berlin-Friedrichshain unde se vorbește română, rusă și germană. Specializat în Russian manicure, gel și nail art.",
    languages: ["ro", "de", "ru"],
    city: "Berlin",
    countries: ["de"],
    phone: "+4917631588982",
    email: "",
  },
  {
    title: "Beauty Zone Berlin by Silvia C.",
    categorySlug: "frizer",
    description:
      "Salon de coafură deținut de Silvia C., româncă stabilită în Charlottenburg. Tunsori, vopsit, balayage și styling, cu programări online prin Treatwell.",
    languages: ["ro", "de"],
    city: "Berlin",
    countries: ["de"],
    phone: "+493031801212",
    email: "",
  },
  {
    title: "Cut121 Berlin",
    categorySlug: "frizer",
    description:
      "Salon de coafură în Berlin-Mitte unde se vorbește română, alături de germană, engleză, slovacă și turcă. Tunsori precise, vopsit și styling modern.",
    languages: ["ro", "de", "en"],
    city: "Berlin",
    countries: ["de"],
    phone: "+493028878828",
    email: "",
  },
  {
    title: "Mary Rom Nails",
    categorySlug: "frizer",
    description:
      "Salon de manichiură deținut de o tehniciană româncă în München-Milbertshofen. Specializat în unghii cu gel, nail art și pedichiură.",
    languages: ["ro", "de"],
    city: "München",
    countries: ["de"],
    phone: "+4915258948869",
    email: "",
  },
  {
    title: "Coafor HAGEN Germania",
    categorySlug: "frizer",
    description:
      "Coafeză româncă în Hagen care oferă servicii la salon și la domiciliu, la prețuri accesibile pentru comunitatea românească din zona Ruhr.",
    languages: ["ro", "de"],
    city: "Hagen",
    countries: ["de"],
    phone: "+4915218866094",
    email: "",
  },
  {
    title: "Atlassib — Agenția Berlin",
    categorySlug: "transport",
    description:
      "Agenția Berlin a companiei Atlassib, unul dintre cei mai mari operatori de autocar pe ruta România-Germania. Bilete călătorii și expediere colete.",
    languages: ["ro", "de"],
    city: "Berlin",
    countries: ["de"],
    phone: "+493031984567",
    email: "informatii@atlassib.ro",
  },
  {
    title: "Atlassib — Agenția Stuttgart",
    categorySlug: "transport",
    description:
      "Birou Atlassib în Stuttgart pentru bilete autocar și serviciu de coletărie spre România. Plecări regulate, deschis și sâmbăta și duminica dimineața.",
    languages: ["ro", "de"],
    city: "Stuttgart",
    countries: ["de"],
    phone: "+4971125663510",
    email: "germania.stuttgart@atlassib.ro",
  },
  {
    title: "Atlassib — Agenția Frankfurt",
    categorySlug: "transport",
    description:
      "Agenția Atlassib din Frankfurt, mutată recent pe Baseler Platz, lângă gara centrală. Vânzare bilete autocar și expediere colete în România.",
    languages: ["ro", "de"],
    city: "Frankfurt am Main",
    countries: ["de"],
    phone: "+4969269578990",
    email: "germania.frankfurt@atlassib.ro",
  },
  {
    title: "Romfour — Rezervări Germania",
    categorySlug: "livrare",
    description:
      "Operator românesc de transport persoane și colete cu autocare și microbuze între România și Germania. Curse zilnice către Berlin, München, Frankfurt, Hamburg, ridicare la adresă.",
    languages: ["ro", "de"],
    city: "Berlin",
    countries: ["de"],
    phone: "+4932214219791",
    email: "",
  },
  {
    title: "Restaurant Românesc La Radu (Kantine zum Nussbaum)",
    categorySlug: "restaurant",
    description:
      "Restaurant tradițional românesc pe Sonnenallee, în Neukölln. Sarmale, mititei, ciorbă de burtă și alte specialități, atmosferă de cantină familială.",
    languages: ["ro", "de"],
    city: "Berlin",
    countries: ["de"],
    phone: "+493034627764",
    email: "",
  },
  {
    title: "Restaurant Românesc Pschorr-Krug",
    categorySlug: "restaurant",
    description:
      "Restaurant românesc cu peste 30 ani de activitate în München-Sendling. Bucătărie tradițională (mici, sarmale, ciorbe), bucătărie internațională și bavareză.",
    languages: ["ro", "de"],
    city: "München",
    countries: ["de"],
    phone: "+4989763805",
    email: "pschorrkrugistrate@yahoo.com",
  },
  {
    title: "Bukarest Restaurant Krefeld",
    categorySlug: "restaurant",
    description:
      "Restaurant cu specific românesc în Krefeld. Meniu bogat de bucătărie tradițională românească și băuturi specifice. Organizează nunți, botezuri și evenimente private.",
    languages: ["ro", "de"],
    city: "Krefeld",
    countries: ["de"],
    phone: "+4921517839159",
    email: "contact@bukarest-restaurant.de",
  },
  {
    title: "Ramona Worm — Traducător Autorizat",
    categorySlug: "traducator",
    description:
      "Traducător și interpret autorizat română-germană în Berlin. Acte oficiale, certificate, traduceri legalizate pentru autorități germane și românești.",
    languages: ["ro", "de"],
    city: "Berlin",
    countries: ["de"],
    phone: "+493031802624",
    email: "info@deutsch-romana.com",
  },
  {
    title: "Kanzlei Patsch — Avocat România-Germania",
    categorySlug: "avocat",
    description:
      "Cabinet de avocatură în Frankfurt cu serviciu în limba română. Specializat în drept penal; consultanță și reprezentare pentru români din diaspora.",
    languages: ["ro", "de"],
    city: "Frankfurt am Main",
    countries: ["de"],
    phone: "+4969428937010",
    email: "patsch@kanzlei-patsch.de",
  },
  {
    title: "Alina Toderoiu — Birou Contabilitate",
    categorySlug: "contabil",
    description:
      "Birou de contabilitate și servicii de secretariat în München, cu administratoare româncă. Contabilitate primară, salarizare și declarații pentru PFA și firme mici.",
    languages: ["ro", "de"],
    city: "München",
    countries: ["de"],
    phone: "+4915901193219",
    email: "info@at-buchhaltungsbuero.de",
  },

  // ============== ITALY (IT) ==============
  {
    title: "Dacia Romana",
    categorySlug: "magazin",
    description:
      "Măcelărie și mic supermarket românesc cu două puncte în Roma. Mezeluri, brânzeturi, conserve, dulciuri și preparate gata. Comunitate românească consolidată din 2007.",
    languages: ["it", "ro"],
    city: "Roma",
    countries: ["it"],
    phone: "+390661901505",
    email: "dacia_romana2007@yahoo.com",
  },
  {
    title: "EtnoMarket Anagnina",
    categorySlug: "magazin",
    description:
      "Magazin alimentar românesc în zona Anagnina (Roma), cu măcelărie proprie. Produse aduse direct din România: mezeluri, brânzeturi, dulciuri, băuturi.",
    languages: ["it", "ro"],
    city: "Roma",
    countries: ["it"],
    phone: "+390679342055",
    email: "",
  },
  {
    title: "Made in Ro — Magazin Românesc",
    categorySlug: "magazin",
    description:
      "Magazin alimentar tradițional românesc în Padova, cu produse din România, Moldova și Polonia. Lactate, mezeluri, legume și specialități importate săptămânal.",
    languages: ["it", "ro"],
    city: "Padova",
    countries: ["it"],
    phone: "+393533984561",
    email: "",
  },
  {
    title: "AMMA SRL — Negozio Rumeno",
    categorySlug: "magazin",
    description:
      "Magazin etnic specializat în produse tipice românești, în Pianoro lângă Bologna. Gamă largă de mezeluri, brânzeturi, dulciuri și conserve aduse din România.",
    languages: ["it", "ro"],
    city: "Pianoro (BO)",
    countries: ["it"],
    phone: "+393473996315",
    email: "",
  },
  {
    title: "La Bobita — Magazin Românesc",
    categorySlug: "magazin",
    description:
      "Magazin alimentar românesc cu vechime în Codigoro. Produse autentice românești: alimente proaspete, congelate, băuturi, panificație. Livrare gratuită peste 90€ pe rază 30 km.",
    languages: ["it", "ro"],
    city: "Codigoro (FE)",
    countries: ["it"],
    phone: "+393533855594",
    email: "negoziorumeno.codigoro@gmail.com",
  },
  {
    title: "Alimentari Moldova M&G",
    categorySlug: "magazin",
    description:
      "Magazin moldovenesc-românesc din Brescia, specializat în produse tipice est-europene din Moldova, România, Ucraina și Polonia. Punct de referință pentru comunitatea moldovenească.",
    languages: ["it", "ro", "ru"],
    city: "Brescia",
    countries: ["it"],
    phone: "+393515580800",
    email: "",
  },
  {
    title: "Casa Chiritoiu",
    categorySlug: "magazin",
    description:
      "Măcelărie și magazin alimentar românesc în inima Torino. Mezeluri afumate, cârnați aromatizați, jamboane și produse pentru mici, de calitate.",
    languages: ["ro", "it"],
    city: "Torino",
    countries: ["it"],
    phone: "+39011192250 78",
    email: "casachiritoiu@gmail.com",
  },
  {
    title: "Negozio Rumeno Panetteria Aretusa",
    categorySlug: "magazin",
    description:
      "Brutărie și magazin românesc în zona Lambrate (Milano). Pâine proaspătă, plăcinte, mezeluri, brânzeturi și legume aduse din România.",
    languages: ["ro", "it"],
    city: "Milano",
    countries: ["it"],
    phone: "+390239440091",
    email: "panetteriaaretusa@gmail.com",
  },
  {
    title: "Salon Ramona Parrucchiera",
    categorySlug: "frizer",
    description:
      "Salon de coafură unisex deținut de Ramona Crivat, originară din România, în San Martino Buon Albergo (Verona). Tunsori, vopsit, tratamente capilare. Vorbește română.",
    languages: ["it", "ro"],
    city: "San Martino Buon Albergo (VR)",
    countries: ["it"],
    phone: "+393291015930",
    email: "ramona.crivat1@gmail.com",
  },
  {
    title: "Atlassib Italia — Roma Tiburtina",
    categorySlug: "transport",
    description:
      "Agenție Atlassib în zona Tiburtina (Roma), cea mai mare comunitate de români din Italia. Bilete pentru autocare zilnice către aproape toate orașele din România.",
    languages: ["it", "ro"],
    city: "Roma",
    countries: ["it"],
    phone: "+393298368411",
    email: "",
  },
  {
    title: "Atlassib Italia — Brescia",
    categorySlug: "transport",
    description:
      "Filiala Atlassib din Brescia, deservind comunitatea românească din Lombardia. Bilete autocar Italia-România, transport persoane și colete săptămânal.",
    languages: ["it", "ro"],
    city: "Brescia",
    countries: ["it"],
    phone: "+390303759156",
    email: "",
  },
  {
    title: "Tabita Tour — Agenția Torino",
    categorySlug: "transport",
    description:
      "Agenție de transport persoane și colete între România și Italia, cu sediu în Torino. Curse zilnice cu autocare și microbuze, livrare colete la domiciliu.",
    languages: ["it", "ro"],
    city: "Torino",
    countries: ["it"],
    phone: "+393278450976",
    email: "",
  },
  {
    title: "373 Fratelli Tour — Moldova-Italia",
    categorySlug: "transport",
    description:
      "Transport pasageri și colete Moldova-Italia, în activitate din 2009. Curse regulate către principalele orașe italiene unde trăiește diaspora moldovenească.",
    languages: ["it", "ro", "ru"],
    city: "Italia (curse multiple)",
    countries: ["it"],
    phone: "+393287593528",
    email: "",
  },
  {
    title: "Italia.md — Transport Moldova-Italia",
    categorySlug: "livrare",
    description:
      "Operator de transport persoane și colete pe ruta Chișinău-Roma-Napoli-Agropoli. Predare și ridicare colete la domiciliu, plecări săptămânale.",
    languages: ["ro", "ru", "it"],
    city: "Roma / Napoli",
    countries: ["it"],
    phone: "+37369125830",
    email: "",
  },
  {
    title: "Ristorante Moldova",
    categorySlug: "restaurant",
    description:
      "Primul restaurant românesc deschis la Milano, în Piazzale Governo Provvisorio. Sarmale, mici, ciorbe, mămăligă și deserturi clasice. Atmosferă liniștită, popular în comunitate.",
    languages: ["it", "ro"],
    city: "Milano",
    countries: ["it"],
    phone: "+39022613124",
    email: "",
  },
  {
    title: "Ristorante Romeno Bistrot",
    categorySlug: "restaurant",
    description:
      "Restaurant românesc autentic în cartierul Primavalle din nordul Romei. Sarmale, mici, ciorbă de burtă și preparate la grătar. Locul de referință pentru românii care vor să mănânce „ca acasă\".",
    languages: ["it", "ro"],
    city: "Roma",
    countries: ["it"],
    phone: "+390631051250",
    email: "",
  },
  {
    title: "Restaurant Românesc Tipico",
    categorySlug: "restaurant",
    description:
      "Restaurant românesc în Campi Bisenzio, lângă Florența, deschis vinerea, sâmbăta și duminica seara. Meniu tradițional cu mici, sarmale, ciorbe și deserturi românești.",
    languages: ["it", "ro"],
    city: "Campi Bisenzio (FI)",
    countries: ["it"],
    phone: "+393284520425",
    email: "",
  },
  {
    title: "Studio Legale Paolo Dall'Ara",
    categorySlug: "avocat",
    description:
      "Cabinet de avocatură în Padova și Mestre (Veneția) cu consultanță și asistență juridică în limba română. Drept de familie, civil, penal, MEA, contracte. Se deplasează în România/Moldova.",
    languages: ["it", "ro", "en"],
    city: "Padova / Venezia Mestre",
    countries: ["it"],
    phone: "+390492051190",
    email: "paolo.dallara.studio@gmail.com",
  },
  {
    title: "Traduttore Rumeno — Perito del Tribunale",
    categorySlug: "traducator",
    description:
      "Traducător autorizat româno-italian, înscris la Albo Periti Esperti del Tribunale (Torino). Traduceri jurate pentru cetățenie italiană, consulat, rezidență, apostilă, contracte.",
    languages: ["it", "ro"],
    city: "Torino (toată Italia)",
    countries: ["it"],
    phone: "+393294059504",
    email: "traduttoredirumeno@gmail.com",
  },

  // ============== UNITED KINGDOM (UK) ==============
  {
    title: "Magazin Românesc Mary's Shop Ilford",
    categorySlug: "magazin",
    description:
      "Magazin tradițional românesc în Ilford, cu cărmangerie proprie, patiserie și cofetărie românească. Produse importate direct din România pentru diaspora din estul Londrei.",
    languages: ["ro", "en"],
    city: "London (Ilford)",
    countries: ["uk"],
    phone: "+442089118313",
    email: "",
  },
  {
    title: "Casa Romaneasca Edmonton",
    categorySlug: "magazin",
    description:
      "Magazin și restaurant românesc în Edmonton, lângă Edmonton Green. Produse alimentare tradiționale, mezeluri, brânzeturi și preparate calde pentru comunitatea din nordul Londrei.",
    languages: ["ro", "en"],
    city: "London (Edmonton)",
    countries: ["uk"],
    phone: "+442088075421",
    email: "",
  },
  {
    title: "Bucharest Wembley (Five Star Provisions)",
    categorySlug: "magazin",
    description:
      "Magazin tradițional românesc în Wembley, cu produse importate din România: mezeluri, brânzeturi, dulciuri și băuturi. Listat în directorul Consulatului General al României la Londra.",
    languages: ["ro", "en"],
    city: "London (Wembley)",
    countries: ["uk"],
    phone: "+447545338793",
    email: "",
  },
  {
    title: "POE Ltd — Romanian Food Cash & Carry",
    categorySlug: "magazin",
    description:
      "Magazin și cash & carry românesc cu sediu în Birmingham, specializat în produse alimentare românești și est-europene. Distribuie en-gros și cu amănuntul.",
    languages: ["ro", "en"],
    city: "Birmingham",
    countries: ["uk"],
    phone: "+441213289186",
    email: "",
  },
  {
    title: "Magazin Românesc Prăjitura Casei Manchester",
    categorySlug: "magazin",
    description:
      "Hipermarket românesc în Manchester, cu o gamă largă de produse proaspete și tradiționale la prețuri accesibile. Aprovizionează comunitatea din Greater Manchester și nord-vest.",
    languages: ["ro", "en"],
    city: "Manchester",
    countries: ["uk"],
    phone: "+441618796174",
    email: "Prajituracaseimanchester@yahoo.com",
  },
  {
    title: "Magazin Românesc Leeds",
    categorySlug: "magazin",
    description:
      "Primul magazin cu produse 100% românești din Yorkshire. Livrare la domiciliu în raza de 10 mile de Leeds și produse tradiționale: mezeluri, brânzeturi, conserve, dulciuri.",
    languages: ["ro", "en"],
    city: "Leeds",
    countries: ["uk"],
    phone: "+447922053886",
    email: "marinelastoian68@gmail.com",
  },
  {
    title: "Magazin Românesc Georgiana Luton",
    categorySlug: "magazin",
    description:
      "Magazin tradițional românesc în Luton, cu mezeluri, brânzeturi, carne proaspătă pentru grătar, vinuri și patiserie românească. Servește comunitatea din Bedfordshire.",
    languages: ["ro", "en"],
    city: "Luton",
    countries: ["uk"],
    phone: "+447909157919",
    email: "",
  },
  {
    title: "Colț de Rai Magazin Românesc Slough",
    categorySlug: "magazin",
    description:
      "Magazin alimentar și cărmangerie românească în centrul Slough-ului. Mezeluri, brânzeturi, dulciuri și băuturi importate pentru comunitatea românească din Berkshire.",
    languages: ["ro", "en"],
    city: "Slough",
    countries: ["uk"],
    phone: "+447553640875",
    email: "Info@coltderai.co.uk",
  },
  {
    title: "Andreea Style Hair Salon",
    categorySlug: "frizer",
    description:
      "Salon de coafură și frizerie deschis în 2017 în Cricklewood, deservind în special comunitățile românească, ucraineană și rusească. Tunsori, vopsit și epilare facială cu personal vorbitor de română.",
    languages: ["ro", "en", "ru"],
    city: "London (Cricklewood)",
    countries: ["uk"],
    phone: "+442084528000",
    email: "",
  },
  {
    title: "Beauty Salon Romania Colindale",
    categorySlug: "frizer",
    description:
      "Salon de înfrumusețare românesc lângă stația Colindale, cu servicii complete de coafură, manichiură-pedichiură și cosmetică. Pentru comunitatea românească din nord-vestul Londrei.",
    languages: ["ro", "en"],
    city: "London (Colindale)",
    countries: ["uk"],
    phone: "+442082009006",
    email: "",
  },
  {
    title: "Salon Anka Hair & Beauty",
    categorySlug: "frizer",
    description:
      "Salon de coafură și înfrumusețare condus de Anca Elena Fanaru, cu echipă profesionistă vorbitoare de română. Tuns, vopsit, manichiură, pedichiură și tratamente cosmetice în Morden.",
    languages: ["ro", "en"],
    city: "London (Morden)",
    countries: ["uk"],
    phone: "+447553626984",
    email: "ancafanaru@yahoo.com",
  },
  {
    title: "BEAUTÉ Hair & Beauty Enfield",
    categorySlug: "frizer",
    description:
      "Salon unisex multi-etnic în Enfield, cu echipă din Marea Britanie, Africa și Europa de Est. Personalul vorbește fluent română și engleză și oferă servicii păr, unghii și piele.",
    languages: ["ro", "en"],
    city: "London (Enfield)",
    countries: ["uk"],
    phone: "+442083638400",
    email: "",
  },
  {
    title: "Anca's Beauty Salon Smethwick",
    categorySlug: "frizer",
    description:
      "Salon românesc unisex în Smethwick (Birmingham), cu servicii de tuns, coafat, vopsit și cosmetică. Deservește comunitatea românească din West Midlands.",
    languages: ["ro", "en"],
    city: "Birmingham (Smethwick)",
    countries: ["uk"],
    phone: "+447824805193",
    email: "contact@frizeriecoafurasmethwick.co.uk",
  },
  {
    title: "Eastlines Ltd",
    categorySlug: "livrare",
    description:
      "Companie românească de coletărie și transport între UK, România și Europa de Est, cu peste 85.000 de clienți. Sediu în Harrow, serviciu door-to-door în 3-6 zile lucrătoare.",
    languages: ["ro", "en"],
    city: "London (Harrow)",
    countries: ["uk"],
    phone: "+442082004420",
    email: "contact@eastlines.co.uk",
  },
  {
    title: "ADT Trans Ltd",
    categorySlug: "transport",
    description:
      "Transport rapid de persoane și colete între Anglia și România, plecări săptămânale și livrare în 2-5 zile. Tarife pentru pasageri de la £170 cu 50kg bagaj inclus.",
    languages: ["ro", "en"],
    city: "Leigh (UK base)",
    countries: ["uk"],
    phone: "+447384045470",
    email: "",
  },
  {
    title: "WirSpedition Courier — Anglia",
    categorySlug: "livrare",
    description:
      "Curierat internațional România-Anglia cu tarife competitive de la £1.25/kg și livrare în 3-5 zile lucrătoare. Acoperă toată România și Marea Britanie cu serviciu door-to-door.",
    languages: ["ro", "en"],
    city: "London",
    countries: ["uk"],
    phone: "+447867972550",
    email: "",
  },
  {
    title: "Crespo Com Courier",
    categorySlug: "livrare",
    description:
      "Serviciu de curierat rapid și fiabil pe ruta România-Anglia, cu acoperire 100% în România. Sediu în UK pentru preluarea coletelor de la diaspora românească.",
    languages: ["ro", "en"],
    city: "London",
    countries: ["uk"],
    phone: "+447787806751",
    email: "",
  },
  {
    title: "Restaurant Mariuca",
    categorySlug: "restaurant",
    description:
      "Restaurant românesc în Borehamwood, lângă Londra. Bucătărie tradițională autentică cu atmosferă de fine dining. Serviciu la masă, livrare și ridicare comenzi.",
    languages: ["ro", "en"],
    city: "London (Borehamwood)",
    countries: ["uk"],
    phone: "+442082074953",
    email: "info@mariuca.co.uk",
  },
  {
    title: "La Masa Restaurant Românesc",
    categorySlug: "restaurant",
    description:
      "Restaurant românesc în Barking, atmosferă caldă și meniu tradițional: ciorbe, grătare (miel, porc, pui, iepure, vită) și muzică românească. Rezervări și comenzi online.",
    languages: ["ro", "en"],
    city: "London (Barking)",
    countries: ["uk"],
    phone: "+442085949687",
    email: "tgr.tgt@googlemail.com",
  },
  {
    title: "Casa Bucovineana Edgware",
    categorySlug: "restaurant",
    description:
      "Restaurant tradițional bucovinean în Edgware, nordul Londrei. Mâncare românească autentică — ciorbe, sarmale, grătare — într-un cadru familial pentru diaspora din zona HA8.",
    languages: ["ro", "en"],
    city: "London (Edgware)",
    countries: ["uk"],
    phone: "+442089522136",
    email: "",
  },
  {
    title: "RoTranslate — Mihaela Amariutei",
    categorySlug: "traducator",
    description:
      "Traducător autorizat de Ministerul Justiției din România, membru MCIL și MITI. Traduceri certificate, interpretariat și consultanță RO-EN-FR — documente acceptate de Consulat.",
    languages: ["ro", "en", "fr"],
    city: "London (Sutton, Surrey)",
    countries: ["uk"],
    phone: "+447851977707",
    email: "contact@rotranslate.com",
  },
  {
    title: "Contabili Români UK (DNS Accountants)",
    categorySlug: "contabil",
    description:
      "Firmă de contabilitate autorizată cu peste 4000 de clienți români în UK. Servicii complete: înființare LTD, bookkeeping, CIS, payroll, self-employment, VAT și planificare fiscală.",
    languages: ["ro", "en"],
    city: "London (Kenton/Harrow)",
    countries: ["uk"],
    phone: "+443300887912",
    email: "info@contabiliromani.co.uk",
  },
]

async function main() {
  console.log("🌱 Setting up system user...")
  const systemUser = await prisma.user.upsert({
    where: { email: SYSTEM_USER_EMAIL },
    update: { role: "ADMIN", name: "eSimplu Directory" },
    create: {
      email: SYSTEM_USER_EMAIL,
      name: "eSimplu Directory",
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
      status: "PENDING" as const,
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
