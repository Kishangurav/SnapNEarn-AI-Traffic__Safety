$htmlContent = @"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="SnapNEarn - Blockchain Traffic Violation Reporting" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <title>SnapNEarn - Web3 Blockchain App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
"@

$htmlContent | Out-File -FilePath "public\index.html" -Encoding UTF8
Write-Host "✅ index.html created successfully!"
