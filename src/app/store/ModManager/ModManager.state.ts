export interface Mod {
    name: string;
    authorLink: string;
    authorName: string;
    url: string;
    publishDate: string;
    updateDate: string;
    archiveNames: Array<string>;
    archivePaths: Array<string>;
    archiveMaps: Array<Array<string>>;
    pictures: Array<string>;
    thumbs: Array<string>;
    enabled: Array<boolean>;
}

export interface ModManagerState {
    loading: boolean;
    modList: Array<Mod>;
    nativePcMap: Array<any>;
    modFolderMap: Array<any>;
    ownedPathDict: Object;
    processingQue: Array<any>;
    modProcessing: boolean;
    downloadedModDetail: Array<any>;
}

export function InitializeModManagerState() {
    return{
        loading: false,
        modList: [],
        nativePcMap: [],
        modFolderMap: [],
        ownedPathDict: {},
        processingQue: [],
        modProcessing: false,
        downloadedModDetail: []
    };
}
