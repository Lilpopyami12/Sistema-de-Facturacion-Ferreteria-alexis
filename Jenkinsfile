pipeline {
  agent any

  tools {
    nodejs 'NodeJS 20'
  }

  environment {
    POSTGRES_CONTAINER_NAME = 'ferreteria_alexis_postgres_jenkins'
    POSTGRES_HOST_PORT = '55433'
    PGADMIN_CONTAINER_NAME = 'ferreteria_alexis_pgadmin_jenkins'
    PGADMIN_HOST_PORT = '5052'
    DATABASE_URL = 'postgres://postgres:postgres@localhost:55433/ferreteria_alexis'
    PORT = '4000'
    API_BASE_URL = 'http://localhost:4000'
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

    stage('Levantar base de datos con Docker') {
      steps {
        sh 'docker compose up -d postgres'
      }
    }

    stage('Iniciar backend') {
      steps {
        sh '''
          cd server
          nohup npm start > ../api.log 2>&1 &
          echo $! > ../api.pid
        '''
        sh '''
          for i in $(seq 1 30); do
            if curl -fsS "$API_BASE_URL/api/health" >/dev/null; then
              exit 0
            fi
            sleep 2
          done

          echo "La API no respondio a tiempo."
          cat api.log
          exit 1
        '''
      }
    }

    stage('Pruebas automaticas API') {
      steps {
        sh 'node server/smoke-test.js'
      }
    }

    stage('Pruebas de carga con JMeter') {
      steps {
        sh '''
          mkdir -p jmeter-tests/dashboard
          docker run --rm --network host \
            -v "$PWD:/work" \
            justb4/jmeter:5.6.3 \
            -n \
            -t /work/jmeter-tests/ferreteria-api.jmx \
            -l /work/jmeter-tests/results.jtl \
            -e \
            -o /work/jmeter-tests/dashboard \
            -JBASE_HOST=localhost \
            -JBASE_PORT=4000 \
            -JTHREADS=10 \
            -JLOOPS=2 \
            -JRAMP_TIME=5
        '''
      }
      post {
        always {
          archiveArtifacts artifacts: 'jmeter-tests/results.jtl,jmeter-tests/dashboard/**,api.log', allowEmptyArchive: true
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
    always {
      sh '''
        if [ -f api.pid ]; then
          kill "$(cat api.pid)" || true
        fi
        docker compose down || true
      '''
    }
  }
}
