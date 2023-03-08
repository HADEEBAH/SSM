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



Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    RegisterModules: RegisterModules,
    CourseModules: CourseModules,
    FinanceModules: FinanceModules,
    OrderModules: OrderModules,
    loginModules: loginModules,
    NavberUserModules: NavberUserModules,
    CartListModules: CartListModules,
    UserManageModules: UserManageModules,
    CategoryModules: CategoryModules,
    ProfileModules: ProfileModules,


  }
})

export default store