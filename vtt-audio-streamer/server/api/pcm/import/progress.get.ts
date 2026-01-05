export default defineEventHandler((event) => {

    /*
    const importId = getQuery(event).importId
    if (!importId) throw createError({ statusCode: 400, statusMessage: "Missing importId" })
    */
    return { progress: 0, pcmId: 0 }
})
