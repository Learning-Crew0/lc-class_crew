# Test Announcement API

Write-Host "=== Testing Announcement API ===" -ForegroundColor Cyan

# Step 1: Login as admin
Write-Host "`n1. Logging in as admin..." -ForegroundColor Yellow
$loginBody = @{
    username = "classcrew_admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/admin/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Create announcement (JSON without files)
Write-Host "`n2. Creating announcement..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$announcementBody = @{
    title = "Important Course Update"
    content = "Please note that the upcoming training schedule has been updated. Check the new dates on our website."
    category = "notice"
    authorName = "Admin Team"
    tags = "training,schedule,update"
    isImportant = "true"
    isPinned = "false"
    status = "published"
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/announcements" -Method POST -Headers $headers -Body $announcementBody
    Write-Host "✓ Announcement created successfully!" -ForegroundColor Green
    Write-Host "Announcement ID: $($createResponse.data._id)" -ForegroundColor Gray
    $announcementId = $createResponse.data._id
} catch {
    Write-Host "✗ Create failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Get all announcements
Write-Host "`n3. Getting all announcements..." -ForegroundColor Yellow
try {
    $getAllResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/announcements?page=1&limit=10&status=published" -Method GET
    Write-Host "✓ Retrieved announcements: $($getAllResponse.data.pagination.totalAnnouncements) total" -ForegroundColor Green
} catch {
    Write-Host "✗ Get all failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Get announcement by ID
Write-Host "`n4. Getting announcement by ID..." -ForegroundColor Yellow
try {
    $getByIdResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/announcements/$announcementId" -Method GET
    Write-Host "✓ Retrieved announcement: $($getByIdResponse.data.title)" -ForegroundColor Green
} catch {
    Write-Host "✗ Get by ID failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== All tests completed! ===" -ForegroundColor Cyan

