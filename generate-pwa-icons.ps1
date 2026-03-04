# PWA Icon Generator Script
# Creates placeholder PWA icons using emoji-based approach

Write-Host "🎨 Creating PWA Icons for Brain Tug..." -ForegroundColor Cyan

# Create pwa-icons directory
$iconsDir = "pwa-icons"
if (!(Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir | Out-Null
    Write-Host "✓ Created $iconsDir directory" -ForegroundColor Green
}

# Icon sizes needed for PWA
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

# HTML template for icon generation
$htmlTemplate = @'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { margin: 0; padding: 0; }
        #canvas { display: block; }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script>
        const size = SIZE_PLACEHOLDER;
        const canvas = document.getElementById('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, '#667EEA');
        gradient.addColorStop(0.5, '#764BA2');
        gradient.addColorStop(1, '#F093FB');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        // Add emoji
        ctx.font = `${size * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎮', size / 2, size / 2);
        
        // Convert to PNG
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `icon-${size}x${size}.png`;
            a.click();
        });
    </script>
</body>
</html>
'@

Write-Host "`n📝 Generating icon HTML files..." -ForegroundColor Yellow

foreach ($size in $sizes) {
    $html = $htmlTemplate -replace 'SIZE_PLACEHOLDER', $size
    $filename = "generate-icon-$size.html"
    Set-Content -Path $filename -Value $html
    Write-Host "  Created $filename" -ForegroundColor Gray
}

Write-Host "`n" -NoNewline
Write-Host "⚠️  MANUAL STEP REQUIRED:" -ForegroundColor Red
Write-Host @"

To generate the actual PNG icons:

1. Open each generate-icon-*.html file in a browser
2. The icon will automatically download
3. Move all downloaded icon-*.png files to the $iconsDir folder
4. Delete the generate-icon-*.html files after generating

OR use this automated Node.js approach:

npm install canvas
node -e "
const { createCanvas } = require('canvas');
const fs = require('fs');
[72,96,128,144,152,192,384,512].forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667EEA');
  gradient.addColorStop(0.5, '#764BA2');
  gradient.addColorStop(1, '#F093FB');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  ctx.font = \`\${size * 0.6}px Arial\`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🎮', size / 2, size / 2);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(\`$iconsDir/icon-\${size}x\${size}.png\`, buffer);
  console.log(\`Created icon-\${size}x\${size}.png\`);
});
"

OR use an online tool:
1. Go to https://realfavicongenerator.net/
2. Upload a 512x512 PNG image
3. Select PWA icon generation
4. Download and extract to $iconsDir folder

"@

Write-Host "`n🎯 Creating placeholder SVG icon as fallback..." -ForegroundColor Cyan

# Create a fallback SVG icon
$svgIcon = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667EEA;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#764BA2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F093FB;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#grad)"/>
  <text x="256" y="320" font-size="300" text-anchor="middle" fill="white">🎮</text>
</svg>
'@

Set-Content -Path "$iconsDir/icon.svg" -Value $svgIcon
Write-Host "✓ Created $iconsDir/icon.svg" -ForegroundColor Green

Write-Host "`n✅ PWA Icon setup complete!" -ForegroundColor Green
Write-Host "📱 Remember to generate the PNG icons before deployment`n" -ForegroundColor Yellow
