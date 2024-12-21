<template>
  <div class="container grid grid-cols-1 gap-6 p-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-items-center sm:p-6 sm:mb-0 sm:pb-0 md:p-8">
    <MyCard
      v-for="item in cardItems"
      :key="item.id"
      :title="item.title"
      :link="item.link"
      :external="item.external"
      :image="item.image"
      :icon="item.icon"
      class="w-full max-w-sm m-2"
    />
  </div>
</template>

<script setup>
const cardItems = [
  {
    id: 1,
    title: "Water Quality",
    link: "/water-quality",
    external: false,
    image: "/assets/img/water-quality.jpg",
    icon: "fluent:water-16-filled"
  },
  {
    id: 2,
    title: "Ambient Air",
    link: "https://kunakcloud.com/",
    external: true,
    image: "/assets/img/ambient-air.jpg",
    icon: "akar-icons:air"
  },
  {
    id: 3,
    title: "Emissions",
    link: "/",
    external: false,
    image: "/assets/img/emissions.jpeg",
    icon: "fluent:cloud-16-filled"
  },
  {
    id: 4,
    title: "Heavy Metals",
    link: "/",
    external: false,
    image: "/assets/img/heavy-metals.jpeg",
    icon: "fluent:beaker-16-filled"
  },
];
</script>
