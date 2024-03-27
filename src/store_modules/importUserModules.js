import axios from "axios";
// import VueCookie from "vue-cookie";
function convertObjectToString(object) {
    for (let key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          console.log('object', object)
          console.log('key', key)
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
      returnFile: null
    },
    mutations: {
      async setReturnFile (state, payload) {
        state.returnFile = payload
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
          const endpoint = "http://localhost:3000/api/v1/account/import/excel-data-user"
          const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMzM1NDE5NjQyNDY1MTY1IiwidXNlciI6Inl1dGh5dXRoIiwicm9sZXMiOlt7InJvbGVOYW1lRW5nIjoiU3VwZXIgYWRtaW4iLCJyb2xlTmFtZVRoIjoi4Lic4Li54LmJ4LiU4Li54LmB4Lil4Lij4Liw4Lia4Lia4Liq4Li54LiH4Liq4Li44LiUIiwicm9sZUlkIjoiUl8xIn1dLCJpYXQiOjE2ODgzNjk5MTUsImV4cCI6MTc4ODM2OTkxNCwiaXNzIjoibG9jYWxob3N0IiwianRpIjoiMjg0NjUyMmUtMDk3Mi00YWY2LWJjZjYtZjIwYTM2M2M4MWYyIn0.pjWTbJDQRk35sFxIyXM9fIoie0PuA7_NphpFTKIZCNA`
          const config = {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-type": "Application/json",
              'Authorization': `Bearer ${token}`
              // 'Authorization': `Bearer ${VueCookie.get("token")}`
            }
          }
          try {
            payload.STUDENT = payload.STUDENT.map(convertObjectToString) 
            payload.PARENT = payload.PARENT.map(convertObjectToString)

            let { data } = await axios.post(
              `${endpoint}`,payload,config
            );

            console.log('data=>', data)
            if (data.statusCode === 201) {
              context.commit("setReturnFile", data.data);
            }
          } catch (error) {
            console.log('error', error)
          }
        }
    },
    getters: {
      getReturnFile(state) {
        return state.returnFile
      },
    },
  };
  
  export default importUserModules;
  