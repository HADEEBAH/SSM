<template>
  <v-form ref="form_coach_leave" v-model="form_coach_leave">
    <v-card flat class="pa-0">
      <v-card-title class="d-flex justify-center"> แบบฟอร์มขอลา </v-card-title>
      <v-card-text>
        <!-- DATE LEAVE AND PERIOD -->
        <v-row dense v-if="admin">
          <v-col>
            โค้ชที่ต้องการลา
            <v-select
              dense
              outlined
              :rules="rules.coach"
              :items="coachs"
              item-value="accountId"
              item-text="fullNameTh"
              @change="SelectedCoach()"
              v-model="coach_leave_data.coach_id"
            ></v-select>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            วันที่ลา
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-menu
                  dense
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
                      :rules="rules.start_date"
                      v-model="coach_leave_data.start_date_str"
                      readonly
                      placeholder="เลือกวันที่เริ่มต้น"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <template v-slot:append>
                        <v-icon
                          :color="coach_leave_data.start_date ? '#FF6B81' : ''"
                          >mdi-calendar</v-icon
                        >
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    :min="today.toISOString()"
                    @input="inputDate($event, 'start')"
                    @change="validateCoachLeave"
                    v-model="coach_leave_data.start_date"
                    locale="th-TH"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu
                  dense
                  :disabled="!coach_leave_data.start_date"
                  v-model="coach_leave_data.menu_end_date"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :rules="rules.end_date"
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
                          :color="coach_leave_data.end_date ? '#FF6B81' : ''"
                          >mdi-calendar</v-icon
                        >
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    :min="
                      coach_leave_data.start_date
                        ? coach_leave_data.start_date
                        : today.toISOString()
                    "
                    @input="inputDate($event, 'end')"
                    @change="validateCoachLeave"
                    v-model="coach_leave_data.end_date"
                    locale="th-TH"
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
              :rules="rules.period"
              dense
              outlined
              :disabled="
                !coach_leave_data.start_date && !coach_leave_data.end_date
              "
              :items="
                date_range_length > 0
                  ? periods.filter((v) => v.value === 'full')
                  : periods
              "
              item-text="label"
              item-value="value"
              v-model="coach_leave_data.period"
            ></v-select>
          </v-col>
        </v-row>
        <!-- TYPE -->
        <v-row dense>
          <v-col cols="12">
            ประเภทการลา
            <v-select
              :rules="rules.type_leave"
              dense
              outlined
              :items="leaveTypes"
              item-text="label"
              item-value="value"
              v-model="coach_leave_data.leave_type"
              @change="validateCoachLeave"
            ></v-select>
          </v-col>
        </v-row>
        <template v-for="(date, date_index) in this.coach_leave_data.dates">
          <div
            v-if="coach_leave_data.leave_type && coach_leave_data.period"
            :key="`${date_index}-date`"
          >
            <v-row dense>
              <v-col cols="auto">
                <v-icon color="#ff6b81">mdi-calendar-outline</v-icon>
              </v-col>
              <v-col class="font-bold text-lg"> {{ date.date_str }} </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>
            <div class="mb-3 pa-3 bg-[#FBF3F5] rounded-lg">
              <v-row dense>
                <v-col cols="auto">
                  <v-icon color="#ff6b81"
                    >mdi-card-account-details-outline</v-icon
                  >
                </v-col>
                <v-col class="font-bold text-lg"> คอร์ส </v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-card
                class="mb-3"
                flat
                v-for="(course, index) in date.courses"
                :key="index"
              >
                <v-card-text class="rounded-md border">
                  <div v-if="date.courses.length > 1" align="right">
                    <v-btn icon color="red" @click="RemoveCourse(date, index)"
                      ><v-icon>mdi-close</v-icon></v-btn
                    >
                  </div>
                  <v-radio-group :rules="rules.type" v-model="course.type" row>
                    <v-radio
                      label="มีผู้สอนแทน"
                      color="#ff6b81"
                      value="teach"
                    ></v-radio>
                    <v-radio
                      label="ไม่มีผู้สอนแทน"
                      color="#ff6b81"
                      value="date"
                    ></v-radio>
                  </v-radio-group>
                  <v-row dense>
                    <v-col>
                      ชื่อคอร์ส
                      <v-select
                        :rules="rules.course"
                        dense
                        outlined
                        cache-items
                        v-model="course.my_course_id"
                        :items="
                          GenCourseLeaveOptions(date.courses, index).filter(
                            (v) =>
                              v.day_of_week_name.includes(
                                `${new Date(date.date).getDay()}`
                              )
                          )
                        "
                        @change="validateCoachLeave"
                        item-value="my_course_id"
                        item-text="course_name"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row dense v-if="course.type === 'teach'">
                    <v-col>
                      ผู้สอนแทน
                      <v-select
                        :rules="rules.sub_coach"
                        dense
                        outlined
                        :items="
                          coach_leave_data.coach_id
                            ? coachs.filter(
                                (v) => v.accountId !== coach_leave_data.coach_id
                              )
                            : coachs.filter(
                                (v) => v.accountId !== user_detail.account_id
                              )
                        "
                        item-value="accountId"
                        item-text="fullNameTh"
                        v-model="course.substitute_coach_id"
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                  <v-row dense v-else-if="course.type === 'date'">
                    <v-col cols="12" md="6">
                      วันที่ชดเชย
                      <v-menu
                        v-model="course.menu_compensation_date"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            :rules="rules.compensation_date"
                            dense
                            outlined
                            hide-details
                            readonly
                            placeholder="เลือกวันที่ชดเชย"
                            v-bind="attrs"
                            v-on="on"
                            :value="course.compensation_date_str"
                          >
                            <template v-slot:append>
                              <v-icon
                                :color="
                                  course.compensation_date ? '#FF6B81' : ''
                                "
                                >mdi-calendar</v-icon
                              >
                            </template>
                          </v-text-field>
                        </template>
                        <v-date-picker
                          :min="new Date().toISOString()"
                          :allowed-dates="allowedDates"
                          v-model="course.compensation_date"
                          @input="
                            inputDateArr(course.compensation_date, course)
                          "
                          locale="th-TH"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" md="6">
                      ช่วงเวลา
                      <v-row dense class="mb-3">
                        <v-col class="px-2" cols="12" sm="6">
                          <v-text-field
                            outlined
                            dense
                            :disabled="!course.compensation_date"
                            :style="`width:${width()}px;`"
                            style="
                              position: absolute;
                              display: block;
                              z-index: 4;
                            "
                            @focus="SelectedStartDate($event)"
                            :rules="rules.compensation_start_time"
                            v-model="course.compensation_start_time"
                          >
                          </v-text-field>
                          <VueTimepicker
                            class="time-picker-hidden"
                            hide-clear-button
                            :style="`width:${width()}px;`"
                            input-class="input-size-lg"
                            advanced-keyboard
                            @change="
                              ChengeTimeMin(
                                course.compensation_start_time_obj,
                                index,
                                date_index,
                                'start'
                              )
                            "
                            v-model="course.compensation_start_time_obj"
                            :hour-range="
                              checkHour(
                                coach_leave_data.period,
                                course.compensation_date,
                                course,
                                'start'
                              )
                            "
                            close-on-complete
                          ></VueTimepicker>
                        </v-col>
                        <v-col class="px-2" cols="12" sm="6">
                          <v-text-field
                            outlined
                            dense
                            :disabled="!course.compensation_date"
                            :style="`width:${width()}px;`"
                            style="
                              position: absolute;
                              display: block;
                              z-index: 4;
                            "
                            @focus="SelectedStartDate($event)"
                            :rules="rules.compensation_end_time"
                            v-model="course.compensation_end_time"
                          >
                          </v-text-field>
                          <VueTimepicker
                            class="time-picker-hidden"
                            hide-clear-button
                            input-class="input-size-lg"
                            advanced-keyboard
                            @change="
                              ChengeTimeMin(
                                course.compensation_end_time_obj,
                                index,
                                date_index,
                                'end'
                              )
                            "
                            v-model="course.compensation_end_time_obj"
                            :hour-range="
                              checkHour(
                                coach_leave_data.period,
                                course.compensation_date,
                                course,
                                'end'
                              )
                            "
                            close-on-complete
                          ></VueTimepicker>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <v-row dense>
              <v-col align="center">
                <v-btn outlined color="#FF6b81" @click="AddCourse(date)"
                  ><v-icon>mdi-plus</v-icon> เพิ่มคอร์ส
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </template>
        <v-row dense>
          <v-col>
            รายละเอียดการลา
            <v-textarea v-model="coach_leave_data.remark" outlined></v-textarea>
          </v-col>
        </v-row>
        <v-card flat class="mb-3">
          <v-card-text
            class="border-dashed border-2 border-pink-600 rounded-lg"
          >
            <v-row dense>
              <v-col cols="12" class="flex align-center justify-center">
                <v-img
                  src="../../assets/manage_coach/upload_file.png"
                  max-height="80"
                  max-width="100"
                ></v-img>
              </v-col>
              <v-col cols="12" class="flex align-center justify-center text-lg">
                แนบไฟล์
              </v-col>
              <v-col cols="12" class="flex align-center justify-center">
                <v-btn
                  text
                  class="underline"
                  color="#ff6b81"
                  @click="openFileSelector"
                  >อัปโหลดไฟล์แนบ</v-btn
                >
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  @change="uploadFile"
                  style="display: none"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <div v-if="selected_files.length > 0" class="mb-3">
          <v-row dense>
            <v-col class="font-bold text-lg"> ไฟล์แนบ </v-col>
          </v-row>
          <v-divider class="my-2"></v-divider>
          <v-card
            flat
            class="mb-3"
            v-for="(file, index) of selected_files"
            :key="`${index}-file`"
          >
            <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
              <v-row>
                <v-col cols="auto" class="pr-2">
                  <v-img
                    height="35"
                    width="26"
                    src="../../assets/coachLeave/file-pdf.png"
                  />
                </v-col>
                <v-col class="px-2">
                  <span class="font-bold">{{ file.name }}</span
                  ><br />
                  <span class="text-caption"
                    >ขนาดไฟล์ : {{ (file.size / 1000000).toFixed(2) }} MB</span
                  >
                </v-col>
                <v-col cols="auto" class="pl-2">
                  <v-btn @click="removeFile(index)" icon color="#ff6b81"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
        <v-row>
          <v-col cols="12" sm align="right">
            <v-btn text color="#ff6b81" @click="closeDialogLeaveForm()"
              >ยกเลิก</v-btn
            >
          </v-col>
          <v-col cols="12" sm="auto" align="right">
            <v-btn
              depressed
              :disabled="validateCoachLeave"
              :dark="!validateCoachLeave"
              @click="saveCoachLeave()"
              color="#ff6b81"
              >ส่งใบลา</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>
import Swal from "sweetalert2";
import { dateFormatter } from "@/functions/functions";
import { mapActions, mapGetters } from "vuex";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import moment from "moment";
export default {
  name: "coachLeaveForm",
  props: {
    admin: { type: Boolean },
  },
  components: { VueTimepicker },
  data: () => ({
    test_date: "",
    focusCompensationDate: "",
    today: new Date(),
    rules: {
      start_date: [(val) => (val || "").length > 0 || "โปรดเลือกวันเริ่ม"],
      period: [(val) => (val || "").length > 0 || "โปรดเลือกช่วงเวลา"],
      type_leave: [(val) => (val || "").length > 0 || "โปรดเลือกประเภทการลา"],
      type: [(val) => (val || "").length > 0 || "โปรดเลือกประเภท"],
      end_date: [(val) => (val || "").length > 0 || "โปรดเลือกวันสิ้นสุด"],
      course: [(val) => (val || "").length > 0 || "โปรดเลือกคอร์ส"],
      coach: [(val) => (val || "").length > 0 || "โปรดเลือกโค้ช"],
      sub_coach: [(val) => (val || "").length > 0 || "โปรดเลือกผู้สอนแทน"],
      compensation_date: [(val) => (val || "").length > 0 || "โปรดเลือกวันที่"],
      compensation_start_time: [
        (val) => (val || "").length > 0 || "โปรดเลือกเวลาเริ่ม",
      ],
      compensation_end_time: [
        (val) => (val || "").length > 0 || "โปรดเลือกเวลาสิ้นสุด",
      ],
    },
    periods: [
      { label: "ลาเต็มวัน", value: "full", start: 0, end: 23 },
      { label: "ลาช่วงเช้า", value: "morning", start: 13, end: 23 },
      { label: "ลาช่วงบ่าย", value: "afternoon", start: 0, end: 12 },
    ],
    leaveTypes: [
      { label: "ลาป่วย", value: "sick" },
      { label: "ลากิจ", value: "personal" },
      { label: "ลาพักร้อน", value: "take annual leave" },
    ],
    date_range_length: null,
    form_coach_leave: false,
    selected_files: [],
    user_detail: null,
    coach_leave_data: {
      menu_start_date: false,
      start_date: null,
      start_date_str: "",
      menu_end_date: false,
      end_date: null,
      end_date_str: "",
      period: "",
      coach_id: "",
      remark: "",
      status: "",
      leave_type: "",
      dates: [],
      courses: [
        {
          my_course_id: "",
          course_id: "",
          substitute_coach_id: "",
          day_of_week_id: "",
          time_id: "",
          type: "date",
        },
      ],
    },
  }),
  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
  },
  mounted() {},
  watch: {
    "coach_leave_data.start_date": function () {
      if (this.coach_leave_data.start_date && this.coach_leave_data.end_date) {
        this.getDateRangeLength();
      }
    },
    "coach_leave_data.end_date": function () {
      if (this.coach_leave_data.start_date && this.coach_leave_data.end_date) {
        this.getDateRangeLength();
      }
    },
  },
  computed: {
    ...mapGetters({
      coachs: "CourseModules/getCoachs",
      my_courses: "CoachModules/getMyCourses",
      my_courses_leave: "CoachModules/getMyCoursesLeave",
      my_courses_leave_is_loading: "CoachModules/getMyCoursesLeaveIsLoading",
    }),
    validateCoachLeave() {
      let start_date = this.coach_leave_data.start_date ? true : false;
      let end_date = this.coach_leave_data.end_date ? true : false;
      let period = this.coach_leave_data.period ? true : false;
      let leave_type = this.coach_leave_data.leave_type ? true : false;
      let course = this.coach_leave_data.dates.length > 0;
      return !(start_date && end_date && period && leave_type && course);
    },
  },
  methods: {
    ...mapActions({
      SaveCoachLeave: "CoachModules/SaveCoachLeave",
      GetMyCourses: "CoachModules/GetMyCourses",
      GetCoachs: "CourseModules/GetCoachs",
      SearchCourseDateCoachLeave: "CoachModules/SearchCourseDateCoachLeave",
      ShowDialogCoachLeaveForm: "CoachModules/ShowDialogCoachLeaveForm",
    }),
    inputDateArr(date, course) {
      course.compensation_date_str = new Date(date).toLocaleDateString(
        "th-TH",
        { year: "numeric", month: "long", day: "numeric" }
      );
    },
    setHolidaydates(item) {
      // // console.log("item", item);
      const thaiMonths = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];
      if (item !== "") {
        const newDate = new Date(item).toLocaleDateString("th-TH");
        const date = newDate.split("/")[0];
        const month = newDate.split("/")[1];
        const year = newDate.split("/")[2];
        this.test_date = `${date} ${thaiMonths[month - 1]} ${year}`;
      }
      // console.log("test_date", this.test_date);
    },
    getDateRangeLength() {
      let startDate = new Date(this.coach_leave_data.start_date);
      let endDate = new Date(this.coach_leave_data.end_date);
      const startTimestamp = Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      const endTimestamp = Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const dateRangeLength = Math.floor(
        (endTimestamp - startTimestamp) / millisecondsPerDay
      );
      this.date_range_length = dateRangeLength;
    },
    checkHour(period, date, course, type) {
      if (date) {
        if (
          new Date(date) >= new Date(this.coach_leave_data.start_date) &&
          new Date(date) <= new Date(this.coach_leave_data.end_date)
        ) {
          if (this.periods.filter((v) => v.value === period).length > 0) {
            let hrs = [];
            let start = this.periods.filter((v) => v.value === period)[0].start;
            let end = this.periods.filter((v) => v.value === period)[0].end;
            // // console.log("647 => ",course.compensation_start_time_obj.HH)
            if (type && type === "end") {
              if (course.compensation_start_time_obj.HH) {
                for (let hr = 0; hr < 24; hr++) {
                  if (
                    hr > parseInt(course.compensation_start_time_obj.HH) &&
                    hr <= end
                  ) {
                    hrs.push(hr);
                  }
                }
              }
            } else {
              for (let hr = 0; hr < 24; hr++) {
                if (hr >= start && hr <= end) {
                  hrs.push(hr);
                }
              }
            }
            return hrs;
          }
        } else {
          let hrs = [];
          if (type && type === "end") {
            if (course.compensation_start_time_obj.HH) {
              for (let hr = 0; hr < 24; hr++) {
                if (hr > parseInt(course.compensation_start_time_obj.HH)) {
                  hrs.push(hr);
                }
              }
            }
          } else {
            for (let hr = 0; hr < 24; hr++) {
              hrs.push(hr);
            }
          }
          return hrs;
        }
      }
      this.validateCoachLeave;
    },
    getDatesBetween(startDate, endDate) {
      const dates = [];
      const currentDate = new Date(startDate);
      while (currentDate <= new Date(endDate)) {
        dates.push(moment(currentDate).format("YYYY-MM-DD"));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      this.focusCompensationDate = dates;
      return dates;
    },
    allowedDates(val) {
      if (this.coach_leave_data.period === "full") {
        return !this.focusCompensationDate.includes(val);
      } else {
        return val;
      }
    },
    ChengeTimeMin(time, index_course, index_date, type) {
      if (time.mm === "") {
        time.mm = "00";
      }
      if (type === "start") {
        this.coach_leave_data.dates[index_date].courses[
          index_course
        ].compensation_start_time = `${time.HH}:${time.mm}`;
      } else {
        this.coach_leave_data.dates[index_date].courses[
          index_course
        ].compensation_end_time = `${time.HH}:${time.mm}`;
      }
    },
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 238;
        case "sm":
          return 180;
        case "md":
          return 140.5;
        case "lg":
          return 200.5;
        case "xl":
          return 405.5;
      }
    },
    RemoveCourse(date, index) {
      date.courses.splice(index, 1);
    },
    SelectedStartDate(e) {
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode
        .getElementsByClassName("time-picker-hidden")[0]
        .getElementsByTagName("input")[0]
        .focus();
    },
    SelectedCoach() {
      this.coach_leave_data.start_date = null;
      this.coach_leave_data.start_date_str = "";
      this.coach_leave_data.end_date = null;
      this.coach_leave_data.end_date_str = "";
      this.coach_leave_data.period = "";
      this.coach_leave_data.remark = "";
      this.coach_leave_data.status = "";
      this.coach_leave_data.leave_type = "";
      this.coach_leave_data.dates = [];
      this.coach_leave_data.courses = [];
      this.validateCoachLeave;
    },
    GenCourseLeaveOptions(courses) {
      let my_course_data = [];
      if (courses.length > 0) {
        this.my_courses_leave.forEach((course) => {
          if (
            courses.filter(
              (v) =>
                v.my_course_id.split("|")[0] === course.courseId &&
                v.my_course_id.split("|")[2] === course.timeId
            ).length === 0
          ) {
            my_course_data.push({
              my_course_id: `${course.courseId}|${course.dayOfWeekId}|${course.timeId}`,
              cousre_id: course.courseId,
              course_name: `${course.courseNameTh} ${course.start} - ${course.end}น.`,
              time_id: course.timeId,
              day_of_week_id: course.dayOfWeekId,
              day_of_week_name: course.dayOfWeekName,
            });
          }
        });
      }
      return my_course_data;
    },
    async GenDates() {
      this.coach_leave_data.dates = [];
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        // calendar: "buddhist",
        // era: "short",
      };
      const start_date = this.coach_leave_data.start_date;
      const end_date = this.coach_leave_data.end_date;
      const start = new Date(start_date);
      const end = new Date(end_date);
      let currentDate = start;
      while (currentDate <= end) {
        this.my_courses_leave.forEach((course) => {
          if (course.dayOfWeekName) {
            if (
              course.dayOfWeekName.includes(`${new Date(currentDate).getDay()}`)
            ) {
              if (
                !this.coach_leave_data.dates.some(
                  (v) => v.date === currentDate.toISOString().split("T")[0]
                )
              ) {
                this.coach_leave_data.dates.push({
                  date: currentDate.toISOString().split("T")[0],
                  date_str: currentDate.toLocaleDateString("th-TH", options),
                  courses: [
                    {
                      menu_compensation_date: false,
                      compensation_date_str: "",
                      compensation_date: "",
                      compensation_start_time_obj: { HH: "", mm: "" },
                      compensation_end_time_obj: { HH: "", mm: "" },
                      compensation_start_time: "",
                      compensation_end_time: "",
                      my_course_id: "",
                      type: "",
                      course_id: "",
                      substitute_coach_id: "",
                      day_of_week_id: "",
                      time_id: "",
                    },
                  ],
                });
              }
            }
          }
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    },
    AddCourse(date) {
      date.courses.push({
        my_course_id: "",
        course_id: "",
        menu_compensation_date: false,
        compensation_date: "",
        compensation_start_time_obj: { HH: "", mm: "" },
        compensation_end_time_obj: { HH: "", mm: "" },
        compensation_start_time: "",
        compensation_end_time: "",
        substitute_coach_id: "",
        day_of_week_id: "",
        time_id: "",
      });
    },
    uploadFile() {
      const files = this.$refs.fileInput.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          this.selected_files.push(files[i]);
        }
      }
    },
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    removeFile(index) {
      this.selected_files.splice(index, 1);
    },

    inputDate(e, data) {
      switch (data) {
        case "start":
          this.coach_leave_data.menu_start_date = false;
          this.coach_leave_data.start_date_str = dateFormatter(
            e,
            "DD MMT YYYYT"
          );
          this.coach_leave_data.end_date_str = null;
          this.coach_leave_data.end_date = null;
          this.GenDates();
          break;
        case "end":
          this.coach_leave_data.menu_end_date = false;
          this.coach_leave_data.end_date_str = dateFormatter(e, "DD MMT YYYYT");
          this.SearchCourseDateCoachLeave({
            account_id: this.admin
              ? this.coach_leave_data.coach_id
              : this.user_detail.account_id,
            start_date: this.coach_leave_data.start_date,
            end_date: this.coach_leave_data.end_date,
          }).then(() => {
            this.GenDates();
          });
          break;
      }
    },
    closeDialogLeaveForm() {
      this.selected_files = [];
      this.show_leave_form = false;
      this.ShowDialogCoachLeaveForm(false);
      this.coach_leave_data = {
        menu_start_date: false,
        start_date: null,
        start_date_str: "",
        menu_end_date: false,
        end_date: null,
        end_date_str: "",
        period: "",
        coach_id: "",
        day_of_week_id: "",
        time_id: "",
        remark: "",
        status: "",
        leave_type: "",
        dates: [],
        courses: [
          {
            my_course_id: "",
            course_id: "",
            substitute_coach_id: "",
            day_of_week_id: "",
            time_id: "",
          },
        ],
      };
    },
    saveCoachLeave() {
      this.$refs.form_coach_leave.validate();

      if (this.form_coach_leave) {
        Swal.fire({
          icon: "question",
          title: "ต้องการส่งใบลาใช่หรือไม่ ?",
          showDenyButton: false,
          showCancelButton: true,
          cancelButtonText: "ยกเลิก",
          confirmButtonText: "ตกลง",
        }).then(async (result) => {
          if (result.isConfirmed) {
            for (let date of this.coach_leave_data.dates) {
              for (let course of date.courses) {
                let my_course_id_part = course.my_course_id.split("|");
                course.course_id = my_course_id_part[0];
                course.day_of_week_id = my_course_id_part[1];
                course.time_id = my_course_id_part[2];
              }
            }
            if (!this.admin) {
              this.coach_leave_data.coach_id = this.user_detail.account_id;
            }

            this.SaveCoachLeave({
              coach_leave_data: this.coach_leave_data,
              files: this.selected_files,
              admin: this.admin,
            });
            this.closeDialogLeaveForm();
          }
        });
      }
    },
  },
};
</script>
<style>
.input-size-lg {
  height: 40px !important;
}
</style>