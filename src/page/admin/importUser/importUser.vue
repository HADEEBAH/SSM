<template>
    <v-container>
        <headerPage :title="$t('import user')" slot_tag>
          <template>
            <v-row dense>
                <v-col>
                    <v-btn outlined dense color="#ff6b81" @click="downloadTemplateFile()">
                        <v-icon>mdi-download-box-outline</v-icon>
                        <span>download template</span>
                    </v-btn>
                </v-col>
                <!-- <v-col>
                    <v-btn depressed dark dense color="#ff6b81">
                        <v-icon>mdi mdi-upload-box</v-icon>
                        <span>upload template</span>
                    </v-btn>
                </v-col> -->
            </v-row>
          </template>
        </headerPage>
        <v-card v-if="(!fileStudent && !fileParent) && !returnFile" outlined class="text-center">
            <v-card-text>
                <v-row>
                    <v-col>
                        กรุณาอัพโหลดไฟล์
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-btn depressed dark dense color="#ff6b81" @click="openFileSeleter()">
                            <v-icon>mdi mdi-upload-box</v-icon>
                            <span>upload template</span>
                        </v-btn>
                    </v-col>
                </v-row>
                <input ref="fileInput" style="display: none" type="file" @input="handleFileChange" accept=".xlsx" />
            </v-card-text>
        </v-card>
        <div v-if="!uploadIsloading">
            <div v-if="fileParent" class="mb-3">
                <v-row dense>
                    <v-col>
                        <span class="text-lg">
                            <strong>{{ $t('parent') }}</strong>
                        </span>
                    </v-col>
                </v-row>
                <v-card outlined class="mb-3">
                    <v-data-table
                    v-if="fileParent && headersParent.length > 0"
                    :headers="formattedHeadersParent"
                    :items="fileParent"
                    hide-default-footer
                    disable-pagination
                    >
                        <template #item="data">
                            <tr>
                                <template v-for="(item, index) in data.item" >
                                    <td v-if="!unHeader.includes(index)" :key="index">
                                        <input v-if="index!=='REMARK'" class="input-border rounded-md" v-model="item.value">
                                        <span class="text-xs" :class="validateInputTable(data.item, index) ? `text-[${validateInputTable(data.item, index).color}]` : ''">
                                            {{validateInputTable(data.item, index) ? validateInputTable(data.item, index).text : ''}}
                                        </span>
                                    </td>
                                </template>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card>
            </div>
            <div v-if="fileStudent">
                <v-row dense>
                    <v-col>
                        <span class="text-lg">
                            <strong>{{ $t('student') }}</strong>
                        </span>
                    </v-col>
                </v-row>
                <v-card outlined class="mb-3">
                    <v-data-table
                    v-if="fileStudent && headersStudent.length > 0"
                    :headers="formattedHeadersStudent"
                    :items="fileStudent"
                    hide-default-footer
                    disable-pagination
                    >
                        <template #item="data">
                            <tr>
                                <template v-for="(item, index) in data.item" >
                                    <td v-if="!unHeader.includes(index)" :key="index">
                                        <input v-if="index!=='REMARK'" class="input-border rounded-md" v-model="item.value">
                                        <span class="text-xs" :class="validateInputTable(data.item, index) ? `text-[${validateInputTable(data.item, index).color}]` : ''">
                                            {{validateInputTable(data.item, index) ? validateInputTable(data.item, index).text : ''}}
                                        </span>
                                    </td>
                                </template>
                               
                            </tr>
                        </template>
                    </v-data-table>
                </v-card>
                <v-row dense>
                    <v-col align="right">
                        <v-btn outlined color="#ff6b81" @click="cancel()">{{ $t('cancel') }}</v-btn>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn depressed dark color="#ff6b81" @click="save()">{{ $t('save') }}</v-btn>
                    </v-col>
                </v-row>
            </div>
        </div>
        <div v-else class="w-full d-flex justify-center align-center" style="height: 300px;">
            <v-progress-circular
                :size="50"
                color="pink"
                indeterminate
            ></v-progress-circular>
        </div>
    </v-container>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import { mapActions, mapGetters, mapMutations } from 'vuex';
const XLSX = require('xlsx');
export default {
    components: { headerPage },
    data() {
        return {
            fileParent: null,
            fileStudent: null,
            file: null,
            headersStudent: [],
            headersParent: [],
            unHeader : ['ROLE','ROLE_ID','ACCOUNT_ID']
        };
    },
    computed: {
        ...mapGetters({
            returnFile: "importUserModules/returnFile",
            uploadIsloading : "importUserModules/uploadIsloading"
        }),
        formattedHeadersStudent() {
            return this.headersStudent.map(header => ({ text: header, value: header }));
        },
        formattedHeadersParent() {
            return this.headersParent.map(header => ({ text: header, value: header }));
        }
    },
    watch:{
        "returnFile": function(val){
            this.file = null
            this.headersStudent = Object.keys(val.STUDENT[0]).filter(v => !this.unHeader.includes(v))
            this.headersParent = Object.keys(val.PARENT[0]).filter(v => !this.unHeader.includes(v))
            this.fileParent = val.PARENT
            this.fileStudent = val.STUDENT
        }
    },
    methods:{
        ...mapActions({
            downloadfile : "importUserModules/downloadfile",
            uploadUser : "importUserModules/uploadUser"
        }),
        ...mapMutations({
            setReturnFile: "importUserModules/returnFile"
        }),
        downloadTemplateFile () {
            this.downloadfile()
        },
        openFileSeleter(){
            this.$refs.fileInput.click();
        },
        validateInputRowTable(data){
            const row = []
            for (const key of Object.keys(data.item)) {
               if(this.validateInputTable(data.item, key)){
                row.push('x')
               }
            }
            return row.length > 0 
        },
        validateInputTable(data, index){
            const error = ['Username is already used.', 'The username or password or tel format is invalid.','Duplicate username', 'Parameter missing. Required username.', 'Username relation not found. Or this username role not match.']
            switch (index) {
                case 'USERNAME':
                    if (!data[index].value || data[index].value.length < 6) {
                        return {text : this.$t('please enter a username at least 6 characters long'), color: "#ee3333"} 
                    }
                    break;
                case 'PASSWORD':
                    if (!data[index].value || data[index].value.length < 8 ) {
                        return {text : this.$t('please enter a password that is at least 8 characters long'), color: "#ee3333"}
                    } else if ( !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(data[index].value)) {
                        return {text :this.$t('password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'), color: "#ee3333"}
                    }
                    break;
                case 'REMARK':
                    if (error.includes(data[index].value)) {
                        return  {text :this.$t(data[index].value), color: "#ee3333"}
                    } 
                    if (!error.includes(data[index].value)) { 
                        return  {text :this.$t(data[index].value), color: "#c8eab2"}
                    }
                    break;
            }
        },
        handleFileChange(event) {
            this.file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const arrayBuffer = e.target.result;
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const sheetNames = workbook.SheetNames;
                for (const sheetName of sheetNames) {
                    if (sheetName === 'STUDENT') {
                        const worksheet = workbook.Sheets[sheetName];
                        const data = XLSX.utils.sheet_to_json(worksheet);
                        if (data) {
                            this.headersStudent = Object.keys(data[0]);
                            // Create an array of objects with a 'value' property for each cell
                            this.fileStudent = data.map(row => {
                                const rowData = {};
                                this.headersStudent.forEach(header => {
                                    rowData[header] = { value: row[header] }; // Initialize value property
                                });
                                return rowData;
                            });
                        }
                    } else  if (sheetName === 'PARENT') {
                        const worksheet = workbook.Sheets[sheetName];
                        const data = XLSX.utils.sheet_to_json(worksheet);
                        if (data) {
                            this.headersParent = Object.keys(data[0]);
                            // Create an array of objects with a 'value' property for each cell
                            this.fileParent = data.map(row => {
                                const rowData = {};
                                this.headersParent.forEach(header => {
                                    rowData[header] = { value: row[header] }; // Initialize value property
                                });
                                return rowData;
                            });
                        }
                    }
                }
            };
            reader.readAsArrayBuffer(this.file);
        },
        save() {
            this.uploadUser({
                payload: {
                    STUDENT: this.fileStudent,
                    PARENT: this.fileParent
                }
            })
        },
        cancel(){
            this.fileStudent = null
            this.fileParent = null
            this.file = null
            this.setReturnFile(null)
        }
    }
}
</script>

<style>

</style>