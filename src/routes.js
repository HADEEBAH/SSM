import NavBar from '@/layout/navbarUser.vue';
import Hello from '@/components/helloWorld.vue';

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
]

export default routes