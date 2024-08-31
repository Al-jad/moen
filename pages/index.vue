<template>
  <div class="">
    <div>
      <imgSlider />
    </div>
    <main class="container">
      <NuxtLink to="/stations/manual/all-data">
        GO to Stations 
      </NuxtLink>
    </main>
  </div>
</template>

<script setup>
useHead({
  title: 'MOEN | Online Data App'
});
</script>
