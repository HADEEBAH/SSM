import Vue from 'vue'
import Vuex from 'vuex'
import RegisterModules from '@/store_modules/registerModules'
import CourseModules from '@/store_modules/courseModules'
import FinanceModules from '@/store_modules/financeModules'
import OrderModules from '@/store_modules/orderModules'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    RegisterModules: RegisterModules,
    CourseModules: CourseModules,
    FinanceModules: FinanceModules,
    OrderModules: OrderModules,
  }
})

export default store