# How to Add 3D Character Models

## 🎯 Quick Start (5 Minutes)

The game now uses **real 3D humanoid models** instead of primitive shapes!

### Step 1: Download Free Models

Choose ONE of these methods:

#### Option A: Mixamo (Best Quality) ⭐ RECOMMENDED

1. Go to https://www.mixamo.com
2. Sign in (free Adobe account)
3. Click "Characters" tab
4. Choose a humanoid character (any will work)
5. Click "Download"
   - Format: **FBX for Unity (.fbx)**
   - Pose: **T-Pose**
   - Download
6. Convert FBX to GLB:
   - Go to https://products.aspose.app/3d/conversion/fbx-to-glb
   - Upload your .fbx file
   - Download the .glb file
7. Rename files:
   - `character_a.glb` (Team A - left side)
   - `character_b.glb` (Team B - right side)
8. Place both files in the `models/` folder

#### Option B: Ready Player Me (Fastest)

1. Go to https://readyplayer.me
2. Create a custom avatar (use default options)
3. Click "Export" → **GLB format**
4. Download the .glb file
5. Rename to `character_a.glb`
6. Create another avatar for Team B
7. Rename to `character_b.glb`
8. Place both in `models/` folder

#### Option C: Sketchfab (Variety)

1. Go to https://sketchfab.com
2. Search: "humanoid rigged character"
3. Filter: "Downloadable" + "CC License"
4. Download a model
5. If it's .fbx, convert to .glb (see Option A step 6)
6. Rename and place in `models/` folder

### Step 2: Test the Models

1. Make sure files are named exactly:
   - `models/character_a.glb`
   - `models/character_b.glb`
2. Open `index.html` in your browser
3. Check console (F12) for loading messages:
   ```
   📦 Loading 3D humanoid models...
   Loading left character: 100%
   Loading right character: 100%
   ✅ Team A character loaded
   ✅ Team B character loaded
   ```

### Step 3: Adjust (If Needed)

If characters are too big/small, edit `tug3d.js` line ~378:
```javascript
character.scale.set(1.5, 1.5, 1.5); // Change this number
```

## 📋 Model Requirements

Your models MUST have:
- ✅ Rigged skeleton (armature)
- ✅ Arm bones (for gripping rope)
- ✅ Standard humanoid rig
- ✅ File size < 10MB (for fast loading)

## 🎨 What Happens If No Models Found?

The game will:
1. Try to load `models/character_a.glb` and `models/character_b.glb`
2. If not found, try a fallback online model
3. If that fails, create simple placeholder shapes
4. Game will still work! Just not as realistic.

## 🔧 Advanced: Custom Bone Names

If your model uses different bone names, edit `tug3d.js` line ~467:
```javascript
const boneNames = {
    leftArm: ['LeftArm', 'Left_Arm', 'YOUR_CUSTOM_NAME'],
    // Add your bone names here
}
```

## 🐛 Troubleshooting

### "Could not load models/character_a.glb"
- Check file exists in `models/` folder
- Check spelling is exact: `character_a.glb` (lowercase)
- Try refreshing browser (Ctrl+F5)

### Character appears flat/no arms moving
- Model might not have bones
- Try a different model from Mixamo
- Check console for bone detection messages

### Character too big/small
- Adjust scale in `tug3d.js` (see Step 3 above)
- Typical range: 0.5 to 3.0

### Character floating/underground
- Check model's origin point
- Some models need Y offset adjustment

## 🎓 Learning Resources

- Mixamo Characters: https://www.mixamo.com
- Blender (Advanced editing): https://www.blender.org
- Three.js GLTF Guide: https://threejs.org/docs/#examples/en/loaders/GLTFLoader

## ✅ Success Checklist

- [ ] Downloaded 2 humanoid models
- [ ] Converted to .glb format (if needed)
- [ ] Renamed to `character_a.glb` and `character_b.glb`
- [ ] Placed in `models/` folder
- [ ] Opened game in browser
- [ ] Checked console for "✅ Team A character loaded"
- [ ] Verified arms are gripping the rope
- [ ] Tested keyboard controls (A and L keys)

Need help? Check console messages (F12 → Console tab)
