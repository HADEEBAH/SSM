<template>
  <div>
    {{ setFunction }}
    <template v-for="(coach, coach_index) in course_data.coachs">
      <v-card
        v-if="coach.teach_day_data.length > 0"
        :class="`bg-[${color}] mb-5`"
        :key="coach_index"
      >
        <!-- TEACH DAY -->
          <template v-for="(teach_day, teach_day_index) in coach.teach_day_data">
            <v-card-text :key="`${teach_day_index}-day`" class="border">
              <v-divider
                v-if="teach_day_index > 0"
                :key="teach_day_index"
              ></v-divider>
              <v-row dense>
                <!-- <pre>{{ teach_day }}</pre> -->
                <v-col cols class="d-flex align-center justify-end">
                  <v-switch
                    @click="checkStudyByDay($event,teach_day)"
                    :disabled="disable"
                    v-model="teach_day.class_open"
                    color="green"
                    hide-details
                    label="เปิดสอน"
                  ></v-switch>
                </v-col>
                <v-col cols="auto" v-if="course_data.coachs.length > 1">
                  <template v-if="!teach_day?.course_coach_id">
                    <v-btn
                      icon
                      small
                      color="red"
                      v-if="!disable"
                      @click="removeCoach(course_data.coachs, coach_index)"
                      ><v-icon>mdi-close</v-icon></v-btn
                    >
                  </template>
                </v-col>
              </v-row>
              <v-row dense class="flex align-center justify-end">
                <v-col cols="12" sm="4">
                  <label-custom required text="โค้ช"></label-custom>
                  <!-- <pre>{{ coach }}</pre> -->
                  <v-autocomplete
                    dense
                    :disabled=" disable ? disable : coach.course_coach_id ? true : false "
                    :outlined="!disable"
                    :filled="disable"
                    v-model="coach.coach_id"
                    color="#FF6B81"
                    :items="coachsOptions(coach)"
                    item-value="accountId"
                    item-text="fullNameTh"
                    item-color="pink"
                    @change="findTeachDays(coach, coach_index)"
                    :rules="rules.course"
                    placeholder="โค้ช"
                  >
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-title> ไม่พบข้อมูล </v-list-item-title>
                      </v-list-item>
                    </template>
                    <template v-slot:></template>
                    <template v-slot:item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title
                          ><span
                            :class="
                              coach.coach_id === item.accountId ? 'font-bold' : ''
                            "
                            >{{ item.fullNameTh }}</span
                          ></v-list-item-title
                        >
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-icon v-if="coach.coach_id === item.accountId"
                          >mdi-check-circle</v-icon
                        >
                      </v-list-item-action>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="4">
                  <label-custom required text="วันสอน"></label-custom>
                  <v-autocomplete
                    dense
                    :disabled="disable"
                    :outlined="!disable"
                    :filled="disable"
                    chips
                    :rules="rules.class_date"
                    deletable-chips
                    item-color="pink"
                    multiple
                    color="#FF6B81"
                    :items="filteredDays(coach_index, teach_day_index, state)"
                    item-text="label"
                    item-value="value"
                    placeholder="โปรดเลือกเวลา"
                    v-model="teach_day.teach_day"
                    @change="selectDays(teach_day.teach_day, coach_index, teach_day_index)"
                  >
                    <template v-slot:selection="{ attrs, item, selected }">
                      <v-chip
                        v-bind="attrs"
                        :input-value="selected"
                        close
                        small
                        :disabled="disable"
                        color="#ffeeee"
                        text-color="#ff6b81"
                        @click:close="removeChip(item, teach_day.teach_day)"
                      >
                        <strong>{{ item.label }}</strong>
                      </v-chip>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="6" sm="2">
                  <v-btn
                    text
                    :disabled="disable"
                    v-if="teach_day_index === coach.teach_day_data.length - 1"
                    color="green"
                    @click="addTeachDay(coach)"
                  >
                    <v-icon>mdi-calendar-plus-outline</v-icon>
                    เพิ่มวันสอน
                  </v-btn>
                </v-col>
                <v-col cols="6" sm="2">
                
                  <template v-if="teach_day.day_of_week_id">
                    <!-- {{  edited +'*'+ disable}} -->
                    <v-btn
                      :disabled="disable || !edited"
                      text
                      color="red"
                      v-if="coach.teach_day_data.length > 1"
                      @click="removeDayOfWeekData(coach.teach_day_data, teach_day.day_of_week_id)"
                      ><v-icon>mdi-calendar-plus-outline</v-icon>
                      ลบวันสอน
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn
                      :disabled="disable"
                      text
                      color="red"
                      v-if="coach.teach_day_data.length > 1"
                      @click="removeTeachDay(coach.teach_day_data, teach_day_index)"
                      ><v-icon>mdi-calendar-plus-outline</v-icon>
                      ลบวันสอน
                    </v-btn>
                  </template>
                </v-col>
              </v-row>
              <!-- CLASS TIME -->
              <template
                v-for="(class_date, class_date_index) in teach_day.class_date"
              >
                <v-row dense :key="`${class_date_index}-class-date`">
                  <!-- <pre>{{ coach.disabled_hours }}</pre> -->
                  <v-col cols="12" sm="6">
                    <!-- <pre>{{class_date}}</pre> -->
                    <label-custom required text="ช่วงเวลา"></label-custom>
                    <v-row dense class="mb-3">
                      <v-col class="px-2" cols="12" sm="6">
                        <v-text-field
                          :disabled="disable"
                          :outlined="!disable"
                          :filled="disable"
                          dense
                          style="position: absolute; display: block; z-index: 0"
                          :style="`width:${width()}px;`"
                          :rules="rules.start_time"
                          v-model="class_date.class_date_range.start_time"
                        >
                        </v-text-field>
                        <TimePicker
                          :disabled="disable"
                          v-if="coach.disabled_hours"
                          style="z-index: 2"
                          :style="`width:${width() - 4}px !important; `"
                          class="w-full"
                          :minuteStep="15"
                          format="HH:mm"
                          @focus="class_date.class_date_range.start_time = ''"
                          :class="
                            class_date.class_date_range.start_time ? 'active' : ''
                          "
                          :disabledMinutes="
                            (hour) => {
                              return disabledMinutes(
                                hour,
                                coach_index,
                                teach_day_index
                              );
                            }
                          "
                          placeholder="เวลาเริ่มต้น"
                          @change="
                            genStartTimeEndTime(
                              $event,
                              coach_index,
                              teach_day_index,
                              class_date_index
                            )
                          "
                          v-model="class_date.class_date_range.start_time"
                        ></TimePicker>
                        <TimePicker
                          v-else
                          :disabled="disable"
                          style="z-index: 2"
                          :style="`width:${width() - 4}px !important; `"
                          class="w-full"
                          :minuteStep="15"
                          format="HH:mm"
                          :class="
                            class_date.class_date_range.start_time ? 'active' : ''
                          "
                          placeholder="เวลาเริ่มต้น"
                          @change="
                            genStartTimeEndTime(
                              $event,
                              coach_index,
                              teach_day_index,
                              class_date_index
                            )
                          "
                          v-model="class_date.class_date_range.start_time"
                        ></TimePicker>
                      </v-col>
                      <v-col class="px-2" cols="12" sm="6">
                        <v-text-field
                          :disabled="disable"
                          :outlined="!disable"
                          :filled="disable"
                          dense
                          style="position: absolute; display: block; z-index: 0"
                          :style="`width:${width()}px;`"
                          :rules="rules.end_time"
                          @change="ChangeCourseData(course_data)"
                          v-model="class_date.class_date_range.end_time"
                        >
                        </v-text-field>
                        <TimePicker
                          disabled
                          style="z-index: 2"
                          :style="`width:${width() - 4}px !important; `"
                          :minuteStep="15"
                          format="HH:mm"
                          :class="
                            class_date.class_date_range.end_time ? 'active' : ''
                          "
                          placeholder="เวลาสิ้นสุด"
                          @change="
                            limitEndTime(
                              $event,
                              coach_index,
                              teach_day_index,
                              class_date_index
                            )
                          "
                          v-model="class_date.class_date_range.end_time"
                        ></TimePicker>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <label-custom required text="นักเรียนที่รับได้"></label-custom>
                    <v-text-field
                      class="input-text-right"
                      dense
                      :disabled="disable"
                      :outlined="!disable"
                      :filled="disable"
                      type="number"
                      suffix="คน"
                      @focus="$event.target.select()"
                      :rules="rules.students"
                      @change="ChangeCourseData(course_data)"
                      v-model="class_date.students"
                      placeholder="ระบุนักเรียนที่รับได้"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" sm="2" class="d-flex align-center">
                    <v-btn
                      :disabled="disable"
                      text
                      v-if="class_date_index === teach_day.class_date.length - 1"
                      color="green"
                      @click="addTime(teach_day)"
                    >
                      <v-icon>mdi-timer-plus-outline</v-icon>
                      เพิ่มเวลา
                    </v-btn>
                  </v-col>
                  <v-col cols="6" sm="2" class="d-flex align-center">
                    <template v-if="class_date.class_date_range.day_of_week_id">
                      <!-- {{ class_date.class_date_range.time_id }} -->
                      <v-btn
                        :disabled="disable"
                        v-if="teach_day.class_date.length > 1"
                        text
                        color="red"
                        @click="removeTimeData(teach_day.class_date, class_date.class_date_range.time_id)"
                      >
                        <v-icon>mdi-timer-minus-outline</v-icon>
                        ลบเวลา
                      </v-btn>
                    </template>
                    <template v-else>
                      <v-btn
                        :disabled="disable"
                        v-if="teach_day.class_date.length > 1"
                        text
                        color="red"
                        @click="removeTime(teach_day.class_date, class_date_index)"
                      >
                        <v-icon>mdi-timer-minus-outline</v-icon>
                        ลบเวลา
                      </v-btn>
                    </template>
                  </v-col>
                </v-row>
              </template>
            </v-card-text>
          </template>
      </v-card>
    </template>
  </div>
</template>
<script>
import LabelCustom from "../label/labelCustom.vue";
import { mapGetters, mapActions } from "vuex";
import { Input, TimePicker } from "ant-design-vue";
import moment from "moment";
import Swal from "sweetalert2";
export default {
  components: {
    LabelCustom,
    TimePicker,
  },
  props: {
    color: { type: String, default: "#fcfcfc" },
    coachs: { type: Array },
    disable: { type: Boolean },
    state: { type: String, default: "create" },
    edited: { type: Boolean, default: false },
  },
  directives: {
    "ant-input": Input,
  },
  data: () => ({
    select_coachs: [],
    coachs_option: [],
    days_confix: [
      { label: "วันอาทิตย์", value: 0 },
      { label: "วันจันทร์", value: 1 },
      { label: "วันอังคาร", value: 2 },
      { label: "วันพุธ", value: 3 },
      { label: "วันพฤหัสบดี", value: 4 },
      { label: "วันศุกร์", value: 5 },
      { label: "วันเสาร์", value: 6 },
    ],
    rules: {
      course: [(val) => (val || "").length > 0 || "โปรดเลือกโค้ช"],
      class_date: [  
      (val) => (val || "").length > 0 || 'โปรดเลือกวันที่'],
      start_time: [(val) => (val || "") > 0 || "โปรดเลือกเวลาเริ่ม"],
      end_time: [(val) => (val || "") > 0 || "โปรดเลือกเวลาสิ้นสุด"],
      students: [(val) => (val || "") > 0 || "โปรดระบุจำนวนนักเรียน"],
    },
  }),

  created() {
    this.coachs_option = this.coachs;
  },
  mounted() {},
  watch: {},
  computed: {
    ...mapGetters({
      course_data: "CourseModules/getCourseData",
      teach_days: "CourseModules/getTeachDays",
      course_monitors: "CourseMonitorModules/getCourseMonitor",
    }),
    setFunction(){
      this.GetShortCourseMonitor({
        course_id: this.course_data.course_id,
      });
      return ""
    }
  },
  methods: {
    ...mapActions({
      ChangeCourseData: "CourseModules/ChangeCourseData",
      GetTeachDays: "CourseModules/GetTeachDays",
      DeleteDayOfWeek : "CourseModules/DeleteDayOfWeek",
      DeleteTime : "CourseModules/DeleteTime",
      GetCourse: "CourseModules/GetCourse",
      // monitor
      GetShortCourseMonitor: "CourseMonitorModules/GetShortCourseMonitor",
    }),
    checkStudyByDay(e, data){
      // console.log(e.target.click())
      if(!data.class_open){
        console.log(this.course_monitors.filter(v => v.m_day_of_week_id === data.day_of_week_id))
        if(this.course_monitors.filter(v => v.m_day_of_week_id === data.day_of_week_id).length > 0){
          if(this.course_monitors.filter(v => v.m_day_of_week_id === data.day_of_week_id).some(v => v.m_current_student > 0)){
            data.class_open = true
            e.target.click()
            Swal.fire({
              icon: "error",
              title: "ไม่สามารถปิดวันสอนได้",
              text: "เนื่องจากมีนักเรียนในคอร์ส",
              showDenyButton: false,
              showCancelButton: false,
              confirmButtonText: "ตกลง",
              cancelButtonText: "ยกเลิก",
            })  
          }
        }
       
        console.log(data.class_open)
      }
    },
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 210;
        case "sm":
          return 147.5;
        case "md":
          return 180.5;
        case "lg":
          return 251.5;
        case "xl":
          return 401.75;
      }
    },
    removeCoach(coach, index) {
      console.log(coach, index);
      coach.splice(index, 1);
    },
    coachsOptions(coach_selected) {
      const selectedCoachIds = this.course_data.coachs.map(
        (coach) => coach.coach_id
      );
      const availableCoaches = this.coachs.filter(
        (coach) =>
          !selectedCoachIds.includes(coach.accountId) ||
          coach.accountId === coach_selected.coach_id
      );

      return availableCoaches;
    },
    filteredDays(coachIndex, teachDayIndex, state) {
      if (state === "create") {
        const teachDayData = this.course_data.coachs[coachIndex].teach_day_data;
        const currentTeachDay = teachDayData[teachDayIndex];
        const usedDays = [];
        // Loop through all teach_day_data and collect used days
        teachDayData.forEach((teachDay) => {
          if (teachDay !== currentTeachDay) {
            usedDays.push(...teachDay.teach_day);
          }
        });

        // Filter out used days from the available days
        return this.days_confix.filter((day) => !usedDays.includes(day.value));
      } else {
        return this.days_confix;
      }
    },
    removeChip(item, value) {
      value.splice(value.indexOf(item), 1);
    },
    disabledMinutes(hour, coachIndex, teachDayIndex) {
      const teach_days_used = this.course_data.coachs[coachIndex].teach_days_used;
      const current_teach_day = this.course_data.coachs[coachIndex].teach_day_data[teachDayIndex];
      const used_minutes = [];
      teach_days_used.forEach((teach_day) => {
        if ( current_teach_day.teach_day.includes(parseInt(teach_day.date_value))) {
          teach_day.times.forEach((time) => {
            const start_hour = parseInt(time.start.split(":")[0]);
            const start_minute = parseInt(time.start.split(":")[1]);
            const end_hour = parseInt(time.end.split(":")[0]);
            const end_minute = parseInt(time.start.split(":")[1]);
            // Disable all minutes within the range of this time
            if (hour === start_hour && hour === end_hour) {
              for (let i = start_minute; i <= end_minute; i += 15) {
                used_minutes.push(i);
              }
            } else if (hour === start_hour) {
              for (let i = start_minute; i <= 45; i += 15) {
                used_minutes.push(i);
              }
            } else if (hour === end_hour) {
              for (let i = 0; i <= end_minute; i += 15) {
                used_minutes.push(i);
              }
            }
          });
        }
      });
      return used_minutes;
    },
    selectDays(selectedDays, coachIndex, teachDayIndex) {
      const teachDayData = this.course_data.coachs[coachIndex].teach_day_data;
      const currentTeachDay = teachDayData[teachDayIndex];

      // Check if the selected day has already been selected by another teach_day
      const conflictTeachDay = teachDayData.find(
        (teachDay, index) =>
          index !== teachDayIndex &&
          teachDay.teach_day.some((day) => selectedDays.includes(day))
      );

      if (conflictTeachDay) {
        // If there is a conflict, show an error message and reset the selection
        console.log(
          `Cannot select ${selectedDays.join(
            ", "
          )} because it has already been selected by teach_day ${
            conflictTeachDay.class_date[0].class_date_range.start_time
          }`
        );
        currentTeachDay.teach_day = currentTeachDay.teach_day.filter(
          (day) => !selectedDays.includes(day)
        );
      } else {
        this.course_data.coachs[coachIndex].disabled_hours = [];
        const teach_days_used =
          this.course_data.coachs[coachIndex].teach_days_used;
        const current_teach_day =
          this.course_data.coachs[coachIndex].teach_day_data[teachDayIndex];
        const used_hours = [];
        console.log("teach_days_used :", teach_days_used);
        console.log("current_teach_day :", current_teach_day.teach_day);
        teach_days_used.forEach((teach_day) => {
          console.log("teach_day :", teach_day);
          console.log( "current_teach_day :", current_teach_day.teach_day.includes(parseInt(teach_day.date_value)) );
          if (current_teach_day.teach_day.includes(parseInt(teach_day.date_value)) ) {
            teach_day.times.forEach((time) => {
              const start_hour = parseInt(time.start.split(":")[0]);
              const end_hour = parseInt(time.end.split(":")[0]);
              for (let hour = start_hour; hour <= end_hour; hour++) {
                const used_hour = hour;
                if (!used_hours.includes(used_hour)) {
                  used_hours.push(used_hour);
                }
              }
            });
          }
        });
        console.log(used_hours);
        this.course_data.coachs[coachIndex].disabled_hours = used_hours;
        // If there is no conflict, update the selected days for the current teach_day
        currentTeachDay.teach_day = selectedDays;
      }
      this.ChangeCourseData(this.course_data);
    },

    genStartTimeEndTime(value, coach_index, teach_day_index, class_date_index) {
      console.log(value, coach_index, teach_day_index, class_date_index)
      if (value) {
        // console.log("course_hours =>", this.course_data.course_hours);
        // console.log("start =>", value);
        const end = moment(value).add(this.course_data.course_hours, "hour");
        // console.log("end =>", end);
        // console.log("teach_day=>",this.course_data.coachs[coach_index])
        this.course_data.coachs[coach_index].teach_day_data[teach_day_index].class_date[class_date_index].class_date_range.end_time = end;
      }
      this.ChangeCourseData(this.course_data);
    },
    limitEndTime(value, coach_index, teach_day_index, class_date_index) {
      let start =
        this.course_data.coachs[coach_index].teach_day_data[teach_day_index]
          .class_date[class_date_index].class_date_range.start_time;
      let end = moment(value);
      if (start.isAfter(end)) {
        const endTime = moment(start).add(
          this.course_data.course_hours,
          "hour"
        );
        this.course_data.coachs[coach_index].teach_day_data[
          teach_day_index
        ].class_date[class_date_index].class_date_range.end_time = endTime;
      }
      this.ChangeCourseData(this.course_data);
    },
    findTeachDays(coach_data, coach_index) {
      this.select_coachs.push(coach_data.coach_id);
      this.GetTeachDays(coach_data).then(() => {
        this.course_data.coachs[coach_index].teach_days_used = this.teach_days;
      });
      this.ChangeCourseData(this.course_data);
    },
    addTeachDay(data) {
      console.log(data);
      data.teach_day_data.push({
        teach_day: [],
        course_coach_id: data.course_coach_id,
        class_date: [
          {
            class_date_range: {
              start_date: "",
              menu_start_date: false,
              end_date: "",
              menu_end_date: false,
              start_time: "",
              end_time: "",
            },
            students: 0,
          },
        ],
      });
      this.ChangeCourseData(this.course_data);
    },
    removeTeachDay(data, index) {
      data.splice(index, 1);
      this.ChangeCourseData(this.course_data);
    },
    addTime(data) {
      console.log(data);
      data.class_date.push({
        class_date_range: {
          start_date: "",
          menu_start_date: false,
          end_date: "",
          menu_end_date: false,
          start_time: "",
          end_time: "",
        },
        students: 0,
      });
      this.ChangeCourseData(this.course_data);
    },
    removeTime(data, index) {
      data.splice(index, 1);
      this.ChangeCourseData(this.course_data);
    },
    removeTimeData(data, time_id){
      Swal.fire({
        icon: "question",
        title: "ต้องการลบเวลาสอนนี้ใช่หรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.DeleteTime({time_id:time_id}).then(()=>{
            this.$store.dispatch("CourseModules/GetCourse", this.$route.params.course_id );
          })
        }
      })
    },
    removeDayOfWeekData(data, day_of_week_id){
      console.log(data, day_of_week_id)
      Swal.fire({
        icon: "question",
        title: "ต้องการลบวันสอนนี้ใช่หรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.DeleteDayOfWeek({day_of_week_id:day_of_week_id}).then(()=>{
            this.$store.dispatch("CourseModules/GetCourse", this.$route.params.course_id );
          })
        }
      })
    },
    
  },
};
</script>

  