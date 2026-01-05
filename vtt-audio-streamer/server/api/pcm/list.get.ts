import {getDependencyManager} from "~~/server/DependencyManager";
import type {PcmId} from "#shared/Pcm/IPcm";
import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";

export default defineEventHandler(async (event) => {

   const pcmManager = (await getDependencyManager()).getPcmManager();

   const results: {id: PcmId, info: IPcmInfo}[] = []

   let pcms = await pcmManager.getPcms();

   for(const pcm of pcms){
      results.push({id: pcm.id, info: pcm.info});
   }

   console.log(`GET /api/pcm/list: ${pcms.length} entries`, );
   return results;
})