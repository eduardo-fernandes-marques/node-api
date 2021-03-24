env.NODE_ENV = 'production'

def buildDeployLatest() {

    this.release()

    // build docker image
    stage('build image') {
        buildImage()
    }

    // deploy docker image
    stage('deploy development snapshot') {
        deploy()
    }
}

/**
 * Invoked by release jobs.
 */
def release() {

    stage('Install dependencies') {
        env.NODE_ENV = 'development'

        sh returnStdout: true, script: "npm install"

        env.NODE_ENV = 'production'
    }

    stage('Verify') {
        sh returnStdout: true, script: "npm run lint"
    }

    stage('Test') {
        env.NODE_ENV = 'development'
        
        // sh returnStdout: true, script: "npm run test"

           env.NODE_ENV = 'production'
    }

    stage('Build') {
        sh returnStdout: true, script: "npm run build"
    }

}

/**
 * Invoked by quality-gate jobs.
 */
def qualityGate(args = [:]) {

    stage('Install dependencies') {
        env.NODE_ENV = 'development'

        sh returnStdout: true, script: "npm install"

        env.NODE_ENV = 'production'
    }

    stage('Verify') {
        sh returnStdout: true, script: "npm run lint"
    }

    stage('Test') {
        // sh returnStdout: true, script: "npm run test"
    }

    // call sonarqube forwarding args to publish
    // project metrics to scm
    stage('sonar reports') {}
}

// make sure we return an instance of this scripts so jenkins pipeline
// can call our functions
return this
