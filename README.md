# 🎮 Brain Tug - Kids Learning Tug of War Game

A fun, interactive educational tug-of-war game for kids aged 3-10 years old. Help children practice simple math and basic English while competing in a team-based tug-of-war format.

## 🌟 Features

- **Customizable Team Names**:
  - Set your own team names (e.g., "LIONS vs TIGERS", "RED vs BLUE")
  - Default options: TEAM A and TEAM B
  - Perfect for classroom competitions or family game nights

- **3 Difficulty Levels**:
  - Easy (Ages 3-5): Basic counting, colors, animals
  - Medium (Ages 6-8): Simple multiplication, grammar, plurals
  - Hard (Ages 9-10): Advanced math, past tense, synonyms

- **Educational Content**:
  - Math: Addition, Subtraction, Multiplication, Division
  - English: Grammar, Articles, Plurals, Antonyms, Synonyms

- **Game Mechanics**:
  - 5-minute countdown timer
  - Two-team tug-of-war competition
  - Real-time score tracking
  - Visual rope movement
  - Instant feedback on answers

- **Visual Design**:
  - Colorful, child-friendly interface
  - Smooth animations
  - Confetti celebration for winners
  - Responsive design (mobile + desktop)

## 🚀 Quick Start

### Option 1: Direct Browser
1. Download all files
2. Open `index.html` in any modern web browser
3. Choose difficulty level and start playing!

### Option 2: GitHub Pages
1. Fork or clone this repository
2. Go to Settings > Pages
3. Select main branch as source
4. Your game will be live at: `https://yourusername.github.io/KidBattle`

## 📁 Project Structure

```
KidBattle/
├── index.html          # Main HTML structure
├── style.css           # All styling and animations
├── script.js           # Game logic and functionality
├── questions.js        # Question database
├── README.md           # This file
└── resources/
    ├── sound/          # Sound effects (optional)
    │   ├── correct.mp3
    │   ├── wrong.mp3
    │   └── gameover.mp3
    └── image/          # Future image assets
```

## 🔊 Sound Effects (Optional)

The game works perfectly without sound files. If you want to add sound effects:

### Required Sound Files:
- `correct.mp3` - Played when answer is correct
- `wrong.mp3` - Played when answer is incorrect
- `gameover.mp3` - Played when game ends

### Where to Get Free Sounds:
- [Freesound.org](https://freesound.org/)
- [Zapsplat.com](https://www.zapsplat.com/)
- [Mixkit.co](https://mixkit.co/free-sound-effects/)

### How to Add:
1. Download or create your sound files
2. Place them in `resources/sound/` folder
3. Ensure they're named: `correct.mp3`, `wrong.mp3`, `gameover.mp3`
4. Refresh the game

## 🎯 How to Play

1. **Customize Team Names** (Optional): Enter custom names for both teams or leave blank for defaults (TEAM A and TEAM B)
2. **Choose Difficulty**: Select Easy, Medium, or Hard based on age
3. **Start Game**: Click "Start Game" to begin the 5-minute timer
4. **Answer Questions**: Teams alternate answering math and English questions
5. **Win Condition**: 
   - Rope moves right when Team 1 answers correctly
   - Rope moves left when Team 2 answers correctly
   - Team with rope on their side when time ends wins!

## 🛠️ Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks required
- **No backend needed** - Runs entirely in browser
- **Lightweight** - Fast loading and smooth performance
- **Mobile responsive** - Works on phones, tablets, and desktops
- **Cross-browser compatible** - Works in Chrome, Firefox, Safari, Edge

## 🎨 Customization

### Change Timer Duration
In `script.js`, modify:
```javascript
timeRemaining: 300, // Change 300 to desired seconds
```

### Add More Questions
In `questions.js`, add to the appropriate difficulty level:
```javascript
{ type: "Math", question: "5 + 5", answer: "10", category: "addition" }
```

### Adjust Rope Movement
In `script.js`, change the pull strength:
```javascript
gameState.ropePosition += 5; // Adjust this value (3-10 recommended)
```

### Modify Colors
In `style.css`, update gradient colors:
```css
background: linear-gradient(135deg, #yourcolor1 0%, #yourcolor2 100%);
```

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

**Q: Sound not playing?**
- Ensure sound files are in `resources/sound/` folder
- Check browser allows autoplay (click page first)
- Game works fine without sounds

**Q: Timer not starting?**
- Click "Start Game" button
- Ensure JavaScript is enabled in browser

**Q: Questions not loading?**
- Check that `questions.js` is in same folder as `index.html`
- Clear browser cache and refresh

## 📝 License

This project is free to use for educational purposes. Feel free to modify and distribute.

## 🤝 Contributing

Feel free to:
- Add more questions
- Improve the design
- Add new features
- Report bugs
- Submit pull requests

## 👨‍💻 Development

Built with:
- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript (ES6+)
- Google Fonts (Fredoka)

## 📧 Contact

For questions or suggestions about Kid Battle game, please open an issue on GitHub.

---

**Made with ❤️ for kids learning around the world!**

Enjoy playing Brain Tug! 🎉
