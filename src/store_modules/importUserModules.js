import axios from "axios";

const importUserModules = {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
        async downloadfile(){
            await axios.get(`http://localhost:3000/api/v1/download-file-template?key=template/template.xlsx`)
        }
    },
    getters: {},
  };
  
  export default importUserModules;
  