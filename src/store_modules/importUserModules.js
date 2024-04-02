import axios from "axios";
import Swal from "sweetalert2";
import VueCookie from "vue-cookie";
import VueI18n from "../i18n";
const XLSX = require('xlsx');

function convertObjectToString(object) {
    for (let key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          // console.log('object', object)
          // console.log('key', key)
            // Check if the value is an object with a 'value' property
            if (typeof object[key] === 'object' && object[key] !== null && 'value' in object[key]) {
                // Replace the nested object with its value or an empty string if 'value' is missing
                object[key] = object[key].value !== undefined ? object[key].value : "";
            } else {
                // If the value is not a nested object with a 'value' property, recursively call the function
                object[key] = convertObjectToString(object[key]);
            }

            if (key === "TEL") {
              object[key] =  object[key]?.replaceAll("-", "")
            }
        }
    }
    return object;
}
const importUserModules = {
    namespaced: true,
    state: {
      returnFile: null,
      uploadIsloading: false,
    },
    mutations: {
      setReturnFile (state, payload) {
        state.returnFile = payload
      },
      setUploadIsloading (state, value) {
        state.uploadIsloading = value
      }
    },
    actions: {
        async downloadfile(){
            const response = await axios.get(`${process.env.VUE_APP_URL}/api/v1/get-file-s3?key=template/template.xlsx`,{ responseType: 'blob'})
            if (response.status === 200) {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "template.xlsx"; // Set the filename based on the key
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
        },
        async uploadUser(context, {payload}){          
          context.commit("setUploadIsloading", true)
          const endpoint = `${process.env.VUE_APP_URL}/api/v1/account/import/excel-data-user`
          const config = {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-type": "Application/json",
              'Authorization': `Bearer ${VueCookie.get("token")}`
            }
          }
          try {
            payload.STUDENT = payload.STUDENT.map(convertObjectToString) 
            payload.PARENT = payload.PARENT.map(convertObjectToString)
            let { data } = await axios.post(`${endpoint}`, payload, config)
            const error = ['Username is already used.', 'The username or password or tel format is invalid.','Duplicate username', 'Parameter missing. Required username.', 'Username relation not found. Or this username role not match.']
            const errorData = []
            data.data.STUDENT.map( v => {
              for( const key of Object.keys(v)){
                if( key === 'REMARK' ){
                  if(error.includes(v[key])){
                    errorData.push('x')
                  }
                }
              }
              return v
            })
            data.data.PARENT.map( v => {
              for( const key of Object.keys(v)){
                if( key === 'REMARK' ){
                  if(error.includes(v[key])){
                    errorData.push('x')
                  }
                }
              }
              return v
            })
            if (data.statusCode === 201) {
              if(errorData.length === 0){
                Swal.fire({
                  icon: 'success',
                  title: VueI18n.t('succeed'),
                  text: VueI18n.t('save data successfully'),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                })
                const workbook = XLSX.utils.book_new();
                const parentSheet = XLSX.utils.json_to_sheet(data.data.PARENT);
                XLSX.utils.book_append_sheet(workbook, parentSheet, 'PARENT');
                const studentSheet = XLSX.utils.json_to_sheet(data.data.STUDENT);
                XLSX.utils.book_append_sheet(workbook, studentSheet, 'STUDENT');
                XLSX.writeFile(workbook, "userComplete.xlsx");
                data.data.STUDENT.map( v => {
                  for( const key of Object.keys(v)){
                    v[key] = {value : v[key]}
                  }
                  return v
                })
                data.data.PARENT.map( v => {
                  for( const key of Object.keys(v)){
                    v[key] = {value : v[key]}
                  }
                  return v
                })
              } else {
                data.data.STUDENT.map( v => {
                  for( const key of Object.keys(v)){
                    v[key] = {value : v[key]}
                  }
                  return v
                })
                data.data.PARENT.map( v => {
                  for( const key of Object.keys(v)){
                    v[key] = {value : v[key]}
                  }
                  return v
                })
              }
              context.commit("setReturnFile", data.data);
              context.commit("setUploadIsloading", false)
            }
          } catch (error) {
            Swal.fire({
              icon:'error',
              title: VueI18n.t("something went wrong"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            })
            payload.STUDENT.map( v => {
              for( const key of Object.keys(v)){
                v[key] = {value : v[key]}
              }
              return v
            })
            payload.PARENT.map( v => {
              for( const key of Object.keys(v)){
                v[key] = {value : v[key]}
              }
              return v
            })
            context.commit("setReturnFile", payload);
            context.commit("setUploadIsloading", false)
          }
        }
    },
    getters: {
      returnFile(state) {
        return state.returnFile
      },
      uploadIsloading(state){
        return state.uploadIsloading
      }
    },
  };
  
  export default importUserModules;
  