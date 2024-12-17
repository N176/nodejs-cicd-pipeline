pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "nodejs-app"  // Default values can be overridden by .env
        DOCKER_REGISTRY = "your-dockerhub-username"  // Default values can be overridden by .env
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/N176/nodejs-cicd-pipeline.git'
            }
        }

        stage('Load Environment Variables') {
            steps {
                script {
                    // Load environment variables from the .env file
                    sh 'export $(cat .env | xargs)' // This will load all variables in .env into the current shell
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install' // Install Node.js dependencies
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh 'npm test' // Run tests using Jest or your testing framework
                }
            }
        }

        stage('Build Docker Image for Node.js') {
            steps {
                script {
                    // Build the Node.js Docker image
                    sh 'docker build -t $DOCKER_REGISTRY/$DOCKER_IMAGE:${GIT_COMMIT} .'
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    // Push the Docker image to DockerHub
                    withCredentials([usernamePassword(credentialsId: 'DockerHub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                        sh 'docker push $DOCKER_REGISTRY/$DOCKER_IMAGE:${GIT_COMMIT}'
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs() // Clean workspace after the build
        }
    }
}
