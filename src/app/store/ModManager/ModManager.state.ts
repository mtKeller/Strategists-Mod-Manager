export interface Mod {
    name: string;
    authorLink: string;
    authorName: string;
    url: string;
    publishDate: string;
    updateDate: string;
    description: string;
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
    loadOrder: Array<Array<number>>;
    nativePcMap: Array<any>;
    modFolderMap: Array<any>;
    ownedPathDict: Object;
    processingQue: Array<any>;
    installationQue: Array<any>;
    processingTarget: any;
    installationTarget: any;
    modProcessing: boolean;
    downloadedModDetail: Array<any>;
    modQueController: boolean;
}

export function InitializeModManagerState() {
    return{
        loading: false,
        modList: [],
        loadOrder: [],
        nativePcMap: [],
        modFolderMap: [],
        ownedPathDict: {},
        processingQue: [],
        installationQue: [],
        processingTarget: null,
        installationTarget: null,
        modProcessing: false,
        downloadedModDetail: [],
        modQueController: true
    };
}
