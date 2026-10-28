import type { Difficulty, Lang, Mission, WheelKind } from './types'

// Missions d'exemple, traduites dans les trois langues.
// Tant qu'une mission d'exemple n'a pas été modifiée, elle s'affiche dans la langue choisie.

type Text = [title: string, objective: string, criterion: string, steps: string[]]
type Meta = [duration: number, difficulty: Difficulty]

const META: Record<WheelKind, Meta[]> = {
  envies: [[30, 1], [30, 1], [30, 1], [15, 1], [60, 2], [30, 2], [30, 1], [15, 2], [60, 2], [30, 1]],
  hustle: [[30, 1], [30, 1], [120, 2], [60, 2], [60, 3], [30, 1], [30, 1], [120, 3], [60, 2], [60, 2]],
}

const TEXT: Record<Lang, Record<WheelKind, Text[]>> = {
  fr: {
    envies: [
      ['Vocabulaire anglais en contexte', 'Lire un article court en anglais et noter 10 mots nouveaux avec une phrase d’exemple chacun.', '10 mots notés, chacun dans une phrase que tu as écrite toi-même.', ['Choisir un article de moins de 800 mots', 'Surligner les mots inconnus', 'Garder les 10 plus utiles', 'Écrire une phrase par mot']],
      ['Découvrir un outil d’IA', 'Tester un outil d’IA que tu n’as jamais utilisé et produire un résultat concret avec.', 'Un résultat sauvegardé et 3 lignes sur ce que l’outil fait bien ou mal.', ['Choisir l’outil', 'Lire la page d’accueil en 5 min', 'Faire un premier essai', 'Noter forces et limites']],
      ['Un sujet en 3 idées', 'Lire sur un sujet qui t’intrigue et le résumer en 3 idées clés expliquées simplement.', 'Un résumé de 3 idées que tu pourrais expliquer à un ami sans notes.', ['Choisir le sujet', 'Lire 2 sources différentes', 'Écrire les 3 idées', 'Relire à voix haute']],
      ['Un raccourci logiciel par jour', 'Apprendre 5 raccourcis ou fonctions d’un logiciel que tu utilises souvent et les utiliser tout de suite.', '5 raccourcis utilisés au moins une fois chacun pendant la session.', ['Choisir le logiciel', 'Trouver la liste officielle des raccourcis', 'En choisir 5', 'Les pratiquer sur un vrai fichier']],
      ['Avancer un projet personnel', 'Faire avancer un projet en cours d’une étape visible : un fichier, un brouillon, une page.', 'Quelque chose de nouveau existe à la fin de la session et tu peux le montrer.', ['Choisir le projet', 'Définir l’étape en une phrase', 'Couper les notifications', 'Produire']],
      ['Créer un contenu court', 'Écrire et préparer une publication courte (post, vidéo de 30 s, carrousel) sur un sujet que tu maîtrises.', 'Le contenu est prêt à publier, même si tu choisis de ne pas le publier.', ['Choisir l’idée', 'Écrire l’accroche', 'Rédiger ou filmer', 'Relire une fois']],
      ['Reprendre une leçon enregistrée', 'Rouvrir une ressource déjà sauvegardée et appliquer une étape que tu n’avais pas faite.', 'Une étape de plus est cochée et tu as noté ce que tu en retiens.', ['Ouvrir la ressource', 'Repérer la prochaine étape', 'La faire', 'Noter le résultat']],
      ['Exercice pratique chronométré', 'Choisir une compétence en cours d’apprentissage et faire un exercice concret en temps limité.', 'L’exercice est terminé dans le temps imparti, avec une note sur ce qui a bloqué.', ['Choisir l’exercice', 'Lancer un minuteur', 'Faire l’exercice', 'Noter les blocages']],
      ['Explorer une nouvelle discipline', 'Regarder ou lire une introduction à une discipline nouvelle et faire un premier essai pratique.', 'Un premier essai réalisé et une décision : continuer ou non.', ['Choisir la discipline', 'Trouver une introduction de moins de 20 min', 'Faire un premier essai', 'Décider de la suite']],
      ['Terminer ce qui traîne', 'Choisir une tâche commencée depuis longtemps et la finir ou la clore officiellement.', 'La tâche est finie, ou abandonnée par écrit avec la raison.', ['Lister 3 choses commencées', 'En choisir une', 'La finir ou la clore', 'Noter ce que ça libère']],
    ],
    hustle: [
      ['Analyser 3 pages de vente', 'Étudier trois pages de vente dans une niche choisie, relever cinq éléments récurrents et rédiger ta propre proposition de valeur.', '5 éléments listés et une proposition de valeur en une phrase.', ['Choisir la niche', 'Trouver 3 pages de vente', 'Relever les points communs', 'Écrire ta proposition de valeur']],
      ['Trouver un problème client', 'Lire des avis ou des forums dans une niche et noter 5 plaintes qui reviennent souvent.', '5 plaintes notées avec la source de chacune.', ['Choisir la niche', 'Lire avis et forums', 'Regrouper les plaintes', 'Garder les 5 plus fréquentes']],
      ['Maquette de landing page', 'Créer une landing page simple pour une idée : titre, promesse, 3 bénéfices, un bouton d’inscription.', 'Une page accessible par un lien que tu peux envoyer à quelqu’un.', ['Choisir l’idée', 'Écrire le titre et la promesse', 'Monter la page avec un outil gratuit', 'Tester le lien sur ton téléphone']],
      ['Contacter 5 prospects', 'Envoyer un message personnalisé à 5 clients potentiels pour leur demander leur avis sur un problème.', '5 messages envoyés et suivis dans une liste.', ['Définir le profil visé', 'Trouver 5 personnes', 'Écrire un message court', 'Envoyer et noter']],
      ['Automatiser une tâche répétitive', 'Repérer une tâche que tu fais chaque semaine et l’automatiser avec un outil gratuit.', 'La tâche tourne une fois sans toi.', ['Lister tes tâches répétitives', 'En choisir une simple', 'Choisir l’outil', 'Tester l’automatisation']],
      ['Idée de produit numérique', 'Définir un petit produit numérique vendable : pour qui, quel problème, quel format, quel prix testé.', 'Une fiche d’une demi-page avec ces quatre réponses.', ['Choisir le public', 'Formuler le problème', 'Choisir le format', 'Fixer un prix de test']],
      ['Étudier un concurrent', 'Analyser un concurrent d’une idée : offre, prix, canaux d’acquisition, faiblesses visibles.', 'Une fiche concurrent avec au moins une faiblesse exploitable.', ['Choisir le concurrent', 'Relever l’offre et les prix', 'Repérer ses canaux', 'Noter ses faiblesses']],
      ['Prototype de mini-outil', 'Construire une première version cliquable d’un petit outil qui résout un problème précis.', 'Quelqu’un d’autre peut l’utiliser sans que tu expliques.', ['Définir le problème en une phrase', 'Dessiner l’écran principal', 'Construire la version la plus simple', 'Faire tester à une personne']],
      ['Vidéo démo avec l’IA', 'Produire une vidéo de démonstration de 60 secondes d’une idée avec des outils d’IA.', 'Une vidéo de 60 s exportée.', ['Écrire le script', 'Choisir l’outil', 'Générer et monter', 'Exporter']],
      ['Tester un prix', 'Présenter une offre à 3 personnes avec un prix précis et noter leurs réactions.', '3 réactions notées, dont au moins une sur le prix.', ['Rédiger l’offre', 'Fixer le prix', 'La présenter à 3 personnes', 'Noter les réactions']],
    ],
  },
  en: {
    envies: [
      ['English vocabulary in context', 'Read a short article in English and note 10 new words, each with an example sentence.', '10 words noted, each in a sentence you wrote yourself.', ['Pick an article under 800 words', 'Highlight unknown words', 'Keep the 10 most useful', 'Write one sentence per word']],
      ['Try an AI tool', 'Test an AI tool you have never used and produce a concrete result with it.', 'One saved result and 3 lines on what the tool does well or badly.', ['Pick the tool', 'Read its homepage for 5 min', 'Make a first attempt', 'Note strengths and limits']],
      ['A topic in 3 ideas', 'Read about a topic that intrigues you and sum it up in 3 key ideas, explained simply.', 'A 3-idea summary you could explain to a friend without notes.', ['Pick the topic', 'Read 2 different sources', 'Write the 3 ideas', 'Read them out loud']],
      ['One software shortcut a day', 'Learn 5 shortcuts or features of software you use often and use them right away.', '5 shortcuts each used at least once during the session.', ['Pick the software', 'Find the official shortcut list', 'Choose 5', 'Practice them on a real file']],
      ['Move a personal project forward', 'Move a current project forward by one visible step: a file, a draft, a page.', 'Something new exists at the end of the session and you can show it.', ['Pick the project', 'Define the step in one sentence', 'Turn off notifications', 'Make it']],
      ['Create a short piece of content', 'Write and prepare a short post (text, 30-second video, carousel) on a topic you know well.', 'The content is ready to publish, even if you choose not to.', ['Pick the idea', 'Write the hook', 'Write or film it', 'Review once']],
      ['Resume a saved lesson', 'Reopen a resource you already saved and apply a step you had not done.', 'One more step is checked off and you noted what you learned.', ['Open the resource', 'Find the next step', 'Do it', 'Note the result']],
      ['Timed practice drill', 'Pick a skill you are learning and do a concrete exercise against the clock.', 'The exercise is done in time, with a note on what got you stuck.', ['Pick the exercise', 'Start a timer', 'Do the exercise', 'Note where you got stuck']],
      ['Explore a new discipline', 'Watch or read an introduction to a new discipline and make a first practical attempt.', 'A first attempt made and a decision: keep going or not.', ['Pick the discipline', 'Find an intro under 20 min', 'Make a first attempt', 'Decide what’s next']],
      ['Finish what’s dragging', 'Pick a task you started long ago and finish it or officially close it.', 'The task is done, or dropped in writing with the reason.', ['List 3 things you started', 'Pick one', 'Finish or close it', 'Note what it frees up']],
    ],
    hustle: [
      ['Study 3 sales pages', 'Study three sales pages in a chosen niche, list five recurring elements and write your own value proposition.', '5 elements listed and a one-sentence value proposition.', ['Pick the niche', 'Find 3 sales pages', 'List what they share', 'Write your value proposition']],
      ['Find a customer problem', 'Read reviews or forums in a niche and note 5 complaints that come up often.', '5 complaints noted, each with its source.', ['Pick the niche', 'Read reviews and forums', 'Group the complaints', 'Keep the 5 most frequent']],
      ['Landing page mockup', 'Build a simple landing page for an idea: headline, promise, 3 benefits, a sign-up button.', 'A page reachable by a link you can send to someone.', ['Pick the idea', 'Write the headline and promise', 'Build the page with a free tool', 'Test the link on your phone']],
      ['Reach out to 5 prospects', 'Send a personal message to 5 potential customers asking their opinion on a problem.', '5 messages sent and tracked in a list.', ['Define the target profile', 'Find 5 people', 'Write a short message', 'Send and log']],
      ['Automate a repetitive task', 'Spot a task you do every week and automate it with a free tool.', 'The task runs once without you.', ['List your repetitive tasks', 'Pick a simple one', 'Pick the tool', 'Test the automation']],
      ['Digital product idea', 'Define a small sellable digital product: for whom, which problem, which format, which test price.', 'A half-page card with those four answers.', ['Pick the audience', 'State the problem', 'Pick the format', 'Set a test price']],
      ['Study a competitor', 'Analyze a competitor of an idea: offer, prices, acquisition channels, visible weaknesses.', 'A competitor card with at least one weakness you could use.', ['Pick the competitor', 'Note the offer and prices', 'Spot their channels', 'Note their weaknesses']],
      ['Mini-tool prototype', 'Build a first clickable version of a small tool that solves one specific problem.', 'Someone else can use it without you explaining.', ['State the problem in one sentence', 'Sketch the main screen', 'Build the simplest version', 'Have one person test it']],
      ['AI demo video', 'Produce a 60-second demo video of an idea using AI tools.', 'A 60-second video exported.', ['Write the script', 'Pick the tool', 'Generate and edit', 'Export']],
      ['Test a price', 'Pitch an offer to 3 people with a specific price and note their reactions.', '3 reactions noted, at least one about the price.', ['Write the offer', 'Set the price', 'Pitch it to 3 people', 'Note the reactions']],
    ],
  },
  es: {
    envies: [
      ['Vocabulario de inglés en contexto', 'Leer un artículo corto en inglés y anotar 10 palabras nuevas, cada una con una frase de ejemplo.', '10 palabras anotadas, cada una en una frase que escribiste tú.', ['Elegir un artículo de menos de 800 palabras', 'Marcar las palabras desconocidas', 'Quedarte con las 10 más útiles', 'Escribir una frase por palabra']],
      ['Probar una herramienta de IA', 'Probar una herramienta de IA que nunca usaste y lograr un resultado concreto con ella.', 'Un resultado guardado y 3 líneas sobre lo que la herramienta hace bien o mal.', ['Elegir la herramienta', 'Leer su página principal en 5 min', 'Hacer un primer intento', 'Anotar fortalezas y límites']],
      ['Un tema en 3 ideas', 'Leer sobre un tema que te intriga y resumirlo en 3 ideas clave explicadas de forma simple.', 'Un resumen de 3 ideas que podrías explicarle a un amigo sin notas.', ['Elegir el tema', 'Leer 2 fuentes distintas', 'Escribir las 3 ideas', 'Releerlas en voz alta']],
      ['Un atajo de software por día', 'Aprender 5 atajos o funciones de un programa que usas seguido y usarlos enseguida.', '5 atajos usados al menos una vez cada uno durante la sesión.', ['Elegir el programa', 'Buscar la lista oficial de atajos', 'Elegir 5', 'Practicarlos en un archivo real']],
      ['Avanzar un proyecto personal', 'Avanzar un proyecto en curso un paso visible: un archivo, un borrador, una página.', 'Al final de la sesión existe algo nuevo y lo puedes mostrar.', ['Elegir el proyecto', 'Definir el paso en una frase', 'Silenciar las notificaciones', 'Producir']],
      ['Crear un contenido corto', 'Escribir y preparar una publicación corta (post, video de 30 s, carrusel) sobre un tema que dominas.', 'El contenido está listo para publicar, aunque decidas no publicarlo.', ['Elegir la idea', 'Escribir el gancho', 'Redactar o grabar', 'Revisar una vez']],
      ['Retomar una lección guardada', 'Volver a abrir un recurso guardado y aplicar un paso que no habías hecho.', 'Un paso más marcado y anotaste lo que aprendiste.', ['Abrir el recurso', 'Ubicar el siguiente paso', 'Hacerlo', 'Anotar el resultado']],
      ['Ejercicio práctico cronometrado', 'Elegir una habilidad que estás aprendiendo y hacer un ejercicio concreto con tiempo límite.', 'El ejercicio terminado a tiempo, con una nota sobre dónde te trabaste.', ['Elegir el ejercicio', 'Poner un temporizador', 'Hacer el ejercicio', 'Anotar dónde te trabaste']],
      ['Explorar una nueva disciplina', 'Ver o leer una introducción a una disciplina nueva y hacer un primer intento práctico.', 'Un primer intento hecho y una decisión: seguir o no.', ['Elegir la disciplina', 'Encontrar una introducción de menos de 20 min', 'Hacer un primer intento', 'Decidir qué sigue']],
      ['Terminar lo pendiente', 'Elegir una tarea empezada hace tiempo y terminarla o cerrarla oficialmente.', 'La tarea está terminada, o abandonada por escrito con el motivo.', ['Anotar 3 cosas empezadas', 'Elegir una', 'Terminarla o cerrarla', 'Anotar lo que te libera']],
    ],
    hustle: [
      ['Analizar 3 páginas de venta', 'Estudiar tres páginas de venta de un nicho, anotar cinco elementos que se repiten y redactar tu propia propuesta de valor.', '5 elementos anotados y una propuesta de valor en una frase.', ['Elegir el nicho', 'Encontrar 3 páginas de venta', 'Anotar lo que tienen en común', 'Escribir tu propuesta de valor']],
      ['Encontrar un problema de clientes', 'Leer reseñas o foros de un nicho y anotar 5 quejas que se repiten.', '5 quejas anotadas con la fuente de cada una.', ['Elegir el nicho', 'Leer reseñas y foros', 'Agrupar las quejas', 'Quedarte con las 5 más frecuentes']],
      ['Maqueta de landing page', 'Crear una landing page simple para una idea: título, promesa, 3 beneficios y un botón de registro.', 'Una página con un enlace que puedes mandarle a alguien.', ['Elegir la idea', 'Escribir el título y la promesa', 'Armar la página con una herramienta gratuita', 'Probar el enlace en tu celular']],
      ['Contactar a 5 prospectos', 'Mandar un mensaje personalizado a 5 clientes potenciales para pedirles su opinión sobre un problema.', '5 mensajes enviados y registrados en una lista.', ['Definir el perfil buscado', 'Encontrar 5 personas', 'Escribir un mensaje corto', 'Enviar y registrar']],
      ['Automatizar una tarea repetitiva', 'Identificar una tarea que haces cada semana y automatizarla con una herramienta gratuita.', 'La tarea corre una vez sin ti.', ['Anotar tus tareas repetitivas', 'Elegir una simple', 'Elegir la herramienta', 'Probar la automatización']],
      ['Idea de producto digital', 'Definir un pequeño producto digital vendible: para quién, qué problema, qué formato, qué precio de prueba.', 'Una ficha de media página con esas cuatro respuestas.', ['Elegir el público', 'Formular el problema', 'Elegir el formato', 'Fijar un precio de prueba']],
      ['Estudiar a un competidor', 'Analizar a un competidor de una idea: oferta, precios, canales de captación, debilidades visibles.', 'Una ficha del competidor con al menos una debilidad aprovechable.', ['Elegir el competidor', 'Anotar la oferta y los precios', 'Identificar sus canales', 'Anotar sus debilidades']],
      ['Prototipo de mini herramienta', 'Construir una primera versión clicable de una pequeña herramienta que resuelve un problema concreto.', 'Otra persona puede usarla sin que le expliques.', ['Definir el problema en una frase', 'Dibujar la pantalla principal', 'Construir la versión más simple', 'Pedirle a una persona que la pruebe']],
      ['Video demo con IA', 'Producir un video de demostración de 60 segundos de una idea con herramientas de IA.', 'Un video de 60 s exportado.', ['Escribir el guion', 'Elegir la herramienta', 'Generar y editar', 'Exportar']],
      ['Probar un precio', 'Presentar una oferta a 3 personas con un precio concreto y anotar sus reacciones.', '3 reacciones anotadas, al menos una sobre el precio.', ['Redactar la oferta', 'Fijar el precio', 'Presentarla a 3 personas', 'Anotar las reacciones']],
    ],
  },
}

function parseId(id: string): { wheel: WheelKind; index: number } | null {
  const m = /^demo-(envies|hustle)-(\d+)$/.exec(id)
  if (!m) return null
  return { wheel: m[1] as WheelKind, index: Number(m[2]) - 1 }
}

export interface MissionText {
  title: string
  objective: string
  successCriterion: string
  steps: string[]
}

/** Texte d'une mission d'exemple dans la langue demandée. */
export function demoText(id: string, lang: Lang): MissionText | undefined {
  const p = parseId(id)
  const t = p && TEXT[lang][p.wheel][p.index]
  if (!t) return undefined
  return { title: t[0], objective: t[1], successCriterion: t[2], steps: t[3] }
}

export function demoMissions(lang: Lang): Mission[] {
  const now = new Date().toISOString()
  return (['envies', 'hustle'] as WheelKind[]).flatMap((wheel) =>
    META[wheel].map(([durationMin, difficulty], i) => {
      const [title, objective, successCriterion, steps] = TEXT[lang][wheel][i]
      return {
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
      }
    }),
  )
}

/** Texte à afficher pour une mission : traduit si c'est un exemple non modifié. */
export function missionText(m: Mission, lang: Lang): MissionText {
  return (m.demo && demoText(m.id, lang)) || m
}
