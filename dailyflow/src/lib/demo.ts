import type { Mission, WheelKind, Difficulty } from './types'

type Seed = [title: string, objective: string, criterion: string, steps: string[], duration: number, difficulty: Difficulty]

const envies: Seed[] = [
  [
    'Vocabulaire anglais en contexte',
    'Lire un article court en anglais et noter 10 mots nouveaux avec une phrase d’exemple chacun.',
    '10 mots notés, chacun dans une phrase que tu as écrite toi-même.',
    ['Choisir un article de moins de 800 mots', 'Surligner les mots inconnus', 'Garder les 10 plus utiles', 'Écrire une phrase par mot'],
    30, 1,
  ],
  [
    'Découvrir un outil d’IA',
    'Tester un outil d’IA que tu n’as jamais utilisé et produire un résultat concret avec.',
    'Un résultat sauvegardé et 3 lignes sur ce que l’outil fait bien ou mal.',
    ['Choisir l’outil', 'Lire la page d’accueil en 5 min', 'Faire un premier essai', 'Noter forces et limites'],
    30, 1,
  ],
  [
    'Un sujet en 3 idées',
    'Lire sur un sujet qui t’intrigue et le résumer en 3 idées clés expliquées simplement.',
    'Un résumé de 3 idées que tu pourrais expliquer à un ami sans notes.',
    ['Choisir le sujet', 'Lire 2 sources différentes', 'Écrire les 3 idées', 'Relire à voix haute'],
    30, 1,
  ],
  [
    'Un raccourci logiciel par jour',
    'Apprendre 5 raccourcis ou fonctions d’un logiciel que tu utilises souvent et les utiliser tout de suite.',
    '5 raccourcis utilisés au moins une fois chacun pendant la session.',
    ['Choisir le logiciel', 'Trouver la liste officielle des raccourcis', 'En choisir 5', 'Les pratiquer sur un vrai fichier'],
    15, 1,
  ],
  [
    'Avancer un projet personnel',
    'Faire avancer un projet en cours d’une étape visible : un fichier, un brouillon, une page.',
    'Quelque chose de nouveau existe à la fin de la session et tu peux le montrer.',
    ['Choisir le projet', 'Définir l’étape en une phrase', 'Couper les notifications', 'Produire'],
    60, 2,
  ],
  [
    'Créer un contenu court',
    'Écrire et préparer une publication courte (post, vidéo de 30 s, carrousel) sur un sujet que tu maîtrises.',
    'Le contenu est prêt à publier, même si tu choisis de ne pas le publier.',
    ['Choisir l’idée', 'Écrire l’accroche', 'Rédiger ou filmer', 'Relire une fois'],
    30, 2,
  ],
  [
    'Reprendre une leçon enregistrée',
    'Rouvrir une ressource déjà sauvegardée et appliquer une étape que tu n’avais pas faite.',
    'Une étape de plus est cochée et tu as noté ce que tu en retiens.',
    ['Ouvrir la ressource', 'Repérer la prochaine étape', 'La faire', 'Noter le résultat'],
    30, 1,
  ],
  [
    'Exercice pratique chronométré',
    'Choisir une compétence en cours d’apprentissage et faire un exercice concret en temps limité.',
    'L’exercice est terminé dans le temps imparti, avec une note sur ce qui a bloqué.',
    ['Choisir l’exercice', 'Lancer un minuteur', 'Faire l’exercice', 'Noter les blocages'],
    15, 2,
  ],
  [
    'Explorer une nouvelle discipline',
    'Regarder ou lire une introduction à une discipline nouvelle et faire un premier essai pratique.',
    'Un premier essai réalisé et une décision : continuer ou non.',
    ['Choisir la discipline', 'Trouver une introduction de moins de 20 min', 'Faire un premier essai', 'Décider de la suite'],
    60, 2,
  ],
  [
    'Terminer ce qui traîne',
    'Choisir une tâche commencée depuis longtemps et la finir ou la clore officiellement.',
    'La tâche est finie, ou abandonnée par écrit avec la raison.',
    ['Lister 3 choses commencées', 'En choisir une', 'La finir ou la clore', 'Noter ce que ça libère'],
    30, 1,
  ],
]

const hustles: Seed[] = [
  [
    'Analyser 3 pages de vente',
    'Étudier trois pages de vente dans une niche choisie, relever cinq éléments récurrents et rédiger ta propre proposition de valeur.',
    '5 éléments listés et une proposition de valeur en une phrase.',
    ['Choisir la niche', 'Trouver 3 pages de vente', 'Relever les points communs', 'Écrire ta proposition de valeur'],
    30, 1,
  ],
  [
    'Trouver un problème client',
    'Lire des avis ou des forums dans une niche et noter 5 plaintes qui reviennent souvent.',
    '5 plaintes notées avec la source de chacune.',
    ['Choisir la niche', 'Lire avis et forums', 'Regrouper les plaintes', 'Garder les 5 plus fréquentes'],
    30, 1,
  ],
  [
    'Maquette de landing page',
    'Créer une landing page simple pour une idée : titre, promesse, 3 bénéfices, un bouton d’inscription.',
    'Une page accessible par un lien que tu peux envoyer à quelqu’un.',
    ['Choisir l’idée', 'Écrire le titre et la promesse', 'Monter la page avec un outil gratuit', 'Tester le lien sur ton téléphone'],
    120, 2,
  ],
  [
    'Contacter 5 prospects',
    'Envoyer un message personnalisé à 5 clients potentiels pour leur demander leur avis sur un problème.',
    '5 messages envoyés et suivis dans une liste.',
    ['Définir le profil visé', 'Trouver 5 personnes', 'Écrire un message court', 'Envoyer et noter'],
    60, 2,
  ],
  [
    'Automatiser une tâche répétitive',
    'Repérer une tâche que tu fais chaque semaine et l’automatiser avec un outil gratuit.',
    'La tâche tourne une fois sans toi.',
    ['Lister tes tâches répétitives', 'En choisir une simple', 'Choisir l’outil', 'Tester l’automatisation'],
    60, 3,
  ],
  [
    'Idée de produit numérique',
    'Définir un petit produit numérique vendable : pour qui, quel problème, quel format, quel prix testé.',
    'Une fiche d’une demi-page avec ces quatre réponses.',
    ['Choisir le public', 'Formuler le problème', 'Choisir le format', 'Fixer un prix de test'],
    30, 1,
  ],
  [
    'Étudier un concurrent',
    'Analyser un concurrent d’une idée : offre, prix, canaux d’acquisition, faiblesses visibles.',
    'Une fiche concurrent avec au moins une faiblesse exploitable.',
    ['Choisir le concurrent', 'Relever l’offre et les prix', 'Repérer ses canaux', 'Noter ses faiblesses'],
    30, 1,
  ],
  [
    'Prototype de mini-outil',
    'Construire une première version cliquable d’un petit outil qui résout un problème précis.',
    'Quelqu’un d’autre peut l’utiliser sans que tu expliques.',
    ['Définir le problème en une phrase', 'Dessiner l’écran principal', 'Construire la version la plus simple', 'Faire tester à une personne'],
    120, 3,
  ],
  [
    'Vidéo démo avec l’IA',
    'Produire une vidéo de démonstration de 60 secondes d’une idée avec des outils d’IA.',
    'Une vidéo de 60 s exportée.',
    ['Écrire le script', 'Choisir l’outil', 'Générer et monter', 'Exporter'],
    60, 2,
  ],
  [
    'Tester un prix',
    'Présenter une offre à 3 personnes avec un prix précis et noter leurs réactions.',
    '3 réactions notées, dont au moins une sur le prix.',
    ['Rédiger l’offre', 'Fixer le prix', 'La présenter à 3 personnes', 'Noter les réactions'],
    60, 2,
  ],
]

function build(wheel: WheelKind, seeds: Seed[]): Mission[] {
  const now = new Date().toISOString()
  return seeds.map(([title, objective, successCriterion, steps, durationMin, difficulty], i) => ({
    id: `demo-${wheel}-${i + 1}`,
    wheel,
    title,
    objective,
    successCriterion,
    steps,
    durationMin,
    difficulty,
    active: true,
    demo: true,
    createdAt: now,
  }))
}

export function demoMissions(): Mission[] {
  return [...build('envies', envies), ...build('hustle', hustles)]
}
