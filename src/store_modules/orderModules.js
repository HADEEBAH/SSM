import Swal from "sweetalert2";
import router from "@/router";
const orderModules = {
    namespaced: true,
    state: {
        order: {
            order_id: "",
            students: [
                {
                    student_name: "กมลรัตน์ สิทธิกรชัย",

                },
                {
                    student_name: "กมลพร ศรีโสภา"
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
                    remark: ""
                }
            ],
            payment_status: "",
            payment_type: "",
      }
    },
    mutations: {
        SetOrder(state, payload) {
            state.order= payload
      }
    },
    actions: {
        ChangeOrederData(context, orderData) {
            context.commit("SetOrder", orderData)
            console.log(orderData);
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
      }
    },
  };
  
  export default orderModules;
  