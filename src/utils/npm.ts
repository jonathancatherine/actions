import * as exec from "@actions/exec";

export interface NpmParameters {
    folder?: string;
    globalPackages?: string[]
}

export async function build(params: NpmParameters): Promise<void> {
    const folderInstall = params.folder ? `cd ${params.folder};` : '';
    //const folderRun = params.folder ? ` --prefix ${params.folder}` : '';
    const globalPackages = params.globalPackages;

    if (params.folder) {
       await exec.exec(`head -10 ${params.folder}/package.json`);
    }


    if (globalPackages) {
        for (let globalPackage of globalPackages) {
            await exec.exec(`npm install ${globalPackage}`);
        }
    }


    await exec.exec(`${folderInstall}npm install`);
    await exec.exec(`${folderInstall}npm run build`);
}