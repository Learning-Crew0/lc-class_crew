$COURSE_ID = "691580448efde7ad4ecc5032"
$BASE_URL = "https://class-crew.onrender.com/api/v1"

param(
    [string]$AdminToken = ""
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "COURSE REVIEW POPULATION SCRIPT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Step 1: Creating reviews..." -ForegroundColor Yellow
$reviews = Get-Content -Path "reviews-data.json" -Raw -Encoding UTF8 | ConvertFrom-Json

$reviewIds = @()
$successCount = 0

foreach ($review in $reviews) {
    try {
        $body = $review | ConvertTo-Json -Depth 10
        $result = Invoke-RestMethod -Uri "$BASE_URL/courses/$COURSE_ID/reviews" -Method POST -ContentType "application/json; charset=utf-8" -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
        Write-Host "  Created: $($review.reviewerName)" -ForegroundColor Green
        $reviewIds += $result.data.id
        $successCount++
    } catch {
        Write-Host "  Failed: $($review.reviewerName) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n$successCount reviews created successfully." -ForegroundColor Green
Write-Host "Review IDs: $($reviewIds -join ', ')" -ForegroundColor Gray

if ($AdminToken -eq "") {
    Write-Host "`n========================================" -ForegroundColor Yellow
    Write-Host "WARNING: No admin token provided" -ForegroundColor Yellow
    Write-Host "========================================`n" -ForegroundColor Yellow
    Write-Host "Reviews are created but NOT APPROVED yet." -ForegroundColor Red
    Write-Host "They won't appear on the frontend until approved.`n" -ForegroundColor Red
    
    Write-Host "To approve reviews, run:" -ForegroundColor Cyan
    Write-Host "  .\populate-reviews.ps1 -AdminToken 'YOUR_ADMIN_TOKEN'`n" -ForegroundColor White
    
    Write-Host "OR manually approve each review:" -ForegroundColor Cyan
    foreach ($id in $reviewIds) {
        Write-Host "  curl -X PUT 'https://class-crew.onrender.com/api/v1/courses/$COURSE_ID/reviews/$id' \" -ForegroundColor Gray
        Write-Host "    -H 'Authorization: Bearer YOUR_TOKEN' \" -ForegroundColor Gray
        Write-Host "    -H 'Content-Type: application/json' \" -ForegroundColor Gray
        Write-Host "    -d '{\"isApproved\":true}'" -ForegroundColor Gray
        Write-Host ""
    }
    exit 0
}

Write-Host "`nStep 2: Approving reviews..." -ForegroundColor Yellow
$approvedCount = 0

foreach ($id in $reviewIds) {
    try {
        $body = @{isApproved=$true} | ConvertTo-Json
        $result = Invoke-RestMethod -Uri "$BASE_URL/courses/$COURSE_ID/reviews/$id" -Method PUT -Headers @{"Authorization"="Bearer $AdminToken"} -ContentType "application/json; charset=utf-8" -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
        Write-Host "  Approved: $id" -ForegroundColor Green
        $approvedCount++
    } catch {
        Write-Host "  Failed to approve: $id - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "SUCCESS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Created: $successCount reviews" -ForegroundColor Green
Write-Host "Approved: $approvedCount reviews" -ForegroundColor Green

Write-Host "`nStep 3: Verifying..." -ForegroundColor Yellow
try {
    $result = Invoke-RestMethod -Uri "$BASE_URL/courses/$COURSE_ID/reviews"
    Write-Host "  Visible reviews on frontend: $($result.data.Count)" -ForegroundColor Green
    $result.data | ForEach-Object {
        Write-Host "    - $($_.reviewerName): $($_.rating) stars" -ForegroundColor Gray
    }
} catch {
    Write-Host "  Failed to verify: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "DONE! Reviews are now live." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan



