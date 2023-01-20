import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/routes'

Vue.use(VueRouter)

// const routes = [
//   {
//     path: '/',
//     name: 'Nav',
//     component: NavBar,
//     children:[
//       {
//         path: '/',
//         name: 'Hello',
//         component: Hello,
//       }
//     ]
//   },
// ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
