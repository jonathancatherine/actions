import * as core from "@actions/core";
import * as github from "@actions/github";
import * as npm from "../src/utils/npm";
import * as util from "../src/utils/util";
import {dockerBuild, gitOps} from "./steps";

async function npmBuild() {
    const npmFolder = core.getInput('npmFolder');
    const npmGlobalPackages = core.getInput('npmGlobalPackages');
    const npmInstall = core.getInput('npmInstall');
    const parameters: npm.NpmParameters = {
        folder:npmFolder,
        globalPackages: npmGlobalPackages.split(","),
        install: npmInstall === 'true',
    };
    await npm.build(parameters);
}

async function run(): Promise<void> {
    try {
        const githubPayload = github.context.payload;
        const canadaTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
        const dockerTagDate = util.getDateString((new Date(Date.now() - (new Date(canadaTime)).getTimezoneOffset() * 60000)));
        const dockerTag = `${dockerTagDate}-${githubPayload.after.substring(0, 7)}`;

        await npmBuild();
        await dockerBuild(dockerTag);
        await gitOps(githubPayload, dockerTag);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

export default run;

