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
				:items="files"
				:loading="loading"
				item-key="id"
				class="elevation-1"
			>
				<template #headers>
					<tr>
						<th>Name</th>
						<th>Duration</th>
						<th>Uploaded</th>
					</tr>
				</template>

				<template #item="{ item }">
					<tr>
						<td>
							<v-icon size="18" class="mr-2">mdi-music</v-icon>
							{{ item.name }}
						</td>

						<td>
              <span v-if="item.duration">
                {{ Math.round(item.duration) }} s
              </span>
							<span v-else class="text-disabled">
                —
              </span>
						</td>

						<td>
							{{ new Date(item.createdAt).toLocaleString() }}
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
			<AudioUpload @completed="onUploadFinished"/>
		</v-dialog>
	</v-container>
</template>

<script setup lang="ts">
	import {ref, onMounted} from "vue"
	import AudioUpload from "../../../components/AudioUpload.vue";

	interface UploadedAudio {
		id: string
		name: string
		duration?: number
		createdAt: string
	}

	const files = ref<UploadedAudio[]>([])
	const loading = ref(false)
	const uploadDialog = ref(false)

	async function loadFiles() {
		loading.value = true
		try {
			files.value = await useFetch<UploadedAudio[]>("/api/AudioImport/list")
		} finally {
			loading.value = false
		}
	}

	function onUploadFinished() {
		uploadDialog.value = false
		loadFiles()
	}

	onMounted(loadFiles)
</script>