$COURSE_ID = "691580448efde7ad4ecc5032"
$BASE_URL = "https://class-crew.onrender.com/api/v1"

param(
    [Parameter(Mandatory=$true)]
    [string]$AdminToken
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TRAINING SCHEDULES POPULATION SCRIPT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($AdminToken -eq "") {
    Write-Host "ERROR: Admin token is required!" -ForegroundColor Red
    Write-Host "Usage: .\add-training-schedules.ps1 -AdminToken 'YOUR_TOKEN'`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "Loading schedules from training-schedules-data.json..." -ForegroundColor Yellow
$schedules = Get-Content -Path "training-schedules-data.json" -Raw -Encoding UTF8 | ConvertFrom-Json

$successCount = 0
$failCount = 0

Write-Host "Creating training schedules...`n" -ForegroundColor Yellow

foreach ($schedule in $schedules) {
    try {
        $body = $schedule | ConvertTo-Json -Depth 10
        $result = Invoke-RestMethod -Uri "$BASE_URL/courses/$COURSE_ID/training-schedules" -Method POST -Headers @{"Authorization"="Bearer $AdminToken"} -ContentType "application/json; charset=utf-8" -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
        Write-Host "  Created: $($schedule.scheduleName)" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host "  Failed: $($schedule.scheduleName)" -ForegroundColor Red
        Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "RESULTS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Created: $successCount schedules" -ForegroundColor Green
Write-Host "Failed: $failCount schedules" -ForegroundColor Red

Write-Host "`nVerifying..." -ForegroundColor Yellow
try {
    $result = Invoke-RestMethod -Uri "$BASE_URL/courses/$COURSE_ID/training-schedules"
    Write-Host "Total schedules in database: $($result.data.Count)" -ForegroundColor Green
    $result.data | ForEach-Object {
        Write-Host "  - $($_.scheduleName)" -ForegroundColor Gray
        Write-Host "    Date: $($_.startDate) to $($_.endDate)" -ForegroundColor Gray
        Write-Host "    Seats: $($_.availableSeats)" -ForegroundColor Gray
        Write-Host ""
    }
    
    if ($result.data.Count -gt 0) {
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "SUCCESS! Users can now enroll!" -ForegroundColor Cyan
        Write-Host "========================================`n" -ForegroundColor Cyan
    } else {
        Write-Host "WARNING: No schedules found in database!`n" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Failed to verify: $($_.Exception.Message)`n" -ForegroundColor Red
}

