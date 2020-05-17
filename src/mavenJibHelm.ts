import * as core from "@actions/core";
import * as github from "@actions/github";
import * as util from "./utils/util";
import {gitOps, jibBuild, mavenBuild} from "./steps";

async function run(): Promise<void> {
    try {
        const githubPayload = github.context.payload;
        const canadaTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
        const dockerTagDate = util.getDateString((new Date(Date.now() - (new Date(canadaTime)).getTimezoneOffset() * 60000)));
        const dockerTag = `${dockerTagDate}-${githubPayload.after.substring(0, 7)}`;

        await mavenBuild();
        await jibBuild(dockerTag);
        await gitOps(githubPayload, dockerTag);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

export default run;

