import * as exec from "@actions/exec";

export interface MavenParameters {
    options?: string;
    goals: string;
    mavenPomFile?: string;
    argument?: string;
    skipTests?: boolean;
}

export async function build(params: MavenParameters): Promise<void> {
    const options = params.options ? ' ' + params.options : '';
    const goals = params.goals;
    const mavenPomFile = params.mavenPomFile ? ' -f ' + params.mavenPomFile : '';
    const argument = params.argument ? ' ' + params.argument : '';
    const skipTestsArgument = params.skipTests ? ' -DskipTests' : ''

    await exec.exec(`mvn${options}${mavenPomFile} ${goals}${argument}${skipTestsArgument}`);
}