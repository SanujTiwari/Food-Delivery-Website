# 🍕⚡ Food Delivery Website - DevOps CI/CD Pipeline 🚀☁️

## 🧠 Project Overview

This project demonstrates a complete **DevOps CI/CD deployment workflow** for a React-based Food Delivery Web Application using modern cloud and automation technologies.

The application is containerized using 🐳 Docker and deployed on ☁️ AWS EC2 with a fully automated 🔄 CI/CD pipeline powered by ⚙️ GitHub Actions.

Whenever new code is pushed to GitHub, the deployment process automatically:

✨ Builds a Docker image
📦 Pushes the image to Docker Hub
🔐 Connects to AWS EC2 using SSH
🚀 Deploys the latest application container automatically

This project helped in understanding real-world deployment automation and cloud-based DevOps practices.

---

# 🛠️ Tech Stack

| Technology        | Purpose              |
| ----------------- | -------------------- |
| ⚛️ React.js       | Frontend Development |
| 🐳 Docker         | Containerization     |
| ⚙️ GitHub Actions | CI/CD Automation     |
| 📦 Docker Hub     | Container Registry   |
| ☁️ AWS EC2        | Cloud Deployment     |

---

# 🔄 CI/CD Workflow

```text id="jlwm3o"
👨‍💻 Developer Pushes Code to GitHub
                    ↓
        ⚙️ GitHub Actions Triggered
                    ↓
          🐳 Docker Image Build
                    ↓
      📦 Push Image to Docker Hub
                    ↓
     🔐 Connect to AWS EC2 via SSH
                    ↓
      ⬇️ Pull Latest Docker Image
                    ↓
        🚀 Deploy Updated Container
                    ↓
         🌍 Live Website Updated
```

---

# 📂 Project Structure

```text id="jlwm3t"
food-delivery/
│
├── backend/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
└── .github/
    └── workflows/
        └── deploy.yml
```

---

# 🐳 Docker Setup

## 🏗️ Build Docker Image

```bash id="jlwm3x"
docker build -t react-app .
```

## ▶️ Run Docker Container

```bash id="jlwm42"
docker run -d -p 3000:80 react-app
```

## 📤 Push Image to Docker Hub

```bash id="jlwm47"
docker push sanuj88/food-delivery-frontend
```

---

# ☁️ AWS EC2 Deployment

The Docker container is deployed on an AWS EC2 Ubuntu instance 🌐

The EC2 server automatically pulls the latest Docker image whenever changes are pushed to GitHub, enabling seamless deployment automation ⚡

---

# ⚙️ GitHub Actions Automation

GitHub Actions automates the complete deployment workflow:

✅ Docker Image Build
✅ Docker Hub Push
✅ EC2 SSH Connection
✅ Automatic Container Deployment
✅ Live Website Update

---

# 🌍 Live Deployment

The application is hosted live on AWS EC2 using Docker containers with automated deployment support 🚀

---

# 🎯 Learning Outcomes

Through this project, the following concepts were learned:

🐳 Docker Containerization
⚙️ CI/CD Pipeline Automation
☁️ AWS EC2 Deployment
📦 Docker Hub Integration
🔐 Secure SSH Deployment
🚀 Real-world DevOps Workflow

---

# 👨‍💻 Author

### ✨ Sanuj Tiwari ✨

💻 Full Stack Developer
🚀 DevOps Enthusiast
☁️ Cloud Deployment Learner
