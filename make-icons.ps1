# Generate PWA Icons from KidBattle Logo
Add-Type -AssemblyName System.Drawing

$logo = ".\resources\image\kidbattle-logo.png"
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

Write-Host "Generating PWA icons..." -ForegroundColor Cyan

foreach ($size in $sizes) {
    $output = ".\pwa-icons\icon-${size}x${size}.png"
    try {
        $img = [System.Drawing.Image]::FromFile((Resolve-Path $logo))
        $bmp = New-Object System.Drawing.Bitmap($size, $size)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($img, 0, 0, $size, $size)
        $bmp.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)
        $g.Dispose()
        $bmp.Dispose()
        $img.Dispose()
        Write-Host "  $size x $size - OK" -ForegroundColor Green
    } catch {
        Write-Host "  $size x $size - Failed" -ForegroundColor Red
    }
}

Write-Host "`nDone! Check pwa-icons folder." -ForegroundColor Green
