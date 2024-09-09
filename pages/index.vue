<template>
  <div class="min-h-screen bg-gray-100">
    <div class="w-full">
      <imgSlider />
    </div>
    <main class="container mx-auto py-4 sm:mb-0 sm:pb-0">
      <div class="mb-12 sm:mb-2 container">
        <h1 class="text-left sm:mx-[10%] sm:text-base text-2xl font-extrabold">
          Environmental Monitoring Center</h1>
        <CardContainer />
      </div>
      <div class="container mx-auto flex flex-col gap-6 py-8">
        <h1 class="text-left sm:mx-[10%] sm:text-base text-2xl font-extrabold">
          Environmental Determinants
        </h1>
        <Content
          title="Water Quality"
          description="Water quality is a critical environmental determinant that affects human health and ecosystems. It encompasses various parameters such as pH, dissolved oxygen, nutrients, and contaminants."
          image="/assets/img/wqi.jpg"
          alt="Water Quality"
        />
        <Content
          title="Air Quality"
          description="Air quality is a key environmental determinant influencing respiratory health and climate. It involves measuring pollutants like particulate matter, ozone, and nitrogen dioxide in the atmosphere."
          image="/assets/img/air-quality.jpg"
          alt="Air Quality"
        />
        <Content
          title="Soil Contamination"
          description="Soil contamination is an important environmental determinant affecting agriculture and ecosystem health. It involves the presence of chemicals or other alterations in the natural soil environment."
          image="/assets/img/soil.jpg"
          alt="Soil Contamination"
        />
        <Content
          title="Biodiversity"
          description="Biodiversity is a crucial environmental determinant that indicates ecosystem health. It refers to the variety of plant and animal life in a particular habitat, including endangered species and habitat preservation."
          image="/assets/img/earth.jpg"
          alt="Biodiversity"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({
  title: 'MOEN | Online Data App'
});
</script>
