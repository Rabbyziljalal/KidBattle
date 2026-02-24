// ===== Fruit Learning Data =====
// Contains information about 50 common fruits with Bengali names

const fruitDatabase = [
    {
        id: 1,
        name: "Apple",
        bengaliName: "আপেল",
        emoji: "🍎",
        color: "#FF6B6B"
    },
    {
        id: 2,
        name: "Banana",
        bengaliName: "কলা",
        emoji: "🍌",
        color: "#FFE66D"
    },
    {
        id: 3,
        name: "Mango",
        bengaliName: "আম",
        emoji: "🥭",
        color: "#FFB84D"
    },
    {
        id: 4,
        name: "Orange",
        bengaliName: "কমলা",
        emoji: "🍊",
        color: "#FF9F40"
    },
    {
        id: 5,
        name: "Grapes",
        bengaliName: "আঙুর",
        emoji: "🍇",
        color: "#9B59B6"
    },
    {
        id: 6,
        name: "Pineapple",
        bengaliName: "আনারস",
        emoji: "🍍",
        color: "#F4D03F"
    },
    {
        id: 7,
        name: "Watermelon",
        bengaliName: "তরমুজ",
        emoji: "🍉",
        color: "#E74C3C"
    },
    {
        id: 8,
        name: "Papaya",
        bengaliName: "পেঁপে",
        emoji: "🍈",
        color: "#F39C12"
    },
    {
        id: 9,
        name: "Strawberry",
        bengaliName: "স্ট্রবেরি",
        emoji: "🍓",
        color: "#E74C3C"
    },
    {
        id: 10,
        name: "Coconut",
        bengaliName: "নারকেল",
        emoji: "🥥",
        color: "#8D6E63"
    },
    {
        id: 11,
        name: "Guava",
        bengaliName: "পেয়ারা",
        emoji: "🍈",
        color: "#81C784"
    },
    {
        id: 12,
        name: "Cherry",
        bengaliName: "চেরি",
        emoji: "🍒",
        color: "#D32F2F"
    },
    {
        id: 13,
        name: "Peach",
        bengaliName: "পীচ ফল",
        emoji: "🍑",
        color: "#FFAB91"
    },
    {
        id: 14,
        name: "Pear",
        bengaliName: "নাশপাতি",
        emoji: "🍐",
        color: "#AED581"
    },
    {
        id: 15,
        name: "Kiwi",
        bengaliName: "কিউই",
        emoji: "🥝",
        color: "#8BC34A"
    },
    {
        id: 16,
        name: "Dragon Fruit",
        bengaliName: "ড্রাগন ফল",
        emoji: "🐉",
        color: "#EC407A"
    },
    {
        id: 17,
        name: "Pomegranate",
        bengaliName: "ডালিম",
        emoji: "🍎",
        color: "#C62828"
    },
    {
        id: 18,
        name: "Lemon",
        bengaliName: "লেবু",
        emoji: "🍋",
        color: "#FFF176"
    },
    {
        id: 19,
        name: "Avocado",
        bengaliName: "অ্যাভোকাডো",
        emoji: "🥑",
        color: "#4CAF50"
    },
    {
        id: 20,
        name: "Blueberry",
        bengaliName: "ব্লুবেরি",
        emoji: "🫐",
        color: "#5C6BC0"
    },
    {
        id: 21,
        name: "Lychee",
        bengaliName: "লিচু",
        emoji: "🍒",
        color: "#F48FB1"
    },
    {
        id: 22,
        name: "Plum",
        bengaliName: "বরই",
        emoji: "🍑",
        color: "#7E57C2"
    },
    {
        id: 23,
        name: "Fig",
        bengaliName: "ডুমুর",
        emoji: "🍈",
        color: "#795548"
    },
    {
        id: 24,
        name: "Apricot",
        bengaliName: "এপ্রিকট",
        emoji: "🍑",
        color: "#FFB74D"
    },
    {
        id: 25,
        name: "Raspberry",
        bengaliName: "রাস্পবেরি",
        emoji: "🍓",
        color: "#E91E63"
    },
    {
        id: 26,
        name: "Jackfruit",
        bengaliName: "কাঁঠাল",
        emoji: "🥭",
        color: "#D4AF37"
    },
    {
        id: 27,
        name: "Durian",
        bengaliName: "ডুরিয়ান",
        emoji: "🌰",
        color: "#8B7355"
    },
    {
        id: 28,
        name: "Starfruit",
        bengaliName: "কামরাঙা",
        emoji: "⭐",
        color: "#FFD700"
    },
    {
        id: 29,
        name: "Passion Fruit",
        bengaliName: "প্যাশন ফল",
        emoji: "🥥",
        color: "#9B59B6"
    },
    {
        id: 30,
        name: "Cranberry",
        bengaliName: "ক্র্যানবেরি",
        emoji: "🔴",
        color: "#DC143C"
    },
    {
        id: 31,
        name: "Blackberry",
        bengaliName: "ব্ল্যাকবেরি",
        emoji: "🫐",
        color: "#2C1E3D"
    },
    {
        id: 32,
        name: "Mulberry",
        bengaliName: "তুঁত",
        emoji: "🍇",
        color: "#722F37"
    },
    {
        id: 33,
        name: "Tangerine",
        bengaliName: "টেঞ্জারিন",
        emoji: "🍊",
        color: "#FF8C00"
    },
    {
        id: 34,
        name: "Clementine",
        bengaliName: "ক্লেমেন্টাইন",
        emoji: "🍊",
        color: "#FF7F50"
    },
    {
        id: 35,
        name: "Grapefruit",
        bengaliName: "জাম্বুরা",
        emoji: "🍊",
        color: "#FF6347"
    },
    {
        id: 36,
        name: "Persimmon",
        bengaliName: "পার্সিমন",
        emoji: "🍅",
        color: "#FF6F3C"
    },
    {
        id: 37,
        name: "Date",
        bengaliName: "খেজুর",
        emoji: "🥮",
        color: "#8B4513"
    },
    {
        id: 38,
        name: "Olive",
        bengaliName: "জলপাই",
        emoji: "🫒",
        color: "#556B2F"
    },
    {
        id: 39,
        name: "Custard Apple",
        bengaliName: "আতা ফল",
        emoji: "🍈",
        color: "#90EE90"
    },
    {
        id: 40,
        name: "Sapodilla",
        bengaliName: "সফেদা",
        emoji: "🥔",
        color: "#A0826D"
    },
    {
        id: 41,
        name: "Longan",
        bengaliName: "লংগান",
        emoji: "🟤",
        color: "#8B7355"
    },
    {
        id: 42,
        name: "Rambutan",
        bengaliName: "রামবুটান",
        emoji: "🔴",
        color: "#DC143C"
    },
    {
        id: 43,
        name: "Mangosteen",
        bengaliName: "ম্যাঙ্গোস্টিন",
        emoji: "🟣",
        color: "#663399"
    },
    {
        id: 44,
        name: "Soursop",
        bengaliName: "সাওয়ারসপ",
        emoji: "🍈",
        color: "#7CFC00"
    },
    {
        id: 45,
        name: "Breadfruit",
        bengaliName: "ব্রেডফ্রুট",
        emoji: "🥖",
        color: "#DAA520"
    },
    {
        id: 46,
        name: "Gooseberry",
        bengaliName: "আমলকী",
        emoji: "🟢",
        color: "#9ACD32"
    },
    {
        id: 47,
        name: "Kiwano",
        bengaliName: "কিওয়ানো",
        emoji: "🥒",
        color: "#FF8C00"
    },
    {
        id: 48,
        name: "Plantain",
        bengaliName: "কাঁচকলা",
        emoji: "🍌",
        color: "#6B8E23"
    },
    {
        id: 49,
        name: "Tamarind",
        bengaliName: "তেঁতুল",
        emoji: "🌰",
        color: "#654321"
    },
    {
        id: 50,
        name: "Nectarine",
        bengaliName: "নেকটারিন",
        emoji: "🍑",
        color: "#FFDAB9"
    }
];
