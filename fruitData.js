// ===== Fruit Learning Data =====
// Contains information about 25 common fruits

const fruitDatabase = [
    {
        id: 1,
        name: "Apple",
        emoji: "🍎",
        color: "#FF6B6B"
    },
    {
        id: 2,
        name: "Banana",
        emoji: "🍌",
        color: "#FFE66D"
    },
    {
        id: 3,
        name: "Mango",
        emoji: "🥭",
        color: "#FFB84D"
    },
    {
        id: 4,
        name: "Orange",
        emoji: "🍊",
        color: "#FF9F40"
    },
    {
        id: 5,
        name: "Grapes",
        emoji: "🍇",
        color: "#9B59B6"
    },
    {
        id: 6,
        name: "Pineapple",
        emoji: "🍍",
        color: "#F4D03F"
    },
    {
        id: 7,
        name: "Watermelon",
        emoji: "🍉",
        color: "#E74C3C"
    },
    {
        id: 8,
        name: "Papaya",
        emoji: "🍈",
        color: "#F39C12"
    },
    {
        id: 9,
        name: "Strawberry",
        emoji: "🍓",
        color: "#E74C3C"
    },
    {
        id: 10,
        name: "Coconut",
        emoji: "🥥",
        color: "#8D6E63"
    },
    {
        id: 11,
        name: "Guava",
        emoji: "🍈",
        color: "#81C784"
    },
    {
        id: 12,
        name: "Cherry",
        emoji: "🍒",
        color: "#D32F2F"
    },
    {
        id: 13,
        name: "Peach",
        emoji: "🍑",
        color: "#FFAB91"
    },
    {
        id: 14,
        name: "Pear",
        emoji: "🍐",
        color: "#AED581"
    },
    {
        id: 15,
        name: "Kiwi",
        emoji: "🥝",
        color: "#8BC34A"
    },
    {
        id: 16,
        name: "Dragon Fruit",
        emoji: "🐉",
        color: "#EC407A"
    },
    {
        id: 17,
        name: "Pomegranate",
        emoji: "🍎",
        color: "#C62828"
    },
    {
        id: 18,
        name: "Lemon",
        emoji: "🍋",
        color: "#FFF176"
    },
    {
        id: 19,
        name: "Avocado",
        emoji: "🥑",
        color: "#4CAF50"
    },
    {
        id: 20,
        name: "Blueberry",
        emoji: "🫐",
        color: "#5C6BC0"
    },
    {
        id: 21,
        name: "Lychee",
        emoji: "🍒",
        color: "#F48FB1"
    },
    {
        id: 22,
        name: "Plum",
        emoji: "🍑",
        color: "#7E57C2"
    },
    {
        id: 23,
        name: "Fig",
        emoji: "🍈",
        color: "#795548"
    },
    {
        id: 24,
        name: "Apricot",
        emoji: "🍑",
        color: "#FFB74D"
    },
    {
        id: 25,
        name: "Raspberry",
        emoji: "🍓",
        color: "#E91E63"
    },
    {
        id: 26,
        name: "Jackfruit",
        emoji: "🥭",
        color: "#D4AF37"
    },
    {
        id: 27,
        name: "Durian",
        emoji: "🌰",
        color: "#8B7355"
    },
    {
        id: 28,
        name: "Starfruit",
        emoji: "⭐",
        color: "#FFD700"
    },
    {
        id: 29,
        name: "Passion Fruit",
        emoji: "🥥",
        color: "#9B59B6"
    },
    {
        id: 30,
        name: "Cranberry",
        emoji: "🔴",
        color: "#DC143C"
    },
    {
        id: 31,
        name: "Blackberry",
        emoji: "🫐",
        color: "#2C1E3D"
    },
    {
        id: 32,
        name: "Mulberry",
        emoji: "🍇",
        color: "#722F37"
    },
    {
        id: 33,
        name: "Tangerine",
        emoji: "🍊",
        color: "#FF8C00"
    },
    {
        id: 34,
        name: "Clementine",
        emoji: "🍊",
        color: "#FF7F50"
    },
    {
        id: 35,
        name: "Grapefruit",
        emoji: "🍊",
        color: "#FF6347"
    },
    {
        id: 36,
        name: "Persimmon",
        emoji: "🍅",
        color: "#FF6F3C"
    },
    {
        id: 37,
        name: "Date",
        emoji: "🥮",
        color: "#8B4513"
    },
    {
        id: 38,
        name: "Olive",
        emoji: "🫒",
        color: "#556B2F"
    },
    {
        id: 39,
        name: "Custard Apple",
        emoji: "🍈",
        color: "#90EE90"
    },
    {
        id: 40,
        name: "Sapodilla",
        emoji: "🥔",
        color: "#A0826D"
    },
    {
        id: 41,
        name: "Longan",
        emoji: "🟤",
        color: "#8B7355"
    },
    {
        id: 42,
        name: "Rambutan",
        emoji: "🔴",
        color: "#DC143C"
    },
    {
        id: 43,
        name: "Mangosteen",
        emoji: "🟣",
        color: "#663399"
    },
    {
        id: 44,
        name: "Soursop",
        emoji: "🍈",
        color: "#7CFC00"
    },
    {
        id: 45,
        name: "Breadfruit",
        emoji: "🥖",
        color: "#DAA520"
    },
    {
        id: 46,
        name: "Gooseberry",
        emoji: "🟢",
        color: "#9ACD32"
    },
    {
        id: 47,
        name: "Kiwano",
        emoji: "🥒",
        color: "#FF8C00"
    },
    {
        id: 48,
        name: "Plantain",
        emoji: "🍌",
        color: "#6B8E23"
    },
    {
        id: 49,
        name: "Tamarind",
        emoji: "🌰",
        color: "#654321"
    },
    {
        id: 50,
        name: "Nectarine",
        emoji: "🍑",
        color: "#FFDAB9"
    }
];
