# 3D Character Models

## Required Files

Place your humanoid 3D models here:
- `character_a.glb` - Team A character (left side)
- `character_b.glb` - Team B character (right side)

## Model Requirements

✅ **Must have:**
- Rigged humanoid skeleton
- Arm bones (LeftArm, RightArm, LeftForeArm, RightForeArm)
- Hand bones (LeftHand, RightHand)
- Spine/torso bones for leaning
- Proper scale (1-2 meters tall)

✅ **Recommended:**
- T-pose or A-pose as default
- Clean topology
- Optimized polygons (< 20k tris)
- Color/texture applied

## Where to Get Free Models

1. **Mixamo** (https://www.mixamo.com)
   - Free rigged characters
   - Download as .FBX, convert to .GLB using online converter
   
2. **Ready Player Me** (https://readyplayer.me)
   - Generate custom avatars
   - Export as .GLB
   
3. **Sketchfab** (https://sketchfab.com)
   - Search "humanoid rigged" + "downloadable"
   - Filter by CC license
   
4. **Poly Pizza** (https://poly.pizza)
   - Free low-poly characters

## Testing

The game will:
1. Try to load `models/character_a.glb` and `models/character_b.glb`
2. If not found, use a fallback online model
3. Show console errors if models can't load

## File Format

- Preferred: `.glb` (binary GLTF)
- Alternative: `.gltf` (JSON + separate textures)
