import Swal from "sweetalert2";
import router from "@/router";
const orderModules = {
    namespaced: true,
    state: {
        courses: {
            course_type: "",
            package: "",
            time_period: "",
            time_count: 0,
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
                    student_name: "กมลรัตน์ สิทธิกรชัย",
                    username: "",
                    firstname: "",
                    lastname: "",
                    tel: "",
                    is_other : false,
                    parents: [
                       
                    ]
                },
                {
                    student_name: "กมลพร ศรีโสภา",
                    username : "",
                    firstname : "",
                    lastname : "",
                    tel : "",
                    is_other : false,
                    parents: [
                       
                    ]
                },
            ],
            courses: [
                {
                    course_type: "",
                    package: "",
                    time_period: "",
                    time_count: 0,
                    day: "",
                    time: "",
                    coach: "",
                    start_day: "",
                    price: 0,
                    remark: "",
                    parents: [],
                    students: [
                        {
                            student_name: "กมลรัตน์ สิทธิกรชัย",
                            username: "",
                            firstname: "",
                            lastname: "",
                            tel: "",
                            is_other : false,
                            parents: []
                        },
                        {
                            student_name: "กมลพร ศรีโสภา",
                            username : "",
                            firstname : "",
                            lastname : "",
                            tel : "",
                            is_other : false,
                            parents: []
                        },
                    ],
                }
            ],
            payment_status: "",
            payment_type: "",
            total_price : 0,
      }
    },
    mutations: {
        SetOrder(state, payload) {
            state.order= payload
        },
        SetOrderCourse(state, payload) {
            state.courses= payload
        },
    },
    actions: {
        changeCourseData(context, courseData){
            context.commit("SetOrderCourse", courseData)
            console.log(courseData)
        },
        changeOrederData(context, orderData) {
            context.commit("SetOrder", orderData)
        },
        save(context) {
            console.log(context.state.order);
            Swal.fire({
                title: "<strong>เพิ่มผู้เรียนสำเร็จ</strong>",
                icon: "success",
            //    imageUrl: '',
                showCloseButton: true,
                focusConfirm: true,
                confirmButtonText: 'ดูสถานะการเงิน',
            }).then((res) => {
                if (res.isConfirmed) {
                    router.push({name:"Finance"})
                }
                console.log(res);
              })
        }
    },
    getters: {
        getOrder(state) {
            return state.order
        },
        getCourses(state){
            return state.courses
        }
    },
  };
  
  export default orderModules;
  