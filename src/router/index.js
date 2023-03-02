import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/routes'
// import VueCookie from "vue-cookie"

Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// router.beforeEach((to, from, next ) => {
//   console.log(to,from)
//   if(to.name !== "Login" && to.name !== "Register"){
//     if(to.matched[0].name !== "NavBarUser" && !VueCookie.get("token")){
//       next({name : 'Login'})
//     }else if(to.name === 'userCourseOrder' && !VueCookie.get("token")){
//       next({name : 'Login'})
//     }else{
//       next()
//     }
//   }else{
//     next()
//   }
// })


export default router
