<template>
  <v-container>
    <v-card-title>
      <v-row>
        <v-col cols="auto">
          <v-btn icon @click="prev"><v-icon>mdi-chevron-left</v-icon></v-btn>
        </v-col>
        <v-col align="center" v-if="$refs.calendar">{{
          genTitleCalender($refs.calendar.title)
        }}</v-col>
        <v-col cols="auto">
          <v-btn icon @click="next"><v-icon>mdi-chevron-right</v-icon></v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-calendar
      ref="calendar"
      color="#ff6b81"
      type="month"
      v-model="focus"
      :events="
        data_search_schedule
          ? data_search_schedule
          : data_filter_schedule
          ? data_filter_schedule
          : data_in_schedule
      "
      event-text-color="#000000"
      event-overlap-mode="column"
      :first-interval="1"
      :interval-count="24"
      :event-overlap-threshold="30"
      @click:event="selectedDate($event)"
      locale="th-TH"
    >
      <template v-slot:event="{ event }">
        {{ event.timed ?? event.timed }}
        {{ event.name }}
      </template>
    </v-calendar>

    <!-- MONTH -->

    <v-bottom-sheet v-model="showModal">
      <div class="bg-white rounded-t-lg pa-4">
        <v-row dense>
          <v-col class="flex align-center">
            <label class="text-lg font-bold ma-2">{{
              new Date(focus).toLocaleDateString("th-TH", {
                day: "numeric",
                weekday: "long",
              })
            }}</label>
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <div v-if="event_date.length >= 0">
          <template>
            <div v-for="(event, event_index) in event_date" :key="event_index">
              <v-card flat>
                <v-card-text class="border-2 border-[#ff6b81]">
                  <v-row dense>
                    <v-col cols="auto" class="text-sm text-[#999999]">
                      {{ `${event.start_time}` }}<br />{{ `${event.end_time}` }}
                    </v-col>
                    <v-col cols="auto">
                      <v-icon small :color="event.color">mdi-circle</v-icon>
                    </v-col>
                    <v-col>
                      <v-row dense>
                        <label class="font-bold">{{ event.timed }} </label>
                      </v-row>
                      <v-row dense>
                        <v-col> เรียนโดย: {{ event.name }} </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col class="text-sm">
                          โค้ช: {{ event.subtitle }} <br />
                          <div>
                            <v-btn
                              small
                              text
                              class="underline pa-0"
                              color="#ff6b81"
                              @click="ToStudentCourse(event)"
                              >genTitleCalender ดูรายละเอียดคอร์สเรียน
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </template>
        </div>
        <div v-else>
          <v-row>
            <v-col class="text-lg font-bold" align="center">
              ไม่พบคอร์สเรียน
            </v-col>
          </v-row>
        </div>
      </div>
    </v-bottom-sheet>

    <v-dialog v-model="dialog_detail" persistent max-width="600px">
      <v-card>
        <v-container>
          <v-card-title>
            <v-row dense>
              <v-col cols="12" class="absolute right-0 top-0" align="end">
                <v-btn icon @click="dialog_detail = false">
                  <v-icon color="#ff6b81">mdi-close</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" align="center" class="font-weight-bold">
                {{
                  details.type == "holiday" ? "ข้อมูลวันหยุด" : "ข้อมูลวันเรียน"
                }}
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <label class="font-weight-bold">{{
                  details.type == "holiday" ? "ชื่อวันหยุด" : "ชื่อคอร์ส"
                }}</label>
                <v-text-field
                  :value="details.name"
                  outlined
                  readonly
                  dense
                  hide-details
                >
                </v-text-field>
              </v-col>
              <!-- วันที่ -->
              <v-col cols="12">
                <label class="font-weight-bold">วันที่</label>
                <v-text-field
                  :value="
                    new Date(details.start).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  "
                  hide-details
                  outlined
                  readonly
                  dense
                  append-icon="mdi-calendar"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text>
            <v-row dense v-if="details.type == 'normal'">
              <v-col cols="12" sm="6">
                <label class="font-weight-bold">เวลาเริ่ม</label>
                <v-text-field
                  hide-details
                  dense
                  outlined
                  readonly
                  :value="details.startTime"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <label class="font-weight-bold">เวลาสิ้นสุด</label>
                <v-text-field
                  hide-details
                  dense
                  outlined
                  readonly
                  :value="details.endTime"
                >
                </v-text-field>
              </v-col>
            </v-row>

            <v-row dense v-if="details.type == 'holiday'">
              <v-col cols="12" sm="6" v-if="details.allday === false">
                <label class="font-weight-bold">เวลาเริ่ม</label>
                <v-text-field
                  hide-details
                  dense
                  outlined
                  readonly
                  :value="details.startTime"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="6" v-if="details.allday === false">
                <label class="font-weight-bold">เวลาสิ้นสุด</label>
                <v-text-field
                  hide-details
                  dense
                  outlined
                  readonly
                  :value="details.endTime"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" align="center" v-else>
                <v-text-field
                  hide-details
                  dense
                  outlined
                  readonly
                  value="หยุดทั้งวัน"
                >
                </v-text-field
              ></v-col>
            </v-row>
          </v-card-text>

          <v-card-text>
            <v-row dense v-if="details.type == 'normal'">
              <v-col cols="12" sm="6">
                <label class="font-weight-bold">โค้ช</label>
                <v-text-field
                  dense
                  outlined
                  readonly
                  :value="details.coach"
                  hide-details
                >
                </v-text-field>
              </v-col>

              <v-col
                cols="12"
                sm="6"
                v-if="details.package && details.package !== 'leave'"
              >
                <label class="font-weight-bold">แพ็กเกจ</label>
                <v-text-field
                  dense
                  outlined
                  readonly
                  :value="details.package"
                  hide-details
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" v-if="details.package == 'leave'">
                <label class="font-weight-bold">ชดเชยจาก</label>
                <v-text-field
                  dense
                  outlined
                  readonly
                  :value="convertDate(details.selectedDate)"
                  hide-details
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="details?.itmeData?.subCoachName">
              <v-col cols="12">
                <label class="font-weight-bold">ผู้สอนแทน</label>
                <v-text-field
                  dense
                  outlined
                  readonly
                  :value="details?.itmeData?.subCoachName"
                  hide-details
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "calendarCoach",
  props: {
    type: { type: String, default: "month" },
    events: { type: Array },
  },
  data: () => ({
    eventss: [],
    showModal: false,
    test_course_id: "",
    focus: "",
    ready: false,
    start_of_week: "",
    end_of_week: "",
    date_format: {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    },
    event_date: [],
    dialog_detail: false,
    details: "",
    holidaySwitch: true,
  }),

  watch: {
    events(val) {
      this.event_date.push(val);
    },
  },
  computed: {
    ...mapGetters({
      get_all_holidays: "ManageScheduleModules/getAllHolidays",
      data_in_schedule: "ManageScheduleModules/getdataInSchadule",
      data_filter_schedule: "ManageScheduleModules/getFilterSchedule",
      data_search_schedule: "ManageScheduleModules/getSearchFilterSchedule",
    }),
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
  },

  created() {},
  beforeMount() {},
  mounted() {
    this.focus = new Date();
    let today = new Date();
    this.start_of_week = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    );
    this.end_of_week = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 6
    );
    this.start_of_week = this.start_of_week.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    this.end_of_week = this.end_of_week.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    this.ready = true;
  },

  methods: {
    ...mapActions({
      GetAllHolidays: "ManageScheduleModules/GetAllHolidays",
      GetDataInSchedule: "ManageScheduleModules/GetDataInSchedule",
    }),

    convertDate(item) {
      const oriDate = new Date(item);
      const fullDate = oriDate.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return fullDate;
    },

    genTitleCalender(title) {
      let title_part = title.split(" ");
      return `${title_part[0]} ${parseFloat(title_part[1]) + 543}`;
    },
    selectedDate(data) {
      this.details = data.event;
      this.dialog_detail = true;
    },
    selectDate(date) {
      this.event_date = [];
      this.showModal = true;
      this.events.forEach((event) => {
        let [start, start_time] = event.start.split(" ");
        let [end, end_time] = event.end.split(" ");
        if (start_time !== "Invalid date" && end_time !== "Invalid date") {
          if (start === end && start === date) {
            this.event_date.push({
              timed: event.timed,
              name: event.name,
              subtitle: event.subtitle,
              coach: event.coach,
              start_time: start_time,
              end_time: end_time,
              color: event.color,
              courseId: event.courseId,
            });
          }
        }
      });
    },

    goToday() {
      this.focus = new Date();
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },

    functionEvents(date) {
      let events_data = [];
      this.events.forEach((event) => {
        let [date_event] = event.start.split(" ");
        let [year, month, day] = date_event.split("-");
        events_data.push({
          year: year,
          month: month,
          day: day,
        });
      });

      let color = "";
      const [year, month, day] = date.split("-");
      switch (new Date(date).getDay()) {
        case 0:
          if (
            events_data.filter(
              (v) => v.year == year && v.month == month && v.day == day
            ).length > 0
          ) {
            color = "#F898A4";
          }
          break;
        case 1:
          if (
            events_data.filter(
              (v) => v.year == year && v.month == month && v.day == day
            ).length > 0
          ) {
            color = "#FFFACD";
          }
          break;
        case 2:
          if (
            events_data.filter(
              (v) => v.year == year && v.month == month && v.day == day
            ).length > 0
          ) {
            color = "#FFBBDA";
          }
          break;
        case 3:
          if (
            events_data.filter(
              (v) => v.year == year && v.month == month && v.day == day
            ).length > 0
          ) {
            color = "#D0F4DE";
          }
          break;
        case 4:
          if (
            events_data.filter(
              (v) => v.year == year && v.month == month && v.day == day
            ).length > 0
          ) {
            color = "#FFE2D1";
          }
          break;
        case 5:
          if (
            events_data.filter(
              (v) => v.year == year && v.month == month && v.day == day
            ).length > 0
          ) {
            color = "#C0E4F6";
          }
          break;
        case 6:
          if (
            events_data.filter(
              (v) => v.year == year && v.month == month && v.day == day
            ).length > 0
          ) {
            color = "#E8CFF8";
          }
          break;
      }
      return color ? color : false;
    },
    ToStudentCourse(data) {
      this.$router.push({
        name: "StudentCourse",
        params: { course_id: data.courseId },
      });
    },
  },
};
</script>
<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: "";
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
.theme--light.v-calendar-events .v-event-timed {
  border: 1px solid #f9f9f9 !important;
}
</style>
