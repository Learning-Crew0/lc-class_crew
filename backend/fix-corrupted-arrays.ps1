$COURSE_ID = "691580448efde7ad4ecc5032"
$BASE_URL = "https://class-crew.onrender.com/api/v1"

param(
    [Parameter(Mandatory=$true)]
    [string]$AdminToken
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FIXING CORRUPTED ARRAY DATA" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Fix the course with proper array data
$updateData = @{
    tags = @("NEWEST", "POPULAR")
    recommendedAudience = @("Beginners")
} | ConvertTo-Json -Depth 10

Write-Host "Fixing corrupted arrays for course $COURSE_ID..." -ForegroundColor Yellow

try {
    $result = Invoke-RestMethod -Uri "$BASE_URL/courses/$COURSE_ID" `
        -Method PUT `
        -Headers @{"Authorization"="Bearer $AdminToken"} `
        -ContentType "application/json; charset=utf-8" `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($updateData))
    
    Write-Host "SUCCESS! Arrays fixed.`n" -ForegroundColor Green
    
    Write-Host "Verifying..." -ForegroundColor Yellow
    $course = Invoke-RestMethod -Uri "$BASE_URL/courses/$COURSE_ID"
    
    Write-Host "tags:" -ForegroundColor Cyan
    $course.data.tags | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    
    Write-Host "`nrecommendedAudience:" -ForegroundColor Cyan
    $course.data.recommendedAudience | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "FIXED! Arrays are now clean." -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

