/* ---------------------------------------------------------------
   Données des visionnages.
   Source : note Apple « Dramas i watched since 03/2025 ».
   Métadonnées (année, épisodes, genres, note des fans, synopsis)
   récupérées sur MyDramaList.

   Pour ajouter un drama : copier un bloc et compléter les champs.
     note      : ta note sur 5 (null si pas encore notée)
     noteMdl   : moyenne MyDramaList, sur 10
     noteViki  : moyenne Viki, sur 10 (facultatif)
     votesViki : nombre de votes Viki, sert à pondérer le consensus
     periode   : "2025" ou "2026" (les deux blocs de la note d'origine)
   --------------------------------------------------------------- */

const DRAMAS = [
  // ------------------------- Depuis mars 2025 -------------------------
  {
    titre: "Squid Game",
    mention: "Saisons 1 à 3",
    pays: "KR",
    annee: 2021,
    episodes: "9 ép. (S1)",
    genres: ["Thriller", "Survie", "Drame"],
    noteMdl: 8.4,
    note: 2.5,
    periode: "2025",
    synopsis:
      "Criblé de dettes, Seong Gi-hun accepte de participer à un jeu mystérieux où 456 joueurs désargentés s'affrontent dans des jeux d'enfants. Le vainqueur repartira avec une fortune ; les perdants, eux, ne repartiront pas.",
  },
  {
    titre: "Alice in Borderland",
    mention: "Saisons 1 à 3",
    pays: "JP",
    annee: 2020,
    episodes: "8 ép. (S1)",
    genres: ["Thriller", "Science-fiction", "Survie"],
    noteMdl: 8.9,
    note: 4,
    periode: "2025",
    synopsis:
      "Arisu, jeune homme désœuvré et accro aux jeux vidéo, se retrouve brutalement projeté dans un Tokyo vidé de ses habitants. Pour survivre, lui et ses amis doivent remporter des épreuves mortelles dont les règles leur échappent.",
  },
  {
    titre: "Weak Hero Class",
    mention: "Classes 1 et 2",
    pays: "KR",
    annee: 2022,
    episodes: "8 ép. (Class 1)",
    genres: ["Drame", "Scolaire", "Action"],
    noteMdl: 9.1,
    noteViki: 9.62,
    votesViki: 98101,
    note: 4.5,
    periode: "2025",
    synopsis:
      "Yeon Si-eun est le premier de sa classe. Physiquement frêle, il compense par une intelligence redoutable qu'il transforme en arme face à la violence qui règne dans son lycée.",
  },
  {
    titre: "All of Us Are Dead",
    pays: "KR",
    annee: 2022,
    episodes: "12 ép.",
    genres: ["Horreur", "Scolaire", "Survie"],
    noteMdl: 8.6,
    note: 3.5,
    periode: "2025",
    synopsis:
      "Un lycée devient l'épicentre d'une épidémie zombie. Piégés dans les bâtiments, les élèves doivent se frayer un chemin vers la sortie avant d'être rattrapés — ou contaminés.",
  },
  {
    titre: "Twenty Five Twenty One",
    pays: "KR",
    annee: 2022,
    episodes: "16 ép.",
    genres: ["Romance", "Sport", "Drame"],
    noteMdl: 8.8,
    note: 5,
    periode: "2025",
    synopsis:
      "En pleine crise financière sud-coréenne, l'équipe d'escrime de la lycéenne Na Hee-do est dissoute. Elle s'accroche pourtant à son rêve d'intégrer l'équipe nationale, pendant que la vie de Baek Yi-jin bascule avec la ruine de sa famille.",
  },
  {
    titre: "Mr. Plankton",
    pays: "KR",
    annee: 2024,
    episodes: "10 ép.",
    genres: ["Romance", "Comédie", "Road-trip"],
    noteMdl: 8.6,
    note: 3,
    periode: "2025",
    synopsis:
      "Hae-jo, mis au ban à cause de ses origines inconnues, part sur les routes à la recherche de son véritable père. Jae-mi, qui rêve d'une famille, décide de l'accompagner malgré ses fiançailles.",
  },
  {
    titre: "Bloodhounds",
    mention: "Saisons 1 et 2",
    pays: "KR",
    annee: 2023,
    episodes: "8 ép. (S1)",
    genres: ["Action", "Drame", "Amitié"],
    noteMdl: 8.7,
    note: 4,
    periode: "2025",
    synopsis:
      "Deux jeunes boxeurs et anciens marines, que tout oppose sur le ring, deviennent inséparables. Leur amitié les entraîne dans l'univers brutal des prêteurs sur gages illégaux.",
  },
  {
    titre: "Twinkling Watermelon",
    pays: "KR",
    annee: 2023,
    episodes: "16 ép.",
    genres: ["Fantastique", "Musique", "Famille"],
    noteMdl: 9.2,
    noteViki: 9.76,
    votesViki: 149435,
    note: 5,
    periode: "2025",
    synopsis:
      "Eun-gyeol, lycéen né de parents sourds, mène une double vie : élève modèle le jour, guitariste la nuit. Un magasin de musique mystérieux le projette en 1995, où il rencontre son père adolescent — et entendant.",
  },
  {
    titre: "Friendly Rivalry",
    pays: "KR",
    annee: 2025,
    episodes: "16 ép.",
    genres: ["Drame", "Mystère", "Thriller"],
    noteMdl: 7.6,
    noteViki: 9.18,
    votesViki: 6168,
    note: 3,
    periode: "2025",
    synopsis:
      "Woo Seul-gi, orpheline venue de province, intègre un lycée d'élite réservé au 1 % des meilleurs élèves. Isolée, elle finit par se lier à Yoo Je-i, la première de l'établissement — une amitié vite trouble.",
  },
  {
    titre: "A Love So Beautiful",
    mention: "Version coréenne",
    pays: "KR",
    annee: 2020,
    episodes: "24 ép.",
    genres: ["Romance", "Scolaire", "Drame"],
    noteMdl: 7.7,
    noteViki: 9.32,
    votesViki: 85410,
    note: 2.5,
    periode: "2025",
    synopsis:
      "Cha Heon, brillant et distant, cache un cœur qu'il ne sait pas exprimer. Sin Sol-i, sa voisine de toujours, lui déclare sa flamme sans détour depuis des années.",
  },
  {
    titre: "Lovely Runner",
    pays: "KR",
    annee: 2024,
    episodes: "16 ép.",
    genres: ["Romance", "Fantastique", "Voyage temporel"],
    noteMdl: 8.9,
    noteViki: 9.75,
    votesViki: 287996,
    note: 5,
    periode: "2025",
    synopsis:
      "Ryu Sun-jae est une star adulée dont la vie parfaite n'est qu'une façade. Quand le pire survient, une fan remonte le temps pour tenter de le sauver — quitte à réécrire sa propre jeunesse.",
  },
  {
    titre: "True Beauty",
    pays: "KR",
    annee: 2020,
    episodes: "16 ép.",
    genres: ["Romance", "Comédie", "Scolaire"],
    noteMdl: 8.3,
    noteViki: 9.56,
    votesViki: 448098,
    note: 4.5,
    periode: "2025",
    synopsis:
      "Harcelée pour son physique, Lim Ju-gyeong apprend le maquillage sur YouTube et devient du jour au lendemain la beauté du lycée. Reste à savoir combien de temps elle pourra garder son visage démaquillé secret.",
  },
  {
    titre: "Good Boy",
    pays: "KR",
    annee: 2025,
    episodes: "16 ép.",
    genres: ["Action", "Comédie", "Policier"],
    noteMdl: 8.4,
    note: 3.5,
    periode: "2025",
    synopsis:
      "D'anciens médaillés olympiques rejoignent la police par la voie du recrutement spécial. Leurs disciplines respectives deviennent des armes inattendues face au crime organisé.",
  },
  {
    titre: "Untangled Love",
    mention: "Film — « Love Untangled »",
    pays: "KR",
    annee: 2025,
    episodes: "Film",
    genres: ["Romance", "Comédie"],
    noteMdl: 8.4,
    note: 2.5,
    periode: "2025",
    synopsis:
      "1998. Park Se-ri, 19 ans, veut à tout prix discipliner ses cheveux frisés avant de faire une déclaration qui changera sa vie. C'est le moment que choisit un nouveau venu, Han Yun-seok, pour tout compliquer.",
  },
  {
    titre: "My Dearest Nemesis",
    pays: "KR",
    annee: 2025,
    episodes: "12 ép.",
    genres: ["Romance", "Comédie", "Bureau"],
    noteMdl: 8.0,
    noteViki: 9.39,
    votesViki: 126224,
    note: 4,
    periode: "2025",
    synopsis:
      "Son grand amour de lycée, un joueur en ligne surnommé « Dragon Noir », s'était révélé n'être qu'un collégien maladroit. Seize ans plus tard, elle le retrouve — devenu son supérieur hiérarchique.",
  },
  {
    titre: "My Girlfriend Is the Man!",
    pays: "KR",
    annee: 2025,
    episodes: "12 ép.",
    genres: ["Romance", "Comédie", "Fantastique"],
    noteMdl: 7.5,
    noteViki: 9.08,
    votesViki: 9754,
    note: 3.5,
    periode: "2025",
    synopsis:
      "Étudiant en astronomie, Park Yun-jae voit sa petite amie se réveiller un matin dans le corps d'un homme. Le couple choisit de rester ensemble et de chercher comment inverser la métamorphose, entre un rival encombrant et des familles qui s'en mêlent.",
  },
  {
    titre: "Itaewon Class",
    pays: "KR",
    annee: 2020,
    episodes: "16 ép.",
    genres: ["Drame", "Revanche", "Entreprise"],
    noteMdl: 8.4,
    note: 4,
    periode: "2025",
    synopsis:
      "Exclu du lycée pour avoir frappé un harceleur, puis privé de son père dans un accident, Park Sae-ro-yi ouvre un bar à Itaewon. Son objectif : faire tomber le géant de la restauration responsable de son malheur.",
  },

  // ---------------------------- Depuis 2026 ----------------------------
  {
    titre: "When I Fly Toward You",
    pays: "CN",
    annee: 2023,
    episodes: "24 ép.",
    genres: ["Romance", "Scolaire", "Jeunesse"],
    noteMdl: 9.0,
    noteViki: 9.67,
    votesViki: 110773,
    note: 4.5,
    periode: "2026",
    synopsis:
      "Su Zai-zai débarque au lycée Yucai et tombe immédiatement sous le charme du distant Zhang Lu-rang. Derrière ses résultats brillants et son milieu privilégié, celui-ci dissimule pourtant un profond manque de confiance.",
  },
  {
    titre: "If Wishes Could Kill",
    pays: "KR",
    annee: 2026,
    episodes: "8 ép.",
    genres: ["Mystère", "Horreur", "Surnaturel"],
    noteMdl: 8.2,
    note: 3.5,
    periode: "2026",
    synopsis:
      "Au lycée Seorin, cinq amis découvrent Girigo, une application qui exauce les vœux — au prix de la vie de celui qui les formule. Quand le compte à rebours atteint zéro, la mort est inévitable.",
  },
  {
    titre: "Racket Boys",
    pays: "KR",
    annee: 2021,
    episodes: "16 ép.",
    genres: ["Sport", "Comédie", "Famille"],
    noteMdl: 8.7,
    note: 3.5,
    periode: "2026",
    synopsis:
      "Ancien champion de badminton en difficulté, Yoon Hyun-jong accepte d'entraîner l'équipe d'un collège de campagne au bord de la dissolution — trois joueurs en tout et pour tout.",
  },
  {
    titre: "My Name",
    pays: "KR",
    annee: 2021,
    episodes: "8 ép.",
    genres: ["Action", "Thriller", "Policier"],
    noteMdl: 8.7,
    note: null,
    periode: "2026",
    synopsis:
      "Après le meurtre de son père, Yoon Ji-woo infiltre la police pour se venger, téléguidée par le chef d'un puissant réseau de trafic de drogue.",
  },
  {
    titre: "Head Over Heels",
    pays: "KR",
    annee: 2025,
    episodes: "12 ép.",
    genres: ["Romance", "Fantastique", "Scolaire"],
    noteMdl: 8.4,
    note: 4.5,
    periode: "2026",
    synopsis:
      "Le jour, Park Seong-a est une lycéenne ordinaire. La nuit, elle exerce comme chamane sous le nom de Fée Cheon-ji, le visage à demi masqué pour préserver son identité.",
  },
  {
    titre: "Wonderfools",
    mention: "« The WONDERfools »",
    pays: "KR",
    annee: 2026,
    episodes: "8 ép.",
    genres: ["Drame", "Comédie", "Années 90"],
    noteMdl: 8.5,
    note: 3,
    periode: "2026",
    synopsis:
      "1999, dans une ville gagnée par la peur de la fin du monde. C'est là qu'émergent des héros aussi improbables qu'inattendus, menés par la fantasque Eun Chae-ni.",
  },
  {
    titre: "Exclusive Fairytale",
    pays: "CN",
    annee: 2023,
    episodes: "24 ép.",
    genres: ["Romance", "Drame", "Jeunesse"],
    noteMdl: 8.3,
    noteViki: 9.49,
    votesViki: 64086,
    note: 4.5,
    periode: "2026",
    synopsis:
      "L'histoire de Ling Chao et Xiao Tu, amis d'enfance devenus inséparables, qui traversent ensemble les joies et les peines de l'adolescence puis de l'âge adulte.",
  },
  {
    titre: "The Boy of the Last Row",
    mention: "« Notes from the Last Row »",
    pays: "KR",
    annee: 2026,
    episodes: "6 ép.",
    genres: ["Drame", "Littérature"],
    noteMdl: 8.0,
    note: 4,
    periode: "2026",
    synopsis:
      "Heo Mun-o, écrivain raté devenu professeur de lettres, découvre le talent hors norme de Lee Gang, un élève taciturne assis au dernier rang de sa classe.",
  },
  {
    titre: "Teach You a Lesson !",
    pays: "KR",
    annee: 2026,
    episodes: "10 ép.",
    genres: ["Drame", "Scolaire", "Social"],
    noteMdl: 9.0,
    note: 3.5,
    periode: "2026",
    synopsis:
      "Les enseignants ne parviennent plus à faire respecter la discipline, et beaucoup ont renoncé à essayer. L'effondrement de leur autorité en classe devient un véritable problème de société.",
  },
  {
    titre: "My ID is Gangnam Beauty",
    pays: "KR",
    annee: 2018,
    episodes: "16 ép.",
    genres: ["Romance", "Scolaire", "Drame"],
    noteMdl: 7.6,
    noteViki: 9.33,
    votesViki: 169118,
    note: 3,
    periode: "2026",
    synopsis:
      "Longtemps harcelée pour son apparence, Kang Mi-rae a grandi dans la méfiance et le repli. Décidée à repartir de zéro, elle a recours à la chirurgie esthétique — et découvre que le regard des autres ne change pas pour autant.",
  },
  {
    titre: "The Legend of the Kitchen Soldier",
    pays: "KR",
    annee: 2026,
    episodes: "12 ép.",
    genres: ["Comédie", "Fantastique", "Armée"],
    noteMdl: 8.4,
    noteViki: 9.6,
    votesViki: 15472,
    note: 2.5,
    periode: "2026",
    synopsis:
      "Engagé à l'armée pour fuir une réalité trop rude, Kang Seong-jae voit apparaître devant lui un écran de « quêtes » virtuel qui le pousse à devenir cuisinier militaire.",
  },
  {
    titre: "Melo Movie",
    pays: "KR",
    annee: 2025,
    episodes: "10 ép.",
    genres: ["Romance", "Comédie", "Cinéma"],
    noteMdl: 8.1,
    note: 4,
    periode: "2026",
    critique: "critiques/melo-movie.html",
    critiqueDate: "8 août 2026",
    critiqueExtrait:
      "Pour le contexte, à l'origine je ne cherchais qu'à regarder une œuvre qui présentait l'actrice Jeon So-young, récemment récompensée pour son rôle principal de Yoo Se-ah dans « If Wishes Could Kill »…",
    synopsis:
      "Kim Mu-bee, réalisatrice en devenir, travaille dans l'ombre pour suivre les traces de son père. Ko Gyeom, critique passionné, s'est donné pour mission de voir tous les films jamais réalisés. Cinq ans après s'être perdus de vue, ils redeviennent voisins.",
  },
  {
    titre: "Our Beloved Summer",
    pays: "KR",
    annee: 2021,
    episodes: "16 ép.",
    genres: ["Romance", "Drame", "Jeunesse"],
    noteMdl: 8.6,
    note: 4.5,
    periode: "2026",
    synopsis:
      "Des années après un documentaire scolaire devenu viral, deux anciens amants que tout oppose sont rappelés devant la caméra — et forcés de se réinviter dans la vie l'un de l'autre.",
  },
];

/* Séries repérées, pas encore visionnées (note « Drama à voir »). */
const A_VOIR = ["Delightfully Deceitful", "The Trunk"];

/* Libellés des pays. */
const PAYS = {
  KR: { drapeau: "🇰🇷", nom: "Corée du Sud" },
  JP: { drapeau: "🇯🇵", nom: "Japon" },
  CN: { drapeau: "🇨🇳", nom: "Chine" },
};
