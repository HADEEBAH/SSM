import NavBarAdmin from '@/layout/navbarAdmin.vue';
import RegisterPage from '@/components/user_menage/registerPage'
import UserMenagePage from '@/components/user_menage/userMenagePage'
// import NavBarUser from '@/layout/navbarUser.vue';
// import Hello from '@/components/helloWorld.vue';
import Login from '@/page/loginPage.vue'

const routes = [
  {
    path: '/register',  
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/',
    name: 'Nav',
    component: NavBarAdmin,
    children:[
      {
        path: '/user/menage',  
        name: 'UserMenagePage',
        component: UserMenagePage,
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  }
]

export default routes