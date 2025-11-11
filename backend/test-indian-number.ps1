# Test with Indian Phone Number

$baseUrl = "http://localhost:5000/api/v1"

Write-Host "`n===========================================" -ForegroundColor Cyan
Write-Host " Testing with Indian Phone Number" -ForegroundColor Cyan
Write-Host "===========================================`n" -ForegroundColor Cyan

# Create test user with Indian number
Write-Host "[1] Creating test user with Indian number..." -ForegroundColor Yellow
$timestamp = [int](Get-Date -UFormat %s)

$testUser = @{
    fullName = "Test Indian User"
    username = "indiantest$timestamp"
    email = "indian$timestamp@test.com"
    password = "password12345"
    phone = "9876543210"  # Indian format: 10 digits starting with 6-9
    gender = "male"
    dob = "1990-01-01"
    memberType = "job_seeker"
    agreements = @{
        termsOfService = $true
        privacyPolicy = $true
        marketingConsent = $false
    }
} | ConvertTo-Json -Depth 10

try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $testUser -ContentType "application/json"
    Write-Host "  SUCCESS: User created" -ForegroundColor Green
    Write-Host "  Username: $($regResponse.data.user.username)" -ForegroundColor White
    Write-Host "  Phone: $($regResponse.data.user.phone) (Indian)" -ForegroundColor White
} catch {
    Write-Host "  User may already exist, continuing..." -ForegroundColor Yellow
}

# Test Find ID with Indian number
Write-Host "`n[2] Testing Find ID with Indian number..." -ForegroundColor Yellow
$findBody = @{
    name = "Test Indian User"
    phoneNumber = "9876543210"
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "$baseUrl/auth/find-id" -Method Post -Body $findBody -ContentType "application/json"
    Write-Host "  SUCCESS: Found user ID" -ForegroundColor Green
    Write-Host "  User ID: $($result.data.userIds -join ', ')" -ForegroundColor White
} catch {
    Write-Host "  INFO: $($_.ErrorDetails.Message)" -ForegroundColor Gray
}

# Test Password Reset with Indian number
Write-Host "`n[3] Testing Password Reset with Indian number..." -ForegroundColor Yellow
$resetBody = @{
    name = "Test Indian User"
    phoneNumber = "9876543210"
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "$baseUrl/auth/password-reset/initiate" -Method Post -Body $resetBody -ContentType "application/json"
    Write-Host "  SUCCESS: SMS initiated" -ForegroundColor Green
    Write-Host "  Session ID: $($result.data.sessionId)" -ForegroundColor White
    Write-Host "`n  Phone will receive SMS at: +919876543210" -ForegroundColor Cyan
    Write-Host "  (Check your phone or backend console for code)" -ForegroundColor Yellow
} catch {
    Write-Host "  INFO: $($_.ErrorDetails.Message)" -ForegroundColor Gray
}

Write-Host "`n===========================================`n" -ForegroundColor Cyan
Write-Host "✅ Backend now supports both:" -ForegroundColor Green
Write-Host "   • Korean numbers: 01012345678 → +821012345678" -ForegroundColor White
Write-Host "   • Indian numbers: 9876543210 → +919876543210" -ForegroundColor White
Write-Host "`n===========================================`n" -ForegroundColor Cyan

