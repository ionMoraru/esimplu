import Link from "next/link"

export const metadata = {
  title: "Devenir transporteur — eSimplu",
  description:
    "Vous voyagez régulièrement entre la France/Allemagne/Italie/UK et la Moldavie ou la Roumanie ? Rejoignez gratuitement eSimplu et trouvez plus facilement des passagers et des colis pour rentabiliser votre trajet.",
}

const STEPS = [
  {
    n: 1,
    title: "Inscrivez-vous en 2 minutes",
    body: "Nom, téléphone, ville de base. Aucune commission, aucun abonnement.",
  },
  {
    n: 2,
    title: "Publiez vos trajets à venir",
    body: "Origine, destination, date, capacité passager et/ou colis, prix indicatifs. Vous pouvez modifier ou annuler à tout moment.",
  },
  {
    n: 3,
    title: "Recevez les demandes par email",
    body: "Pas besoin d'être collé à votre téléphone. Vous validez ou refusez chaque demande quand ça vous arrange.",
  },
  {
    n: 4,
    title: "Vous gérez le reste directement",
    body: "Une fois validée, le client reçoit vos coordonnées. Vous vous arrangez de gré à gré pour le RDV et le paiement. eSimplu n'intervient pas.",
  },
]

const FAQ = [
  {
    q: "Combien ça coûte ?",
    a: "Rien. Pas d'abonnement, pas de commission sur les courses. eSimplu est entièrement gratuit pour les transporteurs.",
  },
  {
    q: "Comment je suis payé ?",
    a: "Directement par le client, en espèces ou par virement, comme aujourd'hui dans les groupes Facebook. eSimplu se contente de mettre en relation, on n'est jamais entre vous et l'argent.",
  },
  {
    q: "Mes coordonnées sont-elles publiques ?",
    a: "Non. Votre nom et votre ville s'affichent sur l'annonce, mais votre téléphone n'est partagé qu'avec les clients dont vous avez accepté la demande. Personne d'autre ne peut le voir.",
  },
  {
    q: "Et si je veux retirer une annonce ?",
    a: "Vous pouvez modifier ou annuler vos trajets à tout moment depuis votre tableau de bord. Vous pouvez aussi supprimer votre compte d'un clic.",
  },
  {
    q: "Mon compte est validé tout de suite ?",
    a: "Notre équipe vérifie chaque inscription sous 48 h pour limiter les arnaqueurs. Une fois validé, vous pouvez publier sans limite.",
  },
]

export default function TransporteursLandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="px-6 py-16 sm:py-24 border-b bg-gradient-to-b from-emerald-50/50 to-background">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-sm font-medium text-emerald-700 uppercase tracking-wide">
            Pour transporteurs · gratuit
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Remplissez votre véhicule, sans réseau Facebook
          </h1>
          <p className="text-lg text-zinc-700 leading-relaxed">
            Vous faites régulièrement la liaison entre la France, l&apos;Allemagne, l&apos;Italie ou
            le Royaume-Uni et la Moldavie ou la Roumanie ? Publiez vos trajets sur eSimplu,
            recevez les demandes de passagers et de colis par email, validez celles qui vous
            arrangent. Le reste se gère directement avec le client, comme avant.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/courier/register"
              className="rounded-xl bg-primary text-primary-foreground px-6 py-3 text-base font-semibold hover:bg-primary/90"
            >
              S&apos;inscrire gratuitement →
            </Link>
            <Link
              href="/delivery"
              className="rounded-xl border px-6 py-3 text-base font-medium hover:bg-muted/30"
            >
              Voir les trajets actuels
            </Link>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Aucune commission. Aucun engagement. Désinscription en 1 clic.
          </p>
        </div>
      </section>

      {/* Why eSimplu vs Facebook */}
      <section className="px-6 py-16 border-b">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Pourquoi pas juste Facebook ?
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border p-6 space-y-2">
              <div className="text-3xl">🔍</div>
              <h3 className="font-semibold">Vos annonces se perdent</h3>
              <p className="text-sm text-muted-foreground">
                Sur Facebook, votre post tombe en bas du fil en quelques heures. Sur eSimplu,
                il reste visible jusqu&apos;à la date de départ.
              </p>
            </div>
            <div className="rounded-2xl border p-6 space-y-2">
              <div className="text-3xl">📵</div>
              <h3 className="font-semibold">Plus d&apos;appels intempestifs</h3>
              <p className="text-sm text-muted-foreground">
                Votre numéro n&apos;est partagé qu&apos;avec les clients que vous avez vous-même
                acceptés. Plus de gens qui appellent à 23h pour demander des infos basiques.
              </p>
            </div>
            <div className="rounded-2xl border p-6 space-y-2">
              <div className="text-3xl">⏱️</div>
              <h3 className="font-semibold">Vous gardez le contrôle</h3>
              <p className="text-sm text-muted-foreground">
                Vous validez chaque demande, vous gérez le paiement vous-même, vous pouvez
                annuler un trajet en 1 clic.
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
            Comment ça marche
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
            Questions fréquentes
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
            Prêt à publier votre prochain trajet ?
          </h2>
          <p className="text-muted-foreground">
            Inscription en 2 minutes. Vous publiez votre premier trajet juste après.
          </p>
          <Link
            href="/courier/register"
            className="inline-block rounded-xl bg-primary text-primary-foreground px-6 py-3 text-base font-semibold hover:bg-primary/90"
          >
            Devenir transporteur →
          </Link>
        </div>
      </section>
    </main>
  )
}
