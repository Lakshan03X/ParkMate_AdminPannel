# DynamoDB Setup Guide for ParkMate Admin Portal

## 📊 Table Overview

**Table Name:** `AdminUsers`  
**Purpose:** Store admin user credentials and roles for ParkMate system

---

## 🛠️ Step 1: Create DynamoDB Table

### Option A: Using AWS Console (Recommended for Beginners)

1. **Sign in to AWS Console**
   - Go to https://console.aws.amazon.com
   - Navigate to **DynamoDB** service

2. **Create Table**
   - Click **"Create table"** button
   
3. **Configure Table Settings**
   ```
   Table name: AdminUsers
   Partition key: email (String)
   
   Table settings: Use default settings
   Read/write capacity: On-demand (recommended) OR Provisioned (5 RCU, 5 WCU for testing)
   ```

4. **Create Table**
   - Click **"Create table"**
   - Wait for status to show **"Active"** (30-60 seconds)

---

### Option B: Using AWS CLI

```bash
aws dynamodb create-table \
    --table-name AdminUsers \
    --attribute-definitions AttributeName=email,AttributeType=S \
    --key-schema AttributeName=email,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region YOUR_AWS_REGION
```

Replace `YOUR_AWS_REGION` with your region (e.g., `us-east-1`, `ap-south-1`)

---

## 📝 Step 2: Table Schema

Each user record should have the following structure:

```json
{
  "email": "admin@parkmate.com",
  "password": "$2b$10$hashed_password_here",
  "role": "SUPER_ADMIN",
  "name": "John Doe",
  "status": "ACTIVE",
  "createdAt": "2026-02-11T10:00:00.000Z",
  "lastLogin": "2026-02-11T10:30:00.000Z"
}
```

### Field Descriptions:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | String | ✅ | User's email (Primary Key, must be unique) |
| `password` | String | ✅ | Bcrypt hashed password |
| `role` | String | ✅ | User role: `SUPER_ADMIN`, `MUNICIPAL_ADMIN`, or `FINE_CHECKER` |
| `name` | String | ✅ | User's full name |
| `status` | String | ✅ | Account status: `ACTIVE` or `INACTIVE` |
| `createdAt` | String | ✅ | ISO 8601 timestamp when user was created |
| `lastLogin` | String | ❌ | ISO 8601 timestamp of last login (auto-updated) |

---

## 🔐 Step 3: Generate Password Hash

Before inserting users, you need to hash their passwords.

### Using the Helper Script:

1. **Navigate to scripts folder:**
   ```bash
   cd backend/scripts
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run password generator:**
   ```bash
   npm run generate-hash
   ```

4. **Enter password when prompted:**
   ```
   Enter password to hash: SuperAdmin@123
   ```

5. **Copy the hashed output:**
   ```
   Hashed Password (copy this):
   $2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNO
   ```

---

## 👤 Step 4: Insert Initial Super Admin

### Option A: Using AWS Console

1. **Go to DynamoDB Console**
   - Select **AdminUsers** table
   - Click **"Explore table items"**

2. **Create Item**
   - Click **"Create item"**
   - Switch to **JSON view**

3. **Paste this JSON** (replace values with your data):
   ```json
   {
     "email": "superadmin@parkmate.com",
     "password": "$2b$10$YOUR_HASHED_PASSWORD_HERE",
     "role": "SUPER_ADMIN",
     "name": "Super Administrator",
     "status": "ACTIVE",
     "createdAt": "2026-02-11T10:00:00.000Z"
   }
   ```

4. **Create Item**
   - Click **"Create item"**

---

### Option B: Using AWS CLI

```bash
aws dynamodb put-item \
    --table-name AdminUsers \
    --item '{
      "email": {"S": "superadmin@parkmate.com"},
      "password": {"S": "$2b$10$YOUR_HASHED_PASSWORD_HERE"},
      "role": {"S": "SUPER_ADMIN"},
      "name": {"S": "Super Administrator"},
      "status": {"S": "ACTIVE"},
      "createdAt": {"S": "2026-02-11T10:00:00.000Z"}
    }' \
    --region YOUR_AWS_REGION
```

---

## 📋 Step 5: Insert Additional Test Users (Optional)

### Municipal Admin Example:
```json
{
  "email": "municipal@parkmate.com",
  "password": "$2b$10$YOUR_HASHED_PASSWORD_HERE",
  "role": "MUNICIPAL_ADMIN",
  "name": "Municipal Administrator",
  "status": "ACTIVE",
  "createdAt": "2026-02-11T10:00:00.000Z"
}
```

### Fine Checker Example:
```json
{
  "email": "checker@parkmate.com",
  "password": "$2b$10$YOUR_HASHED_PASSWORD_HERE",
  "role": "FINE_CHECKER",
  "name": "Fine Checker",
  "status": "ACTIVE",
  "createdAt": "2026-02-11T10:00:00.000Z"
}
```

---

## 🔍 Step 6: Verify Data

### Using AWS Console:
1. Go to **DynamoDB Console**
2. Select **AdminUsers** table
3. Click **"Explore table items"**
4. You should see your inserted users

### Using AWS CLI:
```bash
aws dynamodb scan \
    --table-name AdminUsers \
    --region YOUR_AWS_REGION
```

---

## ⚙️ Step 7: Set Up IAM Permissions for Lambda

Your Lambda function needs permission to access DynamoDB.

### Create IAM Policy:

1. Go to **IAM Console** → **Policies**
2. Click **"Create policy"**
3. Select **JSON** tab
4. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:PutItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:YOUR_REGION:YOUR_ACCOUNT_ID:table/AdminUsers"
    }
  ]
}
```

5. Name it: `ParkMate-DynamoDB-Access`
6. **Attach this policy to your Lambda execution role** (next step)

---

## ✅ Success Checklist

- [ ] DynamoDB table `AdminUsers` created
- [ ] Super Admin user inserted with hashed password
- [ ] Test users inserted (optional)
- [ ] IAM policy created for Lambda access
- [ ] Data verified in DynamoDB Console

---

## 🚨 Common Issues & Solutions

### Issue: "User not found" error during login
**Solution:** Verify email is stored in lowercase in DynamoDB

### Issue: "Invalid password" error
**Solution:** Regenerate password hash and update DynamoDB item

### Issue: Lambda can't access DynamoDB
**Solution:** Check IAM role attached to Lambda has DynamoDB permissions

### Issue: CORS errors in frontend
**Solution:** Ensure API Gateway has CORS enabled (covered in API Gateway setup)

---

## 📞 Next Steps

After completing DynamoDB setup:
1. ✅ **Done:** DynamoDB table created and populated
2. ⏭️ **Next:** Set up Lambda function (see `setup-lambda.md`)
3. ⏭️ **Then:** Configure API Gateway (see `setup-api-gateway.md`)