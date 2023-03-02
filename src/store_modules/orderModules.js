import Swal from "sweetalert2";
import router from "@/router";

const orderModules = {
    namespaced: true,
    state: {
 
        courses: {
            kingdom: {},
            course_type: "",
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
            remark: "",
            parents: [],
            students: [],

        },
        order: {
            order_id: "",
            students: [
                {
                    student_name: "",
                    username: "",
                    firstname: "",
                    lastname: "",
                    tel: "",
                    is_other: false,
                    parents: [

                    ]
                },
                {
                    student_name: "",
                    username: "",
                    firstname: "",
                    lastname: "",
                    tel: "",
                    is_other: false,
                    parents: [

                    ]
                },
            ],
            courses: [],
            payment_status: "",
            payment_type: "",
            total_price: 0,
        }
    },
    mutations: {
        SetOrder(state, payload) {
            state.order = payload
        },
        SetOrderCourse(state, payload) {
            state.courses = payload
        },
        SetResetCourseData(state) {
            state.courses = {
                kingdom: {},
                course_type: "",
                package: "",
                package_data: {},
                option: "",
                period: 0,
                time_count: 0,
                day: "",
                time: "",
                coach: "",
                start_day: "",
                price: 0,
                remark: "",
                parents: [],
                students: [],
            }
        }

    },
    actions: {
        resetCourseDate(context) {
            context.commit("SetResetCourseData")
        },
        changeCourseData(context, courseData) {
            context.commit("SetOrderCourse", courseData)
            console.log(courseData)
        },
        changeOrederData(context, orderData) {
            context.commit("SetOrder", orderData)
            console.log(orderData)
        },
        save(context) {
            console.log(context.state.order);
            Swal.fire({
                title: "<strong>เพิ่มผู้เรียนสำเร็จ</strong>",
                icon: "success",
                showCloseButton: true,
                focusConfirm: true,
                confirmButtonText: 'ดูสถานะการเงิน',
            }).then((res) => {
                if (res.isConfirmed) {
                    router.push({ name: "Finance" })
                }
                console.log(res);
            })
        },
     
 
    },
    getters: {
        getOrder(state) {
            return state.order
        },
        getCourses(state) {
            return state.courses
        }

    },
};

export default orderModules;
