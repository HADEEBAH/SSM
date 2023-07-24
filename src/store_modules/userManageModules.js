import axios from "axios";
import VueCookie from "vue-cookie"
const UserManageModules = {
  namespaced: true,
  state: {

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
      // selectedboxParent: false,
      isCardParentOpen: false,

    },
    searchTerm: "",
    inputValue: "",



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
      certificates: [],
      certificate_detail: {
        name_certificate: "",
        certificate_date: "",
        previewUrl: null,
        fileName: ''
      }
    },
    parents: [
      {
        username: "",
        firstname: "",
        lastname: "",
        tel: "",
      },
    ],
    data_user_relation_management: []
  },
  mutations: {
    SetStudent(state, payload) {
      state.students = payload
    },

    SetUserData(state, payload) {
      state.userData = payload
    },

    SetCertificate(state, payload) {
      // console.log(555, payload);
      state.students.certificates = payload
    },
    SetDataUserRelationsManagement(state, payload) {
      state.data_user_relation_management = payload
    },

  },

  actions: {
    changeStudentsData(context, studentData) {
      context.commit("studentData", studentData)
      // console.log(studentData)
    },

    changeUserData(context, userData) {
      context.commit("userData", userData)
      // console.log(userData)
    },

    changeParentData(context, ParentData) {
      context.commit("ParentData", ParentData)
      // console.log(ParentData)
    },

    ChangeCardStudens(context, studentcardData) {
      context.commit("SetStudent", studentcardData)
      // console.log(studentcardData)
    },
    changeStudentsCertificate(context, students) {
      context.commit("SetCertificate", students)
      // console.log(555, students)
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

        // console.log("data_account=======>", data_account);

        if (data_account?.userRoles?.map((val) => { return val.roleId }).includes("R_5")) {
          let { data } = await axios.get(`${process.env.VUE_APP_URL}/api/v1/relations/user/?student_id=${data_account.userOneId}`, config)
          if (data.statusCode === 200) {
            // console.log("data=> st", data);
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
            // console.log("data=> pa", data);
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
        // console.log(error)
      }
    },

    async updateUserData(context, payload) {
      console.log("context=>", context);
      console.log("payload=>", payload);

    }

  },

  getters: {
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
      // console.log(555);
      return state.students.certificates
    },
    getDataRelationsManagement(state) {
      return state.data_user_relation_management
    },
  },
};

export default UserManageModules;
