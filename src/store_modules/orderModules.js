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
            course_id: "",
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
            type : "",
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
        cart_list :[],
        reserve_list:[],
    },
    mutations: {
        SetReserveList(state, payload){
            state.reserve_list = payload
        },
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
        SetOrderDetail(state, payload){
            state.order_detail = payload
        },
        SetOrderCourse(state, payload) {
            state.course_order = payload
        },
        SetResetCourseData(state) {
            state.course_order = {
                apply_for_yourself : false,
                apply_for_others : false,
                kingdom: {},
                course_id: "",
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
                let config = {
                    headers:{
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        'Authorization' : `Bearer ${VueCookie.get("token")}`
                    }
                }
                let localhost = "http://localhost:3000"
                let {data} = await axios.get(`${localhost}/api/v1/adminpayment/`,config)
                console.log(data)
                if(data.statusCode === 200){
                    if(data.data.length > 0){
                        for(const order of data.data){
                            order.paid_date =  order.payment_status === "success" ? new Date(order.updated_date).toLocaleString("th-TH")  : ''
                            order.course_name = `${order.course.courseNameTh}(${order.course.courseNameEn})`
                            order.student_name = `${ order.user.firstNameTh } ${ order.user.lastNameTh }`
                        }
                    }
                    context.commit("SetOrders",data.data)
                }else{
                    throw {error : data}
                }
            }catch(error){
                console.log(error)
            }
        },
        async GetOrderDetail(context,{order_number}){
            try{
                let config = {
                    headers:{
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        'Authorization' : `Bearer ${VueCookie.get("token")}`
                    }
                }
                let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminpayment/${order_number}`, config)
                console.log(data)
                if(data.statusCode == 200){
                    let student_name_list = []
                    for(const order_item of  data.data.orderItem){
                        if(order_item.students.length > 0){
                            order_item.students.forEach((student)=>{
                                if(!student_name_list.includes(`${student.firstNameTh} ${student.lastNameTh}`)){
                                    student_name_list.push(`${student.firstNameTh} ${student.lastNameTh}`)
                                }
                            })
                            data.data.student_name_list = student_name_list.join(', ')
                        }
                    }
                    
                    context.commit("SetOrderDetail",data.data)
                }
            }
            catch(error){
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
                        "dayOfWeekId": course?.time?.timeData ? course.time.timeData.filter(v => v.coach_id === course.coach_id)[0].dayOfWeekId : course.time.dayOfWeekId,
                        "timeId":  course?.time?.timeData ? course.time.timeData.filter(v => v.coach_id === course.coach_id)[0].timeId : course.time.timeId,
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
                    paymentStatus: 'pending',
                    paymentType: order.payment_type,
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
                        "dayOfWeekId": course?.time?.timeData ? course.time.timeData.filter(v => v.coach_id === course.coach_id)[0].dayOfWeekId : course.time.dayOfWeekId,
                        "timeId":  course?.time?.timeData ? course.time.timeData.filter(v => v.coach_id === course.coach_id)[0].timeId : course.time.timeId,
                        "time": course.time,
                        "startDate": course.start_date,
                        "remark": course.remark? course.remark : "",
                        "price": course.option?.net_price ? course.option.net_price : course.price,
                        "coach": {
                            "accountId": course.coach_id ? course.coach_id : course.coach,
                            "fullName": course.coach_name,
                        },
                        "student": students
                    })
                    console.log("course.students.lenght ",course.students.length )
                    console.log("course.price ",course.price )
                    let price = course.option?.net_price ? course.option.net_price : course.price
                    // console.log("price ",price )
                    if((course.price * course.students.length) !== price ){
                        total_price =  total_price + (price * course.students.length )
                    }else{
                        console.log("course.students.lenght => ",course.students.length )
                        console.log("course.price =>",course.price )
                        total_price =  total_price + price
                    }
                   
                    console.log("total_price =>",total_price)
                })
                payload.totalPrice = total_price
                let config = {
                    headers:{
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        'Authorization' : `Bearer ${VueCookie.get("token")}`
                    }
                }
                console.log("payload =>",payload)
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
                    if(order.type !== "addStudent"){
                        console.log("370 addStudent :",data.data.orderNumber)
                        let payment = await axios.post(`${process.env.VUE_APP_URL}/api/v1/payment/code`,payment_payload)
                        console.log("payment",payment)
                        console.log("payment statusCode",payment.data.statusCode)
                        if(payment.data.statusCode === 201){
                            window.location.href = payment.data.data
                            localStorage.removeItem("Order")
                            context.commit("SetResetCourseData")
                            context.commit("SetOrder",{
                                type:"",
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
                    }else{
                        console.log("391 payment data :",data.data.orderNumber)
                        console.log("order.payment_type : ",order.payment_type)
                        console.log("|||||||||||||||||||||||||||||||||")
                        if(order.payment_status === "paid"){
                            let payment_payload = {
                                "orderId": data.data.orderNumber,
                                "paymentType": order.payment_type,
                                "total": data.data.totalPrice,
                            }
                            console.log(payment_payload)
                            // let localhost = "http://192.168.74.25:3003"
                            let  payment = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/payment/data/${data.data.orderNumber}`,payment_payload)
                            if(payment.data.statusCode === 200){
                                Swal.fire({
                                    icon:"success",
                                    text: "ทำรายการสำเร็จ",
                                    showDenyButton: false,
                                    showCancelButton: false,
                                    confirmButtonText: "ตกลง",
                                }).then(async (result) => {
                                    if (result.isConfirmed) {
                                        router.replace({name : "Finance"})
                                    }
                                })    
                                localStorage.removeItem("Order")
                                context.commit("SetResetCourseData")
                                context.commit("SetOrder",{
                                    type:"",
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
                        }else{
                            Swal.fire({
                                icon:"success",
                                text: "ทำรายการสำเร็จ",
                                showDenyButton: false,
                                showCancelButton: false,
                                confirmButtonText: "ตกลง",
                            }).then(async (result) => {
                                if (result.isConfirmed) {
                                    router.replace({name : "Finance"})
                                }
                            })    
                            localStorage.removeItem("Order")
                            context.commit("SetResetCourseData")
                            context.commit("SetOrder",{
                                type:"",
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
                }    
            }catch(error){
                context.commit("SetOrderIsLoading", false)
                // console.log(error.response)
                if(error.response.data.message === "User is duplicate in this course. Cannot enroll again"){
                    Swal.fire({
                        icon: "error",
                        title: "ผู้ใช้ซ้ำกันในหลักสูตรนี้ ไม่สามารถลงทะเบียนได้",
                        showCancelButton: false,
                        confirmButtonText: "ตกลง",
                    })
                }else{
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด",
                        showCancelButton: false,
                        confirmButtonText: "ตกลง",
                    })
                }
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
            // console.log("account_id", account_id);
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
                if (data.statusCode === 200) {
                    // console.log("Cart List =>",data.data)
                    for await (const item of data.data) {
                        console.log("discount =>",item.option.discount)
                        item.course_img = `${process.env.VUE_APP_URL}/api/v1/files/${item.course_img}`
                      
                        if(item.course_type_id === "CT_1"){
                            let discount = item.option.discount ? item.option.discount_price : 0
                            // console.log("discount", discount)
                            // ราคา/ครั้ง
                            item.option.net_price_unit = item.option.price_unit / item.option.amount 
                            // console.log("net_price_unit", item.option.net_price_unit)
                            // ราคา
                            item.option.net_price = (item.option.price_unit - discount)*item.students.length
                        }else{
                            item.net_price = item.price * item.students.length
                        }
                    }
                    context.commit("SetCartList", data.data)
                    // console.log("SetCartList", data.data);
                } else {
                    throw { error: data }
                }
            } catch (error) {
                console.log(error)
            }

        },
        async DeleteCart(context, {cart_id, account_id}){
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
                    let config = {
                        headers:{
                            "Access-Control-Allow-Origin" : "*",
                            "Content-type": "Application/json",
                            'Authorization' : `Bearer ${VueCookie.get("token")}`
                        }
                    }
                    // let endpoint = "http://localhost:3002"
                    let carts = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/cart/${account_id}`,config)
                    if (carts.data.statusCode === 200) {
                        for (const item of carts.data.data) {
                            item.course_img = `${process.env.VUE_APP_URL}/api/v1/files/${item.course_img}`
                            if(item.course_type_id === "CT_1"){
                                let discount = item.option.discount ? item.option.discount_price : 0
                                item.option.net_price_unit = item.option.price_unit / item.option.amount 
                                item.option.net_price = item.option.price_unit - discount
                            }else{
                                item.net_price = item.price * item.students.length 
                            }
                        }
                        context.commit("SetCartList", carts.data.data)
                        console.log("SetCartList",carts.data.data);
                    } else {
                        throw { error: carts }
                    }
                }else{
                   throw {error :data }
                }
            }catch(error){
                console.log(error)
                
            }
        },
        // RESERVE COURSE
        async CreateReserveCourse(context,{ course_data }){
            try{
                // console.log(course_data)
                let count = 0
                 for await (let student of course_data.students){
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
                        payload.dayOfWeekId =  course_data?.time?.timeData ? course_data.time.timeData.filter(v => v.coach_id === course_data.coach_id)[0].dayOfWeekId : course_data.time.dayOfWeekId
                        payload.coursePackageOptionId = course_data.option.course_package_option_id
                        payload.timeId =  course_data?.time?.timeData ? course_data.time.timeData.filter(v => v.coach_id === course_data.coach_id)[0].timeId : course_data.time.timeId
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
                        count = count + 1
                    }else{
                        throw {error : data.data} 
                    }
                }
                console.log(count === course_data.students.length)
                if (count === course_data.students.length) {
                    await Swal.fire({
                        icon:"success",
                        text: "จองคอร์สสำเร็จ เจ้าหน้าที่จะติดต่อกลับภายหลัง",
                        showDenyButton: false,
                        showCancelButton: false,
                        confirmButtonText: "ตกลง",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            router.replace({name : "UserKingdom"})
                        }
                    })        
                }
               
            }catch(error){
                console.log(error)
            }
        },
        async GetReserceByCreatedBy(context,{account_id}){
            try{
                // let localhost = "http://localhost:3002"
                let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/reserve/byCreatedBy/${account_id}`)
                // console.log(data.data)
                if(data.statusCode === 200){
                    context.commit("SetReserveList",data.data)
                }   
            }catch(error){
                await Swal.fire({
                    icon:"error",
                    text: `เกิดข้อผิดพลาด${error.message}`,
                    showDenyButton: false,
                    showCancelButton: false,
                    confirmButtonText: "ตกลง",
                })
            }
        }
    },
    getters: {
        getReserveList(state){
            return state.reserve_list
        },
        getOrder(state) {
            return state.order
        },
        getCourseOrder(state) {
            return state.course_order
        },
        getOrders(state){
            return state.orders
        },
        getOrderDetail(state){
            return state.order_detail
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