import axios from "axios";
const profileModules = {
    namespaced: true,
    state: {
      user_data: {
        fname_th: "dieb",
        lname_th: "dieb",
        nationality: "TH",
        id_card: "xxxxx5656",
        date_of_birth: "20-20-20",
        tel: "165651251546",
        email: "gg@gmail.com",

      },

      parent_data: [
      
          {
          relation_id: "",
          student_id: "",
          parent_id: "",
          parent_firstname_th: "",
          parent_firstname_en: "",
          parent_lastname_th: "",
          parent_lastname_en: "",
          parent_tel: "",
          accountId: "",
          email: "",
          firstNameTh: "",
          lastNameTh: "",
          nation: "",
          tel: ""
          },
       
      ],
        


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
    SetUserData(state, payload) {
      state.user_data = payload
    },

    SetParentData(state, payload) {
      state.parent_data = payload
    },

    SetCertificateData(state, payload) {
      state.certificate_data = payload
    },
    SetPassword(state, payload) {
      state.password = payload
    }

    },
  actions: {

    GetUserData(context, UserData) {
      context.commit("SetUserData", UserData)
      console.log("SetUserData", UserData);
    },

    async GetParentData(context, student_id) {
      console.log("student_id", student_id);
      try {
        let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/mycourse/student/${student_id}`)
        console.log(data)
        if (data.statusCode === 200) {
            context.commit("SetParentData", data.data)
            console.log("SetParentData", data.data);
        } else {
            throw { error: data }
        }
    } catch (error) {
        console.log(error)
    }
    },
    // ChangeParentsData(context, ParentsData) {
    //   context.commit("SetUserData", ParentsData)
    //   console.log("SetUserData", this.SetUserData);
    // },
    ChangeCertificateData(context, certificateData) {
      context.commit("SetCertificateData", certificateData)
    },
    
    ChangePassword(context, newPassword) {
      context.commit("SetPassword",newPassword )
    }
    },
  getters: {
    getUserData(state) {
      return state.user_data
    },
    getParentData(state) {
      console.log("object");
      return state.parent_data
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
  