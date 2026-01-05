import {getDependencyManager} from "~~/server/DependencyManager";
import type {IAudioImporter} from "#shared/AudioImporting/IAudioImporter";
import type {AudioImportingSessionId, IAudioImportingSession} from "#shared/AudioImporting/IAudioImportingSession";
import {AudioImportingProgress} from "#shared/AudioImporting/AudioImportingProgress";

export default defineEventHandler(async (event) => {

    const query = getQuery(event)
    const sessionId = query.audioImportSessionId as AudioImportingSessionId

    if (!sessionId) {
        throw createError({ statusCode: 400, statusMessage: "audioImportSessionId missing" })
    }

    const dependencyManager = await getDependencyManager()
    const audioImporter: IAudioImporter = dependencyManager.getAudioImporter()

    const session: IAudioImportingSession | null =
        audioImporter.getAudioUploadingSessionById(sessionId)

    if (!session) {
        throw createError({
            statusCode: 404,
            statusMessage: `Session ${sessionId} does not exist`
        })
    }

    const res = event.node.res

    // 🔑 REQUIRED SSE HEADERS
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    res.flushHeaders?.()

    const send = () => {
        const payload = new AudioImportingProgress(
            session.id,
            session.fileName,
            session.getProgress(),
            session.isDone(),
            session.getError() != null
        )
        console.log(`Progress report: ${payload.progress}`)
        res.write(`data: ${JSON.stringify(payload)}\n\n`)
    }

    // Send immediately
    send()

    // Poll session progress
    const interval = setInterval(() => {
        send()

        if (session.isDone()) {
            clearInterval(interval)
            res.end()
        }
    }, 100)

    // Handle client disconnect
    event.node.req.on("close", () => {
        clearInterval(interval)
    })
})
