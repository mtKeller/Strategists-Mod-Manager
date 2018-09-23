export interface Mod {
    name: string;
    author: string;
    publishDate: string;
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
}

export function InitializeModManagerState() {
    return{
        loading: false,
        modList: [],
        nativePcMap: [],
        modFolderMap: [],
        ownedPathDict: {}
    };
}
