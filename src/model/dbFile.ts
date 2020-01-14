import { DownloadStatus } from "../constants/download-status";

export interface DbFile {
    formId : number;
    type : string;
    typeId : number;
    status : DownloadStatus;
    path : string;
    downloadURL : string;
    id : string ;
}