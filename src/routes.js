// Layout
import NavBarAdmin from '@/layout/navbarAdmin.vue'
import NavBarUser from '@/layout/navbarUser.vue'
import AuthLayout from '@/layout/authAdminLayout.vue'
//Auth
import RegisterPage from '@/page/auth/registerPage'
import Login from '@/page/auth/loginPage.vue'
import UserMenagePage from '@/page/admin/user_menage/userMenagePage'
// Course 
import Kingdom from '@/components/admin/kingdomPage.vue'
import CourseCreate from '@/page/admin/course/courseCreate'
import CourseList from '@/page/admin/course/courseList'
import CourseDetail from '@/page/admin/course/courseDetail'
// Finance
import FinanceList from '@/page/admin/finance/financeList'
import FinanceDetail from '@/page/admin/finance/financeDetail'
// Manage User  
import Student from '@/components/admin/createStudent.vue'
import Manageuser from '@/components/admin/manageUsers.vue'
//User
import UserKingdom from '@/page/user/catagory/userKingdom.vue'
import CartList from '@/page/user/cart/cartList.vue'
//auth
import UserLoginPage from '@/page/auth/userLoginPage'

//User Course 
import userCourseList from '@/page/user/course/userCourseList'
import userCourseDetail from '@/page/user/course/userCourseDetail'
import userCoursePackage from '@/page/user/course/userCoursePackage'
import userCourseOrder from '@/page/user/course/userCourseOrder'
<<<<<<< HEAD
//User menage Course 
import userMenageCourse from '@/page/user/coach/menageCourse'
=======


>>>>>>> develop
const routes = [
  {
    path: '/auth',
    name: 'authLayout',
    component: AuthLayout,
    children:[
      {
        path: '',
        name: 'Login',
        component: Login,
      },
      {
        path: 'register',  
        name: 'Register',
        component: RegisterPage,
      },
    ]
  },
  {
    path: '/userlogin',
    name: 'UserLoginPage',
    component: UserLoginPage,
  },

  {
    path: '/admin',
    name: 'Nav',
    component: NavBarAdmin,
    children:[
      {
        path: 'menage',  
        name: 'UserMenagePage',
        component: UserMenagePage,
      },
      {
        path: 'course/create',  
        name: 'CourseCreate',
        component: CourseCreate,
      },
      {
        path: 'course/:course_id',  
        name: 'Course_courseID',
        component: CourseDetail,
      },
      {
        path: 'course',  
        name: 'CourseList',
        component: CourseList,
      },
      {
        path: 'kingdom',
        name: 'Kingdom',
        component: Kingdom,
      },
      {
        path: 'student',
        name: 'Student',
        component: Student,
      },
      {
        path: 'manageuser',
        name: 'Manageuser',
        component: Manageuser,
      },
      {
        path: 'finance',
        name: 'Finance',
        component: FinanceList,
      },
      {
        path: 'finance/:order_id',
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
        path: '',  
        name: 'UserKingdom',
        component: UserKingdom,
      },
      {
        path: 'menage-course',  
        name: 'menageCourse',
        component: userMenageCourse,
      },
      {
        path: 'courses',  
        name: 'userCourseList',
        component: userCourseList,
      },
      {
        path: 'course/detail',  
        name: 'userCourseDetail',
        component: userCourseDetail,
      },
      {
        path: 'course/package',  
        name: 'userCoursePackage',
        component: userCoursePackage,
      },
      {
        path: 'course/order',  
        name: 'userCourseOrder',
        component: userCourseOrder,
      },
      {
        path: '/cartList',  
        name: 'CartList',
        component: CartList,
      },
    ]
  },
]


export default routes