/* ===============================================================
   TROIS LANGUES

   Le français est la langue d'origine : c'est celle dans laquelle
   Noah écrit. L'anglais et le coréen en sont des traductions.

   Le balisage porte des attributs `data-i18n` ; le contenu rendu en
   JavaScript passe par t(). Les chaînes à trous utilisent {0}, {1}…
   =============================================================== */

const LANGUES = {
  fr: { nom: "Français", court: "FR", htmlLang: "fr" },
  en: { nom: "English", court: "EN", htmlLang: "en" },
  ko: { nom: "한국어", court: "KO", htmlLang: "ko" },
};

const TEXTES = {

  /* ---------------- Navigation ---------------- */
  "nav.carnet":      { fr: "Le carnet", en: "The journal", ko: "기록" },
  "nav.visionnages": { fr: "Les visionnages", en: "Watchlist", ko: "시청 목록" },
  "nav.portrait":    { fr: "Portrait", en: "Portrait", ko: "자화상" },
  "nav.guide":       { fr: "Guide", en: "Guide", ko: "안내" },
  "nav.reglages":    { fr: "Réglages", en: "Settings", ko: "설정" },
  "nav.retourCarnet":{ fr: "Retour au carnet", en: "Back to the journal", ko: "기록으로 돌아가기" },
  "nav.tousVisionnages": { fr: "Tous les visionnages", en: "All entries", ko: "전체 목록" },

  /* ---------------- Carrousel ---------------- */
  "ring.indice":  { fr: "Glisser · molette · flèches", en: "Drag · scroll · arrows", ko: "드래그 · 스크롤 · 방향키" },
  "ring.entrer":  { fr: "Entrer dans le carnet", en: "Enter the journal", ko: "기록 보기" },
  "ring.aria":    { fr: "Carrousel des affiches. Utiliser les flèches gauche et droite pour parcourir.",
                    en: "Poster carousel. Use the left and right arrow keys to browse.",
                    ko: "포스터 캐러셀. 좌우 방향키로 이동하세요." },

  /* ---------------- Accueil ---------------- */
  "carnet.titre":   { fr: "Carnet<br>de dramas", en: "A drama<br>journal", ko: "드라마<br>기록" },
  "carnet.chapeau": { fr: "Trente titres consignés au fil des visionnages : mes notes sur cinq, celles du public, et de temps en temps une vraie critique.",
                      en: "Thirty titles logged as I watched them: my ratings out of five, the public's, and now and then a proper review.",
                      ko: "시청하며 기록한 서른 편. 5점 만점의 내 평점, 대중의 평점, 그리고 이따금 제대로 쓴 리뷰." },
  "carnet.auteur":  { fr: "Par Noah Guerbois<br>Sources MyDramaList &amp; Viki",
                      en: "By Noah Guerbois<br>Sources: MyDramaList &amp; Viki",
                      ko: "노아 게르부아<br>출처: MyDramaList, Viki" },
  "carnet.depuis":  { fr: "Depuis janvier 2025", en: "Since January 2025", ko: "2025년 1월부터" },
  "carnet.retourCarrousel": { fr: "Revenir au carrousel", en: "Back to the carousel", ko: "캐러셀로 돌아가기" },
  "carnet.critiques":{ fr: "Critiques", en: "Reviews", ko: "리뷰" },
  "carnet.derniers": { fr: "Derniers visionnages", en: "Recently watched", ko: "최근 시청" },
  "carnet.voirTout": { fr: "Voir les {0}", en: "See all {0}", ko: "{0}편 전체 보기" },

  /* ---------------- Visionnages ---------------- */
  "vis.titre":    { fr: "Les<br>visionnages", en: "The<br>watchlist", ko: "시청<br>목록" },
  "vis.chapeau":  { fr: "Dans l'ordre où je les ai regardés. La recherche porte aussi sur les genres et les synopsis.",
                    en: "In the order I watched them. Search also covers genres and synopses.",
                    ko: "시청한 순서대로. 검색은 장르와 줄거리도 포함합니다." },
  "vis.rechercher": { fr: "Rechercher", en: "Search", ko: "검색" },
  "vis.rechercheAria": { fr: "Rechercher un titre, un genre, un synopsis",
                         en: "Search a title, a genre, a synopsis",
                         ko: "제목, 장르, 줄거리 검색" },
  "vis.tri":      { fr: "Tri", en: "Sort", ko: "정렬" },
  "vis.genre":    { fr: "Genre", en: "Genre", ko: "장르" },
  "vis.pays":     { fr: "Pays", en: "Country", ko: "국가" },
  "vis.tous":     { fr: "Tous", en: "All", ko: "전체" },
  "vis.triOrdre": { fr: "Ordre de visionnage", en: "Order watched", ko: "시청 순서" },
  "vis.triNoteDesc": { fr: "Ma note ↓", en: "My rating ↓", ko: "내 평점 ↓" },
  "vis.triNoteAsc":  { fr: "Ma note ↑", en: "My rating ↑", ko: "내 평점 ↑" },
  "vis.triPublic":   { fr: "Note du public ↓", en: "Public rating ↓", ko: "대중 평점 ↓" },
  "vis.triAnnee":    { fr: "Année ↓", en: "Year ↓", ko: "연도 ↓" },
  "vis.triTitre":    { fr: "Titre A→Z", en: "Title A→Z", ko: "제목 가나다순" },
  "vis.aucun":    { fr: "Aucun visionnage ne correspond", en: "Nothing matches", ko: "일치하는 항목이 없습니다" },
  "vis.titres":   { fr: "{0} titres", en: "{0} titles", ko: "{0}편" },

  /* ---------------- Fiches ---------------- */
  "fiche.vuEn":     { fr: "Vu en {0}", en: "Watched in {0}", ko: "{0} 시청" },
  "fiche.maNote":   { fr: "Ma note", en: "My rating", ko: "내 평점" },
  "fiche.public":   { fr: "Le public", en: "The public", ko: "대중 평점" },
  "fiche.publicCourt": { fr: "Public", en: "Public", ko: "대중" },
  "fiche.pasNotee": { fr: "Pas encore notée", en: "Not rated yet", ko: "아직 평가 없음" },
  "fiche.aNoter":   { fr: "à noter", en: "unrated", ko: "미평가" },
  "fiche.voirFiche":{ fr: "Voir la fiche", en: "Open the entry", ko: "상세 보기" },
  "fiche.lireCritique": { fr: "Lire la critique", en: "Read the review", ko: "리뷰 읽기" },
  "fiche.maCritique":   { fr: "Lire ma critique", en: "Read my review", ko: "내 리뷰 읽기" },
  "fiche.synopsisVide": { fr: "Synopsis à compléter.", en: "Synopsis to be filled in.", ko: "줄거리 미작성." },
  "fiche.introuvable":  { fr: "Série introuvable", en: "Series not found", ko: "시리즈를 찾을 수 없습니다" },

  /* ---------------- Fiche individuelle ---------------- */
  "serie.vuEn":       { fr: "Vu en", en: "Watched", ko: "시청 시기" },
  "serie.origine":    { fr: "Origine", en: "Origin", ko: "제작 국가" },
  "serie.diffusion":  { fr: "Diffusion", en: "Aired", ko: "방영" },
  "serie.format":     { fr: "Format", en: "Format", ko: "구성" },
  "serie.genres":     { fr: "Genres", en: "Genres", ko: "장르" },
  "serie.realisation":{ fr: "Réalisation", en: "Director", ko: "연출" },
  "serie.fiche":      { fr: "Fiche MyDramaList", en: "MyDramaList entry", ko: "MyDramaList 페이지" },
  "serie.roles":      { fr: "Rôles principaux", en: "Main cast", ko: "주요 출연진" },
  "serie.proches":    { fr: "Dans la même veine", en: "In the same vein", ko: "비슷한 작품" },
  "serie.avant":      { fr: "Vu juste avant", en: "Watched just before", ko: "바로 이전 시청" },
  "serie.apres":      { fr: "Vu juste après", en: "Watched just after", ko: "바로 다음 시청" },
  "serie.consensus":  { fr: "Pile dans le consensus", en: "Right on consensus", ko: "대중과 일치" },
  "serie.dessus":     { fr: "{0} point au-dessus du public", en: "{0} point above the public", ko: "대중보다 {0}점 높음" },
  "serie.dessous":    { fr: "{0} point en dessous du public", en: "{0} point below the public", ko: "대중보다 {0}점 낮음" },
  "serie.votes":      { fr: "{0} votes", en: "{0} votes", ko: "{0}표" },

  /* ---------------- Pays et mois ---------------- */
  "pays.KR": { fr: "Corée du Sud", en: "South Korea", ko: "대한민국" },
  "pays.JP": { fr: "Japon", en: "Japan", ko: "일본" },
  "pays.CN": { fr: "Chine", en: "China", ko: "중국" },

  /* ---------------- Pied de page ---------------- */
  "pied.carnet":   { fr: "Le carnet", en: "The journal", ko: "이 기록" },
  "pied.texte":    { fr: "Journal de visionnage tenu depuis janvier 2025. Chaque série y est notée sur cinq, résumée, et comparée à l'avis du public. Quelques-unes ont droit à une vraie critique.",
                     en: "A viewing journal kept since January 2025. Every series is rated out of five, summarised, and set against the public's opinion. A few get a proper review.",
                     ko: "2025년 1월부터 이어온 시청 기록. 모든 작품에 5점 만점의 평점과 줄거리를 남기고 대중의 평가와 견줍니다. 일부에는 제대로 된 리뷰를 씁니다." },
  "pied.chiffres": { fr: "En chiffres", en: "In numbers", ko: "숫자로" },
  "pied.series":   { fr: "séries", en: "series", ko: "편" },
  "pied.episodes": { fr: "épisodes", en: "episodes", ko: "화" },
  "pied.heures":   { fr: "heures de visionnage", en: "hours watched", ko: "시청 시간" },
  "pied.moyenne":  { fr: "de moyenne sur 5", en: "average out of 5", ko: "평균 (5점 만점)" },
  "pied.paysNb":   { fr: "pays d'origine", en: "countries of origin", ko: "제작 국가" },
  "pied.dernier":  { fr: "Le dernier vu", en: "Last watched", ko: "마지막 시청작" },
  "pied.cinqSurCinq": { fr: "Notées 5 sur 5", en: "Rated 5 out of 5", ko: "5점 만점 작품" },
  "pied.parcourir":{ fr: "Parcourir", en: "Browse", ko: "둘러보기" },
  "pied.periode":  { fr: "Période couverte", en: "Period covered", ko: "기록 기간" },
  "pied.moisNb":   { fr: "{0} mois", en: "{0} months", ko: "{0}개월" },
  "pied.lienCarrousel":  { fr: "Le carrousel", en: "The carousel", ko: "캐러셀" },
  "pied.lienCarnet":     { fr: "Le carnet", en: "The journal", ko: "기록" },
  "pied.lienVisionnages":{ fr: "Les visionnages", en: "The watchlist", ko: "시청 목록" },
  "pied.lienPortrait":   { fr: "Le portrait chiffré", en: "The data portrait", ko: "데이터 자화상" },
  "pied.lienCritique":   { fr: "La critique de Melo Movie", en: "The Melo Movie review", ko: "멜로무비 리뷰" },
  "pied.signature":{ fr: "Carnet personnel — Noah Guerbois", en: "Personal journal — Noah Guerbois", ko: "개인 기록 — 노아 게르부아" },
  "pied.sources":  { fr: "Notes du public : MyDramaList et Viki, recentrées avant moyenne",
                     en: "Public ratings: MyDramaList and Viki, re-centred before averaging",
                     ko: "대중 평점: MyDramaList와 Viki, 표준화 후 평균" },
  "pied.credits":  { fr: "Affiches, durées et casting : <a href=\"https://mydramalist.com\">MyDramaList</a>",
                     en: "Posters, runtimes and cast: <a href=\"https://mydramalist.com\">MyDramaList</a>",
                     ko: "포스터, 러닝타임, 출연진: <a href=\"https://mydramalist.com\">MyDramaList</a>" },

  /* ---------------- Graphiques ---------------- */
  "viz.voirDonnees": { fr: "Voir les données", en: "Show the data", ko: "데이터 보기" },
  "viz.element":     { fr: "Élément", en: "Item", ko: "항목" },
  "viz.valeur":      { fr: "Valeur", en: "Value", ko: "값" },
  "viz.serie":       { fr: "Série", en: "Series", ko: "작품" },
  "viz.titre":       { fr: "Titre", en: "Title", ko: "제목" },
  "viz.ecart":       { fr: "Écart", en: "Gap", ko: "차이" },
  "viz.annee":       { fr: "Année", en: "Year", ko: "연도" },
  "viz.mois":        { fr: "Mois", en: "Month", ko: "월" },
  "viz.genre":       { fr: "Genre", en: "Genre", ko: "장르" },
  "viz.acteur":      { fr: "Acteur", en: "Actor", ko: "배우" },
  "viz.diffuseur":   { fr: "Diffuseur", en: "Network", ko: "방송사" },
  "viz.pays":        { fr: "Pays", en: "Country", ko: "국가" },
  "viz.part":        { fr: "Part", en: "Share", ko: "비율" },
  "viz.heures":      { fr: "Heures", en: "Hours", ko: "시간" },
  "viz.seriesU":     { fr: "séries", en: "series", ko: "편" },
  "viz.titresU":     { fr: "titres", en: "titles", ko: "편" },
  "viz.rolesPrincipaux": { fr: "Rôles principaux", en: "Main roles", ko: "주연" },
  "viz.seriesTerminees": { fr: "Séries terminées", en: "Series finished", ko: "완료한 작품" },
  "viz.maMoyenne":   { fr: "Ma note moyenne / 5", en: "My average out of 5", ko: "내 평균 평점 / 5" },
  "viz.aucuneSerie": { fr: "aucune série", en: "no series", ko: "없음" },
  "viz.uneSerie":    { fr: "{0} série", en: "{0} series", ko: "{0}편" },
  "viz.desSeries":   { fr: "{0} séries", en: "{0} series", ko: "{0}편" },
  "viz.epDe":        { fr: "{0} ép. de {1} min", en: "{0} ep. of {1} min", ko: "{0}화 · 회당 {1}분" },

  /* ---------------- Portrait ---------------- */
  "p.titre":    { fr: "Ce que mes<br>visionnages<br>disent de moi", en: "What my<br>watching says<br>about me", ko: "나의 시청 기록이<br>말해주는 것" },
  "p.chapeau":  { fr: "Trente séries laissent des traces. Voici ce qu'elles racontent quand on les compte : le temps englouti, les visages qui reviennent, les époques, les diffuseurs et les genres vers lesquels je penche.",
                  en: "Thirty series leave a mark. Here is what they say once counted: the hours swallowed, the faces that keep coming back, the eras, the networks and the genres I lean towards.",
                  ko: "서른 편은 흔적을 남긴다. 세어 보면 드러나는 것들 — 삼켜진 시간, 자꾸 마주치는 얼굴, 시대, 방송사, 그리고 내가 기우는 장르." },

  "p.1.num": { fr: "01 — Le temps", en: "01 — Time", ko: "01 — 시간" },
  "p.1.h":   { fr: "Ce que ça m'a coûté en heures", en: "What it cost me in hours", ko: "시간으로 치른 대가" },
  "p.1.p":   { fr: "Trente séries, {0} épisodes, {1} heures cumulées. Étalé depuis {2}, cela fait environ {3} minutes par jour, tous les jours, sans exception.",
               en: "Thirty series, {0} episodes, {1} hours in total. Spread out since {2}, that is about {3} minutes a day, every single day.",
               ko: "서른 편, {0}화, 도합 {1}시간. {2}부터 따지면 하루 평균 약 {3}분, 하루도 빠짐없이." },
  "p.1.hero": { fr: "heures devant un écran", en: "hours in front of a screen", ko: "화면 앞에서 보낸 시간" },
  "p.1.h2":  { fr: "Les huit plus gourmandes", en: "The eight hungriest", ko: "가장 오래 붙든 여덟 편" },
  "p.1.p2":  { fr: "En heures cumulées, épisodes et durée moyenne confondus.", en: "Total hours, episodes and average runtime combined.", ko: "화수와 평균 러닝타임을 합산한 총 시간." },
  "p.1.jours": { fr: "jours pleins", en: "full days", ko: "온전한 날" },
  "p.1.eps":   { fr: "épisodes", en: "episodes", ko: "화" },
  "p.1.minEp": { fr: "min par épisode", en: "min per episode", ko: "화당 분" },
  "p.1.minJour": { fr: "min par jour", en: "min per day", ko: "하루 분" },

  "p.2.num": { fr: "02 — Le rythme", en: "02 — Rhythm", ko: "02 — 리듬" },
  "p.2.h":   { fr: "Quand je regarde", en: "When I watch", ko: "언제 보는가" },
  "p.2.p":   { fr: "Trente séries réparties sur {0} mois, soit {1} par mois en moyenne. Mais la moyenne ment : {2} en a vu {3} à lui seul, quand {4} mois n'en comptent aucune.",
               en: "Thirty series over {0} months, {1} a month on average. But the average lies: {2} alone accounted for {3}, while {4} months hold none at all.",
               ko: "{0}개월에 걸친 서른 편, 월평균 {1}편. 하지만 평균은 거짓말이다. {2} 한 달에만 {3}편, 반면 {4}개월은 한 편도 없다." },
  "p.2.max":   { fr: "au meilleur mois", en: "in the busiest month", ko: "가장 많은 달" },
  "p.2.creux": { fr: "mois sans rien", en: "empty months", ko: "빈 달" },
  "p.2.mois":  { fr: "mois couverts", en: "months covered", ko: "기록된 개월" },

  "p.3.num": { fr: "03 — Les visages", en: "03 — Faces", ko: "03 — 얼굴" },
  "p.3.h":   { fr: "Les acteurs que je croise partout", en: "The actors I keep running into", ko: "자꾸 마주치는 배우들" },
  "p.3.p":   { fr: "{0} apparaît dans {1} des trente séries — soit une sur cinq. En tout, {2} acteurs reviennent au moins deux fois dans un rôle principal.",
               en: "{0} appears in {1} of the thirty series — one in five. In all, {2} actors come back at least twice in a leading role.",
               ko: "{0}는 서른 편 중 {1}편에 나온다. 다섯 편에 한 번꼴. 주연으로 두 번 이상 등장하는 배우는 모두 {2}명." },

  "p.4.num": { fr: "04 — Les années", en: "04 — Years", ko: "04 — 연도" },
  "p.4.h":   { fr: "Les millésimes que je regarde", en: "The vintages I watch", ko: "내가 보는 연식" },
  "p.4.p":   { fr: "De {0} à {1}, avec un pic en {2} ({3} titres). Je regarde surtout des séries récentes, mais je remonte volontiers de quelques années quand un titre a laissé une trace.",
               en: "From {0} to {1}, peaking in {2} ({3} titles). I mostly watch recent series, but I happily go back a few years when a title has left its mark.",
               ko: "{0}년부터 {1}년까지, {2}년이 정점({3}편). 주로 최신작을 보지만, 인상 깊은 작품이라면 몇 해쯤 거슬러 오르는 것도 마다하지 않는다." },

  "p.5.num": { fr: "05 — Les diffuseurs", en: "05 — Networks", ko: "05 — 방송사" },
  "p.5.h":   { fr: "Qui produit ce que je regarde", en: "Who airs what I watch", ko: "무엇이 어디서 나오는가" },
  "p.5.p":   { fr: "{0} diffuse {1} des trente séries, {2} en porte {3}. Le reste se disperse sur {4} autres chaînes et plateformes. À noter : MyDramaList ne recense que le diffuseur d'origine, pas le studio de production.",
               en: "{0} carries {1} of the thirty, {2} carries {3}. The rest is spread across {4} other channels and platforms. Note: MyDramaList only records the original network, not the production studio.",
               ko: "{0}가 서른 편 중 {1}편, {2}가 {3}편을 내보냈다. 나머지는 {4}개 채널과 플랫폼에 흩어져 있다. 참고로 MyDramaList는 제작사가 아닌 최초 방영사만 기록한다." },

  "p.6.num": { fr: "06 — Les origines", en: "06 — Origins", ko: "06 — 국가" },
  "p.6.h":   { fr: "Une géographie très resserrée", en: "A very narrow geography", ko: "매우 좁은 지형도" },
  "p.6.p":   { fr: "Neuf séries sur dix viennent de Corée du Sud. Les deux titres chinois et l'unique japonais font figure d'exceptions — il y a clairement une porte d'entrée, et elle est coréenne.",
               en: "Nine out of ten come from South Korea. The two Chinese titles and the single Japanese one are exceptions — there is clearly one way in, and it is Korean.",
               ko: "열 편 중 아홉이 한국 작품이다. 중국 두 편과 일본 한 편은 예외에 가깝다. 입구는 분명 하나이고, 그것은 한국이다." },

  "p.7.num": { fr: "07 — Les genres", en: "07 — Genres", ko: "07 — 장르" },
  "p.7.h":   { fr: "Ce vers quoi je penche", en: "What I lean towards", ko: "내가 기우는 쪽" },
  "p.7.p":   { fr: "La romance arrive en tête avec {0} séries, devant le drame ({1}) et la comédie ({2}). Le cadre scolaire revient dans {3} titres : l'adolescence est manifestement un décor qui me parle.",
               en: "Romance leads with {0} series, ahead of drama ({1}) and comedy ({2}). School settings come back in {3} titles: adolescence is clearly a backdrop that speaks to me.",
               ko: "로맨스가 {0}편으로 1위, 드라마({1}편)와 코미디({2}편)가 뒤를 잇는다. 학교를 배경으로 한 작품이 {3}편. 청소년기라는 무대가 내게 확실히 말을 건다." },
  "p.7.h2":  { fr: "Quelle série dans quel genre", en: "Which series in which genre", ko: "어떤 작품이 어떤 장르인가" },
  "p.7.p2":  { fr: "Tous les genres relevés sur les trente séries. Cliquer sur un genre ouvre la liste filtrée sur celui-ci.",
               en: "Every genre found across the thirty series. Click a genre to open the list filtered on it.",
               ko: "서른 편에서 추린 모든 장르. 장르를 누르면 해당 목록이 열린다." },
  "p.7.h3":  { fr: "Ce que je note le mieux", en: "What I rate highest", ko: "내가 가장 높이 치는 것" },
  "p.7.p3":  { fr: "Ma note moyenne sur 5 par genre. Seuls les genres présents dans au moins trois séries figurent ici — en dessous, la moyenne ne veut rien dire.",
               en: "My average rating out of 5 by genre. Only genres present in at least three series appear here — below that, an average means nothing.",
               ko: "장르별 내 평균 평점(5점 만점). 세 편 이상인 장르만 표시한다. 그보다 적으면 평균은 의미가 없다." },
  "p.7.uniques": { fr: "Et {0} genres croisés une seule fois : ", en: "And {0} genres met just once: ", ko: "그리고 한 번만 등장한 장르 {0}개: " },

  "p.8.num": { fr: "08 — L'écart", en: "08 — The gap", ko: "08 — 간극" },
  "p.8.h":   { fr: "Là où je ne suis pas d'accord", en: "Where I disagree", ko: "내가 동의하지 않는 지점" },
  "p.8.p":   { fr: "Ma note ramenée sur dix, face à celle du public. {0} point d'écart en moyenne, mais réparti très inégalement : je surcote {1} de {2} point et je sous-cote {3} de {4}. Sur {5} titres en revanche, on tombe d'accord à moins d'un demi-point.",
               en: "My rating scaled to ten, against the public's. {0} point of gap on average, but very unevenly spread: I overrate {1} by {2} point and underrate {3} by {4}. On {5} titles, though, we agree to within half a point.",
               ko: "10점 척도로 환산한 내 평점과 대중 평점의 비교. 평균 {0}점 차이지만 편차가 크다. {1}은(는) {2}점 높게, {3}은(는) {4}점 낮게 매겼다. 반면 {5}편에서는 0.5점 이내로 일치한다." },
  "p.8.ecart":  { fr: "point d'écart moyen", en: "point average gap", ko: "평균 차이(점)" },
  "p.8.sur":    { fr: "titres surcotés", en: "titles overrated", ko: "높게 매긴 작품" },
  "p.8.sous":   { fr: "titres sous-cotés", en: "titles underrated", ko: "낮게 매긴 작품" },
  "p.8.accords":{ fr: "accords nets", en: "clear agreements", ko: "일치한 작품" },
  "p.8.moi":    { fr: "Ma note", en: "My rating", ko: "내 평점" },
  "p.8.public": { fr: "Le public", en: "The public", ko: "대중" },

  /* ---------------- Critique ---------------- */
  "critique.titre": { fr: "Avis critique sur «&nbsp;{0}&nbsp;»", en: "A review of “{0}”", ko: "「{0}」 리뷰" },
  "critique.vo":    { fr: "", en: "This review was written in French. It is shown here in its original language.",
                      ko: "이 리뷰는 프랑스어로 쓰였습니다. 원문 그대로 싣습니다." },

  /* ---------------- Guide ---------------- */
  "g.a1.t": { fr: "Le mur d'affiches", en: "The poster wall", ko: "포스터 벽" },
  "g.a1.p": { fr: "Les trente séries que j'ai regardées, posées sur un cylindre. Fais glisser à la souris, utilise la molette ou les flèches du clavier pour le faire tourner.", en: "The thirty series I have watched, set on a cylinder. Drag with the mouse, scroll, or use the arrow keys to turn it.", ko: "내가 본 서른 편이 원통 위에 놓여 있다. 마우스로 끌거나 스크롤, 방향키로 돌려 보라." },
  "g.a2.t": { fr: "La série en façade", en: "The series in front", ko: "앞면의 작품" },
  "g.a2.p": { fr: "Le titre, le pays, l'année et ma note se mettent à jour selon l'affiche qui arrive de face.", en: "Title, country, year and my rating update as each poster comes to the front.", ko: "정면으로 오는 포스터에 따라 제목, 국가, 연도, 내 평점이 바뀐다." },
  "g.a3.t": { fr: "Ta position", en: "Where you are", ko: "현재 위치" },
  "g.a3.p": { fr: "La barre orange indique où tu en es dans les trente titres.", en: "The orange bar shows how far you are through the thirty titles.", ko: "주황색 막대가 서른 편 중 어디쯤인지 알려 준다." },
  "g.a4.t": { fr: "La navigation", en: "Getting around", ko: "둘러보기" },
  "g.a4.p": { fr: "Le carnet rassemble les chiffres et les critiques, les visionnages détaillent chaque série.", en: "The journal gathers the figures and the reviews; the watchlist details every series.", ko: "기록에는 수치와 리뷰가, 시청 목록에는 각 작품의 상세가 담겨 있다." },
  "g.a4.s": { fr: "Continuer sur Le carnet", en: "Continue to the journal", ko: "기록으로 이어 보기" },
  "g.b1.t": { fr: "Les chiffres clés", en: "The key figures", ko: "핵심 수치" },
  "g.b1.p": { fr: "Ma moyenne personnelle sur 5, celle du public sur 10, et le nombre de notes maximales que j'ai données.", en: "My own average out of 5, the public's out of 10, and how many perfect scores I have given.", ko: "5점 만점의 내 평균, 10점 만점의 대중 평균, 그리고 내가 만점을 준 횟수." },
  "g.b2.t": { fr: "Les critiques", en: "The reviews", ko: "리뷰" },
  "g.b2.p": { fr: "Les séries sur lesquelles j'ai écrit un vrai texte. Clique pour lire la critique en entier.", en: "The series I have actually written about. Click to read the full review.", ko: "제대로 글을 쓴 작품들. 눌러서 전문을 읽어 보라." },
  "g.b3.t": { fr: "Les derniers visionnages", en: "Recently watched", ko: "최근 시청" },
  "g.b3.p": { fr: "Les six dernières séries consignées. La jauge noire à droite, c'est ma note sur cinq.", en: "The last six entries. The black gauge on the right is my rating out of five.", ko: "가장 최근 여섯 편. 오른쪽 검은 게이지가 5점 만점의 내 평점이다." },
  "g.b3.s": { fr: "Continuer sur Les visionnages", en: "Continue to the watchlist", ko: "시청 목록으로 이어 보기" },
  "g.c1.t": { fr: "Chercher et trier", en: "Search and sort", ko: "검색과 정렬" },
  "g.c1.p": { fr: "La recherche fouille aussi les genres et les synopsis. Tu peux trier par ma note, par celle du public, par année, ou filtrer par pays.", en: "Search also digs into genres and synopses. Sort by my rating, the public's, or the year, or filter by country.", ko: "검색은 장르와 줄거리까지 훑는다. 내 평점, 대중 평점, 연도로 정렬하거나 국가로 거를 수 있다." },
  "g.c2.t": { fr: "Une fiche", en: "An entry", ko: "한 편의 항목" },
  "g.c2.p": { fr: "Affiche, synopsis, ma note et la note du public. Le numéro à gauche correspond à l'ordre dans lequel j'ai regardé les séries.", en: "Poster, synopsis, my rating and the public's. The number on the left is the order I watched them in.", ko: "포스터, 줄거리, 내 평점과 대중 평점. 왼쪽 번호는 내가 본 순서다." },
  "g.c3.t": { fr: "La note du public", en: "The public rating", ko: "대중 평점" },
  "g.c3.p": { fr: "Une moyenne de MyDramaList et de Viki. Les deux plateformes ne notent pas sur la même échelle, alors chacune est recentrée sur sa propre moyenne avant d'être combinée — sinon Viki, qui note très haut, écraserait tout.", en: "An average of MyDramaList and Viki. The two platforms do not rate on the same scale, so each is re-centred on its own average before being combined — otherwise Viki, which rates very high, would drown everything.", ko: "MyDramaList와 Viki의 평균. 두 플랫폼의 척도가 달라, 각각 자기 평균을 기준으로 표준화한 뒤 합친다. 그러지 않으면 후하게 매기는 Viki가 전부를 덮어 버린다." },
  "g.d1.t": { fr: "Le temps passé", en: "Time spent", ko: "보낸 시간" },
  "g.d1.p": { fr: "Le nombre d'heures est calculé série par série : nombre d'épisodes multiplié par la durée moyenne d'un épisode, telle que la donne MyDramaList.", en: "Hours are worked out series by series: episode count times the average runtime, as given by MyDramaList.", ko: "시간은 작품별로 계산한다. MyDramaList의 화수에 평균 러닝타임을 곱한 값이다." },
  "g.d2.t": { fr: "Lire un graphique", en: "Reading a chart", ko: "그래프 읽기" },
  "g.d2.p": { fr: "Survole une barre pour voir le détail — ici, les séries dans lesquelles joue l'acteur. Sous chaque graphique, « Voir les données » déplie le tableau complet.", en: "Hover a bar for the detail — here, the series the actor appears in. Under each chart, “Show the data” unfolds the full table.", ko: "막대에 마우스를 올리면 상세가 보인다. 여기서는 그 배우가 출연한 작품들. 각 그래프 아래 '데이터 보기'를 누르면 전체 표가 펼쳐진다." },
  "g.d3.t": { fr: "Des sections indépendantes", en: "Independent sections", ko: "독립된 섹션" },
  "g.d3.p": { fr: "Chaque section a sa propre couleur et se lit séparément : le temps, les acteurs, les années, les diffuseurs, les origines et les genres.", en: "Each section has its own colour and reads on its own: time, actors, years, networks, origins and genres.", ko: "각 섹션은 고유한 색을 갖고 따로 읽힌다. 시간, 배우, 연도, 방송사, 국가, 장르." },
  "g.e1.t": { fr: "La fiche en un coup d'œil", en: "The entry at a glance", ko: "한눈에 보는 정보" },
  "g.e1.p": { fr: "Date d'écriture, origine, format, et les deux notes.", en: "Date written, origin, format, and both ratings.", ko: "작성일, 제작 국가, 구성, 그리고 두 평점." },
  "g.e2.t": { fr: "Les avertissements", en: "The warnings", ko: "스포일러 경고" },
  "g.e2.p": { fr: "Les blocs orange signalent les passages qui dévoilent l'intrigue. Tu peux t'arrêter là si tu comptes regarder la série.", en: "Orange blocks flag passages that give the plot away. Stop there if you plan to watch the series.", ko: "주황색 블록은 줄거리를 드러내는 대목이다. 볼 계획이라면 거기서 멈춰도 좋다." },
  "g.f1.t": { fr: "Les deux notes", en: "Both ratings", ko: "두 평점" },
  "g.f1.p": { fr: "Ma note sur cinq à gauche, celle du public sur dix à droite, avec le détail des plateformes qui la composent.", en: "My rating out of five on the left, the public's out of ten on the right, with the platforms behind it.", ko: "왼쪽은 5점 만점의 내 평점, 오른쪽은 10점 만점의 대중 평점과 그 출처." },
  "g.f2.t": { fr: "Le casting", en: "The cast", ko: "출연진" },
  "g.f2.p": { fr: "Les rôles principaux, avec le nom du personnage sous chaque acteur.", en: "The main roles, with each actor's character name below.", ko: "주연 배우와 그 아래 배역 이름." },
  "g.f3.t": { fr: "Dans la même veine", en: "In the same vein", ko: "비슷한 작품" },
  "g.f3.p": { fr: "Les séries du carnet qui partagent le plus de genres avec celle-ci. Le nombre de genres communs décide du classement.", en: "The entries sharing the most genres with this one. The number of shared genres sets the order.", ko: "이 작품과 장르가 가장 많이 겹치는 항목들. 공통 장르 수로 순서를 정한다." },
  "g.precedent": { fr: "Précédent", en: "Back", ko: "이전" },
  "g.suivant":   { fr: "Suivant", en: "Next", ko: "다음" },
  "g.terminer":  { fr: "Terminer", en: "Done", ko: "완료" },
  "g.fermer":    { fr: "Fermer le guide", en: "Close the guide", ko: "안내 닫기" },

  /* ---------------- Réglages ---------------- */
  "reg.titre":   { fr: "Réglages", en: "Settings", ko: "설정" },
  "reg.langue":  { fr: "Langue", en: "Language", ko: "언어" },
  "reg.theme":   { fr: "Thème", en: "Theme", ko: "테마" },
  "reg.fermer":  { fr: "Fermer les réglages", en: "Close settings", ko: "설정 닫기" },
  "reg.note":    { fr: "Les traductions anglaise et coréenne sont dérivées du français, qui reste la langue d'origine du carnet.",
                   en: "The English and Korean versions are translated from the French, which remains the journal's original language.",
                   ko: "영어와 한국어 판은 원문인 프랑스어에서 옮긴 것입니다." },
  "reg.themeDefaut":  { fr: "Papier", en: "Paper", ko: "페이퍼" },
  "reg.themeDefautD": { fr: "Papier chaud, encre noire, accent orange", en: "Warm paper, black ink, orange accent", ko: "따뜻한 종이, 검은 잉크, 주황 포인트" },
  "reg.themeNolabels":  { fr: "No Labels", en: "No Labels", ko: "노 라벨스" },
  "reg.themeNolabelsD": { fr: "Crème, marine et brique — d'après mes projets portfolio et comebacks",
                          en: "Cream, navy and brick — after my portfolio and comebacks projects",
                          ko: "크림, 네이비, 벽돌색 — 포트폴리오와 컴백 프로젝트에서" },
  "reg.themeSombre":  { fr: "Nuit", en: "Night", ko: "나이트" },
  "reg.themeSombreD": { fr: "Fond sombre, teintes de graphique choisies pour lui",
                        en: "Dark ground, chart hues chosen for it",
                        ko: "어두운 배경, 그에 맞춘 차트 색상" },
};

/* Genres et mentions : le français reste la clé, seul l'affichage change. */

const GENRES_TRAD = {
  "Romance": { en: "Romance", ko: "로맨스" },
  "Drame": { en: "Drama", ko: "드라마" },
  "Comédie": { en: "Comedy", ko: "코미디" },
  "Scolaire": { en: "School", ko: "학원" },
  "Fantastique": { en: "Fantasy", ko: "판타지" },
  "Thriller": { en: "Thriller", ko: "스릴러" },
  "Action": { en: "Action", ko: "액션" },
  "Survie": { en: "Survival", ko: "서바이벌" },
  "Jeunesse": { en: "Youth", ko: "청춘" },
  "Horreur": { en: "Horror", ko: "공포" },
  "Sport": { en: "Sports", ko: "스포츠" },
  "Famille": { en: "Family", ko: "가족" },
  "Mystère": { en: "Mystery", ko: "미스터리" },
  "Policier": { en: "Crime", ko: "범죄" },
  "Science-fiction": { en: "Sci-fi", ko: "SF" },
  "Road-trip": { en: "Road trip", ko: "로드무비" },
  "Amitié": { en: "Friendship", ko: "우정" },
  "Musique": { en: "Music", ko: "음악" },
  "Voyage temporel": { en: "Time travel", ko: "타임슬립" },
  "Bureau": { en: "Office", ko: "오피스" },
  "Revanche": { en: "Revenge", ko: "복수" },
  "Entreprise": { en: "Business", ko: "비즈니스" },
  "Surnaturel": { en: "Supernatural", ko: "초자연" },
  "Années 90": { en: "The 90s", ko: "90년대" },
  "Littérature": { en: "Literature", ko: "문학" },
  "Social": { en: "Social", ko: "사회" },
  "Armée": { en: "Military", ko: "군대" },
  "Cinéma": { en: "Filmmaking", ko: "영화" },
};

const MENTIONS_TRAD = {
  "Saisons 1 à 3": { en: "Seasons 1 to 3", ko: "시즌 1~3" },
  "Saisons 1 et 2": { en: "Seasons 1 and 2", ko: "시즌 1~2" },
  "Classes 1 et 2": { en: "Class 1 and 2", ko: "클래스 1~2" },
  "Version coréenne": { en: "Korean version", ko: "한국판" },
  "Film — « Love Untangled »": { en: "Film — “Love Untangled”", ko: "영화 — 「Love Untangled」" },
  "« The WONDERfools »": { en: "“The WONDERfools”", ko: "「The WONDERfools」" },
  "« Notes from the Last Row »": { en: "“Notes from the Last Row”", ko: "「Notes from the Last Row」" },
};

function nomGenre(g) {
  var l = langue();
  if (l === "fr") return g;
  return (GENRES_TRAD[g] && GENRES_TRAD[g][l]) || g;
}

function nomMention(m) {
  var l = langue();
  if (!m || l === "fr") return m;
  return (MENTIONS_TRAD[m] && MENTIONS_TRAD[m][l]) || m;
}

/* « 9 ép. (S1) » → « 9 ep. (S1) » / « 9화 (S1) » */
function formatEpisodes(e) {
  if (!e) return "";
  var l = langue();
  if (l === "fr") return e;
  if (e === "Film") return l === "en" ? "Film" : "영화";
  return e.replace(/(\d+)\s*ép\./, function (_, n) {
    return l === "en" ? n + " ep." : n + "화";
  });
}

/* ---------------- Mécanique ---------------- */

const MEMOIRE_PREFS = "carnet:prefs";

function prefs() {
  try { return JSON.parse(localStorage.getItem(MEMOIRE_PREFS) || "{}"); }
  catch (e) { return {}; }
}

function enregistrerPrefs(p) {
  try { localStorage.setItem(MEMOIRE_PREFS, JSON.stringify(p)); } catch (e) {}
}

function langue() {
  var l = prefs().langue;
  return LANGUES[l] ? l : "fr";
}

/* t("vis.titres", 17) → « 17 titres » */
function t(cle, ...valeurs) {
  var entree = TEXTES[cle];
  if (!entree) return cle;
  var s = entree[langue()] || entree.fr;
  valeurs.forEach(function (v, i) {
    s = s.split("{" + i + "}").join(v);
  });
  return s;
}

/* Applique la langue au balisage statique. */
function appliquerLangue() {
  document.documentElement.setAttribute("lang", LANGUES[langue()].htmlLang);

  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.innerHTML = t(el.getAttribute("data-i18n"));
  });

  // data-i18n-attr="placeholder:vis.rechercher aria-label:vis.rechercheAria"
  document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
    el.getAttribute("data-i18n-attr").split(" ").forEach(function (paire) {
      var m = paire.split(":");
      if (m.length === 2) el.setAttribute(m[0], t(m[1]));
    });
  });
}
