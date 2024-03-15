pipeline {
    agent any
    environment {
        GIT_REPO = 'git@github.com:Telgou/Frontend--PI-Project-2024-Cipher.git'
        GIT_CREDENTIALS_ID = 'cipher-frontend'
    }
    stages {
        stage('Clone') {
            steps {
                git credentialsId: "${env.GIT_CREDENTIALS_ID}", url: "${env.GIT_REPO}", branch: "Ahmed"
            }
        }
        
        stage('Dependancies installation') {
            steps {
                script {
                        sh 'npm install'
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                        sh 'npm run build'
                }
            }
        }
        stage('Build Image on Docker') {
            steps {
                // Build Docker image
                script {
                    sh ' docker build -t dormproject .'
                    }
                }
        }

    }
    
    post {
        success {
            echo 'All Pipeline steps were successful.'
        }
        failure {
            echo 'Pipelin FAILED.'
        }
    }
}
