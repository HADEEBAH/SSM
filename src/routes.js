// Layout
import NavBarAdmin from '@/layout/navbarAdmin.vue'
import NavBarUser from '@/layout/navbarUser.vue'
import AuthLayout from '@/layout/authAdminLayout.vue'
//Auth
import RegisterPage from '@/page/auth/registerPage'
import Login from '@/page/auth/loginPage.vue'
import UserCreate from '@/page/admin/user_menage/userCreate'
import UserDetail from '@/page/admin/user_menage/userDetail'
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
import UserList from '@/components/admin/userList.vue'
//User
import UserKingdom from '@/page/user/catagory/userKingdom.vue'
import CartList from '@/page/user/cart/cartList.vue'
//auth
// import UserLoginPage from '@/page/auth/userLoginPage'

//User Course 
import userCourseList from '@/page/user/course/userCourseList'
import userCourseDetail from '@/page/user/course/userCourseDetail'
import userCoursePackage from '@/page/user/course/userCoursePackage'
import userCourseOrder from '@/page/user/course/userCourseOrder'
//User menage Course 
import userMenageCourse from '@/page/user/coach/menageCourse'
import userMenageCourseDetail from '@/page/user/coach/menageCourseDetail'
const routes = [
  {
    path: '/auth',
    name: 'authLayout',
    component: AuthLayout,
    children:[
      {
        path: '/login',
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
  // {
  //   path: '/userlogin',
  //   name: 'UserLoginPage',
  //   component: UserLoginPage,
  // },

  {
    path: '/admin',
    name: 'Admin',
    component: NavBarAdmin,
    children:[
      {
        path: 'userCreate',  
        name: 'UserCreate',
        component: UserCreate,
      },
      {
        path: 'userDetail/:action/:account_id',  
        name: 'UserDetail',
        component: UserDetail,
      },
      {
        path: 'userList',
        name: 'UserList',
        component: UserList,
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
        path: 'menage-course/detail',  
        name: 'menageCourseDetail',
        component: userMenageCourseDetail,
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
        path: 'cartList',  
        name: 'CartList',
        component: CartList,
      },
    ]
  },
]


export default routes