<template>
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
  <div>
    <slot />
  </div>
</template>
