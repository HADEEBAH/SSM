import axios from "axios";
import Swal from "sweetalert2";
import router from "@/router";
const orderModules = {
    namespaced: true,
    state: {
        course_order: {
            kingdom: {},
            course_type: "",
            course_type_id: "CT_1",
            category_id: "",
            package: "",
            package_data: {},
            option: "",
            option_data: "",
            period: 0,
            times_in_class: 0,
            day: "",
            time: "",
            coach: "",
            start_day: "",
            price: 0,
            detail: "",
            remark: "",
            selected: true,
            parents: [],
            students: [],

        },
        //students :[ {
        //         account_id : "",
        //         username: "",
        //         firstname: "",
        //         lastname: "",
        //         tel: "",
        //         is_other: false,
        //         parents: [{
        //             account_id : "",
        //             username: "",
        //             firstname: "",
        //             lastname: "",
        //                 tel: "",
        //         }
        //     },{
        //         account_id : '',
        //         username: "",
        //         firstname: "",
        //         lastname: "",
        //         tel: "",
        //         is_other: true,
        //         parents: [{
        //             account_id : "",
        //             username: "",
        //             firstname: "",
        //             lastname: "",
        //                 tel: "",
        //         }]
        // เขียนใน API
        // courses:[{
        //     course_id : "",
        //     course_type_id : "",
        //     category_id : "",
        //     category_name : "",
        //     option_id : "",
        //     option_name : "",
        //     package_id:"",
        //     package_name : "",
        //     day_of_weer_id : "",
        //     day_of_weer : "",
        //     time_id : "",
        //     time : "",
        //     start_date : "",
        //     remark : "",
        //     price : "",
        //     coahc : {
        //         account_id : " ",
        //     },
        //     students:[],
        //     }],
        // }]
        order: {
            order_step: 0,
            order_number: "",
            courses: [],
            created_by: "",
            payment_status: "",
            payment_type: "",
            total_price: 0,
        },
        orders: [],
        order_detail: {},
        student_data: [
            {
                courseId: "",
                courseNameTh: "",
                courseNameEng: "",
                courseOpenDate: "",
                courseLocation: "",
                courseDescription: "",
                courseMusicPerformance: null,
                courseStatus: "",
                courseCertification: "",
                courseImg: "",
                coursePerTime: "",
                courseRegisterStartDate: null,
                courseRegisterEndDate: null,
                courseStudyStartDate: null,
                courseStudyEndDate: null,
                coursePeriodEndDate: null,
                coursePeriodStartDate: null,
                coursePrice: "",
                courseStudentRecived: "",
                courseStudentTotal: null,
                totalAmount: "",
                successCount: "",
                pendingCount: "",
                dates: [],
                orderId: "",
                orderItemId: "",
                cpoId: "",
                dayOfWeekId: "",
                timeId: "",
                coachId: "",
                coachName: "",
                orderStudentId: "",
                studentId: "",
                coursePackageOptionId: "",
                courseNameEn: "",
                start: "",
                end: "",
                dayOfWeekName: []
            }
        ],

        cart_list: [],



    },
    mutations: {
        SetOrder(state, payload) {
            state.order = payload
        },
        SetOrders(state, payload) {
            state.orders = payload
        },
        SetOrderDetail() { },
        SetOrderCourse(state, payload) {
            state.course_order = payload
        },
        SetResetCourseData(state) {
            state.course_order = {
                kingdom: {},
                course_type: "",
                course_type_id: "CT_1",
                package: "",
                package_data: {},
                option: "",
                option_data: "",
                period: 0,
                times_in_class: 0,
                day: "",
                time: "",
                coach: "",
                start_day: "",
                price: 0,
                detail: "",
                remark: "",
                selected: true,
                parents: [],
                students: [],
            }
        },
        SetStudentData(state, payload) {
            state.student_data = payload
        },
        SetCartList(state, payload) {
            state.cart_list = payload
        }
    },

    actions: {
        resetCourseData(context) {
            context.commit("SetResetCourseData")
        },
        changeCourseOrderData(context, courseData) {
            console.log("changeCourseOrderData :", courseData)
            context.commit("SetOrderCourse", courseData)
        },
        changeOrderData(context, orderData) {
            context.commit("SetOrder", orderData)
            console.log(orderData)
        },
        async GetOrders(context) {
            try {
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order`)
                console.log(data)
                if (data.statusCode === 200) {
                    context.commit("SetOrders", data.data)
                } else {
                    throw { error: data }
                }
            } catch (error) {
                console.log(error)
            }
        },
        async saveCart(context, { cart_data }) {
            console.log(cart_data)
            try {
                let order = cart_data
                console.log(order)
                let payload = {
                    order_id: "",
                    courses: [],
                    created_by: "",
                    paymentStatus: "pending",
                    paymentType: "",
                    totalPrice: 0,
                }
                let total_price = 0
                await order.courses.forEach((course) => {
                    let students = []
                    course.students.forEach((student) => {
                        console.log("student", student.parents[0])
                        if (student.parents[0]) {
                            students.push({
                                "accountId": student.account_id ? student.account_id : "",
                                "userName": student.username,
                                "firstNameTh": student.firstname,
                                "lastNameTh": student.lastname,
                                "tel": student.tel,
                                "isOther": student.is_other,
                                "parent": {
                                    "accountId": student.parents[0].account_id,
                                    "parentFirstnameTh": student.parents[0].firstname_th ? student.parents[0].firstname_th : "",
                                    "parentLastnameTh": student.parents[0].lastname_en ? student.parents[0].lastname_en : "",
                                    "parentFirstnameEn": student.parents[0].firstname_en,
                                    "parentLastnameEn": student.parents[0].lastname_en,
                                    "parentTel": student.parents[0].tel,
                                }
                            })
                        } else {
                            students.push({
                                "accountId": student.account_id ? student.account_id : "",
                                "userName": student.username,
                                "firstNameTh": student.firstname,
                                "lastNameTh": student.lastname,
                                "tel": student.tel,
                                "isOther": student.is_other,
                                "parent": {}
                            })
                        }
                    })
                    payload.courses.push({
                        "courseId": course.course_id,
                        "courseName": course.course_name,
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
                    })
                    total_price = total_price + course.option.net_price
                })
                payload.totalPrice = total_price
                console.log("saveOrder", payload)
                let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/order/regis/course`, payload)
                if (data.statusCode === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "ไปยังหน้า E-cashier"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.removeItem("Order")
                            context.commit("SetResetCourseData")
                            context.commit("SetOrder", {
                                order_step: 0,
                                order_number: "",
                                courses: [],
                                created_by: "",
                                payment_status: "",
                                payment_type: "",
                                total_price: 0,
                            })
                            router.replace({ name: "UserKingdom" });
                        }
                    })
                }
            } catch (error) {
                console.log(error)
            }
        },
        async saveOrder(context) {
            try {
                let order = context.state.order
                console.log(order)
                let payload = {
                    order_id: "",
                    courses: [],
                    created_by: "",
                    paymentStatus: "pending",
                    paymentType: "",
                    totalPrice: 0,
                }
                let total_price = 0
                await order.courses.forEach((course) => {
                    let students = []
                    course.students.forEach((student) => {
                        console.log("student", student.parents[0])
                        if (student.parents[0]) {
                            students.push({
                                "accountId": student.account_id ? student.account_id : "",
                                "userName": student.username,
                                "firstNameTh": student.firstname,
                                "lastNameTh": student.lastname,
                                "tel": student.tel,
                                "isOther": student.is_other,
                                "parent": {
                                    "accountId": student.parents[0].account_id,
                                    "parentFirstnameTh": student.parents[0].firstname_th ? student.parents[0].firstname_th : "",
                                    "parentLastnameTh": student.parents[0].lastname_en ? student.parents[0].lastname_en : "",
                                    "parentFirstnameEn": student.parents[0].firstname_en,
                                    "parentLastnameEn": student.parents[0].lastname_en,
                                    "parentTel": student.parents[0].tel,
                                }
                            })
                        } else {
                            students.push({
                                "accountId": student.account_id ? student.account_id : "",
                                "userName": student.username,
                                "firstNameTh": student.firstname,
                                "lastNameTh": student.lastname,
                                "tel": student.tel,
                                "isOther": student.is_other,
                                "parent": {}
                            })
                        }
                    })
                    payload.courses.push({
                        "courseId": course.course_id,
                        "coursePackageOptionId": course.option.course_package_option_id,
                        "dayOfWeekId": course.time.dayOfWeekId,
                        "timeId": course.time.timeId,
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
                    total_price = total_price + course.option.net_price
                })
                payload.totalPrice = total_price
                console.log("saveOrder", payload)
                let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/order/regis/course`, payload)
                if (data.statusCode === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "ไปยังหน้า E-cashier"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.removeItem("Order")
                            context.commit("SetResetCourseData")
                            context.commit("SetOrder", {
                                order_step: 0,
                                order_number: "",
                                courses: [],
                                created_by: "",
                                payment_status: "",
                                payment_type: "",
                                total_price: 0,
                            })
                            router.replace({ name: "UserKingdom" });
                        }
                    })
                }
            } catch (error) {
                console.log(error)
            }
        },
        // STUDENT :: DETAIL
        // async GetStudentData(context, {user_data} ) {
        //     try {
        //         console.log("order_item_id =>", user_data);
        //         let { data } = await axios.get(`${process.env.VUE_APP_URL}api/v1/order/item/student/${user_data}`)
        //         const student_data = data.data
        //         console.log("Getstudenet", data.data)
        //         console.log("order_item_id =>", user_data);

        //         console.log("order_item_id 2 =>", user_data);
        //         if(data.statusCode === 200){
        //             console.log("success", data);
        //         }
        //         context.commit("SetStudentData",student_data)
        //       }catch(error){
        //         console.log(error)
        //       }
        // },

        async GetStudentData(context, account_id) {
            console.log("account_id =>", account_id);
            try {
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/mycourse/student/${account_id}`)
                console.log(data)
                if (data.statusCode === 200) {
                    context.commit("SetStudentData", data.data)
                    console.log("SetStudentData", data.data);
                } else {
                    throw { error: data }
                }
            } catch (error) {
                console.log(error)
            }
        },

        async GetCartList(context, account_id) {
            console.log("account_id", account_id);
            try {
                let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/order/cart/account/${account_id}`)
                console.log(data)
                if (data.statusCode === 200) {
                    for (const item of data.data) {
                        let discount = item.option.discount ? item.option.discount_price : 0
                        // console.log("discount", discount)
                        // ราคา/ครั้ง
                        item.option.net_price_unit = item.option.price_unit / item.option.amount 
                        // console.log("net_price_unit", item.option.net_price_unit)
                        // ราคา
                        item.option.net_price = item.option.price_unit - discount
                        
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


    },
    getters: {
        getOrder(state) {
            return state.order
        },
        getCourseOrder(state) {
            console.log( "course_order", this.course_order  );
            return state.course_order
        },
        getOrders(state) {
            return state.orders
        },
        getStudentData(state) {
            return state.student_data
        },
        getCartList(state) {
            return state.cart_list
        },


    },
};

export default orderModules;

