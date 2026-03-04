# PWA Validation Script
# Checks if all PWA files are properly configured

Write-Host "`n🔍 PWA Configuration Validator" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$errors = 0
$warnings = 0

# Check manifest.json
Write-Host "1. Checking manifest.json..." -ForegroundColor Yellow
if (Test-Path "manifest.json") {
    Write-Host "   ✓ manifest.json exists" -ForegroundColor Green
    try {
        $manifest = Get-Content "manifest.json" -Raw | ConvertFrom-Json
        Write-Host "   ✓ Valid JSON format" -ForegroundColor Green
        Write-Host "     - Name: $($manifest.name)" -ForegroundColor Gray
        Write-Host "     - Start URL: $($manifest.start_url)" -ForegroundColor Gray
        Write-Host "     - Display: $($manifest.display)" -ForegroundColor Gray
        Write-Host "     - Icons: $($manifest.icons.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "   ✗ Invalid JSON format" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "   ✗ manifest.json NOT FOUND" -ForegroundColor Red
    $errors++
}

# Check service-worker.js
Write-Host "`n2. Checking service-worker.js..." -ForegroundColor Yellow
if (Test-Path "service-worker.js") {
    Write-Host "   ✓ service-worker.js exists" -ForegroundColor Green
    $swContent = Get-Content "service-worker.js" -Raw
    if ($swContent -match "CACHE_VERSION\s*=\s*'([^']+)'") {
        Write-Host "     - Cache Version: $($matches[1])" -ForegroundColor Gray
    }
} else {
    Write-Host "   ✗ service-worker.js NOT FOUND" -ForegroundColor Red
    $errors++
}

# Check pwa-install.js
Write-Host "`n3. Checking pwa-install.js..." -ForegroundColor Yellow
if (Test-Path "pwa-install.js") {
    Write-Host "   ✓ pwa-install.js exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ pwa-install.js NOT FOUND" -ForegroundColor Red
    $errors++
}

# Check icons folder
Write-Host "`n4. Checking PWA icons..." -ForegroundColor Yellow
if (Test-Path "pwa-icons") {
    Write-Host "   ✓ pwa-icons directory exists" -ForegroundColor Green
    $iconFiles = Get-ChildItem "pwa-icons" -Filter "*.svg","*.png"
    Write-Host "     - Icon files found: $($iconFiles.Count)" -ForegroundColor Gray
    if ($iconFiles.Count -eq 0) {
        Write-Host "   ⚠ No icon files found - Generate icons before deployment!" -ForegroundColor Yellow
        $warnings++
    }
} else {
    Write-Host "   ✗ pwa-icons directory NOT FOUND" -ForegroundColor Red
    $errors++
}

# Check index.html contains PWA links
Write-Host "`n5. Checking index.html PWA configuration..." -ForegroundColor Yellow
if (Test-Path "index.html") {
    $html = Get-Content "index.html" -Raw
    
    if ($html -match 'rel="manifest"') {
        Write-Host "   ✓ Manifest link found" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Manifest link MISSING" -ForegroundColor Red
        $errors++
    }
    
    if ($html -match 'theme-color') {
        Write-Host "   ✓ Theme color meta tag found" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ Theme color meta tag missing" -ForegroundColor Yellow
        $warnings++
    }
    
    if ($html -match 'apple-mobile-web-app-capable') {
        Write-Host "   ✓ iOS meta tags found" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ iOS meta tags missing" -ForegroundColor Yellow
        $warnings++
    }
    
    if ($html -match 'pwa-install\.js') {
        Write-Host "   ✓ PWA install script linked" -ForegroundColor Green
    } else {
        Write-Host "   ✗ PWA install script NOT linked" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "   ✗ index.html NOT FOUND" -ForegroundColor Red
    $errors++
}

# Check for HTTPS requirement
Write-Host "`n6. HTTPS Requirement..." -ForegroundColor Yellow
Write-Host "   ⓘ PWA requires HTTPS (or localhost)" -ForegroundColor Cyan
Write-Host "   ⓘ GitHub Pages automatically provides HTTPS" -ForegroundColor Cyan

# Summary
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "📊 Validation Summary" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

if ($errors -eq 0) {
    Write-Host "✅ No critical errors found!" -ForegroundColor Green
} else {
    Write-Host "❌ Found $errors critical error(s)" -ForegroundColor Red
}

if ($warnings -gt 0) {
    Write-Host "⚠️  Found $warnings warning(s)" -ForegroundColor Yellow
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
if ($errors -eq 0) {
    Write-Host "   1. Test locally with: python -m http.server 8000" -ForegroundColor White
    Write-Host "   2. Open Chrome DevTools → Application tab" -ForegroundColor White
    Write-Host "   3. Check Manifest, Service Workers, and Cache" -ForegroundColor White
    Write-Host "   4. Run Lighthouse PWA audit" -ForegroundColor White
    Write-Host "   5. Test offline mode (Network tab → Offline)" -ForegroundColor White
    Write-Host "   6. Push to GitHub and enable Pages" -ForegroundColor White
    Write-Host "   7. Test install on real mobile device" -ForegroundColor White
} else {
    Write-Host "   → Fix the errors above first!" -ForegroundColor Red
}

Write-Host "`n📚 See PWA-SETUP-GUIDE.md for detailed instructions`n" -ForegroundColor Gray
