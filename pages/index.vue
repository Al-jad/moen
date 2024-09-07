<template>
  <div class="min-h-screen bg-gray-100">
    <div class="w-full">
      <imgSlider />
    </div>
    <main class="container mx-auto py-8">
      <div class="mb-12">
        <CardContainer />
      </div>
      <div class="container mx-auto flex flex-col gap-6 py-8">
        <h1 class="text-left sm:text-center sm:text-xl text-2xl font-extrabold">
          Environmental Monitoring Center</h1>
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
      <div class="container flex flex-col gap-6 py-8">
        <h1 class="text-left sm:text-center sm:text-xl text-2xl font-extrabold">
          Environmental Determinants
        </h1>
        <div class="flex flex-col gap-6 container mx-auto">
          <Content
          title="Water Quality"
          description="Water quality is a critical environmental determinant that affects human health and ecosystems. It encompasses various parameters such as pH, dissolved oxygen, nutrients, and contaminants."
          image="/assets/img/water-quality.jpg"
          alt="Water Quality"
        />
        <Content
          title="Air Quality"
          description="Air quality is a key environmental determinant influencing respiratory health and climate. It involves measuring pollutants like particulate matter, ozone, and nitrogen dioxide in the atmosphere."
          image="/assets/img/ambient-air.jpg"
          alt="Air Quality"
        />
        <Content
          title="Soil Contamination"
          description="Soil contamination is an important environmental determinant affecting agriculture and ecosystem health. It involves the presence of chemicals or other alterations in the natural soil environment."
          image="/assets/img/heavy-metals.jpeg"
          alt="Soil Contamination"
        />
        <Content
          title="Biodiversity"
          description="Biodiversity is a crucial environmental determinant that indicates ecosystem health. It refers to the variety of plant and animal life in a particular habitat, including endangered species and habitat preservation."
          image="/assets/img/emissions.jpeg"
          alt="Biodiversity"
        />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({
  title: 'MOEN | Online Data App'
});
</script>
