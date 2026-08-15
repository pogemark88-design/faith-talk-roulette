/* =========================================================================
   FAITH TALK ROULETTE — GAME LOGIC (Faith Talk Personal, Tagalog + English)
   Organized in sections:
     1. Question data (numbers 1–100 -> { cat, question: {en, tl} })
     2. Category labels + accent map
     3. UI strings (bilingual static text)
     4. State & localStorage persistence
     5. Theme / light-dark / sound / language toggles
     6. Wheel construction (SVG, built for 100 segments)
     7. Spin logic (selection, rotation math, animation)
     8. Sound engine (Web Audio API, no external files)
     9. Modal logic (question popup, completion, reset confirm)
     10. History / remaining-counter UI
     11. Init
   ========================================================================= */

/* ---------- 1. QUESTION DATA ---------- */
/* Every number 1–100 maps to exactly one category id + a bilingual question.
   This is the single source of truth for wheel + popup content. */
const QUESTIONS = {
  1: { cat: "PERSONAL_FAITH", question: { en: "What is something about Jehovah that you personally appreciate the most?", tl: "Ano ang isang bagay tungkol kay Jehova na talagang pinahahalagahan mo?" } },
  2: { cat: "PERSONAL_FAITH", question: { en: "When do you personally feel closest to Jehovah?", tl: "Kailan mo personal na pinakanararamdaman na malapít ka kay Jehova?" } },
  3: { cat: "PERSONAL_FAITH", question: { en: "What has strengthened your faith the most in your life?", tl: "Ano ang nakapagpatibay ng pananampalataya mo sa buhay?" } },
  4: { cat: "PERSONAL_FAITH", question: { en: "What quality of Jehovah would you like to develop more in yourself?", tl: "Anong katangian ni Jehova ang gusto mong higit pang malinang sa sarili mo?" } },
  5: { cat: "PERSONAL_FAITH", question: { en: "What is something about Jehovah that you would like to understand better?", tl: "Ano ang isang bagay tungkol kay Jehova na gusto mong mas maunawaan?" } },
  6: { cat: "PERSONAL_FAITH", question: { en: "How do you personally show Jehovah that your relationship with him is important to you?", tl: "Paano mo personal na pinapakita kay Jehova na mahalaga sa iyo ang relasyon ninyo?" } },
  7: { cat: "PERSONAL_FAITH", question: { en: "What experience has helped strengthen your faith?", tl: "Anong karanasan ang nakatulong para maging mas matibay ang pananampalataya mo?" } },
  8: { cat: "PERSONAL_FAITH", question: { en: "What helps you when you feel that your faith is becoming weaker?", tl: "Ano ang nakakatulong sa iyo kapag nararamdaman mong nanghihina ang pananampalataya mo?" } },
  9: { cat: "PERSONAL_FAITH", question: { en: "What is something you have learned about Jehovah that you will never forget?", tl: "Ano ang isang bagay na natutuhan mo tungkol kay Jehova na hindi mo makakalimutan?" } },
  10: { cat: "PERSONAL_FAITH", question: { en: "If you had to describe your relationship with Jehovah in one word, what would it be and why?", tl: "Kung ilalarawan mo ang relasyon mo kay Jehova sa isang salita, ano iyon at bakit?" } },
  11: { cat: "PRAYER", question: { en: "What do you personally enjoy most about prayer?", tl: "Ano ang pinakagusto mo sa pananalangin?" } },
  12: { cat: "PRAYER", question: { en: "When do you usually feel the strongest need to pray?", tl: "Kailan mo karaniwang pinakamalakas na nararamdaman ang pangangailangang manalangin?" } },
  13: { cat: "PRAYER", question: { en: "How has prayer personally helped you during a difficult time?", tl: "Paano ka personal na natulungan ng panalangin sa panahon ng mahirap na sitwasyon?" } },
  14: { cat: "PRAYER", question: { en: "What is something you often thank Jehovah for?", tl: "Ano ang isang bagay na madalas mong ipinagpapasalamat kay Jehova?" } },
  15: { cat: "PRAYER", question: { en: "What helps you maintain a regular prayer routine?", tl: "Ano ang nakakatulong sa iyo para mapanatili ang regular na routine sa pananalangin?" } },
  16: { cat: "PRAYER", question: { en: "Have you ever felt closer to Jehovah because of something you prayed about?", tl: "Naranasan mo na bang mas mapalapit kay Jehova dahil sa isang bagay na ipinanalangin mo?" } },
  17: { cat: "PRAYER", question: { en: "What is the most difficult part of maintaining a good prayer routine for you?", tl: "Ano ang pinakamahirap na bahagi ng pagpapanatili ng magandang routine sa pananalangin para sa iyo?" } },
  18: { cat: "PRAYER", question: { en: "How does your prayer change when you are going through a difficult situation?", tl: "Paano nagbabago ang panalangin mo kapag dumaranas ka ng mahirap na sitwasyon?" } },
  19: { cat: "PRAYER", question: { en: "What would you like to improve about your personal prayers?", tl: "Ano ang gusto mong pagbutihin sa personal mong mga panalangin?" } },
  20: { cat: "PRAYER", question: { en: "What is something you wish you talked to Jehovah about more often?", tl: "Ano ang isang bagay na sana ay mas madalas mong napag-uusapan kay Jehova?" } },
  21: { cat: "BIBLE", question: { en: "What part of the Bible has personally had the biggest impact on you?", tl: "Anong bahagi ng Bibliya ang personal na may pinakamalaking epekto sa iyo?" } },
  22: { cat: "BIBLE", question: { en: "Is there a Bible verse you often remember when you are facing a problem?", tl: "May teksto ba sa Bibliya na madalas mong naaalala kapag may problema ka?" } },
  23: { cat: "BIBLE", question: { en: "What do you enjoy most about personal Bible study?", tl: "Ano ang pinakagusto mo sa personal na pag-aaral ng Bibliya?" } },
  24: { cat: "BIBLE", question: { en: "What helps you stay consistent with Bible reading?", tl: "Ano ang nakakatulong sa iyo para maging consistent sa pagbabasa ng Bibliya?" } },
  25: { cat: "BIBLE", question: { en: "How has something you recently learned from the Bible affected you personally?", tl: "Paano ka personal na naapektuhan ng isang bagay na kamakailan mong natutuhan mula sa Bibliya?" } },
  26: { cat: "BIBLE", question: { en: "Which Bible character has a quality you would like to imitate?", tl: "Sinong Bible character ang may katangiang gusto mong tularan?" } },
  27: { cat: "BIBLE", question: { en: "Which Bible account has stayed in your mind the most, and why?", tl: "Anong Bible account ang pinakananatili sa isip mo, at bakit?" } },
  28: { cat: "BIBLE", question: { en: "What is something in the Bible you would like to study more deeply?", tl: "Ano ang isang bagay sa Bibliya na gusto mong pag-aralan nang mas malalim?" } },
  29: { cat: "BIBLE", question: { en: "How does the Bible help you when you have to make an important decision?", tl: "Paano ka tinutulungan ng Bibliya kapag kailangan mong gumawa ng mahalagang desisyon?" } },
  30: { cat: "BIBLE", question: { en: "What is something you learned from the Bible that changed the way you see life?", tl: "Ano ang isang bagay na natutuhan mo sa Bibliya na nagbago sa pananaw mo sa buhay?" } },
  31: { cat: "GRATITUDE", question: { en: "What is one thing you are especially thankful to Jehovah for right now?", tl: "Ano ang isang bagay na lubos mong ipinagpapasalamat kay Jehova ngayon?" } },
  32: { cat: "GRATITUDE", question: { en: "Who is someone in your life that you are especially thankful for, and why?", tl: "Sino ang isang tao sa buhay mo na lubos mong ipinagpapasalamat, at bakit?" } },
  33: { cat: "GRATITUDE", question: { en: "What is a simple thing you sometimes take for granted but truly appreciate?", tl: "Ano ang isang simpleng bagay na minsan ay binabalewala mo pero tunay mong pinahahalagahan?" } },
  34: { cat: "GRATITUDE", question: { en: "What is a blessing you have received that you will never forget?", tl: "Ano ang isang pagpapalang natanggap mo na hindi mo makakalimutan?" } },
  35: { cat: "GRATITUDE", question: { en: "When was the last time you felt especially grateful to Jehovah?", tl: "Kailan ka huling nakaramdam ng matinding pasasalamat kay Jehova?" } },
  36: { cat: "GRATITUDE", question: { en: "What is something about your congregation that you are thankful for?", tl: "Ano ang isang bagay tungkol sa inyong kongregasyon na ipinagpapasalamat mo?" } },
  37: { cat: "GRATITUDE", question: { en: "What spiritual blessing means the most to you?", tl: "Anong espirituwal na pagpapala ang pinakamahalaga sa iyo?" } },
  38: { cat: "GRATITUDE", question: { en: "What is something you did not appreciate much before but value more now?", tl: "Ano ang isang bagay na dati ay hindi mo gaanong pinahahalagahan pero mas pinahahalagahan mo ngayon?" } },
  39: { cat: "GRATITUDE", question: { en: "How does gratitude help you stay positive spiritually?", tl: "Paano nakakatulong ang pagiging mapagpasalamat para manatili kang positibo sa espirituwal?" } },
  40: { cat: "GRATITUDE", question: { en: "What is something you would like to learn to appreciate more?", tl: "Ano ang isang bagay na gusto mong matutuhang mas pahalagahan?" } },
  41: { cat: "CHALLENGES", question: { en: "What usually discourages you the most?", tl: "Ano ang karaniwang pinakanakapagpapahina ng loob mo?" } },
  42: { cat: "CHALLENGES", question: { en: "What do you do when you feel distant from Jehovah?", tl: "Ano ang ginagawa mo kapag nararamdaman mong malayo ka kay Jehova?" } },
  43: { cat: "CHALLENGES", question: { en: "What helps you when you are under stress or pressure?", tl: "Ano ang nakakatulong sa iyo kapag nasa ilalim ka ng stress o pressure?" } },
  44: { cat: "CHALLENGES", question: { en: "What difficult experience taught you an important lesson?", tl: "Anong mahirap na karanasan ang nagturo sa iyo ng mahalagang aral?" } },
  45: { cat: "CHALLENGES", question: { en: "How do you maintain your spiritual routine when you are extremely busy?", tl: "Paano mo napapanatili ang espirituwal mong routine kapag sobrang dami mong ginagawa?" } },
  46: { cat: "CHALLENGES", question: { en: "What is one weakness you are personally trying to overcome?", tl: "Ano ang isang kahinaan na personal mong sinisikap na mapagtagumpayan?" } },
  47: { cat: "CHALLENGES", question: { en: "What do you do when you lose motivation?", tl: "Ano ang ginagawa mo kapag nawawalan ka ng motivation?" } },
  48: { cat: "CHALLENGES", question: { en: "What helps you keep going when things become difficult?", tl: "Ano ang nakakatulong sa iyo para magpatuloy kapag nagiging mahirap ang mga bagay?" } },
  49: { cat: "CHALLENGES", question: { en: "What difficult experience eventually helped you grow spiritually?", tl: "Anong mahirap na karanasan ang kalaunan ay nakatulong sa espirituwal mong paglago?" } },
  50: { cat: "CHALLENGES", question: { en: "What have you learned about yourself from going through a difficult situation?", tl: "Ano ang natutuhan mo tungkol sa sarili mo mula sa isang mahirap na sitwasyon?" } },
  51: { cat: "FAMILY", question: { en: "How has your family influenced your faith?", tl: "Paano nakaimpluwensiya ang pamilya mo sa pananampalataya mo?" } },
  52: { cat: "FAMILY", question: { en: "What is something about faith that you learned from your family?", tl: "Ano ang isang bagay tungkol sa pananampalataya na natutuhan mo mula sa pamilya mo?" } },
  53: { cat: "FAMILY", question: { en: "What would you like to improve about your family's spiritual routine?", tl: "Ano ang gusto mong pagbutihin sa espirituwal na routine ng pamilya ninyo?" } },
  54: { cat: "FAMILY", question: { en: "How do you show your family that spiritual things are important to you?", tl: "Paano mo ipinapakita sa pamilya mo na mahalaga sa iyo ang espirituwal na mga bagay?" } },
  55: { cat: "FAMILY", question: { en: "What is one family memory that has special meaning to you?", tl: "Ano ang isang family memory na may espesyal na kahulugan sa iyo?" } },
  56: { cat: "FAMILY", question: { en: "Who in your family has been a good spiritual example to you, and why?", tl: "Sino sa pamilya mo ang naging magandang espirituwal na halimbawa sa iyo, at bakit?" } },
  57: { cat: "FAMILY", question: { en: "What is something you would like your family to do together more often?", tl: "Ano ang isang bagay na gusto mong mas madalas gawin ng pamilya ninyo nang sama-sama?" } },
  58: { cat: "FAMILY", question: { en: "How would you like to be a positive spiritual influence on your family?", tl: "Paano mo ka magiging maganda impluwensiya sa espirituwal sa pamilya mo?" } },
  59: { cat: "FAMILY", question: { en: "What has your family taught you about love?", tl: "Ano ang itinuro sa iyo ng pamilya mo tungkol sa pag-ibig?" } },
  60: { cat: "FAMILY", question: { en: "What is one thing about your family that you are especially thankful for?", tl: "Ano ang isang bagay tungkol sa pamilya mo na lubos mong ipinagpapasalamat?" } },
  61: { cat: "FRIENDSHIPS", question: { en: "What do you look for in a good friend?", tl: "Ano ang hinahanap mo sa isang mabuting kaibigan?" } },
  62: { cat: "FRIENDSHIPS", question: { en: "How has a friendship influenced your faith?", tl: "Paano nakaimpluwensiya ang isang pagkakaibigan sa pananampalataya mo?" } },
  63: { cat: "FRIENDSHIPS", question: { en: "Who is one friend who has strengthened you spiritually, and how?", tl: "Sino ang isang kaibigan na nagpatibay sa iyo sa espirituwal, at paano?" } },
  64: { cat: "FRIENDSHIPS", question: { en: "What do you personally do to be a good spiritual friend?", tl: "Ano ang personal mong ginagawa para maging mabuting espirituwal na kaibigan?" } },
  65: { cat: "FRIENDSHIPS", question: { en: "Has a friend ever helped you when you were feeling discouraged? What did they do?", tl: "May kaibigan na ba na tumulong sa iyo noong pinanghihinaan ka ng loob? Ano ang ginawa niya?" } },
  66: { cat: "FRIENDSHIPS", question: { en: "What quality in a good friend would you like to develop more in yourself?", tl: "Anong katangian ng isang mabuting kaibigan ang gusto mong higit pang malinang sa sarili mo?" } },
  67: { cat: "FRIENDSHIPS", question: { en: "How can you tell whether a friendship is having a positive influence on you?", tl: "Paano mo malalaman kung maganda ang impluwensiya ng isang pagkakaibigan sa iyo?" } },
  68: { cat: "FRIENDSHIPS", question: { en: "What is one important lesson you have learned from a friendship?", tl: "Ano ang isang mahalagang aral na natutuhan mo mula sa isang pagkakaibigan?" } },
  69: { cat: "FRIENDSHIPS", question: { en: "How can you personally strengthen a friend's spirituality?", tl: "Paano mo personal na mapapatibay ang espirituwalidad ng isang kaibigan?" } },
  70: { cat: "FRIENDSHIPS", question: { en: "What is something you especially appreciate about your friends?", tl: "Ano ang isang bagay na lubos mong pinahahalagahan sa mga kaibigan mo?" } },
  71: { cat: "CONGREGATION", question: { en: "What do you personally enjoy most about being part of the congregation?", tl: "Ano ang pinakagusto mo sa pagiging bahagi ng kongregasyon?" } },
  72: { cat: "CONGREGATION", question: { en: "Who is one brother or sister who has been a good example to you?", tl: "Sino ang isang kapatid na naging magandang halimbawa sa iyo?" } },
  73: { cat: "CONGREGATION", question: { en: "When have you felt most connected to your congregation?", tl: "Kailan mo pinakanaramdaman na malapít ka sa inyong kongregasyon?" } },
  74: { cat: "CONGREGATION", question: { en: "What do other brothers and sisters do that really encourages you?", tl: "Ano ang ginagawa ng ibang mga kapatid na talagang nakakapagpatibay sa iyo?" } },
  75: { cat: "CONGREGATION", question: { en: "How do you personally show love for your brothers and sisters?", tl: "Paano mo personal na ipinapakita ang pagmamahal sa mga kapatid?" } },
  76: { cat: "CONGREGATION", question: { en: "What is one thing you would like to do more often to help the congregation?", tl: "Ano ang isang bagay na gusto mong mas madalas gawin para makatulong sa kongregasyon?" } },
  77: { cat: "CONGREGATION", question: { en: "What is one congregation experience you will never forget?", tl: "Ano ang isang karanasan sa kongregasyon na hindi mo makakalimutan?" } },
  78: { cat: "CONGREGATION", question: { en: "What is something valuable you have learned from another brother or sister?", tl: "Ano ang isang mahalagang bagay na natutuhan mo mula sa ibang kapatid?" } },
  79: { cat: "CONGREGATION", question: { en: "How do you personally encourage someone who is feeling discouraged?", tl: "Paano mo personal na pinapatibay ang isang taong pinanghihinaan ng loob?" } },
  80: { cat: "CONGREGATION", question: { en: "What kind of effect would you like your presence to have on the congregation?", tl: "Anong uri ng epekto ang gusto mong magkaroon ang presensiya mo sa kongregasyon?" } },
  81: { cat: "MINISTRY", question: { en: "What do you personally enjoy most about the ministry?", tl: "Ano ang pinakagusto mo sa ministeryo?" } },
  82: { cat: "MINISTRY", question: { en: "What is one ministry experience you will never forget?", tl: "Ano ang isang karanasan sa ministeryo na hindi mo makakalimutan?" } },
  83: { cat: "MINISTRY", question: { en: "What helps you have courage when you participate in the ministry?", tl: "Ano ang nakakatulong sa iyo para magkaroon ng lakas ng loob kapag nakikibahagi ka sa ministeryo?" } },
  84: { cat: "MINISTRY", question: { en: "What is one thing you would like to improve in your ministry?", tl: "Ano ang isang bagay na gusto mong pagbutihin sa ministeryo mo?" } },
  85: { cat: "MINISTRY", question: { en: "How has talking to others about the Bible strengthened your own faith?", tl: "Paano nakapagpatibay sa sarili mong pananampalataya ang pakikipag-usap sa iba tungkol sa Bibliya?" } },
  86: { cat: "MINISTRY", question: { en: "What have you learned about people through your experiences in the ministry?", tl: "Ano ang natutuhan mo tungkol sa mga tao mula sa mga karanasan mo sa ministeryo?" } },
  87: { cat: "MINISTRY", question: { en: "What helps you when you feel nervous before going in the ministry?", tl: "Ano ang nakakatulong sa iyo kapag kinakabahan ka bago magministeryo?" } },
  88: { cat: "MINISTRY", question: { en: "Has an experience in the ministry ever strengthened your faith? How?", tl: "May karanasan ba sa ministeryo na nakapagpatibay sa pananampalataya mo? Paano?" } },
  89: { cat: "MINISTRY", question: { en: "What is one personal goal you have for your ministry?", tl: "Ano ang isang personal na goal mo sa ministeryo?" } },
  90: { cat: "MINISTRY", question: { en: "What would make the ministry more enjoyable for you?", tl: "Ano ang makakapagpasaya o makakapag-enjoy sa iyo nang higit sa ministeryo?" } },
  91: { cat: "SPIRITUAL_GROWTH", question: { en: "What is one spiritual goal you personally want to achieve?", tl: "Ano ang isang espirituwal na goal na personal mong gustong maabot?" } },
  92: { cat: "SPIRITUAL_GROWTH", question: { en: "What is one thing you want to change or improve about yourself as a Christian?", tl: "Ano ang isang bagay na gusto mong baguhin o pagbutihin sa sarili mo bilang Kristiyano?" } },
  93: { cat: "SPIRITUAL_GROWTH", question: { en: "What spiritual habit would you like to become more consistent with?", tl: "Anong espirituwal na habit ang gusto mong maging mas consistent?" } },
  94: { cat: "SPIRITUAL_GROWTH", question: { en: "What Christian quality would you like to develop more?", tl: "Anong katangiang Kristiyano ang gusto mong higit pang malinang?" } },
  95: { cat: "SPIRITUAL_GROWTH", question: { en: "Where would you like your spirituality to be one year from now?", tl: "Saan mo gustong makita ang espirituwalidad mo isang taon mula ngayon?" } },
  96: { cat: "SPIRITUAL_GROWTH", question: { en: "What is one thing you would like to become better at in your service to Jehovah?", tl: "Ano ang isang bagay na gusto mong maging mas mahusay sa paggawa bilang paglilingkod kay Jehova?" } },
  97: { cat: "SPIRITUAL_GROWTH", question: { en: "What would you like people to remember about you as a Christian?", tl: "Ano ang gusto mong maalala ng mga tao tungkol sa iyo bilang isang Kristiyano?" } },
  98: { cat: "SPIRITUAL_GROWTH", question: { en: "What is one thing you would like to do more often to make Jehovah happy?", tl: "Ano ang isang bagay na gusto mong mas madalas gawin para mapasaya si Jehova?" } },
  99: { cat: "SPIRITUAL_GROWTH", question: { en: "What is the most important spiritual goal you have right now?", tl: "Ano ang pinakamahalagang espirituwal na goal mo ngayon?" } },
  100: { cat: "SPIRITUAL_GROWTH", question: { en: "If you could give your future self one piece of advice about faith, what would you say?", tl: "Kung mabibigyan mo ng isang payo tungkol sa pananampalataya ang future version ng sarili mo, ano ang sasabihin mo?" } },
};
const TOTAL_QUESTIONS = 100;

/* ---------- 2. CATEGORY LABELS + ACCENT MAP ---------- */
const CATEGORIES = {
  PERSONAL_FAITH:    { en: "PERSONAL FAITH",   tl: "PERSONAL NA PANANAMPALATAYA" },
  PRAYER:            { en: "PRAYER",           tl: "PANALANGIN" },
  BIBLE:             { en: "BIBLE",            tl: "BIBLIYA" },
  GRATITUDE:         { en: "GRATITUDE",        tl: "PASASALAMAT" },
  CHALLENGES:        { en: "CHALLENGES",       tl: "PAGSUBOK" },
  FAMILY:            { en: "FAMILY",           tl: "PAMILYA" },
  FRIENDSHIPS:       { en: "FRIENDSHIPS",      tl: "PAGKAKAIBIGAN" },
  CONGREGATION:      { en: "CONGREGATION",     tl: "KONGREGASYON" },
  MINISTRY:          { en: "MINISTRY",         tl: "MINISTERYO" },
  SPIRITUAL_GROWTH:  { en: "SPIRITUAL GROWTH", tl: "ESPIRITUWAL NA PAGLAGO" }
};

/* Subtle per-category accent used only for the popup badge/border.
   The user's selected 5-color theme remains the primary visual system;
   these are blended in lightly, not full theme overrides. */
const CATEGORY_ACCENTS = {
  PERSONAL_FAITH:   "#8a6fd6",
  PRAYER:           "#6fa8dc",
  BIBLE:            "#cda352",
  GRATITUDE:        "#e0a63f",
  CHALLENGES:       "#a3563f",
  FAMILY:           "#e0956a",
  FRIENDSHIPS:      "#e0788f",
  CONGREGATION:     "#4caf82",
  MINISTRY:         "#4a90c9",
  SPIRITUAL_GROWTH: "#5fc7a3"
};

/* ---------- 3. UI STRINGS (bilingual static text) ---------- */
const UI_STRINGS = {
  en: {
    subtitle: "100 QUESTIONS \u00B7 RANDOMIZED \u00B7 NO REPEATS",
    spin: "SPIN",
    remaining: "REMAINING",
    used: "USED",
    questionNumber: (n) => `QUESTION #${n}`,
    close: "CLOSE",
    completeEyebrow: "ALL 100 QUESTIONS COMPLETED",
    completeTitle: "YOU HAVE COMPLETED<br>FAITH TALK",
    resetGame: "RESET GAME",
    confirmTitle: "Reset the game?",
    confirmBody: "All 100 questions will be shuffled and made available again. This clears your current progress.",
    cancel: "CANCEL",
    reset: "RESET",
    footer: "Spin, reflect, and talk it through together.",
    modeToggle: "Toggle light and dark mode",
    soundToggle: "Toggle sound",
    resetIcon: "Restart game",
    closeQuestion: "Close question"
  },
  tl: {
    subtitle: "100 TANONG \u00B7 RANDOM \u00B7 WALANG ULIT",
    spin: "IKUTIN",
    remaining: "NATITIRA",
    used: "NAGAMIT NA",
    questionNumber: (n) => `TANONG #${n}`,
    close: "ISARA",
    completeEyebrow: "NATAPOS NA ANG 100 TANONG",
    completeTitle: "NATAPOS MO NA ANG<br>FAITH TALK",
    resetGame: "I-RESET ANG LARO",
    confirmTitle: "I-reset ang laro?",
    confirmBody: "Ire-reshuffle ang lahat ng 100 tanong at magiging available ulit ang mga ito. Mabubura ang kasalukuyang progress mo.",
    cancel: "KANSELAHIN",
    reset: "I-RESET",
    footer: "Umikot, magnilay, at pag-usapan ito nang sama-sama.",
    modeToggle: "Palitan ang light at dark mode",
    soundToggle: "Palitan ang tunog",
    resetIcon: "I-restart ang laro",
    closeQuestion: "Isara ang tanong"
  }
};

/* ---------- 4. STATE & LOCALSTORAGE ---------- */
const STORAGE_KEY = "faithTalkRouletteState";
const DEFAULT_THEME = "royal";
const DEFAULT_MODE = "dark";
const DEFAULT_LANG = "tl";

const state = {
  pool: [],          // numbers still available this game
  used: [],          // numbers used, in order selected
  rotation: 0,        // cumulative wheel rotation in degrees
  theme: DEFAULT_THEME,
  mode: DEFAULT_MODE,
  sound: true,
  lang: DEFAULT_LANG,
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
      lang: state.lang
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
    state.theme = saved.theme || DEFAULT_THEME;
    state.mode = saved.mode || DEFAULT_MODE;
    state.sound = typeof saved.sound === "boolean" ? saved.sound : true;
    state.lang = saved.lang === "en" ? "en" : DEFAULT_LANG;
  } else {
    state.pool = shuffledNumbers();
    state.used = [];
    state.rotation = 0;
    state.lang = DEFAULT_LANG;
  }
}

function startNewGame() {
  state.pool = shuffledNumbers();
  state.used = [];
  state.rotation = 0;
  saveState();
}

/* ---------- 5. THEME / MODE / SOUND / LANGUAGE TOGGLES ---------- */
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

// Switching language only changes displayed text — it never touches
// pool/used/rotation/theme/mode/sound, and it doesn't reset progress.
function applyLanguage(lang) {
  state.lang = lang === "en" ? "en" : "tl";
  bodyEl.setAttribute("data-lang", state.lang);
  document.documentElement.setAttribute("lang", state.lang);

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.setAttribute("aria-pressed", btn.dataset.langChoice === state.lang ? "true" : "false");
  });

  renderStaticUI();
  updateRemainingUI();
  updateHistoryUI();

  // If the question modal is currently open, re-render it in the new language.
  if (!modalBackdrop.hidden && currentModalNumber !== null) {
    renderQuestionModal(currentModalNumber);
  }

  saveState();
}

function t() {
  return UI_STRINGS[state.lang];
}

// Sets every piece of static chrome text (buttons, labels, modal copy)
// from UI_STRINGS for the currently selected language.
function renderStaticUI() {
  const strings = t();

  document.getElementById("subtitle-text").textContent = strings.subtitle;
  document.getElementById("spin-label").textContent = strings.spin;
  document.getElementById("history-label-text").textContent = strings.used;
  document.getElementById("modal-close-btn").textContent = strings.close;
  document.getElementById("complete-eyebrow").textContent = strings.completeEyebrow;
  document.getElementById("complete-title").innerHTML = strings.completeTitle;
  document.getElementById("reset-btn").textContent = strings.resetGame;
  document.getElementById("confirm-title").textContent = strings.confirmTitle;
  document.getElementById("confirm-body").textContent = strings.confirmBody;
  document.getElementById("confirm-cancel").textContent = strings.cancel;
  document.getElementById("confirm-ok").textContent = strings.reset;
  document.getElementById("footer-text").textContent = strings.footer;

  document.getElementById("mode-toggle").setAttribute("aria-label", strings.modeToggle);
  document.getElementById("sound-toggle").setAttribute("aria-label", strings.soundToggle);
  document.getElementById("reset-icon-btn").setAttribute("aria-label", strings.resetIcon);
  document.getElementById("modal-close").setAttribute("aria-label", strings.closeQuestion);
}

function initThemeControls() {
  document.querySelectorAll(".theme-swatch").forEach(btn => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.themeChoice));
  });

  document.getElementById("mode-toggle").addEventListener("click", () => {
    applyMode(state.mode === "dark" ? "light" : "dark");
  });

  document.getElementById("sound-toggle").addEventListener("click", () => {
    applySound(!state.sound);
  });
}

function initLanguageControls() {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => applyLanguage(btn.dataset.langChoice));
  });
}

/* ---------- 6. WHEEL CONSTRUCTION ---------- */
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
// The wheel only ever shows numbers — categories and questions never appear on it.
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

/* ---------- 7. SPIN LOGIC ---------- */
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

/* ---------- 8. SOUND ENGINE (Web Audio API, no external files) ---------- */
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
    const tt = i / totalTicks;
    const delay = 35 + Math.pow(tt, 2.2) * 190; // accelerating delay = decelerating wheel
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

/* ---------- 9. MODAL LOGIC ---------- */
const modalBackdrop = document.getElementById("modal-backdrop");
const modalCard = document.getElementById("modal-card");
const completeBackdrop = document.getElementById("complete-backdrop");
const confirmBackdrop = document.getElementById("confirm-backdrop");

// Which number is currently shown in the modal (so a language switch
// re-renders the right one), and whether it was opened from the history
// strip (read-only recap) rather than from an actual spin result.
let currentModalNumber = null;
let modalIsHistoryView = false;

// Fills in the question modal's text for the given number, in the current
// language — used both when a spin lands and when the language is switched
// while the modal is already open.
function renderQuestionModal(number) {
  const data = QUESTIONS[number];
  const lang = state.lang;
  const categoryLabel = CATEGORIES[data.cat][lang];
  const accent = CATEGORY_ACCENTS[data.cat] || "var(--accent)";

  document.getElementById("modal-category").textContent = categoryLabel;
  document.getElementById("modal-question-number").textContent = t().questionNumber(number);
  document.getElementById("modal-question-text").textContent = data.question[lang];
  modalCard.style.setProperty("--cat-accent", accent);
}

function openQuestionModal(number) {
  currentModalNumber = number;
  modalIsHistoryView = false;
  renderQuestionModal(number);

  modalBackdrop.hidden = false;
  window.requestAnimationFrame(() => modalCard.focus());
  document.addEventListener("keydown", handleEscapeKey);
}

// Opens the same popup in read-only recap mode for a number the user has
// already answered — used when they tap a chip in the USED/NAGAMIT NA
// history strip. Closing it never re-enables the spin button or triggers
// the completion screen, since it isn't a live spin result.
function openHistoryQuestion(number) {
  if (!state.used.includes(number)) return;

  currentModalNumber = number;
  modalIsHistoryView = true;
  renderQuestionModal(number);

  modalBackdrop.hidden = false;
  window.requestAnimationFrame(() => modalCard.focus());
  document.addEventListener("keydown", handleEscapeKey);
}

function closeQuestionModal() {
  modalBackdrop.hidden = true;
  document.removeEventListener("keydown", handleEscapeKey);

  if (modalIsHistoryView) {
    modalIsHistoryView = false;
    return;
  }

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

// Full reset: clears used questions, history, roulette progress, selected
// language, theme, dark/light mode, and sound settings, then wipes the
// saved localStorage entry entirely. After a full reset the game always
// comes back up in Tagalog with a fresh 100/100 pool.
function performReset() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    /* localStorage may be unavailable (private mode); fail silently */
  }

  state.pool = shuffledNumbers();
  state.used = [];
  state.rotation = 0;
  state.theme = DEFAULT_THEME;
  state.mode = DEFAULT_MODE;
  state.sound = true;
  state.lang = DEFAULT_LANG;

  applyTheme(state.theme);
  applyMode(state.mode);
  applySound(state.sound);
  applyLanguage(state.lang);
  saveState();

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

function initModalControls() {
  document.getElementById("modal-close").addEventListener("click", closeQuestionModal);
  document.getElementById("modal-close-btn").addEventListener("click", closeQuestionModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeQuestionModal();
  });

  document.getElementById("reset-btn").addEventListener("click", openConfirmModal);
  document.getElementById("reset-icon-btn").addEventListener("click", () => {
    if (!modalBackdrop.hidden) closeQuestionModal();
    openConfirmModal();
  });
  document.getElementById("confirm-cancel").addEventListener("click", closeConfirmModal);
  document.getElementById("confirm-ok").addEventListener("click", performReset);
  confirmBackdrop.addEventListener("click", (e) => {
    if (e.target === confirmBackdrop) closeConfirmModal();
  });
}

/* ---------- 10. HISTORY / REMAINING COUNTER ---------- */
function updateRemainingUI() {
  const remaining = state.pool.length;
  document.getElementById("remaining-text").innerHTML =
    `${t().remaining}: <strong>${remaining} / ${TOTAL_QUESTIONS}</strong>`;
}

function updateHistoryUI() {
  const wrap = document.getElementById("history-wrap");
  const list = document.getElementById("history-list");

  if (state.used.length === 0) {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;

  // Most recent first, numbers only — never questions. Each chip is a
  // real button so a tap re-opens that question in read-only recap mode.
  const chips = [...state.used].reverse()
    .map(n => `<button type="button" class="history-chip" data-number="${n}">${n}</button>`)
    .join("");
  list.innerHTML = chips;
}

function initHistoryControls() {
  document.getElementById("history-list").addEventListener("click", (e) => {
    const chip = e.target.closest(".history-chip");
    if (!chip) return;
    openHistoryQuestion(Number(chip.dataset.number));
  });
}

/* ---------- 11. INIT ---------- */
function init() {
  loadState();

  applyTheme(state.theme);
  applyMode(state.mode);
  applySound(state.sound);
  applyLanguage(state.lang);

  buildWheel();
  refreshWheelUsedState();
  setWheelRotation(state.rotation, false);

  const hubNumber = document.getElementById("wheel-hub-number");
  hubNumber.textContent = state.used.length ? state.used[state.used.length - 1] : "?";

  updateRemainingUI();
  updateHistoryUI();

  initThemeControls();
  initLanguageControls();
  initModalControls();
  initHistoryControls();

  document.getElementById("spin-btn").addEventListener("click", spin);

  // If a restored game was already complete, show the completion state.
  if (state.pool.length === 0 && state.used.length === TOTAL_QUESTIONS) {
    window.setTimeout(openCompletionModal, 400);
  }
}

document.addEventListener("DOMContentLoaded", init);
