import axios from "axios";
// import Swal from "sweetalert2";
import router from "@/router";
import VueCookie from "vue-cookie"

const orderModules = {
    namespaced: true,
    state: {
        course_order: {
            apply_for_yourself : false,
            apply_for_others : false,
            kingdom: {},
            course_type: "",
            course_type_id : "CT_1",
            category_id: "",
            package: "",
            package_data : {},
            option : "",
            option_data : "",
            period: 0,
            times_in_class: 0,
            day: "",
            time: "",
            coach: "",
            start_day: "",
            price: 0,
            detail : "",
            remark: "",
            selected : true,
            parents: [],
            students: [],

        },
        order: {
            order_step : 0,
            order_number: "",
            courses:[],
            created_by : "",
            payment_status: "",
            payment_type: "",
            total_price: 0,
        },
        orders : [],
        order_detail : {},
        order_is_loading : false,
        orders_is_loading : false,
    },
    mutations: {
        SetOrderIsLoading(state, value){
            state.order_is_loading = value
        },
        SetOrdersIsLoading(state, value){
            state.orders_is_loading = value
        },
        SetOrder(state, payload) {
            state.order = payload
        },
        SetOrders(state, payload){
            state.orders = payload
        },
        SetOrderDetail(){},
        SetOrderCourse(state, payload) {
            state.course_order = payload
        },
        SetResetCourseData(state) {
            state.course_order = {
                apply_for_yourself : false,
                apply_for_others : false,
                kingdom: {},
                course_type: "",
                course_type_id : "CT_1",
                category_id: "",
                package: "",
                package_data : {},
                option : "",
                option_data : "",
                period: 0,
                times_in_class: 0,
                day: "",
                time: "",
                coach: "",
                start_day: "",
                price: 0,
                detail : "",
                remark: "",
                selected : true,
                parents: [],
                students: [],
            }
        }
    },
    actions: {
        resetCourseData(context) {
            context.commit("SetResetCourseData")
        },
        changeCourseOrderData(context, courseData) {
            console.log("changeCourseOrderData :",courseData)
            context.commit("SetOrderCourse", courseData)
        },
        changeOrderData(context, orderData) {
            context.commit("SetOrder", orderData)
            console.log(orderData)
        },
        async GetOrders(context){
            try{
                let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order`)
                console.log(data)
                if(data.statusCode === 200){
                    context.commit("SetOrders",data.data)
                }else{
                    throw {error : data}
                }
            }catch(error){
                console.log(error)
            }
        },
        async saveCart(context, {cart_data}) {
            try{
                let order = cart_data
                console.log(order)
                let payload = {
                    order_id : "",
                    courses : {},
                    created_by : "",
                    paymentStatus: "pending",
                    paymentType: "",
                    totalPrice: 0,
                }
                let total_price = 0
                await order.courses.forEach((course)=>{
                    let students = []
                    console.log("course",course)
                    course.students.forEach((student)=>{
                        console.log("student",student.parents[0])
                        if(student.parents[0]){   
                            students.push({
                                "accountId": student.account_id ? student.account_id : "",
                                "userName": student.username,
                                "firstNameTh": student.firstname,
                                "lastNameTh": student.lastname,
                                "tel": student.tel,
                                "isOther": student.is_other,
                                "parent":{
                                    "accountId": student.parents[0].account_id,
                                    "parentFirstnameTh": student.parents[0].firstname_th ?  student.parents[0].firstname_th :"" ,
                                    "parentLastnameTh":student.parents[0].lastname_th ?  student.parents[0].lastname_th :"" ,
                                    "parentFirstnameEn":student.parents[0].firstname_en,
                                    "parentLastnameEn":student.parents[0].lastname_en,
                                    "parentTel": student.parents[0].tel,
                                }  
                            })
                        }else{
                            students.push({
                                "accountId": student.account_id ? student.account_id : "",
                                "userName": student.username,
                                "firstNameTh": student.firstname,
                                "lastNameTh": student.lastname,
                                "tel": student.tel,
                                "isOther": student.is_other,
                                "parent":{}
                            })
                        }
                    })
                    payload.courses = {
                        "courseId" :  course.course_id,
                        "courseName" : course.course_name,
                        "coursePackageOptionId": course.option.course_package_option_id ? course.option.course_package_option_id : "",
                        "dayOfWeekId": course.time.dayOfWeekId ? course.time.dayOfWeekId : "",
                        "timeId": course.time.timeId ? course.time.timeId : "",
                        "time": course.time ? course.time : "",
                        "startDate": "",
                        "remark": "",
                        "price": course.option.net_price ? course.option.net_price : course.price,
                        "coach": {
                            "accountId": course.coach_id,
                            "fullName": course.coach_name,
                        },
                        "student": students
                    }
                    let price = course.option?.net_price ? course.option.net_price : course.price
                    console.log(price, course.students.length)
                    total_price = total_price + (price * course.students.length )
                })
                payload.totalPrice = total_price
                let config = {
                  headers:{
                      "Access-Control-Allow-Origin" : "*",
                      "Content-type": "Application/json",
                      'Authorization' : `Bearer ${VueCookie.get("token")}`
                  }
                }
                console.log(payload)
                // let {data} = await axios.post(`http://localhost:3002/api/v1/order/cart`,payload, config)
                let {data} = await axios.post(`${process.env.VUE_APP_URL}/api/v1/order/cart`,payload, config)
                if(data.statusCode === 201){
                    localStorage.removeItem("Order")
                    context.commit("SetResetCourseData")
                    context.commit("SetOrder",{
                        order_step : 0,
                        order_number: "",
                        courses:[],
                        created_by : "",
                        payment_status: "",
                        payment_type: "",
                        total_price: 0,
                    })
                    router.replace({ name: "UserKingdom" });
                }
            }catch(error){
                console.log(error)
            }
        },
        async saveOrder(context) {
            context.commit("SetOrderIsLoading", true)
            try{
                let order = context.state.order
                console.log(order)
                let payload = {
                    order_id : "",
                    courses : [],
                    created_by : order.created_by,
                    paymentStatus: "pending",
                    paymentType: "",
                    totalPrice: 0,
                }
                let total_price = 0
                await order.courses.forEach((course)=>{
                    let students = []
                    course.students.forEach((student)=>{
                        if(student.parents[0]){   
                            students.push({
                                "accountId": student.account_id ? student.account_id : "",
                                "userName": student.username,
                                "firstNameTh": student.firstname,
                                "lastNameTh": student.lastname,
                                "tel": student.tel,
                                "isOther": student.is_other,
                                "parent":{
                                    "accountId": student.parents[0].account_id,
                                    "parentFirstnameTh": student.parents[0].firstname_th ?  student.parents[0].firstname_th :"" ,
                                    "parentLastnameTh":student.parents[0].lastname_en ?  student.parents[0].lastname_en :"" ,
                                    "parentFirstnameEn":student.parents[0].firstname_en,
                                    "parentLastnameEn":student.parents[0].lastname_en,
                                    "parentTel": student.parents[0].tel,
                                }  
                            })
                        }else{
                            students.push({
                                "accountId": student.account_id ? student.account_id : "",
                                "userName": student.username,
                                "firstNameTh": student.firstname,
                                "lastNameTh": student.lastname,
                                "tel": student.tel,
                                "isOther": student.is_other,
                                "parent":{}
                            })
                        }
                    })
                    payload.courses.push({
                        "courseId" :  course.course_id,
                        "coursePackageOptionId": course.option.course_package_option_id,
                        "dayOfWeekId": course?.time ? course.time.dayOfWeekId : course.dayOfWeekId,
                        "timeId":  course?.time ? course.time.timeId : course.timeId,
                        "time": course.time,
                        "startDate": "",
                        "remark": "",
                        "price": course.option.net_price,
                        "coach": {
                            "accountId": course.coach_id,
                            "fullName": course.coach_name,
                        },
                        "student": students
                    })
                    console.log("course.students.lenght ",course.students )
                    console.log("course.price ",course.price )
                    let price = course.option?.net_price ? course.option.net_price : course.price
                    console.log("price ",price )
                    total_price =  total_price + (price * course.students.length )
                })
                payload.totalPrice = total_price
                console.log("saveOrder",payload)
                let {data} = await axios.post(`${process.env.VUE_APP_URL}/api/v1/order/regis/course`,payload)
                console.log(data)
                if(data.statusCode === 201){
                    console.log("data.statusCode === 201")
                    let payment_payload = {
                        "orderId": data.data.orderNumber,
                        "total": data.data.totalPrice,
                        "subtotal": 0.00,
                        "vat": 0,
                        "vatRate": 0,
                        "orderDesc": ""
                    }
                    let payment = await axios.post(`${process.env.VUE_APP_URL}/api/v1/payment/code`,payment_payload)
                    console.log("payment",payment)
                    console.log("payment statusCode",payment.data.statusCode)
                    if(payment.data.statusCode === 201){
                        localStorage.removeItem("Order")
                        context.commit("SetResetCourseData")
                        context.commit("SetOrder",{
                            order_step : 0,
                            order_number: "",
                            courses:[],
                            created_by : "",
                            payment_status: "",
                            payment_type: "",
                            total_price: 0,
                        })
                        window.location.href = payment.data.data
                        context.commit("SetOrderIsLoading", false)
                    }
                }
            }catch(error){
                context.commit("SetOrderIsLoading", false)
                console.log(error)
            }
        },
    },
    getters: {
        getOrder(state) {
            return state.order
        },
        getCourseOrder(state) {
            return state.course_order
        },
        getOrders(state){
            return state.orders
        },
        getOrderIsLoading(state){
            return state.order_is_loading
        },
        getOrdersIsLoading(state){
            return state.orders_is_loading
        },

    },
};

export default orderModules;

// student_data: {
//     order_student_id: "",
//     order_item_id: "",
//     student_id: "",
//     is_other: ""
// }

// SetStudentData(state, payload) {
//     state.student_data = payload
//   }

// STUDENT :: DETAIL
// async GetStudentData(context, orderItemId) {
      
// }