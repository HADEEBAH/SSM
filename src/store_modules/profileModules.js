const profileModules = {
    namespaced: true,
    state: {
      parents_data: {
        fname_th: "dieb",
        lname_th: "dieb",
        nationality: "TH",
        id_card: "xxxxx5656",
        date_of_birth: "20-20-20",
        tel: "165651251546",
        email: "gg@gmail.com",

      },

      certificate_data: [
        {
          certificate_title: "การแข่งขันเปียโนการกุศล กลายปี 2565",
          race_day: "20 มิถุนายน 2565",
          certificate_card: "https://s3-ap-southeast-1.amazonaws.com/tksproduction/bmtimages/pY3BnhPQYpTxasKfx.jpeg", },
        {
          certificate_title: "การแข่งขันเปียโนการกุศล กลายปี 2565",
          race_day: "20 มิถุนายน 2565",
          certificate_card: "https://s3-ap-southeast-1.amazonaws.com/tksproduction/bmtimages/pY3BnhPQYpTxasKfx.jpeg",
        },
        {
          certificate_title: "การแข่งขันเปียโนการกุศล กลายปี 2565",
          race_day: "20 มิถุนายน 2565",
          certificate_card: "https://s3-ap-southeast-1.amazonaws.com/tksproduction/bmtimages/pY3BnhPQYpTxasKfx.jpeg", },
      ],
      
      password: {
      old_password: '',
      new_password: '',
      confirm_password: '',
      },

      security: {
        policy: ' บริษัท อินเทอร์เน็ตประเทศไทย จำกัด (มหาชน) มีความมุ่งมั่นที่จะดำเนินการตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ให้สอดคล้องกับหลักเกณฑ์ของคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลเพื่อให้มีหลักเกณฑ์การคุ้มครองสิทธิของเจ้าของข้อมูลเกี่ยวกับข้อมูลส่วนบุคคลสิทธิในความเป็นส่วนตัวและเสรีภาพในข้อมูลส่วนบุคคลของผู้เจ้าของข้อมูลและพัฒนาปรับปรุงนโยบายระเบียบปฏิบัติของ บริษัทให้ต่อเนื่องสืบไปเพื่อให้เป็นไปตามนโยบายการคุ้มครองข้อมูลส่วนบุคคลบริษัทจึงขอประกาศนโยบาย ดังนี้'
      },
    
    
    },
  mutations: {
    SetParentsData(state, payload) {
      state.parents_data = payload
      console.log("payload", payload);
    },
    SetCertificateData(state, payload) {
      state.certificate_data = payload
    },
    SetPassword(state, payload) {
      state.password = payload
    }

    },
  actions: {
    ChangeParentsData(context, ParentsData) {
      context.commit("SetParentsData", ParentsData)
      console.log("SetParentsData", this.SetParentsData);
    },
    ChangeCertificateData(context, certificateData) {
      context.commit("SetCertificateData", certificateData)
    },
    
    ChangePassword(context, newPassword) {
      context.commit("SetPassword",newPassword )
    }
    },
  getters: {
    getParentsData(state) {
      return state.parents_data
    },
    getCertificateData(state) {
      return state.certificate_data
    },
    getPassword(state) {
      return state.password
    }
    },
  };
  
  export default profileModules;
  