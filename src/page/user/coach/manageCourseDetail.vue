<template>
  <v-app>
    {{setFunctios}}
    <v-container>
        <v-card flat>
            <v-card-text class="bg-[#FBF3F5] border">
                <v-row>
                    <v-col cols="auto">
                        <v-img class="rounded-lg" :src="course_data.course_img ? course_data.course_img : 'https://cdn.vuetifyjs.com/images/cards/cooking.png'" max-height="120" max-width="120"></v-img>
                    </v-col>
                    <v-col>
                        <v-row>
                            <v-col>
                                <div class="text-md font-bold"> {{course_data.category_name_th}} </div>
                            </v-col>
                            <v-col>
                                <div class="text-md font-bold"> {{ GenDate($route.params.date) }} </div>
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="12" sm class="pa-0">
                                <rowData mini  icon="mdi-bookshelf">คอร์สเรียน : {{ course_data.course_name_th  }}</rowData>
                            </v-col>
                            <!-- <v-col cols="12" sm="4"  class="pa-0"> 
                                <rowData mini  icon=" mdi-account-box-multiple">แพ็คเกจ : Family</rowData>
                            </v-col> -->
                            <v-col cols="12" sm class="pa-0"><rowData mini  icon="mdi-clock-outline">เวลาสอน {{course_data.course_hours}} ชั่วโมง</rowData></v-col>
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
               <v-btn @click="checkIn()" depressed dense :color="student_check_in.length > 0 ? '#E6E6E6' :  '#ff6b81' " 
               class="w-full rounded-lg"
               
               :loading="coach_check_in_is_loading"
               :class="student_check_in.length > 0 ? 'green--text' :  'white--text'"
               >
                    <template v-if="student_check_in.length > 0">
                        <v-icon class="mr-2">mdi-check-circle</v-icon> เข้าสอน
                    </template>
                    <template v-else>
                        <v-icon  class="mr-2">mdi-clock-edit-outline</v-icon> กดเพื่อลงเวลาเข้าสอน
                    </template>
               </v-btn>
            </v-col>
        </v-row>   
        <v-tabs class="mb-3" v-model="tab" color="#ff6b81" grow>

            <v-tab class="border-b-2" href="#check in"> เช็คชื่อ </v-tab>
            <v-tab :disabled="student_check_in.length == 0" class="border-b-2" href="#assess students"> ประเมินนักเรียน </v-tab>
            <v-tab :disabled="student_check_in.length == 0" class="border-b-2" href="#teaching summary"> บันทึกสรุปการสอน </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item value="check in">
                <v-card elevation="1" class="mb-2">
                    <v-data-table
                        class="header-table border"
                        :items="student_check_in" 
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
                        <template v-slot:[`item.class_time`] ="{}">
                            <!-- {{ `${item.count}/${item.max_count}` }} -->
                            -
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
                                                placeholder="เลือกวันที่ชดเชย"
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                <template v-slot:append>
                                                    <v-icon :color="item.compensation_date? '#FF6B81': ''">mdi-calendar</v-icon>
                                                </template>
                                            </v-text-field>
                                            </template>
                                            <v-date-picker
                                                :min="new Date($route.params.date).toISOString()"
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
                    <v-col align="right">
                        <v-btn  :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'" v-if="student_check_in.length > 0" dense outlined   @click="CheckInStudents"  color="#ff6b81">บันทึก</v-btn>
                    </v-col>
                </v-row>
            </v-tab-item>
            <v-tab-item value="assess students">
                 <!-- TAB ASSESS -->
                <v-card class="mb-2" flat>
                    <v-card-text class="border bg-[#F6F0F1]">
                        <v-row>
                            <v-col cols="6" class="pr-1">
                                <v-btn depressed class="w-full" :class="tab_evaluate === 'evaluate_students' ? 'white--text' : ''" :color="tab_evaluate === 'evaluate_students' ? '#ff6b81' : '' " @click="tab_evaluate='evaluate_students'">
                                    ประเมินนักเรียน
                                </v-btn>
                            </v-col>
                            <v-col cols="6" class="pl-1" >
                                <v-badge v-if="student_check_in.filter(v => v.type === 'potential').length > 0" size="x-large" class="w-full" :content="student_check_in.filter(v => v.type === 'potential').length" color="red">
                                    <v-btn depressed  :disabled="!student_check_in.filter(v => v.type === 'potential').length > 0" class="w-full" :class="tab_evaluate === 'learners_potential' ? 'white--text' : ''"  :color="tab_evaluate === 'learners_potential' ? '#ff6b81' : '' " @click="tab_evaluate='learners_potential'">
                                        ประเมินศักยภาพผู้เรียน
                                    </v-btn>
                                </v-badge>
                                <v-btn v-else depressed :disabled="!student_check_in.filter(v => v.type === 'potential').length > 0" class="w-full" :class="tab_evaluate === 'learners_potential' ? 'white--text' : ''"  :color="tab_evaluate === 'learners_potential' ? '#ff6b81' : '' " @click="tab_evaluate='learners_potential'">
                                    ประเมินศักยภาพผู้เรียน
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                  <!-- DETAIL -->
                <div v-if="tab_evaluate === 'evaluate_students'">
                    <template  v-if="student_check_in.filter(v => v.type === 'general').length > 0">
                        <v-card class="mb-2 " flat style="border: 1px solid #999" v-for="(student, index_student) in student_check_in.filter(v => v.type === 'general' && (v.status == 'punctual' || v.status == 'late'))" :key="`${index_student}-student`">
                            <v-card-text >
                                <v-row class="d-flex align-center">
                                    <v-col cols="12" sm class="text-lg font-bold">
                                        {{ student.no }} {{ student.fullname }}
                                    </v-col>
                                    <v-col cols="12" sm="5" class="pa-1 text-md text-[#999999]">
                                        <v-row dense class="d-flex aling-center">
                                            <v-col  align="right"> การเข้าเรียน: </v-col>
                                            <v-col cols="auto">
                                                <v-chip class="font-bold" :color="check_in_status_options.filter(v => v.value === student.check_in_status)[0].bg_color" :style="`color:${check_in_status_options.filter(v => v.value === student.check_in_status)[0].color}`" v-if="check_in_status_options.filter(v => v.value === student.check_in_status).length > 0" >{{ check_in_status_options.filter(v => v.value === student.check_in_status)[0].label }} </v-chip>
                                            </v-col>
                                        </v-row>
                                    </v-col>    
                                </v-row>
                                <v-row class="d-flex align-center">
                                    <v-col cols="12" sm="5" class="">
                                        <labelCustom text="พัฒนาการ"></labelCustom>
                                        <v-select outlined dense hide-details :items="evolution_options" item-text="label" item-value="value" v-model="student.assessment.evolution"></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <labelCustom text="ความสนใจ"></labelCustom>
                                        <v-select outlined dense hide-details :items="interest_options" item-text="label" item-value="value" v-model="student.assessment.interest"></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="3">
                                        <br>
                                        <v-btn outlined class="text-sm" color="#ff6b81" @click="selectStudentComment(index_student)">
                                            แสดงความคิดเห็น
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </template>
                    <v-card v-else outlined class="my-3">
                        <v-card-text class="text-lg font-bold" align="center">
                            ไม่พบข้อมูล
                        </v-card-text>
                    </v-card>
                    <v-row>
                        <v-col cols="12" sm align="right">
                            <v-btn color="#ff6b81"  @click="clearAssessment()" outlined dense :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'" > ล้างข้อ </v-btn>
                        </v-col>
                        <v-col cols="12" sm="auto">
                            <v-btn color="#ff6b81"  @click="saveAssessmentStudent()" dark depressed dense:class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"> ส่งข้อมูล </v-btn>
                        </v-col>
                    </v-row>
                </div>
                <div v-else>
                    <v-card class="mb-2 " flat style="border: 1px solid #999" v-for="(student, index_student) in student_check_in.filter(v => v.type === 'potential')" :key="`${index_student}-student`">
                        <v-card-text >
                            <v-row class="d-flex align-center">
                                <v-col cols="12" sm class="text-lg font-bold">
                                    {{ student.no }} {{ student.fullname }}
                                </v-col>
                                <!-- <v-col cols="4" class="text-lg font-bold">
                                    {{ student.nickname }}
                                </v-col> -->
                                <v-col cols="12" sm="5" class="pa-1 text-md text-[#999999]">
                                    <v-row dense class="d-flex aling-center">
                                        <v-col  align="right"> การเข้าเรียน: </v-col>
                                        <v-col cols="auto">
                                            <v-chip class="font-bold" :color="check_in_status_options.filter(v => v.value === student.check_in_status)[0].bg_color" :style="`color:${check_in_status_options.filter(v => v.value === student.check_in_status)[0].color}`" v-if="check_in_status_options.filter(v => v.value === student.check_in_status).length > 0" >{{ check_in_status_options.filter(v => v.value === student.check_in_status)[0].label }} </v-chip>
                                        </v-col>
                                    </v-row>
                                </v-col>    
                            </v-row>
                            <v-row class="d-flex align-center">
                                <v-col cols="12" sm="5" class="">
                                    <labelCustom text="พัฒนาการ"></labelCustom>
                                    <v-select outlined dense hide-details :items="evolution_options" item-text="label" item-value="value" v-model="student.assessment.evolution"></v-select>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <labelCustom text="ความสนใจ"></labelCustom>
                                    <v-select outlined dense hide-details :items="interest_options" item-text="label" item-value="value" v-model="student.assessment.interest"></v-select>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <br>
                                    <v-btn outlined class="text-sm" color="#ff6b81" @click="selectStudentComment(index_student)">
                                        แสดงความคิดเห็น
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-btn color="#ff6b81"  @click="clearAssessment()" outlined dense class="w-full" > ล้างข้อ </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-btn color="#ff6b81"  @click="saveAssessmentStudent()" dark depressed dense class="w-full"> ส่งข้อมูล </v-btn>
                        </v-col>
                    </v-row>
                </div>
            </v-tab-item>
            <v-tab-item value="teaching summary">
                <v-row dense>
                    <v-col>
                        <labelCustom text="บันทึกการสอน"></labelCustom>
                        <v-textarea outlined placeholder="ระบุความคิดเห็น..." v-model="coach_check_in.summary"></v-textarea>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <labelCustom text="พัฒนาการ / การบ้าน"></labelCustom>
                        <v-textarea outlined placeholder="ระบุความคิดเห็น..." v-model="coach_check_in.homework"></v-textarea>
                    </v-col>
                </v-row>
                <!-- Upload file -->
                <v-card flat class="mb-3">
                    <v-card-text class="border-dashed border-2 border-pink-600 rounded-lg">
                        <v-row v-if="preview_summary_files && preview_summary_files.length > 0">
                            <v-col cols="3" align="center" class="rounded-lg pa-2" v-for="(file, index) in preview_summary_files" :key="index">
                                <v-img :src="file" contain  
                                max-height="200"
                                max-width="200"  align="right">
                                <v-btn v-if="coach_check_in.attachment.length == 0" icon class="bg-[#f00]" dark @click="removeSummaryFile(index)"><v-icon>mdi-close</v-icon></v-btn>
                                </v-img>
                            </v-col>
                        </v-row>
                        <v-row v-if="preview_summary_files && preview_summary_files.length == 0">
                        <v-col cols="12" class="flex align-center justify-center">
                            <v-img
                            src="../../../assets/manage_coach/upload_file.png"
                            max-height="105"
                            max-width="122"
                            ></v-img>
                        </v-col>
                        <v-col cols="12" class="flex align-center justify-center text-h5">
                            แนบไฟล์รูปภาพหรือวิดีโอ (ส่วนนี้ยังอัพโหลดไม่ได้)
                        </v-col>
                        <v-col cols="12" class="flex align-center justify-center">
                            <v-btn text class="underline" color="#ff6b81" @click="openFileSelector"
                            >อัพโหลดไฟล์แนบ</v-btn
                            >
                            <input
                            ref="fileInput"
                            type="file"
                            accept="image/*"
                            multiple
                            @change="previewSummaryFile"
                            style="display: none"
                            />
                        </v-col>
                        </v-row>
                    </v-card-text>
                </v-card> 
                <v-row dense>
                    <v-col cols="12" sm="6">
                        <v-btn  class="w-full" text color="#ff6b81" @click="clearTeachingNote">
                            ล้างข้อมูล
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-btn class="w-full" depressed color="#ff6b81" dark @click="saveSummary" >
                            บันทึก
                        </v-btn>
                    </v-col>
                </v-row>
            </v-tab-item>
        </v-tabs-items>
        <v-dialog :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"  v-model="show_comment_dialog" v-if="show_comment_dialog">
            <v-card  class="pa-1">
                <v-row dense>
                    <v-col class="pa-0" cols="12" align="right">
                        <v-btn icon @click="closeStudentComment">
                            <v-icon color="#ff6b81">mdi-close</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-card-text>
                    <v-row dense>
                        <v-col align="center" class="text-lg font-bold">
                            ความคิดเห็นเพิ่มเติม
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col>
                            <labelCustom text="เพิ่มความคิดเห็น"></labelCustom>
                            <v-textarea outlined v-model="student_check_in[selected_student].assessment.remark"></v-textarea>
                        </v-col>
                    </v-row>
                    <div v-if="student_check_in[selected_student].assessment.attachment.length > 0">
                        <v-row dense>
                            <v-col class="font-bold text-lg ">
                            ไฟล์แนบ
                            </v-col>
                        </v-row>
                        <v-card flat class="mb-3" v-for="(file, index) of student_check_in[selected_student].assessment.attachment" :key="`${index}-fileattachment`">
                            <v-card-text class="border border-2 border-[#ff6b81] rounded-lg">
                            <v-row>
                                <v-col cols="auto" class="pr-2">
                                <v-img height="35" width="26" src="../../../assets/coachLeave/file-pdf.png"/>
                                </v-col>
                                <v-col  class="px-2">
                                    <span class="font-bold">{{ file.attId }}</span><br>
                                    <!-- <span class="text-caption">ขนาดไฟล์ : {{ (0 / 1000000).toFixed(2) }} MB</span> -->
                                </v-col>
                                <!-- <v-col cols="auto" class="pl-2">
                                <v-btn @click="removePotentialFile(index)" icon color="#ff6b81"><v-icon>mdi-close</v-icon></v-btn>
                                </v-col> -->
                            </v-row>
                            </v-card-text>
                        </v-card>
                    </div>
                    <v-card flat class="mb-3" v-if="student_check_in[selected_student].type === 'general'">
                        <v-card-text class="border-dashed border-2 border-pink-600 rounded-lg">
                            <v-row>
                            <v-col cols="12" class="flex align-center justify-center">
                                <v-img
                                    src="../../../assets/manage_coach/upload_file.png"
                                    max-height="105"
                                    max-width="122"
                                ></v-img>
                            </v-col>
                            <v-col cols="12" class="flex align-center justify-center">
                                <v-btn text class="underline" color="#ff6b81" @click="openPotentialfileInputSelector"
                                >อัพโหลดไฟล์แนบ</v-btn
                                >
                                <input
                                    ref="potentialfileInput"
                                    type="file"
                                    multiple
                                    @change="uploadPotentialFile(selected_student)"
                                    style="display: none"
                                />
                            </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card> 
                    
                    <div v-if="selected_files.length > 0" class="mb-3">
                        <v-row dense>
                            <v-col class="font-bold text-lg ">
                            ไฟล์แนบ
                            </v-col>
                        </v-row>
                        <v-divider class="my-2"></v-divider>
                        <v-card flat class="mb-3" v-for="(file, index) of selected_files" :key="`${index}-file`">
                            <v-card-text class="border border-2 border-[#ff6b81] rounded-lg">
                            <v-row>
                                <v-col cols="auto" class="pr-2">
                                <v-img height="35" width="26" src="../../../assets/coachLeave/file-pdf.png"/>
                                </v-col>
                                <v-col  class="px-2">
                                    <span class="font-bold">{{ file.name }}</span><br>
                                    <span class="text-caption">ขนาดไฟล์ : {{ (file.size / 1000000).toFixed(2) }} MB</span>
                                </v-col>
                                <v-col cols="auto" class="pl-2">
                                <v-btn @click="removePotentialFile(index)" icon color="#ff6b81"><v-icon>mdi-close</v-icon></v-btn>
                                </v-col>
                            </v-row>
                            </v-card-text>
                        </v-card>
                    </div>
                    <v-row dense>
                    <v-col cols="12" sm="6">
                        <v-btn  class="w-full" @click="student_check_in[selected_student].assessment.remark = ''" text color="#ff6b81">
                            ล้างข้อมูล
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-btn class="w-full" @click="closeStudentComment" depressed color="#ff6b81" dark >
                            ตกลง
                        </v-btn>
                    </v-col>
                </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
  </v-app>
</template>
<script>
import { dateFormatter, CheckFileSize } from '@/functions/functions';
import rowData from '@/components/label/rowData.vue';
import { Input, TimePicker } from 'ant-design-vue';
import labelCustom from '../../../components/label/labelCustom.vue';
import { mapActions, mapGetters } from 'vuex';
import Swal from "sweetalert2";
export default {
  name:"menageCourseDetail",
  components: { rowData  , TimePicker, labelCustom},
  directives: {
    'ant-input': Input,
  },
  data: () => ({
    tab:"check in",
    evolution_options : [{label : "ดีมาก" , value : "very good"},{label : "ดี" , value : "good"}, {label : "ปรับปรุง" , value : "adjust"}],
    interest_options : [{label : "ดีมาก" , value : "very good"},{label : "ดี" , value : "good"}, {label : "ปรับปรุง" , value : "adjust"}],
    expanded_index: [],
    check_in : false,
    previewUrl: null,
    show_comment_dialog : false,
    tab_evaluate : "evaluate_students", // Evaluate students, Assess the learner's potential
    check_in_status_options :[
        {label : "ตรงเวลา", value : "punctual", color: "#58A144", bg_color : "#F0F9EE"},
        {label : "สาย", value : "late", color: "#FCC419", bg_color : "#FFF9E8"},
        {label : "ลา", value : "leave", color: "#43A4F5", bg_color : "#CFE2F3"},
        {label : "ลาฉุกเฉิน", value : "emergency leave", color: "#43A4F5", bg_color : "#CFE2F3"}, 
        {label : "ขาด", value : "absent", color: "#F03D3E", bg_color : "#F4CCCC"},
        
    ],
    headers: [
        { text: 'ลำดับ', align: 'center', sortable: false, value: 'no', },
        { text: 'ชื่อ-สกุล', align: 'center', sortable: false, value: 'fullname' },
        { text: 'จำนวนครั้ง', align: 'center',  sortable: false, value: 'class_time' },
        { text: 'การเข้าเรียน', align: 'center', width:'200',  sortable: false, value: 'actions' },
    ],

    students: [
        {no:"1", fullname : "กมลรัตน์ สิทธิกรชัย", nickname : "เมย์พิ้ง", check_in_status: "punctual", compensation_date : "", compensation_date_str : "", time : "", start_time : "" , end_time : "", menu_compensation_date : false, menu_time : false, count: 7, max_count : 15},
        {no:"2", fullname : "ออกัส สิหาคม", nickname : "ออกัส", check_in_status: "punctual", compensation_date : "", compensation_date_str : "",time : "", start_time : "" , end_time : "", menu_compensation_date : false, menu_time : false, count: 2, max_count : 4},
        {no:"3", fullname : "น่านฟ้า ทะเลไกล", nickname : "น้ำฟ้า", check_in_status: "", compensation_date : "", compensation_date_str : "", time : "", start_time : "" , end_time : "", menu_compensation_date : false, menu_time : false, count: 2, max_count : 4},
        {no:"4", fullname : "วรวุฒิ สารวงศ์", nickname : "อ้วน", check_in_status: "", compensation_date : "", compensation_date_str : "", time : "", start_time : "" , end_time : "", menu_compensation_date : false, menu_time : false, count: 1, max_count : 4},
        {no:"5", fullname : "วรวุฒิ สารวงศ์", nickname : "อ้วน", check_in_status: "", compensation_date : "", compensation_date_str : "", time : "", start_time : "" , end_time : "", menu_compensation_date : false, menu_time : false, count: 7, max_count : 15},
    ],
    selected_student : null,
    preview_summary_files : [],
    selected_files :[],
  }),
  created() { 
    // this.GetCourse(this.$route.params.courseId)
    // this.GetCoachCheckIn({course_id :this.$route.params.courseId, date : this.$route.params.date})
    // this.GetStudentByTimeId({course_id :this.$route.params.courseId, date : this.$route.params.date, time_id: this.$route.params.timeId})
  },
  mounted() {
    
    // this.GetCoachCheckIn({course_id :this.$route.params.courseId, date : this.$route.params.date})
    // this.student_check_in.forEach((check_in_data)=>{
    //     if(check_in_data.status === "leave" || check_in_data.status === "special case"){
    //         this.selectCheckInStatus(check_in_data,check_in_data.status)
    //     }
       
    // }) 
  },
  watch: {
    "coach_check_in":function(){
        console.log(this.coach_check_in)
        if(this.coach_check_in.attachment){
            if(this.coach_check_in?.attachment.length > 0){
                for(const img_url of this.coach_check_in.attachment){
                    this.preview_summary_files.push(img_url.attFilesUrl)
                }
            }
        }
    },
    "student_check_in":function(){
        this.student_check_in.forEach((check_in_data)=>{
            if(check_in_data.status === "leave" || check_in_data.status === "special case"){
                this.selectCheckInStatus(check_in_data,check_in_data.status)
                this.expanded_index.push(check_in_data)
            }
        })
    }
  },
  computed: {
    ...mapGetters({
        course_data : "CourseModules/getCourseData",
        coach_check_in : "CoachModules/getCoachCheckIn",
        student_check_in : "CoachModules/getStudentCheckIn",
        coach_check_in_is_loading : "CoachModules/getCoachCheckInIsLoading"
    }),
    setFunctios(){
        this.GetCourse(this.$route.params.courseId)
        this.GetCoachCheckIn({course_id :this.$route.params.courseId, date : this.$route.params.date})
        this.GetStudentByTimeId({course_id :this.$route.params.courseId, date : this.$route.params.date, time_id: this.$route.params.timeId})
        // this.GetCoachCheckIn({course_id :this.$route.params.courseId, date : this.$route.params.date})
        return ''
    }
  },
  methods: {
    ...mapActions({
        GetCoachCheckIn : "CoachModules/GetCoachCheckIn",
        GetCourse : "CourseModules/GetCourse",
        CheckInCoach :"CoachModules/CheckInCoach",
        GetStudentByTimeId : "CoachModules/GetStudentByTimeId",
        UpdateCheckInStudent : "CoachModules/UpdateCheckInStudent",
        AssessmentStudent : "CoachModules/AssessmentStudent",
        CreateTeachingNotes : "CoachModules/CreateTeachingNotes",
        UploadFileSummary : "CoachModules/UploadFileSummary",
    }),
    clearTeachingNote(){
        this.coach_check_in.summary = null
        this.coach_check_in.homework = null
        this.coach_check_in.files = null
    },
    GenUrlFile(part){
        return  `${process.env.VUE_APP_URL}/api/v1/files/${part}`
    },
    GenDate(data){
        return new Date(data).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
    },
    saveSummary(){
        Swal.fire({
            icon: "question",
            title: "ต้องการบันทึกใช่หรือไม่ ?",
            showDenyButton: false,
            showCancelButton: true,
            cancelButtonText :"ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then(async (result) => {
            if (result.isConfirmed) {
                this.UploadFileSummary({checkInCoach : this.coach_check_in , files : this.coach_check_in.summary_files })
            }
        })
    },
    saveCreateTeachingNotes(){
        Swal.fire({
            icon: "question",
            title: "ต้องการบันทึกใช่หรือไม่ ?",
            showDenyButton: false,
            showCancelButton: true,
            cancelButtonText :"ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then(async (result) => {
            if (result.isConfirmed) {
                this.CreateTeachingNotes({check_in_coach_id : this.coach_check_in.checkInCoachId, check_in_coach_data : this.coach_check_in})  
            }
        })
    },
    saveAssessmentStudent(){
        Swal.fire({
            icon: "question",
            title: "ต้องการบันทึกใช่หรือไม่ ?",
            showDenyButton: false,
            showCancelButton: true,
            cancelButtonText :"ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then(async (result) => {
            if (result.isConfirmed) {
                this.AssessmentStudent({students : this.student_check_in})
            }
        })
        
    },
    CheckInStudents(){
        Swal.fire({
            icon: "question",
            title: "ต้องการบันทึกใช่หรือไม่ ?",
            showDenyButton: false,
            showCancelButton: true,
            cancelButtonText :"ยกเลิก",
            confirmButtonText: "ตกลง",
        }).then(async (result) => {
            if (result.isConfirmed) {
                this.UpdateCheckInStudent({students : this.student_check_in}) 
            }
        })  
    },
    checkIn(){
        if(this.student_check_in.length === 0){
            Swal.fire({
            icon: "question",
            title: "ต้องการลงเวลาเข้าสอนใช่หรือไม่",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "ตกลง",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    this.check_in = true
                    this.CheckInCoach({course_id :this.course_data.course_id, date : this.$route.params.date, time_id: this.$route.params.timeId})
                }
            })
        }
    },
    selectStudentComment(index){
        this.selected_student = index
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
        this.student_check_in.filter(v => v.no === item.no)[0].compensation_date_str = dateFormatter(e,"DD MT YYYYT")
    },
    openFileSelector() {
        this.$refs.fileInput.click();
    },
    openPotentialfileInputSelector() {
        this.$refs.potentialfileInput.click();
    },
    removePotentialFile(index){
        this.selected_files.splice(index, 1)
    },
    clearAssessment(){
        for (const student of this.student_check_in) {
            student.evolution = ""
            student.interest = ""
            student.remark = ""
        }
       
    },
    // uploadFile() {
    //   this.file = this.$refs.fileInput.files[0];
    //   if (!this.file) return;
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     this.previewUrl = e.target.result;
    //   };
    //   reader.readAsDataURL(this.file);
    // },
    uploadPotentialFile(selected_student) {
      const files = this.$refs.potentialfileInput.files
      this.student_check_in[selected_student].files = []
      if(files.length > 0){
        for (let i = 0; i < files.length; i++) {
            if(CheckFileSize(files[i])===true){
                this.selected_files.push(files[i])
                this.student_check_in[selected_student].files.push(files[i])
            }
        }
      }
    },

    previewSummaryFile(event) {
      const selectedFiles = event.target.files;
      this.coach_check_in.summary_files =[]
      const fileUrls = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        if(CheckFileSize(selectedFiles[i])===true){
            this.coach_check_in.summary_files.push(selectedFiles[i])
            const file = selectedFiles[i];
            const reader = new FileReader();
            reader.onload = () => {
                fileUrls.push(reader.result);
                if (fileUrls.length == selectedFiles.length) {
                this.preview_summary_files = [...this.preview_summary_files, ...fileUrls];
                }
            };
            reader.readAsDataURL(file);
        }
      }
    },
    removeSummaryFile(index){
        this.preview_summary_files.splice(index, 1)
    }
  },
};
</script>
<style>

</style>
