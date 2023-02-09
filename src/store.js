import Vue from 'vue'
import Vuex from 'vuex'
import RegisterModules from '@/store_modules/registerModules'
import CourseModules from '@/store_modules/courseModules'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    RegisterModules: RegisterModules,
    CourseModules: CourseModules,
  }
})

export default store