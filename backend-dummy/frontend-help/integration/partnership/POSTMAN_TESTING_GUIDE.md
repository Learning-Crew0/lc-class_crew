# 🧪 Partnership - Postman Testing Guide

## Test 1: Get All Partnerships (Admin)
**Method:** `GET`  
**URL:** `{{BASE_URL}}/partnerships`  
**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

## Test 2: Submit Partnership Request
**Method:** `POST`  
**URL:** `{{BASE_URL}}/partnerships`

**Body (JSON):**
```json
{
  "organizationName": "Tech Corporation Inc",
  "contactPerson": "Jane Smith",
  "email": "jane.smith@techcorp.com",
  "phone": "9876543210",
  "partnershipType": "corporate",
  "description": "We are interested in providing training programs for our 500+ employees. Looking for customized courses in web development, data science, and cloud computing."
}
```

**Tests Script:**
```javascript
pm.test("Partnership request submitted", function () {
    var jsonData = pm.response.json();
    pm.environment.set("PARTNERSHIP_ID", jsonData.data._id);
});
```

## Test 3: Get Single Partnership
**Method:** `GET`  
**URL:** `{{BASE_URL}}/partnerships/{{PARTNERSHIP_ID}}`

## Test 4: Update Partnership Status (Admin)
**Method:** `PUT`  
**URL:** `{{BASE_URL}}/partnerships/{{PARTNERSHIP_ID}}`  
**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body:**
```json
{
  "status": "approved",
  "notes": "Approved for corporate training program"
}
```

## Test 5: Delete Partnership (Admin)
**Method:** `DELETE`  
**URL:** `{{BASE_URL}}/partnerships/{{PARTNERSHIP_ID}}`

---

**Sample Partnerships:**
```json
{"organizationName": "Startup XYZ", "partnershipType": "affiliate"}
{"organizationName": "University ABC", "partnershipType": "educational"}
```

**Total Tests:** 5 | **Time:** 5 minutes

