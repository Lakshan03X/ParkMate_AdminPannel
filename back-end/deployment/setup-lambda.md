# AWS Lambda Setup Guide for ParkMate Admin Login

## 🎯 Overview

This guide will help you deploy the login Lambda function for ParkMate Admin Portal.

---

## 📦 Step 1: Prepare Lambda Deployment Package

### 1.1 Navigate to Lambda Directory

```bash
cd backend/lambda
```

### 1.2 Install Dependencies

```bash
npm install
```

This will install:

- `bcryptjs` - For password hashing/verification
- `jsonwebtoken` - For JWT token generation

### 1.3 Create Deployment Package

**On Linux/Mac:**

```bash
zip -r function.zip . -x "*.git*" "package.json" "package-lock.json"
```

**On Windows (PowerShell):**

```powershell
Get-ChildItem -Path . -Recurse -Exclude "package.json","package-lock.json" | Where-Object { $_.FullName -notmatch '\.git' } | Compress-Archive -DestinationPath function.zip -Force
```

Your `function.zip` should contain:

- `loginFunction.js`
- `node_modules/` (with bcryptjs and jsonwebtoken)

---

## 🚀 Step 2: Create Lambda Function

### Option A: Using AWS Console (Recommended)

1. **Go to AWS Lambda Console**
   - Navigate to https://console.aws.amazon.com/lambda
   - Select your region (same as DynamoDB)

2. **Create Function**
   - Click **"Create function"**
   - Choose **"Author from scratch"**

3. **Configure Basic Settings**

   ```
   Function name: ParkMate-Login
   Runtime: Node.js 18.x (or latest available)
   Architecture: x86_64
   ```

4. **Create Execution Role**
   - Select **"Create a new role with basic Lambda permissions"**
   - Role name: `ParkMate-Login-Role`

5. **Create Function**
   - Click **"Create function"**

---

### Option B: Using AWS CLI

```bash
# First, create the execution role
aws iam create-role \
    --role-name ParkMate-Login-Role \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": {"Service": "lambda.amazonaws.com"},
        "Action": "sts:AssumeRole"
      }]
    }'

# Attach basic Lambda execution policy
aws iam attach-role-policy \
    --role-name ParkMate-Login-Role \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Create the Lambda function
aws lambda create-function \
    --function-name ParkMate-Login \
    --runtime nodejs18.x \
    --role arn:aws:iam::YOUR_ACCOUNT_ID:role/ParkMate-Login-Role \
    --handler loginFunction.handler \
    --zip-file fileb://function.zip \
    --region YOUR_REGION
```

---

## 🔐 Step 3: Configure IAM Permissions

Your Lambda needs DynamoDB access. Attach the policy you created earlier.

### Using AWS Console:

1. **Go to IAM Console**
   - Navigate to **Roles**
   - Find `ParkMate-Login-Role`

2. **Attach Policy**
   - Click **"Attach policies"**
   - Search for `ParkMate-DynamoDB-Access`
   - Select and **Attach**

### Using AWS CLI:

```bash
aws iam attach-role-policy \
    --role-name ParkMate-Login-Role \
    --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/ParkMate-DynamoDB-Access
```

---

## ⚙️ Step 4: Upload Lambda Code

### Using AWS Console:

1. **Open your Lambda function** (`ParkMate-Login`)
2. **Upload Code**
   - In the **Code** tab
   - Click **"Upload from"** → **".zip file"**
   - Upload your `function.zip`
   - Click **"Save"**

### Using AWS CLI:

```bash
aws lambda update-function-code \
    --function-name ParkMate-Login \
    --zip-file fileb://function.zip \
    --region YOUR_REGION
```

---

## 🔧 Step 5: Configure Environment Variables

### Using AWS Console:

1. **Go to Configuration** → **Environment variables**
2. **Edit** and add the following:

```
USERS_TABLE = AdminUsers
JWT_SECRET = your-super-secret-jwt-key-CHANGE-THIS-IN-PRODUCTION
NODE_ENV = production
```

⚠️ **IMPORTANT:** Change `JWT_SECRET` to a strong random string!

### Generate a Strong JWT Secret:

```bash
# On Linux/Mac
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Using AWS CLI:

```bash
aws lambda update-function-configuration \
    --function-name ParkMate-Login \
    --environment Variables={USERS_TABLE=AdminUsers,JWT_SECRET=your-generated-secret-here,NODE_ENV=production} \
    --region YOUR_REGION
```

---

## ⏱️ Step 6: Adjust Timeout and Memory

### Using AWS Console:

1. **Go to Configuration** → **General configuration**
2. **Edit:**
   ```
   Memory: 256 MB
   Timeout: 30 seconds
   ```

### Using AWS CLI:

```bash
aws lambda update-function-configuration \
    --function-name ParkMate-Login \
    --timeout 30 \
    --memory-size 256 \
    --region YOUR_REGION
```

---

## 🧪 Step 7: Test the Lambda Function

### Using AWS Console:

1. **Go to Test tab**
2. **Create Test Event**
   - Event name: `LoginTest`
   - Template: Choose `hello-world`
   - Replace with:

```json
{
  "httpMethod": "POST",
  "body": "{\"email\":\"superadmin@parkmate.com\",\"password\":\"YourActualPassword\"}"
}
```

3. **Click Test**
4. **Expected Response:**

```json
{
  "statusCode": 200,
  "headers": { ... },
  "body": "{\"message\":\"Login successful\",\"token\":\"eyJhbGc...\",\"role\":\"SUPER_ADMIN\",\"name\":\"Super Administrator\",\"email\":\"superadmin@parkmate.com\"}"
}
```

---

## 📊 Step 8: Monitor Lambda Logs

### Using AWS Console:

1. **Go to Monitor** → **Logs**
2. **View CloudWatch Logs**
   - Check for any errors
   - Verify execution logs

### Using AWS CLI:

```bash
aws logs tail /aws/lambda/ParkMate-Login --follow
```

---

## 🔄 Step 9: Update Lambda Code (When Needed)

When you make changes to `loginFunction.js`:

**On Linux/Mac:**

```bash
# 1. Navigate to lambda directory
cd backend/lambda

# 2. Install/update dependencies if needed
npm install

# 3. Create new deployment package
zip -r function.zip . -x "*.git*" "package.json" "package-lock.json"

# 4. Update Lambda function
aws lambda update-function-code \
    --function-name ParkMate-Login \
    --zip-file fileb://function.zip \
    --region YOUR_REGION
```

**On Windows (PowerShell):**

```powershell
# 1. Navigate to lambda directory
cd backend/lambda

# 2. Install/update dependencies if needed
npm install

# 3. Create new deployment package
Get-ChildItem -Path . -Recurse -Exclude "package.json","package-lock.json" | Where-Object { $_.FullName -notmatch '\.git' } | Compress-Archive -DestinationPath function.zip -Force

# 4. Update Lambda function
aws lambda update-function-code `
    --function-name ParkMate-Login `
    --zip-file fileb://function.zip `
    --region YOUR_REGION
```

---

## ✅ Success Checklist

- [ ] Lambda function created (`ParkMate-Login`)
- [ ] Runtime set to Node.js 18.x
- [ ] Code uploaded (function.zip)
- [ ] IAM role has DynamoDB permissions
- [ ] Environment variables configured
- [ ] Timeout set to 30 seconds
- [ ] Memory set to 256 MB
- [ ] Test event executed successfully
- [ ] CloudWatch logs show no errors

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module 'bcryptjs'"

**Solution:** Make sure you ran `npm install` before creating function.zip

### Issue: "User is not authorized to perform: dynamodb:GetItem"

**Solution:** Attach DynamoDB policy to Lambda execution role

### Issue: "Task timed out after 3.00 seconds"

**Solution:** Increase timeout to 30 seconds in Configuration

### Issue: Test returns 401 "Invalid email or password"

**Solution:**

1. Verify email exists in DynamoDB
2. Verify password hash is correct
3. Check DynamoDB table name in environment variables

---

## 📞 Next Steps

After completing Lambda setup:

1. ✅ **Done:** DynamoDB configured
2. ✅ **Done:** Lambda function deployed
3. ⏭️ **Next:** Set up API Gateway (see `setup-api-gateway.md`)

---

## 🔍 Testing Checklist

Test these scenarios:

### ✅ Valid Login

```json
{
  "email": "superadmin@parkmate.com",
  "password": "CorrectPassword"
}
```

Expected: 200 with token

### ❌ Invalid Password

```json
{
  "email": "superadmin@parkmate.com",
  "password": "WrongPassword"
}
```

Expected: 401 "Invalid email or password"

### ❌ Non-existent User

```json
{
  "email": "nonexistent@parkmate.com",
  "password": "AnyPassword"
}
```

Expected: 401 "Invalid email or password"

### ❌ Missing Fields

```json
{
  "email": "superadmin@parkmate.com"
}
```

Expected: 400 "Email and password are required"

### ❌ Inactive User

Create a test user with `"status": "INACTIVE"` and try to login.
Expected: 403 "Your account has been deactivated"
