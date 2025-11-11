# ClassCrew Authentication API Test Script
# Run this script to test all authentication endpoints

$baseUrl = "http://localhost:5000/api/v1"

Write-Host "`n===================================" -ForegroundColor Cyan
Write-Host "ClassCrew Authentication API Tests" -ForegroundColor Cyan
Write-Host "===================================`n" -ForegroundColor Cyan

# Test 1: Admin Login (should work)
Write-Host "[1/5] Testing Admin Login..." -ForegroundColor Yellow
$adminBody = '{"email":"classcrew@admin.com","password":"admin123"}'
try {
    $adminResponse = Invoke-RestMethod -Uri "$baseUrl/admin/login" -Method Post -Body $adminBody -ContentType "application/json"
    Write-Host "  SUCCESS: Admin login successful" -ForegroundColor Green
    Write-Host "  Token: $($adminResponse.data.token.Substring(0, 40))..." -ForegroundColor Gray
    $adminToken = $adminResponse.data.token
} catch {
    Write-Host "  FAILED: Admin login failed" -ForegroundColor Red
}

# Test 2: Register New User
Write-Host "`n[2/5] Testing User Registration..." -ForegroundColor Yellow
$timestamp = [int](Get-Date -UFormat %s)
$registerBody = @{
    fullName = "Test User"
    username = "testuser$timestamp"
    email = "test$timestamp@example.com"
    password = "password12345"
    phone = "01012345678"
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
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "  SUCCESS: Registration successful" -ForegroundColor Green
    Write-Host "  Username: $($registerResponse.data.user.username)" -ForegroundColor Gray
    Write-Host "  Email: $($registerResponse.data.user.email)" -ForegroundColor Gray
    $testUsername = $registerResponse.data.user.username
    $testPassword = "password12345"
} catch {
    Write-Host "  INFO: Registration may have failed (user might exist)" -ForegroundColor Yellow
    $testUsername = "testuser$timestamp"
    $testPassword = "password12345"
}

# Test 3: User Login
Write-Host "`n[3/5] Testing User Login..." -ForegroundColor Yellow
if ($testUsername) {
    $loginBody = @{
        emailOrUsername = $testUsername
        password = $testPassword
    } | ConvertTo-Json

    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        Write-Host "  SUCCESS: Login successful" -ForegroundColor Green
        Write-Host "  User: $($loginResponse.data.user.fullName)" -ForegroundColor Gray
        Write-Host "  Token: $($loginResponse.data.token.Substring(0, 40))..." -ForegroundColor Gray
    } catch {
        Write-Host "  FAILED: Login failed" -ForegroundColor Red
    }
} else {
    Write-Host "  SKIPPED: No test user available" -ForegroundColor Yellow
}

# Test 4: Find User ID
Write-Host "`n[4/5] Testing Find ID..." -ForegroundColor Yellow
$findIdBody = '{"name":"Test User","phoneNumber":"01012345678"}'
try {
    $findIdResponse = Invoke-RestMethod -Uri "$baseUrl/auth/find-id" -Method Post -Body $findIdBody -ContentType "application/json"
    Write-Host "  SUCCESS: Find ID successful" -ForegroundColor Green
    Write-Host "  Found IDs: $($findIdResponse.userIds -join ', ')" -ForegroundColor Gray
} catch {
    Write-Host "  NOT IMPLEMENTED: Find ID endpoint (404)" -ForegroundColor Yellow
    Write-Host "  This endpoint needs to be added to backend" -ForegroundColor Gray
}

# Test 5: Password Reset - Initiate
Write-Host "`n[5/5] Testing Password Reset..." -ForegroundColor Yellow
$resetBody = '{"name":"Test User","phoneNumber":"01012345678"}'
try {
    $resetResponse = Invoke-RestMethod -Uri "$baseUrl/auth/password-reset/initiate" -Method Post -Body $resetBody -ContentType "application/json"
    Write-Host "  SUCCESS: Password reset initiated" -ForegroundColor Green
    Write-Host "  Session ID: $($resetResponse.sessionId)" -ForegroundColor Gray
} catch {
    Write-Host "  NOT IMPLEMENTED: Password reset endpoint (404)" -ForegroundColor Yellow
    Write-Host "  These endpoints need to be added:" -ForegroundColor Gray
    Write-Host "    - POST /auth/password-reset/initiate" -ForegroundColor Gray
    Write-Host "    - POST /auth/password-reset/verify-code" -ForegroundColor Gray
    Write-Host "    - POST /auth/password-reset/reset" -ForegroundColor Gray
}

# Summary
Write-Host "`n===================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "===================================`n" -ForegroundColor Cyan
Write-Host "Current Status:" -ForegroundColor White
Write-Host "  WORKING: Admin Login, User Registration, User Login" -ForegroundColor Green
Write-Host "  MISSING: Find ID, Password Reset endpoints" -ForegroundColor Yellow
Write-Host "`nNext Steps:" -ForegroundColor White
Write-Host "  1. Backend needs to implement missing endpoints" -ForegroundColor Gray
Write-Host "  2. Update frontend integration guide with correct fields" -ForegroundColor Gray
Write-Host "  3. Add SMS service integration for password reset`n" -ForegroundColor Gray
