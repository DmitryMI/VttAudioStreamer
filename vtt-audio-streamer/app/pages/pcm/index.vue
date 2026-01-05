<template>
	<v-container>
		<!-- Header -->
		<div class="d-flex align-center justify-space-between mb-6">
			<h1 class="text-h5">Audio Library</h1>

			<v-btn color="primary" prepend-icon="mdi-upload" @click="uploadDialog = true">
				Upload Audio
			</v-btn>
		</div>

		<!-- File list -->
		<v-card>
			<v-data-table
				:items="pcmEntriesRef"
				:loading="loading"
				item-key="id"
				class="elevation-1"
			>
				<template #headers>
					<tr>
						<th>Name</th>
						<th>Artist</th>
						<th>Title</th>
						<th>Duration</th>
					</tr>
				</template>

				<template #item="{ item }">
					<tr>
						<td>
							<v-icon size="18" class="mr-2">mdi-music</v-icon>
							{{ item.info.fileName }}
						</td>
						<td>
							<v-icon size="18" class="mr-2">mdi-music</v-icon>
							{{ item.info.artist }}
						</td>

						<td>
							<v-icon size="18" class="mr-2">mdi-music</v-icon>
							{{ item.info.title }}
						</td>
						<td>
							{{ formatMs(item.info.durationMs) }}
						</td>
					</tr>
				</template>

				<template #no-data>
					<div class="text-center pa-6 text-disabled">
						No audio files uploaded yet
					</div>
				</template>
			</v-data-table>
		</v-card>

		<!-- Upload dialog -->
		<v-dialog v-model="uploadDialog" max-width="520">
			<AudioUploader @completed="onUploadFinished"/>
		</v-dialog>
	</v-container>
</template>

<script setup lang="ts">
	import {onMounted, ref} from "vue"
	import AudioUploader from "../../../components/AudioUploader.vue";
	import type {PcmId} from "#shared/Pcm/IPcm";
	import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";

	interface PcmEntry {
		id: PcmId
		info: IPcmInfo
	}

	const pcmEntriesRef = ref<PcmEntry[]>([])
	const loading = ref(false)
	const uploadDialog = ref(false)

	async function loadPcmEntries() {
		console.log("loadPcmEntries()")
		loading.value = true
		try {
			pcmEntriesRef.value = await $fetch<PcmEntry[]>("/api/pcm/list")

		} finally {
			loading.value = false
		}
	}

	function onUploadFinished() {
		uploadDialog.value = false
		loadPcmEntries()
	}

	function formatMs(ms: number): string {
		if (ms < 0) ms = -ms;
		const time = {
			day: Math.floor(ms / 86400000),
			hour: Math.floor(ms / 3600000) % 24,
			minute: Math.floor(ms / 60000) % 60,
			second: Math.floor(ms / 1000) % 60,
			millisecond: Math.floor(ms) % 1000
		};
		return Object.entries(time)
			.filter(val => val[1] !== 0)
			.map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
			.join(', ');
	}

	onMounted(loadPcmEntries)
</script>