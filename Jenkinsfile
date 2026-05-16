pipeline {
  agent any

  tools {
    nodejs 'NodeJS 20'
  }

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Instalar frontend') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Validar frontend') {
      steps {
        sh 'npm run lint'
        sh 'npm run build'
      }
    }

    stage('Instalar backend') {
      steps {
        dir('server') {
          sh 'npm ci'
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline completado correctamente.'
    }
    failure {
      echo 'Pipeline fallido. Revisa la consola de Jenkins.'
    }
  }
}
