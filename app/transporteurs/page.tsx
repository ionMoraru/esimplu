import Link from "next/link"

export const metadata = {
  title: "Devino transportator — eSimplu",
  description:
    "Călătorești regulat între Franța, Germania, Italia sau Marea Britanie și Moldova sau România? Înscrie-te gratuit pe eSimplu și găsește mai ușor pasageri și colete pentru a-ți rentabiliza cursa.",
}

const STEPS = [
  {
    n: 1,
    title: "Înscrie-te în 2 minute",
    body: "Nume, telefon, oraș de bază. Fără comision, fără abonament.",
  },
  {
    n: 2,
    title: "Publică-ți cursele viitoare",
    body: "Plecare, sosire, dată, capacitate pasageri și/sau colete, prețuri orientative. Poți modifica sau anula oricând.",
  },
  {
    n: 3,
    title: "Primești cererile pe email",
    body: "Nu trebuie să stai lipit de telefon. Validezi sau refuzi fiecare cerere când îți convine.",
  },
  {
    n: 4,
    title: "Restul îl gestionezi direct",
    body: "Odată confirmată cererea, clientul primește datele tale de contact. Vă înțelegeți direct asupra întâlnirii și plății. eSimplu nu intervine.",
  },
]

const FAQ = [
  {
    q: "Cât costă?",
    a: "Nimic. Fără abonament, fără comision pe cursă. eSimplu este complet gratuit pentru transportatori.",
  },
  {
    q: "Cum sunt plătit?",
    a: "Direct de către client, în numerar sau prin transfer bancar, exact ca în grupurile de Facebook. eSimplu doar facilitează contactul, nu intervine niciodată în partea financiară.",
  },
  {
    q: "Datele mele sunt publice?",
    a: "Nu. Numele și orașul tău apar pe anunț, dar numărul de telefon este partajat doar cu clienții pe care i-ai acceptat. Nimeni altcineva nu îl poate vedea.",
  },
  {
    q: "Pot retrage un anunț?",
    a: "Poți modifica sau anula cursele oricând din panoul tău. Poți, de asemenea, să-ți ștergi contul cu un singur click.",
  },
  {
    q: "Contul meu este validat imediat?",
    a: "Echipa noastră verifică fiecare înscriere în 48 h pentru a limita escrocii. Odată validat, poți publica fără limită.",
  },
]

export default function TransporteursLandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="px-6 py-16 sm:py-24 border-b bg-gradient-to-b from-emerald-50/50 to-background">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-sm font-medium text-emerald-700 uppercase tracking-wide">
            Pentru transportatori · gratuit
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Umple-ți vehiculul, fără rețele Facebook
          </h1>
          <p className="text-lg text-zinc-700 leading-relaxed">
            Faci regulat traseul între Franța, Germania, Italia sau Marea Britanie și Moldova sau
            România? Publică-ți cursele pe eSimplu, primește cererile de pasageri și colete pe
            email, validează cele care îți convin. Restul se rezolvă direct cu clientul, ca până acum.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/courier/register"
              className="rounded-xl bg-primary text-primary-foreground px-6 py-3 text-base font-semibold hover:bg-primary/90"
            >
              Înscrie-te gratuit →
            </Link>
            <Link
              href="/delivery"
              className="rounded-xl border px-6 py-3 text-base font-medium hover:bg-muted/30"
            >
              Vezi cursele actuale
            </Link>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Fără comision. Fără angajament. Dezabonare cu un singur click.
          </p>
        </div>
      </section>

      {/* De ce eSimplu vs Facebook */}
      <section className="px-6 py-16 border-b">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            De ce nu doar Facebook?
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border p-6 space-y-2">
              <div className="text-3xl">🔍</div>
              <h3 className="font-semibold">Anunțurile tale se pierd</h3>
              <p className="text-sm text-muted-foreground">
                Pe Facebook, postarea ta dispare în câteva ore din feed. Pe eSimplu, rămâne
                vizibilă până la data plecării.
              </p>
            </div>
            <div className="rounded-2xl border p-6 space-y-2">
              <div className="text-3xl">📵</div>
              <h3 className="font-semibold">Fără apeluri inoportune</h3>
              <p className="text-sm text-muted-foreground">
                Numărul tău este partajat doar cu clienții pe care i-ai acceptat tu. Nu mai sunt
                oameni care sună la ora 23 pentru informații de bază.
              </p>
            </div>
            <div className="rounded-2xl border p-6 space-y-2">
              <div className="text-3xl">⏱️</div>
              <h3 className="font-semibold">Tu ai controlul</h3>
              <p className="text-sm text-muted-foreground">
                Validezi fiecare cerere, gestionezi singur plata, poți anula o cursă cu un singur
                click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 border-b">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Cum funcționează
          </h2>
          <ol className="space-y-6">
            {STEPS.map((step) => (
              <li key={step.n} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {step.n}
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 border-b bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Întrebări frecvente
          </h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className="rounded-xl border bg-card p-4 group"
              >
                <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Gata să publici următoarea cursă?
          </h2>
          <p className="text-muted-foreground">
            Înscriere în 2 minute. Publici prima cursă imediat după.
          </p>
          <Link
            href="/courier/register"
            className="inline-block rounded-xl bg-primary text-primary-foreground px-6 py-3 text-base font-semibold hover:bg-primary/90"
          >
            Devino transportator →
          </Link>
        </div>
      </section>
    </main>
  )
}
