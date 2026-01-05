/**
 * PCM metadata
 */
export interface IPcmInfo {
    fileName: string;
    durationMs: number;
    bitrate: number;

    album?: string;
    artist?: string;
    date?: string;
    title?: string;
}
