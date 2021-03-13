import * as exec from "@actions/exec";

export interface NpmParameters {
    folder?: string;
    globalPackages?: string[];
    install?: boolean;
}

export async function build(params: NpmParameters): Promise<void> {
    //const folderInstall = params.folder ? `${params.folder};` : '';
    //const folderRun = params.folder ? ` --prefix ${params.folder}` : '';
    const globalPackages = params.globalPackages;

    if (params.folder) {
        await exec.exec(`head -10 package.json`, [], {cwd: params.folder});
    }


    if (params.folder) {
        await exec.exec(`yarn install`, [], {cwd: params.folder});
    } else {
        await exec.exec(`yarn install`);
    }

    //TEMP FIX
    await exec.exec(`cp -rp ngxs-data/fesm2015 node_modules/@ngxs-labs/data/`, [], {cwd: params.folder});

    if (params.folder) {
        await exec.exec(`npm run build`, [], {cwd: params.folder});
    } else {
        await exec.exec(`npm run build`);
    }
}
