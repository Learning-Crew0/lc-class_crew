# Training Schedule & Cart Flow Test Script
# This script demonstrates the complete flow: Create Schedule → Add to Cart

$baseUrl = "http://localhost:5000/api/v1"

Write-Host "`n[TEST] TRAINING SCHEDULE & CART FLOW`n" -ForegroundColor Cyan

# ============================================================
# STEP 1: Login as Admin
# ============================================================
Write-Host "[Step 1] Admin Login..." -ForegroundColor Yellow

$adminLogin = @{
    email = "classcrew@admin.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "$baseUrl/admin/login" `
        -Method POST `
        -Body $adminLogin `
        -ContentType "application/json"
    
    $adminToken = $adminResponse.data.token
    Write-Host "[OK] Admin logged in successfully" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Admin login failed: $_" -ForegroundColor Red
    exit 1
}

# ============================================================
# STEP 2: Login as User
# ============================================================
Write-Host "`n[Step 2] User Login..." -ForegroundColor Yellow

$userLogin = @{
    emailOrUsername = "user@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $userResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -Body $userLogin `
        -ContentType "application/json"
    
    $userToken = $userResponse.data.token
    Write-Host "[OK] User logged in successfully" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] User login failed: $_" -ForegroundColor Red
    exit 1
}

# ============================================================
# STEP 3: Get a Course
# ============================================================
Write-Host "`n[Step 3] Getting a course..." -ForegroundColor Yellow

try {
    $coursesResponse = Invoke-RestMethod -Uri "$baseUrl/courses?limit=1" -Method GET
    
    if ($coursesResponse.data.courses.Count -eq 0) {
        Write-Host "[FAIL] No courses found. Please create a course first." -ForegroundColor Red
        exit 1
    }
    
    $courseId = $coursesResponse.data.courses[0]._id
    $courseName = $coursesResponse.data.courses[0].title
    Write-Host "[OK] Found course: $courseName" -ForegroundColor Green
    Write-Host "     Course ID: $courseId" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Failed to get courses: $_" -ForegroundColor Red
    exit 1
}

# ============================================================
# STEP 4: Create Training Schedules (Admin)
# ============================================================
Write-Host "`n[Step 4] Creating training schedules..." -ForegroundColor Yellow

$schedules = @(
    @{
        scheduleName = "January 2025 - Week 3"
        startDate = "2025-01-15"
        endDate = "2025-01-16"
        availableSeats = 30
        status = "upcoming"
        isActive = $true
    },
    @{
        scheduleName = "January 2025 - Week 4"
        startDate = "2025-01-22"
        endDate = "2025-01-23"
        availableSeats = 25
        status = "upcoming"
        isActive = $true
    },
    @{
        scheduleName = "February 2025 - Week 1"
        startDate = "2025-02-05"
        endDate = "2025-02-06"
        availableSeats = 30
        status = "upcoming"
        isActive = $true
    }
)

$scheduleIds = @()

foreach ($schedule in $schedules) {
    $scheduleBody = $schedule | ConvertTo-Json
    
    try {
        $scheduleResponse = Invoke-RestMethod `
            -Uri "$baseUrl/courses/$courseId/training-schedules" `
            -Method POST `
            -Headers @{ Authorization = "Bearer $adminToken" } `
            -Body $scheduleBody `
            -ContentType "application/json"
        
        $scheduleId = $scheduleResponse.data._id
        $scheduleIds += $scheduleId
        Write-Host "  [OK] Created: $($schedule.scheduleName)" -ForegroundColor Green
    } catch {
        Write-Host "  [SKIP] Schedule may already exist" -ForegroundColor Yellow
    }
}

if ($scheduleIds.Count -eq 0) {
    Write-Host "`n[INFO] No schedules were created. Trying to fetch existing ones..." -ForegroundColor Yellow
    
    try {
        $existingSchedules = Invoke-RestMethod -Uri "$baseUrl/courses/$courseId/training-schedules" -Method GET
        if ($existingSchedules.data.Count -gt 0) {
            $scheduleIds += $existingSchedules.data[0]._id
            Write-Host "[OK] Using existing schedule: $($existingSchedules.data[0].scheduleName)" -ForegroundColor Green
        }
    } catch {
        Write-Host "[FAIL] Could not fetch existing schedules: $_" -ForegroundColor Red
        exit 1
    }
}

$selectedScheduleId = $scheduleIds[0]

# ============================================================
# STEP 5: Get Available Schedules (User View)
# ============================================================
Write-Host "`n[Step 5] User viewing available schedules..." -ForegroundColor Yellow

try {
    $availableSchedules = Invoke-RestMethod -Uri "$baseUrl/courses/$courseId/training-schedules" -Method GET
    
    Write-Host "[OK] Available schedules:" -ForegroundColor Green
    foreach ($schedule in $availableSchedules.data) {
        $startDate = $schedule.startDate.Substring(0,10)
        $endDate = $schedule.endDate.Substring(0,10)
        Write-Host "   - $($schedule.scheduleName)" -ForegroundColor Cyan
        Write-Host "     Date: $startDate to $endDate" -ForegroundColor Gray
        Write-Host "     Seats: $($schedule.remainingSeats)/$($schedule.availableSeats) available" -ForegroundColor Gray
    }
} catch {
    Write-Host "[FAIL] Failed to get schedules: $_" -ForegroundColor Red
    exit 1
}

# ============================================================
# STEP 6: Add Course to Cart (with Selected Schedule)
# ============================================================
Write-Host "`n[Step 6] Adding course to cart with selected schedule..." -ForegroundColor Yellow

$cartItem = @{
    itemType = "course"
    productId = $courseId
    courseSchedule = $selectedScheduleId
} | ConvertTo-Json

try {
    $cartResponse = Invoke-RestMethod `
        -Uri "$baseUrl/cart/add" `
        -Method POST `
        -Headers @{ Authorization = "Bearer $userToken" } `
        -Body $cartItem `
        -ContentType "application/json"
    
    Write-Host "[OK] Course added to cart successfully!" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Failed to add to cart: $_" -ForegroundColor Red
    exit 1
}

# ============================================================
# STEP 7: View Cart
# ============================================================
Write-Host "`n[Step 7] Viewing cart..." -ForegroundColor Yellow

try {
    $cart = Invoke-RestMethod `
        -Uri "$baseUrl/cart" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $userToken" }
    
    Write-Host "[OK] Cart contents:" -ForegroundColor Green
    Write-Host "   Total items: $($cart.data.items.Count)" -ForegroundColor Cyan
    Write-Host "   Subtotal: $($cart.data.subtotal)" -ForegroundColor Cyan
    
    foreach ($item in $cart.data.items) {
        if ($item.itemType -eq "course") {
            $startDate = $item.courseSchedule.startDate.Substring(0,10)
            $endDate = $item.courseSchedule.endDate.Substring(0,10)
            Write-Host "`n   [Course]" -ForegroundColor Cyan
            Write-Host "      - Title: $($item.course.title)" -ForegroundColor Gray
            Write-Host "      - Schedule: $($item.courseSchedule.scheduleName)" -ForegroundColor Gray
            Write-Host "      - Date: $startDate to $endDate" -ForegroundColor Gray
            Write-Host "      - Price: $($item.priceAtTime)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "[FAIL] Failed to get cart: $_" -ForegroundColor Red
    exit 1
}

# ============================================================
# SUCCESS
# ============================================================
Write-Host "`n[SUCCESS] ALL TESTS PASSED!" -ForegroundColor Green
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "   - Course ID: $courseId" -ForegroundColor Gray
Write-Host "   - Schedule ID: $selectedScheduleId" -ForegroundColor Gray
Write-Host "   - Cart has $($cart.data.items.Count) item(s)" -ForegroundColor Gray
Write-Host "`n[DONE] Training schedule & cart flow working correctly!" -ForegroundColor Green
