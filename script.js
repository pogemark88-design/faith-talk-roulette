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
  2: { cat: "PERSONAL_FAITH", question: { en: "When do you personally feel closest to Jehovah?", tl: "Kailan mo pinakanararamdaman na malapit ka kay Jehova?" } },
  3: { cat: "PERSONAL_FAITH", question: { en: "What has strengthened your faith the most in your own life?", tl: "Ano ang pinakamalaking nakapagpatibay ng pananampalataya mo sa buhay mo?" } },
  4: { cat: "PERSONAL_FAITH", question: { en: "How would you describe your relationship with Jehovah right now?", tl: "Paano mo ilalarawan ang relasyon mo kay Jehova sa ngayon?" } },
  5: { cat: "PERSONAL_FAITH", question: { en: "Have you ever had a moment when you felt Jehovah was especially close to you? What happened?", tl: "Nagkaroon ka na ba ng sandali na naramdaman mong lalo kang kalapit ni Jehova? Ano ang nangyari?" } },
  6: { cat: "PERSONAL_FAITH", question: { en: "What is one thing you want to understand better about Jehovah?", tl: "Ano ang isang bagay na gusto mong mas maunawaan pa tungkol kay Jehova?" } },
  7: { cat: "PERSONAL_FAITH", question: { en: "Who or what first helped you believe that Jehovah is real and personal?", tl: "Sino o ano ang unang tumulong sa iyo para maniwalang totoo at personal si Jehova?" } },
  8: { cat: "PERSONAL_FAITH", question: { en: "What would you say to someone who doubts that Jehovah cares about them personally?", tl: "Ano ang sasabihin mo sa isang nagdududa na personal siyang pinapahalagahan ni Jehova?" } },
  9: { cat: "PERSONAL_FAITH", question: { en: "In what way has your view of Jehovah changed over the years?", tl: "Sa anong paraan nagbago ang pananaw mo kay Jehova sa paglipas ng mga taon?" } },
  10: { cat: "PERSONAL_FAITH", question: { en: "Can you remember a decision you made because of your faith that you're glad you made?", tl: "Naaalala mo ba ang isang desisyon na ginawa mo dahil sa pananampalataya mo na ikinatutuwa mo hanggang ngayon?" } },
  11: { cat: "PRAYER", question: { en: "How has prayer personally helped you when you were going through something difficult?", tl: "Paano ka personal na natulungan ng panalangin noong dumaraan ka sa mahirap na sitwasyon?" } },
  12: { cat: "PRAYER", question: { en: "What helps you keep praying even when you don't see an answer right away?", tl: "Ano ang nakakatulong sa iyo para patuloy na manalangin kahit hindi mo agad nakikita ang sagot?" } },
  13: { cat: "PRAYER", question: { en: "When was the last time you felt Jehovah really answered your prayer?", tl: "Kailan ang huling pagkakataon na naramdaman mong talagang sinagot ni Jehova ang panalangin mo?" } },
  14: { cat: "PRAYER", question: { en: "What do you usually talk to Jehovah about in your personal prayers?", tl: "Ano ang karaniwan mong pinag-uusapan kay Jehova sa personal mong panalangin?" } },
  15: { cat: "PRAYER", question: { en: "Have you ever prayed about something you were scared to say out loud? What was it like?", tl: "Nanalangin ka na ba tungkol sa isang bagay na natatakot kang sabihin nang malakas? Kumusta ang naramdaman mo?" } },
  16: { cat: "PRAYER", question: { en: "How would you describe the difference between just saying prayers and really praying?", tl: "Paano mo ilalarawan ang pagkakaiba ng basta-bastang pagdarasal at ng totoong pananalangin?" } },
  17: { cat: "PRAYER", question: { en: "What is one habit that has made your prayers feel more personal?", tl: "Ano ang isang gawi na nakatulong para mas maging personal ang mga panalangin mo?" } },
  18: { cat: "PRAYER", question: { en: "Is there a place or time when you find it easiest to pray sincerely?", tl: "May lugar o oras ba na pinakamadali mong manalangin nang taos-puso?" } },
  19: { cat: "PRAYER", question: { en: "What would you want to remember to be more thankful for in prayer?", tl: "Ano ang gusto mong laging tandaan na ipagpasalamat sa panalangin?" } },
  20: { cat: "BIBLE", question: { en: "Is there a scripture that has really affected you? Why?", tl: "May isang teksto ba sa Bibliya na talagang nakaapekto sa iyo? Bakit?" } },
  21: { cat: "BIBLE", question: { en: "How did something you learned in the Bible recently affect you?", tl: "Paano ka naapektuhan ng isang natutuhan mo sa Bibliya kamakailan?" } },
  22: { cat: "BIBLE", question: { en: "Which Bible character do you relate to the most, and why?", tl: "Sinong tauhan sa Bibliya ang pinakanararamdaman mong kahalintulad, at bakit?" } },
  23: { cat: "BIBLE", question: { en: "What is your favorite part of your personal Bible reading?", tl: "Ano ang pinakagusto mo sa personal na pagbabasa mo ng Bibliya?" } },
  24: { cat: "BIBLE", question: { en: "Can you remember a Bible account that changed how you think about something?", tl: "Naaalala mo ba ang isang kuwento sa Bibliya na nagbago ng pananaw mo sa isang bagay?" } },
  25: { cat: "BIBLE", question: { en: "What makes it hard for you to stay consistent with reading the Bible?", tl: "Ano ang pinakamahirap para sa iyo pagdating sa pagiging consistent sa pagbabasa ng Bibliya?" } },
  26: { cat: "BIBLE", question: { en: "Have you ever read a verse that felt like it was written just for you?", tl: "Nakabasa ka na ba ng talata na parang para sa iyo talaga ito isinulat?" } },
  27: { cat: "BIBLE", question: { en: "What is one Bible principle you try hard to apply in your daily life?", tl: "Ano ang isang simulain sa Bibliya na talagang sinisikap mong ikapit sa araw-araw mong buhay?" } },
  28: { cat: "BIBLE", question: { en: "Who taught you to love reading the Bible, and how did they do it?", tl: "Sino ang nagturo sa iyo na mahalin ang pagbabasa ng Bibliya, at paano nila ito ginawa?" } },
  29: { cat: "GRATITUDE", question: { en: "What is something you personally feel most grateful to Jehovah for right now?", tl: "Ano ang isang bagay na talagang pinasasalamatan mo kay Jehova sa ngayon?" } },
  30: { cat: "GRATITUDE", question: { en: "What is a small blessing in your life that you don't want to take for granted?", tl: "Ano ang isang maliit na pagpapala sa buhay mo na ayaw mong basta na lang balewalain?" } },
  31: { cat: "GRATITUDE", question: { en: "Who is someone you're grateful Jehovah placed in your life?", tl: "Sino ang isang taong ikinagagalak mong ipinadala ni Jehova sa buhay mo?" } },
  32: { cat: "GRATITUDE", question: { en: "What experience are you most thankful for because of how it shaped you?", tl: "Anong karanasan ang pinakapinasasalamatan mo dahil sa paraan ng pagbuo nito sa iyo?" } },
  33: { cat: "GRATITUDE", question: { en: "Have you ever realized a blessing only after it was gone or almost lost?", tl: "Napansin mo na ba ang isang pagpapala noong halos mawala na ito o nawala na?" } },
  34: { cat: "GRATITUDE", question: { en: "What is one thing about your spiritual life you're thankful for that others might overlook?", tl: "Ano ang isang bagay tungkol sa espirituwal mong buhay na pinasasalamatan mo pero baka hindi napapansin ng iba?" } },
  35: { cat: "GRATITUDE", question: { en: "When do you find it easiest to notice Jehovah's kindness in your day?", tl: "Kailan mo pinakamadaling mapansin ang kabaitan ni Jehova sa araw mo?" } },
  36: { cat: "GRATITUDE", question: { en: "What would you tell your younger self to be more grateful for?", tl: "Ano ang sasabihin mo sa mas batang ikaw para mas magpasalamat pa?" } },
  37: { cat: "GRATITUDE", question: { en: "Is there a hard season in your life that you're now grateful you went through?", tl: "May mahirap na panahon ba sa buhay mo na ikinatutuwa mo na ngayon na naranasan mo?" } },
  38: { cat: "CHALLENGES", question: { en: "What do you personally do when you feel discouraged spiritually?", tl: "Ano ang ginagawa mo kapag nararamdaman mong nanghihina ang espirituwalidad mo?" } },
  39: { cat: "CHALLENGES", question: { en: "What helps you continue serving Jehovah when you feel discouraged?", tl: "Ano ang nakakatulong sa iyo para patuloy na maglingkod kay Jehova kapag pinanghihinaan ka ng loob?" } },
  40: { cat: "CHALLENGES", question: { en: "What is the hardest temptation you've had to work through, in a way you're comfortable sharing?", tl: "Ano ang pinakamahirap na tukso na kinaharap mo, sa paraang komportable kang ibahagi?" } },
  41: { cat: "CHALLENGES", question: { en: "Have you ever felt like giving up spiritually? What kept you going?", tl: "Naramdaman mo na ba na gusto mo nang sumuko sa espirituwal? Ano ang nagpapatuloy sa iyo?" } },
  42: { cat: "CHALLENGES", question: { en: "How do you personally deal with pressure to compromise your beliefs?", tl: "Paano mo hinaharap ang presyon na sumuway sa mga paniniwala mo?" } },
  43: { cat: "CHALLENGES", question: { en: "What is one thing you've learned from a mistake that helped your spirituality?", tl: "Ano ang isang natutuhan mo mula sa isang pagkakamali na nakatulong sa espirituwalidad mo?" } },
  44: { cat: "CHALLENGES", question: { en: "When life feels overwhelming, what is the first thing you turn to?", tl: "Kapag nararamdaman mong sobrang bigat ng buhay, ano ang una mong ginagawa?" } },
  45: { cat: "CHALLENGES", question: { en: "How do you keep a positive outlook when things aren't going your way?", tl: "Paano mo pinapanatili ang positibong pananaw kahit hindi maganda ang takbo ng buhay?" } },
  46: { cat: "CHALLENGES", question: { en: "What would you tell someone who feels like their struggles are too big for Jehovah to help with?", tl: "Ano ang sasabihin mo sa isang nakaramdam na masyadong malaki ang problema niya para matulungan pa siya ni Jehova?" } },
  47: { cat: "FAMILY", question: { en: "How has your family influenced your relationship with Jehovah?", tl: "Paano naapektuhan ng pamilya mo ang relasyon mo kay Jehova?" } },
  48: { cat: "FAMILY", question: { en: "Who in your family has had the biggest spiritual influence on you?", tl: "Sino sa pamilya mo ang may pinakamalaking espirituwal na impluwensiya sa iyo?" } },
  49: { cat: "FAMILY", question: { en: "What is a family tradition or habit that has strengthened your faith?", tl: "Ano ang isang tradisyon o gawi ng pamilya na nakapagpatibay ng pananampalataya mo?" } },
  50: { cat: "FAMILY", question: { en: "How do you personally show appreciation to the people in your family?", tl: "Paano mo ipinapakita ang pagpapahalaga mo sa mga miyembro ng pamilya mo?" } },
  51: { cat: "FAMILY", question: { en: "What is one thing you hope to pass on to your family spiritually?", tl: "Ano ang isang bagay na gusto mong maipasa sa pamilya mo sa espirituwal?" } },
  52: { cat: "FAMILY", question: { en: "Have you ever learned an important lesson about faith from a family member?", tl: "Natuto ka na ba ng mahalagang aral tungkol sa pananampalataya mula sa isang kapamilya?" } },
  53: { cat: "FAMILY", question: { en: "What would you like to improve about how you communicate with your family?", tl: "Ano ang gusto mong pagbutihin sa paraan ng iyong pakikipag-usap sa pamilya mo?" } },
  54: { cat: "FAMILY", question: { en: "Who in your family do you most want to grow closer to spiritually?", tl: "Sino sa pamilya mo ang pinakagusto mong maging mas malapit sa espirituwal?" } },
  55: { cat: "FAMILY", question: { en: "What is a memory with your family that reminds you of Jehovah's love?", tl: "Anong alaala kasama ang pamilya mo ang nagpapaalala sa iyo ng pag-ibig ni Jehova?" } },
  56: { cat: "FRIENDSHIPS", question: { en: "Have your friendships ever influenced your relationship with Jehovah? In what way?", tl: "Naimpluwensyahan ka na ba ng mga kaibigan mo sa relasyon mo kay Jehova? Sa anong paraan?" } },
  57: { cat: "FRIENDSHIPS", question: { en: "What qualities do you look for most in a close friend?", tl: "Anong katangian ang pinakahinahanap mo sa isang malapit na kaibigan?" } },
  58: { cat: "FRIENDSHIPS", question: { en: "Who is a friend that has encouraged your faith, and how did they do it?", tl: "Sino ang kaibigan na nagpalakas ng loob mo sa pananampalataya, at paano nila ito ginawa?" } },
  59: { cat: "FRIENDSHIPS", question: { en: "Have you ever had to let go of a friendship because it wasn't good for you spiritually?", tl: "Kinailangan mo na bang lumayo sa isang kaibigan dahil hindi ito maganda para sa espirituwalidad mo?" } },
  60: { cat: "FRIENDSHIPS", question: { en: "What kind of friend do you personally try to be to others?", tl: "Anong klaseng kaibigan ang sinisikap mong maging para sa iba?" } },
  61: { cat: "FRIENDSHIPS", question: { en: "When was a time a friend really helped you through something difficult?", tl: "Kailan ka huling tinulungan ng isang kaibigan sa isang mahirap na sandali?" } },
  62: { cat: "FRIENDSHIPS", question: { en: "What would you want a friend to know about how you're really doing right now?", tl: "Ano ang gusto mong malaman ng isang kaibigan tungkol sa totoong kalagayan mo ngayon?" } },
  63: { cat: "FRIENDSHIPS", question: { en: "How do you personally try to encourage a friend who seems discouraged?", tl: "Paano mo sinisikap na palakasin ang loob ng isang kaibigang mukhang panghina?" } },
  64: { cat: "CONGREGATION", question: { en: "What is one experience at a congregation meeting that has stayed with you?", tl: "Ano ang isang karanasan sa pulong ng kongregasyon na hindi mo nakakalimutan?" } },
  65: { cat: "CONGREGATION", question: { en: "Who in your congregation has personally encouraged you the most?", tl: "Sino sa kongregasyon ninyo ang pinaka-nagpalakas ng loob mo?" } },
  66: { cat: "CONGREGATION", question: { en: "What do you personally look forward to most about meetings?", tl: "Ano ang talagang inaasam mo pagdating sa mga pulong?" } },
  67: { cat: "CONGREGATION", question: { en: "Have you ever felt encouraged by simply watching how others handle a difficult time?", tl: "Naramdaman mo na ba na napalakas ang loob mo dahil lang sa pagmamasid kung paano hinarap ng iba ang isang mahirap na panahon?" } },
  68: { cat: "CONGREGATION", question: { en: "What is one way you personally try to make others feel welcome at the congregation?", tl: "Ano ang isang paraan na sinisikap mong gawin para maramdaman ng iba na malugod silang tinatanggap sa kongregasyon?" } },
  69: { cat: "CONGREGATION", question: { en: "Who is someone in your congregation you'd like to know better?", tl: "Sino sa kongregasyon ninyo ang gusto mong makilala nang mas mabuti?" } },
  70: { cat: "CONGREGATION", question: { en: "What is a comment or lesson from a meeting that has stuck with you?", tl: "Ano ang isang komento o aral mula sa pulong na hindi mo nakakalimutan?" } },
  71: { cat: "CONGREGATION", question: { en: "How has being part of a congregation shaped who you are today?", tl: "Paano ka hinubog ng pagiging bahagi ng kongregasyon sa kung sino ka ngayon?" } },
  72: { cat: "CONGREGATION", question: { en: "What would you like to do to become more active in your congregation?", tl: "Ano ang gusto mong gawin para maging mas aktibo sa kongregasyon?" } },
  73: { cat: "MINISTRY", question: { en: "What is an experience from the ministry that meant a lot to you personally?", tl: "Ano ang isang karanasan sa ministeryo na talagang may kahulugan para sa iyo?" } },
  74: { cat: "MINISTRY", question: { en: "How do you personally feel before you go out in the ministry?", tl: "Ano ang nararamdaman mo bago ka lumabas sa ministeryo?" } },
  75: { cat: "MINISTRY", question: { en: "What is something you've learned about people through the ministry?", tl: "Ano ang isang natutuhan mo tungkol sa tao dahil sa ministeryo?" } },
  76: { cat: "MINISTRY", question: { en: "Have you ever had a conversation in the ministry that surprised you?", tl: "Nagkaroon ka na ba ng pag-uusap sa ministeryo na nagulat ka?" } },
  77: { cat: "MINISTRY", question: { en: "What personally motivates you to keep sharing your faith with others?", tl: "Ano ang talagang nag-uudyok sa iyo para ipagpatuloy ang pagbabahagi ng pananampalataya mo sa iba?" } },
  78: { cat: "MINISTRY", question: { en: "What is one thing you'd like to improve about how you talk to people in the ministry?", tl: "Ano ang isang bagay na gusto mong pagbutihin sa paraan mo ng pakikipag-usap sa tao sa ministeryo?" } },
  79: { cat: "MINISTRY", question: { en: "How has doing the ministry affected your own faith?", tl: "Paano naapektuhan ng paggawa ng ministeryo ang sarili mong pananampalataya?" } },
  80: { cat: "MINISTRY", question: { en: "Who is someone you met in the ministry that you still think about?", tl: "Sino ang isang taong nakilala mo sa ministeryo na naiisip mo pa rin hanggang ngayon?" } },
  81: { cat: "MINISTRY", question: { en: "What helps you feel more confident when starting a conversation about the Bible?", tl: "Ano ang nakakatulong sa iyo para maging mas kumpiyansa kapag nagsisimula ng pag-uusap tungkol sa Bibliya?" } },
  82: { cat: "SPIRITUAL_GROWTH", question: { en: "What is one thing you personally want to improve spiritually?", tl: "Ano ang isang espirituwal na routine na gusto mong pagbutihin?" } },
  83: { cat: "SPIRITUAL_GROWTH", question: { en: "What is one spiritual goal you personally want to achieve?", tl: "Ano ang isang espirituwal na goal na gusto mong maabot?" } },
  84: { cat: "SPIRITUAL_GROWTH", question: { en: "What is a habit you'd like to become more consistent with?", tl: "Ano ang isang gawain na gusto mong mas maging consistent sa paggawa?" } },
  85: { cat: "SPIRITUAL_GROWTH", question: { en: "How do you personally measure whether you're growing spiritually?", tl: "Paano mo sinusukat kung lumalago ka ba nang espirituwal?" } },
  86: { cat: "SPIRITUAL_GROWTH", question: { en: "What is a weakness you're working on that you're comfortable sharing?", tl: "Ano ang isang kahinaan na sinisikap mong lutasin na komportable kang ibahagi?" } },
  87: { cat: "SPIRITUAL_GROWTH", question: { en: "What would you like to change or improve about yourself as a Christian?", tl: "Ano ang gusto mong baguhin o pagbutihin sa sarili mo bilang Kristiyano?" } },
  88: { cat: "SPIRITUAL_GROWTH", question: { en: "What is a piece of counsel that helped you grow in an area you struggled with?", tl: "Anong payo ang nakatulong sa iyo na lumago sa isang bagay na nahihirapan ka?" } },
  89: { cat: "SPIRITUAL_GROWTH", question: { en: "If you could improve one spiritual habit overnight, which would it be?", tl: "Kung may maaari kang pagbutihing isang espirituwal na gawi kaagad, ano kaya ito?" } },
  90: { cat: "SPIRITUAL_GROWTH", question: { en: "What does spiritual maturity look like to you personally?", tl: "Ano ang hitsura ng espirituwal na pagkahinog para sa iyo?" } },
  91: { cat: "SPIRITUAL_GROWTH", question: { en: "What is something you used to struggle with spiritually that has gotten easier over time?", tl: "Ano ang isang bagay na dati mong nahihirapan sa espirituwal na naging mas madali na sa paglipas ng panahon?" } },
  92: { cat: "FUTURE_HOPE", question: { en: "What part of Jehovah's promises for the future means the most to you?", tl: "Aling pangako ni Jehova para sa hinaharap ang may pinakamalaking kahulugan para sa iyo?" } },
  93: { cat: "FUTURE_HOPE", question: { en: "How does your hope for the future affect how you live today?", tl: "Paano nakaaapekto ang pag-asa mo para sa hinaharap sa paraan ng pamumuhay mo ngayon?" } },
  94: { cat: "FUTURE_HOPE", question: { en: "What are you personally most looking forward to in the new world?", tl: "Ano ang pinaka-inaasam mo sa bagong sanlibutan?" } },
  95: { cat: "FUTURE_HOPE", question: { en: "If you could achieve one thing this year spiritually, what would it be?", tl: "Kung may isang bagay kang maaabot ngayong taon sa espirituwal, ano kaya ito?" } },
  96: { cat: "FUTURE_HOPE", question: { en: "What would you want to say to Jehovah if you saw him today?", tl: "Ano ang gusto mong sabihin kay Jehova kung makikita mo siya ngayon?" } },
  97: { cat: "FUTURE_HOPE", question: { en: "Who do you hope to see again because of the resurrection?", tl: "Sino ang inaasam mong makitang muli dahil sa pagkabuhay-muli?" } },
  98: { cat: "FUTURE_HOPE", question: { en: "What is one thing you want to do this week to strengthen your friendship with Jehovah?", tl: "Ano ang isang bagay na gagawin mo ngayong linggo para patibayin ang pagkakaibigan mo kay Jehova?" } },
  99: { cat: "FUTURE_HOPE", question: { en: "How do you personally picture your life five years from now, spiritually?", tl: "Paano mo nakikita ang buhay mo sa loob ng limang taon, sa espirituwal?" } },
  100: { cat: "FUTURE_HOPE", question: { en: "What keeps your hope for the future strong even when things are hard right now?", tl: "Ano ang nagpapanatiling matatag ang pag-asa mo para sa hinaharap kahit mahirap ang kasalukuyan?" } },
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
  SPIRITUAL_GROWTH:  { en: "SPIRITUAL GROWTH", tl: "ESPIRITUWAL NA PAGLAGO" },
  FUTURE_HOPE:       { en: "FUTURE & HOPE",    tl: "HINAHARAP AT PAG-ASA" }
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
  SPIRITUAL_GROWTH: "#5fc7a3",
  FUTURE_HOPE:      "#e0b93f"
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
  if (!modalBackdrop.hidden && state.used.length) {
    renderQuestionModal(state.used[state.used.length - 1]);
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
  renderQuestionModal(number);

  modalBackdrop.hidden = false;
  window.requestAnimationFrame(() => modalCard.focus());
  document.addEventListener("keydown", handleEscapeKey);
}

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

  // Most recent first, numbers only — never questions.
  const chips = [...state.used].reverse().map(n => `<span class="history-chip">${n}</span>`).join("");
  list.innerHTML = chips;
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

  document.getElementById("spin-btn").addEventListener("click", spin);

  // If a restored game was already complete, show the completion state.
  if (state.pool.length === 0 && state.used.length === TOTAL_QUESTIONS) {
    window.setTimeout(openCompletionModal, 400);
  }
}

document.addEventListener("DOMContentLoaded", init);
