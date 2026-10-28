# DailyFlow

PWA de motivation : roues de missions, Learn & Apply, Side Hustle Lab.

## Lancer en local
```
npm install
npm run dev      # développement
npm run build    # version de production dans dist/
```

## État (sprint 1)
- Fait : accueil, deux roues (tirage aléatoire cryptographique, 1 relance), cycle de mission, éditeur de missions, progression (points, jours actifs/semaine, historique), réglages, page d'installation, manifeste + service worker, icônes.
- Données : stockées sur l'appareil (localStorage) — remplacées par Supabase au sprint 2.
- À venir : comptes + Supabase (sprint 2), Learn & Apply (sprint 3), Side Hustle Lab (sprint 4).

## Structure
- `src/lib/` : types, stockage, tirage, calcul de progression, données d'exemple
- `src/pages/` : écrans
- `src/components/` : roue SVG, navigation, éléments d'interface
- `scripts/icon.mjs` : génère les icônes
