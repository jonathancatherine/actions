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
        await exec.exec(`head -10 ${params.folder}/package.json`);
    }


    if (globalPackages) {
        for (let globalPackage of globalPackages) {
            await exec.exec(`npm install ${globalPackage}`);
        }
    }

    if (params.install) {
        if (params.folder) {
            await exec.exec(`npm install`, [], {cwd: params.folder});
        } else {
            await exec.exec(`npm install`);
        }
    }

    if (params.folder) {
        await exec.exec(`npm run build`, [], {cwd: params.folder});
    } else {
        await exec.exec(`npm run build`);
    }
}
