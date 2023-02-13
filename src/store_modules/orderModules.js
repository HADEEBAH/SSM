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
        }
    },
    getters: {
        getOrder(state) {
            return state.order
      }
    },
  };
  
  export default orderModules;
  