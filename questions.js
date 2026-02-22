// Questions Database for Brain Tug Game
// Organized by difficulty level: easy, medium, hard

const questionsDatabase = {
    easy: [
        // Math Questions - Easy (Ages 3-5)
        { type: "Math", question: "1 + 1", answer: "2", category: "addition" },
        { type: "Math", question: "2 + 1", answer: "3", category: "addition" },
        { type: "Math", question: "1 + 2", answer: "3", category: "addition" },
        { type: "Math", question: "2 + 2", answer: "4", category: "addition" },
        { type: "Math", question: "3 + 1", answer: "4", category: "addition" },
        { type: "Math", question: "3 + 2", answer: "5", category: "addition" },
        { type: "Math", question: "4 + 1", answer: "5", category: "addition" },
        { type: "Math", question: "2 + 3", answer: "5", category: "addition" },
        { type: "Math", question: "5 + 1", answer: "6", category: "addition" },
        { type: "Math", question: "3 + 3", answer: "6", category: "addition" },
        { type: "Math", question: "2 - 1", answer: "1", category: "subtraction" },
        { type: "Math", question: "3 - 1", answer: "2", category: "subtraction" },
        { type: "Math", question: "3 - 2", answer: "1", category: "subtraction" },
        { type: "Math", question: "4 - 1", answer: "3", category: "subtraction" },
        { type: "Math", question: "5 - 2", answer: "3", category: "subtraction" },
        { type: "Math", question: "4 - 2", answer: "2", category: "subtraction" },
        { type: "Math", question: "5 - 3", answer: "2", category: "subtraction" },
        { type: "Math", question: "5 - 1", answer: "4", category: "subtraction" },

        // English Questions - Easy (Ages 3-5)
        { type: "English", question: "What color is the sky? (blue/red/green)", answer: "blue", category: "colors" },
        { type: "English", question: "What color is grass? (blue/red/green)", answer: "green", category: "colors" },
        { type: "English", question: "What color is an apple? (blue/red/green)", answer: "red", category: "colors" },
        { type: "English", question: "What animal says 'meow'? (dog/cat/cow)", answer: "cat", category: "animals" },
        { type: "English", question: "What animal says 'woof'? (dog/cat/cow)", answer: "dog", category: "animals" },
        { type: "English", question: "What animal says 'moo'? (dog/cat/cow)", answer: "cow", category: "animals" },
        { type: "English", question: "__ apple (a or an)", answer: "an", category: "articles" },
        { type: "English", question: "__ cat (a or an)", answer: "a", category: "articles" },
        { type: "English", question: "__ dog (a or an)", answer: "a", category: "articles" },
        { type: "English", question: "__ egg (a or an)", answer: "an", category: "articles" },
        { type: "English", question: "Complete: I __ happy (am/is/are)", answer: "am", category: "grammar" },
        { type: "English", question: "Complete: He __ tall (am/is/are)", answer: "is", category: "grammar" },
        { type: "English", question: "Complete: She __ nice (am/is/are)", answer: "is", category: "grammar" },
        { type: "English", question: "Complete: They __ friends (am/is/are)", answer: "are", category: "grammar" },
        { type: "English", question: "How many legs does a dog have?", answer: "4", category: "general" },
        { type: "English", question: "How many wheels on a car?", answer: "4", category: "general" },
        { type: "English", question: "What comes after 1, 2, __?", answer: "3", category: "sequence" },
    ],

    medium: [
        // Math Questions - Medium (Ages 6-8)
        { type: "Math", question: "5 + 4", answer: "9", category: "addition" },
        { type: "Math", question: "6 + 5", answer: "11", category: "addition" },
        { type: "Math", question: "7 + 8", answer: "15", category: "addition" },
        { type: "Math", question: "9 + 6", answer: "15", category: "addition" },
        { type: "Math", question: "8 + 7", answer: "15", category: "addition" },
        { type: "Math", question: "12 + 5", answer: "17", category: "addition" },
        { type: "Math", question: "15 + 10", answer: "25", category: "addition" },
        { type: "Math", question: "20 + 15", answer: "35", category: "addition" },
        { type: "Math", question: "10 - 4", answer: "6", category: "subtraction" },
        { type: "Math", question: "12 - 5", answer: "7", category: "subtraction" },
        { type: "Math", question: "15 - 8", answer: "7", category: "subtraction" },
        { type: "Math", question: "20 - 7", answer: "13", category: "subtraction" },
        { type: "Math", question: "18 - 9", answer: "9", category: "subtraction" },
        { type: "Math", question: "25 - 10", answer: "15", category: "subtraction" },
        { type: "Math", question: "2 × 3", answer: "6", category: "multiplication" },
        { type: "Math", question: "2 × 4", answer: "8", category: "multiplication" },
        { type: "Math", question: "3 × 3", answer: "9", category: "multiplication" },
        { type: "Math", question: "2 × 5", answer: "10", category: "multiplication" },
        { type: "Math", question: "3 × 4", answer: "12", category: "multiplication" },
        { type: "Math", question: "4 × 4", answer: "16", category: "multiplication" },
        { type: "Math", question: "5 × 5", answer: "25", category: "multiplication" },
        { type: "Math", question: "6 ÷ 2", answer: "3", category: "division" },
        { type: "Math", question: "8 ÷ 2", answer: "4", category: "division" },
        { type: "Math", question: "10 ÷ 2", answer: "5", category: "division" },
        { type: "Math", question: "12 ÷ 3", answer: "4", category: "division" },
        { type: "Math", question: "15 ÷ 3", answer: "5", category: "division" },

        // English Questions - Medium (Ages 6-8)
        { type: "English", question: "I __ to school every day (go/goes)", answer: "go", category: "grammar" },
        { type: "English", question: "She __ to the park (go/goes)", answer: "goes", category: "grammar" },
        { type: "English", question: "They __ playing outside (is/are)", answer: "are", category: "grammar" },
        { type: "English", question: "He __ my friend (is/are)", answer: "is", category: "grammar" },
        { type: "English", question: "Complete: The __ is shining (sun/son)", answer: "sun", category: "homophones" },
        { type: "English", question: "Complete: I love my __ (sun/son)", answer: "son", category: "homophones" },
        { type: "English", question: "Opposite of 'hot' is __?", answer: "cold", category: "antonyms" },
        { type: "English", question: "Opposite of 'big' is __?", answer: "small", category: "antonyms" },
        { type: "English", question: "Opposite of 'happy' is __?", answer: "sad", category: "antonyms" },
        { type: "English", question: "Opposite of 'fast' is __?", answer: "slow", category: "antonyms" },
        { type: "English", question: "__ orange (a or an)", answer: "an", category: "articles" },
        { type: "English", question: "__ umbrella (a or an)", answer: "an", category: "articles" },
        { type: "English", question: "__ elephant (a or an)", answer: "an", category: "articles" },
        { type: "English", question: "__ book (a or an)", answer: "a", category: "articles" },
        { type: "English", question: "Plural of 'cat' is __?", answer: "cats", category: "plurals" },
        { type: "English", question: "Plural of 'dog' is __?", answer: "dogs", category: "plurals" },
        { type: "English", question: "Plural of 'box' is __? (boxes/boxs)", answer: "boxes", category: "plurals" },
        { type: "English", question: "What day comes after Monday?", answer: "tuesday", category: "general" },
        { type: "English", question: "How many days in a week?", answer: "7", category: "general" },
        { type: "English", question: "How many months in a year?", answer: "12", category: "general" },
    ],

    hard: [
        // Math Questions - Hard (Ages 9-10)
        { type: "Math", question: "15 + 27", answer: "42", category: "addition" },
        { type: "Math", question: "34 + 18", answer: "52", category: "addition" },
        { type: "Math", question: "45 + 35", answer: "80", category: "addition" },
        { type: "Math", question: "56 + 29", answer: "85", category: "addition" },
        { type: "Math", question: "67 + 48", answer: "115", category: "addition" },
        { type: "Math", question: "73 + 59", answer: "132", category: "addition" },
        { type: "Math", question: "50 - 23", answer: "27", category: "subtraction" },
        { type: "Math", question: "82 - 37", answer: "45", category: "subtraction" },
        { type: "Math", question: "100 - 45", answer: "55", category: "subtraction" },
        { type: "Math", question: "95 - 68", answer: "27", category: "subtraction" },
        { type: "Math", question: "74 - 29", answer: "45", category: "subtraction" },
        { type: "Math", question: "6 × 7", answer: "42", category: "multiplication" },
        { type: "Math", question: "7 × 8", answer: "56", category: "multiplication" },
        { type: "Math", question: "8 × 9", answer: "72", category: "multiplication" },
        { type: "Math", question: "9 × 9", answer: "81", category: "multiplication" },
        { type: "Math", question: "12 × 5", answer: "60", category: "multiplication" },
        { type: "Math", question: "11 × 6", answer: "66", category: "multiplication" },
        { type: "Math", question: "15 × 4", answer: "60", category: "multiplication" },
        { type: "Math", question: "13 × 3", answer: "39", category: "multiplication" },
        { type: "Math", question: "24 ÷ 4", answer: "6", category: "division" },
        { type: "Math", question: "36 ÷ 6", answer: "6", category: "division" },
        { type: "Math", question: "48 ÷ 8", answer: "6", category: "division" },
        { type: "Math", question: "56 ÷ 7", answer: "8", category: "division" },
        { type: "Math", question: "72 ÷ 9", answer: "8", category: "division" },
        { type: "Math", question: "81 ÷ 9", answer: "9", category: "division" },
        { type: "Math", question: "100 ÷ 10", answer: "10", category: "division" },

        // English Questions - Hard (Ages 9-10)
        { type: "English", question: "Past tense of 'run' is __?", answer: "ran", category: "verbs" },
        { type: "English", question: "Past tense of 'eat' is __?", answer: "ate", category: "verbs" },
        { type: "English", question: "Past tense of 'go' is __?", answer: "went", category: "verbs" },
        { type: "English", question: "Past tense of 'see' is __?", answer: "saw", category: "verbs" },
        { type: "English", question: "Synonym of 'happy' is __? (joyful/sad)", answer: "joyful", category: "synonyms" },
        { type: "English", question: "Synonym of 'big' is __? (large/small)", answer: "large", category: "synonyms" },
        { type: "English", question: "Synonym of 'smart' is __? (clever/dumb)", answer: "clever", category: "synonyms" },
        { type: "English", question: "He __ been studying (has/have)", answer: "has", category: "grammar" },
        { type: "English", question: "They __ been playing (has/have)", answer: "have", category: "grammar" },
        { type: "English", question: "She __ going to the store (is/are)", answer: "is", category: "grammar" },
        { type: "English", question: "We __ learning English (is/are)", answer: "are", category: "grammar" },
        { type: "English", question: "Complete: __ you coming? (Is/Are)", answer: "are", category: "grammar" },
        { type: "English", question: "Plural of 'child' is __?", answer: "children", category: "plurals" },
        { type: "English", question: "Plural of 'man' is __?", answer: "men", category: "plurals" },
        { type: "English", question: "Plural of 'woman' is __?", answer: "women", category: "plurals" },
        { type: "English", question: "Plural of 'tooth' is __?", answer: "teeth", category: "plurals" },
        { type: "English", question: "Plural of 'foot' is __?", answer: "feet", category: "plurals" },
        { type: "English", question: "Complete: I __ do my homework (will/shall)", answer: "will", category: "grammar" },
        { type: "English", question: "What is the capital of USA? (2 words)", answer: "washington dc", category: "general" },
        { type: "English", question: "How many letters in the alphabet?", answer: "26", category: "general" },
        { type: "English", question: "Adjective form of 'beauty' is __?", answer: "beautiful", category: "words" },
        { type: "English", question: "Which is correct? (their/there) book", answer: "their", category: "homophones" },
        { type: "English", question: "Which is correct? Go over (their/there)", answer: "there", category: "homophones" },
    ]
};

// Helper function to get questions by difficulty level
function getQuestionsByDifficulty(level) {
    return questionsDatabase[level] || questionsDatabase.easy;
}

// Helper function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { questionsDatabase, getQuestionsByDifficulty, shuffleArray };
}
