<template>
  <div class="flex min-h-screen flex-col">
    <header class="w-full bg-DarkBlue text-white">
      <div class="container mx-auto">
        <Menubar :pt="{ root: { class: '!bg-DarkBlue !border-none' } }">
          <template #start>
            <NuxtLink
              href="/"
              class="flex items-center transition-opacity duration-300 hover:opacity-60"
            >
              <div class="mr-4">
                <img
                  src="/assets/img/moen.png"
                  class="h-12 w-12 rounded-full object-cover"
                  alt="Ministry of Environment Logo"
                />
              </div>
              <div class="text-white">
                <h1 class="text-xl font-semibold sm:text-base">Ministry of Environment</h1>
                <p class="text-sm hidden sm:block">Republic of Iraq</p>
              </div>
            </NuxtLink>
          </template>
          <template #end>
            <NuxtLink
              to="/"
              class="flex items-center text-white transition-opacity duration-300 hover:opacity-80 sm:hidden"
            >
              <div class="mr-4 text-right">
                <p class="font-semibold">Minister's Council</p>
                <p class="text-sm">Republic of Iraq</p>
              </div>
              <div>
                <img
                  src="/assets/img/MinisterLogo.png"
                  class="h-12 w-12 object-cover"
                  alt="Minister's Council Logo"
                />
              </div>
            </NuxtLink>
          </template>
        </Menubar>
      </div>
    </header>
    <main class="flex-grow">
      <slot />
    </main>
    <footer class="bg-DarkBlue py-8 text-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 class="mb-4 text-lg font-semibold">Ministry of Environment</h3>
            <p class="text-sm">Republic of Iraq</p>
          </div>
          <div>
            <h3 class="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/" class="transition-colors duration-300 hover:text-gray-300">
                  Home
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/water-quality"
                  class="transition-colors duration-300 hover:text-gray-300"
                >
                  Water Quality
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/" class="transition-colors duration-300 hover:text-gray-300">
                  About Us
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="mb-4 text-lg font-semibold">Contact Us</h3>
            <p class="mb-2 text-sm">
              Email:
              <a href="mailto:info@moen.gov.iq" class="hover:underline">info@moen.gov.iq</a>
            </p>
            <p class="text-sm">Phone: +964 123 456 789</p>
          </div>
        </div>
        <div class="mt-8 text-center text-sm">
          <p>&copy; {{ new Date().getFullYear() }} Ministry of Environment. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
