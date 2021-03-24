/**
 * When needed, build variables can be used
 * to determine different paths. These are listed bellow:
 *
 * Commons variables available for every job
 *
 * env.SCM_PROJECT_NAME  = gitlab's project name
 *
 * env.SCM_URL           = gitlab's project url
 *
 * env.CHAT_ROOM         = chat room to notify build status
 *
 * env.BUILD_FLAVOR      = flavor environment where this build is
 * running (akka node11x, node10x, node8x, java8x, java11x, python2x, etc)
 *
 * env.JOB_TEMPLATE_TYPE = selected type of this job when generated
 * by our seeds (akka K8S, ECS, FLINK_1_6)
 **/

/**
 * Invoked by build-deploy-latest jobs.
 */
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
