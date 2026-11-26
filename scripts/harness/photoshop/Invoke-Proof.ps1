[CmdletBinding()]
param([Parameter(Mandatory)][string] $OutputDirectory)

$ErrorActionPreference = 'Stop'
$parent = Get-Item -LiteralPath $OutputDirectory
if (-not $parent.PSIsContainer) { throw 'Choose an existing creative workspace directory.' }
# Every execution owns a new directory, including interrupted runs.
$run = Join-Path $parent.FullName ('proof-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $run -ErrorAction Stop | Out-Null
$app = New-Object -ComObject Photoshop.Application
$script = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'proof.jsx') -Raw
# Encode the path as JSON data. Only the checked-in JSX is executable.
$literal = ConvertTo-Json -Compress -InputObject $run
$result = $app.DoJavaScript("var proofOutput = $literal;`n" + $script)
if ($result -notlike 'PASS *') { throw "Unexpected Photoshop response: $result" }
[ordered]@{
    result = $result
    photoshop = [string]$app.Version
    psdSha256 = (Get-FileHash -LiteralPath (Join-Path $run 'proof.psd')).Hash
    pngSha256 = (Get-FileHash -LiteralPath (Join-Path $run 'proof.png')).Hash
} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $run 'inspection.json') -Encoding utf8
Write-Output $run
