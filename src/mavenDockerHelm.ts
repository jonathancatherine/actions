import * as core from "@actions/core";
import * as github from "@actions/github";
import * as maven from "../src/utils/maven";
import * as docker from "../src/utils/docker";

async function mavenBuild() {
    const mavenPomFile = core.getInput('mavenPomFile');
    const skipTests = core.getInput('skipTests');

    const mavenParameters: maven.MavenParameters = {
        options: "-B",
        mavenPomFile: mavenPomFile,
        goals: "clean package",
        skipTests: skipTests === 'true'
    };
    maven.build(mavenParameters);
}

async function dockerBuild(tag: string) {
    const dockerFile = core.getInput('dockerFile');
    const dockerImage = core.getInput('dockerImage');
    const registryHost = core.getInput('registryHost');
    const registryUsername = core.getInput('registryUsername');
    const registryPassword = core.getInput('registryPassword');

    const dockerOptions: docker.DockerOptions = {
        dockerFile: dockerFile,
        dockerImage: dockerImage,
        registryHost: registryHost,
        registryPassword: registryPassword,
        registryUsername: registryUsername,
        tag: tag
    };
    await docker.buildAndPush(dockerOptions);
}

async function run(): Promise<void> {
    try {
        await mavenBuild();


        await dockerBuild("sdfsdfs");



        //const githubToken = process.env.GITHUB_TOKEN || "";
        //const octokit = new github.GitHub(githubToken);

        // const payload = JSON.stringify(github.context.payload, undefined, 2)
        // console.log(`The event payload: ${payload}`);

        // const env = JSON.stringify(process.env)
        // console.log(`env: ${env}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

export default run;

