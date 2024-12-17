# CI/CD Pipeline for Node.js Application using Jenkins and AWS EC2

This project demonstrates a complete **CI/CD pipeline** using **Jenkins** to automate the build, test, and deployment processes for a **Node.js** application. The pipeline deploys the application to an **AWS EC2 instance** using **Docker**, streamlining deployment and reducing human error.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Jenkins Setup](#jenkins-setup)
  - [AWS EC2 Setup](#aws-ec2-setup)
  - [GitHub Setup](#github-setup)
  - [Docker Setup](#docker-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Running the Pipeline](#running-the-pipeline)
- [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
- [License](#license)

---

## Project Overview

This project automates the process of **building**, **testing**, and **deploying** a Node.js application to an **AWS EC2 instance** using **Docker containers**. The CI/CD pipeline is powered by **Jenkins**, and it eliminates the manual steps of deployment to ensure consistency and reliability.

### Key Features:
- **Automated Testing**: Runs tests (e.g., Jest) on the application code during the CI process.
- **Dockerization**: Packages the Node.js application into a Docker container.
- **AWS EC2 Deployment**: Deploys the Docker container to an AWS EC2 instance.
- **Automated Builds**: Builds and tests the application automatically whenever new code is pushed to the repository.

---

## Architecture

1. **Node.js Application**:
   - A simple Node.js application is used for the demonstration.
   
2. **Jenkins CI/CD Pipeline**:
   - Jenkins is responsible for orchestrating the entire CI/CD process, from building the app to deploying it to EC2.
   
3. **Docker**:
   - The application is packaged as a Docker image, ensuring easy deployment and scalability.

4. **AWS EC2**:
   - The Docker container is deployed to an AWS EC2 instance, providing a scalable environment for production.

---

## Prerequisites

Before setting up the pipeline, make sure you have the following tools and services:

- **Jenkins**: Installed and configured on a server or EC2 instance.
- **Docker**: Installed on both Jenkins and EC2 instances.
- **GitHub**: A repository containing your Node.js application.
- **AWS**: An active AWS account with an EC2 instance running.
- **SSH Access**: SSH access set up between Jenkins and the EC2 instance.

---

## Setup Instructions

### Jenkins Setup

1. **Install Jenkins**:
   - You can install Jenkins on any server or EC2 instance. Follow the [official Jenkins installation guide](https://www.jenkins.io/doc/book/installing/) to get started.

2. **Install Jenkins Plugins**:
   - Install the following plugins via Jenkins > Manage Jenkins > Manage Plugins:
     - Docker Pipeline
     - GitHub Integration
     - AWS Credentials Plugin

3. **Set Up Credentials in Jenkins**:
   - **GitHub Credentials**: Add your GitHub access token in Jenkins to authenticate with GitHub.
   - **AWS Credentials**: Add your AWS access and secret keys in Jenkins as credentials for deployment.
   - **DockerHub Credentials**: Add DockerHub username and password to Jenkins for pushing Docker images.

### AWS EC2 Setup

1. **Launch EC2 Instance**:
   - Create an EC2 instance (e.g., `t2.micro` for testing).
   - Ensure the security group allows inbound traffic on port 22 (SSH) and 80 (HTTP).
   
2. **Install Docker on EC2**:
   - SSH into the EC2 instance and run the following commands to install Docker:
     ```bash
     sudo apt-get update
     sudo apt-get install docker.io -y
     sudo systemctl start docker
     sudo systemctl enable docker
     ```
   
3. **Set Up SSH Access**:
   - Copy your Jenkins private key to the EC2 instance for SSH access.
   - Add the public key to the EC2 instance’s `~/.ssh/authorized_keys` file to enable Jenkins to SSH into it.

### GitHub Setup

1. **Create GitHub Repository**:
   - Create a GitHub repository to host your Node.js application code.
   - Push the code to the repository if it’s not already there.

2. **Create GitHub Webhook**:
   - Go to **GitHub > Repository Settings > Webhooks**.
   - Add a new webhook with the Jenkins webhook URL (e.g., `http://<your-jenkins-server>:8080/github-webhook/`).

### Docker Setup

1. **Create Dockerfile**:
   - Add a `Dockerfile` in the root of your Node.js project. Here’s an example:
     ```dockerfile
     FROM node:14

     WORKDIR /app

     COPY package*.json ./

     RUN npm install

     COPY . .

     EXPOSE 3000
     CMD ["node", "app.js"]
     ```

2. **Docker Hub Login**:
   - Ensure Jenkins has credentials to log in to Docker Hub for pushing images.

---

## CI/CD Pipeline

This project uses a **Jenkinsfile** to define the CI/CD pipeline. The pipeline automates the following stages:

### Jenkinsfile Example

```groovy
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "nodejs-app"
        DOCKER_REGISTRY = "your-dockerhub-username"
        AWS_CREDENTIALS = credentials('AWS_Credentials')
        EC2_INSTANCE_IP = 'your-ec2-ip'
        EC2_USER = 'ubuntu'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-username/your-repository.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh 'npm test'  // Run tests using Jest or another test framework
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_REGISTRY/$DOCKER_IMAGE:${GIT_COMMIT} .'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DockerHub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                        sh 'docker push $DOCKER_REGISTRY/$DOCKER_IMAGE:${GIT_COMMIT}'
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    withCredentials([aws(credentialsId: 'AWS_Credentials')]) {
                        sh """
                            ssh -i /path/to/your/private-key -o StrictHostKeyChecking=no $EC2_USER@$EC2_INSTANCE_IP << 'EOF'
                            docker pull $DOCKER_REGISTRY/$DOCKER_IMAGE:${GIT_COMMIT}
                            docker stop nodejs-app || true
                            docker rm nodejs-app || true
                            docker run -d --name nodejs-app -p 80:3000 $DOCKER_REGISTRY/$DOCKER_IMAGE:${GIT_COMMIT}
                            EOF
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
'''

## Key Stages

- **Checkout**: Pulls the code from the GitHub repository.
- **Install Dependencies**: Installs Node.js dependencies.
- **Run Tests**: Runs tests using a test suite like Jest.
- **Build Docker Image**: Builds a Docker image for the application.
- **Push Docker Image**: Pushes the built Docker image to Docker Hub.
- **Deploy to EC2**: SSH into the EC2 instance and deploy the Docker container.
- **Cleanup**: Cleans up the Jenkins workspace after the pipeline runs.

---

## Running the Pipeline

### 1. Push Code to GitHub
Whenever you push code to your GitHub repository, the pipeline will be triggered automatically.

### 2. Jenkins Pipeline Execution
Jenkins will automatically:
- Check out the code.
- Install dependencies.
- Run tests.
- Build the Docker image.
- Push the Docker image to Docker Hub.
- Deploy it to your EC2 instance.

### 3. Monitor Deployment
You can monitor the build and deployment process directly in Jenkins.

---

## Monitoring and Troubleshooting

### 1. Jenkins Logs
View the logs for each stage of the pipeline in Jenkins to troubleshoot any errors.

### 2. EC2 Logs
SSH into the EC2 instance and check the Docker logs if the application is not running as expected:

```bash
docker logs nodejs-app

### 3. Check Build Status in Jenkins
Jenkins provides a visual interface to check the status of the pipeline runs. You can access the build logs, see the success or failure status, and review the details of each stage in the pipeline. Simply go to your Jenkins dashboard and click on the specific job to view the status and logs.

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
