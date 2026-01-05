import {IPcmInfo} from "#shared/Pcm/IPcmInfo";

export class PcmInfo implements IPcmInfo {
    fileName: string;
    durationMs: number;
    bitrate: number;

    album?: string;
    artist?: string;
    date?: string;
    title?: string;

    constructor(
        fileName: string,
        durationMs: number,
        bitrate: number,
        album?: string | undefined,
        artist?: string | undefined,
        date?: string | undefined,
        title?: string | undefined
    ) {
        this.durationMs = durationMs;
        this.bitrate = bitrate;
        this.fileName = fileName;
        this.album = album;
        this.artist = artist;
        this.date = date;
        this.title = title;

    }
}