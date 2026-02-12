# API Gateway Setup Guide for ParkMate Admin Portal

## 🎯 Overview

API Gateway will create a HTTPS endpoint that your React frontend can call to trigger the Lambda login function.

---

## 🚀 Step 1: Create REST API

### Using AWS Console:

1. **Go to API Gateway Console**
   - Navigate to https://console.aws.amazon.com/apigateway

2. **Create API**
   - Click **"Create API"**
   - Choose **"REST API"** (not REST API Private)
   - Click **"Build"**

3. **Configure API**
   ```
   Protocol: REST
   Create new API: New API
   API name: ParkMate-Admin-API
   Description: API for ParkMate Admin Portal authentication
   Endpoint Type: Regional
   ```

4. **Create API**
   - Click **"Create API"**

---

## 📍 Step 2: Create /login Resource

1. **Create Resource**
   - Click **"Actions"** → **"Create Resource"**

2. **Configure Resource**
   ```
   Resource Name: login
   Resource Path: /login
   ☑️ Enable API Gateway CORS
   ```

3. **Create Resource**

---

## 🔧 Step 3: Create POST Method

1. **Select /login resource**

2. **Create Method**
   - Click **"Actions"** → **"Create Method"**
   - Select **"POST"** from dropdown
   - Click the checkmark ✓

3. **Setup POST Method**
   ```
   Integration type: Lambda Function
   Use Lambda Proxy integration: ☑️ (IMPORTANT!)
   Lambda Region: YOUR_REGION (same as Lambda function)
   Lambda Function: ParkMate-Login
   ```

4. **Save**
   - Click **"Save"**
   - Click **"OK"** when prompted to give API Gateway permission to invoke Lambda

---

## 🌐 Step 4: Enable CORS

Even though we enabled CORS when creating the resource, let's verify:

1. **Select /login resource**

2. **Enable CORS**
   - Click **"Actions"** → **"Enable CORS"**

3. **Configure CORS**
   ```
   Access-Control-Allow-Origin: * 
   (In production, replace with your frontend domain: https://admin.parkmate.com)
   
   Access-Control-Allow-Headers: 
   Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
   
   Access-Control-Allow-Methods: 
   POST,OPTIONS
   ```

4. **Enable CORS and replace existing CORS headers**
   - Click **"Enable CORS and replace existing CORS headers"**
   - Click **"Yes, replace existing values"**

---

## 🚀 Step 5: Deploy API

1. **Deploy API**
   - Click **"Actions"** → **"Deploy API"**

2. **Deployment Settings**
   ```
   Deployment stage: [New Stage]
   Stage name: prod
   Stage description: Production environment
   Deployment description: Initial deployment
   ```

3. **Deploy**
   - Click **"Deploy"**

4. **Copy Invoke URL**
   - After deployment, you'll see **"Invoke URL"**
   - Copy this URL (looks like):
   ```
   https://abc123def4.execute-api.us-east-1.amazonaws.com/prod
   ```

---

## 📝 Step 6: Test API from Console

1. **Go to Resources** → **POST /login**

2. **Click "TEST"** (lightning bolt icon)

3. **Request Body:**
   ```json
   {
     "email": "superadmin@parkmate.com",
     "password": "YourActualPassword"
   }
   ```

4. **Click Test**

5. **Expected Response (Status 200):**
   ```json
   {
     "message": "Login successful",
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "role": "SUPER_ADMIN",
     "name": "Super Administrator",
     "email": "superadmin@parkmate.com"
   }
   ```

---

## 🔧 Step 7: Configure API Settings (Optional but Recommended)

### 7.1 Enable CloudWatch Logging

1. **Go to Settings** (left sidebar)
2. **CloudWatch log role ARN:** Create an IAM role with CloudWatch permissions
3. **Enable CloudWatch Logs** for your stage

### 7.2 Configure Throttling

1. **Go to Stages** → **prod**
2. **Settings tab**
   ```
   Rate: 100 requests per second
   Burst: 200 requests
   ```

---

## 🧪 Step 8: Test API with cURL

Replace `YOUR_API_URL` with your actual Invoke URL:

```bash
curl -X POST \
  https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "superadmin@parkmate.com",
    "password": "YourActualPassword"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "role": "SUPER_ADMIN",
  "name": "Super Administrator",
  "email": "superadmin@parkmate.com"
}
```

---

## 🧪 Step 9: Test API with Postman

1. **Open Postman**

2. **Create New Request**
   ```
   Method: POST
   URL: https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod/login
   ```

3. **Headers**
   ```
   Content-Type: application/json
   ```

4. **Body** (raw JSON)
   ```json
   {
     "email": "superadmin@parkmate.com",
     "password": "YourActualPassword"
   }
   ```

5. **Send Request**

6. **Verify Response**
   - Status: 200 OK
   - Body contains: token, role, name, email

---

## 🔗 Step 10: Update Frontend Configuration

Now that your API is deployed, update your React app:

1. **Open:** `frontend/src/services/authService.js`

2. **Replace API_ENDPOINT:**
   ```javascript
   const API_ENDPOINT = 'https://abc123def4.execute-api.us-east-1.amazonaws.com/prod';
   ```

3. **Save the file**

---

## 📊 Step 11: Monitor API Usage

### Using AWS Console:

1. **Go to API Gateway** → **Stages** → **prod**
2. **Click on "Logs/Tracing" tab**
3. **View CloudWatch Logs**

### Common Metrics to Monitor:
- **4XXError** - Client errors (bad requests)
- **5XXError** - Server errors (Lambda/backend issues)
- **Count** - Total number of requests
- **Latency** - Response time

---

## 🔄 Step 12: Create Additional Endpoints (Future)

When you need more endpoints (e.g., for user management):

1. **Create New Resource**
   - `/users`, `/dashboard`, etc.

2. **Create Methods**
   - GET, POST, PUT, DELETE as needed

3. **Link to Lambda Functions**

4. **Enable CORS**

5. **Deploy to prod stage**

---

## ✅ Success Checklist

- [ ] REST API created (`ParkMate-Admin-API`)
- [ ] `/login` resource created
- [ ] POST method configured with Lambda integration
- [ ] Lambda Proxy integration enabled
- [ ] CORS enabled
- [ ] API deployed to `prod` stage
- [ ] Invoke URL copied
- [ ] Test from console successful (200 response)
- [ ] Test with cURL successful
- [ ] Frontend `authService.js` updated with API URL

---

## 🚨 Common Issues & Solutions

### Issue: CORS Error in Browser
**Solution:**
1. Ensure CORS is enabled on `/login` resource
2. Check API Gateway CORS headers allow `*` origin
3. Re-deploy API after CORS changes

### Issue: "Missing Authentication Token"
**Solution:**
- Check URL is correct (includes `/prod/login`)
- Verify POST method is created
- Ensure API is deployed

### Issue: 502 Bad Gateway
**Solution:**
- Lambda function returned invalid response format
- Check Lambda logs in CloudWatch
- Ensure Lambda Proxy integration is enabled

### Issue: 403 Forbidden
**Solution:**
- API key required but not provided
- Check if API key requirement is accidentally enabled

### Issue: 500 Internal Server Error
**Solution:**
- Lambda function crashed
- Check Lambda CloudWatch logs
- Verify Lambda has DynamoDB permissions

---

## 🔒 Production Best Practices

When going to production:

### 1. **Custom Domain**
Set up a custom domain instead of the default API Gateway URL:
- Go to **API Gateway** → **Custom domain names**
- Add `api.parkmate.com`
- Create Route 53 record

### 2. **API Keys & Usage Plans** (if needed)
For rate limiting per client:
- Create API Keys
- Create Usage Plans
- Associate with stage

### 3. **Update CORS Origin**
Replace `*` with your actual frontend domain:
```javascript
Access-Control-Allow-Origin: https://admin.parkmate.com
```

### 4. **Enable Request Validation**
Validate requests before reaching Lambda to save costs.

### 5. **Set up Alarms**
Create CloudWatch alarms for:
- High error rates (4XX, 5XX)
- High latency
- Throttling

---

## 📞 Next Steps

After completing API Gateway setup:
1. ✅ **Done:** DynamoDB configured
2. ✅ **Done:** Lambda function deployed
3. ✅ **Done:** API Gateway configured
4. ⏭️ **Next:** Test frontend integration

---

## 🧪 Complete End-to-End Test

1. **Start your React app**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Open browser:** http://localhost:3000/login

3. **Login with credentials:**
   ```
   Email: superadmin@parkmate.com
   Password: YourActualPassword
   ```

4. **Expected Result:**
   - Loading spinner appears
   - Redirect to `/dashboard/super-admin`
   - Token stored in localStorage

5. **Verify in Browser DevTools:**
   ```javascript
   // Console
   localStorage.getItem('authToken')
   localStorage.getItem('userRole')
   localStorage.getItem('userName')
   ```

---

## 🎉 Congratulations!

Your ParkMate Admin Portal authentication is now fully functional with AWS serverless backend!

**What you've built:**
- ✅ React login interface
- ✅ DynamoDB user storage
- ✅ Lambda authentication logic
- ✅ API Gateway REST endpoint
- ✅ JWT token-based auth
- ✅ Role-based routing