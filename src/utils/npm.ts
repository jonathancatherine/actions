import * as exec from "@actions/exec";

export interface NpmParameters {
    folder?: string;

}

export async function build(params: NpmParameters): Promise<void> {
    const folderInstall = params.folder ? ` ${params.folder}` : '';
    const folderRun = params.folder ? ` --prefix ${params.folder}` : '';

    if(params.folder) {
        await exec.exec(`head -20 ${params.folder}/package.json`);
    }
    await exec.exec(`npm install${folderInstall}`);
    await exec.exec(`npm run${folderRun} build`);
}