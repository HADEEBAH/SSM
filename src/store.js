import Vue from 'vue'
import Vuex from 'vuex'
import AdminMudules from '@/store_modules/adminModules'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    AdminMudules: AdminMudules,
  }
})

export default store