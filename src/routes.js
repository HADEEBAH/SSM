// Layout
import NavBarAdmin from '@/layout/navbarAdmin.vue'
import NavBarUser from '@/layout/navbarUser.vue'
import AuthLayout from '@/layout/authAdminLayout.vue'
//Auth
import RegisterPage from '@/page/auth/registerPage.vue'
import Login from '@/page/auth/loginPage.vue'
import UserCreate from '@/page/admin/user_manage/userCreate.vue'
import UserDetail from '@/page/admin/user_manage/userDetail.vue'
import UserList from '@/page/admin/user_manage/userList.vue'

// kingdom
import Kingdom from '@/page/admin/kingdom/kingdomPage.vue'
import ManageKingdom from '@/page/admin/kingdom/manageKingdom.vue';
import EditKingdom from '@/page/admin/kingdom/editKingdom.vue';
// Course 
import CourseCreate from '@/page/admin/course/courseCreate.vue'
import CourseList from '@/page/admin/course/courseList.vue'
import CourseDetail from '@/page/admin/course/courseDetail.vue'
// Finance
import FinanceList from '@/page/admin/finance/financeList.vue'
import FinanceDetail from '@/page/admin/finance/financeDetail.vue'
// Manage User  
import Student from '@/page/admin/addStudent/createStudent.vue'
//User
import UserKingdom from '@/page/user/catagory/userKingdom.vue'
import CartList from '@/page/user/cart/cartList.vue'
//userProfile 
import ProfileRelations from '@/page/user/profile/profileRelations.vue'
import ProfileDetail from '@/page/user/profile/profileDetail.vue'
import UserProfile from '@/page/user/profile/userProfile.vue'
import ProfileCertificate from '@/page/user/profile/profileCertificate.vue'
import ProfilePassword from '@/page/user/profile/profilePassword.vue'
import ProfileResetPassword from '@/page/user/profile/profileResetPassword.vue'
import ProfileLanguages from '@/page/user/profile/profileLanguages.vue'
import ProfilePolicy from '@/page/user/profile/profilePolicy.vue'
import ProfileRules from '@/page/user/profile/profileRules.vue'
// studentCourse
import StudentsSchedule from '@/page/user/studentsCourse/studentsSchedule.vue'
import StudentCourse from '@/page/user/studentsCourse/studentCourse.vue'
import StudentBookedDetail from '@/page/user/studentsCourse/studentBookedDetail.vue'
//order
import orderHistory from '@/page/user/order/orderHistory.vue'
import callback from '@/page/callback/loginShareToken.vue'


//auth
// import UserLoginPage from '@/page/auth/userLoginPage'

//User Course 
import userCourseList from '@/page/user/course/userCourseList.vue'
import userCourseDetail from '@/page/user/course/userCourseDetail.vue'
import userCoursePackage from '@/page/user/course/userCoursePackage.vue'
import userCourseOrder from '@/page/user/course/userCourseOrder.vue'
import userCoursePayment from '@/page/user/course/userCoursePayment.vue'
//User menage Course 
import userMenageCourse from '@/page/user/coach/manageCourse'
import userMenageCourseDetail from '@/page/user/coach/manageCourseDetail'
// coach leave
import LeaveList from '@/page/admin/coachLeave/leaveList.vue'
import LeaveDetail from '@/page/admin/coachLeave/leaveDetail.vue'
// admin calendar
import ManageSchedule from '@/page/admin/scheduleCalendar/manageSchedule.vue'
// admin banner
import Banner from '@/page/admin/banner/manageBanner.vue'


const routes = [
  {
    path: '/auth',
    name: 'authLayout',
    component: AuthLayout,
    children: [
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
    children: [
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
        path: 'manageKingdom',
        name: 'ManageKingdom',
        component: ManageKingdom,
      },
      {
        path: 'editKingdom/:category_id',
        name: 'EditKingdom',
        component: EditKingdom,
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
      },
      {
        path: 'leavelist',
        name: 'LeaveList',
        component: LeaveList,
      },
      {
        path: 'leave/:coachleave_id',
        name: 'LeaveDetail_coachleaveId',
        component: LeaveDetail,
      },
      {
        path: 'manageSchedule',
        name: 'ManageSchedule',
        component: ManageSchedule,
      },
      {
        path: 'banner',
        name: 'Banner',
        component: Banner,
      },

    ]
  },
  {
    path: '/callback/:page',
    name: 'callback',
    component: callback,
  },

  // user
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
        path: 'menage-course/detail/:courseId/:timeId/:dayOfWeekId/:date',
        name: 'menageCourseDetail',
        component: userMenageCourseDetail,
      },
      {
        path: 'course/category/:category_id',
        name: 'userCourseList_categoryId',
        component: userCourseList,
      },
      {
        path: 'course/detail/:course_id',
        name: 'userCourseDetail_courseId',
        component: userCourseDetail,
      },
      {
        path: 'course/package/:course_id',
        name: 'userCoursePackage_courseId',
        component: userCoursePackage,
      },
      {
        path: 'course/order',
        name: 'userCourseOrder',
        component: userCourseOrder,
      },
      {
        path: 'course/payment',
        name: 'userCoursePayment',
        component: userCoursePayment,
      },
      {
        path: 'cartList',
        name: 'CartList',
        component: CartList,
      },
      {
        path: 'profileRelations/:action',
        name: 'ProfileRelations',
        component: ProfileRelations,
      },
      {
        path: 'profileDetail/:profile_id',
        name: 'ProfileDetail',
        component: ProfileDetail,
      },
      {
        path: 'userProfile',
        name: 'UserProfile',
        component: UserProfile,
      },
      {
        path: 'profileCertificate',
        name: 'ProfileCertificate',
        component: ProfileCertificate,
      },
      {
        path: 'profilePassword',
        name: 'ProfilePassword',
        component: ProfilePassword,
      },
      {
        path: 'profileResetPassword',
        name: 'ProfileResetPassword',
        component: ProfileResetPassword,
      },
      {
        path: 'profileLanguages',
        name: 'ProfileLanguages',
        component: ProfileLanguages,
      },
      {
        path: 'profilePolicy',
        name: 'ProfilePolicy',
        component: ProfilePolicy,
      },
      {
        path: 'profileRules',
        name: 'ProfileRules',
        component: ProfileRules,
      },
      {
        path: 'studentsSchedule',
        name: 'StudentsSchedule',
        component: StudentsSchedule,
      },
      {

        path: 'studentCourse/:course_id',
        name: 'StudentCourse',
        component: StudentCourse,
      },
      {
        path: 'studentBookedDetail',
        name: 'StudentBookedDetail',
        component: StudentBookedDetail,
      },
      {
        path: 'order/history',
        name: 'orderHistory',
        component: orderHistory,
      },

    ]
  },


]


export default routes