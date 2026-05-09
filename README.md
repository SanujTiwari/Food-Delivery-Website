# Food Delivery Website - DevOps CI/CD Pipeline

## Project Overview

This project demonstrates the deployment of a React-based Food Delivery web application using Docker, AWS EC2, Docker Hub, and GitHub Actions with a complete CI/CD pipeline.

The application is containerized using Docker and deployed on an AWS EC2 instance. GitHub Actions automates the entire deployment workflow so that every push to the GitHub repository automatically builds a new Docker image, pushes it to Docker Hub, and deploys the updated application on the EC2 server.

---

## Tech Stack

* Frontend: React.js
* Containerization: Docker
* CI/CD: GitHub Actions
* Cloud Platform: AWS EC2
* Container Registry: Docker Hub

---

## Features

* Dockerized React application
* Automated CI/CD pipeline
* Docker Hub integration
* AWS EC2 cloud deployment
* Automatic deployment on every GitHub push
* Live production hosting

---

## CI/CD Workflow

```text
Developer Pushes Code
        ↓
GitHub Actions Triggered
        ↓
Docker Image Build
        ↓
Push Image to Docker Hub
        ↓
Connect to AWS EC2 using SSH
        ↓
Pull Latest Docker Image
        ↓
Deploy Updated Container
        ↓
Live Website Updated
```

---

## Project Structure

```text
food-delivery/
│
├── backend/
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/
│
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## Docker Commands Used

### Build Docker Image

```bash
docker build -t react-app .
```

### Run Docker Container

```bash
docker run -d -p 3000:80 react-app
```

### Push Image to Docker Hub

```bash
docker push sanuj88/food-delivery-frontend
```

---

## Deployment

The application is deployed on AWS EC2 and automatically updated using GitHub Actions CI/CD pipeline.

---

## Learning Outcomes

* Understanding Docker containerization
* Setting up CI/CD pipelines
* Deploying applications on AWS EC2
* Automating deployments using GitHub Actions
* Managing Docker images with Docker Hub

---

## Author

Sanuj Tiwari
