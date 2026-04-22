<template>
  <footer class="bg-[#0A0F1F] border-t border-gray-800 mt-auto">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-[#F7C600] rounded-lg flex items-center justify-center">
              <span class="text-[#0A0F1F] font-bold text-xl">C</span>
            </div>
            <span class="text-white font-bold text-xl">Cinema</span>
          </div>
          <p class="text-gray-400 text-sm">
            La teva experiència cinematogràfica definitiva. Compra les teves entrades fàcilment i gaudeix de les millors pel·lícules.
          </p>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">Enllaços ràpids</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/movies" class="text-gray-400 hover:text-[#F7C600] transition-colors">
                Pel·lícules
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/tickets" class="text-gray-400 hover:text-[#F7C600] transition-colors">
                Les meves entrades
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">Legal</h4>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-400 hover:text-[#F7C600] transition-colors">
                Termes i condicions
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-[#F7C600] transition-colors">
                Política de privacitat
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-[#F7C600] transition-colors">
                Política de cookies
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">Contacte</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
              info@cinema.cat
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-phone" class="w-4 h-4" />
              900 123 456
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
        © {{ new Date().getFullYear() }} Cinema. Tots els drets reservats.
      </div>
    </div>
  </footer>
</template>
