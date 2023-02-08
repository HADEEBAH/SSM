import Kingdom from '@/components/admin/kingdomPage.vue'
import NavBarAdmin from '@/layout/navbarAdmin.vue'
import RegisterPage from '@/page/auth/registerPage'
import UserMenagePage from '@/page/user_menage/userMenagePage'
import CourseCreate from '@/page/course/courseCreate'
import FinancePage from '@/page/finance/financePage'
import FinanceDetail from '@/page/finance/financeDetail'
// import NavBarUser from '@/layout/navbarUser.vue';
// import Hello from '@/components/helloWorld.vue';
import Login from '@/page/loginPage.vue'
import Addlearn from '@/components/admin/addlearnPage.vue'

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
      {
        path: '/course/create',  
        name: 'CourseCreate',
        component: CourseCreate,
      },
      {
        path: '/kingdom',
        name: 'Kingdom',
        component: Kingdom,
      },
      {
        path: '/addlearn',
        name: 'Addlearn',
        component: Addlearn,
      },
      {
        path: '/finance',
        name: 'Finance',
        component: FinancePage,
      },
      {
        path: '/finance/:order_id',
        name: 'Finance_orderID',
        component: FinanceDetail,
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