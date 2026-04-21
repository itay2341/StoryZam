# Deploy StoryZam to Railway

## Prerequisites
- GitHub account
- Railway account (sign up at railway.app)
- Your API keys ready:
  - Google Gemini API key
  - ACRCloud credentials (host, access key, access secret)

## Step 1: Push to GitHub

1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/storyzam.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub

2. Click **"New Project"** → **"Deploy from GitHub repo"**

3. Select your **StoryZam** repository

4. Railway will detect multiple services. Click **"Add Service"** for backend:
   - **Root Directory:** `backend`
   - **Name:** storyzam-backend

5. Add environment variables (click on the service → **Variables** tab):
   ```
   PORT=3000
   GEMINI_API_KEY=your_actual_gemini_api_key
   ACRCLOUD_HOST=identify-eu-west-1.acrcloud.com
   ACRCLOUD_ACCESS_KEY=your_actual_access_key
   ACRCLOUD_ACCESS_SECRET=your_actual_access_secret
   FRONTEND_URL=*
   ```
   (You'll update FRONTEND_URL later)

6. Click **"Deploy"** - Railway will build and deploy your backend

7. Once deployed, click **"Settings"** → **"Generate Domain"** to get your backend URL
   - Copy this URL (e.g., `https://storyzam-backend.up.railway.app`)

## Step 3: Deploy Frontend on Railway

1. In the same Railway project, click **"New Service"** → **"GitHub Repo"**

2. Select the same repository, then configure:
   - **Root Directory:** `frontend`
   - **Name:** storyzam-frontend

3. Add environment variable (Variables tab):
   ```
   VITE_API_BASE_URL=https://storyzam-backend.up.railway.app
   ```
   (Use the backend URL from Step 2.7)

4. Click **"Deploy"**

5. Once deployed, go to **"Settings"** → **"Generate Domain"** to get your frontend URL
   - Copy this URL (e.g., `https://storyzam.up.railway.app`)

## Step 4: Update Backend CORS

1. Go back to your **backend service** in Railway

2. Update the **FRONTEND_URL** environment variable:
   ```
   FRONTEND_URL=https://storyzam.up.railway.app
   ```
   (Use your actual frontend domain from Step 3.5)

3. Railway will automatically redeploy with the new configuration

## Step 5: Test Your App

1. Visit your frontend URL (from Step 3.5)
2. Try recording or uploading a song
3. Check that it successfully recognizes and analyzes songs

## Troubleshooting

### Backend deployment fails
- Check Railway logs for errors
- Verify all environment variables are set correctly
- Ensure API keys are valid

### Frontend can't connect to backend
- Check VITE_API_BASE_URL is correct in frontend env vars
- Verify FRONTEND_URL is set in backend env vars
- Check browser console for CORS errors

### "Configuration Error" on backend
- Make sure all required env vars are set (GEMINI_API_KEY, ACRCLOUD_*)

## Cost
Railway offers:
- **$5/month** free credit for hobby plan
- **~$5-10/month** for this app with moderate usage
- First deployment is free to test

## Custom Domain (Optional)
1. In Railway, go to your frontend service
2. Click **"Settings"** → **"Domains"**
3. Click **"Custom Domain"** and follow instructions

## Updating Your App
Just push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push
```
Railway will automatically redeploy both services!
