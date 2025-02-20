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
        <v-card :class="`bg-[${color}] mb-5`" :key="coach_index">
          <v-card-text>
            <!-- HEAD -->
            <v-row dense>
              <v-col cols="12" class="d-flex align-center justify-end">
                <v-btn icon color="red" @click="removeCoachCard(coach)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" class="d-flex align-center justify-end">
                <v-switch
                  inset
                  @click="checkStudyByDay($event, teach_day)"
                  :disabled="coach.edited_coach"
                  v-model="coach.class_open"
                  color="green"
                  class="mr-10"
                  hide-details
                  :label="$t('teaching')"
                ></v-switch>
              </v-col>
            </v-row>
            <!-- BODY -->
            <v-row dense class="flex align-center justify-end">
              <!-- COACH -->
              <v-col cols="12" sm="4">
                <label-custom required :text="$t('coach')"></label-custom>
                <v-autocomplete
                  dense
                  :disabled="
                    coach.edited_coach ? coach.edited_coach : coach.added_option
                  "
                  :outlined="!coach.edited_coach || !coach.added_option"
                  :filled="coach.edited_coach || coach.added_option"
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
              <!-- TEACH DAY -->
              <v-col cols="12" sm="4">
                <label-custom
                  required
                  :text="$t('teaching day')"
                ></label-custom>
                <v-autocomplete
                  dense
                  :disabled="
                    coach.edited_coach ? coach.edited_coach : coach.added_option
                  "
                  :outlined="!coach.edited_coach || !coach.added_option"
                  :filled="
                    coach.edited_coach ? coach.edited_coach : coach.added_option
                  "
                  chips
                  :rules="class_date"
                  deletable-chips
                  item-color="#ff6b81"
                  multiple
                  color="#FF6B81"
                  :items="filteredDays()"
                  :item-text="$i18n.locale == 'th' ? 'label' : 'label_en'"
                  item-value="value"
                  :placeholder="$t('please select a time')"
                  v-model="coach.teach_day"
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
                      :disabled="coach.edited_coach || coach.added_option"
                      color="#ffeeee"
                      text-color="#ff6b81"
                      @click:close="removeChip(item, coach.teach_day)"
                    >
                      <strong>{{
                        $i18n.locale == "th" ? item.label : item.label_en
                      }}</strong>
                    </v-chip>
                  </template>
                </v-autocomplete>
              </v-col>
              <!-- BUTTON -->
              <v-col cols="12" sm="4" v-if="edited">
                <v-row dense v-if="coach.day_of_week_id">
                  <v-col cols="12" v-if="coach.edited_coach">
                    <!-- EDIT BUTTON -->
                    <v-col cols="12" v-if="coach.edited_coach">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            color="#FF6B81"
                            dark
                            v-bind="attrs"
                            v-on="on"
                            :class="{ 'disabled-icon': disable_coach }"
                            @click="!disable_coach && editCoach(coach)"
                          >
                            mdi-pencil-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("edit") }}</span>
                      </v-tooltip>
                    </v-col>
                  </v-col>
                  <v-col cols="12" sm="8" v-else>
                    <!-- ADD TEACH DAY -->
                    <v-tooltip
                      bottom
                      v-if="
                        lastCoachOccurrences[coach.coach_id] === coach_index
                      "
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="green"
                          dark
                          class="mr-2"
                          v-bind="attrs"
                          v-on="on"
                          @click="addTeachDay(coach)"
                        >
                          mdi-calendar-plus-outline
                        </v-icon>
                      </template>
                      <span>{{ $t("add teaching day") }}</span>
                    </v-tooltip>
                    <!-- DELETE -->
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="#FF6B81"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          class="mr-2"
                          @click="removeTeachingDay(coach)"
                        >
                          mdi-trash-can-outline
                        </v-icon>
                      </template>
                      <span>{{ $t("delete teaching day") }}</span>
                    </v-tooltip>
                    <!-- REFRESH -->
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="#FF6B81"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          class="mr-2"
                          @click="refreshCoach(coach)"
                        >
                          mdi-refresh
                        </v-icon>
                      </template>
                      <span>{{ $t("refresh") }}</span>
                    </v-tooltip>
                    <!-- SAVE UPDATE -->
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          class="mr-2"
                          color="#FF6B81"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          @click="saveUpdateCoach(coach)"
                        >
                          mdi-content-save
                        </v-icon>
                      </template>
                      <span>{{ $t("save teaching day") }}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
                <v-row dense v-if="!coach.day_of_week_id">
                  <!-- ADD TEACH DAY -->
                  <v-tooltip
                    bottom
                    v-if="lastCoachOccurrences[coach.coach_id] === coach_index"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="green"
                        dark
                        class="m-2"
                        v-bind="attrs"
                        v-on="on"
                        @click="addTeachDay(coach)"
                      >
                        mdi-calendar-plus-outline
                      </v-icon>
                    </template>
                    <span>{{ $t("add teaching day") }}</span>
                  </v-tooltip>
                </v-row>
              </v-col>
              <v-col cols="12" sm="4" v-if="!edited"> </v-col>
            </v-row>
            <!-- FOTTER -->
            <v-row dense class="flex align-center justify-end">
              <!-- TIME START - TIME END -->
              <v-col cols="12" sm="5">
                <label-custom required :text="$t('period')"></label-custom>
                <v-row dense class="mb-3">
                  <v-col class="px-2" cols="12" sm="6">
                    <v-text-field
                      :disabled="coach.edited_options"
                      :outlined="!coach.edited_options"
                      :filled="coach.edited_options"
                      dense
                      style="position: absolute; z-index: 4"
                      @focus="SelectedStartDate($event)"
                      :rules="start_time"
                      v-model="coach.start_time"
                    ></v-text-field>
                    <VueTimepicker
                      class="time-picker-hidden"
                      :hour-range="checkHour(coach_index)"
                      :minute-range="checkMinute(coach.start_time)"
                      hide-clear-button
                      advanced-keyboard
                      v-model="coach.start_time_object"
                      @change="ChangeStartDate(coach, coach_index)"
                    >
                    </VueTimepicker>
                  </v-col>
                  <v-col class="px-2" cols="12" sm="6">
                    <v-text-field
                      disabled
                      :outlined="!coach.edited_options"
                      :filled="coach.edited_options"
                      dense
                      style="position: absolute; z-index: 4"
                      :rules="end_time"
                      v-model="coach.end_time"
                    ></v-text-field>
                    <VueTimepicker
                      class="time-picker-hidden"
                      disabled
                      hide-clear-button
                      advanced-keyboard
                      v-model="coach.end_time_object"
                      close-on-complete
                    ></VueTimepicker>
                  </v-col>
                </v-row>
              </v-col>
              <!-- STUDENT -->
              <v-col cols="12" sm="3" class="mt-3">
                <label-custom
                  required
                  :text="$t('acceptable students')"
                ></label-custom>
                <v-text-field
                  class="input-text-right"
                  dense
                  :disabled="coach.edited_options"
                  :outlined="!coach.edited_options"
                  :filled="coach.edited_options"
                  type="number"
                  :suffix="$t('person')"
                  @focus="$event.target.select()"
                  :rules="students"
                  v-model="coach.students"
                  :placeholder="$t('specify students who can accept')"
                  color="#ff6b81"
                ></v-text-field>
              </v-col>
              <!-- BUTTON -->
              <v-col cols="12" sm="4" class="d-flex align-center" v-if="edited">
                <v-row dense v-if="coach.day_of_week_id">
                  <!-- EDIT -->
                  <v-col cols="12" v-if="coach.edited_options">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="#FF6B81"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          class="ml-2"
                          :class="{ 'disabled-icon': add_time_options }"
                          @click="!add_time_options && editOptions(coach)"
                        >
                          mdi-pencil-outline
                        </v-icon>
                      </template>
                      <span>{{ $t("edit") }}</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="8" v-else>
                    <!-- ADD TIME -->
                    <v-tooltip
                      bottom
                      v-if="
                        lastCoachOccurrences[coach.coach_id] === coach_index
                      "
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="green"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          class="mx-2"
                          @click="addTime(coach)"
                        >
                          mdi-timer-plus-outline
                        </v-icon>
                      </template>
                      <span>{{ $t("add time") }}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
                <v-row dense v-if="!coach.day_of_week_id">
                  <v-col cols="12" class="d-flex align-center">
                    <!-- ADD TIME -->
                    <v-tooltip
                      bottom
                      v-if="
                        lastCoachOccurrences[coach.coach_id] === coach_index
                      "
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="green"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          class="mt-4"
                          @click="addTime(coach)"
                        >
                          mdi-timer-plus-outline
                        </v-icon>
                      </template>
                      <span>{{ $t("add time") }}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- SAVE BUTTON -->
            <v-row
              dense
              class="flex align-center justify-end"
              v-if="!coach.day_of_week_id && edited"
            >
              <v-col cols class="d-flex align-center justify-end">
                <!-- SAVE UPDATE -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-if="
                        lastCoachOccurrences[coach.coach_id] === coach_index
                      "
                      color="#FF6B81"
                      v-bind="attrs"
                      v-on="on"
                      :disabled="checkDisableAddTeachDay(coach)"
                      @click="
                        FunctionAddNewCoach(coach, teach_day, coach_index)
                      "
                    >
                      <v-icon>mdi-content-save-all</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("save") }}</span>
                </v-tooltip>
                <!-- DELETE -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="#FF6B81"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      class="mr-2"
                      @click="removeTeachingDay(coach)"
                    >
                      mdi-trash-can-outline
                    </v-icon>
                  </template>
                  <span>{{ $t("delete teaching day") }}</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-card-text>
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
    disable_coach: false,
    disable_teach_day: false,
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
    lastCoachOccurrences() {
      let lastOccurrences = {};
      this.coach_data.forEach((coach, index) => {
        lastOccurrences[coach.coach_id] = index;
      });
      return lastOccurrences;
    },
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
      this.disable_teach_day = true;
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
    checkDisableAddTeachDay(coach) {
      let coach_id = null;
      let teach_days = [];
      let start_time = null;
      let end_time = null;
      let student = 0;

      this.coach_data?.map((items) => {
        coach_id = items.coach_id;
      });
      teach_days = coach.teach_day;
      start_time = coach?.start_time;
      end_time = coach?.end_time;
      student = coach.students > 0;

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
    saveUpdateCoach(items) {
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
            day_of_week_id: items.day_of_week_id,
            teach_day: items.teach_day.join(","),
            class_open: items.class_open,
          };
          this.UpdateTeachdayCoach({
            payload: update_payload,
            course_id: this.$route.params.course_id,
          });
        } else {
          items.edited_coach = false;
        }
      });
      items.edited_coach = true;
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
      items.edited_options = false;
      this.disable_coach = true;
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
    removeTeachingDay(items) {
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
            day_of_week_id: items.day_of_week_id,
            course_id: this.$route.params.course_id,
          });
        }
      });
    },
    async refreshCoach(coach) {
      await this.RefreshTeachDay({
        course_id: this.$route.params.course_id,
        day_of_week_id: coach.day_of_week_id,
        course_coach_id: coach.course_coach_id,
      }).then(() => {
        coach.teach_day = this.refresh_teach_day.teach_day;
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
    // checkMinute(teach_day, hours) {
    //   if (teach_day.length > 1) {
    //     let timeused = [];
    //     let timeMinUsed = [];
    //     timeused = teach_day.map((v) => {
    //       return {
    //         start_time: v.class_date_range.start_time_object,
    //         end_time: v.class_date_range.end_time_object,
    //       };
    //     });
    //     if (timeused.filter((v) => v.end_time.HH === hours).length > 0) {
    //       timeused
    //         .filter((v) => v.end_time.HH === hours)
    //         .forEach((time) => {
    //           if (hours === time.end_time.HH) {
    //             let min_end = parseInt(time.end_time.mm);
    //             for (let min = min_end; min < 60; min++) {
    //               timeMinUsed.push(min);
    //             }
    //           }
    //         });
    //     } else {
    //       for (let min = 0; min < 60; min++) {
    //         timeMinUsed.push(min);
    //       }
    //     }
    //     return timeMinUsed;
    //   }
    // },
    // checkHour(teach_day, timeindex) {
    //   let timeused = [];
    //   let timeusedHH = [];
    //   timeused = teach_day.map((v) => {
    //     return {
    //       start_time: v.class_date_range.start_time_object,
    //       end_time: v.class_date_range.end_time_object,
    //     };
    //   });
    //   timeused.forEach((time, index) => {
    //     if (timeindex !== index) {
    //       if (time.start_time.HH) {
    //         timeusedHH.push(parseInt(time.start_time.HH));
    //       }
    //     }
    //   });
    //   return generateTimeArrayHours(timeusedHH);
    // },

    checkMinute(hours) {
      if (this.coach_data?.length > 1) {
        let timeused = [];
        let timeMinUsed = [];
        timeused = this.coach_data?.map((v) => {
          return {
            start_time: v.start_time_object,
            end_time: v.end_time_object,
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

    checkHour(coach_index) {
      // let timeused = [];
      let timeusedHH = [];

      // Extract teach_day of the current coach
      const currentTeachDays = this.coach_data[coach_index]?.teach_day || [];

      this.coach_data.forEach((item, index) => {
        if (index !== coach_index) {
          const hasCommonTeachDay = item.teach_day.some((day) =>
            currentTeachDays.includes(day)
          );
          if (hasCommonTeachDay) {
            if (item.start_time_object?.HH) {
              timeusedHH.push(parseInt(item.start_time_object.HH));
            }
          }
        }
      });

      // If there are common teach_day values, use time filtering
      if (timeusedHH.length > 0) {
        return generateTimeArrayHours(timeusedHH);
      }

      // Otherwise, return normal range 00 - 23
      return Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    },

    // checkHour(coach_index) {
    //   let timeused = [];
    //   let timeusedHH = [];
    //   timeused = this.coach_data?.map((v) => {
    //     return {
    //       start_time: v.start_time_object,
    //       end_time: v.end_time_object,
    //     };
    //   });
    //   timeused.forEach((time, index) => {
    //     if (coach_index !== index) {
    //       if (time.start_time.HH) {
    //         timeusedHH.push(parseInt(time.start_time.HH));
    //       }
    //     }
    //   });
    //   console.log("timeused :>> ", timeused);

    //   return generateTimeArrayHours(timeusedHH);
    // },

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
    // filteredDays(coachIndex, teachDayIndex, state) {
    //   if (state === "create") {
    //     const teachDayData = this.coach_data[coachIndex].teach_day_data;
    //     const currentTeachDay = teachDayData[teachDayIndex];
    //     const usedDays = [];
    //     teachDayData.forEach((teachDay) => {
    //       if (teachDay !== currentTeachDay) {
    //         usedDays.push(...teachDay.teach_day);
    //       }
    //     });

    //     return this.days_confix.filter((day) => !usedDays.includes(day.value));
    //   } else {
    //     return this.days_confix;
    //   }
    // },

    filteredDays() {
      return this.days_confix;
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
    addTeachDay(coach) {
      const newEntry = {
        added_option: false,
        added_teach_day: true,
        course_id: null,
        coach_id: coach.coach_id,
        course_coach_id: null,
        coach_name: null,
        day_of_week_id: null,
        class_open: true,
        teach_day: [],
        study_start_date: null,
        time_id: null,
        start_time: null,
        start_time_object: {
          HH: "",
          mm: "",
        },
        menu_start_time: false,
        end_time: null,
        end_time_object: {
          HH: "",
          mm: "",
        },
        menu_end_time: false,
        edited_options: false,
        students: 0,
      };

      // Find the last index where coach_id matches "675177212817577"
      const lastIndex = this.coach_data
        .map((item) => item.coach_id)
        .lastIndexOf(coach.coach_id);

      // If found, insert the new entry after that index
      if (lastIndex !== -1) {
        this.coach_data.splice(lastIndex + 1, 0, newEntry);
      } else {
        // If no match found, push it to the end
        this.coach_data.push(newEntry);
      }
    },
    removeTeachDay(data, index) {
      data.splice(index, 1);
      // this.ChangeCourseData(this.course_data);
    },
    testFunc(coach) {
      this.coach_data.map((item) => item.coach_id).lastIndexOf(coach.coach_id);
    },
    addTime(coach) {
      const newEntry = {
        added_option: true,
        course_id: null,
        coach_id: coach.coach_id,
        course_coach_id: null,
        coach_name: null,
        day_of_week_id: null,
        class_open: true,
        teach_day: coach.teach_day,
        study_start_date: null,
        time_id: null,
        start_time: null,
        start_time_object: {
          HH: "",
          mm: "",
        },
        menu_start_time: false,
        end_time: null,
        end_time_object: {
          HH: "",
          mm: "",
        },
        menu_end_time: false,
        edited_options: false,
        students: 0,
      };

      // Find the last index where coach_id matches "675177212817577"
      const lastIndex = this.coach_data
        .map((item) => item.coach_id)
        .lastIndexOf(coach.coach_id);

      // If found, insert the new entry after that index
      if (lastIndex !== -1) {
        this.coach_data.splice(lastIndex + 1, 0, newEntry);
      } else {
        // If no match found, push it to the end
        this.coach_data.push(newEntry);
      }
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
<style scoped>
.disabled-icon {
  pointer-events: none;
  opacity: 0.5; /* Optional: visually indicate disabled */
}
</style>
