# WEBHOOK UPDATE ENDPOINT ISSUE REPORT

## 🚨 **URGENT DATABASE ISSUE ON COMMUNITY JAMEEL WEBSITE**

### **Issue Summary:**

- **CREATE webhooks**: ✅ Working perfectly
- **UPDATE webhooks**: ❌ Failing with database error

### **Error Details:**

```
{
  "success": false,
  "error": "relation \"teamsmenmo\" does not exist"
}
```

### **Testing Results:**

- **CREATE endpoint** `POST /api/mnemo/create-collection-item`: Returns 200 ✅
- **UPDATE endpoint** `POST /api/mnemo/update-collection`: Returns 500 ❌

### **Observed Behavior:**

When an UPDATE webhook is triggered:

1. **Attempt 1** (immediate): 500 error - database issue
2. **Attempt 2** (after 2s): 500 error - same database issue
3. **Attempt 3** (after 4s): 500 error - same database issue
4. **Total time**: ~20 seconds with exponential backoff retries

### **Root Cause:**

The UPDATE endpoint on Community Jameel website is referencing a database table called `"teamsmenmo"` that doesn't exist.

### **Required Fix (Community Jameel Website Side):**

```sql
-- Option 1: Create the missing table
CREATE TABLE teamsmenmo (...);

-- Option 2: Fix the table name reference
-- Change "teamsmenmo" to correct table name (probably "teams_mnemo" or "teams")

-- Option 3: Check for typo in UPDATE endpoint code
-- Verify table name spelling in UPDATE endpoint implementation
```

### **Temporary Workaround:**

None available - this must be fixed on Community Jameel website side.

### **Verification Steps:**

1. Fix the database table issue on Community Jameel website
2. Test UPDATE endpoint with: `./test-webhook-update-curl.sh`
3. Verify UPDATE webhook returns success response
4. Monitor mnemosyne logs for successful UPDATE webhooks

### **Impact:**

- ✅ CREATE operations sync correctly to Community Jameel website
- ❌ UPDATE operations fail to sync (data becomes out of sync)
- 🔄 Webhook retry mechanism works correctly (3 attempts with backoff)

### **Status:**

- **Mnemosyne webhook system**: ✅ Working correctly
- **Community Jameel CREATE endpoint**: ✅ Working correctly
- **Community Jameel UPDATE endpoint**: ❌ Needs database fix
