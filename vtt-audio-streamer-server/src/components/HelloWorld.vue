<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
	<v-app>
		<v-main>
			<v-container>
				<v-btn color="primary">
					Vuetify is working 🎉
				</v-btn>
			</v-container>
		</v-main>
	</v-app>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
