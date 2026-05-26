# BrainBytes AI Tutoring Platform

## Project Overview

BrainBytes is an AI-powered tutoring platform designed to provide accessible academic assistance to Filipino students. This project implements the platform using modern DevOps practices and containerization.

## Project Goals

- Implement a containerized application with proper networking
- Create an automated CI/CD pipeline using GitHub Actions
- Deploy the application to Oracle Cloud Free Tier
- Set up monitoring and observability tools

## Technology Stack

- Frontend: Next.js
- Backend: Node.js
- Database: MongoDB Atlas
- Containerization: Docker
- CI/CD: GitHub Actions
- Cloud Provider: Oracle Cloud Free Tier
- Monitoring: Prometheus & Grafana

## Prerequisites

- **Docker**: v20.x or higher
- **Docker Compose**: v2.x or higher
- **Hugging Face API Token**

_Note: MongoDB Atlas is NOT needed for Docker Compose. A local MongoDB container is included automatically._

## Running the Application with Docker Compose

### 1. Create Environment File

Copy the template file in the project root and fill in your values:

```bash
# Copy template from root
cp .env.template .env
```

Then edit `.env` and add:

- `HUGGINGFACE_API_KEY` — your Hugging Face API token
- `JWT_SECRET` — any secure random string
- `GOOGLE_CLIENT_ID` — OAuth client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET` — OAuth client secret from Google Cloud Console
- `GITHUB_CLIENT_ID` — OAuth client ID from GitHub Developer Settings
- `GITHUB_CLIENT_SECRET` — OAuth client secret from GitHub Developer Settings
- `GOOGLE_CALLBACK_URL` — `http://localhost:3001/api/auth/google/callback`
- `GITHUB_CALLBACK_URL` — `http://localhost:3001/api/auth/github/callback`
- `NEXTAUTH_URL` — `http://localhost:8080`
- `NEXTAUTH_SECRET` — any secure random string
- `FRONTEND_URL` — `http://localhost:8080`

The Docker Compose setup reads these values from the root `.env` file and passes them into the backend and frontend containers.

**To get your Hugging Face API Token:**

1. Visit https://huggingface.co/settings/tokens
2. Click "Create new token"
3. Give it a name and select the desired scopes (e.g. `read`, `write`, or `Fine-grained`)
4. Create the token and add it to your `.env` file

**To get your Google OAuth credentials:**

1. Go to https://console.cloud.google.com/
2. Create or select a project
3. Open APIs & Services > Credentials
4. Create an OAuth client ID for a Web application
5. Add `http://localhost:3001/api/auth/google/callback` to the authorized redirect URIs
6. Copy the client ID and client secret into `.env`

**To get your GitHub OAuth credentials:**

1. Go to https://github.com/settings/developers
2. Create a new OAuth App
3. Set the Authorization callback URL to `http://localhost:3001/api/auth/github/callback`
4. Copy the client ID and client secret into `.env`

If you change the backend port or run the app on a different host, update the callback URLs in both the OAuth provider settings and your `.env` file so they match exactly.

### 2. Build and Start All Services

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build

```

### 3. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **MongoDB**: localhost:27017

### 4. View Logs

```bash
# View all services logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo

# View last 50 lines
docker-compose logs --tail 50
```

### 5. Stop Services

```bash
# Stop all services
docker-compose down

# Remove volumes (clears database)
docker-compose down -v
```

### 6. Local Development (without Docker)

To run locally without containers:

**Frontend:**

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

**Backend:**

```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
```

You'll need MongoDB running locally or set `MONGODB_URI` to point to a remote instance.
