// Layout
import NavBarAdmin from '@/layout/navbarAdmin.vue'
import NavBarUser from '@/layout/navbarUser.vue'
import AuthLayout from '@/layout/authAdminLayout.vue'
//Auth
import RegisterPage from '@/page/auth/registerPage'
import Login from '@/page/auth/loginPage.vue'
import UserMenagePage from '@/page/user_menage/userMenagePage'
// Course 
import Kingdom from '@/components/admin/kingdomPage.vue'
import CourseCreate from '@/page/course/courseCreate'
import CourseList from '@/page/course/courseList'
import CourseDetail from '@/page/course/courseDetail'
// Finance
import FinanceList from '@/page/finance/financeList'
import FinanceDetail from '@/page/finance/financeDetail'
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


const routes = [
  {
    path: '/auth',
    name: 'authLayout',
    component: AuthLayout,
    children:[
      {
        path: '/',
        name: 'Login',
        component: Login,
      },
      {
        path: '/register',  
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
        path: '/menage',  
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
        path: '/',  
        name: 'UserKingdom',
        component: UserKingdom,
      },
      {
        path: '/course/list/:kingdom_id',  
        name: 'userCourseList_kingdomID',
        component: userCourseList,
      },
      {
        path: '/course/detail/:course_id',  
        name: 'userCourseDetail_courseID',
        component: userCourseDetail,
      },
      {
        path: '/course/package/:course_id',  
        name: 'userCoursePackage_courseID',
        component: userCoursePackage,
      },
      {
        path: '/course/package/:course_id/:package_id/:option_id',  
        name: 'userCourseOrder_courseID_packageID_optionID',
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