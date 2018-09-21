export interface Main {
    loading: boolean;
    storedState: JSON;
    mhwDirectoryPath: string;
    mhwDirectoryMap: any;
}

export function InitializeMainState() {
    return{
        loading: false,
        storedState: null,
        mhwDirectoryPath: null,
        mhwDirectoryMap: [],
    };
}
