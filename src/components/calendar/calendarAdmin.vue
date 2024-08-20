
<template>
  <v-container>
    <!-- <v-row class="mt-[-94px]">
      <v-col class="w-full">
        <v-text-field
          dense
          class="w-full"
          outlined
          :label="$t('search')"
          color="pink"
          hide-details
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          @keypress.enter="GetSchedule({ start: dateSelected, search: $event })"
        ></v-text-field>
      </v-col>
    </v-row> -->
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
      :events="data_in_schedule"
      event-text-color="#000000"
      event-overlap-mode="column"
      :first-interval="0"
      :interval-count="24"
      :event-overlap-threshold="30"
      @click:event="selectedDate($event)"
      :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
      @change="GetSchedule"
    >
      <template v-slot:event="{ event }">
        {{ event.timed ?? event.timed }}
        {{
          event.timed && event.itmeData.nameEn
            ? `\n ${$i18n.locale == "th" ? event.name : event.itmeData.nameEn}`
            : `${event.name}`
        }}
      </template>
    </v-calendar>

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
                  details.type == "holiday"
                    ? $t("holiday information")
                    : $t("class information")
                }}
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <label class="font-weight-bold">{{
                  details.type == "holiday"
                    ? $t("holiday name")
                    : $t("course name")
                }}</label>
                <v-text-field
                  :value="
                    $i18n.locale == 'th'
                      ? details.name
                      : details.itmeData?.nameEn
                      ? details.itmeData.nameEn
                      : details.name
                  "
                  outlined
                  readonly
                  dense
                  hide-details
                  color="#ff6b81"
                >
                </v-text-field>
              </v-col>
              <!-- วันที่ -->
              <v-col cols="12">
                <label class="font-weight-bold">{{ $t("date") }}</label>
                <v-text-field
                  :value="
                    new Date(details.start).toLocaleDateString(
                      $i18n.locale == 'th' ? 'th-TH' : 'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )
                  "
                  hide-details
                  outlined
                  readonly
                  dense
                  color="#ff6b81"
                >
                  <template v-slot:append>
                    <v-icon :color="'#FF6B81'">mdi-calendar</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text>
            <v-row dense v-if="details.type == 'normal'">
              <v-col cols="12" sm="6">
                <label class="font-weight-bold">{{ $t("start time") }}</label>
                <v-text-field
                  hide-details
                  dense
                  outlined
                  readonly
                  :value="details.startTime"
                  color="#ff6b81"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <label class="font-weight-bold">{{ $t("end time") }}</label>
                <v-text-field
                  hide-details
                  dense
                  outlined
                  readonly
                  :value="details.endTime"
                  color="#ff6b81"
                >
                </v-text-field>
              </v-col>
            </v-row>

            <v-row dense v-if="details.type == 'holiday'">
              <v-col cols="12" sm="6" v-if="details.allday === false">
                <label class="font-weight-bold">{{ $t("start time") }}</label>
                <v-text-field
                  hide-details
                  dense
                  outlined
                  readonly
                  :value="details.startTime"
                  color="#ff6b81"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="6" v-if="details.allday === false">
                <label class="font-weight-bold">{{ $t("end time") }}</label>
                <v-text-field
                  hide-details
                  dense
                  outlined
                  readonly
                  :value="details.endTime"
                  color="#ff6b81"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" align="center" v-else>
                <v-text-field
                  hide-details
                  dense
                  outlined
                  readonly
                  :value="$t('all days')"
                  color="#ff6b81"
                >
                </v-text-field
              ></v-col>
            </v-row>
          </v-card-text>

          <v-card-text>
            <v-row dense v-if="details.type == 'normal'">
              <v-col cols="12" sm="6">
                <label class="font-weight-bold">{{ $t("coach") }}</label>
                <v-text-field
                  dense
                  outlined
                  readonly
                  :value="
                    $i18n.locale == 'th'
                      ? details.itmeData?.coachName
                      : details.itmeData?.coachNameEn
                      ? details.itmeData?.coachNameEn
                      : details.itmeData?.coachName
                  "
                  hide-details
                  color="#ff6b81"
                >
                </v-text-field>
              </v-col>

              <v-col
                cols="12"
                sm="6"
                v-if="details.package && details.package !== 'leave'"
              >
                <label class="font-weight-bold">{{ $t("package") }}</label>
                <v-text-field
                  dense
                  outlined
                  readonly
                  :value="details.package"
                  hide-details
                  color="#ff6b81"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" v-if="details.package == 'leave'">
                <label class="font-weight-bold">{{
                  $t("compensation from")
                }}</label>
                <v-text-field
                  dense
                  outlined
                  readonly
                  :value="convertDate(details.selectedDate)"
                  hide-details
                  color="#ff6b81"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="details?.itmeData?.subCoachName">
              <v-col cols="12">
                <label class="font-weight-bold">{{
                  $t("substitute coach")
                }}</label>
                <v-text-field
                  dense
                  outlined
                  readonly
                  :value="
                    $i18n.locale == 'th'
                      ? details?.itmeData?.subCoachName
                      : details?.itmeData?.subCoachNameEn
                  "
                  hide-details
                  color="#ff6b81"
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
    searchFilter: {
      type: String,
      default: "",
      required: false,
    },
    searchCourse: {
      type: Array,
      required: false,
    },
    searchCourseType: {
      type: Array,
      required: false,
    },
    searchChose: {
      type: Array,
      required: false,
    },
  },
  data: () => ({
    search: "",
    selectedCourse: [],
    selectedCourseType: "",
    selectedCoach: [],
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
    dateSelected: { month: "", year: "" },
  }),

  watch: {
    searchFilter(newFilter) {
      this.search = newFilter;
    },
    searchCourse(newFilter) {
      this.selectedCourse = newFilter;
    },
    searchCourseType(newFilter) {
      this.selectedCourseType = newFilter;
    },
    searchChose(newFilter) {
      this.selectedCoach = newFilter;
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
    this.start_of_week = this.start_of_week.toLocaleDateString(
      this.$i18n.locale == "th" ? "th-TH" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }
    );
    this.end_of_week = this.end_of_week.toLocaleDateString(
      this.$i18n.locale == "th" ? "th-TH" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }
    );
    this.ready = true;
  },

  methods: {
    ...mapActions({
      GetAllHolidays: "ManageScheduleModules/GetAllHolidays",
      GetDataInSchedule: "ManageScheduleModules/GetDataInSchedule",
    }),
    GetSchedule({ start, search }) {
      if (!search) {
        this.GetDataInSchedule({
          month: start.month,
          year: start.year,
          search: this.search ? this.search : "",
          courseId: this.selectedCourse,
          coachId: this.selectedCoach,
          status: this.selectedCourseType,
        });
        this.dateSelected.month = start.month;
        this.dateSelected.year = start.year;
      } else {
        this.GetDataInSchedule({
          month: start.month,
          year: start.year,
          search: this.search ? this.search : "",
          courseId: this.selectedCourse,
          coachId: this.selectedCoach,
          status: this.selectedCourseType,
        });
      }
      this.$emit(
        "schedule-data",
        this.dateSelected.month,
        this.dateSelected.year,
        this.search
      );
    },
    convertDate(item) {
      const oriDate = new Date(item);
      const fullDate = oriDate.toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
      return fullDate;
    },

    genTitleCalender(title) {
      let title_part = title.split(" ");
      return this.$i18n.locale == "th"
        ? `${title_part[0]} ${parseFloat(title_part[1]) + 543}`
        : `${title_part[0]} ${parseFloat(title_part[1])}`;
    },
    selectedDate(data) {
      this.details = data.event;
      this.dialog_detail = true;
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
