<template>
  <v-container>
    <div class="mx-10 my-5">
      <label class="text-xl font-bold">ข้อมูลตารางเรียน</label>
      {{ student_data }}

      <v-row dense class="my-3">
        <!-- <pre>{{ courseData }}</pre> -->
        <v-col
          cols="4"
          v-for="(type, type_index) in course_type"
          :key="type_index"
        >
          <v-card flat @click="type_selected = type.value" class="rounded-lg">
            <v-card-text
              :class="
                type_selected === type.value ? 'bg-[#FF6B81]' : 'bg-[#F5F5F5]'
              "
              class="rounded-lg flex justify-center align-center pa-2"
            >
              <label
                :class="
                  type_selected === type.value
                    ? 'text-white'
                    : ' text-[#B3B3B3]'
                "
                class="font-bold mr-2"
                >{{ type.name }}</label
              >
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- PAGE 1 -->
      <v-expand-x-transition transition="scale-transition">
        <div v-if="type_selected == 'students_course'">
          <v-card>
            <v-row dense>
              <!-- img -->
              <v-col cols="12" sm="2">
                <v-col
                  style="
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                    width: 50%;
                  "
                >
                  <img src="../../../assets/student_course/download.png" />
                  <!-- {{ item.orderStudentId }} -->
                </v-col>
              </v-col>
              <!-- detail -->
              <v-col cols="12" sm="6">
                <v-col class="text-lg font-bold">
                  <!-- {{ item.courseNameTh }} -->
                </v-col>
                <v-col class="text-slate-400">
                  <!-- {{ item.courseNameEn }} -->
                </v-col>
                <v-col class="text-slate-400">
                  <!-- <span class="mdi mdi-account"></span> {{ item.courseNameTh }} -->
                </v-col>
                <v-col>
                  <v-card color="yellow" class="rounded-lg w-48 text-center">
                    วันจันทร์ 16:00 - 17:00 น.
                  </v-card>
                  <!-- {{ item.courseNameEn }} -->
                </v-col>
              </v-col>

              <!-- circle -->
              <v-col cols="12" sm="4" class="pt-6" align="center">
                <v-col>
                  <!-- {{ item.courseNameEn }} -->
                  <v-progress-circular
                    :rotate="-90"
                    :size="90"
                    :width="10"
                    :value="value"
                    color="primary"
                  >
                    {{ value }}
                  </v-progress-circular>
                </v-col>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-expand-x-transition>

      <!-- PAGE 2 -->
      <v-expand-x-transition transition="scale-transition">
        <div v-if="type_selected == 'students_schedule'">
          <v-row class="mb-2">
            <v-col cols="12" align="center">
              <v-card flat width="340px">
                <v-card-text class="pa-2 border-2 border-[#ff6b81] rounded-lg">
                  <v-row dense class="d-flex justify-center">
                    <v-col
                      cols="auto"
                      v-for="(time, time_index) in time_frame_list"
                      :key="`${time_index}-time`"
                    >
                      <v-btn
                        @click="time_frame = time.value"
                        depressed
                        :dark="time_frame === time.value"
                        :color="
                          time_frame === time.value ? '#ff6b81' : '#F5F5F5'
                        "
                        >{{ time.label }}</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <template >
            <calendarStudent
              :events="tasks"
              :type="time_frame"
            ></calendarStudent>
          </template>
        </div>
      </v-expand-x-transition>

      <!-- PAGE 3 -->
      <v-expand-x-transition transition="scale-transition">
        <div v-if="type_selected == 'students_bookedcourse'">
          <v-card
            v-for="(item, item_index) in student_data"
            :key="item_index"
            class="my-5"
          >
            <div>
              <v-row dense>
                <!-- img -->
                <v-col cols="12" sm="2">
                  <v-col
                    style="
                      display: block;
                      margin-left: auto;
                      margin-right: auto;
                      width: 50%;
                    "
                  >
                    <img src="../../../assets/student_course/download.png" />
                    <!-- {{ item.orderStudentId }} -->
                  </v-col>
                </v-col>
                <!-- detail -->
                <v-col cols="12" sm="6">
                  <v-col class="text-lg font-bold">
                    <!-- {{ item.courseNameTh }} -->
                  </v-col>
                  <v-col class="text-slate-400">
                    <!-- {{ item.courseNameEn }} -->
                  </v-col>
                  <v-col class="text-slate-400">
                    <!-- <span class="mdi mdi-account"></span> {{ item.courseNameTh }} -->
                  </v-col>
                  <v-col>
                    <v-card color="yellow" class="rounded-lg w-48 text-center">
                      วันจันทร์ 16:00 - 17:00 น.
                    </v-card>
                    <!-- {{ item.courseNameEn }} -->
                  </v-col>
                </v-col>

                <!-- circle -->
                <v-col cols="12" sm="4" class="pt-6" align="center">
                  <v-col>
                    <!-- {{ item.courseNameEn }} -->
                    <v-progress-circular
                      :size="90"
                      :width="15"
                      value="booked"
                      color="#DBDBDB"
                      ><span class="text-pink-500">
                        {{ booked }}</span
                      ></v-progress-circular
                    >
                  </v-col>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </div>
      </v-expand-x-transition>
    </div>
  </v-container>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import calendarStudent from "../../../components/calendar/calendarStudent.vue";
export default {
  components: {
    calendarStudent,
  },
  data: () => ({
    activePage: 1,
    booked: "จองแล้ว",
    value: "test",
    loading: true,
    course_type: [
      { name: "คอร์สของฉัน", value: "students_course" },
      { name: "ตารางเรียน", value: "students_schedule" },
      { name: "คอร์สที่จอง", value: "students_bookedcourse" },
    ],
    time_frame_list: [
      { label: "รายวัน", value: "day" },
      { label: "รายสัปดาห์", value: "week" },
      { label: "รายเดือน", value: "month" },
    ],
    tasks: [
      {
        name: "เปียโนป๊อปเบื้องต้น",
        subtitle: "Popular Piano",
        coach: "นายสมชาย ศรีชาตรี",
        start: "2023-04-1 10:00",
        end: "2023-03-18 12:00",
      },
      {
        name: "เปียโนป๊อปเบื้องต้น",
        subtitle: "Popular Piano",
        coach: "นายสมชาย ศรีชาตรี",
        start: "2023-03-23 10:00",
        end: "2023-03-23 13:00",
      },
      {
        name: "เปียโนป๊อปเบื้องต้น",
        subtitle: "Popular Piano",
        coach: "นายสมชาย ศรีชาตรี",
        start: "2023-03-23 13:00",
        end: "2023-03-23 14:00",
      },
      {
        name: "เปียโนป๊อปเบื้องต้น",
        subtitle: "Popular Piano",
        coach: "นายสมชาย ศรีชาตรี",
        start: "2023-03-25 15:00",
        end: "2023-03-25 16:00",
      },
    ],
    courses: [
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        category_name: "อาณาจักรดนตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
        package: "Family",
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        category_name: "อาณาจักรดนตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
        package: "Family",
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        category_name: "อาณาจักรดนตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
        package: "Family",
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        category_name: "อาณาจักรดนตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
        package: "Family",
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        category_name: "อาณาจักรดนตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
        package: "Family",
      },
      {
        course_name: "เปียโนป๊อปเบื้องต้น (Popular Piano ) ",
        coach_name: "นายสมชาย ศรีชาตรี",
        category_name: "อาณาจักรดนตรี",
        time: "10:00 - 11:00",
        course_hours: "1",
        package: "Family",
      },
    ],
    type_selected: "students_course",
    time_frame: "month",
  }),
  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    // this.GetStudentData(this.user_detail.account_id);
  },

  mounted() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "ข้อมูลตารางเรียน"
    );
    console.log("user_detail", this.user_detail.account_id);
  },

  watch: {
    type_selected: function () {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 200);
    },
  },
  methods: {
    ...mapActions({
      GetStudentData: "OrderTestModules/GetStudentData",
    }),
    prev() {
      this.$refs.calendar.prev();
      console.log(this.$refs.calendar.title);
    },
    next() {
      this.$refs.calendar.next();
    },
    // getCouse(courseId) {
    //   console.log("course_id", courseId);
    //   this.GetCourse(courseId);
    // },
  },

  computed: {
    ...mapGetters({
      student_data: "OrderTestModules/getStudentData",
    }),
    studentData: {
      get() {
        return this.student_data;
      },
    },
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
  },
};
</script>
  
  <style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>