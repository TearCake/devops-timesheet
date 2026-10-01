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
            description: 'Native application server port to configure'
        )
        booleanParam(
            name: 'RUN_TESTS',
            defaultValue: true,
            description: 'Run automated unit & lifecycle tests before packaging'
        )
        booleanParam(
            name: 'AUTO_DEPLOY',
            defaultValue: true,
            description: 'Deploy packaged artifact to server directory (Native)'
        )
        booleanParam(
            name: 'DOCKER_DEPLOY',
            defaultValue: true,
            description: 'Build versioned Docker image and deploy fresh container (Week 12 CD)'
        )
        string(
            name: 'DOCKER_PORT',
            defaultValue: '8085',
            description: 'Host port for Docker container continuous deployment'
        )
    }

    environment {
        BACKEND_DIR = 'timesheet-management/backend'
        DEPLOY_DIR = 'timesheet-management/deploy'
        ARTIFACT_NAME = 'timesheet-backend-0.0.1-SNAPSHOT.jar'
        DOCKER_IMAGE = 'timesheet-backend'
        DOCKER_CONTAINER = 'timesheet-app'
    }

    stages {
        stage('Checkout & Validate') {
            steps {
                echo "=========================================================="
                echo " Automated Timesheet Management Platform - CI/CD Pipeline"
                echo "Target Environment : ${params.ENVIRONMENT}"
                echo "Target Server Port : ${params.SERVER_PORT}"
                echo "Docker Host Port   : ${params.DOCKER_PORT}"
                echo "Docker Deployment  : ${params.DOCKER_DEPLOY}"
                echo "Build Number       : #${env.BUILD_NUMBER}"
                echo "Workspace          : ${env.WORKSPACE}"
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

        stage('Automated Tests & Quality Gate') {
            when {
                expression { params.RUN_TESTS == true }
            }
            steps {
                echo "=== Stage: Running Automated Unit & Selenium Tests ==="
                bat "mvn test -f ${BACKEND_DIR}/pom.xml"
            }
            post {
                always {
                    echo "=== Publishing JUnit Test Results ==="
                    junit allowEmptyResults: true, testResults: "${BACKEND_DIR}/target/surefire-reports/*.xml"
                    echo "=== Archiving Test Evidence Screenshots ==="
                    archiveArtifacts allowEmptyArchive: true, artifacts: "${BACKEND_DIR}/target/screenshots/*.png"
                }
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

        stage('Deploy Application (Native)') {
            when {
                expression { params.AUTO_DEPLOY == true }
            }
            steps {
                echo "=== Stage: Deploying to [${params.ENVIRONMENT}] Environment ==="
                bat "call timesheet-management\\deploy\\deploy.bat ${params.ENVIRONMENT} ${params.SERVER_PORT} ${env.BUILD_NUMBER}"
            }
        }

        stage('Deployment Verification (Native)') {
            when {
                expression { params.AUTO_DEPLOY == true }
            }
            steps {
                echo "=== Stage: Auditing Native Deployment Manifest ==="
                bat 'type "timesheet-management\\deploy\\current\\deployment-manifest.json"'
            }
        }

        stage('Build Docker Image') {
            when {
                expression { params.DOCKER_DEPLOY == true }
            }
            steps {
                echo "=== Stage: Building Versioned Docker Image ==="
                echo "Image: ${DOCKER_IMAGE}:build-${env.BUILD_NUMBER}"
                bat "docker build -t ${DOCKER_IMAGE}:build-${env.BUILD_NUMBER} -t ${DOCKER_IMAGE}:latest -f Dockerfile ."
            }
        }

        stage('Tag & Registry Catalog') {
            when {
                expression { params.DOCKER_DEPLOY == true }
            }
            steps {
                echo "=== Stage: Tagging & Registering Docker Release ==="
                bat "docker tag ${DOCKER_IMAGE}:build-${env.BUILD_NUMBER} ${DOCKER_IMAGE}:v1.2.${env.BUILD_NUMBER}"
                echo "=== Local Docker Image Inventory ==="
                bat "docker images ${DOCKER_IMAGE}"
            }
        }

        stage('Deploy Docker Container') {
            when {
                expression { params.DOCKER_DEPLOY == true }
            }
            steps {
                echo "=== Stage: Deploying Fresh Docker Container ==="
                bat "call timesheet-management\\deploy\\deploy-docker.cmd ${DOCKER_IMAGE} build-${env.BUILD_NUMBER} ${DOCKER_CONTAINER} ${params.DOCKER_PORT} ${env.BUILD_NUMBER}"
            }
        }

        stage('Container Health Verification') {
            when {
                expression { params.DOCKER_DEPLOY == true }
            }
            steps {
                echo "=== Stage: Auditing Docker Container & Manifest ==="
                bat 'type "timesheet-management\\deploy\\current\\deployment-manifest-docker.json"'
                bat "docker ps --filter \"name=${DOCKER_CONTAINER}\""
            }
            post {
                always {
                    echo "=== Archiving Docker Deployment Manifest ==="
                    archiveArtifacts allowEmptyArchive: true, artifacts: "timesheet-management/deploy/current/deployment-manifest-docker.json"
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline run completed for build #${env.BUILD_NUMBER}."
        }
        success {
            echo "=========================================================="
            echo " CI/CD PIPELINE & DOCKER DEPLOYMENT SUCCESSFUL"
            echo "Environment        : ${params.ENVIRONMENT} (Port: ${params.SERVER_PORT})"
            echo "Docker Container   : ${DOCKER_CONTAINER} (Port: ${params.DOCKER_PORT})"
            echo "Docker Image       : ${DOCKER_IMAGE}:build-${env.BUILD_NUMBER}"
            echo "Live API Endpoint  : http://localhost:${params.DOCKER_PORT}/api/timesheets"
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
