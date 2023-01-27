import NavBar from '@/layout/navbarAdmin.vue';
import UserMenagePage from '@/components/user_menage/userMenagePage'

const routes = [
  {
    path: '/',
    name: 'Nav',
    component: NavBar,
    children:[
      {
        path: '/user/menage',  
        name: 'UserMenagePage',
        component: UserMenagePage,
      }
    ]
  },
]

export default routes