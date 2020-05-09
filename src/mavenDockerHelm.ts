import * as core from "@actions/core";
import * as github from "@actions/github";
import * as maven from "../src/utils/maven";

function mavenBuild() {
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


async function run(): Promise<void> {
    try {
        mavenBuild();

        const githubToken = process.env.GITHUB_TOKEN || "";
        const octokit = new github.GitHub(githubToken);

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

