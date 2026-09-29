$ErrorActionPreference = "Stop"
$mysqlRoot = Join-Path $env:LOCALAPPDATA "Programs\MySQL84\mysql-8.4.9-winx64"
$dataDir = Join-Path $env:LOCALAPPDATA "MySQL84Data"
$server = Join-Path $mysqlRoot "bin\mysqld.exe"
$log = Join-Path $dataDir "mysql-error.log"

if (-not (Test-Path $server)) { throw "MySQL 8.4 is not installed at $mysqlRoot" }
if (-not (Test-Path $dataDir)) { throw "The local MySQL data directory is missing: $dataDir" }

$listener = Get-NetTCPConnection -LocalPort 3307 -State Listen -ErrorAction SilentlyContinue
if (-not $listener) {
    $process = Start-Process -FilePath $server -ArgumentList @(
        "--basedir=$mysqlRoot",
        "--datadir=$dataDir",
        "--port=3307",
        "--bind-address=127.0.0.1",
        "--mysqlx=OFF",
        "--log-error=$log"
    ) -WindowStyle Hidden -PassThru

    $deadline = (Get-Date).AddSeconds(40)
    do {
        Start-Sleep -Seconds 2
        $listener = Get-NetTCPConnection -LocalPort 3307 -State Listen -ErrorAction SilentlyContinue
        if ($listener) { break }
        if ($process.HasExited) {
            if (Test-Path $log) { Get-Content $log -Tail 20 }
            throw "MySQL stopped before it started listening. See $log"
        }
    } while ((Get-Date) -lt $deadline)
}

if (-not $listener) { throw "MySQL did not listen on port 3307. See $log" }
Write-Host "MySQL 8.4 is ready on 127.0.0.1:3307"
