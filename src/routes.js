import NavBar from '@/layout/navbarUser.vue';
import Hello from '@/components/helloWorld.vue';
import Login from '@/page/loginPage.vue'

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
    path: '/login',
    name: 'Login',
    component: Login,
  }
]

export default routes