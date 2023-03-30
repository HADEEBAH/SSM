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
          <div v-for="(course, course_index) in courses" :key="course_index">
            <course-card-list class="mb-2" bg_color="#fff" :title="course.course_name" :course_name="course.category_name" :package_name="`แพ็คเกจ :${course.package}`" :course_per_time="`เวลาสอน :${course.course_hours}`" :period="course.time">
              <template #img>
                <v-img class="rounded-lg" src="https://cdn.vuetifyjs.com/images/cards/cooking.png" max-height="120" max-width="120"></v-img>
              </template>
            </course-card-list>
          </div>
        </template>
        <!-- รายสัปดาห์ -->
        <template v-else>
          <!-- COURSE LIST -->
          <calendarCoach
            :events="tasks"
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
              <v-select outlined dense></v-select>
          </v-col>
        </v-row>
        <v-card dense elevation="0" flat >
          <v-card-text class="bg-[#FBF3F5]">
            <v-row>
              <v-col cols="4">
                
              </v-col>
              <v-col>
                <v-row>
                  <v-col class="font-bold text-md">วันจันทร์ที่ 25 กรกฎาคม 2565</v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <rowData mini  icon="mdi-account">อาณาจักร : ศิลปะสมัยใหม่</rowData>
                  </v-col>
                  <v-col cols="12">
                    <rowData mini  icon="mdi-bookshelf">คอร์สเรียน : เปียโนป๊อป</rowData>
                  </v-col>
                  <v-col cols="12">
                    <rowData mini  icon="mdi-clock-time-four-outline">เวลาสอน 1 ชั่วโมง</rowData>
                  </v-col>
                  <v-col cols="12">
                    <v-chip small color="#F9B320" dark>16:00-17:00น.</v-chip>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>ประเมินนักเรียน</v-col>
              <v-col>ประเมินศักยภาพ</v-col>
              <v-col>ประเมินภาพรวม</v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
      <div v-if="tab === 'request leave'">request leave</div>
    </v-container>
  </div>
</template>
  <script>
import calendarCoach from "@/components/calendar/calendarCoach.vue";
import headerPage from '../../../components/header/headerPage.vue';
import rowData from '../../../components/label/rowData.vue';
import courseCardList from "../../../components/course/courseCardList.vue";
export default {
  name: "menageCourse",
  components: { calendarCoach, headerPage, courseCardList, rowData },
  data: () => ({
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
    tasks: [
      {
        name: "เปียโนป๊อปเบื้องต้น",
        subtitle : "Popular Piano",
        coach : "นายสมชาย ศรีชาตรี",
        start: "2023-02-18 10:00",
        end: "2023-02-18 11:00",
      },
      {
        name: "เปียโนป๊อปเบื้องต้น",
        subtitle : "Popular Piano",
        coach : "นายสมชาย ศรีชาตรี",
        start: "2023-02-23 10:00",
        end: "2023-02-23 11:00",
      },
      {
        name: "เปียโนป๊อปเบื้องต้น",
        subtitle : "Popular Piano",
        coach : "นายสมชาย ศรีชาตรี",
        start: "2023-02-23 13:00",
        end: "2023-02-23 14:00",
      },
      {
        name: "เปียโนป๊อปเบื้องต้น",
        subtitle : "Popular Piano",
        coach : "นายสมชาย ศรีชาตรี",
        start: "2023-02-25 15:00",
        end: "2023-02-25 16:00",
      },
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
  }),
  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"))
  },
  mounted() {

    this.$store.dispatch("NavberUserModules/changeTitleNavber", "จัดการ");
  },
  watch: {},
  computed: {
    
  },
  methods: {

  },
};
</script>
  