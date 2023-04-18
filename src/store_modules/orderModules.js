import axios from "axios";
import Swal from "sweetalert2";
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
        relations:[],
        cart_list :[]
    },
    mutations: {
        SetOrderIsLoading(state, value){
            state.order_is_loading = value
        },
        SetOrdersIsLoading(state, value){
            state.orders_is_loading = value
        },
        SetRelation(state, payload){
            state.relations = payload
        },
        SetOrder(state, payload) {
            state.order = payload
        },
        SetOrders(state, payload){
            state.orders = payload
        },
        SetCartList(state, payload) {
            state.cart_list = payload
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
            // console.log("changeCourseOrderData :",courseData)
            context.commit("SetOrderCourse", courseData)
        },
        changeOrderData(context, orderData) {
            context.commit("SetOrder", orderData)
            // console.log(orderData)
        },
        async GetRelations(context,{student_id,}){
            try{
                let config = {
                    headers:{
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        'Authorization' : `Bearer ${VueCookie.get("token")}`
                    }
                }
                let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/relations/user?student_id=${student_id}`,config)
                console.log(data)
                if(data.statusCode === 200){
                    if( data.data && !data.data.message){
                        context.commit("SetRelation",data.data )
                    }
                }else{
                    throw {error : data}
                }
            }catch(error){
                console.log(error)
            }
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
                // console.log(payload)
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
                }
            }catch(error){
                console.log(error)
            }
        },
        async saveOrder(context) {
            context.commit("SetOrderIsLoading", true)
            try{
                let order = context.state.order
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
                    console.log("course = >",course)
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
                        "courseId" :  course.course_id ,
                        "coursePackageOptionId": course.option.course_package_option_id,
                        "dayOfWeekId": course?.time ? course.time.dayOfWeekId : course.dayOfWeekId,
                        "timeId":  course?.time ? course.time.timeId : course.timeId,
                        "time": course.time,
                        "startDate": "",
                        "remark": "",
                        "price": course.option.net_price,
                        "coach": {
                            "accountId": course.coach_id ? course.coach_id : course.coach,
                            "fullName": course.coach_name,
                        },
                        "student": students
                    })
                    // console.log("course.students.lenght ",course.students )
                    // console.log("course.price ",course.price )
                    let price = course.option?.net_price ? course.option.net_price : course.price
                    // console.log("price ",price )
                    total_price =  total_price + (price * course.students.length )
                })
                payload.totalPrice = total_price
                let config = {
                    headers:{
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        'Authorization' : `Bearer ${VueCookie.get("token")}`
                    }
                }
                // let localhost = "http://localhost:3002"
                let {data} = await axios.post(`${process.env.VUE_APP_URL}/api/v1/order/regis/course`,payload , config)
                console.log(data)
                if(data.statusCode === 201){
                    let payment_payload = {
                        "orderId": data.data.orderNumber,
                        "total": data.data.totalPrice,
                        "subtotal": 0.00,
                        "vat": 0,
                        "vatRate": 0,
                        "orderDesc": ""
                    }
                    let user_data = JSON.parse(localStorage.getItem("userDetail"))
                    const userLogin = await axios.get(`${process.env.VUE_APP_URL}/api/v1/account/${user_data.account_id}`,)
                    if(userLogin.data.statusCode === 200){
                        let roles = []
                        if (userLogin.data.data.userRoles.length > 0) {
                            userLogin.data.data.userRoles.forEach((role) => {
                                roles.push(role.roleId)
                            });
                         }
                        let payload = {
                            account_id: userLogin.data.data.userOneId,
                            email: userLogin.data.data.email,
                            username : user_data.username,
                            password :  user_data.password,
                            first_name_en: userLogin.data.data.firstNameEng,
                            first_name_th: userLogin.data.data.firstNameTh,
                            last_name_en: userLogin.data.data.lastNameEng,
                            last_name_th: userLogin.data.data.lastNameTh,
                            role: userLogin.data.data.userRoles,
                            roles: roles,
                            tel: userLogin.data.data.mobileNo,
                        }
                        // VueCookie.set("token", userLogin.data.data.token, 1)
                        localStorage.setItem("userDetail", JSON.stringify(payload))
                    }
                    let payment = await axios.post(`${process.env.VUE_APP_URL}/api/v1/payment/code`,payment_payload)
                    console.log("payment",payment)
                    console.log("payment statusCode",payment.data.statusCode)
                    if(payment.data.statusCode === 201){
                        window.location.href = payment.data.data
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
                        context.commit("SetOrderIsLoading", false)
                    }
                }    
            }catch(error){
                context.commit("SetOrderIsLoading", false)
                console.log(error)
            }
        },
        async savePayment(context, {paymnet_data}){
            try{
                let payment_payload = {
                    "orderId": paymnet_data.orderNumber,
                    "total":paymnet_data.totalPrice,
                    "subtotal": 0.00,
                    "vat": 0,
                    "vatRate": 0,
                    "orderDesc": ""
                }
                let {data} = await axios.post(`${process.env.VUE_APP_URL}/api/v1/payment/code`,payment_payload)
                if(data.statusCode === 201){
                    window.location.href = data.data
                }
            }catch(error){
                console.log(error)
                Swal.fire({
                    icon:"error",
                    text: `เกิดข้อผิดพลาด ${error.message}`,
                    showDenyButton: false,
                    showCancelButton: false,
                    confirmButtonText: "ตกลง",
                })
            }
        },
        async GetCartList(context, account_id) {
            console.log("account_id", account_id);
            try {
                let config = {
                    headers:{
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        'Authorization' : `Bearer ${VueCookie.get("token")}`
                    }
                }
                // let endpoint = "http://localhost:3002"
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/cart/${account_id}`,config)
                console.log(data)
                if (data.statusCode === 200) {
                    for (const item of data.data) {
                        item.course_img = `${process.env.VUE_APP_URL}/api/v1/files/${item.course_img}`
                        if(item.course_type_id === "CT_1"){
                            let discount = item.option.discount ? item.option.discount_price : 0
                            // console.log("discount", discount)
                            // ราคา/ครั้ง
                            item.option.net_price_unit = item.option.price_unit / item.option.amount 
                            // console.log("net_price_unit", item.option.net_price_unit)
                            // ราคา
                            item.option.net_price = item.option.price_unit - discount
                        }else{
                            item.net_price = item.price * item.students.length 
                        }
                    }

                    context.commit("SetCartList", data.data)
                    console.log("SetCartList", data.data);
                } else {
                    throw { error: data }
                }
            } catch (error) {
                console.log(error)
            }

        },
        async DeleteCart(context, {cart_id}){
            try{
                let config = {
                    headers:{
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        'Authorization' : `Bearer ${VueCookie.get("token")}`
                    }
                }
                cart_id = cart_id.replaceAll(" ","")
                let {data} = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/order/cart/${cart_id}`,config)
                if(data.statusCode === 200){
                    console.log(data)
                }
            }catch(error){
                console.log(error)
                
            }
        },
        // RESERVE COURSE
        async CreateReserveCourse(context,{ course_data }){
            try{
                console.log(course_data)
                await course_data.students.forEach( async (student)=>{
                    let payload = {
                        "studentId": student.account_id,
                        "coursePackageOptionId": null,
                        "dayOfWeekId": null,
                        "timeId": null,
                        "courseId": course_data.course_id,  
                        "parentId": null,
                        "coachId": course_data.coach_id ? course_data.coach_id : null,
                        "orderTmpId": null,
                    }
                    if(course_data.course_type_id === "CT_1"){
                        payload.dayOfWeekId =  course_data.time.dayOfWeekId
                        payload.coursePackageOptionId = course_data.option.course_package_option_id
                        payload.timeId = course_data.time.timeId
                    }
                    // console.log(course_data)
                    let config = {
                        headers:{
                            "Access-Control-Allow-Origin" : "*",
                            "Content-type": "Application/json",
                            'Authorization' : `Bearer ${VueCookie.get("token")}`
                        }
                      }
                    let {data} = await axios.post(`${process.env.VUE_APP_URL}/api/v1/order/reserve/create`,payload, config)
                    if(data.statusCode === 201){
                        console.log(data)
                    }else{
                        throw {error : data.data} 
                    }
                })
                await Swal.fire({
                    icon:"success",
                    text: "จองคอร็สสำเร็จ เจ้าหน้าที่จะติดต่อกลับภายหลัง",
                    showDenyButton: false,
                    showCancelButton: false,
                    confirmButtonText: "ตกลง",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        router.replace({name : "UserKingdom"})
                    }
                })        
            }catch(error){
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
        getRelations(state){
            return state.relations
        },
        getCartList(state) {
            return state.cart_list
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