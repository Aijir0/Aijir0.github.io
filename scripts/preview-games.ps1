param([int]$Port = 8000)
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Split-Path $PSScriptRoot -Parent))
$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $Port)
$types = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.json'='application/json; charset=utf-8'; '.png'='image/png'; '.md'='text/plain; charset=utf-8'; '.jpg'='image/jpeg'; '.mp3'='audio/mpeg'; '.woff2'='font/woff2'; '.woff'='font/woff'; '.svg'='image/svg+xml'; '.pdf'='application/pdf' }
$listener.Start()
Write-Host "Aperçu NON PROTEGE du site : http://127.0.0.1:$Port/ - Ctrl+C pour arreter."
try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $client.ReceiveTimeout = 3000; $client.SendTimeout = 10000
      $stream = $client.GetStream()
      $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 4096, $true)
      $request = $reader.ReadLine()
      if (-not $request) { continue }
      while ($reader.ReadLine()) { }
      $parts = $request.Split(' ')
      $status = '200 OK'; $mime = 'text/plain; charset=utf-8'; $body = [byte[]]@()
      if ($parts[0] -notin @('GET','HEAD')) { $status='405 Method Not Allowed' }
      else {
        $relative = [Uri]::UnescapeDataString(($parts[1] -split '\?')[0]).TrimStart('/')
        if ($relative.EndsWith('/')) { $relative += 'index.html' }
        if ($relative -eq '') { $relative = 'index.html' }
        $path = [IO.Path]::GetFullPath((Join-Path $root $relative))
        if (-not $path.StartsWith($root + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase) -or $relative -match '(^|[\\/])\.') { $status='403 Forbidden' }
        elseif (-not [IO.File]::Exists($path)) { $status='404 Not Found' }
        else {
          $body = [IO.File]::ReadAllBytes($path)
          $mime = $types[[IO.Path]::GetExtension($path).ToLowerInvariant()]
          if (-not $mime) { $mime='application/octet-stream' }
        }
      }
      if ($status -ne '200 OK') { $body=[Text.Encoding]::UTF8.GetBytes($status) }
      $header = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 $status`r`nContent-Type: $mime`r`nContent-Length: $($body.Length)`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n")
      $stream.Write($header,0,$header.Length)
      if ($parts[0] -ne 'HEAD') { $stream.Write($body,0,$body.Length) }
    } catch { Write-Warning $_.Exception.Message }
    finally { $client.Dispose() }
  }
} finally { $listener.Stop() }

