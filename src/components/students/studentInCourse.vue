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
          {{ $t("search for student name, coach name") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <!-- <v-card> -->
      <v-row dense class="mx-5 my-10">
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
            @change="filterStudents"
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
        <v-col cols="10" class="my-5" align-self="center">
          <span class="font-bold">
            {{ $t("first name") + " - " + $t("last name") }}
          </span>
          : {{ studentName }}
        </v-col>
        <v-col cols="2" align="start" class="my-5" align-self="center">
          <v-btn
            text
            @click="
              $router.push({
                name: 'UserDetail',
                params: {
                  account_id: studentId,
                  action: 'view',
                  from: 'courseDetail',
                },
              })
            "
            class="px-1"
            color="#ff6b81"
          >
            <v-icon> mdi-clipboard-text-search-outline </v-icon>
            {{ $t("view profile") }}
          </v-btn>
        </v-col>
        <pre>{{ getCheckInId }}</pre>
        <!-- TABLE -->
        <v-col cols="12">
          <v-data-table
            class="header-table rounded-lg"
            :headers="columnStudents"
            :items="filter_student_data"
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
            <template v-slot:[`item.evaluation`]="{ item }">
              <v-btn
                text
                class="px-1"
                color="#ff6b81"
                :disabled="!item.checkInStudentId"
                @click="showDialogAssessment(item)"
              >
                <v-icon>mdi-check-decagram-outline </v-icon>
                {{ $t("view evaluation") }}
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
    <student-evaluation
      v-if="evaluationBool"
      :statusBool="evaluationBool"
      :checkInId="this.getCheckInId"
      :date="this.getDate"
      @input="evaluationBool = $event"
    >
    </student-evaluation>
  </v-dialog>
</template>
  
  <script>
import { mapGetters, mapActions } from "vuex";
import studentEvaluation from "@/components/students/studentEvaluation.vue";

export default {
  components: { studentEvaluation },
  props: {
    statusBool: {
      type: Boolean,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    students: {},
    studentId: "",
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
    getCheckInId: "",
    getDate: "",
  }),
  computed: {
    ...mapGetters({
      students_data: "UserModules/getStudentsData",
      filter_student_data: "CourseModules/getFilterStudentData",
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
  },
  mounted() {
    this.GetStudentData();
  },
  methods: {
    ...mapActions({
      GetStudentData: "UserModules/GetStudentData",
      GetFilterStudentData: "CourseModules/GetFilterStudentData",
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

      this.studentId = items.userOneId;

      await this.GetFilterStudentData({
        student_id: items.userOneId,
        course_id: this.courseId,
      });
    },
    closeDialog() {
      this.dialogStatus = false; // Close the dialog
      this.filter_student_data = [];
      this.students_data = [];
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
  },
};
</script>
  