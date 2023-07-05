import Vue from 'vue'
import Vuex from 'vuex'
import RegisterModules from '@/store_modules/registerModules'
import CourseModules from '@/store_modules/courseModules'
import FinanceModules from '@/store_modules/financeModules'
import OrderModules from '@/store_modules/orderModules'
import loginModules from '@/store_modules/loginModule'
import NavberUserModules from '@/store_modules/navberUserModules'
import CartListModules from '@/store_modules/cartListModules'
import UserManageModules from '@/store_modules/userManageModules'
import CategoryModules from './store_modules/categoryModules'
import ProfileModules from '@/store_modules/profileModules'
import MyCourseModules from '@/store_modules/myCourseModules'
import CoachModules from '@/store_modules/coachModules'
import UserModules from '@/store_modules/userModules'
import courseMonitorModules from '@/store_modules/courseMonitorModules'
import ManageScheduleModules from '@/store_modules/manageScheduleModules'
import BannerModules from '@/store_modules/bannerModules'
import loadingModules from './store_modules/loadingModules'
import NotificationsModules from '@/store_modules/notificationsModules'
import reserveCourseModules from '@/store_modules/reserveCourseModules'
import DashboardModules from '@/store_modules/dashboardModules'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    reserveCourseModules :reserveCourseModules,
    CoachModules: CoachModules,
    RegisterModules: RegisterModules,
    CourseModules: CourseModules,
    FinanceModules: FinanceModules,
    OrderModules: OrderModules,
    LoadingModules: loadingModules,
    loginModules: loginModules,
    NavberUserModules: NavberUserModules,
    CartListModules: CartListModules,
    UserManageModules: UserManageModules,
    CategoryModules: CategoryModules,
    ProfileModules: ProfileModules,
    MyCourseModules: MyCourseModules,
    UserModules: UserModules,
    CourseMonitorModules: courseMonitorModules,
    ManageScheduleModules: ManageScheduleModules,
    BannerModules: BannerModules,
    NotificationsModules: NotificationsModules,
    DashboardModules: DashboardModules
  }
})

export default store