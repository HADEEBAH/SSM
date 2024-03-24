import axios from "axios";
function convertObjectToString(object) {
    for (let key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            // Check if the value is an object with a 'value' property
            if (typeof object[key] === 'object' && object[key] !== null && 'value' in object[key]) {
                // Replace the nested object with its value or an empty string if 'value' is missing
                object[key] = object[key].value !== undefined ? object[key].value : "";
            } else {
                // If the value is not a nested object with a 'value' property, recursively call the function
                object[key] = convertObjectToString(object[key]);
            }
        }
    }
    return object;
}
const importUserModules = {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
        async downloadfile(){
            const response = await axios.get(`http://localhost:3000/api/v1/get-file-s3?key=template/template.xlsx`,{ responseType: 'blob'})
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
            payload.student = payload.student.map(convertObjectToString) 
            payload.parent = payload.parent.map(convertObjectToString) 
            console.log(payload)
        }
    },
    getters: {},
  };
  
  export default importUserModules;
  