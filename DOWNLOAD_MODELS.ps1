# Quick Download Links - Open These to Get 3D Models

Write-Host "🎯 Opening 3D Model Download Sites..." -ForegroundColor Green
Write-Host ""
Write-Host "Choose ONE of these options:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1️⃣  MIXAMO (Best Quality - Recommended)" -ForegroundColor Cyan
Write-Host "   - Sign in with Adobe account (free)"
Write-Host "   - Download characters in FBX format"
Write-Host "   - Convert to GLB online"
Start-Process "https://www.mixamo.com"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "2️⃣  READY PLAYER ME (Fastest)" -ForegroundColor Cyan  
Write-Host "   - Create avatars instantly"
Write-Host "   - Export as GLB directly"
Start-Process "https://readyplayer.me"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "3️⃣  SKETCHFAB (Variety)" -ForegroundColor Cyan
Write-Host "   - Search 'humanoid rigged'"
Write-Host "   - Filter by 'Downloadable'"
Start-Process "https://sketchfab.com/3d-models?features=downloadable&q=humanoid+rigged"

Write-Host ""
Write-Host "📦 Also opening FBX to GLB converter..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process "https://products.aspose.app/3d/conversion/fbx-to-glb"

Write-Host ""
Write-Host "✅ All sites opened in browser!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Download 2 humanoid models"
Write-Host "2. Convert to .glb format (if needed)"
Write-Host "3. Rename to: character_a.glb and character_b.glb"
Write-Host "4. Place in the 'models' folder"
Write-Host "5. Refresh the game!"
Write-Host ""
Write-Host "📖 Full instructions: See HOW_TO_ADD_3D_MODELS.md" -ForegroundColor Cyan
Write-Host ""

Pause
