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
