pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
    }

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'staging', 'production'],
            description: 'Target deployment environment'
        )
        string(
            name: 'SERVER_PORT',
            defaultValue: '8080',
            description: 'Application server port to configure'
        )
        booleanParam(
            name: 'RUN_TESTS',
            defaultValue: true,
            description: 'Run automated unit & lifecycle tests before packaging'
        )
        booleanParam(
            name: 'AUTO_DEPLOY',
            defaultValue: true,
            description: 'Deploy packaged artifact to server environment'
        )
    }

    environment {
        BACKEND_DIR = 'timesheet-management/backend'
        DEPLOY_DIR = 'timesheet-management/deploy'
        ARTIFACT_NAME = 'timesheet-backend-0.0.1-SNAPSHOT.jar'
    }

    stages {
        stage('Checkout & Validate') {
            steps {
                echo "=========================================================="
                echo " Automated Timesheet Management Platform - CI/CD Pipeline"
                echo "Target Environment : ${params.ENVIRONMENT}"
                echo "Target Server Port : ${params.SERVER_PORT}"
                echo "Build Number        : #${env.BUILD_NUMBER}"
                echo "Workspace           : ${env.WORKSPACE}"
                echo "=========================================================="
                bat 'git status'
            }
        }

        stage('Build (Compile)') {
            steps {
                echo "=== Stage: Compiling Java Sources ==="
                bat "mvn clean compile -f ${BACKEND_DIR}/pom.xml"
            }
        }

        stage('Automated Tests') {
            when {
                expression { params.RUN_TESTS == true }
            }
            steps {
                echo "=== Stage: Running Automated Unit & Lifecycle Tests ==="
                bat "mvn test -f ${BACKEND_DIR}/pom.xml"
            }
        }

        stage('Package Artifact') {
            steps {
                echo "=== Stage: Packaging Executable Spring Boot JAR ==="
                bat "mvn package -DskipTests -f ${BACKEND_DIR}/pom.xml"
                echo "=== Archiving Built Artifact ==="
                archiveArtifacts artifacts: "${BACKEND_DIR}/target/*.jar", fingerprint: true
            }
        }

        stage('Deploy Application') {
            when {
                expression { params.AUTO_DEPLOY == true }
            }
            steps {
                echo "=== Stage: Deploying to [${params.ENVIRONMENT}] Environment ==="
                bat "call timesheet-management\\deploy\\deploy.bat ${params.ENVIRONMENT} ${params.SERVER_PORT} ${env.BUILD_NUMBER}"
            }
        }

        stage('Deployment Verification') {
            when {
                expression { params.AUTO_DEPLOY == true }
            }
            steps {
                echo "=== Stage: Auditing Deployment Manifest ==="
                bat 'type "timesheet-management\\deploy\\current\\deployment-manifest.json"'
            }
        }
    }

    post {
        always {
            echo "Pipeline run completed for build #${env.BUILD_NUMBER}."
        }
        success {
            echo "=========================================================="
            echo " DEPLOYMENT SUCCESSFUL"
            echo "Artifact deployed for ${params.ENVIRONMENT} environment on port ${params.SERVER_PORT}."
            echo "=========================================================="
        }
        failure {
            echo "=========================================================="
            echo " PIPELINE FAILED"
            echo "Please inspect stage logs above for details."
            echo "=========================================================="
        }
    }
}
