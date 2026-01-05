import {getDependencyManager} from "~~/server/DependencyManager";
import type {PcmId} from "#shared/Pcm/IPcm";

export default defineEventHandler(async (event) => {

   const pcmManager = (await getDependencyManager()).getPcmManager();

   const results: Array<{ id: PcmId, name: string, size: number, durationMs: number }> = []

   let pcms = await pcmManager.getPcms();

   for(const pcm of pcms){
      results.push({id: pcm.id, name: pcm.name, size: 0, durationMs: 0});
   }

   console.log(`GET /api/pcm/list: ${pcms.length} entries`, );
   return results;
})