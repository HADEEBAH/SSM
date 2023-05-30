import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/routes'
import VueCookie from "vue-cookie"

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  window.scrollTo({
    top: 0,
  })
  if (!VueCookie.get("token")) {
    localStorage.removeItem("userDetail")
  }
  if (to.name !== "Login" && to.name !== "Register") {
    if (to.name === "callback") {
      next()
    } else if (to.matched[0].name !== "NavBarUser" && !VueCookie.get("token")) {
      next({ name: 'Login' })
    } else if (to.name === 'userCourseOrder' && !VueCookie.get("token")) {
      next({ name: 'Login' })
    } else if (VueCookie.get("token")) {
      let order = JSON.parse(localStorage.getItem("Order"))
      let user_detail = JSON.parse(localStorage.getItem("userDetail"))
      console.log(from.name)
      if (to.name == "userCourseDetail_courseId" || to.name == "userCoursePackage_courseId" || to.name == "userCourseOrder") {
        console.log("order", order)
        if (order) {
          if (from.name === "Login" && order.course_id && order.category_id) {
            next()
          } else {
            next()
          }
        } else {
          next({ name: 'UserKingdom' })
        }
      } else if (to.matched[0].name === "Admin") {
        console.log("user_detail", user_detail)
        if (user_detail?.roles.includes("R_2") || user_detail?.roles.includes("R_1")) {
          next()
        } else {
          next({ name: 'UserKingdom' })
        }
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    next()
  }
})


export default router
