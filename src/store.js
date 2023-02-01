import Vue from 'vue'
import Vuex from 'vuex'
import RegisterModules from '@/store_modules/registerModules'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    RegisterModules: RegisterModules,
  }
})

export default store