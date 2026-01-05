// https://dev.to/blamsa0mine/building-a-secure-file-upload-api-with-nuxt-3-complete-implementation-guide-11ac

import {getDependencyManager} from "~~/server/DependencyManager";
import {IAudioImporter} from "#shared/IAudioImporter";
import {PcmId} from "#shared/Pcm/IPcm";

export default defineEventHandler(async (event) => {
    const serverSentEvent = (data: any) => {
        event.node.res.write(`data: ${JSON.stringify(data)}\n\n`)
    }

    const parts = await readMultipartFormData(event);

    const audioImporter: IAudioImporter = (await getDependencyManager()).getAudioImporter();

    if(!parts?.length) {
        throw createError({statusCode: 400, statusMessage: 'Nothing received'})
    }

    const files = parts.filter(p => p.filename && p.data)
    if (files.length === 0) {
        throw createError({ statusCode: 400, statusMessage: 'Missing files' })
    }

    let pcmIds: PcmId[] = [];

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

        let pcmId = await audioImporter.processUpload(filename, type, data, (progress: number) => {serverSentEvent({file: filename, progress: progress})})
        pcmIds.push(pcmId);
    }

    return pcmIds;
})