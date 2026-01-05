// https://dev.to/blamsa0mine/building-a-secure-file-upload-api-with-nuxt-3-complete-implementation-guide-11ac

import {getDependencyManager} from "~~/server/DependencyManager";
import {IAudioImporter} from "#shared/AudioImporting/IAudioImporter";
import type {AudioImportingSessionId} from "#shared/AudioImporting/IAudioImportingSession";

export default defineEventHandler(async (event) => {

    const parts = await readMultipartFormData(event);

    const audioImporter: IAudioImporter = (await getDependencyManager()).getAudioImporter();

    if(!parts?.length) {
        throw createError({statusCode: 400, statusMessage: 'Nothing received'})
    }

    const files = parts.filter(p => p.filename && p.data)
    if (files.length === 0) {
        throw createError({ statusCode: 400, statusMessage: 'Missing files' })
    }

    let sessionIds: AudioImportingSessionId[] = [];

    for(const p of files){
        const { filename = "file", type, data } = p;
        const fileSize = data.length;

        if(!type){
            throw createError({statusCode: 400, statusMessage: 'File type not defined'})
        }

        if (!audioImporter.getAllowedMimes().has(type)) {
            throw createError({ statusCode: 400, statusMessage: 'Unsupported file type' })
        }

        if(fileSize > audioImporter.getMaximumAudioSize()) {
            throw createError({ statusCode: 413, statusMessage: 'File is too large.' })
        }

        let sessionId = audioImporter.createAudioUploadingSession(filename, type, data).id;
        sessionIds.push(sessionId);
    }

    return sessionIds;
})