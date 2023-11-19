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
              <v-col cols class="d-flex align-center justify-end">
                <v-switch
                  @click="checkStudyByDay($event, teach_day)"
                  :disabled="disable"
                  v-model="teach_day.class_open"
                  color="green"
                  hide-details
                  :label="$t('teaching')"
                ></v-switch>
              </v-col>
              <v-col
                cols="auto"
                v-if="
                  course_data.coachs.filter((v) => v.teach_day_data.length > 0)
                    .length > 1
                "
              >
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
                <template v-else>
                  <v-btn
                    icon
                    small
                    color="red"
                    v-if="!disable"
                    @click="
                      DeleteCoachById(
                        coach.course_coach_id,
                        course_data.course_id
                      )
                    "
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </template>
              </v-col>
            </v-row>
            <v-row dense class="flex align-center justify-end">
              <v-col cols="12" sm="4">
                <label-custom required :text="$t('coach')"></label-custom>
                <v-autocomplete
                  dense
                  :disabled="
                    disable ? disable : coach.course_coach_id ? true : false
                  "
                  :outlined="!disable"
                  :filled="disable"
                  v-model="coach.coach_id"
                  color="#FF6B81"
                  :items="coachsOptions(coach)"
                  item-value="accountId"
                  :item-text="
                    $i18n.locale == 'th' ? 'fullNameTh' : 'fullNameEh'
                  "
                  item-color="pink"
                  @change="findTeachDays(coach, coach_index)"
                  :rules="course"
                  :placeholder="$t('coach')"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ $t("no data found") }}</v-list-item-title
                      >
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
                          >{{
                            $i18n.locale == "th"
                              ? item.fullNameTh
                              : item.fullNameEh
                          }}</span
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
                <label-custom
                  required
                  :text="$t('teaching day')"
                ></label-custom>
                <v-autocomplete
                  dense
                  :disabled="disable"
                  :outlined="!disable"
                  :filled="disable"
                  chips
                  :rules="class_date"
                  deletable-chips
                  item-color="pink"
                  multiple
                  color="#FF6B81"
                  :items="filteredDays(coach_index, teach_day_index, state)"
                  :item-text="$i18n.locale == 'th' ? 'label' : 'label_en'"
                  item-value="value"
                  :placeholder="$t('please select a time')"
                  v-model="teach_day.teach_day"
                  @change="
                    selectDays(
                      teach_day.teach_day,
                      coach_index,
                      teach_day_index
                    )
                  "
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
                      <strong>{{
                        $i18n.locale == "th" ? item.label : item.label_en
                      }}</strong>
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
                  {{ $t("add teaching day") }}
                </v-btn>
              </v-col>
              <v-col cols="6" sm="2">
                <template v-if="teach_day.day_of_week_id">
                  <v-btn
                    :disabled="disable || !edited"
                    text
                    color="red"
                    v-if="coach.teach_day_data.length > 1"
                    @click="
                      removeDayOfWeekData(
                        coach.teach_day_data,
                        teach_day.day_of_week_id
                      )
                    "
                    ><v-icon>mdi-calendar-plus-outline</v-icon>
                    {{ $t("delete teaching day") }}
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn
                    :disabled="disable"
                    text
                    color="red"
                    v-if="coach.teach_day_data.length > 1"
                    @click="
                      removeTeachDay(coach.teach_day_data, teach_day_index)
                    "
                    ><v-icon>mdi-calendar-plus-outline</v-icon>
                    {{ $t("delete teaching day") }}
                  </v-btn>
                </template>
              </v-col>
            </v-row>
            <!-- CLASS TIME -->
            <template
              v-for="(class_date, class_date_index) in teach_day.class_date"
            >
              <v-row dense :key="`${class_date_index}-class-date`">
                <v-col cols="12" sm="5">
                  <label-custom required :text="$t('period')"></label-custom>
                  <v-row dense class="mb-3">
                    <v-col class="px-2" cols="12" sm="6">
                      <v-text-field
                        :disabled="disable"
                        :outlined="!disable"
                        :filled="disable"
                        dense
                        style="position: absolute; z-index: 4"
                        @focus="
                          SelectedStartDate(
                            $event,
                            teach_day.class_date,
                            class_date.class_date_range.start_time
                          )
                        "
                        :rules="start_time"
                        v-model="class_date.class_date_range.start_time"
                      ></v-text-field>
                      <VueTimepicker
                        class="time-picker-hidden"
                        :hour-range="
                          checkHour(teach_day.class_date, class_date_index)
                        "
                        :minute-range="
                          checkMinute(
                            teach_day.class_date,
                            class_date.class_date_range.start_time_object.HH
                          )
                        "
                        hide-clear-button
                        advanced-keyboard
                        v-model="class_date.class_date_range.start_time_object"
                        @change="
                          ChangeStartDate(
                            class_date.class_date_range,
                            teach_day.class_date
                          )
                        "
                      >
                      </VueTimepicker>
                    </v-col>
                    <v-col class="px-2" cols="12" sm="6">
                      <v-text-field
                        disabled
                        :outlined="!disable"
                        :filled="disable"
                        dense
                        style="position: absolute; z-index: 4"
                        :rules="end_time"
                        v-model="class_date.class_date_range.end_time"
                      ></v-text-field>
                      <VueTimepicker
                        class="time-picker-hidden"
                        disabled
                        hide-clear-button
                        advanced-keyboard
                        v-model="class_date.class_date_range.end_time_object"
                        close-on-complete
                      ></VueTimepicker>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" sm="3">
                  <label-custom
                    required
                    :text="$t('acceptable students')"
                  ></label-custom>
                  <v-text-field
                    class="input-text-right"
                    dense
                    :disabled="disable"
                    :outlined="!disable"
                    :filled="disable"
                    type="number"
                    :suffix="$t('person')"
                    @focus="$event.target.select()"
                    :rules="students"
                    @change="ChangeCourseData(course_data)"
                    v-model="class_date.students"
                    :placeholder="$t('specify students who can accept')"
                    color="#ff6b81"
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
                    {{ $t("add time") }}
                  </v-btn>
                </v-col>
                <v-col cols="6" sm="2" class="d-flex align-center">
                  <template v-if="class_date.class_date_range.day_of_week_id">
                    <v-btn
                      :disabled="disable"
                      v-if="teach_day.class_date.length > 1"
                      text
                      color="red"
                      @click="
                        removeTimeData(
                          teach_day.class_date,
                          class_date.class_date_range.time_id
                        )
                      "
                    >
                      <v-icon>mdi-timer-minus-outline</v-icon>
                      {{ $t("delete time") }}
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn
                      :disabled="disable"
                      v-if="teach_day.class_date.length > 1"
                      text
                      color="red"
                      @click="
                        removeTime(teach_day.class_date, class_date_index)
                      "
                    >
                      <v-icon>mdi-timer-minus-outline</v-icon>
                      {{ $t("delete time") }}
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
import moment from "moment";
import Swal from "sweetalert2";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import { generateTimeArrayHours } from "@/functions/functions";
export default {
  components: {
    LabelCustom,
    VueTimepicker,
  },
  props: {
    color: { type: String, default: "#fcfcfc" },
    coachs: { type: Array },
    disable: { type: Boolean },
    state: { type: String, default: "create" },
    edited: { type: Boolean, default: false },
  },
  data: () => ({
    select_coachs: [],
    coachs_option: [],
    days_confix: [
      { label: "วันอาทิตย์", label_en: "Sunday", value: 0 },
      { label: "วันจันทร์", label_en: "Monday", value: 1 },
      { label: "วันอังคาร", label_en: "Tuesday", value: 2 },
      { label: "วันพุธ", label_en: "Wednesday", value: 3 },
      { label: "วันพฤหัสบดี", label_en: "Thursday", value: 4 },
      { label: "วันศุกร์", label_en: "Friday", value: 5 },
      { label: "วันเสาร์", label_en: "Saturday", value: 6 },
    ],
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
    course() {
      return [
        (val) => (val || "").length > 0 || this.$t("please select a coach"),
      ];
    },
    class_date() {
      return [
        (val) =>
          (val || "").length > 0 || this.$t("please select a teaching date"),
      ];
    },
    start_time() {
      return [
        (val) =>
          (val || "").length == 5 || this.$t("please select a start time"),
      ];
    },
    end_time() {
      return [
        (val) =>
          (val || "").length == 5 || this.$t("please select an end time"),
      ];
    },
    students() {
      return [
        (val) =>
          (val || "") > 0 || this.$t("please specify the number of students"),
      ];
    },
    setFunction() {
      if (this.course_data.course_id) {
        this.GetShortCourseMonitor({
          course_id: this.course_data.course_id,
        });
      }
      return "";
    },
  },
  methods: {
    ...mapActions({
      ChangeCourseData: "CourseModules/ChangeCourseData",
      GetTeachDays: "CourseModules/GetTeachDays",
      DeleteDayOfWeek: "CourseModules/DeleteDayOfWeek",
      DeleteTime: "CourseModules/DeleteTime",
      GetCourse: "CourseModules/GetCourse",
      GetShortCourseMonitor: "CourseMonitorModules/GetShortCourseMonitor",
      DeleteCourseCoach: "CourseModules/DeleteCourseCoach",
    }),
    checkMinute(teach_day, hours) {
      if (teach_day.length > 1) {
        let timeused = [];
        let timeMinUsed = [];
        timeused = teach_day.map((v) => {
          return {
            start_time: v.class_date_range.start_time_object,
            end_time: v.class_date_range.end_time_object,
          };
        });
        if (timeused.filter((v) => v.end_time.HH === hours).length > 0) {
          timeused
            .filter((v) => v.end_time.HH === hours)
            .forEach((time) => {
              if (hours === time.end_time.HH) {
                let min_end = parseInt(time.end_time.mm);
                for (let min = min_end; min < 60; min++) {
                  timeMinUsed.push(min);
                }
              }
            });
        } else {
          for (let min = 0; min < 60; min++) {
            timeMinUsed.push(min);
          }
        }
        return timeMinUsed;
      }
    },
    checkHour(teach_day, timeindex) {
      let timeused = [];
      let timeusedHH = [];
      timeused = teach_day.map((v) => {
        return {
          start_time: v.class_date_range.start_time_object,
          end_time: v.class_date_range.end_time_object,
        };
      });
      timeused.forEach((time, index) => {
        if (timeindex !== index) {
          if (time.start_time.HH) {
            timeusedHH.push(parseInt(time.start_time.HH));
          }
        }
      });
      return generateTimeArrayHours(timeusedHH);
    },
    ChangeStartDate(date) {
      if (!date.start_time_object.mm) {
        date.start_time_object.mm = "00";
      }
      date.start_time = `${date.start_time_object.HH}:${date.start_time_object.mm}`;
      if (
        parseInt(date.start_time_object.HH) +
          parseInt(this.course_data.course_hours_obj.HH) >=
        24
      ) {
        date.end_time_object.HH = `${
          parseInt(date.start_time_object.HH) +
          parseInt(this.course_data.course_hours_obj.HH) -
          24
        }`.padStart(2, "0");
      } else {
        date.end_time_object.HH = `${
          parseInt(date.start_time_object.HH) +
          parseInt(this.course_data.course_hours_obj.HH)
        }`.padStart(2, "0");
      }
      if (
        parseInt(date.start_time_object.mm) +
          parseInt(this.course_data.course_hours_obj.mm) >
        59
      ) {
        date.end_time_object.mm = `${
          parseInt(date.start_time_object.mm) +
          parseInt(this.course_data.course_hours_obj.mm) -
          60
        }`.padStart(2, "0");

        if (parseInt(date.end_time_object.HH) + 1 >= 24) {
          date.end_time_object.HH = `${
            parseInt(date.end_time_object.HH) + 1 - 24
          }`.padStart(2, "0");
        } else {
          date.end_time_object.HH = `${
            parseInt(date.end_time_object.HH) + 1
          }`.padStart(2, "0");
        }
      } else {
        date.end_time_object.mm = `${
          parseInt(date.start_time_object.mm) +
          parseInt(this.course_data.course_hours_obj.mm)
        }`.padStart(2, "0");
      }
      date.end_time = `${date.end_time_object.HH}:${date.end_time_object.mm}`;
    },

    SelectedStartDate(e) {
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode
        .getElementsByClassName("time-picker-hidden")[0]
        .getElementsByTagName("input")[0]
        .focus();
    },
    checkStudyByDay(e, data) {
      if (!data.class_open) {
        if (
          this.course_monitors.filter(
            (v) => v.m_day_of_week_id === data.day_of_week_id
          ).length > 0
        ) {
          if (
            this.course_monitors
              .filter((v) => v.m_day_of_week_id === data.day_of_week_id)
              .some((v) => v.m_current_student > 0)
          ) {
            data.class_open = true;
            e.target.click();
            Swal.fire({
              icon: "error",
              title: this.$t("teaching days cannot be closed"),
              text: this.$t("because there are students in the course"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          }
        }
      }
    },
    DeleteCoachById(course_coach_id, course_id) {
      Swal.fire({
        icon: "question",
        title: this.$t("want to delete a coach?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.DeleteCourseCoach({
            course_id: course_id,
            course_coach_id: course_coach_id,
          });
        }
      });
    },
    removeCoach(coach, index) {
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
        teachDayData.forEach((teachDay) => {
          if (teachDay !== currentTeachDay) {
            usedDays.push(...teachDay.teach_day);
          }
        });

        return this.days_confix.filter((day) => !usedDays.includes(day.value));
      } else {
        return this.days_confix;
      }
    },
    removeChip(item, value) {
      value.splice(value.indexOf(item.value), 1);
    },
    disabledMinutes(hour, coachIndex, teachDayIndex) {
      const teach_days_used =
        this.course_data.coachs[coachIndex].teach_days_used;
      const current_teach_day =
        this.course_data.coachs[coachIndex].teach_day_data[teachDayIndex];
      const used_minutes = [];
      teach_days_used.forEach((teach_day) => {
        if (
          current_teach_day.teach_day.includes(parseInt(teach_day.date_value))
        ) {
          teach_day.times.forEach((time) => {
            const start_hour = parseInt(time.start.split(":")[0]);
            const start_minute = parseInt(time.start.split(":")[1]);
            const end_hour = parseInt(time.end.split(":")[0]);
            const end_minute = parseInt(time.start.split(":")[1]);
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

      const conflictTeachDay = teachDayData.find(
        (teachDay, index) =>
          index !== teachDayIndex &&
          teachDay.teach_day.some((day) => selectedDays.includes(day))
      );

      if (conflictTeachDay) {
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
        teach_days_used.forEach((teach_day) => {
          if (
            current_teach_day.teach_day.includes(parseInt(teach_day.date_value))
          ) {
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
        this.course_data.coachs[coachIndex].disabled_hours = used_hours;
        currentTeachDay.teach_day = selectedDays;
      }
      this.ChangeCourseData(this.course_data);
    },

    genStartTimeEndTime(value, coach_index, teach_day_index, class_date_index) {
      if (value) {
        const end = moment(value).add(this.course_data.course_hours, "hour");
        this.course_data.coachs[coach_index].teach_day_data[
          teach_day_index
        ].class_date[class_date_index].class_date_range.end_time = end;
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
      data.teach_day_data.push({
        teach_day: [],
        course_coach_id: data.course_coach_id,
        class_date: [
          {
            class_date_range: {
              start_time: "",
              start_time_object: { HH: "", mm: "" },
              menu_start_time: false,
              end_time: "",
              end_time_object: { HH: "", mm: "" },
              menu_end_time: false,
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
      data.class_date.push({
        class_date_range: {
          start_time: "",
          start_time_object: { HH: "", mm: "" },
          menu_start_time: false,
          end_time: "",
          end_time_object: { HH: "", mm: "" },
          menu_end_time: false,
        },
        students: 0,
      });
      this.ChangeCourseData(this.course_data);
    },
    removeTime(data, index) {
      data.splice(index, 1);
      this.ChangeCourseData(this.course_data);
    },
    removeTimeData(data, time_id) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete this teaching time?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.DeleteTime({ time_id: time_id }).then(() => {
            this.$store.dispatch(
              "CourseModules/GetCourse",
              this.$route.params.course_id
            );
          });
        }
      });
    },
    removeDayOfWeekData(data, day_of_week_id) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete this teaching day"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.DeleteDayOfWeek({ day_of_week_id: day_of_week_id }).then(() => {
            this.$store.dispatch(
              "CourseModules/GetCourse",
              this.$route.params.course_id
            );
          });
        }
      });
    },
  },
};
</script>
