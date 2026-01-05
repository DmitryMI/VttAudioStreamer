
<template>
	<v-card class="pa-4" max-width="500">
		<v-card-title>Upload Audio</v-card-title>

		<v-card-text>
			<v-file-input
				label="Select audio file"
				accept="audio/*"
				v-model="file"
				:disabled="phase !== 'idle'"
				prepend-icon="mdi-music"
			/>

			<v-btn
				class="mt-4"
				color="primary"
				block
				:disabled="!file || phase !== 'idle'"
				@click="upload"
			>
				Upload
			</v-btn>

			<v-progress-linear
				v-if="phase !== 'idle'"
				class="mt-6"
				:model-value="progress"
				height="20"
				rounded
				striped
			>
				<strong>{{ progress }}%</strong>
			</v-progress-linear>

			<div v-if="progressLabel" class="mt-2 text-caption">
				{{ progressLabel }}
			</div>

			<v-alert
				v-if="error"
				type="error"
				class="mt-4"
				density="compact"
			>
				{{ error }}
			</v-alert>
		</v-card-text>
	</v-card>
</template>


<script setup lang="ts">
	import { ref, computed, onBeforeUnmount } from "vue"
	import {AudioImportingProgress} from "#shared/AudioImporting/AudioImportingProgress";

	const file = ref<File | null>(null)
	const progress = ref(0)
	const phase = ref<"idle" | "upload" | "convert" | "done" | "failed">("idle")
	const error = ref<string | null>(null)
	const emit = defineEmits<{
		(e: 'completed'): void
	}>()

	let eventSource: EventSource | null = null

	const progressLabel = computed(() => {
		switch (phase.value) {
			case "upload": return "Uploading audio…"
			case "convert": return "Converting audio…"
			case "done": return "Completed"
			default: return ""
		}
	})

	function upload() {
		if (!file.value) return

		error.value = null
		phase.value = "upload"
		progress.value = 0

		const formData = new FormData()
		formData.append("file", file.value)

		const xhr = new XMLHttpRequest()
		xhr.open("POST", "/api/pcm/import/upload")

		// Upload progress
		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable) {
				progress.value = Math.round((event.loaded / event.total) * 100)
			}
		}

		xhr.onload = () => {
			if (xhr.status !== 200) {
				error.value = "Upload failed"
				phase.value = "idle"
				return
			}

			const response = JSON.parse(xhr.responseText)
			console.log(response)
			startSse(response)
		}

		xhr.onerror = () => {
			error.value = "Network error during upload"
			phase.value = "idle"
		}

		xhr.send(formData)
	}

	function startSse(audioImportSessionIds: string[]) {
		// TODO Handle multi-file uploads
		const sessionId = audioImportSessionIds[0]

		phase.value = "convert"
		progress.value = 0

		eventSource = new EventSource(`/api/pcm/import/progress?audioImportSessionId=${sessionId}`)

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data)

			const progressReport = data as AudioImportingProgress
			progress.value = progressReport.progress

			if(progressReport.isDone){
				progress.value = 100
				if(progressReport.hasError){
					phase.value = "failed"
				}
				else{
					phase.value = "done"
				}
				eventSource?.close()
				emit("completed")
			}
		}

		eventSource.onerror = () => {
			error.value = "Lost connection to conversion progress"
			eventSource?.close()
		}
	}

	onBeforeUnmount(() => {
		eventSource?.close()
	})
</script>
