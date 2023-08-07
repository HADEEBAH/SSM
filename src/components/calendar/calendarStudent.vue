// CALENDAR STUDENT


<template>
  <div>
    <!-- <template v-if="type === 'week'">
            
            <v-row dense>
                <v-col>
               {{ start_of_week }} -  {{ end_of_week }} 
                </v-col>
            </v-row>
            <v-row dense>
                <v-col>
                    <v-btn text class="underline" color="#ff6b81" @click="goToday">คลิกเพื่อไปคอร์สที่ต้องสอนล่าสุด</v-btn>
                </v-col>
            </v-row>
        </template> -->
    <!-- <pre>{{ events }}</pre> -->
    <v-card
      v-if="type === 'week' || type === 'day' || $vuetify.breakpoint.smAndUp"
    >
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
      <!-- <v-sheet height="400"> -->
      <v-calendar
        ref="calendar"
        color="#ff6b81"
        :type="type"
        v-model="focus"
        :events="events"
        event-text-color="#000000"
        event-overlap-mode="column"
        :first-interval="1"
        :interval-count="24"
        :event-overlap-threshold="30"
        @click:event="selectedDate($event)"
        locale="th-TH"
      >
        <template v-if="type === 'week'" v-slot:day-body="{ week }">
          <div
            class="v-current-time"
            :class="{ first: week[0] }"
            :style="{ top: nowY }"
          ></div>
        </template>
      </v-calendar>
    </v-card>
    <!-- MONTH -->
    <v-date-picker
      v-model="focus"
      v-else-if="type === 'month'"
      class="w-full"
      no-title
      :event-color="(date) => (date[9] % 2 ? 'red' : 'yellow')"
      :events="functionEvents"
      @input="selectDate(focus)"
      locale="th-TH"
    ></v-date-picker>
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
              <v-card flat v-if="!event.type">
                <v-card-text class="border-2 border-[#ff6b81]">
                  <v-row dense>
                    <v-col cols="auto">
                      <v-icon small :color="event.color">mdi-circle</v-icon>
                    </v-col>
                    <v-col cols="10" class="text-sm text-[#999999]">
                      {{ `${event.start_time}` }} - {{ `${event.end_time}` }}
                    </v-col>

                    <v-col>
                      เรียนโดย:
                      <span class="font-bold">{{ event.timed }}</span>

                      <v-row dense>
                        <v-col cols="12">
                          คอร์ส: <span class="font-bold">{{ event.name }}</span>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col class="text-sm">
                          โค้ช:
                          <span class="font-bold">{{ event.subtitle }} </span
                          ><br />
                          <div>
                            <v-btn
                              small
                              text
                              class="underline pa-0"
                              color="#ff6b81"
                              @click="ToStudentCourse(event)"
                            >
                              ดูรายละเอียดคอร์สเรียน
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card flat v-else>
                <v-card-text class="border-2 border-[#ff6b81]">
                  <v-row dense v-if="event.subtitle === false">
                    <v-col cols="auto">
                      <v-icon small :color="event.color">mdi-circle</v-icon>
                    </v-col>
                    <v-col cols="10" class="text-sm text-[#999999]">
                      {{ `${event.start_time}` }} - {{ `${event.end_time}` }}
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12">
                      วันหยุด: <span class="font-bold">{{ event.name }}</span>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-divider
                v-if="event_date.length !== event_index + 1 && !event.type"
                class="my-2"
              ></v-divider>
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
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { shortMonthToLongMonth } from "@/functions/functions";

export default {
  name: "calendarCoach",
  props: {
    type: { type: String, default: "month" },
    // , default: () => []
    events: { type: Array },
  },
  data: () => ({
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
  }),

  watch: {
    events(val) {
      this.event_date.push(val);
    },
  },
  computed: {
    ...mapGetters({
      student_data: "MyCourseModules/getStudentData",
    }),
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
  },
  mounted() {
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
  beforeUpdate() {
    this.colorOfDay();
  },

  methods: {
    ...mapActions({
      GetStudentData: "MyCourseModules/GetStudentData",
    }),
    genTitleCalender(title) {
      let title_part = title.split(" ");

      if (title_part.length == 2) {
        return `${title_part[0]} ${parseFloat(title_part[1]) + 543}`;
      } else if (title_part.length == 4) {
        return `${shortMonthToLongMonth(
          title_part[0]
        )} - ${shortMonthToLongMonth(title_part[2])} ${
          parseFloat(title_part[3]) + 543
        }`;
      } else if (title_part.length == 5) {
        return `${shortMonthToLongMonth(title_part[0])}  
        ${parseFloat(title_part[1]) + 543} -
        ${shortMonthToLongMonth(title_part[3])} 
        ${parseFloat(title_part[4]) + 543}`;
      }
    },
    selectedDate(data) {
      if (!data.event.type) {
        this.$router.push({
          name: "StudentCourse",
          params: { course_id: data.event.courseId },
        });
      }
    },
    selectDate(date) {
      this.event_date = [];
      this.showModal = true;
      // console.log("calendar", this.events);
      this.events.forEach((event) => {
        let [start, start_time] = event.start.split(" ");
        let [end, end_time] = event.end.split(" ");
        if (start_time !== "Invalid date" && end_time !== "Invalid date") {
          if (!event.type) {
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
          } else {
            if (start === end && start === date) {
              this.event_date.push({
                name: event.name,
                start_time: event.start_time ? event.start_time : null,
                end_time: event.end_time ? event.end_time : null,
                color: event.color,
                type: event.type,
                courseId: event.courseId,
                subtitle: event.subtitle,
              });
            }
          }
        }
      });
    },
    colorOfDay() {
      this.events.forEach((event) => {
        switch (new Date(event.start).getDay()) {
          case 0:
            event.color = "#F898A4";
            break;
          case 1:
            event.color = "#FFFACD";
            break;
          case 2:
            event.color = "#FFBBDA";
            break;
          case 3:
            event.color = "#D0F4DE";
            break;
          case 4:
            event.color = "#FFE2D1";
            break;
          case 5:
            event.color = "#C0E4F6";
            break;
          case 6:
            event.color = "#E8CFF8";
            break;
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
    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0;
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
