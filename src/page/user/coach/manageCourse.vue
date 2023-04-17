<template>
  <div>
    <v-container>
      <header-page  title="เลือกข้อมูลการสอน" ></header-page>
      <v-row dense class="mb-3">
        <v-col cols="auto" sm="4" v-for="(tab_data, tab_index) in tabs" :key="tab_index">
          <v-btn 
            class="w-full pa-2" 
            @click="tab =  tab_data.value" 
            depressed 
            :dark="tab === tab_data.value" 
            :color="tab === tab_data.value ? '#ff6b81' : '#F5F5F5'">
            {{ tab_data.label }}
          </v-btn>
        </v-col>
      </v-row>
      <div v-if="tab === 'teaching list'">
        <v-row class="mb-2">
          <v-col cols="12"  align="center">
            <v-card  flat width="340px"  >
              <v-card-text class="pa-2 border-2 border-[#ff6b81] rounded-lg">
                <v-row dense class="d-flex justify-center">
                  <v-col cols="auto" v-for="(time, time_index) in time_frame_list" :key="`${time_index}-time`">
                    <v-btn 
                    @click="time_frame = time.value" 
                    depressed 
                    :dark = "time_frame === time.value"
                    :color="time_frame === time.value ? '#ff6b81' : '#F5F5F5' " >{{time.label}}</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- รายวัน -->
        <template v-if="time_frame === 'day'">
          <!-- COURSE LIST -->
          <div v-for="(course, course_index) in my_courses.filter(v => v.statr_date === genToday)" :key="course_index">
            <!-- {{ new Date(course.start) }} -->
            <course-card-list class="mb-2" bg_color="#fff" :title="course.name" :course_per_time="`เวลาสอน :${course.course_per_time}`" :period="`${course.start_time}-${course.end_time}`">
              <template #img>
                <v-img class="rounded-lg" :src="course.course_img ? course.course_img :'https://cdn.vuetifyjs.com/images/cards/cooking.png'" max-height="120" max-width="120"></v-img>
              </template>
            </course-card-list>
          </div>
          <div>
            <v-card flat>
              <v-card-text class="pa-2 py-4 text-center border-2 border-[#ff6b81] rounded-lg">
                 <span class="text-lg font-bold"> 
                   <v-icon color="#ff6b81">mdi-alert-outline</v-icon> ไม่พบข้อมูลการสอน
                 </span>              
              </v-card-text>
            </v-card>
          </div>
        </template>
        <!-- รายสัปดาห์ -->
        <template v-else>
          <!-- COURSE LIST -->
          <calendarCoach
            :events="my_courses"
            :type="time_frame"
          ></calendarCoach>
        </template>
      </div>
      
      <div v-if="tab === 'my teaching'">
        <v-row>
          <v-col cols="auto">
            ข้อมูลการสอนข้อฉัน : 
          </v-col>
          <v-col class="font-bold">
            {{ `${user_detail.first_name_th} ${user_detail.last_name_th}`}}
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
              <span class="font-bold">เลือกคอร์ส</span>
              <v-autocomplete v-model="filter_course" item-text="name" item-value="course_id" :items="my_courses"  outlined dense></v-autocomplete>
          </v-col>
        </v-row>
        <v-card  dense class=" mb-3" elevation="0" flat  v-for="(course, course_index) in filterMycourse()" :key="`${course_index}-course`">
          <v-card-text class="bg-[#FBF3F5]">
            <v-row dense>
              <v-col cols="4">
                <v-img class="rounded-lg" height="160" :src="course.course_img ? course.course_img :'https://cdn.vuetifyjs.com/images/cards/cooking.png'" />
              </v-col>
              <v-col>
                <v-row>
                  <v-col class="font-bold text-md">{{ course.start_date_str }}</v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <rowData mini  icon="mdi-account">อาณาจักร : {{ course.category_name }}</rowData>
                  </v-col>
                  <v-col cols="12">
                    <rowData mini  icon="mdi-bookshelf">คอร์สเรียน : {{ `${course.name}(${course.subtitle})` }}</rowData>
                  </v-col>
                  <v-col cols="12">
                    <rowData mini  icon="mdi-clock-time-four-outline">เวลาสอน {{ course.course_per_time }} ชั่วโมง</rowData>
                  </v-col>
                  <v-col cols="12">
                    <v-chip small color="#F9B320" dark>{{ `${course.start_time} - ${course.end_time}` }}น.</v-chip>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- <v-row dense>
              <v-col>ประเมินนักเรียน</v-col>
              <v-col>ประเมินศักยภาพ</v-col>
              <v-col>ประเมินภาพรวม</v-col>
            </v-row> -->
          </v-card-text>
        </v-card>
      </div>
      <div v-if="tab === 'request leave'">
        <v-row>
          <v-col align="right">
            <v-btn @click="showLeaveForm" :class="$vuetify.breakpoint.smAndUp ? '' : 'w-full'" outlined color="#ff6b81"><v-icon>mdi-plus-circle-outline</v-icon>แบบฟอร์มการลา</v-btn>
          </v-col>
        </v-row>
        <v-row dense >
          <v-col cols="7">
            <img-card class="cursor-pointer" :class="tab === 'all' ? 'img-card-active':''">
              <template v-slot:img> 
                  <v-img max-height="90" max-width="70" src="../../../assets/leave/leave_all.png"></v-img>
              </template>
              <template v-slot:header>
                  <div class="font-bold text-center"> คอร์สทั้งหมด </div>
              </template>
              <template v-slot:detail>
                  <v-row class="d-flex align-end">
                      <v-col align="end" class="text-3xl font-bold">{{ courses.length }}</v-col>
                      <v-col class="text-sm">รายการ</v-col>
                  </v-row>
              </template>
            </img-card>
          </v-col>
          <v-col cols="5">
            <img-card class="cursor-pointer h-full" :class="tab === 'all' ? 'img-card-active':''">
              <template v-slot:img> 
                  <v-img max-height="90" max-width="70" src="../../../assets/leave/approve.png"></v-img>
              </template>
              <template v-slot:header>
                  <div class="font-bold text-center text-[#57A363]"> อนุมัติ </div>
              </template>
              <template v-slot:detail>
                  <v-row class="d-flex align-end">
                      <v-col align="end" class="text-3xl font-bold text-[#57A363]">{{ courses.length }}</v-col>
                      <v-col class="text-sm ">รายการ</v-col>
                  </v-row>
              </template>
            </img-card>
          </v-col>
        </v-row>
        <v-row dense class="mb-3">
          <v-col cols="4">
            <img-card class="cursor-pointer" :class="tab === 'all' ? 'img-card-active':''">
              <template v-slot:img> 
                  <v-img max-height="90" max-width="70" src="../../../assets/leave/panding.png"></v-img>
              </template>
              <template v-slot:header>
                  <div class="font-bold  text-center text-[#FCC419]"> รออนุมัติ </div>
              </template>
              <template v-slot:detail>
                  <v-row class="d-flex align-end">
                      <v-col align="end" class="text-3xl font-bold  text-[#FCC419]">{{ courses.length }}</v-col>
                      <v-col class="text-sm">รายการ</v-col>
                  </v-row>
              </template>
            </img-card>
          </v-col>
          <v-col cols="4">
            <img-card class="cursor-pointer" :class="tab === 'all' ? 'img-card-active':''">
              <template v-slot:img> 
                  <v-img max-height="90" max-width="70" src="../../../assets/leave/non-approve.png"></v-img>
              </template>
              <template v-slot:header>
                  <div class="font-bold text-center  text-[#F03D3E]"> ไม่อนุมัติ </div>
              </template>
              <template v-slot:detail>
                  <v-row class="d-flex align-end">
                      <v-col align="end" class="text-3xl font-bold  text-[#F03D3E]">{{ courses.length }}</v-col>
                      <v-col class="text-sm">รายการ</v-col>
                  </v-row>
              </template>
            </img-card>
          </v-col>
          <v-col cols="4">
            <img-card class="cursor-pointer" :class="tab === 'all' ? 'img-card-active':''">
              <template v-slot:img> 
                  <v-img max-height="90" max-width="70" src="../../../assets/leave/cancel.png"></v-img>
              </template>
              <template v-slot:header>
                  <div class="font-bold text-center text-[#999999]"> ยกเลิก </div>
              </template>
              <template v-slot:detail>
                  <v-row class="d-flex align-end">
                      <v-col align="end" class="text-3xl font-bold text-[#999999]">{{ courses.length }}</v-col>
                      <v-col class="text-sm">รายการ</v-col>
                  </v-row>
              </template>
            </img-card>
          </v-col>
        </v-row>
        <v-card>
          <v-card-text>
            <v-data-table 
              class="elevation-1 header-table"
              :headers="column"
              :items="coach_leaves"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              item-key="id"
              show-expand
            >
            <template v-slot:[`item.leaveType`]="{ item }">
                {{ item.leaveType === "business" ? "ลากิจ" :item.leaveType === "sick" ? "ลาป่วย" : "ลาพักร้อน" }}
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <div class="d-flex align-center pa-1 rounded-lg" 
                :class="item.status === 'pending' ? 'bg-[#FFF9E8] text-[#FCC419]' : item.status === 'approved' ? 'bg-[#F0F9EE] text-[#58A144]' : item.status === 'cancel' ? 'bg-[#e8e8e8] text-[#636363]':'bg-[#ffeeee] text-[#f00808]'">
                <span class="w-full text-center">{{ item.status == 'pending' ? 'รออนุมัติ' : item.status === "approved" ? "อนุมัติ":  item.status === "cancel" ? "ยกเลิก":"ไม่อนุมัติ"   }}</span>
              </div>
            </template>
            <template v-slot:[`item.detail`]="{ item }">
                <v-btn icon color="#ff6b81" @click="showDialogDetail(item)"><v-icon>mdi-eye-outline</v-icon> </v-btn>
            </template>
            <template v-slot:[`item.action`]="{ item }">
                <v-btn icon color="#ff6b81" @click="cancelCoachLeave(item)"><v-icon>mdi-file-cancel-outline</v-icon> </v-btn>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length" class="py-3">
                <v-row>
                  <v-col cols="12">ผู้สอนแทน: {{ `${item.substituteCoachFirstNameTh} ${item.substituteCoachLastNameTh}` }}</v-col>
                  <v-col cols="12">หมายเหตุ: {{ item.remark }}</v-col>
                </v-row>
              </td>
            </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </div>
      <v-dialog :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''" v-model="show_leave_form" v-if="show_leave_form">
        <v-card class="pa-1">
          <v-row dense>
              <v-col class="pa-0" align="right">
                <v-btn @click="closeDialogLeaveForm" icon color="#ff6b81"><v-icon>mdi-close</v-icon></v-btn>
              </v-col>
          </v-row>
          <v-card-title class="d-flex justify-center">
            แบบฟอร์มขอลา
          </v-card-title>
          <v-card-text>
            <!-- DATE LEAVE AND PERIOD -->
            <v-row dense>
              <v-col cols="12">
                วันที่ลา
                <v-row dense>
                  <v-col cols="12" sm=6>
                    <v-menu
                      v-model="coach_leave_data.menu_start_date"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            outlined
                            v-model="coach_leave_data.start_date_str"
                            readonly
                            placeholder="เลือกวันที่เริ่มต้น"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <template v-slot:append>
                              <v-icon
                                :color=" coach_leave_data.start_date? '#FF6B81' : '' "
                                >mdi-calendar</v-icon
                              >
                            </template>
                          </v-text-field>
                        </template>
                        <v-date-picker
                          :min="today.toISOString()"
                          @input="inputDate($event, 'start')"
                          v-model="coach_leave_data.start_date"
                        ></v-date-picker>
                    </v-menu>  
                  </v-col>
                  <v-col cols="12" sm=6>
                    <v-menu
                      v-model="coach_leave_data.menu_end_date"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            outlined
                            v-model="coach_leave_data.end_date_str"
                            readonly
                            placeholder="เลือกวันที่สิ้นสุด"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <template v-slot:append>
                              <v-icon
                                :color="coach_leave_data.end_date? '#FF6B81' : '' "
                                >mdi-calendar</v-icon
                              >
                            </template>
                          </v-text-field>
                        </template>
                        <v-date-picker
                          :min="coach_leave_data.start_date ? coach_leave_data.start_date : today.toISOString()"
                          @input="inputDate($event, 'end')"
                          v-model="coach_leave_data.end_date"
                        ></v-date-picker>
                    </v-menu>  
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                ช่วงเวลา
                <v-select 
                dense 
                outlined 
                :items="periods" 
                item-text="label"
                item-value="value"
                v-model="coach_leave_data.period"></v-select>
              </v-col>
            </v-row>
            <!-- TYPE -->
            <v-row dense>
              <v-col cols="12">
                ประเภทการลา
                <v-select 
                dense 
                outlined 
                :items="leaveTypes" 
                item-text="label"
                item-value="value"
                v-model="coach_leave_data.leave_type"></v-select>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="auto">
                <v-icon color="#ff6b81">mdi-card-account-details-outline</v-icon>
              </v-col>
              <v-col class="font-bold text-lg ">
                 คอร์ส
              </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>
            <div class="mb-3">
              <v-card flat  v-for="(course, index) in coach_leave_data.courses" :key="index">
                <v-card-text class="rounded-md border">
                  <v-row dense>
                    <v-col>
                      ชื่อคอร์ส
                      <v-select 
                      dense 
                      outlined 
                      v-model="course.my_course_id"
                      :items="GenCourseLeaveOptions()" 
                      item-value="my_course_id" 
                      item-text="course_name" ></v-select>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      ผู้สอนแทน
                      <v-select 
                      dense 
                      outlined 
                      :items="coachs.filter(v => v.accountId !== user_detail.account_id )" 
                      item-value="accountId" 
                      item-text="fullNameTh" 
                      v-model="course.substitute_coach_id">
                    </v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <v-row dense>
              <v-col>
                รายละเอียดการลา
                <v-textarea v-model="coach_leave_data.remark" outlined></v-textarea>
              </v-col>
            </v-row>
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
                        max-height="80"
                        max-width="100"
                        ></v-img>
                    </v-col>
                    <v-col cols="12" class="flex align-center justify-center text-lg">
                        แนบไฟล์รูปภาพหรือวิดีโอ (ส่วนนี้ยังอัพโหลดไม่ได้)
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
            <v-row>
              <v-col cols="12" sm align="right">
                <v-btn text color="#ff6b81" @click="closeDialogLeaveForm()">ยกเลิก</v-btn>
              </v-col>
              <v-col cols="12" sm="auto" align="right">
                <v-btn depressed :disabled="validateCoachLeave" :dark="!validateCoachLeave" @click="saveCoachLeave()" color="#ff6b81">ส่งใบลา</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- <pre>{{ coachs }}</pre> -->
    </v-container>
  </div>
</template>
  <script>
import calendarCoach from "@/components/calendar/calendarCoach.vue";
import headerPage from '../../../components/header/headerPage.vue';
import rowData from '../../../components/label/rowData.vue';
import courseCardList from "../../../components/course/courseCardList.vue";
import imgCard from '../../../components/course/imgCard.vue';
import moment from 'moment';
import Swal from "sweetalert2";
import { dateFormatter } from "@/functions/functions";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "menageCourse",
  components: { calendarCoach, headerPage, courseCardList, rowData, imgCard },
  data: () => ({
    singleExpand: false,
    expanded: [],
    filter_course: "",
    user_detail : "",
    tab: "teaching list",
    today : new Date(),
    tabs : [
      {label: "รายการสอนวันนี้", value:"teaching list"},
      {label: "การสอนของฉัน", value:"my teaching"},
      {label: "ลงเวลาเพื่อขอลา", value:"request leave"}
    ],
    time_frame_list: [
      { label: "รายวัน", value: "day" },
      { label: "รายสัปดาห์", value: "week" },
      { label: "รายเดือน", value: "month" },
    ],
    time_frame: "day",
    menu: false,
    select_date : `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
    leave_tasks:[
      {
        id:1,
        date: "จ. 25 / 07 /65",
        leave_type : "ลาพักร้อน",
        status : "อนุมัติ",
        teacher : {
          teacher_name : "",
          teacher_id : "",
        },
        remark : ""
      },
      {
        id: 2,
        date: "จ. 25 / 07 /65",
        leave_type : "ลากิจ",
        status : "รออนุมัติ",
        teacher : {
          teacher_name : "",
          teacher_id : "",
        },
        remark : ""
      },
      {
        id: 3,
        date: "จ. 25 / 07 /65",
        leave_type : "ลาป่วย",
        status : "รออนุมัติ",
        teacher : {
          teacher_name : "",
          teacher_id : "",
        },
        remark : ""
      },
      {
        id: 4,
        date: "จ. 25 / 07 /65",
        leave_type : "ลาป่วย",
        status : "ไม่อนุมัติ",
        teacher : {
          teacher_name : "นางอรวรรณ ศรีสองเมืองไทย",
          teacher_id : "",
        },
        remark : "ไม่ได้แจ้งลาก่อนวันกำหนด"
      },
      { 
        id: 5,
        date: "จ. 25 / 07 /65",
        leave_type : "ลาพักร้อน",
        status : "อนุมัติ",
        teacher : {
          teacher_name : "นางอรวรรณ ศรีสองเมืองไทย",
          teacher_id : "",
        },
        remark : "ไม่ได้แจ้งลาก่อนวันกำหนด"
      }
    ],
    column:[
        {text: 'วันที่',align: 'start',sortable: false, value: 'date'},
        {text: 'ประเภทการลา',align: 'start',sortable: false, value: 'leaveType'},
        {text: 'สถานะ',align: 'center',sortable: false, value: 'status'},
        {text: '',align: 'center',sortable: false, value: 'detail'},
        {text: '',align: 'center',sortable: false, value: 'action'},
    ],
    courses: [
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        category_name : "อาณาจักรดนตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
        package : "Family"
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        category_name : "อาณาจักรดนตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
        package : "Family"
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        category_name : "อาณาจักรดนตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
        package : "Family"
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        category_name : "อาณาจักรดนตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
        package : "Family"
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        category_name : "อาณาจักรดนตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
        package : "Family"
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        category_name : "อาณาจักรดนตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
        package : "Family"
      },
    ],
    previewUrl : null,
    periods :[
      {label : "ลาเต็มวัน", value: "full"},
      {label : "ลาช่วงเช้า", value: "morning"},
      {label : "ลาช่วงบ่าย", value: "afternoon"},
    ],
    leaveTypes : [
      {label : 'ลาป่วย', value : 'sick'},
      {label : 'ลากิจ', value : "business"},
      {label : 'ลาพักร้อน', value :"take annual leave"},
    ],
    coach_leave_data : {
      menu_start_date : false,
      start_date :null,
      start_date_str : "",
      menu_end_date : false,
      end_date : null,
      end_date_str : "",
      period : "",
      coach_id : "",
      remark : "",
      status : "",
      leave_type : "",
      courses : [
        {
          my_course_id : "",
          course_id : "",
          substitute_coach_id : "",
          day_of_week_id: "",
          time_id : "",
        }
      ]
    },
    show_detail : false,
    show_leave_form : false,
  }),
  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"))
    this.GetMyCourses({coach_id : this.user_detail.account_id})
    this.GetLeavesByAccountId({account_id : this.user_detail.account_id})
    this.GetCoachs()
  },
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "จัดการ");
  },
  watch: {},
  computed: {
    ...mapGetters({
      my_courses : "CoachModules/getMyCourses",
      coachs : "CourseModules/getCoachs",
      coach_leaves : "CoachModules/getCoachLeaves",
    }),
    genToday(){
      return moment(new Date()).format("YYYY-MM-DD")
    },
    validateCoachLeave(){
      let start_date = this.coach_leave_data.start_date ? true : false 
      let end_date = this.coach_leave_data.end_date ? true : false 
      let period = this.coach_leave_data.period ? true : false 
      let leave_type = this.coach_leave_data.leave_type ? true : false
      let course = this.coach_leave_data.courses.length > 0 ? this.coach_leave_data.courses[0].my_course_id ? true : false : false
      console.log(start_date && end_date && period && leave_type && course)
      return !(start_date && end_date && period && leave_type && course)
    }
  },
  methods: {
    ...mapActions({
      GetMyCourses : "CoachModules/GetMyCourses",
      GetCoachs : "CourseModules/GetCoachs",
      SaveCoachLeave : "CoachModules/SaveCoachLeave",
      GetLeavesByAccountId : "CoachModules/GetLeavesByAccountId",
      updateStatusCoachLeave : "CoachModules/updateStatusCoachLeave"
    }),
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    cancelCoachLeave(data){    
      Swal.fire({
        icon: "question",
        title: "ต้องการยกเลิกใบลาใช่หรือไม่ ?",
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.updateStatusCoachLeave({coach_leave_id : data.coachLeaveId, status : 'cancel', account_id :this.user_detail.account_id})
        }
      })
      
    },
    saveCoachLeave(){
      Swal.fire({
        icon: "question",
        title: "ต้องการส่งใบลาใช่หรือไม่ ?",
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.coach_leave_data.courses.forEach((course)=>{
            let my_course_id_part = course.my_course_id.split("|")
            course.course_id = my_course_id_part[0]
            course.day_of_week_id = my_course_id_part[1]
            course.time_id  = my_course_id_part[2]
          })
          this.coach_leave_data.coach_id = this.user_detail.account_id
          this.SaveCoachLeave({coach_leave_data : this.coach_leave_data})
        }
      })
   
    },
    GenCourseLeaveOptions(){
      let my_course_data = []
      this.my_courses.forEach((course) => {
        my_course_data.push({
          my_course_id : `${course.course_id}|${course.day_of_week_id}|${course.time_id}`,
          cousre_id : course.course_id,
          course_name : `${course.name} ${course.start_time} - ${course.end_time}น.`,
          time_id : course.time_id,
          day_of_week_id : course.day_of_week_id,
        })
      });
      return my_course_data
    },
    inputDate(e, data) {
      switch (data) {
        case "start":
          this.coach_leave_data.start_date_str = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
        case "end":
          this.coach_leave_data.end_date_str = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
      }
    },
    showLeaveForm(){
      this.show_leave_form = true
    },
    closeDialogLeaveForm(){
      this.show_leave_form = false
      this.coach_leave_data = {
        menu_start_date : false,
        start_date :null,
        start_date_str : "",
        menu_end_date : false,
        end_date : null,
        end_date_str : "",
        period : "",
        coach_id : "",
        day_of_week_id: "",
        time_id : "",
        remark : "",
        status : "",
        leave_type : "",
        courses : [
          {
            my_course_id : "",
            course_id : "",
            substitute_coach_id : "",
            day_of_week_id: "",
            time_id : "",
          }
        ]
      }
    },
    showDialogDetail(leave_id){
      this.show_detail = true
      console.log(leave_id)
    },
    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      console.log("file=>",this.file);
    //   this.coach_check_in.file = this.file
      if (!this.file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.file);
    },
    filterMycourse(){
      if(this.filter_course){
        return this.my_courses.filter(v => v.course_id === this.filter_course)
      }else{
        return this.my_courses
      }
      
    }
  },
};
</script>
  