import Kingdom from '@/components/admin/kingdomPage.vue'
import NavBarAdmin from '@/layout/navbarAdmin.vue'
import NavBarUser from '@/layout/navbarUser.vue'
import RegisterPage from '@/page/auth/registerPage'
import UserMenagePage from '@/page/user_menage/userMenagePage'
// Course 
import CourseCreate from '@/page/course/courseCreate'
import CourseList from '@/page/course/courseList'
import CourseDetail from '@/page/course/courseDetail'
// Finance
import FinanceList from '@/page/finance/financeList'
import FinanceDetail from '@/page/finance/financeDetail'
// import Hello from '@/components/helloWorld.vue';    
import Login from '@/page/auth/loginPage.vue'
import Student from '@/components/admin/createStudent.vue'
import Manageuser from '@/components/admin/manageUsers.vue'
//user
import UserKingdom from '@/page/user/catagory/userKingdom.vue'


const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',  
    name: 'Register',
    component: RegisterPage,
  },


  {
    path: '/admin',
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
        path: '/course/:course_id',  
        name: 'Course_courseID',
        component: CourseDetail,
      },
      {
        path: '/course',  
        name: 'CourseList',
        component: CourseList,
      },
      {
        path: '/kingdom',
        name: 'Kingdom',
        component: Kingdom,
      },
      {
        path: '/student',
        name: 'Student',
        component: Student,
      },
      {
        path: '/manageuser',
        name: 'Manageuser',
        component: Manageuser,
      },
      {
        path: '/finance',
        name: 'Finance',
        component: FinanceList,
      },
      {
        path: '/finance/:order_id',
        name: 'Finance_orderID',
        component: FinanceDetail,
      }
    ]
  },

  {
    path: '/',
    name: 'NavBarUser',
    component: NavBarUser,
    children: [
      {
        path: '/userKingdom',  
        name: 'UserKingdom',
        component: UserKingdom,
      },
    ]
  },
]


export default routes