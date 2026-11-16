<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const props = defineProps({
  odabranaPizza: {
    type: Object,
    required: true,
  },
  svePizze: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['close'])
const prikaziObrazac = ref(false)

const narucene_pizze = ref([])
const odabranaVelicina = ref('mala')
const kolicina = ref(1)
const imePrezime = ref('')
const adresa = ref('')
const telefon = ref('')
const resPoruka = ref('')
const resStatus = ref(null)
const resNarudzba = ref(null)

const cijenaPizze = (naziv, velicina) =>
  props.svePizze.find((p) => p.naziv === naziv)?.cijene[velicina]

const ukupna_cijena_stavke = computed(() => {
  const cijenaPoKomadu = props.odabranaPizza.cijene[odabranaVelicina.value]
  return (cijenaPoKomadu * kolicina.value).toFixed(2)
})

const racunUkupno = computed(() =>
  narucene_pizze.value.reduce((a, v) => a + cijenaPizze(v.naziv, v.velicina) * v.kolicina, 0),
)

function dodajUNarudzbu() {
  let naziv = props.odabranaPizza.naziv
  let velicina = odabranaVelicina.value

  let postoji = narucene_pizze.value.findIndex((p) => p.naziv === naziv && p.velicina === velicina)
  if (postoji !== -1) {
    narucene_pizze.value[postoji].kolicina += kolicina.value
  } else {
    narucene_pizze.value.push({
      naziv: naziv,
      velicina: velicina,
      kolicina: kolicina.value,
    })
  }
}

async function posaljiNarudzbu() {
  try {
    const odgovor = await axios.post('http://localhost:3000/narudzbe', {
      narucene_pizze: narucene_pizze.value,
      podaci_dostava: {
        prezime: imePrezime.value,
        adresa: adresa.value,
        telefon: telefon.value,
      },
    })
    resStatus.value = odgovor.status
    resPoruka.value = odgovor.data.message
    resNarudzba.value = odgovor.data.narudzba
  } catch (error) {
    resStatus.value = error.response?.status ?? 503
    resPoruka.value = error.response?.data?.message ?? 'Server je trenutno nedostupan.'
    resNarudzba.value = null
  }
}
</script>

<template>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-slate-700 backdrop-blur-sm border-t border-slate-600 shadow-xl p-4 sm:p-6 text-white"
  >
    <button
      class="absolute top-2 right-2 text-slate-300 hover:text-white text-xl font-bold cursor-pointer"
      @click="emit('close')"
    >
      ×
    </button>

    <div v-if="!resStatus || resStatus !== 201">
      <!-- ODABIR PIZZE -->
      <div v-if="!prikaziObrazac">
        <div
          class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 sm:gap-6"
        >
          <!-- Slika pizze i naziv -->
          <div
            class="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2 w-full sm:w-auto"
          >
            <img
              :src="odabranaPizza.slika_url"
              alt="slika ovdje"
              class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md shadow-black/40"
            />

            <div>
              <h3 class="font-bold tracking-wide text-base sm:text-lg text-orange-400">
                {{ odabranaPizza.naziv }}
              </h3>
            </div>
          </div>

          <!-- Odabir veličina + cijene -->
          <div
            class="flex items-center justify-center sm:justify-start flex-wrap gap-2 w-full sm:w-auto"
          >
            <button
              v-for="(cijena, velicina) in odabranaPizza.cijene"
              :key="velicina"
              :class="[
                'px-3 py-1 rounded-lg border border-slate-500 text-sm sm:text-base hover:bg-orange-500 hover:text-white transition-all cursor-pointer',
                odabranaVelicina === velicina
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-600/40 text-white',
              ]"
              @click="odabranaVelicina = velicina"
            >
              {{ velicina }} – {{ cijena }}€
            </button>
          </div>

          <!-- Odabir količine -->
          <div class="flex items-center justify-center space-x-2 w-full sm:w-auto">
            <button
              @click="kolicina > 1 ? kolicina-- : (kolicina = 1)"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
            >
              -
            </button>

            <div
              class="px-3 py-1 bg-slate-600/40 backdrop-blur-sm rounded-md border border-slate-500 text-sm sm:text-base"
            >
              {{ kolicina }}
            </div>

            <button
              @click="kolicina ? kolicina++ : (kolicina = 1)"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
            >
              +
            </button>
          </div>

          <div
            class="w-full sm:w-auto text-center font-semibold text-lg text-orange-400 tracking-wide"
          >
            Ukupno: {{ ukupna_cijena_stavke || '0.00' }}€
          </div>

          <button
            @click="dodajUNarudzbu"
            class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center"
          >
            Dodaj u košaricu
          </button>
        </div>

        <button
          v-if="narucene_pizze.length"
          @click="prikaziObrazac = true"
          class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center"
        >
          Naruči
        </button>

        <div
          v-if="narucene_pizze.length"
          class="mt-4 max-w-2xl mx-auto max-h-40 overflow-y-auto bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-600"
        >
          <h4 class="font-semibold text-lg text-white mb-2">Stavke u košarici:</h4>
          <hr />
          <ul class="space-y-2">
            <li
              v-for="(stavka, index) in narucene_pizze"
              :key="index"
              class="flex items-center justify-between bg-slate-700/50 rounded-md p-2"
            >
              <div class="text-white">
                {{ stavka.naziv }} ({{ stavka.velicina }}) x{{ stavka.kolicina }}
              </div>
              <div class="text-orange-400 font-semibold flex items-center gap-2">
                {{ (cijenaPizze(stavka.naziv, stavka.velicina) * stavka.kolicina).toFixed(2) }}€
                <button
                  class="text-slate-300 hover:text-white text-xl font-bold cursor-pointer"
                  @click="narucene_pizze.splice(index, 1)"
                >
                  ×
                </button>
              </div>
            </li>
          </ul>
          <hr />
          <h4 class="flex justify-end pt-3 font-semibold text-lg text-white mb-2">
            Ukupno:&emsp;{{ racunUkupno.toFixed(2) }} €&emsp;
          </h4>
        </div>
      </div>

      <!-- PODACI ZA DOSTAVU -->
      <form v-else @submit.prevent="posaljiNarudzbu" class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center">
          <h3
            class="font-bold tracking-wide text-base sm:text-lg text-orange-400 mb-4 text-center sm:text-left"
          >
            Podaci za dostavu
          </h3>
          <span
            v-if="resStatus && resStatus !== 201"
            class="font-bold tracking-wide text-lg text-red-500"
            >{{ resPoruka }}</span
          >
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm text-slate-300 mb-1">Ime i prezime</label>
            <input
              type="text"
              required
              oninvalid="this.setCustomValidity('Obavezan unos imena i prezimena!')"
              oninput="this.setCustomValidity('')"
              placeholder="Ime Prezime"
              class="w-full px-3 py-2 rounded-lg bg-slate-600/40 border border-slate-500 text-white placeholder-slate-400 outline-none focus:border-orange-500 transition-all"
              v-model="imePrezime"
            />
          </div>

          <div>
            <label class="block text-sm text-slate-300 mb-1">Adresa</label>
            <input
              type="text"
              required
              oninvalid="this.setCustomValidity('Obavezan unos adrese za dostavu!')"
              oninput="this.setCustomValidity('')"
              placeholder="Ulica i kućni broj, grad"
              class="w-full px-3 py-2 rounded-lg bg-slate-600/40 border border-slate-500 text-white placeholder-slate-400 outline-none focus:border-orange-500 transition-all"
              v-model="adresa"
            />
          </div>

          <div>
            <label class="block text-sm text-slate-300 mb-1">Telefon</label>
            <input
              type="tel"
              required
              oninvalid="this.setCustomValidity('Obavezan unos kontakt telefona!')"
              oninput="this.setCustomValidity('')"
              placeholder="091 234 5678"
              class="w-full px-3 py-2 rounded-lg bg-slate-600/40 border border-slate-500 text-white placeholder-slate-400 outline-none focus:border-orange-500 transition-all"
              v-model="telefon"
            />
          </div>
        </div>

        <div class="flex justify-between gap-4 mt-6">
          <button
            type="button"
            @click="prikaziObrazac = false"
            class="px-4 py-2 rounded-xl border border-slate-500 bg-slate-600/40 text-white font-semibold hover:bg-slate-600 transition-all cursor-pointer"
          >
            Odustani
          </button>

          <button
            type="submit"
            class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer"
          >
            Pošalji narudžbu
          </button>
        </div>
      </form>
    </div>

    <div v-else class="mt-4 max-w-2xl mx-auto max-h-80">
      <div class="flex justify-between items-center font-semibold text-white text-xl">
        <span>{{ resPoruka }}</span>

        <span>Račun ukupno: {{ resNarudzba.ukupna_cijena }} €</span>
      </div>
      <hr class="my-2" />
      <div class="flex justify-between items-center text-lg text-white">
        <span class="font-semibold">Podaci za dostavu:</span>
        <span>
          {{
            resNarudzba.podaci_dostava.prezime +
            ', ' +
            resNarudzba.podaci_dostava.adresa +
            ', ' +
            resNarudzba.podaci_dostava.telefon
          }}
        </span>
      </div>
      <div
        class="mt-4 max-w-2xl mx-auto max-h-40 overflow-y-auto bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-600"
      >
        <ul class="space-y-2">
          <li
            v-for="(stavka, index) in resNarudzba.narucene_pizze"
            :key="index"
            class="flex items-center justify-between bg-slate-700/50 rounded-md p-2"
          >
            <div class="text-white">
              {{ stavka.naziv }} ({{ stavka.velicina }}) x{{ stavka.kolicina }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
