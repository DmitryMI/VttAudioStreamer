import {IAudioImporter} from "#shared/AudioImporting/IAudioImporter";
import {IDependencyManager} from "#shared/IDependencyManager";
import type {AudioImportingSessionId, IAudioImportingSession} from "#shared/AudioImporting/IAudioImportingSession";
import {AudioImportingSession} from "~~/server/AudioImporting/AudioImportingSession";

export class AudioImporter implements IAudioImporter {

    constructor(dependencyManager: IDependencyManager) {
        this.dependencyManager = dependencyManager;
    }

    getMaximumAudioSize(): number{
        return 100 * 1024 * 1024;
    }

    getAllowedMimes(): Set<string>{
        return new Set<string>(
            [
                "audio/aac",
                "audio/aacp",
                "audio/adpcm",
                "audio/aiff",
                "audio/x-aiff",
                "audio/basic",
                "audio/flac",
                "audio/midi",
                "audio/mp4",
                "audio/mp4a-latm",
                "audio/mpeg",
                "audio/ogg",
                "audio/opus",
                "audio/vnd.digital-winds",
                "audio/vnd.dts",
                "audio/vnd.dts.hd",
                "audio/vnd.lucent.voice",
                "audio/vnd.ms-playready.media.pya",
                "audio/vnd.nuera.ecelp4800",
                "audio/vnd.nuera.ecelp7470",
                "audio/vnd.nuera.ecelp9600",
                "audio/vnd.wav",
                "audio/wav",
                "audio/x-wav",
                "audio/vnd.wave",
                "audio/wave",
                "audio/x-pn-wav",
                "audio/webm",
                "audio/x-matroska",
                "audio/x-mpegurl",
                "audio/x-ms-wax",
                "audio/x-ms-wma",
                "audio/x-pn-realaudio",
                "audio/x-pn-realaudio-plugin"
            ]);

    }

    createAudioUploadingSession(fileName: string, mimeType: string, data: Uint8Array): IAudioImportingSession{
        const id: AudioImportingSessionId = crypto.randomUUID() as AudioImportingSessionId;
        const session: AudioImportingSession = new AudioImportingSession(id, this, fileName, mimeType, data, this.dependencyManager);
        this.sessions.push(session);
        return session;
    }

    getAudioUploadingSessionById(id: AudioImportingSessionId): IAudioImportingSession | null{
        for(const session of this.sessions){
            if(session.id === id){
                return session;
            }
        }
        return null;
    }

    reportSessionFinished(session: IAudioImportingSession):void{
        console.log(`Import session ${session.id} (${session.fileName}) finished`);
        setTimeout(()=>{let index: number = this.sessions.indexOf(session as AudioImportingSession);
            if(index == -1){
                throw new Error("reportSessionFinished() called for non-registered session")
            }
            this.sessions.splice(index, 1);
                console.log(`Import session ${session.id} (${session.fileName}) deleted`);
            },
            10000
        );
    }

    private readonly dependencyManager: IDependencyManager;
    private sessions: AudioImportingSession[] = [];
}

