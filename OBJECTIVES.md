# Objectifs eSimplu — Q2 2026

> Document vivant. Échéance cible : **fin Q2 2026** (≈ 3 mois). Niveau cible : **MVP** (catalogue + prise de contact direct, pas de paiement intégré pour cette phase).
> Dernière mise à jour : 2026-04-27

## Équipe

| Fondateur | Périmètre |
|---|---|
| Toi (morarou.y@gmail.com) | Marketplace · Delivery |
| Associé (dev avec assistance IA) | Services · Articles · Acquisition / community |

## Pays cibles

France · Allemagne · Italie · Royaume-Uni

Contenu en roumain. Sélection du pays par cookie (pas dans l'URL). `?country=fr` override pour les liens partageables.

---

## Volet 1 — Produit

### Associé : modules Services & Articles

- [ ] Page services : répertoire fonctionnel multi-pays, formulaire de soumission relié à la DB
- [ ] Page articles : liste + détail multi-pays, contenu réel (pas mock) pour les 4 pays
- [ ] Filtre par pays (`countries[]`) opérationnel sur articles et services
- [ ] Contenu de démarrage : viser 5+ articles et 10+ services par pays au lancement

### Toi : modules Marketplace & Delivery

- [ ] **Marketplace MVP** : catalogue producteur, page produit, prise de contact directe (WhatsApp / email), filtrage par pays de livraison. Pas de paiement intégré à ce stade.
  - Modèles Prisma : `Seller`, `Product`
  - Interface vendeur : création/édition produits
  - Interface acheteur : listing, détail produit, page producteur
- [ ] **Delivery MVP** : publication de trajets, recherche par origine/destination, réservation (sans paiement intégré).
  - Modèles Prisma : `Carrier`, `Trip`, `Booking`
  - Publication d'un trajet
  - Recherche + réservation

---

## Volet 2 — Acquisition / community (associé)

### Recherche

- [ ] Identifier la répartition de la diaspora moldave par pays cible (FR, DE, IT, UK) — sources : Wikipedia, INSEE, Destatis, ISTAT, ONS, ambassades RM/RO
- [ ] Confirmer/ajuster l'ordre de priorité des 4 pays selon les chiffres

### Présence Facebook

- [ ] Créer la **Page Facebook eSimplu** (entité officielle, qui administre les groupes)
- [ ] Créer 4 groupes liés à la Page :
  - `eSimplu Franța`
  - `eSimplu Germania`
  - `eSimplu Italia`
  - `eSimplu Marea Britanie`
- [ ] Définir une charte de modération (langue, contenus autorisés, fréquence des posts)

### Phase 2 (à évaluer en fin de trimestre)

- [ ] Instagram (compte unique ou par pays ?)
- [ ] TikTok (idem)

---

## Hors périmètre Q2 (volontairement repoussé)

- Paiement intégré (Stripe Connect ou autre) — viendra après le lancement MVP
- Auth Facebook (bloqué côté Meta — vérification identité)
- Redirection `esimplu.fr` → `esimplu.com`
- Modules e-commerce avancés (panier persistant, codes promo, etc.)

---

## Suivi

- Avancement détaillé par tâche : `ROADMAP.md`
- Specs et plans techniques : `docs/superpowers/specs/` et `docs/superpowers/plans/`
