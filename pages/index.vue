<template>
  <div class="min-h-screen bg-gray-100">
    <div class="w-full">
      <imgSlider />
    </div>
    <main class="container mx-auto py-8">
      <div class="mb-12">
        <CardContainer />
      </div>
      <div class="flex gap-6 container mx-auto py-8 flex-col">
        <Content
          title="Water Quality Index"
          description="The Water Quality Index (WQI) is a measure of the quality of water based on various parameters such as temperature, pH, dissolved oxygen, and more."
          image="/assets/img/water-quality.jpg"
          alt="Water Quality Index"
        />
        <Content
          title="Heavy Metals"
          description="Heavy metals are toxic elements that can contaminate water sources, posing serious health risks to humans and ecosystems. Our monitoring program detects and measures levels of metals such as lead, mercury, and arsenic in water bodies."
          image="/assets/img/heavy-metals.jpeg"
          alt="Water Quality Index"
        />
        <Content
          title="Emissions Monitoring"
          description="Our emissions monitoring program utilizes state-of-the-art sensors and data analytics to continuously track and analyze air pollutants, greenhouse gases, and other emissions that impact air quality and climate change."
          image="/assets/img/emissions.jpeg"
          alt="Emissions Monitoring"
        />
        <Content
          title="Ambient Air Quality"
          description="Our ambient air quality monitoring program measures and analyzes various pollutants in the atmosphere, providing crucial data on air quality trends, potential health impacts, and compliance with environmental standards."
          image="/assets/img/ambient-air.jpg"
          alt="Ambient Air Quality"
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
