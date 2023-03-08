// Layout
import NavBarAdmin from '@/layout/navbarAdmin.vue'
import NavBarUser from '@/layout/navbarUser.vue'
import AuthLayout from '@/layout/authAdminLayout.vue'
//Auth
import RegisterPage from '@/page/auth/registerPage.vue'
import Login from '@/page/auth/loginPage.vue'
import UserCreate from '@/page/admin/user_menage/userCreate.vue'
import UserDetail from '@/page/admin/user_menage/userDetail.vue'
// Course 
import Kingdom from '@/components/admin/kingdomPage.vue'
import CourseCreate from '@/page/admin/course/courseCreate.vue'
import CourseList from '@/page/admin/course/courseList.vue'
import CourseDetail from '@/page/admin/course/courseDetail.vue'
// Finance
import FinanceList from '@/page/admin/finance/financeList.vue'
import FinanceDetail from '@/page/admin/finance/financeDetail.vue'
// Manage User  
import Student from '@/components/admin/createStudent.vue'
import UserList from '@/page/admin/user_menage/userList.vue'
//User
import UserKingdom from '@/page/user/catagory/userKingdom.vue'
import CartList from '@/page/user/cart/cartList.vue'
import StudentProfile from '@/page/user/profile/studentProfile.vue'
import ParentProfile from '@/page/user/profile/parentProfile.vue'
import ParentsDetail from '@/page/user/profile/parentsDetail.vue'
import StudentsDetailInParents from '@/page/user/profile/studentsDetailInParents.vue'
//auth
// import UserLoginPage from '@/page/auth/userLoginPage'

//User Course 
import userCourseList from '@/page/user/course/userCourseList.vue'
import userCourseDetail from '@/page/user/course/userCourseDetail.vue'
import userCoursePackage from '@/page/user/course/userCoursePackage.vue'
import userCourseOrder from '@/page/user/course/userCourseOrder.vue'
//User menage Course 
import userMenageCourse from '@/page/user/coach/menageCourse.vue'
import userMenageCourseDetail from '@/page/user/coach/menageCourseDetail.vue'
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
      {
        path: 'studentProfile',  
        name: 'StudentProfile',
        component: StudentProfile,
      },
      {
        path: 'parentProfile',  
        name: 'ParentProfile',
        component: ParentProfile,
      },
      {
        path: 'parentsDetail',  
        name: 'ParentsDetail',
        component: ParentsDetail,
      },
      {
        path: 'studentsDetailInParents',  
        name: 'StudentsDetailInParents',
        component: StudentsDetailInParents,
      },
    ]
  },
]


export default routes