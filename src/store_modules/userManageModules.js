import axios from "axios";
import VueCookie from "vue-cookie"
import Swal from "sweetalert2";
// import moment from "moment";
const UserManageModules = {
  namespaced: true,
  state: {
    course_coach_list:[],
    user_data: {
      username_en: "",
      fname_th: "",
      lname_th: "",
      fname_en: "",
      lname_en: "",
      email: "",
      phone_num: "",
      roles: [],
      privilege: '',
      previewUrl: null,
      selectedbox: false,
      isCardOpen: false,
      isCardParentOpen: false,

    },
    searchTerm: "",
    inputValue: "",
    certificates: [],
    certificate_count : 0,
    certificate_detail: {
      name_certificate: "",
      certificate_date: "",
      previewUrl: null,
      fileName: ''
    },
    students: {
      students_detail: [
        {
          username: "",
          firstname: "",
          lastname: "",
          tel: "",
        },
      ],
      students_card: [],
    },
    parents: [
      {
        username: "",
        firstname: "",
        lastname: "",
        tel: "",
      },
    ],
    data_user_relation_management: [],
    
  },
  mutations: {
    SetCertificateCount(state, payload){
      state.certificate_count = payload
    },
    SetCourseCoachList(state, payload){
      state.course_coach_list = payload
    },
    SetStudent(state, payload) {
      state.students = payload
    },

    SetUserData(state, payload) {
      state.userData = payload
    },

    SetCertificate(state, payload) {
      state.certificates = payload
    },
    SetDataUserRelationsManagement(state, payload) {
      state.data_user_relation_management = payload
    },

  },

  actions: {
    async GetCertificateCount(context, {account_id}){
      try{
        // let localhost = "http://localhost:3000"
        const {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/certificate/count/${account_id}`)
        if(data.statusCode == 200){
          console.log(data.data)
          context.commit("SetCertificateCount", data.data)
        }
      }catch(error){
        console.log(error)
      }
    },
    async GetCourseCoachList(context, {account_id}){
      try{
        // let localhost = "http://localhost:3000"
        const {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/usermanagement/course-coach/list?accountId=${account_id}`)
        if(data.statusCode == 200){
          let courseCoachList = data.data.map( v => {
            v.courseName = `${v.courseNameTh}(${v.courseNameEn})`
            v.categoryName = `${v.categoryNameTh}(${v.categoryNameEn})`
            v.courseTypeName = `${v.courseTypeNameTh}(${v.courseTypeNameEn})`
            return v
          })
          context.commit("SetCourseCoachList",courseCoachList)
        }
      }catch(error){
        console.log(error)
      }
    },
    changeStudentsData(context, studentData) {
      context.commit("studentData", studentData)
    },

    changeUserData(context, userData) {
      context.commit("userData", userData)
    },

    changeParentData(context, ParentData) {
      context.commit("ParentData", ParentData)
    },

    ChangeCardStudens(context, studentcardData) {
      context.commit("SetStudent", studentcardData)
    },
    changeCertificate(context, students) {
      context.commit("SetCertificate", students)
    },
    async GetCertificateListByAccount(context, {account_id}){
      try{
        // let localhost = "http://localhost:3000"
        const {data}  = await axios.get(`${process.env.VUE_APP_URL}/api/v1/certificate/${account_id}`)
        if(data.statusCode == 200){
          console.log(data)
          context.commit("SetCertificate",data.data)
        }
      }catch(error){
        console.log(error)
      }
    },
    async CreateCertificate(context, {certificate_data}){
      try{
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let payload = {
          certificateName : certificate_data.certificate_name,
          accountId : certificate_data.account_id,
          certificateDate : certificate_data.certificate_date
        }
        let payloadData = new FormData()
        payloadData.append("payload", JSON.stringify(payload))
        payloadData.append("img_url", certificate_data.file)
        // let localhost = "http://localhost:3000"
        const {data}  = await axios.post(`${process.env.VUE_APP_URL}/api/v1/certificate`, payloadData, config)
        if(data.statusCode == 201){
          // console.log(data)
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "( บันทึกเรียบร้อยแล้ว )",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          }).finally(()=>{
            context.dispatch("GetCertificateListByAccount",{account_id : certificate_data.account_id})
          })
        
        }
      }catch(error){
        console.log(error)
      }
    },
    async UpdateCertificate(context, {certificate_data, certificate_id}){
      try{
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let payload = {
          certificateName : certificate_data.certificate_name,
          accountId : certificate_data.account_id,
          certificateDate : certificate_data.certificate_date
        }
        console.log(certificate_data)
        let payloadData = new FormData()
        payloadData.append("payload", JSON.stringify(payload))
        payloadData.append("img_url", certificate_data.file)
        // let localhost = "http://localhost:3000"
        const {data}  = await axios.patch(`${process.env.VUE_APP_URL}/api/v1/certificate/${certificate_id}`, payloadData, config)
        if(data.statusCode == 200){
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "( บันทึกเรียบร้อยแล้ว )",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          }).finally(()=>{
            context.dispatch("GetCertificateListByAccount",{account_id : certificate_data.account_id})
          })
        }
      }catch(error){
        console.log(error)
      }
    },
    async DeleteCertificate(context, {cartificate_id, account_id}){
      try{
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // let localhost = "http://localhost:3000"
        const {data}  = await axios.delete(`${process.env.VUE_APP_URL}/api/v1/certificate/${cartificate_id}`, config)
        if(data.statusCode == 200){
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "( ลบรายการเรียบร้อยแล้ว )",
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          }).finally(()=>{
            context.dispatch("GetCertificateListByAccount",{account_id : account_id})
          })
        }
      }catch(error){
        console.log(error)
      }
    },
    async GetDataRelationsManagement(context, data_account) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            'Authorization': `Bearer ${VueCookie.get("token")}`
          }
        }


        if (data_account?.userRoles?.map((val) => { return val.roleId }).includes("R_5")) {
          let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/relations/user/?student_id=${data_account.userOneId}`, config)
          if (data.statusCode === 200) {
            if (data?.data?.message !== "relation not found.") {

              context.commit("SetDataUserRelationsManagement", data.data)

            } else {
              context.commit("SetDataUserRelationsManagement", [])

            }


          } else {
            throw { error: data }
          }
        } else if (data_account?.userRoles?.map((val) => { return val.roleId }).includes("R_4")) {
          let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/relations/user/?parent_id=${data_account.userOneId}`, config)
          if (data.statusCode === 200) {
            if (data?.data?.message !== "relation not found.") {

              context.commit("SetDataUserRelationsManagement", data.data)

            } else {
              context.commit("SetDataUserRelationsManagement", [])

            }

          } else {
            throw { error: data }
          }
        }
      } catch (error) {
        console.log(error)
      }
    },

  },

  getters: {
    certificate_count(state){
      return state.certificate_count
    },
    course_coach_list(state){
      return state.course_coach_list
    },
    getStudent(state) {
      return state.students
    },
    getParent(state) {
      return state.parents
    },
    getUserData(state) {
      return state.user_data
    },
    getCertificate(state) {
      return state.certificates
    },
    getDataRelationsManagement(state) {
      return state.data_user_relation_management
    },
  },
};

export default UserManageModules;
