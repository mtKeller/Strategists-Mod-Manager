export interface DownloadItem {
    fileName: string;
    progress: number;
    complete: boolean;
    modDetails: object;
    processing: boolean;
    processingProgress: number;
}

export interface DownloadManagerState {
    currentFiles: Array<DownloadItem>;
    ready: boolean;
}

export const InitializeDownloadManagerState = function() {
    return {
        currentFiles: [],
        ready: false
    };
};
