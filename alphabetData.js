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

// ---- English Numbers 1-100 ----
const englishNumbers = [];
const numberWords = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty",
    "Twenty-one", "Twenty-two", "Twenty-three", "Twenty-four", "Twenty-five", "Twenty-six", "Twenty-seven", "Twenty-eight", "Twenty-nine", "Thirty",
    "Thirty-one", "Thirty-two", "Thirty-three", "Thirty-four", "Thirty-five", "Thirty-six", "Thirty-seven", "Thirty-eight", "Thirty-nine", "Forty",
    "Forty-one", "Forty-two", "Forty-three", "Forty-four", "Forty-five", "Forty-six", "Forty-seven", "Forty-eight", "Forty-nine", "Fifty",
    "Fifty-one", "Fifty-two", "Fifty-three", "Fifty-four", "Fifty-five", "Fifty-six", "Fifty-seven", "Fifty-eight", "Fifty-nine", "Sixty",
    "Sixty-one", "Sixty-two", "Sixty-three", "Sixty-four", "Sixty-five", "Sixty-six", "Sixty-seven", "Sixty-eight", "Sixty-nine", "Seventy",
    "Seventy-one", "Seventy-two", "Seventy-three", "Seventy-four", "Seventy-five", "Seventy-six", "Seventy-seven", "Seventy-eight", "Seventy-nine", "Eighty",
    "Eighty-one", "Eighty-two", "Eighty-three", "Eighty-four", "Eighty-five", "Eighty-six", "Eighty-seven", "Eighty-eight", "Eighty-nine", "Ninety",
    "Ninety-one", "Ninety-two", "Ninety-three", "Ninety-four", "Ninety-five", "Ninety-six", "Ninety-seven", "Ninety-eight", "Ninety-nine", "One Hundred"];
const colors = ["#FF6B6B", "#FF9F43", "#FECA57", "#48DBFB", "#FF6B9D", "#54A0FF", "#5F27CD", "#00D2D3", "#FF9FF3", "#F368E0"];
for (let i = 1; i <= 100; i++) {
    englishNumbers.push({
        letter: i.toString(),
        word: numberWords[i],
        emoji: "🔢",
        speech: `${i} — ${numberWords[i]}`,
        color: colors[i % 10]
    });
}

// ---- Bangla Numbers 1-100 ----
const banglaNumbers = [];
const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const banglaNumberWords = ["", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়", "দশ",
    "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোলো", "সতেরো", "আঠারো", "উনিশ", "বিশ",
    "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আটাশ", "ঊনত্রিশ", "ত্রিশ",
    "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাঁইত্রিশ", "আটত্রিশ", "ঊনচল্লিশ", "চল্লিশ",
    "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "ঊনপঞ্চাশ", "পঞ্চাশ",
    "একান্ন", "বাহান্ন", "তিপ্পান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "ঊনষাট", "ষাট",
    "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "ঊনসত্তর", "সত্তর",
    "একাত্তর", "বাহাত্তর", "তিয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছিয়াত্তর", "সাতাত্তর", "আটাত্তর", "ঊনআশি", "আশি",
    "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশি", "ছিয়াশি", "সাতাশি", "আটাশি", "ঊননব্বই", "নব্বই",
    "একানব্বই", "বিরানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছিয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই", "একশ"];

for (let i = 1; i <= 100; i++) {
    let banglNumber = i.toString().split('').map(d => banglaDigits[parseInt(d)]).join('');
    if (i === 100) banglNumber = "১০০";
    banglaNumbers.push({
        letter: banglNumber,
        word: banglaNumberWords[i],
        emoji: "🔢",
        speech: `${banglNumber} — ${banglaNumberWords[i]}`,
        color: colors[i % 10]
    });
}

// ---- Multiplication Tables 1-20 ----
const multiplicationTables = [];
for (let table = 1; table <= 20; table++) {
    const tableData = {
        letter: table.toString(),
        word: `Table of ${table}`,
        emoji: "✖️",
        speech: `Multiplication Table of ${table}`,
        color: colors[table % 10],
        rows: []
    };
    for (let i = 1; i <= 10; i++) {
        tableData.rows.push({
            equation: `${table} × ${i} = ${table * i}`,
            speech: `${table} times ${i} equals ${table * i}`
        });
    }
    multiplicationTables.push(tableData);
}

// ---- Even Numbers 1-100 ----
const evenNumbers = [];
for (let i = 2; i <= 100; i += 2) {
    evenNumbers.push({
        letter: i.toString(),
        word: numberWords[i] || `${i}`,
        emoji: "2️⃣",
        speech: `${i} is Even`,
        color: colors[i % 10]
    });
}

// ---- Odd Numbers 1-100 ----
const oddNumbers = [];
for (let i = 1; i < 100; i += 2) {
    oddNumbers.push({
        letter: i.toString(),
        word: numberWords[i] || `${i}`,
        emoji: "1️⃣",
        speech: `${i} is Odd`,
        color: colors[i % 10]
    });
}
