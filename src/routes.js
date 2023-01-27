import NavBar from '@/layout/navbarUser.vue';
import Hello from '@/components/helloWorld.vue';
import Kingdom from '@/components/admin/kingdomPage.vue'

const routes = [
  {
    path: '/',
    name: 'Nav',
    component: NavBar,
    children:[
      {
        path: '/',
        name: 'Hello',
        component: Hello,
      }
    ]
  },
  {
    path: '/kingdom',
    name: 'Kingdom',
    component: Kingdom,
  }
]

export default routes