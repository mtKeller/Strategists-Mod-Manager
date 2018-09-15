export interface Main {
    loading: boolean;
    storedState: JSON;
    mhwDirectoryPath: string;
    nexusUser: string;
    nexusSecret: string;
    mhwDirectoryMap: any;
    chokidarObserver: any;
}

export function InitializeMainState() {
    return{
        loading: false,
        storedState: null,
        mhwDirectoryPath: null,
        nexusUser: null,
        nexusSecret: false,
        mhwDirectoryMap: null,
        chokidarObserver: null
    };
}
