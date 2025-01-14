<template>
  <div>
    <!-- {{ setFunction }} -->
    <div v-if="coach_data?.length === 0 && edited">
      <template>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="#ff6b81"
          ></v-progress-circular>
        </v-row>
      </template>
    </div>
    <div v-else>
      <template v-for="(coach, coach_index) in coach_data">
        <v-card
          v-if="coach.teach_day_data.length > 0"
          :class="`bg-[${color}] mb-5`"
          :key="coach_index"
        >
          <v-row
            dense
            v-if="edited && coach_data?.length > 1 && coach.course_coach_id"
          >
            <v-col cols class="d-flex align-center justify-end">
              <v-btn icon color="red" @click="removeCoachCard(coach)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <!-- TEACH DAY -->
          <template
            v-for="(teach_day, teach_day_index) in coach.teach_day_data"
          >
            <v-card-text :key="`${teach_day_index}-day`" class="border">
              <v-divider
                v-if="teach_day_index > 0"
                :key="teach_day_index"
              ></v-divider>
              <v-row dense>
                <v-col cols class="d-flex align-center justify-end">
                  <v-switch
                    @click="checkStudyByDay($event, teach_day)"
                    :disabled="teach_day.edited_coach"
                    v-model="teach_day.class_open"
                    color="green"
                    hide-details
                    :label="$t('teaching')"
                  ></v-switch>
                </v-col>
                <v-col
                  cols="auto"
                  v-if="
                    coach_data.filter((v) => v.teach_day_data.length > 0)
                      .length > 1
                  "
                >
                  <template v-if="!teach_day?.course_coach_id">
                    <v-btn
                      icon
                      small
                      color="red"
                      v-if="!disable"
                      @click="removeCoach(coach_index)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
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
                      teach_day.edited_coach
                        ? teach_day.edited_coach
                        : teach_day.course_coach_id
                        ? true
                        : false
                    "
                    :outlined="!teach_day.edited_coach"
                    :filled="teach_day.edited_coach"
                    v-model="coach.coach_id"
                    color="#FF6B81"
                    :items="coachsOptions(coach)"
                    item-value="accountId"
                    :item-text="
                      $i18n.locale == 'th' ? 'fullNameTh' : 'fullNameEh'
                    "
                    item-color="#ff6b81"
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
                              coach.coach_id === item.accountId
                                ? 'font-bold'
                                : ''
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
                    :disabled="teach_day.edited_coach"
                    :outlined="!teach_day.edited_coach"
                    :filled="teach_day.edited_coach"
                    chips
                    :rules="class_date"
                    deletable-chips
                    item-color="#ff6b81"
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
                        :disabled="teach_day.edited_coach"
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
                <!-- BUTTONS -->
                <v-col cols="12" sm="4" v-if="edited">
                  <v-row dense v-if="teach_day.day_of_week_id">
                    <v-col cols="12" v-if="teach_day.edited_coach">
                      <!-- EDIT -->
                      <v-btn icon color="#FF6B81" @click="editCoach(teach_day)">
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="8" v-else>
                      <!-- ADD -->
                      <v-btn
                        icon
                        v-if="
                          teach_day_index === coach.teach_day_data.length - 1 &&
                          !teach_day.edited_coach
                        "
                        color="green"
                        @click="addTeachDay(coach)"
                      >
                        <v-icon>mdi-calendar-plus-outline</v-icon>
                        <!-- {{ $t("add teaching day") }} -->
                      </v-btn>
                      <!-- SAVE UPDATE-->
                      <v-btn
                        icon
                        v-if="!teach_day.edited_coach"
                        color="#FF6B81"
                        :disabled="checkDisableCoach(teach_day)"
                        @click="saveUpdateCoach(coach, teach_day)"
                      >
                        <v-icon>mdi-content-save-plus</v-icon>
                      </v-btn>
                      <!-- DELETE COACH -->
                      <v-btn
                        icon
                        color="red"
                        v-if="
                          // coach.teach_day_data.length > 1 &&
                          coach_data.length > 1 && !teach_day.edited_coach
                        "
                        @click="removeTeachingDay(teach_day)"
                      >
                        <v-icon>mdi-trash-can-outline</v-icon>
                      </v-btn>
                      <!-- REFRESH -->
                      <v-btn
                        icon
                        v-if="!teach_day.edited_coach"
                        color="#FF6B81"
                        @click="refreshCoach(teach_day, coach)"
                      >
                        <v-icon>mdi-refresh</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row dense v-else>
                    <v-col cols="12" sm="4">
                      <v-btn
                        text
                        v-if="
                          teach_day_index === coach.teach_day_data.length - 1
                        "
                        color="green"
                        @click="addTeachDay(coach)"
                      >
                        <v-icon>mdi-calendar-plus-outline</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" sm="4" v-else>
                  <v-row dense>
                    <v-col cols="6">
                      <v-btn
                        text
                        :disabled="disable"
                        v-if="
                          teach_day_index === coach.teach_day_data.length - 1
                        "
                        color="green"
                        @click="addTeachDay(coach)"
                      >
                        <v-icon>mdi-calendar-plus-outline</v-icon>
                        {{ $t("add teaching day") }}
                      </v-btn>
                    </v-col>
                    <v-col cols="6">
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
                            removeTeachDay(
                              coach.teach_day_data,
                              teach_day_index
                            )
                          "
                          ><v-icon>mdi-calendar-plus-outline</v-icon>
                          {{ $t("delete teaching day") }}
                        </v-btn>
                      </template>
                    </v-col>
                  </v-row>
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
                          :disabled="class_date.class_date_range.edited_options"
                          :outlined="
                            !class_date.class_date_range.edited_options
                          "
                          :filled="class_date.class_date_range.edited_options"
                          dense
                          style="position: absolute; z-index: 4"
                          @focus="SelectedStartDate($event)"
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
                          v-model="
                            class_date.class_date_range.start_time_object
                          "
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
                          :outlined="
                            !class_date.class_date_range.edited_options
                          "
                          :filled="class_date.class_date_range.edited_options"
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
                      :disabled="class_date.class_date_range.edited_options"
                      :outlined="!class_date.class_date_range.edited_options"
                      :filled="class_date.class_date_range.edited_options"
                      type="number"
                      :suffix="$t('person')"
                      @focus="$event.target.select()"
                      :rules="students"
                      v-model="class_date.students"
                      :placeholder="$t('specify students who can accept')"
                      color="#ff6b81"
                    ></v-text-field>
                  </v-col>
                  <!-- BUTTONS -->
                  <v-col cols="12" sm="4" class="d-flex align-center">
                    <v-row dense v-if="edited">
                      <v-col cols="12" sm="4" class="mt-5 d-flex align-center">
                        <!-- EDIT -->
                        <v-btn
                          v-if="class_date.class_date_range.edited_options"
                          icon
                          color="#FF6B81"
                          @click="editOptions(class_date)"
                        >
                          <v-icon>mdi-pencil-outline</v-icon>
                        </v-btn>
                        <!-- SAVE UPDATE-->
                        <v-btn
                          icon
                          v-if="
                            !class_date.class_date_range.edited_options &&
                            class_date.class_date_range.day_of_week_id
                          "
                          color="#FF6B81"
                          :disabled="checkDisableTime(class_date)"
                          @click="saveUpdateOption(class_date)"
                        >
                          <v-icon>mdi-content-save-plus</v-icon>
                        </v-btn>
                        <!-- ADD TIME -->
                        <v-btn
                          text
                          v-if="
                            class_date_index ===
                              teach_day.class_date?.length - 1 &&
                            !class_date.class_date_range.edited_options
                          "
                          color="green"
                          @click="addTime(teach_day)"
                        >
                          <v-icon>mdi-timer-plus-outline</v-icon>
                          <!-- {{ $t("add time") }} -->
                        </v-btn>
                        <!-- DEL TIME -->
                        <template
                          v-if="class_date.class_date_range.day_of_week_id"
                        >
                          <v-btn
                            v-if="
                              teach_day.class_date.length > 1 &&
                              !class_date.class_date_range.edited_options
                            "
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
                            <!-- {{ $t("delete time") }} -->
                          </v-btn>
                        </template>
                        <template v-else>
                          <v-btn
                            v-if="
                              teach_day.class_date.length > 1 &&
                              !class_date.class_date_range.edited_options
                            "
                            text
                            color="red"
                            @click="
                              removeTime(teach_day.class_date, class_date_index)
                            "
                          >
                            <!-- <v-icon>22</v-icon> -->
                            <v-icon>mdi-timer-minus-outline</v-icon>
                            <!-- {{ $t("delete time") }} -->
                          </v-btn>
                        </template>
                        <!-- REFRESH -->
                        <v-btn
                          icon
                          v-if="
                            !class_date.class_date_range.edited_options &&
                            class_date.class_date_range.day_of_week_id
                          "
                          color="#FF6B81"
                          @click="refreshOptionFunction(class_date)"
                        >
                          <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>

                    <v-row v-else>
                      <v-col cols="6" class="d-flex align-center">
                        <v-btn
                          :disabled="disable"
                          text
                          v-if="
                            class_date_index ===
                            teach_day.class_date?.length - 1
                          "
                          color="green"
                          @click="addTime(teach_day)"
                        >
                          <v-icon>mdi-timer-plus-outline</v-icon>
                          {{ $t("add time") }}
                        </v-btn>
                      </v-col>
                      <v-col cols="6" class="d-flex align-center">
                        <template
                          v-if="class_date.class_date_range.day_of_week_id"
                        >
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
                  </v-col>
                  <!-- SAVE CREATE NEW COACH &  DEL NEW COACH-->
                  <v-row dense v-if="!teach_day.day_of_week_id && edited">
                    <v-col cols class="d-flex align-center justify-end">
                      <!-- ADD NEW COACH -->
                      <v-btn
                        icon
                        v-if="
                          !teach_day.edited_coach &&
                          teach_day_index ===
                            coach.teach_day_data?.length - 1 &&
                          class_date_index === teach_day.class_date?.length - 1
                        "
                        color="#FF6B81"
                        :disabled="
                          checkDisableAddTeachDay(teach_day, class_date)
                        "
                        @click="
                          FunctionAddNewCoach(coach, teach_day, coach_index)
                        "
                      >
                        <v-icon>mdi-content-save-plus</v-icon>
                      </v-btn>
                      <!-- DEL NEW COACH -->
                      <v-btn
                        icon
                        color="red"
                        v-if="
                          !teach_day.edited_coach &&
                          class_date_index === teach_day.class_date?.length - 1
                        "
                        @click="
                          deleteNewCoach(coach.teach_day_data, teach_day_index)
                        "
                        ><v-icon>mdi-trash-can-outline</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row
                    dense
                    v-if="
                      teach_day.day_of_week_id &&
                      !class_date.class_date_range.day_of_week_id &&
                      class_date_index === teach_day.class_date?.length - 1 &&
                      edited
                    "
                  >
                    <v-col cols class="d-flex align-center justify-end">
                      <v-btn
                        icon
                        color="#FF6B81"
                        @click="saveAddNewOptions(coach, teach_day)"
                        :disabled="checkDisableTime(class_date)"
                      >
                        <v-icon>mdi-book-clock-outline</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-row>
              </template>
            </v-card-text>
          </template>
        </v-card>
      </template>
    </div>
  </div>
</template>
<script>
import LabelCustom from "../label/labelCustom.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
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
    add_time_options: false,
  }),

  created() {
    this.coachs_option = this.coachs;
  },
  mounted() {},
  watch: {},
  computed: {
    ...mapGetters({
      courses_data: "CourseModules/getCoursesData",
      course_data: "CourseModules/getCourseData",
      teach_days: "CourseModules/getTeachDays",
      course_monitors: "CourseMonitorModules/getCourseMonitor",
      coach_data: "CourseModules/getCoachData",
      refresh_teach_day: "CourseModules/getTeachdayData",
      refresh_option: "CourseModules/getOptionData",
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
    // setFunction() {
    //   if (this.course_data.course_id) {
    //     this.GetShortCourseMonitor({
    //       course_id: this.course_data.course_id,
    //     });
    //   }
    //   return "";
    // },
  },
  destroyed() {
    this.ResetStateCourseData();
  },
  methods: {
    ...mapActions({
      // ChangeCourseData: "CourseModules/ChangeCourseData",
      GetTeachDays: "CourseModules/GetTeachDays",
      DeleteDayOfWeek: "CourseModules/DeleteDayOfWeek",
      DeleteTime: "CourseModules/DeleteTime",
      GetCourse: "CourseModules/GetCourse",
      GetShortCourseMonitor: "CourseMonitorModules/GetShortCourseMonitor",
      DeleteCourseCoach: "CourseModules/DeleteCourseCoach",
      UpdateTeachdayCoach: "CourseModules/UpdateTeachdayCoach",
      UpdateOptions: "CourseModules/UpdateOptions",
      AddNewOptions: "CourseModules/AddNewOptions",
      AddNewCoach: "CourseModules/AddNewCoach",
      AddNewTeachDay: "CourseModules/AddNewTeachDay",
      DeleteOPtions: "CourseModules/DeleteOPtions",
      RefreshTeachDay: "CourseModules/RefreshTeachDay",
      RefreshOption: "CourseModules/RefreshOption",
    }),
    ...mapMutations({
      ResetStateCourseData: "CourseModules/ResetStateCourseData",
    }),
    editCoach(items) {
      items.edited_coach = false;
    },
    checkDisableCoach(teach_day) {
      let coach_id = null;
      let teach_days = [];

      this.coach_data?.map((items) => {
        coach_id = items.coach_id;
      });
      teach_days = teach_day.teach_day;

      return !coach_id || teach_days.length === 0;
    },
    checkDisableTime(class_date) {
      let start_time = null;
      let end_time = null;
      let student = 0;

      start_time = class_date.class_date_range?.start_time;
      end_time = class_date.class_date_range?.end_time;
      student = class_date.students > 0;

      return !start_time || !end_time || !student;
    },
    checkDisableAddTeachDay(teach_day, class_date) {
      let coach_id = null;
      let teach_days = [];
      let start_time = null;
      let end_time = null;
      let student = 0;

      this.coach_data?.map((items) => {
        coach_id = items.coach_id;
      });
      teach_days = teach_day.teach_day;
      start_time = class_date.class_date_range?.start_time;
      end_time = class_date.class_date_range?.end_time;
      student = class_date.students > 0;

      return (
        !coach_id ||
        teach_days.length === 0 ||
        !start_time ||
        !end_time ||
        !student
      );
    },
    checkDisableAll() {
      let coach_id = null;
      let teach_days = [];
      let start_time = null;
      let end_time = null;
      let student = 0;

      this.coach_data?.map((items) => {
        (coach_id = items.coach_id),
          items.teach_day_data?.map((item1) => {
            teach_days = item1.teach_day;
            item1.class_date?.map((item2) => {
              start_time = item2.class_date_range?.start_time;
              end_time = item2.class_date_range?.end_time;
              student = item2.students > 0;
            });
          });
      });
      return (
        !coach_id ||
        teach_days.length === 0 ||
        !start_time ||
        !end_time ||
        !student
      );
    },
    saveUpdateCoach(items, teach_day) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to edit teachday"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          let update_payload = {
            coach_id: items.coach_id,
            course_coach_id: items.course_coach_id,
            course_id: items.course_id,
            day_of_week_id: teach_day.day_of_week_id,
            teach_day: teach_day.teach_day.join(","),
            class_open: teach_day.class_open,
          };
          this.UpdateTeachdayCoach({
            payload: update_payload,
            course_id: this.$route.params.course_id,
          });
        } else {
          teach_day.edited_coach = false;
        }
      });
      teach_day.edited_coach = true;
    },
    FunctionAddNewCoach(coach) {
      let teaching_day = [];
      coach.teach_day_data.map((items) => {
        teaching_day.push(items);
      });
      let checked_out = "";
      checked_out = teaching_day.filter((items) => !items.day_of_week_id);

      if (coach.course_coach_id) {
        // ADD NEW TEACH DAY

        Swal.fire({
          icon: "question",
          title: this.$t("do you want to add more teachday"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("cancel"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            let data_payload = {
              coach_id: coach.coach_id, // Placeholder
              coach_name: coach.coach_name, // Placeholder
              course_coach_id: coach.course_coach_id, // Assuming all have the same course_coach_id
              teach_day_data: checked_out.map((teach_day) => ({
                day_of_week_id: null,
                class_open: teach_day.class_open ? true : false,
                teach_day: teach_day.teach_day?.join(","),
                times: teach_day.class_date
                  .filter(
                    (class_date) => !class_date.class_date_range.day_of_week_id
                  )
                  .map((option_date) => ({
                    time_id: null,
                    start_time: option_date.class_date_range.start_time,
                    end_time: option_date.class_date_range.end_time,
                    student_number: option_date.students,
                  })),
              })),
            };
            this.AddNewTeachDay({
              payload: data_payload,
              course_id: this.$route.params.course_id,
            });
          }
        });
      } else {
        // ADD NEW COACH

        Swal.fire({
          icon: "question",
          title: this.$t("do you want to add new coach"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("cancel"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            let data_payload = {
              coach_id: coach.coach_id, // Placeholder
              coach_name: coach.coach_name, // Placeholder
              course_coach_id: null, // Assuming all have the same course_coach_id
              teach_day_data: checked_out.map((teach_day) => ({
                day_of_week_id: null,
                class_open: teach_day.class_open ? true : false,
                teach_day: teach_day.teach_day?.join(","),
                times: teach_day.class_date
                  .filter(
                    (class_date) => !class_date.class_date_range.day_of_week_id
                  )
                  .map((option_date) => ({
                    time_id: null,
                    start_time: option_date.class_date_range.start_time,
                    end_time: option_date.class_date_range.end_time,
                    student_number: option_date.students,
                  })),
              })),
            };
            this.AddNewCoach({
              payload: data_payload,
              course_id: this.$route.params.course_id,
            });
          }
        });
      }
    },
    editOptions(items) {
      items.class_date_range.edited_options = false;
    },
    saveUpdateOption(class_date) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to edit ooption"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          let option_payload = {
            time_id: class_date.class_date_range.time_id,
            start_time: class_date.class_date_range.start_time,
            end_time: class_date.class_date_range.end_time,
            student_number: class_date.students,
            day_of_week_id: class_date.class_date_range.day_of_week_id,
          };
          this.UpdateOptions({
            payload: option_payload,
            course_id: this.$route.params.course_id,
          });
        }
      });
    },
    saveAddNewOptions(coach, teach_day) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to add more option"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          let data_payload = {
            coach_id: coach.coach_id,
            coach_name: coach.coach_name,
            course_coach_id: coach.course_coach_id,
            teach_day_data: [
              {
                day_of_week_id: teach_day.day_of_week_id,
                class_open: teach_day.class_open,
                teach_day: teach_day.teach_day?.join(","),
                times: teach_day.class_date
                  .filter(
                    (class_date) => !class_date.class_date_range.day_of_week_id
                  ) // Only include if day_of_week_id exists
                  .map((option_date) => ({
                    time_id: null,
                    start_time: option_date.class_date_range.start_time,
                    end_time: option_date.class_date_range.end_time,
                    student_number: option_date.students,
                  })),
              },
            ],
          };
          this.AddNewOptions({
            payload: data_payload,
            course_id: this.$route.params.course_id,
            course_coach_id: coach.course_coach_id,
          });
        }
      });
    },
    deleteNewCoach(teach_day, teach_day_index) {
      teach_day.splice(teach_day_index, 1);
    },

    removeCoachCard(coach) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete this coach"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.DeleteCourseCoach({
            course_coach_id: coach.course_coach_id,
            course_id: coach.course_id,
          });
        }
      });
    },
    removeTeachingDay(teach_day) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete teachday"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.DeleteDayOfWeek({
            day_of_week_id: teach_day.day_of_week_id,
            course_id: this.$route.params.course_id,
          });
        }
      });
    },
    async refreshCoach(teach_day, coach) {
      await this.RefreshTeachDay({
        course_id: this.$route.params.course_id,
        day_of_week_id: teach_day.day_of_week_id,
        course_coach_id: teach_day.course_coach_id,
      }).then(() => {
        teach_day.teach_day = this.refresh_teach_day.teach_day;
        coach.coach_id = this.refresh_teach_day.coachId;
      });
    },
    async refreshOptionFunction(class_date) {
      await this.RefreshOption({
        course_id: this.$route.params.course_id,
        time_id: class_date.class_date_range.time_id,
        day_of_week_id: class_date.class_date_range.day_of_week_id,
      });
      class_date.class_date_range.end_time = this.refresh_option.end;
      class_date.class_date_range.start_time = this.refresh_option.start;
      class_date.students = this.refresh_option.maximumStudent;
      // class_date.class_date_range.start_time_object =
    },
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
          parseInt(this?.courses_data?.course_hour_time?.HH) >=
        24
      ) {
        date.end_time_object.HH = `${
          parseInt(date.start_time_object.HH) +
          parseInt(this?.courses_data?.course_hour_time?.HH) -
          24
        }`.padStart(2, "0");
      } else {
        date.end_time_object.HH = `${
          parseInt(date.start_time_object.HH) +
          parseInt(this?.courses_data?.course_hour_time?.HH)
        }`.padStart(2, "0");
      }
      if (
        parseInt(date.start_time_object.mm) +
          parseInt(this?.courses_data?.course_hour_time?.mm) >
        59
      ) {
        date.end_time_object.mm = `${
          parseInt(date.start_time_object.mm) +
          parseInt(this?.courses_data?.course_hour_time?.mm) -
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
          parseInt(this?.courses_data?.course_hour_time?.mm)
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
    removeCoach(index) {
      this.coach_data.splice(index, 1);
    },
    coachsOptions(coach_selected) {
      const selectedCoachIds = this.coach_data.map((coach) => coach.coach_id);
      const availableCoaches = this.coachs.filter(
        (coach) =>
          !selectedCoachIds.includes(coach.accountId) ||
          coach.accountId === coach_selected.coach_id
      );

      return availableCoaches;
    },
    filteredDays(coachIndex, teachDayIndex, state) {
      if (state === "create") {
        const teachDayData = this.coach_data[coachIndex].teach_day_data;
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
      const teach_days_used = this.coach_data[coachIndex].teach_days_used;
      // this.course_data.coachs[coachIndex].teach_days_used;
      const current_teach_day =
        this.coach_data[coachIndex].teach_day_data[teachDayIndex];
      // this.course_data.coachs[coachIndex].teach_day_data[teachDayIndex];
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
      const teachDayData = this.coach_data[coachIndex].teach_day_data;
      // const teachDayData = this.course_data.coachs[coachIndex].teach_day_data;

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
        this.coach_data[coachIndex].disabled_hours = [];
        // this.course_data.coachs[coachIndex].disabled_hours = [];
        const teach_days_used = this.coach_data[coachIndex].teach_days_used;
        // this.course_data.coachs[coachIndex].teach_days_used;
        const current_teach_day =
          this.coach_data[coachIndex].teach_day_data[teachDayIndex];
        // this.course_data.coachs[coachIndex].teach_day_data[teachDayIndex];
        const used_hours = [];
        teach_days_used?.forEach((teach_day) => {
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
        this.coach_data[coachIndex].disabled_hours = used_hours;
        // this.course_data.coachs[coachIndex].disabled_hours = used_hours;
        currentTeachDay.teach_day = selectedDays;
      }
      // this.ChangeCourseData(this.course_data);
    },

    genStartTimeEndTime(value, coach_index, teach_day_index, class_date_index) {
      if (value) {
        const end = moment(value).add(this.course_data.course_hours, "hour");
        this.coach_data[coach_index].teach_day_data[teach_day_index].class_date[
          class_date_index
        ].class_date_range.end_time = end;
        // this.course_data.coachs[coach_index].teach_day_data[
        //   teach_day_index
        // ].class_date[class_date_index].class_date_range.end_time = end;
      }
      // this.ChangeCourseData(this.course_data);
    },
    limitEndTime(value, coach_index, teach_day_index, class_date_index) {
      let start =
        // this.course_data.coachs[coach_index].teach_day_data[teach_day_index]
        this.coach_data[coach_index].teach_day_data[teach_day_index].class_date[
          class_date_index
        ].class_date_range.start_time;
      let end = moment(value);
      if (start.isAfter(end)) {
        const endTime = moment(start).add(
          this.course_data.course_hours,
          "hour"
        );
        // this.course_data.coachs[coach_index].teach_day_data[
        this.coach_data[coach_index].teach_day_data[teach_day_index].class_date[
          class_date_index
        ].class_date_range.end_time = endTime;
      }
      // this.ChangeCourseData(this.course_data);
    },
    findTeachDays(coach_data, coach_index) {
      this.select_coachs.push(coach_data.coach_id);
      this.GetTeachDays(coach_data).then(() => {
        this.coach_data[coach_index].teach_days_used = this.teach_days;
        // this.course_data.coachs[coach_index].teach_days_used = this.teach_days;
      });
      // this.ChangeCourseData(this.course_data);
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
      // this.ChangeCourseData(this.course_data);
    },
    removeTeachDay(data, index) {
      data.splice(index, 1);
      // this.ChangeCourseData(this.course_data);
    },
    addTime(data) {
      data.class_date.push({
        class_date_range: {
          edited_options: false,
          start_time: "",
          start_time_object: { HH: "", mm: "" },
          menu_start_time: false,
          end_time: "",
          end_time_object: { HH: "", mm: "" },
          menu_end_time: false,
        },
        students: 0,
      });
      // this.ChangeCourseData(this.course_data);
    },
    removeTime(data, index) {
      data.splice(index, 1);
      // this.ChangeCourseData(this.course_data);
    },
    removeTimeData(teach_day, class_date) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete this teaching time?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.DeleteOPtions({
            course_id: this.$route.params.course_id,
            time_id: class_date,
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
