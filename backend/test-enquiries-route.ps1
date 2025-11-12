# Test Enquiries Route
Write-Host "`n🧪 Testing Enquiries API Endpoint" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Test data
$testData = @{
    name = "Test User"
    email = "test@example.com"
    phone = "01012345678"
    category = "General Question"
    subject = "Test Enquiry"
    message = "This is a test enquiry message with more than 10 characters."
    agreeToTerms = $true
} | ConvertTo-Json

# Test local server (assuming it runs on port 5000)
$localUrl = "http://localhost:5000/api/v1/enquiries"

Write-Host "Testing LOCAL server..." -ForegroundColor Yellow
Write-Host "URL: $localUrl`n" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri $localUrl -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $testData `
        -ErrorAction Stop
    
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Ticket Number: $($response.data.ticketNumber)" -ForegroundColor White
    Write-Host "Status: $($response.data.status)" -ForegroundColor White
    Write-Host "Message: $($response.message)" -ForegroundColor White
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorMessage = $_.ErrorDetails.Message
    
    Write-Host "❌ FAILED!" -ForegroundColor Red
    Write-Host "Status Code: $statusCode" -ForegroundColor Yellow
    
    if ($statusCode -eq 404) {
        Write-Host "`n⚠️  Route Not Found!" -ForegroundColor Red
        Write-Host "  Possible issues:" -ForegroundColor Yellow
        Write-Host "  1. Server not running on port 5000" -ForegroundColor Gray
        Write-Host "  2. Routes not properly loaded" -ForegroundColor Gray
        Write-Host "  3. Need to restart the server" -ForegroundColor Gray
    } elseif ($statusCode -eq 400) {
        Write-Host "`n⚠️  Validation Error (route exists but data is invalid):" -ForegroundColor Yellow
        Write-Host $errorMessage -ForegroundColor Gray
    } else {
        Write-Host "`nError Details:" -ForegroundColor Yellow
        Write-Host $errorMessage -ForegroundColor Gray
    }
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Test completed`n" -ForegroundColor Cyan

