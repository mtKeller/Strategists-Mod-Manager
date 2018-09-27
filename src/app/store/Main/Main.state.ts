export interface Main {
    loading: boolean;
    mhwDirectoryPath: string;
    mhwDirectoryMap: any;
}

export function InitializeMainState() {
    return{
        loading: false,
        mhwDirectoryPath: null,
        mhwDirectoryMap: [],
    };
}
