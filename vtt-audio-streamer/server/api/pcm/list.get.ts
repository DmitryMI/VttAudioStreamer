import {getDependencyManager} from "~~/server/DependencyManager";
import {IPcm} from "#shared/Pcm/IPcm";


export default defineEventHandler(async (event) => {

   const pcmManager = getDependencyManager().getPcmManager();

   return await pcmManager.getPcms();
})