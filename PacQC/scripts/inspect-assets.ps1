Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class SpriteAudit {
  public static long[] Measure(Bitmap image) {
    var rect = new Rectangle(0,0,image.Width,image.Height);
    var data = image.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
    long transparent=0, partial=0; int left=image.Width, top=image.Height, right=-1, bottom=-1;
    try {
      byte[] row = new byte[image.Width*4];
      for(int y=0;y<image.Height;y++) {
        Marshal.Copy(IntPtr.Add(data.Scan0,y*data.Stride),row,0,row.Length);
        for(int x=0;x<image.Width;x++) {
          byte a=row[x*4+3];
          if(a==0) transparent++; else {
            if(a<255) partial++;
            left=Math.Min(left,x); top=Math.Min(top,y); right=Math.Max(right,x); bottom=Math.Max(bottom,y);
          }
        }
      }
    } finally { image.UnlockBits(data); }
    return new long[]{transparent,partial,left,top,right+1,bottom+1};
  }
}
'@
$root = Split-Path $PSScriptRoot -Parent
$expected = @('droite1.png','droite2.png','gauche1.png','gauche2.png','face1.png','face2.png','dos.png')
1..4 | ForEach-Object { $n=$_; @('b','d','g','h') | ForEach-Object { $expected += "ennemi${n}_$_.png" } }
$expected += @('collectible.png','bonus1.png','bonus1_d.png','bonus1_g.png','bonus2.png','bonus2_d.png','bonus2_g.png')
$missing = @($expected | Where-Object { -not (Test-Path -LiteralPath (Join-Path "$root/assets" $_)) })
$files = @(foreach ($name in $expected) {
  $path = Join-Path "$root/assets" $name
  if (-not (Test-Path -LiteralPath $path)) { continue }
  $bitmap = [System.Drawing.Bitmap]::FromFile($path)
  try {
    $m = [SpriteAudit]::Measure($bitmap)
    [ordered]@{ file=$name; width=$bitmap.Width; height=$bitmap.Height; bytes=(Get-Item -LiteralPath $path).Length; alphaChannel=$bitmap.PixelFormat.ToString().Contains('Argb'); transparentPixels=$m[0]; partialPixels=$m[1]; bounds=@($m[2],$m[3],$m[4],$m[5]); sha256=(Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash }
  } finally { $bitmap.Dispose() }
})
$report = [ordered]@{ missing=$missing; files=$files }
$report | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath "$root/assets-audit.json" -Encoding UTF8
Write-Output "Audit : $($files.Count) fichiers presents. Manquants : $($missing -join ', ')."
