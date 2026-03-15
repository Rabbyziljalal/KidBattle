// ===== Flower Learning Data =====
// Contains information about 150 flowers

const flowerNames = [
    "Rose", "Lotus", "Sunflower", "Tulip", "Daisy", "Lily", "Orchid", "Jasmine", "Lavender", "Hibiscus",
    "Marigold", "Daffodil", "Peony", "Magnolia", "Gardenia", "Camellia", "Chrysanthemum", "Begonia", "Petunia", "Azalea",
    "Carnation", "Poppy", "Iris", "Geranium", "Zinnia", "Aster", "Dahlia", "Hydrangea", "Morning Glory", "Bluebell",
    "Snowdrop", "Primrose", "Vinca", "Periwinkle", "Foxglove", "Snapdragon", "Hollyhock", "Cosmos", "Nasturtium", "Anemone",
    "Ranunculus", "Freesia", "Hyacinth", "Crocus", "Pansy", "Viola", "Delphinium", "Larkspur", "Sweet Pea", "Clematis",
    "Wisteria", "Bougainvillea", "Plumeria", "Frangipani", "Oleander", "Rhododendron", "Yarrow", "Lupine", "Salvia", "Verbena",
    "Phlox", "Heather", "Calla Lily", "Water Lily", "Tiger Lily", "Daylily", "Amaryllis", "Gladiolus", "Tuberose", "Night Blooming Jasmine",
    "Canna", "Alstroemeria", "Gerbera", "Cornflower", "Forget Me Not", "Edelweiss", "Honeysuckle", "Mimosa", "Acacia Blossom", "Sakura",
    "Cherry Blossom", "Plum Blossom", "Lotus Blue", "Lotus Pink", "Spanish Bluebell", "Queen Anne's Lace", "Black Eyed Susan", "Coreopsis", "Calendula", "Coneflower",
    "Blanket Flower", "Gaillardia", "Bachelor Button", "Statice", "Scabiosa", "Hellebore", "Columbine", "Bellflower", "Campanula", "Goldenrod",
    "Milkweed", "Buttercup", "Jonquil", "Narcissus", "Tansy", "Sorrel Flower", "Kalanchoe", "Ixora", "Anthurium", "Bromeliad",
    "Protea", "Banksia", "Bird of Paradise", "Heliconia", "Passion Flower", "Moonflower", "Desert Rose", "Crown Imperial", "Fuchsia", "Nemesia",
    "Nemophila", "Gazania", "Arum Lily", "Cockscomb", "Celosia", "Globe Amaranth", "Sweet Alyssum", "Candytuft", "Dianthus", "Bee Balm",
    "Indian Paintbrush", "Fireweed", "Jacobs Ladder", "Monkshood", "Meadowsweet", "Queen of the Night", "Spider Lily", "Rain Lily", "Sea Lavender", "Sea Holly",
    "Alpine Aster", "Japanese Anemone", "Christmas Rose", "Easter Lily", "Paperwhite", "Rock Rose", "Prairie Clover Blossom", "Safflower", "Starflower", "Wild Rose"
];

const flowerColors = [
    "#FF4F81", "#F48FB1", "#FFD54F", "#BA68C8", "#81C784",
    "#64B5F6", "#FF8A65", "#AED581", "#9575CD", "#4DD0E1"
];

const flowerTypes = [
    "Garden", "Wild", "Tropical", "Spring", "Summer",
    "Perennial", "Annual", "Fragrant", "Decorative", "Classic"
];

const flowerEmojis = ["🌸", "🌺", "🌻", "🌷", "🌼", "💐", "🪷", "🪻"];

const flowerDatabase = flowerNames.map((name, index) => ({
    id: index + 1,
    name,
    bengaliName: name,
    pronunciation: name,
    emoji: flowerEmojis[index % flowerEmojis.length],
    color: flowerColors[index % flowerColors.length],
    type: flowerTypes[index % flowerTypes.length],
    image: null
}));
