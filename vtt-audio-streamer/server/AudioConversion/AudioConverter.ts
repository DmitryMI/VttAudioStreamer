import {IDependencyManager} from "#shared/IDependencyManager";
import {IAudioConverter} from "#shared/AudioConversion/IAudioConverter";
import type {IPcmFormat} from "#shared/Pcm/IPcmFormat";
import type {AudioConversionSessionId, IAudioConversionSession} from "#shared/AudioConversion/IAudioConversionSession";
import {AudioConversionSession} from "~~/server/AudioConversion/AudioConversionSession";

export class AudioConverter implements IAudioConverter {

    constructor(dependencyManager: IDependencyManager) {
        this.dependencyManager = dependencyManager;
    }

    createPcmConversionSession(data: Uint8Array, sourceMimeType: string, targetPcmInfo: IPcmFormat, completionCallback: (session: IAudioConversionSession)=>void): IAudioConversionSession{
        const sessionId = crypto.randomUUID() as AudioConversionSessionId;
        const session = new AudioConversionSession(sessionId, this, completionCallback, data, sourceMimeType, targetPcmInfo);
        this.sessions.push(session);
        return session;
    }

    getAudioConversionSessionById(id: AudioConversionSessionId): IAudioConversionSession | null{
        for(const session of this.sessions){
            if(session.id === id){
                return session;
            }
        }
        return null;
    }

    reportSessionFinished(session: IAudioConversionSession): void {
        let index: number = this.sessions.indexOf(session as AudioConversionSession);
        if(index == -1){
            throw new Error("reportSessionFinished() called for non-registered session")
        }
        this.sessions.splice(index, 1);
    }

    private readonly dependencyManager: IDependencyManager;
    private sessions: AudioConversionSession[] = [];
}

