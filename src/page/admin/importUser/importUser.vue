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
        <v-card v-if="!fileStudent || !fileParent" outlined class="text-center">
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
                <input ref="fileInput" style="display: none" type="file" @change="handleFileChange" accept=".xlsx" />
            </v-card-text>
        </v-card>
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
                            <td v-for="(item, index) in data.item" :key="index">
                                <input v-model="item.value" @input="updateData(index, data)">
                            </td>
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
                            <td v-for="(item, index) in data.item" :key="index">
                                <input v-model="item.value" @input="updateData(index, data)">
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </v-card>
            <v-row dense>
                <v-col align="right">
                    <v-btn outlined color="#ff6b81">{{ $t('cancel') }}</v-btn>
                </v-col>
                <v-col cols="auto">
                    <v-btn depressed dark color="#ff6b81" @click="save()">{{ $t('save') }}</v-btn>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import { mapActions } from 'vuex';
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
        };
    },
    computed: {
        formattedHeadersStudent() {
            return this.headersStudent.map(header => ({ text: header, value: header }));
        },
        formattedHeadersParent() {
            return this.headersParent.map(header => ({ text: header, value: header }));
        }
    },
    methods:{
        ...mapActions({
            downloadfile : "importUserModules/downloadfile",
            uploadUser : "importUserModules/uploadUser"
        }),
        downloadTemplateFile () {
            this.downloadfile()
        },
        openFileSeleter(){
            this.$refs.fileInput.click();
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
               
               
                console.log("Headers:", this.headers);
                console.log("Data:", this.fileParent , this.fileStudent );
            };
            reader.readAsArrayBuffer(this.file);
        },
        save() {
            this.uploadUser({
                payload: {
                    student: this.fileStudent,
                    parent: this.fileParent
                }
            })
        },
    }
}
</script>

<style>

</style>