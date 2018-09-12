
export interface FileSystemState {
    fileSystemLoading: boolean;
    data: Array<any>;
    targetPath: Array<string>;
}

export const InitializeFileSystemState = function() {
    return{
        fileSystemLoading: false,
        data: [],
        targetPath: [],
    };
};
