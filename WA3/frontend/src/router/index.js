import { createRouter, createWebHistory } from 'vue-router'
import PizzaListView from '../../views/PizzaListView.vue'
import PizzaView from '../../views/PizzaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/pizze',
    },
    {
      path: '/pizze',
      name: 'pizze',
      component: PizzaListView,
    },
    {
      path: '/pizze/:naziv',
      name: 'pizza',
      component: PizzaView,
    },
  ],
})

export default router
