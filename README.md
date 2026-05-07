# BrainBytes AI Tutoring Platform

## Project Overview

BrainBytes is an AI-powered tutoring platform designed to provide accessible academic assistance to Filipino students. This project implements the platform using modern DevOps practices and containerization.

## Project Goals

- Implement a containerized application with proper networking
- Create an automated CI/CD pipeline using GitHub Actions
- Deploy the application to Oracle Cloud Free Tier
- Set up monitoring and observability tools

## Technology Stack

- Frontend: React.js
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

Create a `.env` file in the root directory:

```env
HUGGING_FACE_API_KEY=your_hugging_face_api_key_here
```

**To get your Hugging Face API Token:**

1. Visit https://huggingface.co/settings/tokens
2. Click "Create new token"
3. Give it a name and select the desired scopes (e.g. `read`, `write`, or `Fine-grained`)
4. Create the token, copy it, and add it to your `.env` file

### 2. Start All Services

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

### 4. View Logs

```bash
# View all services logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

### 5. Stop Services

```bash
# Stop all services
docker-compose down

# Remove volumes (clears database)
docker-compose down -v
```
