<template>
  <div class="flex flex-col min-h-screen">
    <div class="w-full bg-DarkBlue text-white">
      <div class="container sm:p-0">
        <Menubar :pt="{ root: { class: '!bg-DarkBlue !border-none' } }">
          <template #start>
            <NuxtLink to="/" class="flex flex-row">
              <div class="m-auto">
                <div class="aspect-square h-12 w-12">
                  <img
                    src="/assets/img/moen.png"
                    class="h-full w-full rounded-full object-cover"
                    alt="Logo"
                  />
                </div>
              </div>
              <div class="flex flex-row text-white">
                <div class="flex flex-col items-start justify-center px-4 py-2">
                  <p class="text-left text-2xl font-semibold sm:text-lg">Ministry of Environment</p>
                </div>
              </div>
            </NuxtLink>
          </template>
          <template #end>
            <NuxtLink to="/" class="flex flex-row text-white sm:hidden">
              <div class="flex flex-row">
                <div class="flex flex-col items-end justify-center px-4 py-2">
                  <p class="text-left font-semibold sm:text-sm">Minister's Council</p>
                  <p class="text-left text-sm sm:text-xs">Republic of Iraq</p>
                </div>
              </div>
              <div class="m-auto">
                <div class="aspect-square h-12 w-12">
                  <img
                    src="/assets/img/MinisterLogo.png"
                    class="h-full w-full object-cover"
                    alt="Minister Logo"
                  />
                </div>
              </div>
            </NuxtLink>
          </template>
        </Menubar>
      </div>
    </div>
    <div class="flex-grow">
      <slot />
    </div>
    <footer class="bg-DarkBlue text-white py-6">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap justify-between items-center">
          <div class="w-full md:w-1/3 mb-4 md:mb-0">
            <h3 class="text-lg font-semibold mb-2">Ministry of Environment</h3>
            <p class="text-sm">Republic of Iraq</p>
          </div>
          <div class="w-full md:w-1/3 mb-4 md:mb-0">
            <h3 class="text-lg font-semibold mb-2">Quick Links</h3>
            <ul class="text-sm">
              <li><NuxtLink to="/" class="hover:text-gray-300">Home</NuxtLink></li>
              <li><NuxtLink to="/water-quality" class="hover:text-gray-300">Water Quality</NuxtLink></li>
              <li><NuxtLink to="/about" class="hover:text-gray-300">About Us</NuxtLink></li>
            </ul>
          </div>
          <div class="w-full md:w-1/3">
            <h3 class="text-lg font-semibold mb-2">Contact Us</h3>
            <p class="text-sm">Email: info@moen.gov.iq</p>
            <p class="text-sm">Phone: +964 123 456 789</p>
          </div>
        </div>
        <div class="mt-6 text-center text-sm">
          <p>&copy; {{ new Date().getFullYear() }} Ministry of Environment. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
