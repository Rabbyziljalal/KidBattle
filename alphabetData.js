// ===== Alphabet & Bornomala Data =====

// ---- English Alphabets A-Z ----
const englishAlphabet = [
    { letter: "A", word: "Apple",      emoji: "🍎", speech: "A for Apple",      color: "#FF6B6B" },
    { letter: "B", word: "Ball",       emoji: "⚽", speech: "B for Ball",       color: "#FF9F43" },
    { letter: "C", word: "Cat",        emoji: "🐱", speech: "C for Cat",        color: "#FECA57" },
    { letter: "D", word: "Dog",        emoji: "🐶", speech: "D for Dog",        color: "#48DBFB" },
    { letter: "E", word: "Elephant",   emoji: "🐘", speech: "E for Elephant",   color: "#FF6B9D" },
    { letter: "F", word: "Fish",       emoji: "🐟", speech: "F for Fish",       color: "#54A0FF" },
    { letter: "G", word: "Goat",       emoji: "🐐", speech: "G for Goat",       color: "#5F27CD" },
    { letter: "H", word: "Horse",      emoji: "🐴", speech: "H for Horse",      color: "#00D2D3" },
    { letter: "I", word: "Ice Cream",  emoji: "🍦", speech: "I for Ice Cream",  color: "#FF9FF3" },
    { letter: "J", word: "Jellyfish",  emoji: "🪼", speech: "J for Jellyfish",  color: "#F368E0" },
    { letter: "K", word: "Kite",       emoji: "🪁", speech: "K for Kite",       color: "#FF6348" },
    { letter: "L", word: "Lion",       emoji: "🦁", speech: "L for Lion",       color: "#FFA502" },
    { letter: "M", word: "Monkey",     emoji: "🐒", speech: "M for Monkey",     color: "#2ED573" },
    { letter: "N", word: "Nest",       emoji: "🪺", speech: "N for Nest",       color: "#1E90FF" },
    { letter: "O", word: "Orange",     emoji: "🍊", speech: "O for Orange",     color: "#FF7675" },
    { letter: "P", word: "Parrot",     emoji: "🦜", speech: "P for Parrot",     color: "#A29BFE" },
    { letter: "Q", word: "Queen",      emoji: "👑", speech: "Q for Queen",      color: "#FDCB6E" },
    { letter: "R", word: "Rabbit",     emoji: "🐰", speech: "R for Rabbit",     color: "#E17055" },
    { letter: "S", word: "Sun",        emoji: "☀️", speech: "S for Sun",        color: "#FFD32A" },
    { letter: "T", word: "Tiger",      emoji: "🐯", speech: "T for Tiger",      color: "#FF9800" },
    { letter: "U", word: "Umbrella",   emoji: "☂️", speech: "U for Umbrella",   color: "#74B9FF" },
    { letter: "V", word: "Violin",     emoji: "🎻", speech: "V for Violin",     color: "#B8E994" },
    { letter: "W", word: "Watermelon", emoji: "🍉", speech: "W for Watermelon", color: "#55EFC4" },
    { letter: "X", word: "Xylophone",  emoji: "🎵", speech: "X for Xylophone",  color: "#FD79A8" },
    { letter: "Y", word: "Yak",        emoji: "🐃", speech: "Y for Yak",        color: "#81ECEC" },
    { letter: "Z", word: "Zebra",      emoji: "🦓", speech: "Z for Zebra",      color: "#636E72" }
];

// ---- Bangla Sorborno (স্বরবর্ণ) - 11 Vowels ----
const banglaVowels = [
    { letter: "অ", word: "অজগর",   emoji: "🐍", speech: "অ — অজগর", pronunciation: "O",  color: "#FF6B6B" },
    { letter: "আ", word: "আম",     emoji: "🥭", speech: "আ — আম",   pronunciation: "Aa", color: "#FF9F43" },
    { letter: "ই", word: "ইঁদুর",  emoji: "🐭", speech: "ই — ইঁদুর",pronunciation: "I",  color: "#FECA57" },
    { letter: "ঈ", word: "ঈগল",    emoji: "🦅", speech: "ঈ — ঈগল",  pronunciation: "Ee", color: "#48DBFB" },
    { letter: "উ", word: "উট",     emoji: "🐪", speech: "উ — উট",   pronunciation: "U",  color: "#FF6B9D" },
    { letter: "ঊ", word: "ঊষা",    emoji: "🌅", speech: "ঊ — ঊষা",  pronunciation: "Oo", color: "#54A0FF" },
    { letter: "ঋ", word: "ঋষি",    emoji: "🧙", speech: "ঋ — ঋষি",  pronunciation: "Ri", color: "#5F27CD" },
    { letter: "এ", word: "একতারা", emoji: "🎵", speech: "এ — একতারা",pronunciation: "E",  color: "#00D2D3" },
    { letter: "ঐ", word: "ঐরাবত",  emoji: "🐘", speech: "ঐ — ঐরাবত",pronunciation: "Oi", color: "#FF9FF3" },
    { letter: "ও", word: "ওষুধ",   emoji: "💊", speech: "ও — ওষুধ", pronunciation: "O",  color: "#F368E0" },
    { letter: "ঔ", word: "ঔষধি",   emoji: "🌿", speech: "ঔ — ঔষধি", pronunciation: "Ou", color: "#2ED573" }
];

// ---- Bangla Banjonborno (ব্যঞ্জনবর্ণ) - 49 Consonants ----
const banglaConsonants = [
    // ক-বর্গ
    { letter: "ক", word: "কলা",     emoji: "🍌", speech: "ক — কলা",     color: "#FF6B6B" },
    { letter: "খ", word: "খরগোশ",  emoji: "🐰", speech: "খ — খরগোশ",  color: "#FF9F43" },
    { letter: "গ", word: "গরু",     emoji: "🐄", speech: "গ — গরু",     color: "#FECA57" },
    { letter: "ঘ", word: "ঘড়ি",    emoji: "⏰", speech: "ঘ — ঘড়ি",    color: "#48DBFB" },
    { letter: "ঙ", word: "ঙাওয়াল", emoji: "🎶", speech: "ঙ — ঙ বর্ণ",  color: "#FF6B9D" },
    // চ-বর্গ
    { letter: "চ", word: "চাঁদ",    emoji: "🌙", speech: "চ — চাঁদ",    color: "#54A0FF" },
    { letter: "ছ", word: "ছাগল",    emoji: "🐐", speech: "ছ — ছাগল",    color: "#5F27CD" },
    { letter: "জ", word: "জাহাজ",   emoji: "🚢", speech: "জ — জাহাজ",   color: "#00D2D3" },
    { letter: "ঝ", word: "ঝুড়ি",   emoji: "🧺", speech: "ঝ — ঝুড়ি",   color: "#FF9FF3" },
    { letter: "ঞ", word: "ঞ-বর্ণ",  emoji: "✨", speech: "ঞ — ঞ বর্ণ",  color: "#F368E0" },
    // ট-বর্গ
    { letter: "ট", word: "টমেটো",   emoji: "🍅", speech: "ট — টমেটো",   color: "#FF6348" },
    { letter: "ঠ", word: "ঠান্ডা",  emoji: "❄️", speech: "ঠ — ঠান্ডা",  color: "#FFA502" },
    { letter: "ড", word: "ডালিম",   emoji: "🍎", speech: "ড — ডালিম",   color: "#2ED573" },
    { letter: "ঢ", word: "ঢোল",     emoji: "🥁", speech: "ঢ — ঢোল",     color: "#1E90FF" },
    { letter: "ণ", word: "ণৌকা",    emoji: "⛵", speech: "ণ — ণ বর্ণ",  color: "#FF7675" },
    // ত-বর্গ
    { letter: "ত", word: "তরমুজ",   emoji: "🍉", speech: "ত — তরমুজ",   color: "#A29BFE" },
    { letter: "থ", word: "থালা",    emoji: "🍽️", speech: "থ — থালা",    color: "#FDCB6E" },
    { letter: "দ", word: "দুধ",     emoji: "🥛", speech: "দ — দুধ",     color: "#E17055" },
    { letter: "ধ", word: "ধান",     emoji: "🌾", speech: "ধ — ধান",     color: "#FFD32A" },
    { letter: "ন", word: "নদী",     emoji: "🏞️", speech: "ন — নদী",     color: "#FF9800" },
    // প-বর্গ
    { letter: "প", word: "পাখি",    emoji: "🐦", speech: "প — পাখি",    color: "#74B9FF" },
    { letter: "ফ", word: "ফুল",     emoji: "🌸", speech: "ফ — ফুল",     color: "#B8E994" },
    { letter: "ব", word: "বই",      emoji: "📚", speech: "ব — বই",      color: "#55EFC4" },
    { letter: "ভ", word: "ভালুক",   emoji: "🐻", speech: "ভ — ভালুক",   color: "#FD79A8" },
    { letter: "ম", word: "মাছ",     emoji: "🐟", speech: "ম — মাছ",     color: "#81ECEC" },
    // অন্তঃস্থ
    { letter: "য", word: "যন্ত্র",  emoji: "⚙️", speech: "য — যন্ত্র",  color: "#FF6B6B" },
    { letter: "র", word: "রামধনু",  emoji: "🌈", speech: "র — রামধনু",  color: "#FF9F43" },
    { letter: "ল", word: "লাল",     emoji: "🔴", speech: "ল — লাল",     color: "#FECA57" },
    // তালব্য ও মূর্ধন্য
    { letter: "শ", word: "শাপলা",   emoji: "🌺", speech: "শ — শাপলা",   color: "#48DBFB" },
    { letter: "ষ", word: "ষাঁড়",   emoji: "🐂", speech: "ষ — ষাঁড়",   color: "#FF6B9D" },
    { letter: "স", word: "সূর্য",   emoji: "☀️", speech: "স — সূর্য",   color: "#54A0FF" },
    { letter: "হ", word: "হাতি",    emoji: "🐘", speech: "হ — হাতি",    color: "#5F27CD" },
    // অপ্রধান
    { letter: "ড়", word: "ড়-বর্ণ", emoji: "🔤", speech: "ড় — ড় বর্ণ", color: "#00D2D3" },
    { letter: "ঢ়", word: "ঢ়-বর্ণ", emoji: "🔤", speech: "ঢ় — ঢ় বর্ণ", color: "#FF9FF3" },
    { letter: "য়", word: "য়-বর্ণ", emoji: "🔤", speech: "য় — য় বর্ণ", color: "#F368E0" },
    { letter: "ৎ", word: "ৎ-বর্ণ",  emoji: "🔤", speech: "ৎ — ৎ বর্ণ",  color: "#FF6348" },
    // অনুস্বার ও বিসর্গ
    { letter: "ং", word: "ং-অনুস্বার", emoji: "🌀", speech: "ং — অনুস্বার", color: "#FFA502" },
    { letter: "ঃ", word: "ঃ-বিসর্গ",  emoji: "🌀", speech: "ঃ — বিসর্গ",   color: "#2ED573" },
    { letter: "ঁ", word: "ঁ-চন্দ্রবিন্দু", emoji: "🌙", speech: "ঁ — চন্দ্রবিন্দু", color: "#1E90FF" },
    // হস্ত-বর্ণ (extra set to approach 49)
    { letter: "ক্ষ", word: "ক্ষমা",  emoji: "🙏", speech: "ক্ষ — ক্ষমা",  color: "#FF7675" },
    { letter: "জ্ঞ", word: "জ্ঞান",  emoji: "📖", speech: "জ্ঞ — জ্ঞান",  color: "#A29BFE" },
    // ব-য়া গ্রুপ পূরণ
    { letter: "ঘ্র", word: "ঘ্রাণ",  emoji: "🌸", speech: "ঘ্র — ঘ্রাণ",  color: "#FDCB6E" },
    { letter: "চ্ছ", word: "চ্ছায়া", emoji: "☁️", speech: "চ্ছ — চ্ছায়া", color: "#E17055" },
    { letter: "ত্র", word: "ত্রিভুজ", emoji: "🔺", speech: "ত্র — ত্রিভুজ", color: "#FFD32A" },
    { letter: "দ্ব", word: "দ্বার",   emoji: "🚪", speech: "দ্ব — দ্বার",   color: "#FF9800" },
    { letter: "ব্র", word: "ব্রাশ",   emoji: "🖌️", speech: "ব্র — ব্রাশ",   color: "#74B9FF" },
    { letter: "শ্র", word: "শ্রম",    emoji: "💪", speech: "শ্র — শ্রম",    color: "#B8E994" },
    { letter: "স্ক", word: "স্কুল",   emoji: "🏫", speech: "স্ক — স্কুল",   color: "#55EFC4" },
    { letter: "স্ন", word: "স্নান",   emoji: "🛁", speech: "স্ন — স্নান",   color: "#FD79A8" },
    { letter: "হ্র", word: "হ্রদ",    emoji: "🏞️", speech: "হ্র — হ্রদ",    color: "#81ECEC" }
];
