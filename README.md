# CI/CD Pipeline for Node.js Application with Docker and Kubernetes (EKS)

This project demonstrates a complete **CI/CD pipeline** for a **Node.js application** using **GitHub Actions**, **Docker**, **AWS EC2**, **Helm**, and **Kubernetes (EKS)**. The pipeline automates the process of testing, building, and deploying the application, ensuring seamless delivery and scalability.

---

## 🚀 Project Overview

The goal of this CI/CD pipeline is to automate the entire lifecycle of the Node.js application, from **testing** and **building** to **deployment** on a scalable Kubernetes cluster (EKS). The pipeline also provides real-time **deployment status** updates through **Slack notifications**.

### 🔑 Key Features:
- **Automatic Testing**: The pipeline runs tests on pull requests to ensure the code is stable and reliable.
- **Dockerization**: The Node.js application is containerized using **Docker**, and the Docker image is pushed to **Docker Hub**.
- **AWS EKS Deployment**: The Docker image is deployed to an **AWS EKS Kubernetes cluster** using **Helm**.
- **Slack Notifications**: Real-time notifications are sent to **Slack** about deployment success or failure.

---

## 🏗️ Architecture

### 1. **Node.js Application:**
A basic Node.js application that exposes a simple API and a health check endpoint for monitoring.

### 2. **CI/CD Pipeline:**
The pipeline is implemented using **GitHub Actions** and performs the following steps:
1. **Test** the code using **Jest** on pull requests.
2. **Build** a Docker image of the Node.js app.
3. **Push** the Docker image to **Docker Hub**.
4. **Deploy** the Docker image to **AWS EKS** using **Helm**.
5. **Send Slack Notifications**: Notifications are sent based on the deployment result.

---

## 📜 Setup Instructions

Follow these steps to set up the **CI/CD pipeline**, **Dockerization**, **Kubernetes deployment**, and **Slack notifications**.

### 1. **Docker Hub Setup**
To push Docker images to Docker Hub, follow these steps:

1. **Create a Docker Hub Account**: If you don't have one, create an account at [Docker Hub](https://hub.docker.com/).
2. **Create GitHub Secrets for Docker Hub**: Add your Docker Hub credentials to GitHub secrets. These credentials are required to authenticate with Docker Hub in the pipeline:
   - `DOCKER_USERNAME`: Your Docker Hub username.
   - `DOCKER_PASSWORD`: Your Docker Hub password.

```bash
DOCKER_USERNAME=<your-dockerhub-username>
DOCKER_PASSWORD=<your-dockerhub-password>


## 2. AWS EC2 Setup

### Create an EC2 Instance:
Set up an AWS EC2 instance running Ubuntu. You can choose a `t2.micro` instance for testing.

### Install Docker on EC2:
Run the following commands to install Docker on the EC2 instance:

```bash
sudo apt-get update
sudo apt-get install docker.io
sudo systemctl start docker
sudo systemctl enable docker

## 3. AWS EKS Setup

### Create an EKS Cluster:
Follow the [AWS EKS documentation](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html) to set up an EKS cluster.

### Configure kubectl:
After setting up the EKS cluster, configure `kubectl` to connect to it:

```bash
aws eks --region <region> update-kubeconfig --name <eks-cluster-name>

## 4. GitHub Secrets for Kubernetes and EKS

### Add AWS Credentials to GitHub Secrets:
These credentials are required to authenticate with AWS EKS. Add the following secrets in GitHub:

```bash
AWS_ACCESS_KEY_ID=<aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<aws-secret-access-key>
KUBERNETES_CLUSTER_NAME=<eks-cluster-name>
KUBERNETES_REGION=<region>

### Slack Webhook:
Set up a Slack webhook for deployment notifications and add it to GitHub secrets as `SLACK_WEBHOOK_URL`.

## 5. Kubernetes Configuration (Helm)

Create Helm charts for deployment and ensure the following Kubernetes configurations are stored in the `k8s` folder:

- **Node.js Deployment**: `nodejs-app-deployment.yaml`
- **MySQL Deployment**: `mysql-deployment.yaml`
- **Kubernetes Service**: `service.yaml`

## CI/CD Pipeline Workflow (GitHub Actions)

The CI/CD pipeline is implemented using GitHub Actions. The configuration is defined in `.github/workflows/ci-cd-pipeline.yml`.

### GitHub Actions Workflow Overview

The pipeline includes the following steps:

### 1. Test on Pull Requests:
- The pipeline is triggered when a pull request is opened or updated.
- The tests are executed using Jest to ensure the functionality of the code.

### 2. Build and Push Docker Image:
The pipeline builds a Docker image from the `Dockerfile` and pushes it to Docker Hub. It tags the image with the latest or the appropriate version.

```yaml
- name: Build Docker image
  run: docker build -t ${{ secrets.DOCKER_USERNAME }}/nodejs-app:${{ github.sha }} .

- name: Push Docker image
  run: docker push ${{ secrets.DOCKER_USERNAME }}/nodejs-app:${{ github.sha }}

### 3. Deploy to Kubernetes (EKS):
The pipeline deploys the Docker image to AWS EKS using Helm. This is done by applying the Helm chart to the Kubernetes cluster.

```yaml
- name: Deploy to Kubernetes (EKS)
  run: |
    helm upgrade --install nodejs-app ./k8s --set image.tag=${{ github.sha }}

### 4. Send Notifications:
Based on the result of the deployment, a Slack notification is sent to a specified channel.

```yaml
- name: Send Slack notification
  if: success()
  run: |
    curl -X POST -H 'Content-type: application/json' --data '{"text":"Deployment Successful"}' ${{ secrets.SLACK_WEBHOOK_URL }}

If the deployment fails, a different message is sent indicating failure.

## Running the Pipeline

### 1. Push Code to GitHub
When you push code to the `main` branch, GitHub Actions will automatically trigger the pipeline to:

- Run tests.
- Build and push Docker images to Docker Hub.
- Deploy the application to AWS EKS using Helm.
- Send Slack notifications for success or failure.

### 2. Monitor the Deployment
You can monitor the pipeline status through the GitHub Actions UI in your GitHub repository.

For Kubernetes resources, use `kubectl` to check the status of your application:

```bash
kubectl get pods
kubectl get services
