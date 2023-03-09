<template>
  <v-app>
    <v-container>
        <v-card flat>
            <v-card-text class="bg-[#FBF3F5] border">
                <v-row>
                    <v-col cols="auto">
                        <v-img class="rounded-lg" src="https://cdn.vuetifyjs.com/images/cards/cooking.png" max-height="120" max-width="120"></v-img>
                    </v-col>
                    <v-col>
                        <v-row>
                            <v-col>
                                <div class="text-md font-bold"> อาณาจักรดนตรี </div>
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="12" sm="4" class="pa-0">
                                <rowData mini  icon="mdi-bookshelf">คอร์สเรียน : เปียโนป๊อป</rowData>
                            </v-col>
                            <v-col cols="12" sm="4"  class="pa-0"> 
                                <rowData mini  icon=" mdi-account-box-multiple">แพ็คเกจ : Family</rowData>
                            </v-col>
                            <v-col cols="12" sm="4" class="pa-0"><rowData mini  icon="mdi-clock-outline">เวลาสอน 1 ชั่วโมง</rowData></v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-row dense>
            <v-col class="text-md font-bold">
                ลงเวลาเข้าสอน 
            </v-col>
        </v-row>
        <v-row dense class="mb-3">
            <v-col align="center">
               <v-btn @click="check_in = true" depressed dense :color="check_in ? '#E6E6E6' :  '#ff6b81' " 
               class="w-full rounded-lg"
               :class="check_in ? 'green--text' :  'white--text'"
               >
                    <template v-if="check_in">
                        <v-icon class="mr-2">mdi-check-circle</v-icon> เข้าสอน
                    </template>
                    <template v-else>
                        <v-icon class="mr-2">mdi-clock-edit-outline</v-icon> กดเพื่อลงเวลาเข้าสอน
                    </template>
               </v-btn>
            </v-col>
        </v-row>    
        <v-tabs class="mb-3" v-model="tab" color="#ff6b81" grow>
            <v-tab class="border-b-2" href="#check in"> เช็คชื่อ </v-tab>
            <v-tab class="border-b-2" href="#assess students"> ประเมินนักเรียน </v-tab>
            <v-tab class="border-b-2" href="#teaching summary"> บันทึกสรุปการสอน </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item value="check in">
                <v-card elevation="1" class="mb-2">
                    <v-data-table
                        class="header-table border"
                        :items="students" 
                        item-key="no"
                        :expanded.sync="expanded_index"
                        :headers="headers">
                        <template v-slot:[`item.actions`] ="{item}">
                            <v-select
                                :items="check_in_status_options"
                                outlined
                                dense
                                item-text="label"
                                item-value="value"
                                hide-details
                                v-model="item.check_in_status"
                                @change="selectCheckInStatus(item, $event)"
                            >
                            <template #item="{ item }">
                                <v-list-item-content>
                                    <v-list-item-title :style="`color:${item.color}`">{{ item.label }}</v-list-item-title>
                                </v-list-item-content>
                            </template>
                            <template #selection="{ item }">
                                <v-list-item-title :style="`color:${item.color}`">{{ item.label }}</v-list-item-title>
                            </template>
                            </v-select>
                        </template>
                        <template v-slot:[`item.class_time`] ="{item}">
                            {{ `${item.count}/${item.max_count}` }}
                        </template>
                        <template v-slot:expanded-item ="{ headers, item }">
                            <td class="pa-2" :colspan="headers.length" align="center" >
                                <v-row dense class="d-flex align-center">
                                    <v-col  cols="12" sm="2">วันเรียนชดเชย</v-col>
                                    <v-col  cols="12" sm="4">
                                        <v-menu
                                            v-model="item.menu_compensation_date"
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            min-width="auto"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                dense
                                                outlined
                                                hide-details
                                                v-model="item.compensation_date_str"
                                                readonly
                                                placeholder="เลือกวันที่เริ่ม"
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                <template v-slot:append>
                                                    <v-icon :color="item.compensation_date? '#FF6B81': ''">mdi-calendar</v-icon>
                                                </template>
                                            </v-text-field>
                                            </template>
                                            <v-date-picker
                                                :min="new Date().toISOString()"
                                                @input="inputDate($event,item )"
                                                v-model="item.compensation_date"
                                            ></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" sm class="">
                                        <v-row dense class="d-flex alicn-center">
                                            <v-col cols="auto" class="pr-2"> 
                                                <TimePicker
                                                    :minuteStep="30"
                                                    :class="item.start_time ? 'active' : ''"
                                                    placeholder="เวลาเริ่มต้น"
                                                    format="HH:mm"
                                                    v-model="item.start_time"
                                                    @change="onChange"
                                                >
                                                </TimePicker>
                                            </v-col>
                                            <v-col cols="auto" class="pl-2">
                                                <TimePicker
                                                    :minuteStep="30"
                                                    format="HH:mm"
                                                    :class="item.end_time ? 'active' : ''"
                                                    placeholder="เวลาสิ้นสุด"
                                                    v-model="item.end_time"
                                                    @change="onChange"
                                                    ></TimePicker>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
                <v-row>
                    <v-col>
                        <v-btn dense outlined class="w-full" color="#ff6b81">บันทึก</v-btn>
                    </v-col>
                </v-row>
            </v-tab-item>
            <v-tab-item value="assess students">
                 <!-- TAB ASSESS -->
                <v-card class="mb-2" flat>
                    <v-card-text class="border bg-[#F6F0F1]">
                        <v-row>
                            <v-col cols="6" class="pa-1">
                                <v-btn depressed class="w-full" :class="tab_evaluate === 'evaluate_students' ? 'white--text' : ''" :color="tab_evaluate === 'evaluate_students' ? '#ff6b81' : '' " @click="tab_evaluate='evaluate_students'">
                                    ประเมินนักเรียน
                                </v-btn>
                            </v-col>
                            <v-col cols="6" class="pa-1">
                                <v-btn depressed class="w-full" :class="tab_evaluate === 'learners_potential' ? 'white--text' : ''"  :color="tab_evaluate === 'learners_potential' ? '#ff6b81' : '' " @click="tab_evaluate='learners_potential'">
                                    ประเมินศักยภาพผู้เรียน
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                  <!-- DETAIL -->
                <div v-if="tab_evaluate === 'evaluate_students'">
                    <v-card class="mb-2 " flat style="border: 1px solid #999" v-for="(student, index_student) in students" :key="`${index_student}-student`">
                        <v-card-text >
                            <v-row class="d-flex align-center">
                                <v-col cols="5" class="text-lg font-bold">
                                    {{ student.no }} {{ student.fullname }}
                                </v-col>
                                <v-col cols="4" class="text-lg font-bold">
                                    {{ student.nickname }}
                                </v-col>
                                <v-col cols="3" class="pa-1 text-md text-[#999999]">
                                    <v-row>
                                        <v-col> การเข้าเรียน: </v-col>
                                        <v-col>
                                            <v-chip class="font-bold" :color="check_in_status_options.filter(v => v.value === student.check_in_status)[0].bg_color" :style="`color:${check_in_status_options.filter(v => v.value === student.check_in_status)[0].color}`" v-if="check_in_status_options.filter(v => v.value === student.check_in_status).length > 0" >{{ check_in_status_options.filter(v => v.value === student.check_in_status)[0].label }} </v-chip>
                                        </v-col>
                                    </v-row>
                                </v-col>    
                            </v-row>
                            <v-row class="d-flex align-center">
                                <v-col cols="5">
                                    <labelCustom text="พัฒนาการ"></labelCustom>
                                    <v-select outlined dense></v-select>
                                </v-col>
                                <v-col cols="4">
                                    <labelCustom text="ความสนใจ"></labelCustom>
                                    <v-select outlined dense></v-select>
                                </v-col>
                                <v-col cols="3">
                                    <v-btn outlined class="text-sm" color="#ff6b81" @click="selectStudentComment()">
                                        แสดงความคิดเห็น
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-btn color="#ff6b81" outlined dense class="w-full" > ล้างข้อ </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-btn color="#ff6b81" dark depressed dense class="w-full"> ส่งข้อมูล </v-btn>
                        </v-col>
                    </v-row>
                </div>
                <div v-else>
                    <v-card class="mb-2 " flat style="border: 1px solid #999" v-for="(student, index_student) in students" :key="`${index_student}-student`">
                        <v-card-text >
                            <v-row class="d-flex align-center">
                                <v-col cols="5" class="text-lg font-bold">
                                    {{ student.no }} {{ student.fullname }}
                                </v-col>
                                <v-col cols="4" class="text-lg font-bold">
                                    {{ student.nickname }}
                                </v-col>
                                <v-col cols="3" class="pa-1 text-md text-[#999999]">
                                    <v-row>
                                        <v-col> การเข้าเรียน: </v-col>
                                        <v-col>
                                            <v-chip class="font-bold" :color="check_in_status_options.filter(v => v.value === student.check_in_status)[0].bg_color" :style="`color:${check_in_status_options.filter(v => v.value === student.check_in_status)[0].color}`" v-if="check_in_status_options.filter(v => v.value === student.check_in_status).length > 0" >{{ check_in_status_options.filter(v => v.value === student.check_in_status)[0].label }} </v-chip>
                                        </v-col>
                                    </v-row>
                                </v-col>    
                            </v-row>
                            <v-row class="d-flex align-center">
                                <v-col cols="5">
                                    <labelCustom text="พัฒนาการ"></labelCustom>
                                    <v-select outlined dense></v-select>
                                </v-col>
                                <v-col cols="4">
                                    <labelCustom text="ความสนใจ"></labelCustom>
                                    <v-select outlined dense></v-select>
                                </v-col>
                                <v-col cols="3">
                                    <v-btn outlined class="text-sm" color="#ff6b81" @click="selectStudentComment()">
                                        แสดงความคิดเห็น
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-btn color="#ff6b81" outlined dense class="w-full" > ล้างข้อ </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-btn color="#ff6b81" dark depressed dense class="w-full"> ส่งข้อมูล </v-btn>
                        </v-col>
                    </v-row>
                </div>
            </v-tab-item>
            <v-tab-item value="teaching summary">
                <v-row dense>
                    <v-col>
                        <labelCustom text="บันทึกการสอน"></labelCustom>
                        <v-textarea outlined placeholder="ระบุความคิดเห็น..."></v-textarea>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <labelCustom text="พัฒนาการ / การบ้าน"></labelCustom>
                        <v-textarea outlined placeholder="ระบุความคิดเห็น..."></v-textarea>
                    </v-col>
                </v-row>
                <!-- Upload file -->
                <v-card flat class="mb-3">
                    <v-card-text class="border-dashed border-2 border-pink-600 rounded-lg">
                        <v-row v-if="previewUrl">
                        <v-col>
                            <img :src="previewUrl" style="max-height: 200px" />
                        </v-col>
                        </v-row>
                        <v-row v-if="!previewUrl">
                        <v-col cols="12" class="flex align-center justify-center">
                            <v-img
                            src="../../../assets/manage_coach/upload_file.png"
                            max-height="105"
                            max-width="122"
                            ></v-img>
                        </v-col>
                        <v-col cols="12" class="flex align-center justify-center text-h5">
                            แนบไฟล์รูปภาพหรือวิดีโอ
                        </v-col>
                        <v-col cols="12" class="flex align-center justify-center">
                            <v-btn text class="underline" color="#ff6b81" @click="openFileSelector"
                            >อัพโหลดไฟล์แนบ</v-btn
                            >
                            <input
                            ref="fileInput"
                            type="file"
                            @change="uploadFile"
                            style="display: none"
                            />
                        </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-row dense>
                    <v-col cols="12" sm="6">
                        <v-btn  class="w-full" text color="#ff6b81">
                            ล้างข้อมูล
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-btn class="w-full" depressed color="#ff6b81" dark >
                            บันทึก
                        </v-btn>
                    </v-col>
                </v-row>
            </v-tab-item>
        </v-tabs-items>
        <v-dialog v-model="show_comment_dialog">
            <v-card>
                <v-row dense>
                    <v-col cols="12" align="right">
                        <v-btn icon @click="closeStudentComment">
                            <v-icon color="#ff6b81">mdi-close</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-card-title>
                    ความคิดเห็นเพิ่มเติม
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <labelCustom text="เพิ่มความคิดเห็น"></labelCustom>
                            <v-textarea></v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
  </v-app>
</template>
<script>
import { dateFormatter } from '@/functions/functions';
import rowData from '@/components/label/rowData.vue';
import { Input, TimePicker } from 'ant-design-vue';
import labelCustom from '../../../components/label/labelCustom.vue';
export default {
  name:"menageCourseDetail",
  components: { rowData  , TimePicker, labelCustom},
  directives: {
    'ant-input': Input,
  },
  data: () => ({
    tab:"assess students",
    expanded_index: [],
    check_in : false,
    previewUrl: null,
    show_comment_dialog : false,
    tab_evaluate : "evaluate_students", // Evaluate students, Assess the learner's potential
    check_in_status_options :[
        {label : "ตรงเวลา", value : "punctual", color: "#58A144", bg_color : "#F0F9EE"},
        {label : "สาย", value : "late", color: "#FCC419", bg_color : "#FFF9E8"},
        {label : "ลา", value : "leave", color: "#43A4F5", bg_color : "#CFE2F3"},
        {label : "ลาฉุกเฉิน", value : "special case", color: "#43A4F5", bg_color : "#CFE2F3"}, 
        {label : "ขาด", value : "miss", color: "#F03D3E", bg_color : "#F4CCCC"},
        
    ],
    headers: [
        { text: 'ลำดับ', align: 'center', sortable: false, value: 'no', },
        { text: 'ชื่อ-สกุล', align: 'center', sortable: false, value: 'fullname' },
        { text: 'ชื่อเล่น', align: 'center',  sortable: false, value: 'nickname' },
        { text: 'จำนวนครั้ง', align: 'center',  sortable: false, value: 'class_time' },
        { text: 'การเข้าเรียน', align: 'center', width:'200',  sortable: false, value: 'actions' },
    ],

    students: [
        {no:"1", fullname : "กมลรัตน์ สิทธิกรชัย", nickname : "เมย์พิ้ง", check_in_status: "punctual", compensation_date : "", compensation_date_str : "", time : "", start_time : "" , end_time : "", menu_compensation_date : false, menu_time : false, count: 7, max_count : 15},
        {no:"2", fullname : "ออกัส สิหาคม", nickname : "ออกัส", check_in_status: "punctual", compensation_date : "", compensation_date_str : "",time : "", start_time : "" , end_time : "", menu_compensation_date : false, menu_time : false, count: 2, max_count : 4},
        {no:"3", fullname : "น่านฟ้า ทะเลไกล", nickname : "น้ำฟ้า", check_in_status: "", compensation_date : "", compensation_date_str : "", time : "", start_time : "" , end_time : "", menu_compensation_date : false, menu_time : false, count: 2, max_count : 4},
        {no:"4", fullname : "วรวุฒิ สารวงศ์", nickname : "อ้วน", check_in_status: "", compensation_date : "", compensation_date_str : "", time : "", start_time : "" , end_time : "", menu_compensation_date : false, menu_time : false, count: 1, max_count : 4},
        {no:"5", fullname : "วรวุฒิ สารวงศ์", nickname : "อ้วน", check_in_status: "", compensation_date : "", compensation_date_str : "", time : "", start_time : "" , end_time : "", menu_compensation_date : false, menu_time : false, count: 7, max_count : 15},
    ]
  }),
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    selectStudentComment(){
        this.show_comment_dialog = true
    },
    closeStudentComment(){
        this.show_comment_dialog = false
    },
    onChange(date, dateString) {
      console.log(date, dateString);
    },
    timeRange(item) {
        item.time = `${item.start_time || 'Start time'} - ${item.end_time || 'End time'}`
    },
    selectCheckInStatus(item, status){
        console.log(item)
        if(status === "leave" || status === "special case"){
            // const index = this.students.filter((d) => d.no === item.no)
            this.expanded_index.push(item)
        }
    },
    inputDate(e, item) {
        this.students.filter(v => v.no === item.no)[0].compensation_date_str = dateFormatter(e,"DD MT YYYYT")
    },
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      if (!this.file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.file);
    },
  },
};
</script>
<style>

</style>
