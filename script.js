/* =========================================================================
   FAITH TALK ROULETTE — GAME LOGIC
   Organized in sections:
     1. Question data (numbers 1–100 -> { category, question })
     2. Category accent map
     3. State & localStorage persistence
     4. Theme / light-dark / sound toggles
     5. Wheel construction (SVG, built for 100 segments)
     6. Spin logic (selection, rotation math, animation)
     7. Sound engine (Web Audio API, no external files)
     8. Modal logic (question popup, completion, reset confirm)
     9. History / remaining-counter UI
     10. Init
   ========================================================================= */

/* ---------- 1. QUESTION DATA ---------- */
/* Every number 1–100 maps to exactly one category + question.
   This is the single source of truth for wheel + popup content. */
const QUESTIONS = {
  1: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang personal mong nararanasan tungkol sa pakikipagkaibigan mo kay Jehova?" } },
  2: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "How has prayer personally helped you, and why is it important to you?", tl: "Ano ang personal mong nararanasan tungkol sa pananampalataya mo?" } },
  3: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "What does it mean to imitate Jesus in your own life?", tl: "Ano ang personal mong nararanasan tungkol sa pagpapakumbaba mo?" } },
  4: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "What has personally strengthened your faith the most?", tl: "Ano ang personal mong nararanasan tungkol sa pag-asa mo?" } },
  5: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "How have your friendships affected your relationship with Jehovah?", tl: "Ano ang personal mong nararanasan tungkol sa mga desisyon mo?" } },
  6: { category: { en: "FUTURE & HOPE", tl: "HINAHARAP AT PAG-ASA" }, question: { en: "What does the Kingdom of God personally mean to you?", tl: "Ano ang personal mong nararanasan tungkol sa tao na gusto mong maging?" } },
  7: { category: { en: "BIBLE", tl: "BIBLIYA" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang personal mong nararanasan tungkol sa pagbubulay-bulay mo?" } },
  8: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "Why is forgiveness important personally meaningful to you?", tl: "Ano ang personal mong nararanasan tungkol sa pagiging mapagmahal mo?" } },
  9: { category: { en: "CONGREGATION", tl: "KONGREGASYON" }, question: { en: "How do you personally encourage someone who is discouraged?", tl: "Ano ang personal mong nararanasan tungkol sa pakikipagtulungan mo sa mga kaayusan?" } },
  10: { category: { en: "MINISTRY", tl: "MINISTERYO" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang personal mong nararanasan tungkol sa pagmamahal mo sa ministeryo?" } },
  11: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "Who is Jehovah to you, and how does knowing him affect your life?", tl: "Paano nakaapekto sa iyo ang pakikipagkaibigan mo kay Jehova?" } },
  12: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "How do you personally show self-control?", tl: "Paano nakaapekto sa iyo ang pagiging tapat mo?" } },
  13: { category: { en: "CHALLENGES", tl: "MGA HAMON" }, question: { en: "What can you personally learn from job’s endurance?", tl: "Paano nakaapekto sa iyo ang pagpapanatili ng pananampalataya?" } },
  14: { category: { en: "CONGREGATION", tl: "KONGREGASYON" }, question: { en: "Why is it personally important to you that we attend congregation meetings regularly?", tl: "Paano nakaapekto sa iyo ang pagtulong mo sa kongregasyon?" } },
  15: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "What does faith personally mean to you?", tl: "Paano nakaapekto sa iyo ang personal mong paninindigan?" } },
  16: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "What helps you personally feel closer to Jehovah?", tl: "Paano nakaapekto sa iyo ang paglago mo bilang Kristiyano?" } },
  17: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "When has honesty personally helped you?", tl: "Paano nakaapekto sa iyo ang pakikitungo mo sa iba?" } },
  18: { category: { en: "CHALLENGES", tl: "MGA HAMON" }, question: { en: "How does this personally affect your faith and your life?", tl: "Paano nakaapekto sa iyo ang pag-asa kay Jehova sa mahirap na panahon?" } },
  19: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "How does this personally affect your faith and your life?", tl: "Paano nakaapekto sa iyo ang konsensiya mo?" } },
  20: { category: { en: "MINISTRY", tl: "MINISTERYO" }, question: { en: "How does this personally affect your faith and your life?", tl: "Paano nakaapekto sa iyo ang pagmamahal mo sa ministeryo?" } },
  21: { category: { en: "BIBLE", tl: "BIBLIYA" }, question: { en: "How do you personally make personal bible study more meaningful?", tl: "Ano ang pinakamahalaga para sa iyo tungkol sa personal mong Bible study?" } },
  22: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "Why is it personally important to you that we trust jehovah’s direction?", tl: "Ano ang pinakamahalaga para sa iyo tungkol sa pananampalataya mo?" } },
  23: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "How do you personally try to show love to others?", tl: "Ano ang pinakamahalaga para sa iyo tungkol sa pagpapakumbaba mo?" } },
  24: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "What spiritual goal do you personally want to achieve?", tl: "Ano ang pinakamahalaga para sa iyo tungkol sa pag-asa mo?" } },
  25: { category: { en: "BIBLE", tl: "BIBLIYA" }, question: { en: "What does Jehovah’s name mean in your own life?", tl: "Ano ang pinakamahalaga para sa iyo tungkol sa paglalapat ng payo ng Bibliya?" } },
  26: { category: { en: "CHALLENGES", tl: "MGA HAMON" }, question: { en: "How do you personally remain positive during difficult circumstances?", tl: "Ano ang pinakamahalaga para sa iyo tungkol sa pagiging matiyaga?" } },
  27: { category: { en: "CONGREGATION", tl: "KONGREGASYON" }, question: { en: "Why is congregation association important personally meaningful to you?", tl: "Ano ang pinakamahalaga para sa iyo tungkol sa pagpapakita mo ng pag-ibig?" } },
  28: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang pinakamahalaga para sa iyo tungkol sa pagkakilala mo kay Jehova?" } },
  29: { category: { en: "FAMILY", tl: "PAMILYA" }, question: { en: "How do you personally show appreciation for family members?", tl: "Ano ang pinakamahalaga para sa iyo tungkol sa mga natutuhan mo sa pamilya?" } },
  30: { category: { en: "MINISTRY", tl: "MINISTERYO" }, question: { en: "What can you personally learn from jesus’ example in the ministry?", tl: "Ano ang pinakamahalaga para sa iyo tungkol sa pagmamahal mo sa ministeryo?" } },
  31: { category: { en: "BIBLE", tl: "BIBLIYA" }, question: { en: "Why is it personally important to you that we meditate on what we read?", tl: "Ano ang natutuhan mo mula sa personal mong Bible study?" } },
  32: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "How does Jehovah show patience in your own life?", tl: "Ano ang natutuhan mo mula sa pananampalataya mo?" } },
  33: { category: { en: "CONGREGATION", tl: "KONGREGASYON" }, question: { en: "Why is unity important among Christians personally meaningful to you?", tl: "Ano ang natutuhan mo mula sa pagbibigay mo ng pampatibay?" } },
  34: { category: { en: "MINISTRY", tl: "MINISTERYO" }, question: { en: "How do you personally improve our teaching ability?", tl: "Ano ang natutuhan mo mula sa pagtuturo mo sa Bibliya?" } },
  35: { category: { en: "BIBLE", tl: "BIBLIYA" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang natutuhan mo mula sa paglalapat ng payo ng Bibliya?" } },
  36: { category: { en: "CHALLENGES", tl: "MGA HAMON" }, question: { en: "How do you personally maintain spiritual routines during stressful periods?", tl: "Ano ang natutuhan mo mula sa pagiging matiyaga?" } },
  37: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "How has praying for other people affected you personally?", tl: "Ano ang natutuhan mo mula sa mga espirituwal na priyoridad mo?" } },
  38: { category: { en: "YOUNG ONES", tl: "MGA KABATAAN" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang natutuhan mo mula sa pagkakilala mo kay Jehova?" } },
  39: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "What does dedication to Jehovah mean in your own life?", tl: "Ano ang natutuhan mo mula sa mga pagpapalang natatanggap mo?" } },
  40: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "How do you personally avoid judging others unfairly?", tl: "Ano ang natutuhan mo mula sa pagiging mabuting halimbawa?" } },
  41: { category: { en: "BIBLE", tl: "BIBLIYA" }, question: { en: "Why is Jehovah’s name important personally meaningful to you?", tl: "Ano ang gusto mong mas pagbutihin pagdating sa personal mong Bible study?" } },
  42: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "How do you personally strengthen our relationship with jehovah through prayer?", tl: "Ano ang gusto mong mas pagbutihin pagdating sa pananampalataya mo?" } },
  43: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "What does it mean to have a clean conscience in your own life?", tl: "Ano ang gusto mong mas pagbutihin pagdating sa pagpapakumbaba mo?" } },
  44: { category: { en: "MINISTRY", tl: "MINISTERYO" }, question: { en: "Why is patience important in the ministry personally meaningful to you?", tl: "Ano ang gusto mong mas pagbutihin pagdating sa pagtuturo mo sa Bibliya?" } },
  45: { category: { en: "FAMILY", tl: "PAMILYA" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang gusto mong mas pagbutihin pagdating sa pagpapahalaga mo sa mga magulang?" } },
  46: { category: { en: "FUTURE & HOPE", tl: "HINAHARAP AT PAG-ASA" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang gusto mong mas pagbutihin pagdating sa tao na gusto mong maging?" } },
  47: { category: { en: "BIBLE", tl: "BIBLIYA" }, question: { en: "Why is regular Bible reading important personally meaningful to you?", tl: "Ano ang gusto mong mas pagbutihin pagdating sa pagbubulay-bulay mo?" } },
  48: { category: { en: "CHALLENGES", tl: "MGA HAMON" }, question: { en: "How do you personally respond when someone treats us unfairly?", tl: "Ano ang gusto mong mas pagbutihin pagdating sa pag-asa kay Jehova sa mahirap na panahon?" } },
  49: { category: { en: "BIBLE", tl: "BIBLIYA" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang gusto mong mas pagbutihin pagdating sa pag-unawa mo sa Kasulatan?" } },
  50: { category: { en: "CONGREGATION", tl: "KONGREGASYON" }, question: { en: "How do you personally seek help when we need encouragement?", tl: "Ano ang gusto mong mas pagbutihin pagdating sa mga karanasan mo sa kongregasyon?" } },
  51: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "How does Jehovah show love in your own life?", tl: "Ano ang nakakatulong sa iyo pagdating sa pakikipagkaibigan mo kay Jehova?" } },
  52: { category: { en: "CONGREGATION", tl: "KONGREGASYON" }, question: { en: "Why is it personally important to you that we cooperate with congregation arrangements?", tl: "Ano ang nakakatulong sa iyo pagdating sa pagdalo mo sa mga pulong?" } },
  53: { category: { en: "MINISTRY", tl: "MINISTERYO" }, question: { en: "How do you personally use bible verses effectively?", tl: "Ano ang nakakatulong sa iyo pagdating sa pakikipag-usap mo sa mga tao?" } },
  54: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "What does baptism mean to you in your own life?", tl: "Ano ang nakakatulong sa iyo pagdating sa pag-asa mo?" } },
  55: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang nakakatulong sa iyo pagdating sa mga desisyon mo?" } },
  56: { category: { en: "CHALLENGES", tl: "MGA HAMON" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang nakakatulong sa iyo pagdating sa pagiging matiyaga?" } },
  57: { category: { en: "MINISTRY", tl: "MINISTERYO" }, question: { en: "How do you personally show genuine interest in people in the ministry?", tl: "Ano ang nakakatulong sa iyo pagdating sa pagiging matiyaga mo sa ministeryo?" } },
  58: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "How do you personally avoid harmful influences?", tl: "Ano ang nakakatulong sa iyo pagdating sa pagiging mapagmahal mo?" } },
  59: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "What do you personally thank Jehovah for in your prayers?", tl: "Ano ang nakakatulong sa iyo pagdating sa mga pagpapalang natatanggap mo?" } },
  60: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "What do you personally do to be a better friend?", tl: "Ano ang nakakatulong sa iyo pagdating sa pagiging mabuting halimbawa?" } },
  61: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "What does it mean to dedicate yourself to Jehovah in your own life?", tl: "May karanasan ka bang talagang nagpatibay sa iyo tungkol sa pakikipagkaibigan mo kay Jehova?" } },
  62: { category: { en: "BIBLE", tl: "BIBLIYA" }, question: { en: "How do you personally apply bible counsel in everyday life?", tl: "May karanasan ka bang talagang nagpatibay sa iyo tungkol sa pagbabasa mo ng Bibliya?" } },
  63: { category: { en: "BIBLE", tl: "BIBLIYA" }, question: { en: "What can you personally learn from bible characters who made mistakes?", tl: "May karanasan ka bang talagang nagpatibay sa iyo tungkol sa paborito mong ulat sa Bibliya?" } },
  64: { category: { en: "FUTURE & HOPE", tl: "HINAHARAP AT PAG-ASA" }, question: { en: "Why is it personally important to you that we focus on jehovah’s promises?", tl: "May karanasan ka bang talagang nagpatibay sa iyo tungkol sa mga espirituwal mong pangarap?" } },
  65: { category: { en: "CONGREGATION", tl: "KONGREGASYON" }, question: { en: "How do you personally encourage our brothers and sisters?", tl: "May karanasan ka bang talagang nagpatibay sa iyo tungkol sa pagiging bahagi mo ng kongregasyon?" } },
  66: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "How do you personally make our prayers more specific?", tl: "May karanasan ka bang talagang nagpatibay sa iyo tungkol sa paglago mo bilang Kristiyano?" } },
  67: { category: { en: "FAMILY", tl: "PAMILYA" }, question: { en: "Why is communication important in a family personally meaningful to you?", tl: "May karanasan ka bang talagang nagpatibay sa iyo tungkol sa mga espirituwal na pag-uusap ninyo?" } },
  68: { category: { en: "BIBLE", tl: "BIBLIYA" }, question: { en: "What does Jehovah want humans to know about him in your own life?", tl: "May karanasan ka bang talagang nagpatibay sa iyo tungkol sa pagkatuto mo mula sa Bibliya?" } },
  69: { category: { en: "MINISTRY", tl: "MINISTERYO" }, question: { en: "How do you personally become more confident in the ministry?", tl: "May karanasan ka bang talagang nagpatibay sa iyo tungkol sa mga kakayahan mo sa ministeryo?" } },
  70: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "What motivates you personally to keep making spiritual progress?", tl: "May karanasan ka bang talagang nagpatibay sa iyo tungkol sa halimbawa mo sa iba?" } },
  71: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "How does Jehovah show justice in your own life?", tl: "Paano mo gustong lumago pagdating sa pakikipagkaibigan mo kay Jehova?" } },
  72: { category: { en: "CONGREGATION", tl: "KONGREGASYON" }, question: { en: "How do you personally benefit more from congregation meetings?", tl: "Paano mo gustong lumago pagdating sa pagdalo mo sa mga pulong?" } },
  73: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "How does this personally affect your faith and your life?", tl: "Paano mo gustong lumago pagdating sa paglapit mo kay Jehova?" } },
  74: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "How do you personally control our speech?", tl: "Paano mo gustong lumago pagdating sa pagpili mo ng entertainment?" } },
  75: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "Why is faith personally important to you?", tl: "Paano mo gustong lumago pagdating sa personal mong paninindigan?" } },
  76: { category: { en: "FAMILY", tl: "PAMILYA" }, question: { en: "How do you personally encourage a family member who is struggling?", tl: "Paano mo gustong lumago pagdating sa pagtutulungan ninyo sa espirituwal na paraan?" } },
  77: { category: { en: "CHALLENGES", tl: "MGA HAMON" }, question: { en: "How does this personally affect your faith and your life?", tl: "Paano mo gustong lumago pagdating sa pag-iwas sa masasamang impluwensiya?" } },
  78: { category: { en: "MINISTRY", tl: "MINISTERYO" }, question: { en: "How do you personally start conversations about the bible?", tl: "Paano mo gustong lumago pagdating sa pagpapakita mo ng interes sa tao?" } },
  79: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "Why is it personally important to you that we pray before making important decisions?", tl: "Paano mo gustong lumago pagdating sa mga pagpapalang natatanggap mo?" } },
  80: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "How do you personally use our abilities to serve jehovah?", tl: "Paano mo gustong lumago pagdating sa pagiging mabuting halimbawa?" } },
  81: { category: { en: "CONGREGATION", tl: "KONGREGASYON" }, question: { en: "How do you personally show love to those who are discouraged?", tl: "Ano ang isang bagay na ipinagpapasalamat mo tungkol sa pakikisama mo sa mga kapatid?" } },
  82: { category: { en: "BIBLE", tl: "BIBLIYA" }, question: { en: "What can you personally learn from jesus’ prayers?", tl: "Ano ang isang bagay na ipinagpapasalamat mo tungkol sa pagbabasa mo ng Bibliya?" } },
  83: { category: { en: "CHALLENGES", tl: "MGA HAMON" }, question: { en: "Why is it personally important to you that we avoid allowing disappointment to weaken our faith?", tl: "Ano ang isang bagay na ipinagpapasalamat mo tungkol sa pagpapanatili ng pananampalataya?" } },
  84: { category: { en: "CONGREGATION", tl: "KONGREGASYON" }, question: { en: "How do you personally make the congregation a more encouraging place?", tl: "Ano ang isang bagay na ipinagpapasalamat mo tungkol sa pagtulong mo sa kongregasyon?" } },
  85: { category: { en: "CHALLENGES", tl: "MGA HAMON" }, question: { en: "How do you personally remain faithful during difficult times?", tl: "Ano ang isang bagay na ipinagpapasalamat mo tungkol sa pagpapatawad?" } },
  86: { category: { en: "FAMILY", tl: "PAMILYA" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang isang bagay na ipinagpapasalamat mo tungkol sa pagtutulungan ninyo sa espirituwal na paraan?" } },
  87: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "Why is it personally important to you that we choose our entertainment carefully?", tl: "Ano ang isang bagay na ipinagpapasalamat mo tungkol sa pakikitungo mo sa iba?" } },
  88: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "What personally helps you strengthen your friendship with Jehovah?", tl: "Ano ang isang bagay na ipinagpapasalamat mo tungkol sa pagkakilala mo kay Jehova?" } },
  89: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "Why is humility important in Christian relationships personally meaningful to you?", tl: "Ano ang isang bagay na ipinagpapasalamat mo tungkol sa konsensiya mo?" } },
  90: { category: { en: "MINISTRY", tl: "MINISTERYO" }, question: { en: "How do you personally improve our personal ministry?", tl: "Ano ang isang bagay na ipinagpapasalamat mo tungkol sa pagmamahal mo sa ministeryo?" } },
  91: { category: { en: "FAMILY", tl: "PAMILYA" }, question: { en: "How do you personally show respect to our parents?", tl: "Ano ang gusto mong maalala tungkol sa pamilya mo sa hinaharap?" } },
  92: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "Why is it personally important to you that we rely on jehovah when making decisions?", tl: "Ano ang gusto mong maalala tungkol sa pananampalataya mo sa hinaharap?" } },
  93: { category: { en: "FUTURE & HOPE", tl: "HINAHARAP AT PAG-ASA" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang gusto mong maalala tungkol sa Kaharian ng Diyos sa hinaharap?" } },
  94: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "What does prayer personally mean to you?", tl: "Ano ang gusto mong maalala tungkol sa pag-asa mo sa hinaharap?" } },
  95: { category: { en: "BIBLE", tl: "BIBLIYA" }, question: { en: "Why is it personally important to you that we continue studying the bible?", tl: "Ano ang gusto mong maalala tungkol sa paglalapat ng payo ng Bibliya sa hinaharap?" } },
  96: { category: { en: "CHALLENGES", tl: "MGA HAMON" }, question: { en: "How do you personally deal with anxiety through spiritual activities?", tl: "Ano ang gusto mong maalala tungkol sa pagiging matiyaga sa hinaharap?" } },
  97: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "What is one spiritual goal you personally want to accomplish?", tl: "Ano ang gusto mong maalala tungkol sa mga espirituwal na priyoridad mo sa hinaharap?" } },
  98: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "How do you personally show that our faith is genuine?", tl: "Ano ang gusto mong maalala tungkol sa pagkakilala mo kay Jehova sa hinaharap?" } },
  99: { category: { en: "CHRISTIAN LIFE", tl: "BUHAY BILANG KRISTIYANO" }, question: { en: "Why is love such an important Christian quality personally meaningful to you?", tl: "Ano ang gusto mong maalala tungkol sa konsensiya mo sa hinaharap?" } },
  100: { category: { en: "PERSONAL FAITH", tl: "PERSONAL NA PANANAMPALATAYA" }, question: { en: "How does this personally affect your faith and your life?", tl: "Ano ang gusto mong maalala tungkol sa halimbawa mo sa iba sa hinaharap?" } },
};
const TOTAL_QUESTIONS = 100;

/* ---------- 2. CATEGORY ACCENT MAP ---------- */
/* Subtle per-category accent used only for the popup badge/border.
   The user's selected 5-color theme remains the primary visual system;
   these are blended in lightly, not full theme overrides. */
const CATEGORY_ACCENTS={"PERSONAL FAITH":"#8a6fd6","PRAYER":"#6c8ed4","BIBLE":"#cda352","CHALLENGES":"#a3563f","CONGREGATION":"#4caf82","MINISTRY":"#4a90c9","CHRISTIAN LIFE":"#3fb6b0","FAMILY":"#e0956a","FUTURE & HOPE":"#e0b93f","COUPLES":"#e0788f","YOUNG ONES":"#5fc7a3"};

/* ---------- 3. STATE & LOCALSTORAGE ---------- */
const STORAGE_KEY = "faithTalkRouletteState";

const state = {
  pool: [],          // numbers still available this game
  used: [],          // numbers used, in order selected
  rotation: 0,        // cumulative wheel rotation in degrees
  theme: "royal",
  mode: "dark",
  sound: true,
  language: "tl",
  isSpinning: false
};

function shuffledNumbers() {
  const arr = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      pool: state.pool,
      used: state.used,
      rotation: state.rotation,
      theme: state.theme,
      mode: state.mode,
      sound: state.sound,
      language: state.language
    }));
  } catch (e) {
    /* localStorage may be unavailable (private mode); fail silently */
  }
}

function loadState() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    saved = null;
  }

  const valid = saved &&
    Array.isArray(saved.pool) &&
    Array.isArray(saved.used) &&
    saved.pool.length + saved.used.length === TOTAL_QUESTIONS;

  if (valid) {
    state.pool = saved.pool;
    state.used = saved.used;
    state.rotation = typeof saved.rotation === "number" ? saved.rotation : 0;
    state.theme = saved.theme || "royal";
    state.mode = saved.mode || "dark";
    state.sound = typeof saved.sound === "boolean" ? saved.sound : true;
    state.language = saved.language === "en" ? "en" : "tl";
  } else {
    state.pool = shuffledNumbers();
    state.used = [];
    state.rotation = 0;
  }
}

function startNewGame() {
  state.pool = shuffledNumbers();
  state.used = [];
  state.rotation = 0;
  saveState();
}

const UI={en:{title:"FAITH TALK",subtitle:"100 QUESTIONS · RANDOMIZED · NO REPEATS",spin:"SPIN",remaining:"REMAINING",used:"USED",close:"CLOSE",completed:"ALL 100 QUESTIONS COMPLETED",completedTitle:"YOU HAVE COMPLETED<br>FAITH TALK",resetGame:"RESET GAME",resetQuestion:"Reset the game?",resetBody:"All 100 questions will be shuffled and made available again. This clears your current progress.",cancel:"CANCEL",reset:"RESET",language:"LANGUAGE",fullReset:"FULL RESET",fullResetTitle:"RESET EVERYTHING?",fullResetBody:"This will remove all game progress and restore the default settings.",fullResetOk:"RESET EVERYTHING"},tl:{title:"FAITH TALK",subtitle:"100 TANONG · RANDOM · WALANG ULIT",spin:"PAIKUTIN",remaining:"NATITIRA",used:"GINAMIT",close:"ISARA",completed:"NAUBOS NA ANG 100 TANONG",completedTitle:"NAKUMPLETO MO NA ANG<br>FAITH TALK",resetGame:"I-RESET ANG LARO",resetQuestion:"I-reset ang laro?",resetBody:"Ire-reshuffle ang lahat ng 100 tanong at ibabalik ang mga ito. Buburahin nito ang kasalukuyang progreso.",cancel:"KANSELAHIN",reset:"I-RESET",language:"WIKA",fullReset:"FULL RESET",fullResetTitle:"I-RESET LAHAT?",fullResetBody:"Buburahin nito ang lahat ng progreso at ibabalik sa default ang mga setting.",fullResetOk:"I-RESET LAHAT"}};
function tr(k){return UI[state.language][k];}
function applyLanguage(language){state.language=language==="en"?"en":"tl";document.documentElement.lang=state.language;const u=UI[state.language];document.querySelector(".title").textContent=u.title;document.querySelector(".subtitle").textContent=u.subtitle;document.querySelector(".spin-btn-label").textContent=u.spin;document.querySelector(".history-label").textContent=u.used;document.getElementById("language-label").textContent=u.language;document.getElementById("full-reset-btn").textContent=u.fullReset;document.getElementById("modal-close-btn").textContent=u.close;document.getElementById("reset-btn").textContent=u.resetGame;document.getElementById("confirm-title").textContent=u.resetQuestion;document.getElementById("confirm-body").textContent=u.resetBody;document.getElementById("confirm-cancel").textContent=u.cancel;document.getElementById("confirm-ok").textContent=u.reset;document.querySelector(".complete-eyebrow").textContent=u.completed;document.getElementById("complete-title").innerHTML=u.completedTitle;document.getElementById("full-confirm-title").textContent=u.fullResetTitle;document.getElementById("full-confirm-body").textContent=u.fullResetBody;document.getElementById("full-confirm-cancel").textContent=u.cancel;document.getElementById("full-confirm-ok").textContent=u.fullResetOk;document.getElementById("language-select").value=state.language;updateRemainingUI();saveState();}

/* ---------- 4. THEME / MODE / SOUND TOGGLES ---------- */
const bodyEl = document.body;

function applyTheme(theme) {
  state.theme = theme;
  bodyEl.setAttribute("data-theme", theme);
  document.querySelectorAll(".theme-swatch").forEach(btn => {
    btn.setAttribute("aria-pressed", btn.dataset.themeChoice === theme ? "true" : "false");
  });
  saveState();
}

function applyMode(mode) {
  state.mode = mode;
  bodyEl.setAttribute("data-mode", mode);
  document.getElementById("mode-toggle").setAttribute("aria-pressed", mode === "light" ? "true" : "false");
  saveState();
}

function applySound(on) {
  state.sound = on;
  document.getElementById("sound-toggle").setAttribute("aria-pressed", String(on));
  saveState();
}

function initThemeControls() {
  document.querySelectorAll(".theme-swatch").forEach(btn => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.themeChoice));
  });

  document.getElementById("mode-toggle").addEventListener("click", () => {
    applyMode(state.mode === "dark" ? "light" : "dark");
  });

  document.getElementById("sound-toggle").addEventListener("click", () => { applySound(!state.sound); });
  document.getElementById("language-select").addEventListener("change",e=>applyLanguage(e.target.value));
}

/* ---------- 5. WHEEL CONSTRUCTION ---------- */
const WHEEL_CX = 300;
const WHEEL_CY = 300;
const WHEEL_R = 292;
const LABEL_R = 250;

// Convert an angle measured clockwise from the top (12 o'clock) into an
// {x,y} point on the circle of the given radius, centered at (cx,cy).
function pointOnCircle(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: WHEEL_CX + radius * Math.sin(rad),
    y: WHEEL_CY - radius * Math.cos(rad)
  };
}

// Build all 100 wheel segments + number labels once, computed from geometry
// rather than hand-placed, since manually authoring 100 pieces isn't practical.
function buildWheel() {
  const svg = document.getElementById("wheel-svg");
  const segmentAngle = 360 / TOTAL_QUESTIONS;
  let markup = "";

  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const number = i + 1;
    const startAngle = i * segmentAngle;
    const endAngle = (i + 1) * segmentAngle;
    const centerAngle = startAngle + segmentAngle / 2;

    const p1 = pointOnCircle(startAngle, WHEEL_R);
    const p2 = pointOnCircle(endAngle, WHEEL_R);
    const fillVar = i % 2 === 0 ? "var(--wheel-a)" : "var(--wheel-b)";
    const decadeMark = number % 10 === 0;

    markup += `<path class="seg-arc${decadeMark ? " seg-decade" : ""}" data-number="${number}"
      d="M ${WHEEL_CX} ${WHEEL_CY} L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${WHEEL_R} ${WHEEL_R} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Z"
      style="fill:${fillVar};${decadeMark ? "stroke:var(--accent);stroke-width:1.1;" : ""}" />`;

    // Flip labels in the bottom half so every number reads upright at rest.
    const flip = centerAngle > 90 && centerAngle < 270;
    const labelPoint = pointOnCircle(centerAngle, LABEL_R);
    const fontSize = number >= 100 ? 10 : 11.5;

    markup += `<g transform="rotate(${centerAngle} ${WHEEL_CX} ${WHEEL_CY})">
      <text data-number="${number}" class="seg-label" x="${WHEEL_CX}" y="${WHEEL_CY - LABEL_R}"
        font-size="${fontSize}"
        ${flip ? `transform="rotate(180 ${WHEEL_CX} ${WHEEL_CY - LABEL_R})"` : ""}>${number}</text>
    </g>`;
  }

  svg.innerHTML = markup;
}

// Grey out numbers that have already been used, so the wheel visually
// reflects the shrinking pool (selection itself is still handled in JS).
function refreshWheelUsedState() {
  const usedSet = new Set(state.used);
  document.querySelectorAll('.seg-label').forEach(label => {
    const n = Number(label.dataset.number);
    label.style.opacity = usedSet.has(n) ? "0.28" : "1";
  });
  document.querySelectorAll('.seg-arc').forEach(seg => {
    const n = Number(seg.dataset.number);
    seg.style.opacity = usedSet.has(n) ? "0.5" : "1";
  });
}

function setWheelRotation(deg, animated) {
  const svg = document.getElementById("wheel-svg");
  svg.classList.toggle("spinning-el", animated);
  svg.style.transform = `rotate(${deg}deg)`;
}

/* ---------- 6. SPIN LOGIC ---------- */
const SPIN_DURATION_MS = 4600;
const segmentAngleFor = () => 360 / TOTAL_QUESTIONS;

function pickRandomFromPool() {
  const idx = Math.floor(Math.random() * state.pool.length);
  const number = state.pool[idx];
  state.pool.splice(idx, 1);
  return number;
}

function rotationToLand(number) {
  const segAngle = segmentAngleFor();
  const centerAngle = (number - 1) * segAngle + segAngle / 2; // clockwise from top
  // We want (centerAngle + finalRotation) mod 360 === 0 so the segment sits at the pointer.
  const targetMod = ((360 - centerAngle) % 360 + 360) % 360;
  const currentMod = ((state.rotation % 360) + 360) % 360;
  let delta = targetMod - currentMod;
  delta = ((delta % 360) + 360) % 360;

  const extraFullTurns = 7 + Math.floor(Math.random() * 3); // 7–9 full spins
  return state.rotation + extraFullTurns * 360 + delta;
}

function spin() {
  if (state.isSpinning || state.pool.length === 0) return;

  state.isSpinning = true;
  const spinBtn = document.getElementById("spin-btn");
  spinBtn.disabled = true;
  spinBtn.classList.add("is-spinning");

  const selected = pickRandomFromPool();
  const newRotation = rotationToLand(selected);
  state.rotation = newRotation;

  document.getElementById("wheel-hub-number").textContent = "";
  setWheelRotation(newRotation, true);
  startTickSound(SPIN_DURATION_MS);

  window.setTimeout(() => {
    finishSpin(selected);
  }, SPIN_DURATION_MS + 60);
}

function finishSpin(number) {
  state.isSpinning = false;
  state.used.push(number);
  saveState();

  const hub = document.getElementById("wheel-hub");
  const hubNumber = document.getElementById("wheel-hub-number");
  hubNumber.textContent = number;
  hub.classList.remove("pulse");
  void hub.offsetWidth; // restart animation
  hub.classList.add("pulse");

  refreshWheelUsedState();
  updateRemainingUI();
  updateHistoryUI();
  playResultSound();
  openQuestionModal(number);
}

/* ---------- 7. SOUND ENGINE (Web Audio API, no external files) ---------- */
let audioCtx = null;
let tickTimerActive = false;

function getAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTick() {
  if (!state.sound) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = 720;
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.06);
}

function playResultSound() {
  if (!state.sound) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const notes = [523.25, 659.25]; // soft two-note chime (C5, E5)
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const startTime = ctx.currentTime + i * 0.11;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.09, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.55);
  });
}

// Ticks slow down over the spin duration to mimic a decelerating wheel.
function startTickSound(durationMs) {
  if (!state.sound) return;
  getAudioCtx();
  tickTimerActive = true;
  const totalTicks = 42;
  let i = 0;

  function next() {
    if (!tickTimerActive || i >= totalTicks) {
      tickTimerActive = false;
      return;
    }
    const t = i / totalTicks;
    const delay = 35 + Math.pow(t, 2.2) * 190; // accelerating delay = decelerating wheel
    window.setTimeout(() => {
      if (!tickTimerActive) return;
      playTick();
      i++;
      next();
    }, delay);
  }
  next();
  window.setTimeout(() => { tickTimerActive = false; }, durationMs);
}

/* ---------- 8. MODAL LOGIC ---------- */
const modalBackdrop = document.getElementById("modal-backdrop");
const modalCard = document.getElementById("modal-card");
const completeBackdrop = document.getElementById("complete-backdrop");
const confirmBackdrop = document.getElementById("confirm-backdrop");

function openQuestionModal(number){const data=QUESTIONS[number];const accent=CATEGORY_ACCENTS[data.category.en]||"var(--accent)";document.getElementById("modal-category").textContent=data.category[state.language];document.getElementById("modal-question-number").textContent=`${state.language==="tl"?"TANONG":"QUESTION"} ${number}`;document.getElementById("modal-question-text").textContent=data.question[state.language];modalCard.style.setProperty("--cat-accent",accent);modalBackdrop.hidden=false;window.requestAnimationFrame(()=>modalCard.focus());document.addEventListener("keydown",handleEscapeKey);}

function closeQuestionModal() {
  modalBackdrop.hidden = true;
  document.removeEventListener("keydown", handleEscapeKey);

  if (state.pool.length === 0) {
    window.setTimeout(openCompletionModal, 200);
  } else {
    document.getElementById("spin-btn").disabled = false;
    document.getElementById("spin-btn").classList.remove("is-spinning");
  }
}

function handleEscapeKey(e) {
  if (e.key === "Escape") closeQuestionModal();
}

function openCompletionModal() {
  completeBackdrop.hidden = false;
}

function openConfirmModal() {
  confirmBackdrop.hidden = false;
}

function closeConfirmModal() {
  confirmBackdrop.hidden = true;
}

function performReset() {
  startNewGame();
  refreshWheelUsedState();
  updateRemainingUI();
  updateHistoryUI();
  document.getElementById("wheel-hub-number").textContent = "?";
  setWheelRotation(0, false);
  closeConfirmModal();
  completeBackdrop.hidden = true;
  const spinBtn = document.getElementById("spin-btn");
  spinBtn.disabled = false;
  spinBtn.classList.remove("is-spinning");
}


const fullConfirmBackdrop=document.getElementById("full-confirm-backdrop");function openFullResetModal(){fullConfirmBackdrop.hidden=false;}function closeFullResetModal(){fullConfirmBackdrop.hidden=true;}function performFullReset(){try{localStorage.removeItem(STORAGE_KEY);}catch(e){}state.pool=shuffledNumbers();state.used=[];state.rotation=0;state.theme="royal";state.mode="dark";state.sound=true;state.language="tl";applyTheme("royal");applyMode("dark");applySound(true);applyLanguage("tl");refreshWheelUsedState();updateRemainingUI();updateHistoryUI();document.getElementById("wheel-hub-number").textContent="?";setWheelRotation(0,false);closeFullResetModal();closeConfirmModal();completeBackdrop.hidden=true;const b=document.getElementById("spin-btn");b.disabled=false;b.classList.remove("is-spinning");}

function initModalControls() {
  document.getElementById("modal-close").addEventListener("click", closeQuestionModal);
  document.getElementById("modal-close-btn").addEventListener("click", closeQuestionModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeQuestionModal();
  });

  document.getElementById("reset-btn").addEventListener("click", openConfirmModal);
  document.getElementById("confirm-cancel").addEventListener("click", closeConfirmModal);
  document.getElementById("confirm-ok").addEventListener("click", performReset);
  document.getElementById("full-reset-btn").addEventListener("click",openFullResetModal);document.getElementById("full-confirm-cancel").addEventListener("click",closeFullResetModal);document.getElementById("full-confirm-ok").addEventListener("click",performFullReset);fullConfirmBackdrop.addEventListener("click",e=>{if(e.target===fullConfirmBackdrop)closeFullResetModal();});
  confirmBackdrop.addEventListener("click", (e) => {
    if (e.target === confirmBackdrop) closeConfirmModal();
  });
}

/* ---------- 9. HISTORY / REMAINING COUNTER ---------- */
function updateRemainingUI() {
  const remaining = state.pool.length;
  document.getElementById("remaining-text").innerHTML =
    `${tr("remaining")}: <strong>${remaining} / ${TOTAL_QUESTIONS}</strong>`;
}

function updateHistoryUI() {
  const wrap = document.getElementById("history-wrap");
  const list = document.getElementById("history-list");

  if (state.used.length === 0) {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;

  // Most recent first, numbers only — never questions.
  const chips = [...state.used].reverse().map(n => `<span class="history-chip">${n}</span>`).join("");
  list.innerHTML = chips;
}

/* ---------- 10. INIT ---------- */
function init() {
  loadState();

  applyTheme(state.theme);
  applyMode(state.mode);
  applySound(state.sound);
  applyLanguage(state.language);

  buildWheel();
  refreshWheelUsedState();
  setWheelRotation(state.rotation, false);

  const hubNumber = document.getElementById("wheel-hub-number");
  hubNumber.textContent = state.used.length ? state.used[state.used.length - 1] : "?";

  updateRemainingUI();
  updateHistoryUI();

  initThemeControls();
  initModalControls();

  document.getElementById("spin-btn").addEventListener("click", spin);

  // If a restored game was already complete, show the completion state.
  if (state.pool.length === 0 && state.used.length === TOTAL_QUESTIONS) {
    window.setTimeout(openCompletionModal, 400);
  }
}

document.addEventListener("DOMContentLoaded", init);
