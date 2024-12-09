# CI/CD Pipeline for Node.js Application

This project demonstrates a CI/CD pipeline for a Node.js application using GitHub Actions, Docker, AWS EC2, Helm, and Kubernetes.

## Approach

### 1. **Node.js Application**:
A simple Node.js application that exposes a basic API and a health check endpoint.

### 2. **CI/CD Pipeline**:
- **Pull Request Trigger**: Tests are run automatically on pull requests to ensure the code is functioning correctly.
- **Dockerization**: The application is containerized using Docker. The Docker image is built and pushed to Docker Hub.
- **AWS EC2**: The Docker image is deployed on an AWS EC2 instance.
- **Kubernetes Deployment**: After the Docker image is built, the application is deployed to a Kubernetes cluster using Helm.
- **Notifications**: A notification is sent based on the deployment status.

### 3. **GitHub Actions Workflow**:
The CI/CD process is automated using GitHub Actions. The pipeline includes the following steps:
- Run tests using Jest.
- Build and push Docker images.
- Deploy to Kubernetes using Helm.
- Send notifications based on deployment success or failure.

## Setup

1. **Docker Hub**: Create a Docker Hub account and add your credentials to GitHub secrets.
2. **AWS EC2**: Set up an EC2 instance and install Docker.
3. **Kubernetes**: Set up a Kubernetes cluster and store the `kubectl` credentials in GitHub secrets.
4. **Helm**: Install Helm to manage Kubernetes deployments.

## Running the Pipeline

Once you push code to the `main` branch, the CI/CD pipeline will trigger automatically, performing the following:
1. Run tests.
2. Build and push Docker images.
3. Deploy to Kubernetes using Helm.
4. Send notifications based on deployment success or failure.
