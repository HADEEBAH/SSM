import NavBar from '@/layout/navbarAdmin.vue';
import RegisterPage from '@/components/user_menage/registerPage'
import UserMenagePage from '@/components/user_menage/userMenagePage'

const routes = [
  {
    path: '/register',  
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/',
    name: 'Nav',
    component: NavBar,
    children:[
      {
        path: '/user/menage',  
        name: 'UserMenagePage',
        component: UserMenagePage,
      },
    ]
  },
]

export default routes