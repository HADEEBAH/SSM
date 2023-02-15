const financeModules = {
  namespaced: true,
  state: {
    order: {
      order_id: "",
      course : [],
      students:[],
      payment_status : "",
      payment_type : "",
      paid_at : "",
      total_price : "",
      remark : "",
      payee : "",
    },
  },
  mutations: {},
  actions: {},
  getters: {},
};

export default financeModules;
