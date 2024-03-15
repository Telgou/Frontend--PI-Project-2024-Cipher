pipeline {
    agent any
    environment {
        GIT_REPO = 'git@github.com:Telgou/Backend--PI-Project-2024-Cipher.git'
        GIT_CREDENTIALS_ID = 'cipher-backend'
    }
    stages {
        stage('Clone') {
            steps {
                git credentialsId: "${env.GIT_CREDENTIALS_ID}", url: "${env.GIT_REPO}", branch: "Ahmed"
            }
        }
        
        stage('Installation des dépendances') {
            steps {
                script {
                        sh 'npm install'
                }
            }
        }
        
        stage('Construction du projet') {
            steps {
                script {
                        sh 'npm run build'
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
