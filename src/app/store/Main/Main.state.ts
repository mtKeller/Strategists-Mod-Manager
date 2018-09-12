export interface Main {
    loading: boolean;
    mhwDirectory: string;
    nexusUser: string;
    nexusSecret: string;
    mhwDirectoryMap: any;
    chokidarObserver: any;
}

export function InitializeMainState() {
    return{
        loading: false,
        mhwDirectory: null,
        nexusUser: null,
        nexusSecret: false,
        mhwDirectoryMap: null,
        chokidarObserver: null
    };
}
