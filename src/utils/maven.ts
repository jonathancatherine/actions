import * as exec from "@actions/exec";

export interface MavenParameters {
    options?: string;
    goals: string;
    mavenPomFile?: string;
    argument?: string;
    skipTests?: boolean;
    repoId?: string;
    repoUsername?: string;
    repoToken?: string;
}

export async function build(params: MavenParameters): Promise<void> {
    const options = params.options ? ` ${params.options}` : '';
    const goals = params.goals;
    const mavenPomFile = params.mavenPomFile ? ' -f ' + params.mavenPomFile : '';
    const argument = params.argument ? ` ${params.argument}` : '';
    const skipTestsArgument = params.skipTests ? ' -DskipTests' : ''
    const repoId = params.repoId ? ` -Drepo.id=${params.repoId}` : ''
    const settings = params.repoId ? ` -s settings.xml` : ''
    const repoUsername = params.repoUsername ? ` -Drepo.username=${params.repoUsername}` : ''
    const repoToken = params.repoToken ? ` -Drepo.token=${params.repoToken}` : ''
    if (params.repoId) {
        await exec.exec(`echo "<?xml version="1.0" encoding="UTF-8"?><settings><servers><server><id>\${repo.id}</id><username>\${repo.username}</username><password>\${repo.token}</password></server></servers></settings>" > settings.xml`);
    }
    await exec.exec(`mvn${options}${settings}${mavenPomFile} ${goals}${argument}${skipTestsArgument}${repoId}${repoUsername}${repoToken}`);
}