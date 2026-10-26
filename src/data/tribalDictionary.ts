export interface LanguageTranslationItem {
  text: string;
  phonetic: string;
  olChiki?: string;
}

export interface TribalDictionaryEntry {
  sat: LanguageTranslationItem & { olChiki: string };
  unr: LanguageTranslationItem;
  hoc: LanguageTranslationItem;
  category?: 'greeting' | 'classroom_instruction' | 'question' | 'science' | 'math' | 'vocabulary' | 'encouragement';
  englishMeaning?: string;
}

export const TRIBAL_DICTIONARY: Record<string, TribalDictionaryEntry> = {
  // --- Classroom Greetings & Daily Salutations ---
  "नमस्ते": {
    sat: { text: "ᱡᱚᱦᱟᱨ", olChiki: "ᱡᱚᱦᱟᱨ", phonetic: "Johar" },
    unr: { text: "ᱡᱚᱦᱟᱨ", phonetic: "Johar" },
    hoc: { text: "ᱡᱚᱦᱟᱨ", phonetic: "Johar" },
    category: "greeting",
    englishMeaning: "Greetings / Hello"
  },
  "नमस्ते बच्चों": {
    sat: { text: "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ", olChiki: "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ", phonetic: "Johar gidra-ko" },
    unr: { text: "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ", phonetic: "Johar gidra-ko" },
    hoc: { text: "ᱡᱚᱦᱟᱨ ᱦᱚᱯᱚᱱᱠᱚ", phonetic: "Johar hopon-ko" },
    category: "greeting",
    englishMeaning: "Greetings children"
  },
  "शुभ प्रभात": {
    sat: { text: "ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ", olChiki: "ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ", phonetic: "Sagun setag" },
    unr: { text: "ᱵᱩᱜᱤᱱ ᱥᱮᱛᱟᱜ", phonetic: "Bugin setag" },
    hoc: { text: "ᱵᱩᱜᱤ ᱥᱮᱛᱟᱜ", phonetic: "Bugi setag" },
    category: "greeting",
    englishMeaning: "Good morning"
  },
  "शुभ प्रभात बच्चों": {
    sat: { text: "ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ", olChiki: "ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ", phonetic: "Sagun setag gidra-ko" },
    unr: { text: "ᱵᱩᱜᱤᱱ ᱥᱮᱛᱟᱜ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ", phonetic: "Bugin setag gidra-ko" },
    hoc: { text: "ᱵᱩᱜᱤ ᱥᱮᱛᱟᱜ ᱦᱚᱯᱚᱱᱠᱚ", phonetic: "Bugi setag hopon-ko" },
    category: "greeting",
    englishMeaning: "Good morning children"
  },
  "शुभ दोपहर": {
    sat: { text: "ᱥᱟᱹᱜᱩᱱ ᱛᱤᱠᱤᱱ", olChiki: "ᱥᱟᱹᱜᱩᱱ ᱛᱤᱠᱤᱱ", phonetic: "Sagun tikin" },
    unr: { text: "ᱵᱩᱜᱤᱱ ᱛᱤᱠᱤᱱ", phonetic: "Bugin tikin" },
    hoc: { text: "ᱵᱩᱜᱤ ᱛᱤᱠᱤᱱ", phonetic: "Bugi tikin" },
    category: "greeting",
    englishMeaning: "Good afternoon"
  },
  "अलविदा": {
    sat: { text: "ᱡᱚᱦᱟᱨ ᱜᱮ, ᱛᱟᱦᱮᱸᱱ ᱯᱮ", olChiki: "ᱡᱚᱦᱟᱨ ᱜᱮ, ᱛᱟᱦᱮᱸᱱ ᱯᱮ", phonetic: "Johar ge, tahen pe" },
    unr: { text: "ᱡᱚᱦᱟᱨ ᱜᱮ", phonetic: "Johar ge" },
    hoc: { text: "ᱡᱚᱦᱟᱨ ᱜᱮ", phonetic: "Johar ge" },
    category: "greeting",
    englishMeaning: "Goodbye"
  },
  "कल मिलेंगे": {
    sat: { text: "ᱜᱟᱯᱟ ᱵᱚᱱ ᱧᱟᱯᱟᱢᱟ", olChiki: "ᱜᱟᱯᱟ ᱵᱚᱱ ᱧᱟᱯᱟᱢᱟ", phonetic: "Gapa bon ñapama" },
    unr: { text: "ᱜᱟᱯᱟ ᱵᱩ ᱱᱟᱯᱟᱢ-ᱟ", phonetic: "Gapa bu napam-a" },
    hoc: { text: "ᱜᱟᱯᱟ ᱵᱩ ᱱᱟᱯᱟᱢ-ᱟ", phonetic: "Gapa bu napam-a" },
    category: "greeting",
    englishMeaning: "See you tomorrow"
  },
  "धन्यवाद": {
    sat: { text: "ᱥᱟᱨᱦᱟᱣ", olChiki: "ᱥᱟᱨᱦᱟᱣ", phonetic: "Sarhaw" },
    unr: { text: "ᱥᱟᱨᱦᱟᱣ", phonetic: "Sarhaw" },
    hoc: { text: "ᱥᱟᱨᱦᱟᱣ", phonetic: "Sarhaw" },
    category: "greeting",
    englishMeaning: "Thank you"
  },

  // --- Primary Classroom Instructions & Commands ---
  "अपनी किताब खोलो": {
    sat: { text: "ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ", olChiki: "ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ", phonetic: "Amag puthi jhij me" },
    unr: { text: "ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱠᱷᱩᱞᱟᱹᱣ ᱢᱮ", phonetic: "Amag puthi khulaw me" },
    hoc: { text: "ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ", phonetic: "Amag puthi jhij me" },
    category: "classroom_instruction",
    englishMeaning: "Open your book"
  },
  "किताब बंद करो": {
    sat: { text: "ᱯᱩᱛᱷᱤ ᱯᱚᱴᱚᱢ ᱢᱮ", olChiki: "ᱯᱩᱛᱷᱤ ᱯᱚᱴᱚᱢ ᱢᱮ", phonetic: "Puthi potom me" },
    unr: { text: "ᱯᱩᱛᱷᱤ ᱵᱚᱸᱫᱽ ᱢᱮ", phonetic: "Puthi bond me" },
    hoc: { text: "ᱯᱩᱛᱷᱤ ᱯᱚᱴᱚᱢ ᱢᱮ", phonetic: "Puthi potom me" },
    category: "classroom_instruction",
    englishMeaning: "Close the book"
  },
  "यहाँ बैठो": {
    sat: { text: "ᱱᱚᱸᱰᱮ ᱫᱩᱲᱩᱵ ᱢᱮ", olChiki: "ᱱᱚᱸᱰᱮ ᱫᱩᱲᱩᱵ ᱢᱮ", phonetic: "Nonde duṛub me" },
    unr: { text: "ᱱᱮᱛᱟᱨ ᱫᱩᱵᱽ ᱢᱮ", phonetic: "Netar dub me" },
    hoc: { text: "ᱱᱮᱛᱟ ᱫᱩᱵᱽ ᱢᱮ", phonetic: "Neta dub me" },
    category: "classroom_instruction",
    englishMeaning: "Sit here"
  },
  "सब बच्चे बैठ जाओ": {
    sat: { text: "ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱫᱩᱲᱩᱵ ᱯᱮ", olChiki: "ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱫᱩᱲᱩᱵ ᱯᱮ", phonetic: "Joto gidra duṛub pe" },
    unr: { text: "ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱫᱩᱵᱽ ᱯᱮ", phonetic: "Sanam gidra dub pe" },
    hoc: { text: "ᱥᱟᱵᱮᱱ ᱦᱚᱯᱚᱱ ᱫᱩᱵᱽ ᱯᱮ", phonetic: "Saben hopon dub pe" },
    category: "classroom_instruction",
    englishMeaning: "All children sit down"
  },
  "खड़े हो जाओ": {
    sat: { text: "ᱛᱤᱸᱜᱩᱱ ᱢᱮ", olChiki: "ᱛᱤᱸᱜᱩᱱ ᱢᱮ", phonetic: "Tingun me" },
    unr: { text: "ᱛᱤᱝᱜᱩᱱ ᱢᱮ", phonetic: "Tingun me" },
    hoc: { text: "ᱛᱤᱝᱜᱩᱱ ᱢᱮ", phonetic: "Tingun me" },
    category: "classroom_instruction",
    englishMeaning: "Stand up"
  },
  "ध्यान से सुनो": {
    sat: { text: "ᱵᱮᱥ ᱛᱮ ᱟᱸᱡᱚᱢ ᱢᱮ", olChiki: "ᱵᱮᱥ ᱛᱮ ᱟᱸᱡᱚᱢ ᱢᱮ", phonetic: "Bes te ańjom me" },
    unr: { text: "ᱵᱩᱜᱤᱱ ᱛᱮ ᱟᱭᱩᱢ ᱢᱮ", phonetic: "Bugin te ayum me" },
    hoc: { text: "ᱵᱩᱜᱤ ᱛᱮ ᱟᱭᱩᱢ ᱢᱮ", phonetic: "Bugi te ayum me" },
    category: "classroom_instruction",
    englishMeaning: "Listen carefully"
  },
  "श्यामपट्ट पर देखो": {
    sat: { text: "ᱵᱞᱮᱠᱵᱚᱨᱰ ᱨᱮ ᱧᱮᱞ ᱢᱮ", olChiki: "ᱵᱞᱮᱠᱵᱚᱨᱰ ᱨᱮ ᱧᱮᱞ ᱢᱮ", phonetic: "Blackboard re ñel me" },
    unr: { text: "ᱵᱞᱮᱠᱵᱚᱨᱰ ᱨᱮ ᱱᱮᱞ ᱢᱮ", phonetic: "Blackboard re nel me" },
    hoc: { text: "ᱵᱞᱮᱠᱵᱚᱨᱰ ᱨᱮ ᱱᱮᱞ ᱢᱮ", phonetic: "Blackboard re nel me" },
    category: "classroom_instruction",
    englishMeaning: "Look at the blackboard"
  },
  "हाथ ऊपर करो": {
    sat: { text: "ᱛᱤ ᱛᱩᱞ ᱢᱮ", olChiki: "ᱛᱤ ᱛᱩᱞ ᱢᱮ", phonetic: "Ti tul me" },
    unr: { text: "ᱛᱤ ᱛᱩᱞ ᱢᱮ", phonetic: "Ti tul me" },
    hoc: { text: "ᱛᱤ ᱛᱩᱞ ᱢᱮ", phonetic: "Ti tul me" },
    category: "classroom_instruction",
    englishMeaning: "Raise your hand"
  },
  "शांत रहो": {
    sat: { text: "ᱛᱷᱤᱨ ᱛᱟᱦᱮᱸᱱ ᱢᱮ", olChiki: "ᱛᱷᱤᱨ ᱛᱟᱦᱮᱸᱱ ᱢᱮ", phonetic: "Thir tahen me" },
    unr: { text: "ᱛᱷᱤᱨ ᱛᱟᱭᱠᱮᱱ ᱢᱮ", phonetic: "Thir tayken me" },
    hoc: { text: "ᱛᱷᱤᱨ ᱛᱟᱭᱠᱮᱱ ᱢᱮ", phonetic: "Thir tayken me" },
    category: "classroom_instruction",
    englishMeaning: "Be quiet"
  },
  "दरवाजा खोलो": {
    sat: { text: "ᱫᱩᱣᱟᱹᱨ ᱡᱷᱤᱡᱽ ᱢᱮ", olChiki: "ᱫᱩᱣᱟᱹᱨ ᱡᱷᱤᱡᱽ ᱢᱮ", phonetic: "Duwăr jhij me" },
    unr: { text: "ᱫᱩᱣᱟᱹᱨ ᱠᱷᱩᱞᱟᱹᱣ ᱢᱮ", phonetic: "Duwăr khulaw me" },
    hoc: { text: "ᱫᱩᱣᱟᱹᱨ ᱡᱷᱤᱡᱽ ᱢᱮ", phonetic: "Duwăr jhij me" },
    category: "classroom_instruction",
    englishMeaning: "Open the door"
  },
  "दरवाजा बंद करो": {
    sat: { text: "ᱫᱩᱣᱟᱹᱨ ᱥᱤᱝ ᱢᱮ", olChiki: "ᱫᱩᱣᱟᱹᱨ ᱥᱤᱝ ᱢᱮ", phonetic: "Duwăr sing me" },
    unr: { text: "ᱫᱩᱣᱟᱹᱨ ᱵᱚᱸᱫᱽ ᱢᱮ", phonetic: "Duwăr bond me" },
    hoc: { text: "ᱫᱩᱣᱟᱹᱨ ᱥᱤᱝ ᱢᱮ", phonetic: "Duwăr sing me" },
    category: "classroom_instruction",
    englishMeaning: "Close the door"
  },
  "पानी पियो": {
    sat: { text: "ᱫᱟᱜ ᱧᱩᱭ ᱢᱮ", olChiki: "ᱫᱟᱜ ᱧᱩᱭ ᱢᱮ", phonetic: "Daag ñuy me" },
    unr: { text: "ᱫᱟᱜ ᱱᱩᱭ ᱢᱮ", phonetic: "Daag nuy me" },
    hoc: { text: "ᱫᱟᱜ ᱱᱩᱭ ᱢᱮ", phonetic: "Daag nuy me" },
    category: "classroom_instruction",
    englishMeaning: "Drink water"
  },

  // --- Curriculum Lessons & Concepts (EVS, Science, Language) ---
  "आज हम पौधों के बारे में सीखेंगे": {
    sat: { text: "ᱛᱮᱦᱮᱧ ᱫᱚ ᱟᱵᱚ ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ ᱵᱟᱵᱚᱛ ᱵᱚᱱ ᱪᱮᱫᱚᱜ-ᱟ", olChiki: "ᱛᱮᱦᱮᱧ ᱫᱚ ᱟᱵᱚ ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ ᱵᱟᱵᱚᱛ ᱵᱚᱱ ᱪᱮᱫᱚᱜ-ᱟ", phonetic: "Teheñ do abo dare-nari babot bon chedog-a" },
    unr: { text: "ᱛᱤᱥᱤᱝ ᱟᱵᱩ ᱫᱟᱨᱩ ᱵᱤᱥᱚᱭ ᱛᱮ ᱤᱛᱩᱱ-ᱟ", phonetic: "Tising abu daru bisoy te itun-a" },
    hoc: { text: "ᱛᱤᱥᱤᱝ ᱟᱵᱩ ᱫᱟᱨᱩ ᱠᱟᱛᱷᱟ ᱵᱚᱱ ᱤᱛᱩᱱ-ᱟ", phonetic: "Tising abu daru katha bon itun-a" },
    category: "science",
    englishMeaning: "Today we will learn about plants"
  },
  "पौधे को पानी और धूप चाहिए": {
    sat: { text: "ᱫᱟᱨᱮ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱜ ᱟᱨ ᱥᱤᱛᱩᱝ ᱞᱟᱹᱠᱛᱤᱭᱟ", olChiki: "ᱫᱟᱨᱮ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱜ ᱟᱨ ᱥᱤᱛᱩᱝ ᱞᱟᱹᱠᱛᱤᱭᱟ", phonetic: "Dare lagid daag aar situng laktiya" },
    unr: { text: "ᱫᱟᱨᱩ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱜ ᱟᱨ ᱥᱤᱛᱩᱝ ᱫᱚᱨᱠᱟᱨ", phonetic: "Daru lagid daag aar situng dorkar" },
    hoc: { text: "ᱫᱟᱨᱩ ᱞᱟᱹᱜᱤᱱ ᱫᱟᱜ ᱟᱨ ᱡᱮᱛᱮ ᱞᱟᱹᱠᱛᱤ", phonetic: "Daru lagin daag aar jete lakti" },
    category: "science",
    englishMeaning: "Plants need water and sunlight"
  },
  "आज बारिश हो रही है": {
    sat: { text: "ᱛᱮᱦᱮᱧ ᱫᱟᱜ ᱮ ᱡᱟᱹᱲᱤᱭᱮᱫ-ᱟ", olChiki: "ᱛᱮᱦᱮᱧ ᱫᱟᱜ ᱮ ᱡᱟᱹᱲᱤᱭᱮᱫ-ᱟ", phonetic: "Teheñ daag e jari-yeda" },
    unr: { text: "ᱛᱤᱥᱤᱝ ᱫᱟᱜ ᱜᱟᱢᱟ ᱛᱟᱱᱟ", phonetic: "Tising daag gama tana" },
    hoc: { text: "ᱛᱤᱥᱤᱝ ᱫᱟᱜ ᱜᱟᱢᱟ ᱛᱟᱱᱟ", phonetic: "Tising daag gama tana" },
    category: "science",
    englishMeaning: "It is raining today"
  },
  "सूरज चमक रहा है": {
    sat: { text: "ᱥᱤᱸᱜᱤ ᱪᱟᱸᱫᱚ ᱡᱩᱞᱩᱜ ᱠᱟᱱᱟᱭ", olChiki: "ᱥᱤᱸᱜᱤ ᱪᱟᱸᱫᱚ ᱡᱩᱞᱩᱜ ᱠᱟᱱᱟᱭ", phonetic: "Singi chando julug kanay" },
    unr: { text: "ᱥᱤᱸᱜᱤ ᱪᱟᱸᱫᱩ ᱡᱩᱞ ᱛᱟᱱᱟ", phonetic: "Singi chandu jul tana" },
    hoc: { text: "ᱥᱤᱸᱜᱤ ᱵᱮᱲᱟ ᱡᱩᱞ ᱛᱟᱱᱟ", phonetic: "Singi beda jul tana" },
    category: "science",
    englishMeaning: "The sun is shining"
  },

  // --- Classroom Inquiries & Questions ---
  "आप कितने रंग देख सकते हैं?": {
    sat: { text: "ᱟᱢ ᱛᱤᱱᱟᱹᱜ ᱨᱚᱝ ᱮᱢ ᱧᱮᱞ ᱫᱟᱲᱮᱭᱟᱜ ᱠᱟᱱᱟ?", olChiki: "ᱟᱢ ᱛᱤᱱᱟᱹᱜ ᱨᱚᱝ ᱮᱢ ᱧᱮᱞ ᱫᱟᱲᱮᱭᱟᱜ ᱠᱟᱱᱟ?", phonetic: "Am tinag rong em ñel dareyag kana?" },
    unr: { text: "ᱟᱢ ᱪᱤᱢᱤᱱ ᱨᱚᱝ ᱱᱮᱞ ᱫᱟᱭᱮᱭᱟᱢ?", phonetic: "Am chimin rong nel daeyam?" },
    hoc: { text: "ᱟᱢ ᱪᱤᱢᱤᱱ ᱨᱚᱝ ᱱᱮᱞ ᱫᱟᱭᱮᱭᱟᱢ?", phonetic: "Am chimin rong nel daeyam?" },
    category: "question",
    englishMeaning: "How many colors can you see?"
  },
  "क्या आप इस जानवर का नाम बता सकते हैं?": {
    sat: { text: "ᱪᱮᱫ ᱟᱢ ᱱᱩᱭ ᱡᱤᱵᱽ-ᱡᱤᱭᱟᱹᱞᱤ ᱭᱟᱜ ᱧᱩᱛᱩᱢ ᱮᱢ ᱞᱟᱹᱭ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ?", olChiki: "ᱪᱮᱫ ᱟᱢ ᱱᱩᱭ ᱡᱤᱵᱽ-ᱡᱤᱭᱟᱹᱞᱤ ᱭᱟᱜ ᱧᱩᱛᱩᱢ ᱮᱢ ᱞᱟᱹᱭ ᱫᱟᱲᱮᱭᱟᱜ-ᱟ?", phonetic: "Ched am nui jib-jiyali yag ñutum em lai dareyag-a?" },
    unr: { text: "ᱪᱤ ᱟᱢ ᱱᱤ ᱡᱤᱵᱽ ᱟᱜ ᱱᱩᱛᱩᱢ ᱠᱟᱡᱤ ᱫᱟᱭᱮᱭᱟᱢ?", phonetic: "Chi am ni jib aag nutum kaji daeyam?" },
    hoc: { text: "ᱪᱤ ᱟᱢ ᱱᱮᱭ ᱡᱤᱵᱽ ᱨᱮᱭᱟᱜ ᱱᱩᱛᱩᱢ ᱚᱞ ᱫᱟᱭᱮᱭᱟᱢ?", phonetic: "Chi am ney jib reyag nutum ol daeyam?" },
    category: "question",
    englishMeaning: "Can you name this animal?"
  },
  "आपका नाम क्या है?": {
    sat: { text: "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ?", olChiki: "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ?", phonetic: "Amag ñutum do ched?" },
    unr: { text: "ᱟᱢᱟᱜ ᱱᱩᱛᱩᱢ ᱪᱤᱱᱟᱹ?", phonetic: "Amag nutum china?" },
    hoc: { text: "ᱟᱢᱟᱜ ᱱᱩᱛᱩᱢ ᱪᱤᱱᱟᱹ?", phonetic: "Amag nutum china?" },
    category: "question",
    englishMeaning: "What is your name?"
  },
  "मुझे समझ आ गया": {
    sat: { text: "ᱤᱧ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫ-ᱟ", olChiki: "ᱤᱧ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫ-ᱟ", phonetic: "Iñ bujhaw keda" },
    unr: { text: "ᱟᱹᱧ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱟ", phonetic: "Añ bujhaw keda" },
    hoc: { text: "ᱟᱹᱧ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱟ", phonetic: "Añ bujhaw keda" },
    category: "classroom_instruction",
    englishMeaning: "I understood"
  },
  "मुझे भूख लगी है": {
    sat: { text: "ᱤᱧ ᱨᱮᱸᱜᱮᱡ ᱠᱟᱱᱟ", olChiki: "ᱤᱧ ᱨᱮᱸᱜᱮᱡ ᱠᱟᱱᱟ", phonetic: "Iñ reñgej kana" },
    unr: { text: "ᱟᱹᱧ ᱨᱮᱸᱜᱮᱡ ᱛᱟᱱᱟ", phonetic: "Añ reñgej tana" },
    hoc: { text: "ᱟᱹᱧ ᱨᱮᱸᱜᱮᱡ ᱛᱟᱱᱟ", phonetic: "Añ reñgej tana" },
    category: "classroom_instruction",
    englishMeaning: "I am hungry"
  },

  // --- Encouragement & Teacher Praise ---
  "बहुत अच्छा शाबाश!": {
    sat: { text: "ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ, ᱥᱟᱵᱟᱥ!", olChiki: "ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ, ᱥᱟᱵᱟᱥ!", phonetic: "Adi napay, sabas!" },
    unr: { text: "ᱵᱩᱜᱤᱱ ᱜᱮ, ᱥᱟᱵᱟᱥ!", phonetic: "Bugin ge, sabas!" },
    hoc: { text: "ᱵᱩᱜᱤ ᱜᱮ, ᱥᱟᱵᱟᱥ!", phonetic: "Bugi ge, sabas!" },
    category: "encouragement",
    englishMeaning: "Very good, well done!"
  },
  "बहुत अच्छा": {
    sat: { text: "ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ", olChiki: "ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ", phonetic: "Adi napay" },
    unr: { text: "ᱵᱩᱜᱤᱱ ᱜᱮ", phonetic: "Bugin ge" },
    hoc: { text: "ᱵᱩᱜᱤ ᱜᱮ", phonetic: "Bugi ge" },
    category: "encouragement",
    englishMeaning: "Very good"
  },
  "शाबाश!": {
    sat: { text: "ᱥᱟᱵᱟᱥ, ᱟᱹᱰᱤ ᱵᱮᱥ!", olChiki: "ᱥᱟᱵᱟᱥ, ᱟᱹᱰᱤ ᱵᱮᱥ!", phonetic: "Sabas, adi bes!" },
    unr: { text: "ᱥᱟᱵᱟᱥ!", phonetic: "Sabas!" },
    hoc: { text: "ᱥᱟᱵᱟᱥ!", phonetic: "Sabas!" },
    category: "encouragement",
    englishMeaning: "Well done!"
  },

  // --- Foundation Vocabulary & Common Objects ---
  "पानी": {
    sat: { text: "ᱫᱟᱜ", olChiki: "ᱫᱟᱜ", phonetic: "Daag" },
    unr: { text: "ᱫᱟᱜ", phonetic: "Daag" },
    hoc: { text: "ᱫᱟᱜ", phonetic: "Daag" },
    category: "vocabulary",
    englishMeaning: "Water"
  },
  "सूरज": {
    sat: { text: "ᱥᱤᱸᱜᱤ / ᱵᱮᱲᱟ", olChiki: "ᱥᱤᱸᱜᱤ / ᱵᱮᱲᱟ", phonetic: "Singi / Beda" },
    unr: { text: "ᱥᱤᱸᱜᱤ", phonetic: "Singi" },
    hoc: { text: "ᱥᱤᱸᱜᱤ", phonetic: "Singi" },
    category: "vocabulary",
    englishMeaning: "Sun"
  },
  "पेड़": {
    sat: { text: "ᱫᱟᱨᱮ", olChiki: "ᱫᱟᱨᱮ", phonetic: "Dare" },
    unr: { text: "ᱫᱟᱨᱩ", phonetic: "Daru" },
    hoc: { text: "ᱫᱟᱨᱩ", phonetic: "Daru" },
    category: "vocabulary",
    englishMeaning: "Tree"
  },
  "पौधे": {
    sat: { text: "ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ", olChiki: "ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ", phonetic: "Dare-nari" },
    unr: { text: "ᱫᱟᱨᱩ-ᱱᱟᱹᱲᱤ", phonetic: "Daru-nari" },
    hoc: { text: "ᱫᱟᱨᱩ", phonetic: "Daru" },
    category: "vocabulary",
    englishMeaning: "Plants"
  },
  "किताब": {
    sat: { text: "ᱯᱩᱛᱷᱤ", olChiki: "ᱯᱩᱛᱷᱤ", phonetic: "Puthi" },
    unr: { text: "ᱯᱩᱛᱷᱤ", phonetic: "Puthi" },
    hoc: { text: "ᱯᱩᱛᱷᱤ", phonetic: "Puthi" },
    category: "vocabulary",
    englishMeaning: "Book"
  },
  "घर": {
    sat: { text: "ᱚᱲᱟᱜ", olChiki: "ᱚᱲᱟᱜ", phonetic: "Oṛag" },
    unr: { text: "ᱚᱲᱟᱜ", phonetic: "Oṛag" },
    hoc: { text: "ᱚᱲᱟᱜ", phonetic: "Oṛag" },
    category: "vocabulary",
    englishMeaning: "House / Home"
  },
  "विद्यालय": {
    sat: { text: "ᱟᱥᱲᱟ / ᱤᱛᱩᱱ ᱟᱥᱲᱟ", olChiki: "ᱟᱥᱲᱟ / ᱤᱛᱩᱱ ᱟᱥᱲᱟ", phonetic: "Asṛa / Itun Asṛa" },
    unr: { text: "ᱤᱛᱩᱱ ᱚᱲᱟᱜ", phonetic: "Itun Oṛag" },
    hoc: { text: "ᱟᱥᱲᱟ", phonetic: "Asṛa" },
    category: "vocabulary",
    englishMeaning: "School"
  },
  "शिक्षक": {
    sat: { text: "ᱢᱟᱪᱮᱫ", olChiki: "ᱢᱟᱪᱮᱫ", phonetic: "Mached" },
    unr: { text: "ᱢᱟᱥᱴᱟᱨ / ᱤᱛᱩᱱᱤᱭᱟᱹ", phonetic: "Ituniya" },
    hoc: { text: "ᱢᱟᱪᱮᱫ", phonetic: "Mached" },
    category: "vocabulary",
    englishMeaning: "Teacher"
  },
  "दोस्त": {
    sat: { text: "ᱜᱟᱛᱮ", olChiki: "ᱜᱟᱛᱮ", phonetic: "Gate" },
    unr: { text: "ᱜᱟᱛᱤ", phonetic: "Gati" },
    hoc: { text: "ᱜᱟᱛᱮ", phonetic: "Gate" },
    category: "vocabulary",
    englishMeaning: "Friend"
  },
  "बाघ": {
    sat: { text: "ᱛᱟᱹᱨᱩᱵ", olChiki: "ᱛᱟᱹᱨᱩᱵ", phonetic: "Tarub" },
    unr: { text: "ᱛᱟᱹᱨᱩᱵ", phonetic: "Tarub" },
    hoc: { text: "ᱛᱟᱹᱨᱩᱵ", phonetic: "Tarub" },
    category: "vocabulary",
    englishMeaning: "Tiger"
  },
  "हाथी": {
    sat: { text: "ᱦᱟᱹᱛᱤ", olChiki: "ᱦᱟᱹᱛᱤ", phonetic: "Hati" },
    unr: { text: "ᱦᱟᱹᱛᱤ", phonetic: "Hati" },
    hoc: { text: "ᱦᱟᱹᱛᱤ", phonetic: "Hati" },
    category: "vocabulary",
    englishMeaning: "Elephant"
  },
  "गाय": {
    sat: { text: "ᱜᱟᱹᱭ", olChiki: "ᱜᱟᱹᱭ", phonetic: "Gai" },
    unr: { text: "ᱜᱟᱹᱭ", phonetic: "Gai" },
    hoc: { text: "ᱜᱟᱹᱭ", phonetic: "Gai" },
    category: "vocabulary",
    englishMeaning: "Cow"
  },
  "पक्षी": {
    sat: { text: "ᱪᱮᱬᱮ", olChiki: "ᱪᱮᱬᱮ", phonetic: "Cheñe" },
    unr: { text: "ᱪᱮᱬᱮ", phonetic: "Cheñe" },
    hoc: { text: "ᱪᱮᱬᱮ", phonetic: "Cheñe" },
    category: "vocabulary",
    englishMeaning: "Bird"
  },
  "मछली": {
    sat: { text: "ᱦᱟᱠᱳ", olChiki: "ᱦᱟᱠᱳ", phonetic: "Hako" },
    unr: { text: "ᱦᱟᱠᱩ", phonetic: "Haku" },
    hoc: { text: "ᱦᱟᱠᱩ", phonetic: "Haku" },
    category: "vocabulary",
    englishMeaning: "Fish"
  },

  // --- Foundational Numbers ---
  "एक": {
    sat: { text: "ᱢᱤᱫ", olChiki: "ᱢᱤᱫ", phonetic: "Mit" },
    unr: { text: "ᱢᱤᱭᱟᱹᱫᱽ", phonetic: "Miyad" },
    hoc: { text: "ᱢᱤᱭᱟᱹᱫᱽ", phonetic: "Miyad" },
    category: "math",
    englishMeaning: "One"
  },
  "दो": {
    sat: { text: "ᱵᱟᱨ", olChiki: "ᱵᱟᱨ", phonetic: "Bar" },
    unr: { text: "ᱵᱟᱨᱤᱭᱟ", phonetic: "Bariya" },
    hoc: { text: "ᱵᱟᱨᱤᱭᱟ", phonetic: "Bariya" },
    category: "math",
    englishMeaning: "Two"
  },
  "तीन": {
    sat: { text: "ᱯᱮ", olChiki: "ᱯᱮ", phonetic: "Pe" },
    unr: { text: "ᱟᱯᱤᱭᱟ", phonetic: "Apiya" },
    hoc: { text: "ᱟᱯᱤᱭᱟ", phonetic: "Apiya" },
    category: "math",
    englishMeaning: "Three"
  },
  "चार": {
    sat: { text: "ᱯᱳᱱ", olChiki: "ᱯᱳᱱ", phonetic: "Pon" },
    unr: { text: "ᱩᱯᱩᱱᱤᱭᱟ", phonetic: "Upuniya" },
    hoc: { text: "ᱩᱯᱩᱱᱤᱭᱟ", phonetic: "Upuniya" },
    category: "math",
    englishMeaning: "Four"
  },
  "पांच": {
    sat: { text: "ᱢᱚᱬᱮ", olChiki: "ᱢᱚᱬᱮ", phonetic: "Mone" },
    unr: { text: "ᱢᱚᱬᱮᱭᱟ", phonetic: "Moneya" },
    hoc: { text: "ᱢᱚᱬᱮᱭᱟ", phonetic: "Moneya" },
    category: "math",
    englishMeaning: "Five"
  },
};

/**
 * Normalizes user text for reliable comparison
 */
export function normalizeText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[।.,!?;:()"'`~_-]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Smart Strict-First Dictionary Matcher.
 * Matches exact sentences first, then longest matching sub-phrases (at least 2 words or 4+ chars).
 * NEVER does loose substring matching on short single words or single letters.
 */
export function matchTribalDictionary(
  rawText: string,
  targetLang: 'sat' | 'unr' | 'hoc' = 'sat',
  direction: 'hi_to_sat' | 'sat_to_hi' = 'hi_to_sat'
): { translatedText: string; phonetic: string; olChiki: string; matchedKey: string } | null {
  if (!rawText || !rawText.trim()) return null;
  const clean = normalizeText(rawText);

  // If translating from Santhali/Tribal to Hindi (reverse)
  if (direction === 'sat_to_hi') {
    for (const [hindiKey, entry] of Object.entries(TRIBAL_DICTIONARY)) {
      const item = entry[targetLang] || entry.sat;
      const normalizedScript = normalizeText(item.text);
      const normalizedPhonetic = normalizeText(item.phonetic);
      const normalizedOlChiki = normalizeText(item.olChiki || '');

      if (clean === normalizedScript || clean === normalizedPhonetic || (normalizedOlChiki && clean === normalizedOlChiki)) {
        return {
          translatedText: hindiKey,
          phonetic: hindiKey,
          olChiki: item.olChiki || item.text,
          matchedKey: hindiKey,
        };
      }
    }
  }

  // 1. Exact match pass (Highest Confidence)
  for (const [key, entry] of Object.entries(TRIBAL_DICTIONARY)) {
    if (normalizeText(key) === clean) {
      const item = entry[targetLang] || entry.sat;
      return {
        translatedText: item.text,
        phonetic: item.phonetic,
        olChiki: item.olChiki || item.text,
        matchedKey: key,
      };
    }
  }

  // 2. Longest phrase match pass (Sort by key length descending)
  // Ensures "आज हम पौधों के बारे में सीखेंगे" matches before "पौधे"
  const sortedKeys = Object.keys(TRIBAL_DICTIONARY).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const normKey = normalizeText(key);
    // Only consider multi-word phrases or words of at least 4 characters
    if (normKey.length < 4) continue;

    // Check if input contains the whole phrase
    if (clean.includes(normKey)) {
      const item = TRIBAL_DICTIONARY[key][targetLang] || TRIBAL_DICTIONARY[key].sat;
      return {
        translatedText: item.text,
        phonetic: item.phonetic,
        olChiki: item.olChiki || item.text,
        matchedKey: key,
      };
    }
  }

  return null;
}
