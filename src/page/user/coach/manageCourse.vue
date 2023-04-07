<template>
  <div>
    <v-container>
      <header-page  title="เลือกข้อมูลการสอน" ></header-page>
      <v-row dense class="mb-3">
        <v-col cols="auto" sm="4" v-for="(tab_data, tab_index) in tabs" :key="tab_index">
          <v-btn 
            :disabled="tab_data.value === 'request leave'"
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
          <div v-for="(course, course_index) in my_courses.filter(v => v.statr_date === today)" :key="course_index">
            {{ new Date(course.start) }}
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
          <v-col>
            <v-btn class="w-full" outlined color="#ff6b81">แบบฟอร์มการลา</v-btn>
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
            <img-card class="cursor-pointer" :class="tab === 'all' ? 'img-card-active':''">
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
              :items="leave_tasks"
              :loading="LoadingTable"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              item-key="id"
              show-expand
            >
            <template v-slot:[`item.status`]="{ item }">
              <div class="d-flex align-center pa-1 rounded-lg" 
                :class="item.status === 'รออนุมัติ' ? 'bg-[#FFF9E8] text-[#FCC419]' : item.status === 'อนุมัติ' ? 'bg-[#F0F9EE] text-[#58A144]' : 'bg-[#ffeeee] text-[#f00808]'">
                <span class="w-full text-center">{{ item.status == 'รออนุมัติ' ? 'รออนุมัติ' : item.status === "อนุมัติ" ? "อนุมัติ": "ไม่อนุมัติ"   }}</span>
              </div>
            </template>
            <template v-slot:[`item.detail`]="{ item }">
                <v-btn icon color="#ff6b81" @click="showDialogDetail(item)"><v-icon>mdi-eye-outline</v-icon> </v-btn>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length" class="py-3">
                <v-row>
                  <v-col cols="12">ผู้สอนแทน: {{ item.teacher.teacher_name }}</v-col>
                  <v-col cols="12">หมายเหตุ: {{ item.remark }}</v-col>
                </v-row>
              </td>
            </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </div>
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
        {text: 'ประเภทการลา',align: 'start',sortable: false, value: 'leave_type'},
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
    show_detail : false,
  }),
  created() {
   
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"))
    this.GetMyCourses({coach_id : this.user_detail.account_id})
  },
  mounted() {

    this.$store.dispatch("NavberUserModules/changeTitleNavber", "จัดการ");
  },
  watch: {},
  computed: {
    ...mapGetters({
      my_courses : "CoachModules/getMyCourses"
    }),
    today(){
      return moment(new Date()).format("YYYY-MM-DD")
    }
  },
  methods: {
    ...mapActions({
      GetMyCourses : "CoachModules/GetMyCourses"
    }),
    showDialogDetail(leave_id){
      this.show_detail = true
      console.log(leave_id)
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
  