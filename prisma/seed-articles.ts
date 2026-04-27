import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const categories = [
  { slug: "viata-practica", name: "Viață practică" },
  { slug: "finante", name: "Finanțe" },
  { slug: "drepturi", name: "Drepturi & Admin" },
  { slug: "afaceri", name: "Afaceri" },
  { slug: "cultura", name: "Cultură & Rețete" },
]

const articles: Array<{
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  categorySlug: string
  countries: string[]
  readingTime: number
}> = [
  {
    slug: "mutuelle-sanatate-franta-2026",
    title: "Mutuelle de sănătate în Franța — ghid complet 2026",
    excerpt:
      "Cum funcționează asigurarea complementară de sănătate în Franța, cum o alegi și ce acoperă în 2026.",
    coverImage:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "viata-practica",
    countries: ["fr"],
    readingTime: 6,
    content: `<p>În Franța, <strong>Sécurité Sociale</strong> rambursează doar o parte din cheltuielile medicale (în medie 70% pentru o consultație generalistă). Pentru a acoperi restul, ai nevoie de o <strong>mutuelle</strong> (asigurare complementară de sănătate). Iată tot ce trebuie să știi în 2026.</p>
<h2>Este obligatorie mutuelle?</h2>
<p>Pentru <strong>angajați</strong>: da, angajatorul este obligat din 2016 să ofere o mutuelle colectivă și să plătească minim 50% din cotizație. Aderarea este obligatorie cu rare excepții (de exemplu, dacă ești deja acoperit prin mutuelle a soțului/soției).</p>
<p>Pentru <strong>ceilalți</strong> (independenți, șomeri, studenți, retrași): nu este obligatorie, dar este puternic recomandată. Fără mutuelle, riști să plătești sute sau mii de euro pentru spitalizări, ochelari sau tratamente dentare.</p>
<h2>Ce acoperă o mutuelle?</h2>
<ul>
<li><strong>Consultații</strong> medic generalist și specialiști</li>
<li><strong>Optică</strong>: ochelari, lentile (acoperire variabilă)</li>
<li><strong>Dentar</strong>: proteze, aparate, implanturi</li>
<li><strong>Spitalizare</strong>: camera particulară, forfait journalier</li>
<li><strong>Audioproteze</strong>: aparate auditive</li>
<li><strong>Medicină alternativă</strong>: osteopatie, kinetoterapie (în funcție de contract)</li>
</ul>
<h2>Cum să alegi cea mai bună mutuelle</h2>
<p>Compară pe site-uri precum <strong>LeLynx</strong>, <strong>Meilleurtaux</strong> sau <strong>LesFurets</strong>. Pentru fiecare ofertă, verifică:</p>
<ul>
<li>Nivelul de rambursare (în % din BR — Base de Remboursement Sécu)</li>
<li>Plafoanele anuale (mai ales pentru optică și dentar)</li>
<li>Délai de carence (perioadă de așteptare înainte ca anumite garanții să fie active)</li>
<li>Posibilitatea de tiers payant (să nu plătești în avans)</li>
</ul>
<h2>Cât costă în 2026?</h2>
<p>Pentru o persoană tânără și sănătoasă: între <strong>20-40€/lună</strong>. Pentru familii sau seniori, între <strong>80-200€/lună</strong>. Există ajutoare de stat: <strong>Complémentaire santé solidaire (C2S)</strong> dacă veniturile tale sunt sub un anumit prag.</p>
<h2>Cum te înscrii?</h2>
<p>1. Alege un nivel de acoperire potrivit nevoilor tale<br/>2. Completează formularul online sau mergi la agenție<br/>3. Furnizează: copie carte de identitate, RIB (coordonate bancare), atestat Sécurité Sociale, justificatif de domiciliu<br/>4. Semnează contractul — garanțiile încep de obicei la 1 a lunii următoare</p>
<p><strong>Sursă oficială:</strong> <a href="https://www.service-public.fr/particuliers/vosdroits/F20741" target="_blank" rel="noopener">service-public.fr — Complémentaire santé</a></p>`,
  },
  {
    slug: "carte-vitale-cum-o-obtii",
    title: "Carte Vitale — cum să o obții când ești nou în Franța",
    excerpt:
      "Pașii pentru a obține Carte Vitale, cardul tău de sănătate în Franța, când ești proaspăt sosit.",
    coverImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "viata-practica",
    countries: ["fr"],
    readingTime: 5,
    content: `<p><strong>Carte Vitale</strong> este cardul verde pe care îl prezinți la medic, farmacie sau spital în Franța. El permite rambursarea automată a cheltuielilor de către <strong>Assurance Maladie</strong>. Iată cum să-l obții pas cu pas.</p>
<h2>Cine are dreptul?</h2>
<p>Orice persoană care lucrează sau locuiește în Franța de cel puțin <strong>3 luni stabile</strong> are dreptul la asigurare de sănătate franceză și deci la Carte Vitale.</p>
<ul>
<li>Pentru <strong>cetățeni români (UE)</strong>: doar a-ți face un dosar la <strong>CPAM</strong> (Caisse Primaire d'Assurance Maladie) cu documente.</li>
<li>Pentru <strong>cetățeni moldoveni (non-UE)</strong>: trebuie titlu de ședere valabil + contract de muncă sau dovada rezidenței legale.</li>
</ul>
<h2>Documente necesare</h2>
<ul>
<li>Formular <strong>S1106</strong> (cerere de afiliere) — descărcabil de pe ameli.fr</li>
<li>Copie pașaport sau carte de identitate</li>
<li>Copie titlu de ședere (pentru moldoveni)</li>
<li>Justificatif de domiciliu (chitanță de chirie, factură)</li>
<li>RIB (coordonate bancare franceze)</li>
<li>Contract de muncă sau atestat angajator (dacă lucrezi)</li>
<li>Acte de naștere traduse de un traducător agreat (apostilate dacă e cazul)</li>
</ul>
<h2>Pașii concreți</h2>
<p>1. <strong>Adună documentele</strong> (lista de mai sus)<br/>2. <strong>Trimite dosarul</strong> la CPAM-ul departamentului tău (poți găsi adresa pe ameli.fr)<br/>3. <strong>Primește numărul de Sécurité Sociale</strong> (15 cifre) — poate dura 2-6 luni<br/>4. <strong>Creează cont pe ameli.fr</strong> cu acest număr<br/>5. <strong>Comandă Carte Vitale</strong> din contul tău (e gratuită)<br/>6. <strong>Primești cardul prin poștă</strong> în 2-3 săptămâni</p>
<h2>Ce faci între timp?</h2>
<p>Cât timp aștepți Carte Vitale, păstrează <strong>toate facturile medicale</strong>. Le poți prezenta retroactiv pentru rambursare. La medic, cere <strong>feuille de soins</strong> de hârtie pe care o trimiți la CPAM.</p>
<h2>Probleme frecvente</h2>
<ul>
<li><strong>Dosar incomplet</strong>: cea mai des întâlnită cauză de întârziere. Verifică de două ori lista.</li>
<li><strong>Tradu cere</strong>: doar traducătorii listați pe site-ul Curții de Apel sunt acceptați.</li>
<li><strong>Schimbare de adresă</strong>: actualizează imediat în contul ameli.fr.</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.ameli.fr/assure/droits-demarches/principes/protection-universelle-maladie" target="_blank" rel="noopener">ameli.fr — Protection Universelle Maladie</a></p>`,
  },
  {
    slug: "caf-apl-allocations-familiale",
    title: "CAF — APL și alocații familiale pentru diaspora",
    excerpt:
      "Ce ajutoare îți poate oferi Caisse d'Allocations Familiales (CAF): APL pentru chirie, alocații pentru copii și altele.",
    coverImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "finante",
    countries: ["fr"],
    readingTime: 6,
    content: `<p><strong>CAF</strong> (Caisse d'Allocations Familiales) este instituția care plătește ajutoare sociale și familiale în Franța. Mulți dintre cei din diaspora nu știu că au dreptul la ele. Iată cele mai importante.</p>
<h2>APL — ajutor pentru chirie</h2>
<p><strong>Aide Personnalisée au Logement</strong> este un ajutor lunar care îți reduce chiria. Suma depinde de:</p>
<ul>
<li>Veniturile tale (calculate pe ultimii 12 luni)</li>
<li>Compoziția familiei</li>
<li>Tipul locuinței și suma chiriei</li>
<li>Zona geografică</li>
</ul>
<p>Exemplu concret: o persoană singură care câștigă 1500€ net pe lună și plătește 700€ chirie la Paris poate primi între <strong>50-200€/lună APL</strong>.</p>
<h2>Cine are dreptul?</h2>
<ul>
<li>Locuința trebuie să fie reședința ta principală</li>
<li>Trebuie să ai un contract de chirie pe numele tău (sau coloca cu nume pe contract)</li>
<li>Resurse sub un anumit prag</li>
<li>Pentru moldoveni: titlu de ședere valabil de cel puțin 5 ani sau alte tipuri specifice (vezi caf.fr)</li>
</ul>
<h2>Alocații familiale</h2>
<p>Dacă ai <strong>2 copii sau mai mulți</strong>, primești automat alocații familiale. În 2026:</p>
<ul>
<li>2 copii: aprox. <strong>140€/lună</strong></li>
<li>3 copii: aprox. <strong>320€/lună</strong></li>
<li>+ pentru fiecare copil suplimentar</li>
</ul>
<p>Sumele depind de venituri. Există de asemenea <strong>complement familial</strong> (de la 3 copii) și <strong>PAJE</strong> (Prestation d'Accueil du Jeune Enfant) pentru copii sub 3 ani.</p>
<h2>Alte ajutoare puțin cunoscute</h2>
<ul>
<li><strong>Prime de naissance</strong>: aprox. 1000€ la nașterea unui copil</li>
<li><strong>ARS</strong> (Allocation de Rentrée Scolaire): 400-450€/copil în august pentru cumpărături școlare</li>
<li><strong>RSA</strong> (Revenu de Solidarité Active): pentru cei fără venituri sau venituri mici</li>
<li><strong>Prime d'activité</strong>: complement pentru salarii mici</li>
</ul>
<h2>Cum să faci cererea?</h2>
<p>1. Creează cont pe <strong>caf.fr</strong> cu numărul tău de Sécurité Sociale<br/>2. Completează formularul online (15-20 min)<br/>3. Atașează documentele cerute (RIB, contract chirie, titlu de ședere etc.)<br/>4. Așteaptă răspuns (de obicei 1-2 luni)</p>
<p><strong>Important:</strong> declară orice schimbare de situație (mutare, naștere, schimbare de loc de muncă) <strong>imediat</strong>, altfel riști să trebuiască să restitui sume primite în plus.</p>
<p><strong>Sursă oficială:</strong> <a href="https://www.caf.fr" target="_blank" rel="noopener">caf.fr</a> · <a href="https://www.service-public.fr/particuliers/vosdroits/N20493" target="_blank" rel="noopener">service-public.fr — Aides au logement</a></p>`,
  },
  {
    slug: "declaratie-impozite-franta",
    title: "Declarația de impozite în Franța — pașii pentru diaspora",
    excerpt:
      "Cum și când să-ți declari veniturile, ce trebuie să incluzi și capcanele de evitat dacă ai venituri și din România.",
    coverImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "finante",
    countries: ["fr"],
    readingTime: 7,
    content: `<p>Dacă locuiești în Franța mai mult de <strong>183 zile pe an</strong>, ești considerat rezident fiscal francez și trebuie să-ți declari toate veniturile mondiale (inclusiv chirii, conturi în România/Moldova etc.). Iată ghidul tău complet.</p>
<h2>Calendar 2026</h2>
<ul>
<li><strong>Aprilie</strong>: deschiderea declarației online pe impots.gouv.fr</li>
<li><strong>Mai-iunie</strong>: termene limită diferite în funcție de departament</li>
<li><strong>Iulie-august</strong>: primești <strong>avis d'imposition</strong></li>
<li><strong>Septembrie</strong>: dacă ai de plătit, este moment de plată</li>
</ul>
<h2>Cine trebuie să declare?</h2>
<p>Toți rezidenții fiscali, chiar dacă veniturile lor sunt sub pragul impozabil. <strong>Atenție:</strong> chiar și dacă lucrezi cu CDI și impozitul este reținut la sursă (prélèvement à la source), <strong>trebuie să declari în continuare</strong>.</p>
<h2>Prima declarație — caz special</h2>
<p>Dacă este <strong>prima ta declarație</strong>, nu poți face online. Trebuie:</p>
<ol>
<li>Să descarci formularul <strong>2042</strong> de pe impots.gouv.fr</li>
<li>Să-l completezi pe hârtie</li>
<li>Să-l trimiți la centrul de impozite al departamentului tău</li>
<li>Anul următor vei primi acces online</li>
</ol>
<h2>Venituri din România/Moldova</h2>
<p>Există o <strong>convenție fiscală</strong> Franța-România și Franța-Moldova pentru evitarea dublei impuneri.</p>
<ul>
<li><strong>Salarii</strong> primite în România în timp ce ești rezident francez: trebuie declarate în Franța (formular 2047)</li>
<li><strong>Chirii</strong> de la imobile în România/Moldova: declarate în România/Moldova, dar trebuie semnalate în Franța</li>
<li><strong>Conturi bancare străine</strong>: <strong>obligatoriu</strong> de declarat (formular 3916), chiar dacă au sold zero. Amenda pentru nedeclarare: 1500€/cont.</li>
<li><strong>Pensii</strong>: depinde de tipul (de stat, privat) și de țară</li>
</ul>
<h2>Reduceri fiscale utile</h2>
<ul>
<li><strong>Donații</strong>: 66% din suma donată (limită 20% din venituri)</li>
<li><strong>Servicii la domiciliu</strong>: 50% din cheltuielile pentru menaj, grădinărit, dădacă</li>
<li><strong>Copii la grădiniță/ludotecă</strong>: 50% (până la 3500€/copil)</li>
<li><strong>Investiții imobile locative</strong>: dispozitiv Pinel, Denormandie</li>
<li><strong>Pensii alimentare</strong> plătite copiilor sau părinților</li>
</ul>
<h2>Ajutor gratuit</h2>
<p>Pentru întrebări complicate, mergi la <strong>centrul de impozite</strong> (Centre des Finances Publiques) sau sună <strong>0809 401 401</strong>. Asociațiile diasporei oferă uneori sesiuni gratuite de ajutor în limba română.</p>
<p><strong>Sursă oficială:</strong> <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener">impots.gouv.fr</a></p>`,
  },
  {
    slug: "recunoastere-diplome-romanesti-franta",
    title: "Recunoașterea diplomelor românești și moldovenești în Franța",
    excerpt:
      "Cum să faci recunoscute studiile tale în Franța — ENIC-NARIC, France Education International și alte căi.",
    coverImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "drepturi",
    countries: ["fr"],
    readingTime: 6,
    content: `<p>Ai o diplomă de bacalaureat, licență sau master din România sau Moldova și vrei să lucrezi sau studiezi în Franța? Iată cum să o faci recunoscută în 2026.</p>
<h2>Diferența recunoaștere ≠ echivalare</h2>
<ul>
<li><strong>Recunoașterea</strong>: un document oficial care arată ce echivalent are diploma ta în sistemul francez. Util pentru angajatori, școli, concursuri publice.</li>
<li><strong>Echivalarea</strong>: există doar pentru profesii reglementate (medic, avocat, asistent medical etc.). Necesită examene și/sau stagii suplimentare.</li>
</ul>
<h2>ENIC-NARIC France (acum France Education International)</h2>
<p>Este organismul oficial care eliberează <strong>atestatul de comparabilitate</strong>. Procedură:</p>
<ol>
<li>Mergi pe <strong>france-education-international.fr</strong></li>
<li>Creează un cont și depune cererea online</li>
<li>Plătește taxa: <strong>70€</strong> (procedură standard) sau <strong>120€</strong> (procedură rapidă, 1 lună)</li>
<li>Atașează: copie diplomă + traducere oficială + foaie matricolă + traducere oficială + copie act de identitate</li>
<li>Așteaptă rezultatul: <strong>3-4 luni</strong> standard</li>
</ol>
<h2>Documente acceptate</h2>
<ul>
<li>Diplome <strong>românești</strong>: în general bine recunoscute (acord UE)</li>
<li>Diplome <strong>moldovenești</strong>: necesită apostilă de la Ministerul Justiției din Moldova</li>
<li><strong>Traducerile</strong> trebuie făcute de un traducător agreat de Curtea de Apel franceză (lista pe site-ul fiecărei Curți)</li>
</ul>
<h2>Profesii reglementate — caz special</h2>
<p>Dacă vrei să fii <strong>medic, asistent medical, farmacist, avocat, profesor, psiholog</strong> etc., trebuie să treci prin proceduri specifice fiecărei profesii:</p>
<ul>
<li><strong>Medici</strong>: examen <strong>EVC</strong> (Épreuves de Vérification des Connaissances) + 3 ani stagiu</li>
<li><strong>Asistenți medicali</strong>: dosar la <strong>ARS</strong> (Agence Régionale de Santé) + eventual modul de adaptare</li>
<li><strong>Avocați</strong>: examen <strong>CAPA</strong> + stagiu la barou</li>
</ul>
<h2>Ce să faci în paralel</h2>
<ul>
<li><strong>Cere o copie certificată</strong> a diplomei la universitatea ta înainte să pleci</li>
<li><strong>Apostilează diplomele</strong> la Ministerul Justiției / Educației înainte să părăsești România/Moldova</li>
<li><strong>Învață franceza la nivel cel puțin B2</strong> — orice procedură va necesita asta</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.france-education-international.fr/expertises/enic-naric" target="_blank" rel="noopener">France Education International — ENIC-NARIC</a></p>`,
  },
  {
    slug: "titlu-sedere-romani-moldoveni-franta",
    title: "Titlul de ședere — diferențe pentru români și moldoveni",
    excerpt:
      "Românii ca cetățeni UE au alte reguli decât moldovenii non-UE. Iată ce trebuie să știe fiecare în 2026.",
    coverImage:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "drepturi",
    countries: ["fr"],
    readingTime: 7,
    content: `<p>Statutul tău juridic în Franța depinde de țara ta de origine. <strong>Românii</strong> sunt cetățeni UE și au libertate de circulație. <strong>Moldovenii</strong> sunt cetățeni non-UE și au nevoie de viză + titlu de ședere. Iată ce trebuie să știi.</p>
<h2>Pentru români — UE</h2>
<p>Ca cetățean român, ai dreptul de a locui și munci în Franța <strong>fără viză</strong>. <strong>NU ai nevoie de titlu de ședere</strong> începând cu 2014.</p>
<h3>Ce trebuie să faci totuși:</h3>
<ul>
<li>Înregistrează-te la <strong>primărie</strong> dacă rămâi mai mult de 3 luni (recomandare, nu obligatorie)</li>
<li>Cere <strong>numărul de Sécurité Sociale</strong> dacă lucrezi sau locuiești cel puțin 3 luni</li>
<li>Pentru a deschide cont bancar: justificatif de domiciliu (chitanță, factură)</li>
<li>După <strong>5 ani</strong> de ședere continuă, poți cere <strong>cartea de rezident permanent UE</strong> — opțional dar utilă pentru securitate juridică</li>
</ul>
<h2>Pentru moldoveni — non-UE</h2>
<p>Ai nevoie de <strong>viză de lungă durată</strong> înainte de a veni, apoi de titlu de ședere odată ajuns. Tipuri principale:</p>
<h3>Viza VLS-TS (Visa de Long Séjour valant Titre de Séjour)</h3>
<p>Cea mai comună. Tipuri:</p>
<ul>
<li><strong>Salariat</strong>: dacă ai contract de muncă în Franța</li>
<li><strong>Étudiant</strong>: dacă ai înscriere la o universitate franceză</li>
<li><strong>Visiteur</strong>: dacă ai mijloace financiare suficiente (~min. 1380€/lună) și nu lucrezi</li>
<li><strong>Vie privée et familiale</strong>: căsătorit cu francez/cetățean UE sau părinte de copil francez</li>
</ul>
<h3>Pașii odată ajuns în Franța</h3>
<ol>
<li>În maxim <strong>3 luni</strong> după sosire, validare VLS-TS pe <strong>administration-etrangers-en-france.interieur.gouv.fr</strong></li>
<li>Plătește taxa OFII (~250€)</li>
<li>Așteaptă convocarea pentru vizită medicală (obligatorie)</li>
<li>Reînnoiește titlul cu 2-3 luni înainte de expirare la <strong>préfecture</strong></li>
</ol>
<h3>După 5 ani — Carte de Résident</h3>
<p>După 5 ani de ședere legală continuă, poți solicita <strong>Carte de Résident</strong> (valabilă 10 ani, reînnoibilă automat). Necesită:</p>
<ul>
<li>Resurse stabile și regulate</li>
<li>Asigurare de sănătate</li>
<li>Probă de integrare (nivel A2 franceză minim)</li>
<li>Cazier judiciar curat</li>
</ul>
<h2>Naționalizare franceză</h2>
<p>După <strong>5 ani</strong> de ședere (4 ani pentru români — diaspora UE), poți cere <strong>cetățenia franceză</strong>. Documente: nivel B1 franceză, dovedi resurse, integrare etc. Procedură: 18-24 luni.</p>
<p><strong>Sursă oficială:</strong> <a href="https://www.service-public.fr/particuliers/vosdroits/N110" target="_blank" rel="noopener">service-public.fr — Étrangers en France</a></p>`,
  },
  {
    slug: "inscriere-scoala-cresa-franta",
    title: "Înscrierea copilului la școală sau creșă în Franța",
    excerpt:
      "Ghid pas cu pas pentru părinții români/moldoveni care vor să-și înscrie copilul la creșă, grădiniță sau școală.",
    coverImage:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "viata-practica",
    countries: ["fr"],
    readingTime: 6,
    content: `<p>În Franța, școala este <strong>obligatorie de la 3 ani</strong> și gratuită până la 18 ani în sistemul public. Iată cum să-ți înscrii copilul fără stres.</p>
<h2>Sistemul francez pe scurt</h2>
<ul>
<li><strong>Crèche</strong> (creșă): 3 luni - 3 ani — opțional, locuri foarte limitate</li>
<li><strong>École Maternelle</strong> (grădiniță): 3 - 6 ani — <strong>obligatorie</strong></li>
<li><strong>École Élémentaire</strong> (școala primară): 6 - 11 ani</li>
<li><strong>Collège</strong>: 11 - 15 ani</li>
<li><strong>Lycée</strong>: 15 - 18 ani</li>
</ul>
<h2>Creșa — cum se obține un loc</h2>
<p>Creșele publice sunt foarte căutate. Începe demersurile <strong>încă din timpul sarcinii</strong>!</p>
<ol>
<li>Înscrie-te la primăria orașului tău (lista de așteptare)</li>
<li>Comisia se reunește de obicei în martie/aprilie pentru septembrie</li>
<li>Criterii: locuri de muncă, situație familială, venituri</li>
<li>Costul: <strong>între 0,30€ și 4€/oră</strong> în funcție de venituri</li>
</ol>
<h3>Alternative</h3>
<ul>
<li><strong>Assistante maternelle</strong> (dădacă agreată acasă): mai ușor de găsit, ~600-1000€/lună (parte rambursată de CAF)</li>
<li><strong>Crèche privée</strong>: mai scumpă, dar locuri mai disponibile</li>
<li><strong>Garde partagée</strong>: 2 familii angajează o dădacă împreună</li>
</ul>
<h2>Grădiniță și școală primară</h2>
<p>Înscrierea se face la <strong>primărie</strong> (mairie) între februarie și mai pentru septembrie:</p>
<h3>Documente necesare</h3>
<ul>
<li>Cartea de identitate sau pașaport al părintelui</li>
<li>Livret de famille sau certificat de naștere al copilului (tradus în franceză)</li>
<li>Justificatif de domiciliu (chitanță chirie / factură mai puțin de 3 luni)</li>
<li>Carnetul de vaccinări (vaccinurile cerute trebuie făcute la zi)</li>
</ul>
<h3>După înscriere la primărie</h3>
<p>Primăria îți spune <strong>la ce școală</strong> este alocat copilul (în general cea mai apropiată de casă — sectorizare). Apoi mergi la școala respectivă cu confirmarea de la primărie pentru a finaliza înscrierea.</p>
<h2>Ce trebuie să știi</h2>
<ul>
<li><strong>Vaccinări obligatorii</strong>: 11 vaccinuri obligatorii pentru copiii născuți după 1 ianuarie 2018</li>
<li><strong>Cantină</strong>: cost variabil (1-7€/masă în funcție de venituri)</li>
<li><strong>Garderie/étude</strong>: pentru copii al căror părinți lucrează târziu</li>
<li><strong>Asociațiile părinților</strong>: implicare puternică, vot pentru reprezentanți</li>
</ul>
<h2>Sosire în timpul anului școlar</h2>
<p>Dacă vii cu copilul la jumătatea anului, mergi direct la primărie. Copilul este înscris la cea mai apropiată școală cu locuri disponibile. Pentru cei care nu vorbesc franceza, există clase <strong>UPE2A</strong> (unități pedagogice pentru elevi alofoni) care îi ajută să recupereze.</p>
<p><strong>Sursă oficială:</strong> <a href="https://www.service-public.fr/particuliers/vosdroits/N31" target="_blank" rel="noopener">service-public.fr — Scolarité</a></p>`,
  },
  {
    slug: "inchiriere-locuinta-franta-visale",
    title: "Cum să închiriezi un apartament în Franța când ești străin",
    excerpt:
      "Dosarul perfect, garanția Visale și sfaturi pentru a depăși cea mai grea etapă: găsirea unei locuințe.",
    coverImage:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "viata-practica",
    countries: ["fr"],
    readingTime: 6,
    content: `<p>Găsirea unei chirii în Franța este una dintre cele mai mari provocări pentru diaspora. Proprietarii cer dosare solide. Iată cum să le depășești ca un profesionist.</p>
<h2>Dosarul perfect</h2>
<p>Proprietarul se asigură că poți plăti chiria. De obicei cer ca <strong>venitul tău net să fie de cel puțin 3x chiria</strong>. Documentele clasice ale dosarului:</p>
<ul>
<li>Carte de identitate sau pașaport (+ titlu de ședere pentru moldoveni)</li>
<li><strong>3 ultime fluturași de salariu</strong> (sau bilanț pentru independenți)</li>
<li><strong>Contract de muncă</strong> sau atestat angajator</li>
<li><strong>2 ultimi avis d'imposition</strong> (declarația de impozite)</li>
<li><strong>3 ultime chitanțe de chirie</strong> (dacă ai locuit deja în Franța)</li>
<li>Justificatif de domiciliu actual</li>
<li>RIB</li>
</ul>
<h2>Visale — garanția gratuită a statului</h2>
<p><strong>Visale</strong> este o garanție gratuită oferită de <strong>Action Logement</strong> care înlocuiește garanția unei persoane fizice (părinte, garant). Avantaje:</p>
<ul>
<li>100% gratuită</li>
<li>Acoperă neplătirea chiriei până la 36 de luni</li>
<li>Acceptată de majoritatea proprietarilor</li>
<li>Procedură online pe <strong>visale.fr</strong></li>
</ul>
<h3>Cine este eligibil?</h3>
<ul>
<li>Aveți între 18-30 ani (toți)</li>
<li>SAU peste 30 ani și salariat care a sosit recent (mai puțin de 6 luni)</li>
<li>SAU funcționar mutat / persoană în reconversie profesională</li>
</ul>
<h2>Soluții fără garanție</h2>
<ul>
<li><strong>Garantme</strong> sau <strong>Cautioneo</strong>: garanție privată plătitoare (3.5-4% din chiria anuală)</li>
<li><strong>Plata mai multor luni în avans</strong>: maxim 2 luni autorizat de lege</li>
<li><strong>Locuințe sociale (HLM)</strong>: lungă listă de așteptare, criterii de venituri</li>
<li><strong>Camere la familie</strong>: anunțuri pe Facebook în grupuri diaspora</li>
</ul>
<h2>Capcane de evitat</h2>
<ul>
<li><strong>Nu plăti niciodată în avans</strong> înainte să vezi locuința și să semnezi contract</li>
<li><strong>Verifică DPE</strong> (Diagnostic de Performance Énergétique) — locuințele clasa F și G nu mai pot fi închiriate din 2025</li>
<li><strong>Inventaire de sortie</strong> obligatoriu — fotografiază tot la intrare</li>
<li><strong>Garanția de 1 lună</strong>: maxim legal pentru locuințe nemobilate (2 luni pentru mobilate)</li>
<li><strong>Frais d'agence</strong>: maxim plafonat de lege în funcție de oraș (8-12€/m²)</li>
</ul>
<h2>Site-uri utile</h2>
<ul>
<li><strong>SeLoger.com, LeBonCoin.fr, PAP.fr</strong>: anunțuri proprietari și agenții</li>
<li><strong>LocService.fr</strong>: tu spui ce cauți, proprietarii te contactează</li>
<li><strong>Studapart, Lokaviz</strong>: pentru studenți</li>
<li>Grupuri Facebook diaspora: anunțuri rapide, dar atenție la escrocherii</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.visale.fr" target="_blank" rel="noopener">visale.fr</a> · <a href="https://www.service-public.fr/particuliers/vosdroits/N19806" target="_blank" rel="noopener">service-public.fr — Logement</a></p>`,
  },
  {
    slug: "deschidere-cont-bancar-franta",
    title: "Deschiderea unui cont bancar în Franța — chiar dacă ești nou",
    excerpt:
      "Ce bănci acceptă diaspora ușor, ce documente sunt cerute și ce să faci dacă ești refuzat.",
    coverImage:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "finante",
    countries: ["fr"],
    readingTime: 5,
    content: `<p>Fără cont bancar francez, viața în Franța este foarte complicată: chirie, salariu, impozite, totul trece prin RIB. Iată cum să-l deschizi rapid în 2026.</p>
<h2>Documente clasice cerute</h2>
<ul>
<li>Carte de identitate sau pașaport valabile</li>
<li>Titlu de ședere (pentru moldoveni)</li>
<li>Justificatif de domiciliu (chitanță chirie, factură electricitate, atestat de la persoana care te găzduiește)</li>
<li>Justificatif de venituri (fluturași de salariu, contract de muncă) — pentru anumite bănci</li>
</ul>
<h2>Bănci tradiționale</h2>
<ul>
<li><strong>BNP Paribas, Société Générale, Crédit Agricole, LCL</strong>: solide dar uneori refuză dosare incomplete</li>
<li><strong>La Banque Postale</strong>: <strong>cea mai accesibilă</strong> pentru noi sosiți, mai puțin exigentă</li>
<li><strong>Crédit Mutuel</strong>: bună atitudine față de străini cu titluri valabile</li>
</ul>
<h2>Bănci online — opțiunea modernă</h2>
<p>Mai rapide, fără agenție, deschidere în 24-48h:</p>
<ul>
<li><strong>Boursorama Banque</strong>: gratuită, RIB francez, primă de bun venit ~80-150€</li>
<li><strong>Hello Bank!</strong>: filială BNP, gratuită cu condiții</li>
<li><strong>Fortuneo</strong>: fără cheltuieli pe card, primă bun venit</li>
<li><strong>Revolut, N26, Wise</strong>: <strong>nu RIB francez</strong> de bază — pot fi refuzate de proprietari sau angajatori</li>
</ul>
<p><strong>Atenție</strong>: pentru chirie, multe agenții cer un RIB <strong>francez (cu BIC care începe cu 4 litere franceze)</strong>. Verifică înainte de a alege banca.</p>
<h2>Dreptul la cont — refuzat la toate băncile?</h2>
<p>Dacă ai fost refuzat la <strong>cel puțin o bancă</strong>, poți activa <strong>Droit au Compte</strong> — Banque de France îți va atribui un cont în mod obligatoriu la o bancă.</p>
<h3>Procedură:</h3>
<ol>
<li>Cere atestare de refuz scris la banca (sau bănci) care te-a/te-au refuzat</li>
<li>Mergi la cea mai apropiată agenție <strong>Banque de France</strong> sau trimite dosar online</li>
<li>Banque de France desemnează o bancă în 1 zi lucrătoare</li>
<li>Banca este obligată să-ți deschidă un cont cu servicii de bază gratuite</li>
</ol>
<h2>Sfaturi pentru a evita refuzul</h2>
<ul>
<li>Mergi la agenție cu <strong>toate documentele</strong> deodată — nu lăsa nimic acasă</li>
<li>Cere o întâlnire cu un consilier (nu doar trimite dosarul online)</li>
<li>Explică <strong>proiectul tău</strong>: lucrezi în Franța, ai contract, intenții pe termen lung</li>
<li>Începe cu La Banque Postale dacă ești foarte nou</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.service-public.fr/particuliers/vosdroits/F1336" target="_blank" rel="noopener">service-public.fr — Droit au compte bancaire</a></p>`,
  },
  {
    slug: "permis-conducere-roman-moldovean-franta",
    title: "Permisul de conducere — schimb sau echivalare în Franța",
    excerpt:
      "Permisul tău românesc sau moldovenesc valabil în Franța? În ce condiții și cum îl schimbi pentru unul francez.",
    coverImage:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "drepturi",
    countries: ["fr"],
    readingTime: 5,
    content: `<p>Te muți în Franța cu permisul tău românesc sau moldovenesc? Regulile sunt diferite în funcție de țara emitentă. Iată ghidul complet în 2026.</p>
<h2>Pentru români — UE</h2>
<p>Permisul românesc este <strong>direct valabil în Franța</strong> pe toată durata sa de validitate, fără limită de timp. <strong>Nu ești obligat să-l schimbi</strong>.</p>
<h3>De ce ai vrea totuși să-l schimbi?</h3>
<ul>
<li>Pierzi puncte: pe permisul român, sistemul de puncte francez nu se aplică direct</li>
<li>Pierdere/furt: este mai ușor să obții duplicat dacă permisul este francez</li>
<li>Înnoirea când expiră: trebuie făcută în Franța (la prefectura) și e mai simplu cu permis francez deja</li>
</ul>
<h3>Cum se face schimbul (opțional pentru români)</h3>
<ol>
<li>Cerere online pe <strong>ANTS.gouv.fr</strong> (rubric "permis de conduire")</li>
<li>Atașează: copie permis, copie carte identitate, fotografie</li>
<li>Trimite permisul român</li>
<li>Primești permis francez în 2-3 luni</li>
</ol>
<h2>Pentru moldoveni — non-UE</h2>
<p>Permisul moldovenesc este valabil <strong>doar 1 an</strong> de la data stabilirii rezidenței în Franța. După acest termen, trebuie:</p>
<ul>
<li>SAU să-l schimbi cu unul francez (dacă există acord de schimb)</li>
<li>SAU să treci permisul francez de la zero (cod + circulație)</li>
</ul>
<h3>Acordul de schimb Moldova-Franța</h3>
<p>Există un acord bilateral <strong>limitat</strong>. <strong>Schimbul este posibil dacă:</strong></p>
<ul>
<li>Permisul a fost obținut în Moldova, în limba moldovenească</li>
<li>Ești rezident legal în Franța (titlu de ședere valabil)</li>
<li>Faci cererea în maxim 1 an de la prima rezidență legală în Franța</li>
</ul>
<h3>Documente necesare pentru schimb</h3>
<ul>
<li>Permisul moldovenesc original + traducere oficială</li>
<li>Apostilă de la Ministerul Afacerilor Externe din Moldova</li>
<li>Copie titlu de ședere</li>
<li>Justificatif de domiciliu</li>
<li>Certificat medical (pentru anumite categorii)</li>
<li>Fotografie tip pașaport</li>
</ul>
<p>Procedură pe <strong>ANTS.gouv.fr</strong>. Durată: 6-12 luni.</p>
<h2>Dacă schimbul este refuzat</h2>
<p>Trebuie să dai permisul francez de la zero:</p>
<ul>
<li><strong>Codul rutier</strong>: examen teoretic (40 întrebări, max 5 greșeli) — costă ~30€</li>
<li><strong>Circulația</strong>: examen practic — minim 20 ore lecții (1500-2000€ în total)</li>
<li>În total cost: <strong>2000-3000€</strong> pentru a deveni șofer francez de la zero</li>
</ul>
<h2>Atenție</h2>
<ul>
<li>Dacă conduci după 1 an cu permis moldovenesc neschimbat, ești <strong>fără permis</strong> și riști amendă mare + închiriere imposibilă a mașinii</li>
<li>Asigurarea auto poate refuza o reclamație dacă permisul a expirat</li>
<li>Pe contraventii dă probleme la viitor (cerere viză sau cetățenie)</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.service-public.fr/particuliers/vosdroits/F1460" target="_blank" rel="noopener">service-public.fr — Échange de permis étranger</a></p>`,
  },
  // ============== GERMANY (DE) ==============
  {
    slug: "krankenversicherung-germania-2026",
    title: "Krankenversicherung — sistemul de sănătate german explicat",
    excerpt:
      "GKV (publică) vs PKV (privată), cum o alegi pe a ta și ce acoperă în 2026.",
    coverImage:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "viata-practica",
    countries: ["de"],
    readingTime: 7,
    content: `<p>În Germania, asigurarea de sănătate este <strong>obligatorie prin lege</strong> pentru orice rezident. Există două sisteme paralele: <strong>GKV</strong> (gesetzliche Krankenversicherung — publică) și <strong>PKV</strong> (private Krankenversicherung — privată). Iată cum să alegi în 2026.</p>
<h2>GKV — sistemul public</h2>
<p>Aproximativ <strong>90% din rezidenți</strong> sunt în GKV. Cum funcționează:</p>
<ul>
<li><strong>Cotizația</strong>: ~14,6% din salariul brut + suplimentul fiecărei case (~1,7%) — împărțit la jumătate cu angajatorul</li>
<li><strong>Plafond de cotizație</strong>: 5.512€/lună brut (2026) — peste, cotizația rămâne fixă</li>
<li><strong>Soțul/soția fără venituri și copiii</strong>: gratuit (Familienversicherung)</li>
<li><strong>Acoperire</strong>: medic, spital, medicamente, stomatologie de bază, maternitate</li>
</ul>
<h3>Cele mai mari case (Krankenkassen)</h3>
<ul>
<li><strong>TK</strong> (Techniker Krankenkasse) — populară la diaspora, servicii online bune</li>
<li><strong>AOK</strong> — prezent în fiecare land, mulți consilieri locali</li>
<li><strong>Barmer</strong>, <strong>DAK</strong>, <strong>IKK</strong> — alternative</li>
</ul>
<h2>PKV — sistemul privat</h2>
<p>Doar pentru <strong>liber-profesioniști</strong>, <strong>funcționari</strong> și <strong>angajați cu venit brut > 73.800€/an</strong> (2026). Avantaje: timp de așteptare mai scurt, cabinete private, comfort. Dezavantaje: cotizația crește cu vârsta, soțul/copiii nu sunt gratuiți, întoarcerea la GKV e dificilă după 55 de ani.</p>
<h2>Cum te înscrii</h2>
<ol>
<li>Alege o casă (compară pe <strong>check24.de</strong> sau <strong>krankenkassen.de</strong>)</li>
<li>Completează formularul de adeziune (online sau pe hârtie)</li>
<li>Trimite: copie pașaport / Aufenthaltstitel, contract de muncă, Anmeldung (înregistrarea la primărie)</li>
<li>Primești <strong>Versichertennummer</strong> și apoi <strong>elektronische Gesundheitskarte (eGK)</strong> în 2-3 săptămâni</li>
</ol>
<h2>Pentru moldoveni — caz special</h2>
<p>Cu titlu de ședere și contract de muncă: GKV automat. Pentru <strong>Au-Pair, studenți, vizitatori</strong>: există asigurări private specifice (Care Concept, Mawista, Hanse Merkur) — costuri 30-90€/lună.</p>
<h2>Costuri de care să fii atent</h2>
<ul>
<li><strong>Praxisgebühr</strong>: a fost desființată în 2013 — consultațiile sunt gratuite</li>
<li><strong>Eigenanteil</strong>: contribuții la medicamente (5-10€), spitalizare (10€/zi)</li>
<li><strong>Stomatologie avansată</strong>: PKV sau Zahnzusatzversicherung (~15€/lună)</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.bundesgesundheitsministerium.de" target="_blank" rel="noopener">bundesgesundheitsministerium.de</a></p>`,
  },
  {
    slug: "anmeldung-versichertenkarte-germania",
    title: "Anmeldung și Versichertenkarte — primii pași în Germania",
    excerpt:
      "Cum te înregistrezi la primărie (Anmeldung), obții Steuer-ID și cardul de sănătate când vii în Germania.",
    coverImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "viata-practica",
    countries: ["de"],
    readingTime: 5,
    content: `<p>Când vii în Germania, primul lucru pe care trebuie să-l faci este <strong>Anmeldung</strong> — înregistrarea la primărie. Fără ea, nu poți avea cont bancar, contract de telefon, nici asigurare de sănătate. Iată pașii.</p>
<h2>Anmeldung — înregistrarea la primărie</h2>
<p>Trebuie făcută în <strong>maxim 14 zile</strong> de la mutare în noua locuință. Programare online la <strong>Bürgeramt</strong> sau <strong>Einwohnermeldeamt</strong>.</p>
<h3>Documente necesare</h3>
<ul>
<li>Pașaport sau carte de identitate</li>
<li><strong>Wohnungsgeberbestätigung</strong> — confirmare semnată de proprietar/locator (formular oficial)</li>
<li>Contract de chirie (opțional, dar recomandat)</li>
<li>Formular Anmeldung completat</li>
</ul>
<p>Procedura durează 15-30 minute. Primești <strong>Anmeldebestätigung</strong> — document esențial.</p>
<h2>Steuer-ID — codul fiscal</h2>
<p>După Anmeldung, primești automat prin poștă <strong>Steuer-Identifikationsnummer</strong> (11 cifre) în 2-4 săptămâni. Este cheia pentru:</p>
<ul>
<li>Salariu (angajatorul nu te poate plăti fără el)</li>
<li>Cont bancar</li>
<li>Asigurare de sănătate</li>
<li>Declarația de impozite</li>
</ul>
<p>Dacă nu primești în 4 săptămâni, sună la <strong>Bundeszentralamt für Steuern</strong> (0228 406 1240).</p>
<h2>Versichertenkarte (eGK)</h2>
<p>Este cardul tău de sănătate. Pentru a-l obține:</p>
<ol>
<li>Alege o Krankenkasse (TK, AOK, Barmer etc.)</li>
<li>Trimite formular de adeziune cu: Anmeldebestätigung, contract de muncă, fotografie</li>
<li>Primești <strong>Versichertennummer</strong> imediat (folosit la medic înainte ca acel card să sosească)</li>
<li>Cardul fizic ajunge prin poștă în 2-3 săptămâni</li>
</ol>
<h2>Capcane frecvente</h2>
<ul>
<li><strong>Sublocațiunea</strong>: dacă închiriezi o cameră, proprietarul principal trebuie să semneze Wohnungsgeberbestätigung</li>
<li><strong>Anmeldung temporară</strong>: pentru locuințe Airbnb / hotel, NU este Anmeldung valabil</li>
<li><strong>Schimbare de adresă</strong>: trebuie să te re-anunți la primărie în 14 zile (Ummeldung)</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.bzst.de" target="_blank" rel="noopener">Bundeszentralamt für Steuern</a></p>`,
  },
  {
    slug: "kindergeld-elterngeld-germania",
    title: "Kindergeld și Elterngeld — ajutoare pentru familii în Germania",
    excerpt:
      "Cât primești pentru fiecare copil, cum ceri Elterngeld după naștere și alte beneficii pentru părinți.",
    coverImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "finante",
    countries: ["de"],
    readingTime: 6,
    content: `<p>Germania este una dintre cele mai generoase țări europene pentru familii. <strong>Kindergeld</strong>, <strong>Elterngeld</strong>, <strong>Kinderzuschlag</strong> — iată tot ce ai dreptul când ai copii.</p>
<h2>Kindergeld — alocația lunară</h2>
<p>Suma fixă lunară, indiferent de venituri:</p>
<ul>
<li><strong>250€/lună per copil</strong> (din 2023, valabil în 2026)</li>
<li>Se plătește până la <strong>18 ani</strong> automat</li>
<li>Până la <strong>25 ani</strong> dacă copilul studiază, ucenicie sau caută loc de muncă</li>
</ul>
<h3>Cine are dreptul?</h3>
<ul>
<li>Cetățeni UE (români): da, dacă lucrezi sau locuiești legal în Germania</li>
<li>Cetățeni non-UE (moldoveni): da, dacă ai Aufenthaltstitel cu drept de muncă</li>
<li>Copilul nu trebuie să trăiască în Germania (poate fi în România/Moldova) — dar atenție la regulile de prioritate</li>
</ul>
<h3>Cum o ceri</h3>
<ol>
<li>Formular online pe <strong>familienkasse.de</strong></li>
<li>Documente: certificat de naștere copil (cu apostilă pentru Moldova), Steuer-ID părinte și copil, Anmeldung</li>
<li>Răspuns: 4-12 săptămâni</li>
<li>Plata retroactivă pe <strong>6 luni maxim</strong>, deci nu întârzia!</li>
</ol>
<h2>Elterngeld — concediu parental plătit</h2>
<p>După nașterea unui copil, părintele care stă acasă primește <strong>65-67% din salariul net</strong> dinaintea nașterii.</p>
<ul>
<li><strong>Minim</strong>: 300€/lună</li>
<li><strong>Maxim</strong>: 1.800€/lună</li>
<li><strong>Durată</strong>: 12 luni (un părinte) sau 14 luni (împărțit între cei 2)</li>
<li><strong>ElterngeldPlus</strong>: jumătate din sumă pentru durată dublă (24-28 luni)</li>
</ul>
<h2>Kinderzuschlag — pentru familii cu venituri mici</h2>
<p>Până la <strong>292€/lună per copil</strong> în plus față de Kindergeld dacă veniturile tale nu acoperă nevoile familiei. Cerere la Familienkasse împreună cu Kindergeld.</p>
<h2>Mutterschaftsgeld și Elternzeit</h2>
<ul>
<li><strong>Mutterschaftsgeld</strong>: 13€/zi de la GKV + complement de la angajator (100% salariu) — 6 săptămâni înainte și 8 săptămâni după naștere</li>
<li><strong>Elternzeit</strong>: dreptul la concediu nepltățit până la 3 ani per copil cu garanția păstrării locului de muncă</li>
</ul>
<h2>Atenție pentru români/moldoveni</h2>
<p>Dacă copilul trăiește în România/Moldova, suma Kindergeld poate fi <strong>plafonată</strong> conform regulilor UE de coordonare a securității sociale. Familienkasse compară cu alocațiile din țara de origine. <strong>Declară totul</strong>, sancțiunile pentru fraudă sunt severe.</p>
<p><strong>Sursă oficială:</strong> <a href="https://www.familienkasse.de" target="_blank" rel="noopener">familienkasse.de</a></p>`,
  },
  {
    slug: "declaratie-impozite-germania",
    title: "Steuererklärung — declarația de impozite pentru diaspora în Germania",
    excerpt:
      "Cine trebuie să declare, cum folosești ELSTER și ce deduceri te pot face să recuperezi sute de euro.",
    coverImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "finante",
    countries: ["de"],
    readingTime: 7,
    content: `<p>Mulți români/moldoveni din Germania nu fac declarația de impozite și pierd <strong>sute sau mii de euro</strong> de rambursare anuală. Iată ghidul complet pentru 2026.</p>
<h2>Trebuie să declar?</h2>
<p>Obligatoriu dacă:</p>
<ul>
<li>Ai venituri din mai multe surse (lohnsteuerklasse III/V, IV cu Faktor)</li>
<li>Ai primit <strong>Kurzarbeitergeld, Elterngeld</strong> sau alte ajutoare > 410€</li>
<li>Ai venituri suplimentare > 410€/an (chirii, freelance)</li>
<li>Ești liber-profesionist (Freiberufler / Selbstständig)</li>
</ul>
<p><strong>Voluntar</strong> dacă ai doar un salariu — dar este aproape întotdeauna avantajos! Rambursarea medie: <strong>1.072€</strong> (statistică oficială Bundesfinanzministerium).</p>
<h2>Calendar 2026</h2>
<ul>
<li><strong>1 ianuarie</strong>: începutul perioadei de declarație pentru 2025</li>
<li><strong>31 iulie 2026</strong>: termen pentru obligatorii (declarația 2025)</li>
<li>Cu consultant fiscal (Steuerberater): termen extins până la <strong>28 februarie 2027</strong></li>
<li><strong>4 ani retroactiv</strong>: poți declara voluntar până la 4 ani în urmă</li>
</ul>
<h2>ELSTER — instrumentul oficial gratuit</h2>
<p><strong>elster.de</strong> este platforma oficială. Înregistrează-te cu Steuer-ID și primești prin poștă codul de activare (~2 săptămâni). Apoi:</p>
<ol>
<li>Logare și completarea formularelor (Mantelbogen, Anlage N pentru salariați etc.)</li>
<li>Atașarea documentelor în PDF</li>
<li>Trimitere electronică</li>
<li>Primești <strong>Steuerbescheid</strong> în 4-12 săptămâni</li>
</ol>
<h2>Alternativă: aplicații simple</h2>
<ul>
<li><strong>Wundertax</strong> (35€) — interface în engleză, ideală pentru începători</li>
<li><strong>Taxfix</strong> (40€) — întrebări simple, nu necesită cunoștințe fiscale</li>
<li><strong>Smartsteuer</strong> (35€) — dacă ai situații complexe</li>
</ul>
<h2>Ce poți deduce (Werbungskosten)</h2>
<ul>
<li><strong>Distanța casă-muncă</strong>: 0,30€/km până la 20 km, 0,38€/km după</li>
<li><strong>Doppelter Haushalt</strong>: dacă ai a 2-a locuință din motive profesionale (până la 1.000€/lună chirie + transport)</li>
<li><strong>Cheltuieli profesionale</strong>: laptop, telefon, instrumente, formare</li>
<li><strong>Sumă forfetară</strong>: 1.230€/an (Werbungskostenpauschale) automat fără justificare</li>
<li><strong>Chirii și costuri de mutare</strong> din motive profesionale</li>
<li><strong>Bani trimiși familiei în România/Moldova</strong>: până la 11.604€/an pentru părinți, soți, copii</li>
</ul>
<h2>Special pentru diaspora — bani trimiși acasă</h2>
<p>Dacă trimiți bani regulat părinților sau soțului/soției/copiilor rămași în România/Moldova, poți deduce <strong>până la 11.604€/an</strong> (2026). Documente:</p>
<ul>
<li>Certificate de naștere/căsătorie (apostilate, traduse)</li>
<li>Atestare oficială că persoana are venituri sub un anumit prag</li>
<li>Probe de transfer (Western Union, MoneyGram, transfer bancar)</li>
</ul>
<h2>Conturi bancare în România/Moldova</h2>
<p>Trebuie declarate în Anlage KAP dacă produc dobânzi/dividende. <strong>Convenția fiscală</strong> Germania-România/Moldova evită dubla impunere.</p>
<p><strong>Sursă oficială:</strong> <a href="https://www.elster.de" target="_blank" rel="noopener">elster.de</a> · <a href="https://www.bundesfinanzministerium.de" target="_blank" rel="noopener">bundesfinanzministerium.de</a></p>`,
  },
  {
    slug: "recunoastere-diplome-germania",
    title: "Recunoașterea diplomelor românești și moldovenești în Germania",
    excerpt:
      "ZAB, Anabin, profesii reglementate — cum să-ți faci diploma recunoscută în Germania în 2026.",
    coverImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "drepturi",
    countries: ["de"],
    readingTime: 6,
    content: `<p>Ai diplomă de licență, master sau doctorat din România/Moldova și vrei să lucrezi sau studiezi în Germania? Sistemul german e bine organizat dar pe etape. Iată ghidul.</p>
<h2>Verifică-ți întâi diploma în Anabin</h2>
<p><strong>anabin.kmk.org</strong> — baza oficială cu peste 50.000 de diplome străine. Caută universitatea ta. Statutul „H+" înseamnă recunoaștere automată; „H-" sau „H+/-" înseamnă caz cu caz.</p>
<h2>ZAB — Zentralstelle für ausländisches Bildungswesen</h2>
<p>Pentru a primi <strong>Zeugnisbewertung</strong> (atestat oficial de comparabilitate):</p>
<ol>
<li>Cerere online pe <strong>kmk.org/zab</strong></li>
<li>Documente: copie diplomă + traducere oficială, foaie matricolă + traducere, copie act identitate</li>
<li>Plată: <strong>200€</strong></li>
<li>Procesare: <strong>3 luni</strong> (poate dura mai mult)</li>
</ol>
<p>Atestatul ZAB este folosit pentru: angajare, concursuri publice, înscriere doctorat, viza Blue Card.</p>
<h2>Profesii reglementate — Anerkennung</h2>
<p>Pentru aceste profesii, e nevoie de <strong>Anerkennung</strong> (recunoaștere completă), nu doar Zeugnisbewertung:</p>
<ul>
<li><strong>Medic</strong>: Approbation la Landesärztekammer + Kenntnisprüfung sau ușor pentru UE</li>
<li><strong>Asistent medical</strong>: Anerkennung la autoritatea sănătății din land + eventual modul de adaptare</li>
<li><strong>Profesor</strong>: Lehramtsanerkennung — adesea cere refacerea unei părți din studii</li>
<li><strong>Inginer</strong>: protejat doar titlul „Ingenieur" — dacă vrei să-l porți oficial, cerere la camera inginerilor</li>
<li><strong>Avocat</strong>: foarte complex, examen german complet</li>
</ul>
<h2>Pentru români — UE</h2>
<p>Diplomele românești sunt <strong>recunoscute automat</strong> în multe cazuri datorită Procesului Bologna. Pentru profesii reglementate, directiva UE 2005/36/CE oferă procedură simplificată.</p>
<h2>Pentru moldoveni — non-UE</h2>
<p>Diplomele moldovenești necesită:</p>
<ul>
<li><strong>Apostilă</strong> de la Ministerul Justiției din Moldova</li>
<li><strong>Traducere</strong> de un traducător agreat în Germania (vereidigte Übersetzer — listă pe justiz-dolmetscher.de)</li>
<li>Procedura ZAB este mai detaliată dar accesibilă</li>
</ul>
<h2>Ajutor financiar și consultanță</h2>
<ul>
<li><strong>Anerkennungszuschuss</strong>: până la 600€ pentru costurile recunoașterii (la persoane cu venituri mici)</li>
<li><strong>IQ Netzwerk</strong>: consultanță gratuită în 16 landuri (netzwerk-iq.de)</li>
<li><strong>BAMF</strong>: cursuri integrare + consultanță profesională</li>
</ul>
<h2>În paralel — învață germana</h2>
<p>Fără <strong>B2 minim</strong> (C1 pentru profesii medicale), recunoașterea va rămâne pe hârtie. Cursuri integrare BAMF: gratuite/reduse pentru cetățenii cu Aufenthaltstitel.</p>
<p><strong>Sursă oficială:</strong> <a href="https://www.kmk.org/zab" target="_blank" rel="noopener">ZAB</a> · <a href="https://anabin.kmk.org" target="_blank" rel="noopener">Anabin</a></p>`,
  },
  {
    slug: "titlu-sedere-germania",
    title: "Titlul de ședere în Germania — diferențe pentru români și moldoveni",
    excerpt:
      "Românii UE au libertate de mișcare. Moldovenii au nevoie de viză + Aufenthaltstitel. Iată regulile 2026.",
    coverImage:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "drepturi",
    countries: ["de"],
    readingTime: 7,
    content: `<p>Statutul tău juridic în Germania depinde de cetățenia ta. <strong>Românii</strong> sunt cetățeni UE — drept de muncă imediat. <strong>Moldovenii</strong> au nevoie de viză + Aufenthaltstitel. Iată ghidul detaliat.</p>
<h2>Pentru români — UE</h2>
<p>Ca cetățean român, ai dreptul să locuiești și să muncești în Germania <strong>fără viză sau permis</strong>. Singura obligație:</p>
<ul>
<li><strong>Anmeldung</strong> la Bürgeramt în 14 zile de la mutare</li>
<li>Asigurare de sănătate obligatorie</li>
<li>După 5 ani: poți cere <strong>Daueraufenthaltsbescheinigung-EU</strong> (rezident permanent UE) — opțional</li>
</ul>
<p><strong>Carte de șomaj</strong>: ai dreptul după minim 12 luni de cotizație în Germania (sau cumulat în UE prin formularul U1 din România).</p>
<h2>Pentru moldoveni — non-UE</h2>
<p>Ai nevoie de viză înainte de a veni. Tipurile principale:</p>
<h3>Viza de muncă</h3>
<ul>
<li><strong>Fachkräfte (lucrători calificați)</strong>: cu diplomă recunoscută + contract de muncă</li>
<li><strong>EU Blue Card</strong>: salariu brut ≥ 48.300€/an (2026) sau 43.760€ pentru profesii deficitare (IT, medici, ingineri)</li>
<li><strong>Chancenkarte</strong> (din 2024): viză de un an pentru a căuta loc de muncă, pe sistem de puncte</li>
<li><strong>Au-Pair</strong>: 18-26 ani, 1 an maxim</li>
</ul>
<h3>Viza de studiu</h3>
<ul>
<li>Înscriere la o universitate germană</li>
<li>Probă de finanțare: cont blocat <strong>11.904€</strong> (2026, ~992€/lună × 12 luni)</li>
<li>Asigurare de sănătate</li>
<li>Permite muncă 140 zile/an (sau 240 jumătăți de zi)</li>
</ul>
<h3>Viza de reunificare familială</h3>
<ul>
<li>Soț/soție de cetățean german sau cu titlu de ședere</li>
<li>Necesită nivel A1 germană înainte de a veni</li>
<li>Convertibil în Niederlassungserlaubnis după 3 ani</li>
</ul>
<h2>Aufenthaltstitel după sosire</h2>
<p>Programare la <strong>Ausländerbehörde</strong> (autoritatea pentru străini) în primele 90 de zile:</p>
<ol>
<li>Anmeldung deja făcut</li>
<li>Documente: viza, contract muncă/înscriere universitate, probă financiară, asigurare</li>
<li>Plata taxei: 100€ (eliberare), 80-100€ (reînnoire)</li>
<li>Primești <strong>elektronischer Aufenthaltstitel (eAT)</strong> — card cu cip</li>
</ol>
<h2>Niederlassungserlaubnis — rezident permanent</h2>
<p>După <strong>5 ani</strong> de Aufenthaltstitel (3 ani cu Blue Card + B1 germană):</p>
<ul>
<li>Resurse stabile + asigurare</li>
<li>Cunoștințe germană B1</li>
<li>Cunoștințe sistem juridic și social (Einbürgerungstest)</li>
<li>Locuință adecvată</li>
<li>Cazier judiciar curat</li>
</ul>
<h2>Cetățenie germană — 2024 reformă majoră</h2>
<p>Din iunie 2024, Germania permite <strong>dublă cetățenie</strong>! Condiții (2026):</p>
<ul>
<li><strong>5 ani</strong> de ședere legală (3 ani pentru integrare excepțională: B1 → C1, voluntariat)</li>
<li>B1 germană obligatoriu (C1 pentru excepție)</li>
<li>Test de cetățenie</li>
<li>Resurse fără ajutoare sociale</li>
<li>Recunoașterea valorilor democratice</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.bamf.de" target="_blank" rel="noopener">bamf.de</a> · <a href="https://www.make-it-in-germany.com" target="_blank" rel="noopener">make-it-in-germany.com</a></p>`,
  },
  {
    slug: "inscriere-kita-scoala-germania",
    title: "Înscrierea copilului la Kita sau școală în Germania",
    excerpt:
      "Sistem școlar german, cum obții un loc de Kita, Grundschule și pașii pentru părinții români/moldoveni.",
    coverImage:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "viata-practica",
    countries: ["de"],
    readingTime: 6,
    content: `<p>În Germania, școala este <strong>obligatorie de la 6 ani</strong>. Înainte, există grădinițe (Kindergarten) și creșe (Krippe), grupate sub denumirea <strong>Kita</strong>. Iată cum să înscrii copilul.</p>
<h2>Sistem școlar pe scurt</h2>
<ul>
<li><strong>Krippe</strong> (creșă): 0-3 ani — opțional</li>
<li><strong>Kindergarten</strong>: 3-6 ani — opțional dar puternic recomandat (gratuit în multe landuri)</li>
<li><strong>Grundschule</strong>: 6-10 ani (4 ani) — obligatorie</li>
<li>După Grundschule, sistem împărțit în 3 (în funcție de land):
  <ul>
    <li><strong>Hauptschule</strong>: pregătire profesională</li>
    <li><strong>Realschule</strong>: gradul mediu</li>
    <li><strong>Gymnasium</strong>: pentru universitate (Abitur la 18 ani)</li>
  </ul>
</li>
<li><strong>Gesamtschule</strong>: combină cele 3, alegere mai târzie</li>
</ul>
<h2>Kita — locuri foarte căutate</h2>
<p>Cererea depășește oferta în orașele mari (Berlin, München, Hamburg). Începe căutarea <strong>din timpul sarcinii</strong>!</p>
<h3>Cum funcționează Kita-Gutschein (în multe landuri)</h3>
<ol>
<li>Cere <strong>Kita-Gutschein</strong> (cupon) la primăria orașului — definește orele garantate (5h/zi, 7h, 9h)</li>
<li>Cu cuponul, cauți tu Kita disponibilă (lista pe site-ul orașului)</li>
<li>Înscriere directă la Kita aleasă</li>
<li><strong>Costuri</strong>: gratuite (Berlin, Hamburg, RLP) sau 50-300€/lună în alte landuri</li>
</ol>
<h3>Tipuri de Kita</h3>
<ul>
<li><strong>Public</strong>: gestionate de oraș, gratis sau ieftin</li>
<li><strong>Confesional</strong> (catolic, protestant): de obicei gratuite în Berlin, ușor mai scumpe în alte landuri</li>
<li><strong>Privat</strong> (Bilingual, Montessori): 300-1500€/lună</li>
<li><strong>Tagesmutter</strong> (dădacă agreată acasă): 500-900€/lună (parte rambursată de oraș)</li>
</ul>
<h2>Înscrierea la școală</h2>
<p>Copilul trebuie să fi împlinit <strong>6 ani până la 30 iunie</strong> al anului școlar (Stichtag). Procedura:</p>
<ol>
<li>Primești scrisoare de la Schulamt cu școala alocată (după sectorizare)</li>
<li>Mergi cu copilul la <strong>Schuleingangsuntersuchung</strong> (vizită medicală obligatorie) la Gesundheitsamt</li>
<li>Înscriere la școală cu: certificat de naștere (tradus), Anmeldung, fișa medicală, copie pașaport</li>
<li>Cumpărături: cartă școlară, Schultüte (cornet de cadouri tradiție germană pentru prima zi)</li>
</ol>
<h2>Sosire la jumătatea anului</h2>
<p>Dacă vii cu copilul în timpul anului școlar, contactează <strong>Schulamt</strong> al orașului. Copilul este alocat la cea mai apropiată școală cu locuri.</p>
<h3>Vorbereitungsklasse / Willkommensklasse</h3>
<p>Pentru copiii care nu vorbesc germana: clase speciale 6-12 luni pentru a învăța limba înainte de integrare în clasă regulată.</p>
<h2>Costuri ascunse</h2>
<ul>
<li><strong>Mensa</strong> (cantină): 50-90€/lună</li>
<li><strong>Materiale școlare</strong>: 100-200€/an (cărți cumpărate sau împrumutate)</li>
<li><strong>Excursii și clase verzi</strong>: 100-500€/an</li>
<li><strong>Bildungspaket</strong>: ajutoare pentru familii cu venituri mici (cumpărături școlare, pranz, excursii)</li>
</ul>
<h2>Ce să faci dacă școala te respinge</h2>
<p>Toți copiii au drept la școală. Dacă ești refuzat, contactează <strong>Schulamt</strong> sau asociațiile pentru drepturile imigranților (de exemplu Caritas, Diakonie).</p>
<p><strong>Sursă oficială:</strong> <a href="https://www.kmk.org" target="_blank" rel="noopener">Kultusministerkonferenz</a></p>`,
  },
  {
    slug: "inchiriere-locuinta-germania-schufa",
    title: "Cum să închiriezi un apartament în Germania (SCHUFA, Mietvertrag)",
    excerpt:
      "Dosarul perfect, ce este SCHUFA și cum eviți capcanele pieței imobiliare germane.",
    coverImage:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "viata-practica",
    countries: ["de"],
    readingTime: 7,
    content: `<p>Piața locativă germană este foarte competitivă, mai ales în orașele mari. Proprietarii primesc 50-200 cereri pentru un apartament. Iată cum să le câștigi.</p>
<h2>Dosarul perfect — Mietermappe</h2>
<p>Trebuie să-l ai gata înainte de a începe căutarea. Conține:</p>
<ul>
<li><strong>Selbstauskunft</strong>: formular cu datele tale (descărcabil online sau cere la proprietar)</li>
<li><strong>SCHUFA-BonitätsAuskunft</strong>: certificat de fiabilitate financiară (~30€)</li>
<li>Copie pașaport / Aufenthaltstitel</li>
<li><strong>3 ultime fluturași de salariu</strong> (Lohnabrechnung)</li>
<li>Contract de muncă</li>
<li><strong>Mietschuldenfreiheitsbescheinigung</strong>: atestare de la proprietarul precedent că nu datorezi chirie</li>
<li>Anmeldebestätigung (sau intenție de Anmeldung)</li>
</ul>
<h2>Ce este SCHUFA?</h2>
<p><strong>SCHUFA</strong> este biroul de credit german. Cuantifică fiabilitatea ta de a plăti. Scor de 100% = excelent, peste 90% = bun. Cum o obții:</p>
<ol>
<li>Mergi pe <strong>meineschufa.de</strong> sau pe <strong>immobilienscout24.de</strong> (parteneriat)</li>
<li>Plătește 30€</li>
<li>Primești prin email/poștă în 24-48h</li>
<li>O dată/an, poți cere SCHUFA <strong>gratuită</strong> (Datenkopie nach §15 DSGVO) — dar are nevoie de 2-4 săptămâni</li>
</ol>
<h3>Nu ai SCHUFA? (proaspăt sosit)</h3>
<ul>
<li>Cere o atestare „Kein Eintrag" (fără inscripție negativă)</li>
<li>Oferă <strong>3 luni de chirie depozit</strong> (Kaution maximă legală)</li>
<li>Garant (Bürge) cu venituri stabile</li>
<li>Câteva luni de chirie plătite în avans</li>
</ul>
<h2>Mietvertrag — contractul</h2>
<p>Atenție la aceste clauze:</p>
<ul>
<li><strong>Kaltmiete</strong> vs <strong>Warmmiete</strong>: Kaltmiete = chirie netă, Warmmiete = + Nebenkosten (apă, încălzire, etc.). Întrebă întotdeauna ce este inclus!</li>
<li><strong>Kaution</strong>: maxim 3 luni de chirie netă, plătite într-un cont blocat (poți cere proba)</li>
<li><strong>Indextmiete</strong>: chiria crește automat cu inflația — verifică</li>
<li><strong>Staffelmiete</strong>: chiria crește la date predefinite</li>
<li><strong>Kündigungsfrist</strong>: termen de preaviz, în general 3 luni</li>
</ul>
<h2>Capcane frecvente</h2>
<ul>
<li><strong>Schwarzwohnen</strong>: nu locui fără Anmeldung — se declanșează amendă de până la 1.000€</li>
<li><strong>Ablöse</strong>: proprietarul anterior îți cere bani pentru bucătărie/mobilier — verifică starea reală</li>
<li><strong>Maklerprovision</strong>: din 2015, plătește cel care îl angajează (de obicei proprietarul). Dacă o cere de la tine ilegal, refuză</li>
<li><strong>Trick-uri Airbnb / fictive</strong>: niciodată plată în avans fără să fi văzut apartamentul</li>
</ul>
<h2>Site-uri utile</h2>
<ul>
<li><strong>ImmobilienScout24, Immowelt, Immonet</strong>: cele mai mari portaluri</li>
<li><strong>WG-Gesucht</strong>: pentru camere în colocație</li>
<li><strong>eBay Kleinanzeigen</strong>: anunțuri direct de la proprietari, dar atenție la escrocherii</li>
<li>Grupuri Facebook diaspora: rapide pentru WG-uri</li>
</ul>
<h2>Locuri sociale (Sozialwohnung)</h2>
<p>Cu venituri mici, poți obține <strong>Wohnberechtigungsschein (WBS)</strong> de la oraș, care îți deschide accesul la apartamente cu chirie redusă. Lista de așteptare însă: 1-3 ani.</p>
<p><strong>Sursă oficială:</strong> <a href="https://www.mieterbund.de" target="_blank" rel="noopener">Deutscher Mieterbund</a></p>`,
  },
  {
    slug: "deschidere-cont-bancar-germania",
    title: "Deschiderea unui cont bancar în Germania (Girokonto)",
    excerpt:
      "Bănci tradiționale vs N26/Revolut, ce documente sunt cerute și cum eviți comisioanele inutile.",
    coverImage:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "finante",
    countries: ["de"],
    readingTime: 5,
    content: `<p>În Germania, fără <strong>Girokonto</strong> (cont curent) nu ai salariu, chirie, SCHUFA, nimic. Iată cum să-l deschizi rapid și fără bătaie de cap.</p>
<h2>Documente cerute</h2>
<ul>
<li>Pașaport sau carte de identitate valabile</li>
<li><strong>Anmeldebestätigung</strong> (înregistrare la primărie) — esențial pentru bănci tradiționale</li>
<li>Steuer-ID (poate fi cerut după)</li>
<li>Justificatif de venituri (contract de muncă, fluturaș) — pentru anumite bănci</li>
<li>Aufenthaltstitel (pentru moldoveni)</li>
</ul>
<h2>Bănci tradiționale</h2>
<ul>
<li><strong>Sparkasse</strong>: prezentă peste tot, agenții locale, taxă lunară 5-10€</li>
<li><strong>Volksbank / Raiffeisenbank</strong>: rețea cooperatistă similară</li>
<li><strong>Deutsche Bank, Commerzbank</strong>: clasici, gratuite cu condiții (salariu lunar minim)</li>
<li><strong>Postbank</strong>: filială Deutsche Bank, agenții în oficiile poștale</li>
</ul>
<h2>Bănci online (Direktbanken)</h2>
<p>Mai ieftine, deschidere rapidă (24-48h prin video-identificare):</p>
<ul>
<li><strong>DKB</strong> — Girokonto gratuit, retrageri gratuite în EUR în lume</li>
<li><strong>ING Deutschland</strong> — gratuit cu intrări regulate</li>
<li><strong>comdirect</strong> — bună pentru investiții</li>
<li><strong>Consorsbank</strong> — alternativă</li>
</ul>
<h2>Neobănci (cu IBAN german)</h2>
<ul>
<li><strong>N26</strong> — fondată în Berlin, IBAN german (DE), aplicație excelentă, gratuită cu limite</li>
<li><strong>Vivid Money</strong> — IBAN german, oferte cashback</li>
<li><strong>bunq</strong> — IBAN olandez (NL) — atenție: <strong>nu este acceptat</strong> de unele administrații</li>
<li><strong>Revolut, Wise</strong> — IBAN lituanian/belgian — utile pentru transfer dar NU recomandat ca cont principal</li>
</ul>
<h2>De ce contează IBAN-ul german (DE)?</h2>
<p>Multe administrații, asigurări, proprietari refuză IBAN-uri non-DE pentru:</p>
<ul>
<li>Plata chiriei (cu Lastschrift / debit direct)</li>
<li>Salariu (unele angajatori bavarezi/sași)</li>
<li>Asigurări de sănătate (deși SEPA o cere prin lege, multe Krankenkassen refuză în practică)</li>
</ul>
<h2>Basiskonto — drept la cont</h2>
<p>Din 2016, fiecare bancă în Germania <strong>trebuie</strong> să-ți deschidă un cont de bază (Basiskonto). Refuzul este ilegal cu excepții foarte limitate. Costuri legale: maxim 7-10€/lună. Util pentru:</p>
<ul>
<li>Cei fără SCHUFA</li>
<li>Solicitanți de azil</li>
<li>Persoane fără adresă fixă</li>
</ul>
<p>Dacă ești refuzat, sesizează <strong>BaFin</strong> (autoritatea bancară federală).</p>
<h2>Sfaturi practice</h2>
<ul>
<li>Pregătește toate documentele <strong>înainte</strong> de a merge la bancă</li>
<li>Verifică taxele lunare ascunse — multe bănci anunță „gratuit" cu condiții</li>
<li>Pentru transferuri către România/Moldova, folosește <strong>Wise</strong> sau <strong>Revolut</strong> (taxe mult mai mici decât băncile tradiționale)</li>
<li>Activează <strong>Online-Banking</strong> imediat — esențial pentru SEPA-Lastschrift</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.bafin.de" target="_blank" rel="noopener">BaFin — Basiskonto</a></p>`,
  },
  {
    slug: "permis-conducere-germania",
    title: "Permisul de conducere în Germania — schimb sau echivalare",
    excerpt:
      "Ce să faci cu permisul tău românesc / moldovenesc în Germania și cum îl convertești dacă e necesar.",
    coverImage:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "drepturi",
    countries: ["de"],
    readingTime: 5,
    content: `<p>Vii în Germania cu permis românesc sau moldovenesc? Regulile diferă mult între cele două. Iată ghidul complet 2026.</p>
<h2>Pentru români — UE</h2>
<p>Permisul românesc este <strong>direct valabil în Germania pe toată durata sa</strong> (fără limită de timp, fără schimb obligatoriu). Singura excepție:</p>
<ul>
<li>Dacă a fost <strong>emis înainte de 19 ianuarie 2013</strong> și expiră, trebuie să-l înlocuiești cu permis german (sau român format nou)</li>
<li>Dacă comiti o infracțiune rutieră în Germania, autoritățile pot cere conversia</li>
</ul>
<h3>Conversie voluntară</h3>
<p>Mulți români aleg să-l convertească la permis german pentru:</p>
<ul>
<li>Sistemul de puncte se aplică pe permis german</li>
<li>Pierdere/furt: mai ușor de duplicat în Germania</li>
<li>După reînnoiere, cardul e german</li>
</ul>
<p>Procedură la <strong>Führerscheinstelle</strong> al orașului tău: copie permis, fotografie, certificat ochi (Sehtest), 35-40€. Nu necesită examen!</p>
<h2>Pentru moldoveni — non-UE</h2>
<p>Permisul moldovenesc este valabil <strong>doar 6 luni</strong> de la data Anmeldung-ului. Apoi:</p>
<ul>
<li>SAU îl convertești cu probă (Umschreibung)</li>
<li>SAU dai permisul german de la zero</li>
</ul>
<h3>Acordul de echivalare Moldova-Germania</h3>
<p>Există <strong>echivalare parțială</strong>. În funcție de categoria și data emiterii:</p>
<ul>
<li><strong>Categoria B</strong> (autoturism): de obicei conversie cu <strong>examen practic + teoretic</strong></li>
<li>Pentru permise emise după 2009 cu format european: condiții mai favorabile (depinde de Bundesland)</li>
<li>În unele landuri (Bavaria, Saxa): doar examen practic</li>
</ul>
<h3>Documente pentru conversie</h3>
<ul>
<li>Permisul moldovenesc original + traducere oficială (de un vereidigte Übersetzer)</li>
<li>Apostilă (Ministerul Justiției Moldova)</li>
<li>Atestare de la autoritatea moldoveană că permisul e valabil</li>
<li>Certificat ochi (Sehtest, ~7€ la optician)</li>
<li>Curs de prim ajutor (Erste-Hilfe-Kurs, ~30€, 9 ore)</li>
<li>2 fotografii biometrice</li>
<li>Anmeldung + Aufenthaltstitel</li>
<li>Plata taxelor: 35-150€ în funcție de procedură</li>
</ul>
<h3>Examenul (dacă e cerut)</h3>
<ul>
<li><strong>Teoretic</strong>: 30 întrebări, max 10 puncte minus (în germană sau câteva limbi străine — uneori și română)</li>
<li><strong>Practic</strong>: 45 minute cu examinator TÜV/DEKRA</li>
<li>Costuri totale (curs + examen): <strong>500-1500€</strong></li>
</ul>
<h2>Permis de la zero — mai scump dar fiabil</h2>
<p>Dacă conversia e dificilă sau refuzată:</p>
<ul>
<li><strong>Fahrschule</strong> (școală de șoferi): 14 lecții teorie + 12 lecții circulație (minim) — <strong>2.500-3.500€</strong></li>
<li>Examen teoretic la TÜV/DEKRA</li>
<li>Examen practic</li>
<li>Permis valabil pe toată viața</li>
</ul>
<h2>Atenție</h2>
<ul>
<li>După cele 6 luni autorizate, dacă conduci cu permis moldovenesc neschimbat, ești <strong>fără permis</strong> și riști amendă mare + închiriere imposibilă a mașinii</li>
<li>Internațional Driving Permit (IDP) NU prelungește valabilitatea — e doar traducere oficială</li>
<li>Pentru profesii (camionagiu, taximetrist, șofer autocar): cerințe suplimentare (Modul 95, Personenbeförderungsschein)</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.bmvi.de" target="_blank" rel="noopener">Bundesministerium für Verkehr</a></p>`,
  },
  // ============== ITALY (IT) ==============
  {
    slug: "tessera-sanitaria-ssn-italia",
    title: "Tessera Sanitaria și SSN — sistemul de sănătate italian",
    excerpt:
      "Cum te înscrii la SSN, alegi medicul de familie și obții Tessera Sanitaria în Italia.",
    coverImage:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "viata-practica",
    countries: ["it"],
    readingTime: 6,
    content: `<p><strong>SSN</strong> (Servizio Sanitario Nazionale) este sistemul public de sănătate italian — universal și aproape gratuit pentru rezidenți. <strong>Tessera Sanitaria</strong> e cardul tău magnetic care permite accesul la servicii. Iată cum o obții.</p>
<h2>Cine are dreptul la SSN?</h2>
<ul>
<li><strong>Cetățeni UE (români)</strong>: cu <strong>residenza</strong> înregistrată, dreptul e automat și gratuit</li>
<li><strong>Cetățeni non-UE (moldoveni)</strong>: cu Permesso di Soggiorno + contract de muncă sau studii — înscriere obligatorie</li>
<li><strong>Fără residenza dar cu CF (Codice Fiscale)</strong>: poți cumpăra <strong>iscrizione volontaria</strong> (~150-388€/an în funcție de venituri)</li>
</ul>
<h2>Pașii pentru înscriere</h2>
<ol>
<li>Obține <strong>Codice Fiscale</strong> la Agenzia delle Entrate</li>
<li>Înregistrează-te la <strong>residenza</strong> la primărie (Comune) — dossier cu contract chirie + Permesso (pentru moldoveni)</li>
<li>Mergi la <strong>ASL</strong> (Azienda Sanitaria Locale) cu: CF, Permesso/CI UE, contract de chirie, Anagrafica completată</li>
<li>Alege <strong>medicul de familie</strong> (Medico di Medicina Generale) din lista pusă la dispoziție</li>
<li>Primești <strong>Tessera Sanitaria</strong> prin poștă în 2-4 săptămâni</li>
</ol>
<h2>Tessera Sanitaria — ce conține?</h2>
<ul>
<li>Codice Fiscale (16 caractere, vizibil pe verso)</li>
<li>Cipul TS-CNS (Carta Nazionale dei Servizi) — pentru autentificarea online la servicii publice</li>
<li>Numărul de asigurare europeană (TEAM) pe verso — folosibil în UE</li>
</ul>
<h2>Ce e gratuit, ce nu</h2>
<p>SSN acoperă majoritatea serviciilor:</p>
<ul>
<li>Consultații medic de familie: <strong>gratuite</strong></li>
<li>Consultații specialiști cu rețetă: <strong>gratuite</strong> sau cu <strong>ticket</strong> (~25-50€)</li>
<li>Spitalizare: <strong>gratuită</strong></li>
<li>Medicamente: există categorii A (gratuite), C (plătite integral), H (în spital)</li>
<li>Stomatologie: doar urgențele și copiii sub 14 ani — restul privat</li>
<li>Optică: doar copiii și anumite categorii sociale</li>
</ul>
<h2>Excepții și ajutoare</h2>
<ul>
<li><strong>Esenzione per reddito</strong>: gratuit pentru venituri sub anumite praguri (cod E01-E04)</li>
<li><strong>Esenzione per patologia</strong>: pentru boli cronice (cod 0xx)</li>
<li><strong>Esenzione per età</strong>: copii sub 6 ani și persoane peste 65 cu venituri reduse</li>
</ul>
<h2>Schimbarea medicului de familie</h2>
<p>Poți schimba medicul oricând la ASL — gratuit și imediat. Util când te muți sau ești nemulțumit.</p>
<h2>Pentru cei fără residenza — STP / ENI</h2>
<ul>
<li><strong>STP</strong> (Straniero Temporaneamente Presente): cod pentru moldoveni fără permis dar care au nevoie de îngrijire urgentă</li>
<li><strong>ENI</strong> (Europeo Non Iscritto): cod pentru români fără residenza încă</li>
<li>Ambele acoperă urgențele și serviciile esențiale, gratuit</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.salute.gov.it" target="_blank" rel="noopener">Ministero della Salute</a></p>`,
  },
  {
    slug: "codice-fiscale-residenza-italia",
    title: "Codice Fiscale și Residenza — primii pași în Italia",
    excerpt:
      "Cum obții Codice Fiscale, te înregistrezi la primărie (Anagrafe) și de ce sunt esențiale.",
    coverImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "viata-practica",
    countries: ["it"],
    readingTime: 5,
    content: `<p>În Italia, fără <strong>Codice Fiscale</strong> și <strong>residenza</strong> nu poți face nimic: nici contract de muncă, nici de chirie, nici cont bancar. Iată ordinea pașilor.</p>
<h2>Codice Fiscale — primul pas</h2>
<p>Este codul tău fiscal de 16 caractere, calculat din nume + prenume + data nașterii + locul. <strong>Gratuit</strong>.</p>
<h3>Cum îl obții</h3>
<ol>
<li>Mergi la <strong>Agenzia delle Entrate</strong> (programare online sau direct)</li>
<li>Completează formular <strong>AA4/8</strong></li>
<li>Documente: pașaport sau CI UE valabil</li>
<li>Pentru moldoveni: + viza de intrare în spațiul Schengen sau Permesso</li>
<li>Primești <strong>imediat</strong> codul pe foaie A4 (cardul fizic e Tessera Sanitaria — vine după)</li>
</ol>
<p><strong>Pentru cei din afara Italiei</strong>: poți cere CF la consulatul italian din România/Moldova înainte de a veni.</p>
<h2>Residenza — cel mai important pas</h2>
<p>Este înregistrarea oficială la <strong>Anagrafe</strong> (registrul populației) al primăriei (Comune) tale. Fără ea:</p>
<ul>
<li>Nu poți avea Tessera Sanitaria</li>
<li>Nu poți primi multe ajutoare sociale</li>
<li>Nu poți obține Permesso permanent (pentru moldoveni)</li>
<li>Pierzi multe drepturi UE (pentru români)</li>
</ul>
<h3>Documente necesare</h3>
<ul>
<li><strong>Carta d'identità</strong> sau pașaport</li>
<li>Pentru moldoveni: <strong>Permesso di Soggiorno</strong> valabil</li>
<li><strong>Contract de chirie</strong> înregistrat la Agenzia delle Entrate (sau act de proprietate, sau atestare de găzduire ospitalitate)</li>
<li>Codice Fiscale</li>
<li>Pentru români: dovadă de muncă, studii, pensie sau resurse > 5.954€/an + asigurare de sănătate</li>
</ul>
<h3>Procedură</h3>
<ol>
<li>Programare la <strong>Anagrafe</strong> al Comune tău (online sau telefon)</li>
<li>Depune dosarul</li>
<li><strong>Vigilul Urban</strong> (poliția locală) trece la adresa ta în 30-45 zile pentru verificare</li>
<li>După verificare, primești <strong>Certificato di Residenza</strong></li>
</ol>
<h2>Atenție cu „residenza fittizia"</h2>
<p>NU folosi adrese false. Vigilul verifică prin vizite la fața locului. Riscul: anularea residenței + amendă + posibile probleme cu Permesso.</p>
<h2>Pentru români — clarificare</h2>
<p>Cetățenii UE pot sta <strong>3 luni fără residenza</strong>. După, dacă rămân, trebuie obligatoriu să ceară residenza. Nu există „cetățean UE care locuiește mereu fără residenza" în mod legal.</p>
<h2>Schimbarea adresei</h2>
<p>Trebuie să ceri <strong>cambio di residenza</strong> în 30 zile de la mutare. Procedură identică, doar că la noul Comune.</p>
<h2>Sezione consolare la consulatul italian</h2>
<p>Pentru moldoveni / români deja în Italia, atestările (acte naștere, căsătorie etc.) cer <strong>apostilă</strong> și traducere oficială de la consulat.</p>
<p><strong>Sursă oficială:</strong> <a href="https://www.agenziaentrate.gov.it" target="_blank" rel="noopener">Agenzia delle Entrate</a></p>`,
  },
  {
    slug: "assegno-unico-italia",
    title: "Assegno Unico — alocații familiale în Italia",
    excerpt:
      "Cât primești pentru fiecare copil, cum se calculează ISEE și cum ceri online prin INPS.",
    coverImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "finante",
    countries: ["it"],
    readingTime: 6,
    content: `<p>Din 2022, Italia a unificat alocațiile pentru copii într-un singur ajutor: <strong>Assegno Unico Universale</strong>. Iată cum funcționează în 2026.</p>
<h2>Cine are dreptul?</h2>
<ul>
<li>Cetățeni UE (români): cu residenza în Italia</li>
<li>Cetățeni non-UE (moldoveni): cu Permesso de cel puțin 1 an</li>
<li>Pentru fiecare copil: <strong>până la 18 ani</strong> (cu eligibilitate parțială până la 21 ani dacă studiază sau caută loc de muncă)</li>
<li>Copii cu handicap: <strong>fără limită de vârstă</strong></li>
</ul>
<h2>Cât primești?</h2>
<p>Suma depinde de <strong>ISEE</strong> (indicator de venit + patrimoniu al familiei) și de numărul de copii.</p>
<table>
<tr><th>ISEE</th><th>Per copil/lună</th></tr>
<tr><td>până la 17.227€</td><td>maxim ~199€</td></tr>
<tr><td>17.227 - 45.000€</td><td>diminuat progresiv</td></tr>
<tr><td>peste 45.574€ sau fără ISEE</td><td>minim 57€/lună</td></tr>
</table>
<h3>Bonusuri suplimentare</h3>
<ul>
<li>Mama tânără (< 21 ani): +20€/lună</li>
<li>Familie cu 3+ copii: +85-100€/copil</li>
<li>Copil cu handicap: +85-110€/lună</li>
<li>Ambii părinți lucrează: +30€/copil/lună</li>
</ul>
<h2>ISEE — esențial</h2>
<p>Pentru a primi suma maximă, trebuie să ai un ISEE valabil. Cum o obții:</p>
<ol>
<li>Adună documente: declarații venituri (CU, 730), conturi bancare la 31/12, proprietăți, acțiuni</li>
<li>Mergi la <strong>CAF</strong> (Centro di Assistenza Fiscale) — gratuit, sau patronat sindical</li>
<li>Completați împreună <strong>DSU</strong> (Dichiarazione Sostitutiva Unica)</li>
<li>Primești ISEE-ul în 10-15 zile</li>
<li>ISEE valabil <strong>1 an calendaristic</strong> — actualizează la fiecare ianuarie</li>
</ol>
<h2>Cum ceri Assegno Unico?</h2>
<ol>
<li>Loghează-te pe <strong>inps.it</strong> cu SPID, CIE sau CNS</li>
<li>Caută „Assegno Unico Universale"</li>
<li>Completează formular cu datele copiilor + IBAN</li>
<li>Atașează ISEE (se preia automat din baza INPS de obicei)</li>
<li>Trimite cerere</li>
</ol>
<p><strong>Plata începe</strong>: din luna următoare cererii. Cererile depuse în primele 6 luni ale anului dau drept retroactiv la 1 martie. Cele depuse după <strong>nu sunt retroactive</strong>.</p>
<h2>Pentru moldoveni</h2>
<p>Necesită Permesso de cel puțin 1 an. Cu <strong>Permesso UE per soggiornanti di lungo periodo</strong> (după 5 ani), drepturile sunt similare cu cetățenii italieni.</p>
<h2>Bonus Asilo Nido</h2>
<p>Pe lângă Assegno Unico, există <strong>Bonus Asilo Nido</strong>: până la <strong>3.000€/an</strong> pentru creșă (publică sau privată). Cerere separată pe inps.it.</p>
<h2>Bonus Bebè / Premio alla Nascita</h2>
<p><strong>800€</strong> la nașterea sau adopția unui copil — cerere în primele 7 luni de viață.</p>
<h2>Atenție</h2>
<ul>
<li>Trebuie să declari toate veniturile, inclusiv din România/Moldova (chirii, conturi)</li>
<li>Dacă copilul trăiește în România/Moldova, suma poate fi plafonată conform regulilor UE</li>
<li>Sancțiunile pentru fraudă: rambursare totală + amendă + posibile probleme cu Permesso</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.inps.it" target="_blank" rel="noopener">INPS — Assegno Unico</a></p>`,
  },
  {
    slug: "dichiarazione-redditi-italia",
    title: "Dichiarazione dei redditi — declarația de impozite în Italia",
    excerpt:
      "730 vs Modello Redditi, cum o faci online sau prin CAF, ce poți deduce pentru a recupera bani.",
    coverImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "finante",
    countries: ["it"],
    readingTime: 7,
    content: `<p>În Italia, declarația de impozite se face anual. <strong>Modelul 730</strong> pentru salariați/pensionari și <strong>Modello Redditi</strong> pentru toți ceilalți. Iată cum procedezi în 2026.</p>
<h2>Cine trebuie să declare?</h2>
<ul>
<li>Toți rezidenții fiscali (peste 183 zile/an în Italia)</li>
<li>Cu venituri care depășesc <strong>8.000€/an</strong> (salariați) sau <strong>4.800€</strong> (alte tipuri)</li>
<li>Având chirii, locații imobiliare, autoîntreprinzători (Partita IVA)</li>
</ul>
<p>Chiar dacă ai un singur loc de muncă cu impozit reținut la sursă, e adesea avantajos să declari pentru a deduce cheltuielile (rambursare medie: 700-1500€).</p>
<h2>Calendar 2026</h2>
<ul>
<li><strong>Aprilie</strong>: Modello 730 precompilat e disponibil pe site-ul Agenzia Entrate</li>
<li><strong>30 septembrie 2026</strong>: termen pentru 730</li>
<li><strong>30 noiembrie 2026</strong>: termen pentru Modello Redditi</li>
<li>Eventuale plăți: în iulie (acont) și noiembrie (saldo)</li>
</ul>
<h2>Modello 730 — pentru salariați</h2>
<p>Avantajul: rambursarea vine direct prin <strong>flutuștul de salariu</strong> (în iulie/august), nu trebuie să aștepți cec sau virament.</p>
<h3>Cum o faci</h3>
<ol>
<li><strong>Direct online</strong>: pe <strong>agenziaentrate.gov.it</strong> cu SPID/CIE/CNS — formularul e precompletat cu date din CU, dobânzi bancare, etc.</li>
<li><strong>Prin CAF</strong>: gratuit pentru ISEE mic, plătit (~50-150€) pentru restul. Cel mai sigur dacă ai cazul complicat.</li>
<li><strong>Comercialist privat (commercialista)</strong>: 100-300€, util pentru cazuri complexe</li>
<li><strong>Prin angajator</strong>: dacă oferă serviciul</li>
</ol>
<h2>Deduceri (Detrazioni) și cheltuieli (Oneri Detraibili)</h2>
<p>Cele mai utile pentru diaspora:</p>
<ul>
<li><strong>Cheltuieli medicale</strong>: 19% din suma peste 129,11€/an (medicamente, consultații, analize)</li>
<li><strong>Chirie</strong>: până la 991,60€/an (locuință principală tinerilor sub 31 ani: 991,60€ + diminuare progresivă)</li>
<li><strong>Pensione integrative</strong>: până la 5.164,57€/an deductibili integral</li>
<li><strong>Asigurare de viață</strong>: 19% până la 530€/an</li>
<li><strong>Asilo Nido</strong>: 19% până la 632€/copil/an</li>
<li><strong>Sport copii (5-18 ani)</strong>: 19% până la 210€/copil</li>
<li><strong>Donații</strong>: 30% pentru ONG, 26% pentru partide politice etc.</li>
<li><strong>Bonus Edilizi</strong>: până la 36-50% din cheltuielile de renovare locuință</li>
</ul>
<h2>Special pentru diaspora</h2>
<h3>Familie acasă (în România/Moldova)</h3>
<p>Dacă trimiți bani pentru întreținerea soțului/soției, copiilor sau părinților rămași în România/Moldova, poți deduce <strong>până la 1.812€/an</strong> per persoană dependentă în carică.</p>
<h3>Conturi bancare străine — RW</h3>
<p>Trebuie declarate în <strong>quadrul RW</strong> dacă suma cumulată > 5.000€ în orice moment al anului (sau valoare medie > 15.000€). <strong>IVAFE</strong>: impozit de 0,2% pe valoarea anuală a conturilor străine. Sancțiuni grele pentru nedeclarare.</p>
<h3>Convenții împotriva dublei impuneri</h3>
<p>Italia are acorduri cu România și Moldova. Veniturile impozitate în România/Moldova nu sunt impozitate din nou în Italia, dar trebuie declarate (cu credit fiscal).</p>
<h2>Modello Redditi — pentru independenți</h2>
<p>Dacă ai <strong>Partita IVA</strong>, chirii, capital, sau alte venituri non-salariale: trebuie Modello Redditi. Mai complex — recomandat <strong>commercialista</strong>.</p>
<h2>Sancțiuni</h2>
<ul>
<li>Întârziere până la 90 zile: 25€ + 0,1% lunar</li>
<li>Omisiune declarație: 120-240% din impozitul datorat</li>
<li>Nedeclararea conturilor străine (RW): 3-15% din valoare</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.agenziaentrate.gov.it" target="_blank" rel="noopener">Agenzia delle Entrate</a></p>`,
  },
  {
    slug: "recunoastere-diplome-italia",
    title: "Recunoașterea diplomelor românești și moldovenești în Italia",
    excerpt:
      "CIMEA, Equipollenza, profesii reglementate — cum să-ți faci diploma valabilă în Italia.",
    coverImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "drepturi",
    countries: ["it"],
    readingTime: 6,
    content: `<p>Sistemul italian distinge mai multe tipuri de recunoaștere a diplomelor străine. Iată ce e potrivit pentru tine în 2026.</p>
<h2>3 tipuri de recunoaștere</h2>
<ul>
<li><strong>Equipollenza</strong>: recunoaștere academică completă (continuare studii la universitate italiană)</li>
<li><strong>Equivalenza</strong>: recunoaștere profesională (acces la concursuri publice și anumite locuri de muncă)</li>
<li><strong>Dichiarazione di valore</strong>: atestare de la consulat — valoare informativă, nu legală</li>
</ul>
<h2>CIMEA — primul pas</h2>
<p><strong>CIMEA</strong> (Centro Informazioni sulla Mobilità e le Equivalenze Accademiche) este punctul de contact ENIC-NARIC pentru Italia. Eliberează:</p>
<ul>
<li><strong>Statement of Comparability</strong>: comparație cu sistem italian (~100€, 30-60 zile)</li>
<li><strong>Statement of Verification</strong>: verifică autenticitatea diplomei (~100€)</li>
<li><strong>Attestato di comparabilità</strong>: pentru profesii reglementate</li>
</ul>
<p>Cerere online pe <strong>cimea.it</strong>.</p>
<h2>Pentru continuarea studiilor (Equipollenza)</h2>
<p>Procedura se face direct la universitatea italiană unde vrei să te înscrii:</p>
<ol>
<li>Contactează biroul „Studenți internaționali"</li>
<li>Documente: diplomă + foaie matricolă + traduceri oficiale + Dichiarazione di valore (sau Statement CIMEA)</li>
<li>Universitatea decide: equipollenza completă, parțială (cu materii de recuperat) sau refuz</li>
</ol>
<h2>Profesii reglementate — proceduri specifice</h2>
<ul>
<li><strong>Medic</strong>: Ministero della Salute + eventual examen + stagiu</li>
<li><strong>Asistent medical</strong>: Regione + IPASVI + uneori curs de adaptare</li>
<li><strong>Avocat</strong>: examen de stat + Albo Avvocati</li>
<li><strong>Inginer, arhitect</strong>: Ordini Professionali</li>
<li><strong>Profesor</strong>: MIUR (acum Ministero dell'Istruzione e del Merito)</li>
<li><strong>Psiholog</strong>: Ordine degli Psicologi + uneori examen + tirocinio</li>
</ul>
<h2>Pentru români — UE</h2>
<p>Diplomele românești beneficiază de <strong>directiva UE 2005/36/CE</strong> pentru profesii reglementate — procedură simplificată cu termen de 4 luni.</p>
<h2>Pentru moldoveni — non-UE</h2>
<p>Documente necesare:</p>
<ul>
<li><strong>Apostilă</strong> de la Ministerul Justiției din Moldova</li>
<li><strong>Traducere oficială</strong> de un traducător jurat în Italia (lista la Tribunal)</li>
<li><strong>Dichiarazione di valore</strong> de la consulatul italian în Moldova (sau, alternativ, Statement of Comparability CIMEA — preferat din 2018)</li>
<li>Foaie matricolă cu toate notele</li>
</ul>
<h2>Concursuri publice (Equivalenza)</h2>
<p>Pentru a participa la concursurile publice italiene cu o diplomă străină, trebuie <strong>Equivalenza</strong>:</p>
<ol>
<li>Cerere la <strong>Dipartimento Funzione Pubblica</strong></li>
<li>Documente: diplomă + Dichiarazione di valore + traduceri</li>
<li>Procedură: 6-12 luni</li>
<li>Validitate: doar pentru concursul respectiv (uneori extensibilă)</li>
</ol>
<h2>Limba italiană — esențial</h2>
<p>Pentru orice procedură de recunoaștere, e cerut <strong>nivel B2 minim</strong> (C1 pentru profesii medicale). Certificate acceptate: CILS, CELI, PLIDA.</p>
<h2>Costuri totale estimate</h2>
<ul>
<li>Apostilă, traduceri, Dichiarazione di valore: 200-500€</li>
<li>CIMEA (dacă e cerut): 100€</li>
<li>Cursuri de adaptare (pentru profesii reglementate): 500-3000€</li>
<li>Examene (avocat, medic): 100-500€</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.cimea.it" target="_blank" rel="noopener">CIMEA</a> · <a href="https://www.miur.gov.it" target="_blank" rel="noopener">Ministero dell'Istruzione</a></p>`,
  },
  {
    slug: "permesso-soggiorno-italia",
    title: "Permesso di Soggiorno — diferențe pentru români și moldoveni",
    excerpt:
      "Românii UE au libertate de circulație. Moldovenii au nevoie de viză + Permesso. Iată regulile complete.",
    coverImage:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "drepturi",
    countries: ["it"],
    readingTime: 7,
    content: `<p>Statutul tău juridic în Italia depinde de cetățenia ta. <strong>Românii</strong> sunt cetățeni UE — drept de mișcare. <strong>Moldovenii</strong> au nevoie de viză + Permesso. Iată cum se face fiecare procedură.</p>
<h2>Pentru români — UE</h2>
<p>Cetățenii români au <strong>drept la liberă circulație</strong> și pot locui și munci în Italia <strong>fără viză sau Permesso</strong>. Singura obligație:</p>
<ul>
<li><strong>Iscrizione anagrafica</strong> (residenza) la Comune după 3 luni de ședere</li>
<li>Asigurare de sănătate (SSN automat dacă lucrezi)</li>
<li>După 5 ani: drept de <strong>residenza permanente</strong> care se obține automat (poți cere atestare la Comune)</li>
</ul>
<h3>Carta d'identità italiană?</h3>
<p>Cetățenii UE pot cere <strong>Carta d'identità italiana</strong> dacă au residenza italiană — utilă pentru circulația în UE și autentificare. Cerere la Comune cu pașaport/CI românească.</p>
<h2>Pentru moldoveni — non-UE</h2>
<p>Trebuie viză înainte de a veni. Cele mai comune:</p>
<h3>Viza de muncă (Visto per lavoro subordinato)</h3>
<ul>
<li>Cu <strong>Decreto Flussi</strong> (cota anuală de muncitori străini stabilită de guvern)</li>
<li>Angajatorul italian face cererea în prealabil</li>
<li>Sectoare: agricultură, turism, lucrări casnice, transport</li>
</ul>
<h3>Viza de muncă autonomă (Visto per lavoro autonomo)</h3>
<ul>
<li>Pentru a începe activitate independentă în Italia</li>
<li>Probă financiară: capital + plan de afaceri</li>
<li>Cuoda anuală foarte limitată</li>
</ul>
<h3>Viza de studiu (Visto per studio)</h3>
<ul>
<li>Înscriere la o universitate italiană</li>
<li>Probă financiară: ~6.000€/an</li>
<li>Permite muncă <strong>20h/săptămână</strong></li>
</ul>
<h3>Viza de reunificare familială (Ricongiungimento Familiare)</h3>
<ul>
<li>Soț/soție de rezident italian sau cu Permesso de minimum 1 an</li>
<li>Dovedi: locuință adecvată + venituri minime + asigurare</li>
</ul>
<h2>După sosire — Permesso di Soggiorno</h2>
<p>În <strong>8 zile lucrătoare</strong> de la intrare în Italia, depune cererea de Permesso:</p>
<ol>
<li>Mergi la <strong>Sportello Amico</strong> al unui oficiu poștal (Poste Italiane)</li>
<li>Cere <strong>kit-ul Permesso di Soggiorno</strong> (gratuit)</li>
<li>Completează formularele</li>
<li>Documente: viza, pașaport, contract de muncă/studii, contract de chirie, fotografii biometrice</li>
<li>Plată: <strong>30,46€</strong> (formular) + <strong>16€</strong> (timbru fiscal) + <strong>30,46€</strong> (taxa Permesso) + <strong>40-100€</strong> (taxa de procesare în funcție de durată)</li>
<li>Trimite plicul, primește chitanța — atenție, <strong>păstrează-o</strong>! E permitul tău temporar până la cardul fizic</li>
<li>După 30-60 zile, vei fi convocat la <strong>Questura</strong> pentru amprentare</li>
<li>Cardul fizic ajunge în 2-6 luni</li>
</ol>
<h2>Permesso UE per soggiornanti di lungo periodo (după 5 ani)</h2>
<p>După 5 ani de Permesso continuu, poți cere acest Permesso permanent. Cerințe:</p>
<ul>
<li>Resurse stabile</li>
<li>Asigurare de sănătate</li>
<li>Locuință adecvată (parametri MIT)</li>
<li>Test de italiană <strong>A2</strong> (online sau la CTP)</li>
<li>Cazier judiciar curat</li>
</ul>
<h2>Cetățenia italiană</h2>
<ul>
<li><strong>Pentru români UE</strong>: după 4 ani de residenza continuă</li>
<li><strong>Pentru moldoveni non-UE</strong>: după 10 ani de residenza continuă cu Permesso</li>
<li>Test de italiană <strong>B1</strong></li>
<li>Venituri minime în ultimii 3 ani</li>
<li>Cazier judiciar curat</li>
<li>Cerere online pe <strong>portaleservizi.dlci.interno.it</strong></li>
<li>Procedură: 24-48 luni</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.poliziadistato.it" target="_blank" rel="noopener">Polizia di Stato — Permesso</a></p>`,
  },
  {
    slug: "inscriere-asilo-scuola-italia",
    title: "Înscrierea copilului la Asilo sau Scuola în Italia",
    excerpt:
      "Sistem școlar italian, cum cauți loc la creșă (Asilo Nido) și înscrierea la școală.",
    coverImage:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "viata-practica",
    countries: ["it"],
    readingTime: 6,
    content: `<p>În Italia, școala e <strong>obligatorie de la 6 ani până la 16 ani</strong>. Înainte, există creșă (Asilo Nido) și grădiniță (Scuola dell'Infanzia). Iată cum să înscrii copilul.</p>
<h2>Sistem școlar italian</h2>
<ul>
<li><strong>Asilo Nido</strong>: 3 luni - 3 ani — opțional</li>
<li><strong>Scuola dell'Infanzia</strong>: 3 - 6 ani — opțional dar recomandat</li>
<li><strong>Scuola Primaria</strong>: 6 - 11 ani (5 ani) — obligatorie</li>
<li><strong>Scuola Secondaria di I grado</strong>: 11 - 14 ani (3 ani) — obligatorie</li>
<li><strong>Scuola Secondaria di II grado</strong>: 14 - 19 ani (Liceo, Istituto Tecnico, Istituto Professionale) — obligatorie până la 16 ani</li>
</ul>
<h2>Asilo Nido — locuri foarte căutate</h2>
<p>Mai ales în orașele mari (Milano, Roma, Bologna), cererea depășește oferta. <strong>Începe să cauți cu 6 luni înainte!</strong></p>
<h3>Tipuri</h3>
<ul>
<li><strong>Comunale (publică)</strong>: gestionate de Comune, costă <strong>200-700€/lună</strong> în funcție de ISEE</li>
<li><strong>Convenzionato</strong>: privată cu acord cu Comune, tarif similar</li>
<li><strong>Privată</strong>: 500-1500€/lună</li>
<li><strong>Tagesmutter / Nido Famiglia</strong>: dădacă acasă (autorizată), 8-12€/oră</li>
</ul>
<h3>Cum aplici</h3>
<ol>
<li>Mergi pe site-ul Comune (Milano, Roma etc. au portale dedicate)</li>
<li>Completează cererea online cu ISEE</li>
<li>Sistem de puncte (criterii: ambii părinți lucrează, frați deja înscriși, situație familială)</li>
<li>Lista oficială publicată în mai/iunie pentru septembrie</li>
</ol>
<h3>Bonus Asilo Nido</h3>
<p>Cum am explicat în articolul Assegno Unico: <strong>până la 3.000€/an</strong> de la INPS pentru orice creșă (publică sau privată). Cerere separată.</p>
<h2>Înscrierea la școală</h2>
<p>Înscrierile se fac <strong>online pe iscrizioni.istruzione.it</strong> în <strong>ianuarie</strong> pentru anul școlar care începe în septembrie.</p>
<h3>Documente necesare</h3>
<ul>
<li>Codice Fiscale al copilului și al părinților</li>
<li><strong>SPID/CIE</strong> al unui părinte pentru autentificare</li>
<li>Carnet de vaccinări (vaccinurile obligatorii: 10 vaccinuri pentru copii sub 16 ani)</li>
<li>Pentru moldoveni: Permesso copil sau menționarea în Permesso al părintelui</li>
</ul>
<h3>Sectorizare</h3>
<p>Scuola Primaria și Scuola Secondaria sunt în general alocate prin <strong>sectorizare</strong> (zona de domiciliu). Poți cere o altă școală dar acceptarea depinde de locuri disponibile.</p>
<h2>Sosire la jumătatea anului</h2>
<p>Posibilă oricând. Mergi direct la școala dorită cu documentele copilului. Pentru cei care nu vorbesc italiana, există <strong>laboratori L2</strong> (italiană ca a 2-a limbă) de 2-6 ore/săptămână, gratuite.</p>
<h2>Costuri în școala publică</h2>
<ul>
<li><strong>Mensa</strong> (cantină): 3-5€/masă, în funcție de ISEE</li>
<li><strong>Manuali scolastici</strong>: gratuiți la Primaria, plătiți la Secondaria (300-500€/an)</li>
<li><strong>Materiale</strong>: 100-300€/an</li>
<li><strong>Gite</strong> (excursii): 50-300€/an</li>
<li><strong>Tassa scolastica</strong>: 21€/an doar la Liceu</li>
</ul>
<h3>Bonus Studenti</h3>
<p>Comune și Regiune oferă bonusuri pentru cărți (<strong>Buono Libri</strong>), abonament transport, mensa pentru familii cu ISEE redus.</p>
<h2>Liceu sau Istituto?</h2>
<p>La 14 ani, copilul alege:</p>
<ul>
<li><strong>Liceo</strong> (Classico, Scientifico, Linguistico etc.): pregătire pentru universitate</li>
<li><strong>Istituto Tecnico</strong>: pregătire tehnică (informatica, comerț) — și universitate</li>
<li><strong>Istituto Professionale</strong>: meserie + posibilitate universitate</li>
<li><strong>Apprendistato</strong>: ucenicie + școală pentru cei care vor să muncească rapid</li>
</ul>
<p>Toate lasă deschisă posibilitatea universității cu <strong>Esame di Stato</strong> (echivalent Bacalaureat).</p>
<p><strong>Sursă oficială:</strong> <a href="https://www.istruzione.it" target="_blank" rel="noopener">Ministero dell'Istruzione</a></p>`,
  },
  {
    slug: "inchiriere-locuinta-italia",
    title: "Cum să închiriezi un apartament în Italia",
    excerpt:
      "Tipuri de contracte (4+4, 3+2), garanții, sfaturi și capcane pentru chirii în Italia.",
    coverImage:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "viata-practica",
    countries: ["it"],
    readingTime: 6,
    content: `<p>Piața italiană are particularitățile ei — contracte standardizate prin lege, taxe și înregistrare obligatorie. Iată cum să eviți problemele.</p>
<h2>Tipuri de contracte de chirie</h2>
<ul>
<li><strong>4+4</strong> (libero): durata 4 ani, reînnoire automată 4 ani. Chirie liberă (pe care proprietarul o poate negocia)</li>
<li><strong>3+2</strong> (concordato): durata 3 ani + 2 reînnoire automată. Chirie reglementată de acord local — adesea mai mică, cu beneficii fiscale pentru proprietar</li>
<li><strong>Tranzitoriu</strong>: 1-18 luni, doar cu motiv valabil (lucru temporar etc.)</li>
<li><strong>Studenți</strong>: 6 luni - 3 ani, doar cu adeverință de la universitate</li>
</ul>
<h2>Dosarul de închiriere</h2>
<p>Documente cerute:</p>
<ul>
<li>Carta d'identità sau pașaport</li>
<li>Codice Fiscale</li>
<li>Pentru moldoveni: Permesso di Soggiorno valabil</li>
<li>3 ultime fluturași de salariu (busta paga) sau contract</li>
<li>Modello CU (declarație venituri anul precedent)</li>
<li>Justificatif de domiciliu actual</li>
<li>Garant (uneori cerut): cu venituri stabile + CU</li>
</ul>
<h2>Cauzione (depozit)</h2>
<ul>
<li>Maxim legal: <strong>3 luni</strong> de chirie</li>
<li>De obicei: <strong>2 luni</strong></li>
<li>Returnată la sfârșitul contractului dacă apartamentul e în stare bună</li>
<li>Proprietarul îți datorează <strong>dobândă legală</strong> pe suma cauzionei</li>
</ul>
<h2>Înregistrarea contractului</h2>
<p>Contractul TREBUIE să fie înregistrat la <strong>Agenzia delle Entrate</strong> în 30 zile.</p>
<ul>
<li>Costuri: <strong>2% din chiria anuală</strong> (împărțit 50/50 cu proprietarul, de obicei) + 16€/100 pagini timbru fiscal</li>
<li><strong>Cedolare secca</strong>: opțiune fiscală pentru proprietar (10-21%) — adesea exclude și taxele tale</li>
<li>Fără înregistrare: contractul e <strong>nul</strong>! Poți cere registrarea retroactivă tu însuți</li>
</ul>
<h2>Spese (costuri suplimentare)</h2>
<ul>
<li><strong>Spese condominiali</strong>: lift, scări comune, încălzire centralizată — 50-300€/lună</li>
<li><strong>Tari</strong> (taxa pe gunoi): 100-300€/an</li>
<li><strong>Apă, electricitate, gaze</strong>: variabile, 100-300€/lună în total</li>
<li><strong>Imposta di Bollo</strong>: 32€/an pentru contractul tău</li>
</ul>
<h2>Capcane frecvente</h2>
<ul>
<li><strong>Affitto in nero</strong> (chirie fără contract sau parțial declarată): ilegal! Riști să pierzi tot, inclusiv depozitul. Refuză chiar dacă proprietarul oferă reducere</li>
<li><strong>Cauțion fără chitanță</strong>: nu plăti niciodată cash fără chitanță scrisă</li>
<li><strong>Stato dell'immobile</strong>: fă fotografii la intrare cu proprietarul, scrieți împreună un proces-verbal</li>
<li><strong>Mediatore</strong> (agent imobiliar): plătit de obicei <strong>1 lună de chirie + IVA</strong> de fiecare parte. Verifică să fie agent autorizat (înscris la Camera di Commercio)</li>
<li><strong>Pulizie</strong>: ești obligat să predai apartamentul curat — proprietarul poate reține din cauțion costul curățeniei profesionale</li>
</ul>
<h2>Drepturi ale chiriașului</h2>
<ul>
<li>Proprietarul nu poate intra în apartament fără permisiunea ta (cu excepție urgențe)</li>
<li>Reparațiile mari (acoperiș, instalație electrică majoră) sunt în sarcina proprietarului</li>
<li>Reparațiile mici (becuri, robinete, etc.) sunt ale tale</li>
<li>Poți rezilia oricând cu <strong>6 luni preaviz</strong> (sau mai puțin pentru motive grave: muncă, sănătate)</li>
</ul>
<h2>Site-uri utile</h2>
<ul>
<li><strong>Idealista, Immobiliare.it, Casa.it</strong>: cele mai mari portaluri</li>
<li><strong>Subito.it</strong>: anunțuri direct de la proprietari</li>
<li><strong>Spotahome, HousingAnywhere</strong>: pentru contracte de scurtă durată</li>
<li>Grupuri Facebook diaspora: rapide, dar atenție la escrocherii</li>
</ul>
<h2>Subvenții pentru chirie</h2>
<ul>
<li><strong>Bonus Affitto</strong>: pentru tinerii sub 31 ani cu venituri mici (ISEE < 15.493€)</li>
<li><strong>Contributi affitto regionali</strong>: variabile pe regiune, cerere la Comune</li>
<li><strong>Detrazione fiscală</strong>: 19% până la 991,60€/an pentru locuință principală</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.agenziaentrate.gov.it" target="_blank" rel="noopener">Agenzia delle Entrate — Locazioni</a></p>`,
  },
  {
    slug: "deschidere-cont-bancar-italia",
    title: "Deschiderea unui cont bancar în Italia",
    excerpt:
      "Bănci tradiționale vs online (BancoPosta, N26, Revolut), documente cerute și sfaturi pentru diaspora.",
    coverImage:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "finante",
    countries: ["it"],
    readingTime: 5,
    content: `<p>Pentru a primi salariu, plăti chirie sau a face plăți online, ai nevoie de cont bancar italian (<strong>conto corrente</strong>). Iată cum.</p>
<h2>Documente cerute</h2>
<ul>
<li>Pașaport sau Carta d'identità</li>
<li><strong>Codice Fiscale</strong> (esențial)</li>
<li>Pentru moldoveni: Permesso di Soggiorno valabil</li>
<li>Justificatif de venit (uneori cerut, mai des pentru limite mari)</li>
<li>Justificatif de domiciliu (Certificato di Residenza, factură)</li>
</ul>
<h2>Bănci tradiționale</h2>
<ul>
<li><strong>Intesa Sanpaolo</strong> — cea mai mare bancă italiană, agenții peste tot</li>
<li><strong>UniCredit</strong> — internaționale, bună pentru transferuri externe</li>
<li><strong>BPER</strong>, <strong>Banco BPM</strong>, <strong>Monte dei Paschi</strong> — alternative regionale</li>
<li><strong>Credit Agricole Italia</strong> — filială franceză, prezentă în Veneto, Emilia</li>
</ul>
<p>Costuri: <strong>5-10€/lună</strong> de obicei. Conturi gratuite pentru tineri sub 30 ani sau cu salariu domiciliat.</p>
<h2>BancoPosta — opțiune simplă</h2>
<p><strong>Poste Italiane</strong> oferă cont curent (<strong>Conto BancoPosta</strong>) accesibil:</p>
<ul>
<li>Cere doar Codice Fiscale, document de identitate, residenza</li>
<li>Costuri: 6,90€/lună (sau gratuit cu salariu)</li>
<li>Acceptat peste tot pentru salariu, chirie, etc.</li>
<li>Avantaj: 12.000+ oficii poștale</li>
</ul>
<h2>Bănci online (cu IBAN italian IT)</h2>
<ul>
<li><strong>ING Italia</strong> — Conto Arancio, gratuit, IBAN IT</li>
<li><strong>Fineco Bank</strong> — conturi de investiție, gratuit cu condiții</li>
<li><strong>Webank</strong>, <strong>CheBanca!</strong>, <strong>Hello Bank!</strong> — alternative</li>
</ul>
<h2>Neobănci (cu IBAN străin)</h2>
<ul>
<li><strong>Revolut</strong>: IBAN lituanian (LT) — acceptat de majoritatea, dar nu de toți</li>
<li><strong>N26</strong>: IBAN german (DE) — uneori refuzat de angajatori italieni</li>
<li><strong>Wise</strong>: IBAN belgian sau italian — verifică</li>
<li><strong>Hype</strong>: italiană (BNL Group), IBAN IT, gratuit cu limite mici</li>
</ul>
<h3>De ce IBAN-ul italian (IT) contează</h3>
<p>Mulți angajatori, proprietari și administrații publice <strong>cer IBAN IT</strong> pentru:</p>
<ul>
<li>Plata salariului (uneori, deși SEPA o cere)</li>
<li>Domicilierea facturilor cu RID</li>
<li>Rambursări fiscale</li>
<li>Plata Assegno Unico de la INPS</li>
</ul>
<h2>Carta Conto — alternativă fără cont</h2>
<p>Dacă nu poți deschide cont (cazuri rare), <strong>cardul prepaid</strong> Postepay sau Hype este o alternativă:</p>
<ul>
<li><strong>Postepay Evolution</strong>: are IBAN IT, accepta salariu și domicilieri — 12€/an</li>
<li>Pentru cei fără residenza încă: ideală</li>
</ul>
<h2>Sfaturi pentru diaspora</h2>
<ul>
<li>Începe cu BancoPosta sau Hype — cei mai accesibili pentru noi sosiți</li>
<li>Mai târziu, schimbă către o bancă tradițională pentru avantaje (împrumut, ipotecă)</li>
<li>Pentru transferuri către România/Moldova: <strong>Wise</strong> (cele mai mici taxe), Revolut sau MoneyGram</li>
<li>Activează <strong>Online Banking</strong> imediat — esențial pentru SEPA și plăți online</li>
<li>Pentru ISEE și INPS, pregătește IBAN-ul tău încă din primele luni</li>
</ul>
<h2>Atenție</h2>
<ul>
<li>Conturi bancare în România/Moldova: declară-le în <strong>quadro RW</strong> al declarației de impozite (vezi articol Dichiarazione)</li>
<li>Transferuri > 5.000€ pot trigger control fiscal — pregătește documentația</li>
</ul>
<p><strong>Sursă oficială:</strong> <a href="https://www.bancaditalia.it" target="_blank" rel="noopener">Banca d'Italia</a></p>`,
  },
  {
    slug: "permis-conducere-italia",
    title: "Permisul de conducere — schimb sau echivalare în Italia",
    excerpt:
      "Permisul tău românesc / moldovenesc valabil în Italia? Cum îl convertești la unul italian.",
    coverImage:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "drepturi",
    countries: ["it"],
    readingTime: 5,
    content: `<p>Vii în Italia cu permis românesc sau moldovenesc? Iată regulile actualizate 2026.</p>
<h2>Pentru români — UE</h2>
<p>Permisul românesc este <strong>direct valabil în Italia</strong> pe toată durata sa. <strong>Nu este obligatorie conversia</strong>.</p>
<h3>Excepții</h3>
<ul>
<li>Dacă te înregistrezi cu <strong>residenza</strong> în Italia și permisul tău expiră, trebuie să-l reînnoiești în Italia (nu mai poți merge în România)</li>
<li>Dacă pierzi puncte sau comiti infracțiuni, autoritățile italiene pot cere conversia</li>
</ul>
<h3>Conversie voluntară</h3>
<p>Mulți români aleg să-l convertească pentru simplitatea ulterioară:</p>
<ol>
<li>Mergi la <strong>Motorizzazione Civile</strong> al provinciei tale</li>
<li>Documente: permis original + copie, residenza, Codice Fiscale, fotografie biometrică, certificat medical (pentru vârste >50 ani)</li>
<li>Plăți: ~30€ + duplicat ~16€</li>
<li>Permisul italian sosește în 1-2 luni</li>
</ol>
<p><strong>Nu necesită examen!</strong></p>
<h2>Pentru moldoveni — non-UE</h2>
<p>Permisul moldovenesc este valabil <strong>doar 1 an</strong> de la data residenței italiene. După, trebuie:</p>
<ul>
<li>SAU schimb (Conversione)</li>
<li>SAU permis italian de la zero</li>
</ul>
<h3>Există acord Moldova-Italia?</h3>
<p>Italia are acorduri bilaterale doar cu anumite țări. <strong>Moldova NU este pe lista oficială</strong> de echivalare directă. Asta înseamnă:</p>
<ul>
<li>Conversie cu <strong>examen italian (teoretic + practic) este obligatorie</strong></li>
<li>Trebuie să te înscrii la o <strong>autoscuola</strong> (școală de șoferi) italiană</li>
</ul>
<h3>Procedură</h3>
<ol>
<li>Înscrie-te la o autoscuola</li>
<li>Documente: pașaport, Permesso, residenza, Codice Fiscale, certificat medical, 2 fotografii</li>
<li>Studii teoretice: ~30 lecții, examen cu 30 întrebări (max 3 greșeli)</li>
<li>Lecții de circulație: minim 6 ore obligatorii</li>
<li>Examen practic la Motorizzazione</li>
<li>Costuri totale: <strong>1.000-2.000€</strong></li>
</ol>
<h2>Cazuri speciale</h2>
<h3>Permis moldovenesc cu rezidență anterioară în UE</h3>
<p>Dacă ai locuit în alt stat UE (de exemplu Spania) cu permis convertit acolo, poți cere conversia simplificată în Italia.</p>
<h3>Profesioniști (CQC)</h3>
<p>Pentru a fi camionagiu, taximetrist sau șofer profesionist:</p>
<ul>
<li>Permis B sau C/D + <strong>CQC</strong> (Carta di Qualificazione del Conducente)</li>
<li>Curs obligatoriu 130-280 ore + examen</li>
<li>Reciclare la fiecare 5 ani</li>
</ul>
<h2>Reînnoire</h2>
<ul>
<li>Permis italian categoria B: valabil 10 ani (până la 50 ani), apoi 5 ani (50-70), 3 ani (70+)</li>
<li>Reînnoire la <strong>medic agreat</strong> + <strong>Motorizzazione</strong> sau <strong>autoscuola</strong></li>
<li>Costuri: ~30€ + medic ~70€</li>
</ul>
<h2>Atenție</h2>
<ul>
<li>După 1 an cu permis moldovenesc neschimbat: <strong>fără permis</strong> — riști amendă 5.000€ + sechestru auto</li>
<li>IDP (Permis Internațional) NU prelungește valabilitatea — e doar traducere</li>
<li>Asigurarea poate refuza reclamație dacă permisul nu mai e valabil</li>
<li>Contraventii pot afecta cetățenia ulterioară</li>
</ul>
<h2>Patente Speciali</h2>
<p>Pentru categorii AM (mopede, 14+ ani) și A (motociclete), procedurile sunt similare. Verifică cu autoscuola pentru combinații.</p>
<p><strong>Sursă oficială:</strong> <a href="https://www.mit.gov.it" target="_blank" rel="noopener">Ministero delle Infrastrutture e dei Trasporti</a></p>`,
  },
]

async function main() {
  console.log("🌱 Seeding article categories...")
  for (const cat of categories) {
    await prisma.articleCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    })
  }

  console.log("🌱 Seeding articles...")
  for (const a of articles) {
    const category = await prisma.articleCategory.findUnique({
      where: { slug: a.categorySlug },
    })

    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        coverImage: a.coverImage,
        countries: a.countries,
        readingTime: a.readingTime,
        published: true,
        categoryId: category?.id,
      },
      create: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        coverImage: a.coverImage,
        countries: a.countries,
        readingTime: a.readingTime,
        published: true,
        categoryId: category?.id,
      },
    })
  }

  const count = await prisma.article.count()
  console.log(`✅ Done. ${count} articles in DB.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
