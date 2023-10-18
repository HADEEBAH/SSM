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

  if(to.query.token){
    VueCookie.delete("token")
    localStorage.removeItem("userDetail")
    localStorage.removeItem("Order")
    localStorage.removeItem("relations")
  }
  if (!VueCookie.get("token")) {
    localStorage.removeItem("userDetail")
  }
  if (!to.name) {
    next({ name: 'PageNotFound' })
  } else {
    if (to.name !== "Login" && to.name !== "Register" && to.name !== "PageNotFound" && to.name !== "portfolio_account_Id" && to.name !== "ForgotPassword" && to.name !== "ResetPassword") {
      if (to.name === "callback") {
        next()
      } else if (to.matched[0].name !== "NavBarUser" && !VueCookie.get("token")) {
        next({ name: 'Login' })
      } else if (to.name === 'userCourseOrder' && !VueCookie.get("token")) {
        next({ name: 'Login' })
      } else if (VueCookie.get("token")) {
        
        let order = JSON.parse(localStorage.getItem("Order"))
        let user_detail = JSON.parse(localStorage.getItem("userDetail"))
        if(from.name !== 'ProfileDetail' && !user_detail.first_name_th && !user_detail.last_name_th && to.name!=='ProfileDetail'){
          next({ name: 'ProfileDetail', params: {profile_id: user_detail.account_id}})
        }
        if (to.name === "userCourseDetail_courseId" || to.name === "userCoursePackage_courseId" || to.name === "userCourseOrder") {
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
          if (user_detail?.roles.includes("R_2") || user_detail?.roles.includes("R_1")) {
            next()
          } else {
            next({ name: 'UserKingdom' })
          }
        } else {
          if (!to.name || to.name === "PageNotFound") {
            next({ name: 'PageNotFound' })
          } else {
            next()
          }
        }
      } else {
        next()
      }
    } else {
      if(to.name == 'portfolio_account_Id'){
        next()
      }else{
        if (VueCookie.get("token") && (to.name === "Login" || to.name === "Register")) {
          next({ name: 'UserKingdom' })
        } else {
          next()
        }
      }
     
    }
  }
})


export default router
