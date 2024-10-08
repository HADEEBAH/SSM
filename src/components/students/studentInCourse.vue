<template>
  <v-dialog
    v-model="dialogStatus"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="#ff6b81">
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t("search for student name, coach name in course")
          }}{{
            $i18n.locale === "th"
              ? course_data?.course_name_th
              : ` ${course_data?.course_name_en}`
          }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card-text>
        <v-row dense class="mx-5 my-5">
          <v-col cols="12">
            <v-autocomplete
              dense
              v-model="students"
              :items="students_data"
              outlined
              hide-details
              :item-text="getStudentName"
              return-object
              :placeholder="$t('search for student name, coach name')"
              @input="filterStudents"
              color="#ff6b81"
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title>
                    {{ $t("no data found") }}
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title>
                    <span>
                      {{
                        $i18n.locale == "th"
                          ? `${item.firstNameTh} ${item.lastNameTh}`
                          : `${item.firstNameEng} ${item.lastNameEng}`
                      }}
                    </span>
                  </v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row dense class="mx-5 my-5">
          <v-col cols="12" md="6" align-self="center">
            <span class="font-bold">
              {{ $t("first name") + " - " + $t("last name") }}
            </span>
            : {{ students.studentId ? studentName : "-" }}
          </v-col>
          <v-col cols="12" md="6" align="end">
            <v-row dense justify="end">
              <v-col cols="6" v-if="students.studentId">
                <!-- View profile -->
                <v-btn
                  text
                  :to="{
                    name: 'UserDetail',
                    params: {
                      account_id: getStudentId,
                      action: 'view',
                      from: 'courseDetail',
                    },
                  }"
                  class="px-1"
                  color="#ff6b81"
                >
                  <v-icon> mdi-clipboard-text-search-outline </v-icon>
                  {{ $t("view profile") }}
                </v-btn>
                <!-- View Potential Evaluation -->
                <!-- <v-btn
                  v-if="students.studentId && studentType == 'potential'"
                  text
                  class="px-1"
                  color="#ff6b81"
                  @click="showPotentialDialog"
                >
                  <v-icon>mdi-check-decagram-outline </v-icon>
                  {{ $t("view evaluation") }}
                </v-btn> -->
              </v-col>
            </v-row>
          </v-col>

          <!-- TABLE -->
          <v-col cols="12" v-if="loadingTable" class="pa-2">
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="#ff6b81"
              ></v-progress-circular>
            </v-row>
          </v-col>

          <v-col cols="12" v-else>
            <v-data-table
              class="header-table rounded-lg"
              :headers="
                studentType === 'inpotential'
                  ? columnStudents
                  : columnStudentsPotential
              "
              :items="
                studentType === 'inpotential'
                  ? filter_student_data
                  : filter_potential_student
              "
              v-if="students.studentId"
            >
              <template v-slot:no-data>
                <v-row dense>
                  <v-col align="center">
                    {{ $t("no data found") }}
                  </v-col>
                </v-row>
              </template>

              <template v-slot:[`item.classDate`]="{ item }">
                <!-- <pre>{{ item }}</pre> -->
                {{ GenDate(item.scheduleDate) }}
              </template>
              <template v-slot:[`item.classTime`]="{ item }">
                <!-- <pre>{{ item }}</pre> -->
                {{ item.timeStart }} - {{ item.timeEnd }}
              </template>
              <template v-slot:[`item.status`]="{ item }">
                <v-col cols v-if="!item.checkInStudentId">
                  <v-chip color="red" outlined>
                    {{ $t("no check in") }}
                  </v-chip>
                </v-col>
                <v-col cols v-else-if="!item.status">
                  <v-chip color="orange" outlined>
                    {{ $t("no status has been selected yet") }}
                  </v-chip>
                </v-col>
                <v-col cols v-else>
                  <v-chip
                    align="center"
                    class="font-bold"
                    :color="
                      check_in_status_options.filter(
                        (v) => v.value === item.status
                      )[0].bg_color
                    "
                    :style="`color:${
                      check_in_status_options.filter(
                        (v) => v.value === item.status
                      )[0].color
                    }`"
                    v-if="
                      check_in_status_options.filter(
                        (v) => v.value === item.status
                      )?.length > 0
                    "
                  >
                    {{ $t(item.status) }}
                  </v-chip>
                </v-col>
              </template>
              <template
                v-if="studentType === 'inpotential'"
                v-slot:[`item.evaluation`]="{ item }"
              >
                <v-btn
                  text
                  class="px-1"
                  color="#ff6b81"
                  :disabled="
                    !item.checkInStudentId ||
                    item.status == 'absent' ||
                    item.status == 'emergency leave' ||
                    item.status == 'leave' ||
                    !item.status
                  "
                  @click="showDialogAssessment(item)"
                >
                  <v-icon>mdi-check-decagram-outline </v-icon>
                  {{ $t("view evaluation") }}
                </v-btn>
              </template>
              <template
                v-slot:[`item.name`]="{ item }"
                v-if="studentType === 'potential'"
              >
                {{
                  $i18n.locale == "th"
                    ? `${item.firstNameTh} ${item.lastNameTh}`
                    : `${item.firstNameEng} ${item.lastNameEng}`
                }}
              </template>
              <template
                v-slot:[`item.period`]="{ item }"
                v-if="studentType === 'potential'"
              >
                {{
                  item.optionName
                    ? $i18n.locale == "th"
                      ? `${item.optionName}`
                      : `${item.optionNameEn}`
                    : "-"
                }}
              </template>
              <template
                v-slot:[`item.number`]="{ item }"
                v-if="studentType === 'potential'"
              >
                {{ `${item.countCheckIn} / ${item.totalPotential}` }}
              </template>
              <template
                v-if="studentType === 'potential'"
                v-slot:[`item.potentEvaluation`]="{ item }"
              >
                <v-btn
                  text
                  class="px-1"
                  color="#ff6b81"
                  @click="showPotentialDialog(item)"
                >
                  <v-icon>mdi-check-decagram-outline </v-icon>
                  {{ $t("view evaluation") }}
                </v-btn>
              </template>
            </v-data-table>
            <!-- NO DATA -->
            <v-data-table
              class="header-table rounded-lg"
              :headers="
                studentType === 'inpotential'
                  ? columnStudents
                  : columnStudentsPotential
              "
              :items="no_data"
              v-else
            >
              <template v-slot:no-data>
                <v-row dense>
                  <v-col align="center">
                    {{ $t("no data found") }}
                  </v-col>
                </v-row>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <student-evaluation
      v-if="evaluationBool && studentType == 'inpotential'"
      :statusBool="evaluationBool"
      :checkInId="this.getCheckInId"
      :date="this.getDate"
      @input="evaluationBool = $event"
    >
    </student-evaluation>
    <potential-evaluation
      v-if="potentEvaluationBool && studentType == 'potential'"
      :statusBool="potentEvaluationBool"
      :checkInId="this.getPotentialId"
      @input="potentEvaluationBool = $event"
    >
    </potential-evaluation>
  </v-dialog>
</template>
  
  <script>
import { mapGetters, mapActions } from "vuex";
import studentEvaluation from "@/components/students/studentEvaluation.vue";
import PotentialEvaluation from "./potentialEvaluation.vue";

export default {
  components: { studentEvaluation, PotentialEvaluation },
  props: {
    statusBool: {
      type: Boolean,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    studentType: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    students: {},
    getStudentId: "",
    studentName: "",
    check_in_status_options: [
      {
        label: "punctual",
        value: "punctual",
        color: "#58A144",
        bg_color: "#F0F9EE",
      },
      { label: "late", value: "late", color: "#FCC419", bg_color: "#FFF9E8" },
      { label: "leave", value: "leave", color: "#43A4F5", bg_color: "#CFE2F3" },
      {
        label: "emergency leave",
        value: "emergency leave",
        color: "#43A4F5",
        bg_color: "#CFE2F3",
      },
      {
        label: "absent",
        value: "absent",
        color: "#F03D3E",
        bg_color: "#F4CCCC",
      },
    ],
    evaluationBool: false,
    potentEvaluationBool: false,
    getCheckInId: "",
    potentGetCheckInId: "",
    getDate: "",
    getPotentialId: "",
    loadingTable: false,
    noDataPotential: [],
    noDataInPotential: [],
    no_data: [],
  }),
  computed: {
    ...mapGetters({
      students_data: "UserModules/getStudentsData",
      filter_student_data: "CourseModules/getFilterStudentData",
      filter_potential_student: "CourseModules/getFilterPotentialStudent",
      course_data: "CourseModules/getCourseData",
    }),
    dialogStatus: {
      get() {
        return this.statusBool;
      },
      set(val) {
        this.$emit("input", val); // Emit input event to update parent component
      },
    },

    columnStudents() {
      return [
        {
          text: this.$t("no."),
          align: "center",
          sortable: false,
          value: "index",
        },

        {
          text: this.$t("class date"),
          align: "center",
          sortable: false,
          value: "classDate",
        },
        {
          text: this.$t("class time"),
          align: "center",
          sortable: false,
          value: "classTime",
        },
        {
          text: this.$t("coach name"),
          align: "center",
          sortable: false,
          value: "coachName",
        },
        {
          text: this.$t("status"),
          align: "center",
          sortable: false,
          value: "status",
        },
        {
          text: this.$t("view evaluation"),
          align: "center",
          sortable: false,
          value: "evaluation",
        },
      ];
    },
    columnStudentsPotential() {
      return [
        {
          text: this.$t("no."),
          align: "center",
          sortable: false,
          value: "index",
        },

        {
          text: this.$t("first name - last name"),
          align: "center",
          sortable: false,
          value: "name",
        },
        {
          text: this.$t("period"),
          align: "center",
          sortable: false,
          value: "period",
        },
        {
          text: this.$t("number of times"),
          align: "center",
          sortable: false,
          value: "number",
        },
        {
          text: this.$t("view evaluation"),
          align: "center",
          sortable: false,
          value: "potentEvaluation",
        },
      ];
    },
  },
  mounted() {
    this.GetStudentData({ course_id: this.courseId, type: this.studentType });
  },
  methods: {
    ...mapActions({
      GetStudentData: "UserModules/GetStudentData",
      GetFilterStudentData: "CourseModules/GetFilterStudentData",
      GetFilterPotentialStudent: "CourseModules/GetFilterPotentialStudent",
    }),
    getStudentName(item) {
      return this.$i18n.locale === "th"
        ? `${item.firstNameTh} ${item.lastNameTh}`
        : `${item.firstNameEng} ${item.lastNameEng}`;
    },
    async filterStudents(items) {
      this.studentName =
        this.$i18n.locale === "th"
          ? `${items?.firstNameTh} ${items?.lastNameTh}`
          : `${items?.firstNameEng} ${items?.lastNameEng}`;

      this.getStudentId = await items.studentId;
      if (this.studentType == "inpotential") {
        await this.getAPIFilterStudent();
      } else if (this.studentType == "potential") {
        await this.getAPIFilterPotentialStudent();
      }
    },
    async getAPIFilterStudent() {
      this.loadingTable = true;
      await this.GetFilterStudentData({
        student_id: this.getStudentId,
        course_id: this.courseId,
      });
      this.loadingTable = false;
    },
    async getAPIFilterPotentialStudent() {
      this.loadingTable = true;
      await this.GetFilterPotentialStudent({
        course_id: this.courseId,
        student_id: this.getStudentId,
      });
      this.loadingTable = false;
    },
    closeDialog() {
      this.dialogStatus = false; // Close the dialog
    },
    GenDate(date) {
      return new Date(date).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    },
    async showDialogAssessment(item) {
      this.getCheckInId = await item.checkInStudentId;
      this.getDate = await item.scheduleDate;
      this.evaluationBool = true;
    },
    async showPotentialDialog(items) {
      // this.getPotentialId = "e5e61153-bcdb-4234-b759-528df58b40ae";
      this.getPotentialId = await items.checkInPotentialId;
      this.potentEvaluationBool = true;

      // console.log("filter_student_data :>> ", this.filter_student_data);
    },
  },
};
</script>
  