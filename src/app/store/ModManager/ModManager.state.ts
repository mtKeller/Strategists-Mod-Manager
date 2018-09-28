export interface Mod {
    name: string;
    author: string;
    publishDate: string;
    archivePath: string;
    paths: Array<string>;
    enabled: boolean;
    pictures: Array<string>;
}

export interface ModManagerState {
    loading: boolean;
    modList: Array<Mod>;
    nativePcMap: Array<any>;
    modFolderMap: Array<any>;
    ownedPathDict: Object;
    needsProcessing: Array<any>;
}

export function InitializeModManagerState() {
    return{
        loading: false,
        modList: [],
        nativePcMap: [],
        modFolderMap: [],
        ownedPathDict: {},
        needsProcessing: []
    };
}
