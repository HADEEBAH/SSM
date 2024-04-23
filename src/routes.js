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
import ProfileRules from '@/page/user/profile/profileRules.vue'
// studentCourse
import StudentsSchedule from '@/page/user/studentsCourse/studentsSchedule.vue'
import StudentCourse from '@/page/user/studentsCourse/studentCourse.vue'
import StudentBookedDetail from '@/page/user/studentsCourse/studentBookedDetail.vue'
//order
import orderHistory from '@/page/user/order/orderHistory.vue'
import callback from '@/page/callback/loginShareToken.vue'
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
// admin dashboard
import Dashboard from '@/page/admin/dashboard/dashboardList.vue'
import StudentList from '@/page/admin/dashboard/studentList.vue'
// admin course reserve
import manageCourseReserve from '@/page/admin/courseReserve/manageCourseReserve.vue'
// portfolio
import FrontPortfolio from '@/page/pdf/FrontPortfolio.vue'
import PortfolioDetail from '@/page/pdf/portfolioDetail.vue'
//PageNotFound
import PageNotFound from '@/page/pageNotFound.vue'
import ForgotPassword from './page/forgotPassword.vue'
import ResetPassword from './page/resetPassword.vue'
//ManageCheckInLater
import ManageCheckInLater from './page/admin/checkIn/checkInOrder.vue'
import AdminCheckin from './page/admin/checkIn/adminCheckin.vue'
//IMPORT USER
import ImportUser from './page/admin/importUser/importUser.vue'
//SATISFACTION 
import satisfactionReport from './page/admin/satisfaction/satisfactionReport.vue'
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
        path: '/register',
        name: 'Register',
        component: RegisterPage,
      },
      {
        path: '/pageNotFound',
        name: 'PageNotFound',
        component: PageNotFound,
      },
      {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
      },
      {
        path: '/reset-password',
        name: 'ResetPassword',
        component: ResetPassword,
      },
    ]
  },

  {
    path: '/admin',
    name: 'Admin',
    component: NavBarAdmin,
    children: [
      {
        path: 'satisfactionReport',
        name: 'satisfactionReport',
        component: satisfactionReport,
      },
      {
        path:"ManageCheckInLater",
        name:"ManageCheckInLater",
        component:ManageCheckInLater,
      },
      {
        path:"adminCheckin",
        name:"AdminCheckin",
        component:AdminCheckin,
      },
      {
        path: 'courseReserve',
        name: 'CourseReserveList',
        component: manageCourseReserve,
      },
      {
        path: 'userCreate',
        name: 'UserCreate',
        component: UserCreate,
      },
      {
        path: 'userDetail/:from/:action/:account_id',
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
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'studentList',
        name: 'StudentList',
        component: StudentList,
      },
      {
        path: 'importUser',
        name: 'importUser',
        component: ImportUser,
      }
    ]
  },
  {
    path: '/callback/:page',
    name: 'callback',
    component: callback,
  },
  {
    path: '/frontPortfolio/:account_id',
    name: 'FrontPortfolio',
    component: FrontPortfolio,
  },
 
  // user
  {
    path: '/',
    name: 'NavBarUser',
    component: NavBarUser,
    children: [
      {
        path: '/errorPortfolio',
        name: 'errorPortfolio',
        component: PortfolioDetail,
      },
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
        path: 'menage-course/detail/:courseId/:date/:timeId/:timeStart/:timeEnd/:typeEvent',
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
        path: 'profileCertificate/:account_id',
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
        path: 'profileRules',
        name: 'ProfileRules',
        component: ProfileRules,
      },
      {
        path: 'studentsSchedule/:action',
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