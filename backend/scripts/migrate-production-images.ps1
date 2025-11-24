# PowerShell script to migrate temp images on production
# Usage: .\scripts\migrate-production-images.ps1

Write-Host "🚀 Migrating temp images on production..." -ForegroundColor Cyan
Write-Host ""

# Get admin token
$token = Read-Host "Enter your admin token (from browser localStorage or login response)"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "❌ Error: Token is required!" -ForegroundColor Red
    exit 1
}

$url = "https://class-crew.onrender.com/api/v1/admin/migrations/temp-images"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "📡 Calling migration API..." -ForegroundColor Yellow
Write-Host "URL: $url" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -ErrorAction Stop
    
    Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Results:" -ForegroundColor Cyan
    Write-Host "  • Migrated: $($response.data.migrated) courses" -ForegroundColor White
    Write-Host "  • Cleared: $($response.data.cleared) missing images" -ForegroundColor White
    Write-Host "  • Failed: $($response.data.failed) courses" -ForegroundColor White
    Write-Host "  • Total Processed: $($response.data.totalProcessed)" -ForegroundColor White
    Write-Host ""
    
    if ($response.data.details -and $response.data.details.Count -gt 0) {
        Write-Host "📝 Details:" -ForegroundColor Cyan
        $i = 1
        foreach ($detail in $response.data.details) {
            Write-Host ""
            Write-Host "  $i. $($detail.title) ($($detail.id))" -ForegroundColor White
            Write-Host "     Status: $($detail.status)" -ForegroundColor $(if ($detail.status -eq "success") { "Green" } else { "Yellow" })
            
            if ($detail.changes) {
                foreach ($change in $detail.changes) {
                    Write-Host "     • $($change.field): $($change.reason)" -ForegroundColor Gray
                    if ($change.newUrl) {
                        Write-Host "       → $($change.newUrl)" -ForegroundColor DarkGray
                    }
                }
            }
            
            if ($detail.error) {
                Write-Host "     Error: $($detail.error)" -ForegroundColor Red
            }
            
            $i++
        }
    }
    
    Write-Host ""
    Write-Host "🎉 Done! Refresh your frontend to see the changes." -ForegroundColor Green
    
} catch {
    Write-Host "❌ Migration failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  • Check that your token is valid (not expired)" -ForegroundColor Gray
    Write-Host "  • Make sure you're logged in as an admin" -ForegroundColor Gray
    Write-Host "  • Verify the backend is deployed and running" -ForegroundColor Gray
    exit 1
}





