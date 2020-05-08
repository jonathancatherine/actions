const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

(async () => {
    try {
        const directory = core.getInput('directory');
        await exec.exec(`ls ${directory}`);
        await exec.exec(`mvn -B package --file ${directory}/pom.xml -DskipTests`);
    } catch (error) {
        core.setFailed(error.message);
    }
})();