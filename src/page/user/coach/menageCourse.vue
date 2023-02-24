<template>
  <div>
    <v-tabs v-model="tab" fixed-tabs background-color="#FFF0F5" color="#ff6b81">
      <v-tab href="#teaching list"> รายการสอนวันนี้ </v-tab>
      <v-tab href="#my teaching"> การสอนของฉัน </v-tab>
      <v-tab href="#request leave"> ลงเวลาเพื่อขอลา </v-tab>
    </v-tabs>
    <v-container>
      <div v-if="tab === 'teaching list'">
        <v-row>
          <v-col></v-col>
          <v-col cols="5" sm="3" align="right">
            <v-select
              outlined
              dense
              :items="time_frame_list"
              item-text="label"
              item-value="value"
              v-model="time_frame"
            ></v-select>
          </v-col>
        </v-row>
        <!-- รายวัน -->
        <template v-if="time_frame === 'day'">
          <v-row dense class="mb-3">
            <v-col>
              <label> {{ new Date(select_date).toLocaleDateString('th-TH',{ year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'}) }}</label>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon color="#ff6b81">mdi-calendar-blank-outline</v-icon>
                  </v-btn>
                </template>
                <v-date-picker
                  v-model="select_date"
                  no-title
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <!-- COURSE LIST -->
          <div v-for="(course, course_index) in courses" :key="course_index">
            <div class="mb-3 pa-4 border border-[#FFC0CB] rounded-lg">
              <v-row dense>
                <v-col cols="4">
                  <v-row dense>
                    <v-col cols="12" align="center">
                      <v-img
                        class="mb-3"
                        max-width="120"
                        src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
                      ></v-img>
                    </v-col>
                    <v-col cols="12" align="center" class="text-md">
                      ชื่ออาณาจักร
                    </v-col>
                  </v-row>
                </v-col>
                <v-col>
                  <v-row dense>
                    <v-col cols="12">{{ course.course_name }}</v-col>
                    <v-col cols="12">{{ `โค้ช: ${course.coach_name}` }}</v-col>
                    <v-col cols="12">{{ `เวลา ${course.time}` }}0</v-col>
                    <v-col cols="12">{{
                      `สอน ${course.course_hours} ชัวโมง`
                    }}</v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
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
      <div v-if="tab === 'my teaching'">my teaching</div>
      <div v-if="tab === 'request leave'">request leave</div>
    </v-container>
  </div>
</template>
  <script>
import calendarCoach from "@/components/calendar_coach/calendarCoach.vue";
export default {
  name: "menageCourse",
  components: { calendarCoach },
  data: () => ({
    tab: "",
    time_frame_list: [
      { label: "รายวัน", value: "day" },
      { label: "รายสัปดาห์", value: "week" },
      { label: "รายเดือน", value: "month" },
    ],
    time_frame: "week",
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
        time: "10:00 - 11:00",
        course_hours: "1",
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
      },
    ],
  }),
  created() {},
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
  