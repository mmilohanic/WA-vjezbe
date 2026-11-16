<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { ikoneSastojaka } from '../data/sastojci'

const route = useRoute()
const pizza = ref(null)

onMounted(async () => {
  const res = await axios.get(`http://localhost:3000/pizze/${route.params.naziv}`)
  pizza.value = res.data
})
</script>

<template>
  <div class="min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
    <div class="max-w-md mx-auto text-white justify-center">
      <button
        class="mb-4 px-4 py-2 rounded-xl outline-2 outline-slate-700 not-hover:text-slate-700 hover:outline-none hover:bg-slate-600 cursor-pointer font-semibold"
        @click="$router.go(-1)"
      >
        Natrag na popis
      </button>

      <div v-if="pizza" class="bg-slate-700 rounded-xl overflow-hidden">
        <img :src="pizza.slika_url" :alt="pizza.naziv" class="w-full h-56 object-cover" />

        <div class="p-6">
          <h2 class="text-2xl font-bold text-orange-400 mb-4">{{ pizza.naziv }}</h2>
          <hr class="mt-3 mb-5" />
          <ul class="grid grid-cols-2 gap-x-4 gap-y-2">
            <li v-for="sastojak in pizza.sastojci" :key="sastojak" class="flex items-center gap-3">
              <div
                class="w-8 h-8 shrink-0 bg-orange-500 rounded-full flex items-center justify-center"
              >
                <v-icon :name="ikoneSastojaka[sastojak]" />
              </div>
              <span class="capitalize">{{ sastojak }}</span>
            </li>
          </ul>
          <hr class="mt-5 mb-3" />
          <div class="space-y-2">
            <div
              v-for="(cijena, velicina) in pizza.cijene"
              :key="velicina"
              class="flex justify-between"
            >
              <span class="font-medium capitalize">{{ velicina }}</span>
              <span class="text-orange-400 font-semibold">{{ cijena }} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
