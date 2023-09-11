<template>
  <v-container>
    <loading-overlay :loading="course_list_is_loading"></loading-overlay>

    <div v-if="my_course_detail.countCheckIn == 0">
      <v-card-text
        class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
      >
        <span class="text-lg font-bold">
          <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
           {{ $t("no check in") }}
        </span>
      </v-card-text>
    </div>
    <div v-if="my_course_detail.countCheckIn >= 1">
      <v-card outlined class="mb-3">
        <v-card-text>
          <v-row dense>
            <!-- img -->
            <v-col cols="12" sm="2">
              <v-img
                max-height="180"
                :src="
                  my_course_detail.courseImg
                    ? my_course_detail.courseImg
                    : require(`@/assets/course/default_course_img.svg`)
                "
              ></v-img>
            </v-col>
            <!-- detail -->
            <v-col cols="12" sm="7">
              <v-row dense>
                <v-col class="text-lg font-bold">
                  {{
                    $i18n.locale == "th"
                      ? my_course_detail.courseNameTh
                      : my_course_detail.courseNameEng
                  }}
                </v-col>
              </v-row>
              <v-row dense>
                <v-col class="text-slate-400">
                  <span class="mdi mdi-account">{{ $t("coach") }}:</span>
                  {{
                    $i18n.locale == "th"
                      ? my_course_detail.coachName
                      : my_course_detail.coachNameEng
                  }}

                  <!-- {{
                    !my_course_detail.coachName
                      ? "-"
                      : my_course_detail.coachName
                  }} -->
                </v-col>
              </v-row>
              <v-row dense>
                <v-col class="text-slate-400">
                  <span class="mdi mdi-account">{{ $t("learner") }} :</span>
                  {{
                    $i18n.locale == "th"
                      ? my_course_detail.student.firstNameTh
                      : my_course_detail.student.firstNameEng
                  }}
                  {{
                    $i18n.locale == "th"
                      ? my_course_detail.student.lastNameTh
                      : my_course_detail.student.lastNameEng
                  }}

                  <!-- {{
                    !my_course_detail.student
                      ? "-"
                      : my_course_detail.student.firstNameTh
                  }}
                  {{
                    !my_course_detail.student
                      ? "-"
                      : my_course_detail.student.lastNameTh
                  }} -->
                </v-col>
              </v-row>
              <v-row dense>
                <v-col class="text-slate-400">
                  <span class="mdi mdi-account">{{ $t("listed by") }} :</span>
                  {{
                    $i18n.locale == "th"
                      ? my_course_detail.createdBy.firstNameTh
                      : my_course_detail.createdBy.firstNameEng
                  }}
                  {{
                    $i18n.locale == "th"
                      ? my_course_detail.createdBy.lastNameTh
                      : my_course_detail.createdBy.lastNameEng
                  }}

                  <!-- {{
                    !my_course_detail.createdBy
                      ? "-"
                      : my_course_detail.createdBy.firstNameTh
                  }}
                  {{
                    !my_course_detail.createdBy
                      ? "-"
                      : my_course_detail.createdBy.lastNameTh
                  }} -->
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <v-chip dark color="#F9B320">
                    <span
                      v-for="(day_list, index_day) in my_course_detail.dates
                        .day"
                      :key="index_day"
                    >
                      {{
                        dayOfWeekName(day_list) == ""
                          ? "-"
                          : dayOfWeekName(day_list)
                      }}
                    </span>
                    {{ my_course_detail.time.start }} -
                    {{ my_course_detail.time.end }} {{ $t("o'clock") }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-col>
            <!-- circle -->
            <v-col cols="12" sm="3" class="d-flex align-center justify-center">
              <v-progress-circular
                :rotate="-90"
                :size="90"
                :width="10"
                color="#ff6b81"
                :value="
                  (my_course_detail.countCheckIn /
                    my_course_detail.dates.totalDay) *
                  100
                "
              >
                {{ my_course_detail.countCheckIn }} /
                {{ my_course_detail.dates.totalDay }} <br />{{ $t("time") }}
              </v-progress-circular>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row dense class="mb-3">
        <v-col cols="6" align="start">
          <div class="text-lg font-bold">{{ $t("study information") }}</div>
        </v-col>
      </v-row>
      <div
        class="mb-3"
        v-for="(potential, index) in my_course_detail.potential"
        :key="index"
      >
        <v-card class="rounded-lg" outlined>
          <v-card-text>
            <v-row dense class="mb-2">
              <v-col cols="2" sm="1" align="center">
                <img src="@/assets/student_course/certificates.png" />
              </v-col>
              <v-col class="text-lg font-bold" cols="6">{{
                $t("potential assessment")
              }}</v-col>
            </v-row>
            <v-card flat color="#FBF3F5">
              <v-card-text>
                <v-row dense>
                  <v-col>
                    <b>{{ $t("developmental level") }}:</b>
                    <span
                      :class="`text-[${
                        evolution_options.filter(
                          (v) => v.value === potential.evolution
                        )[0]
                      }]`"
                    >
                      {{
                        evolution_options.filter(
                          (v) => v.value === potential.evolution
                        ).length > 0
                          ? evolution_options.filter(
                              (v) => v.value === potential.evolution
                            )[0].label
                          : "-"
                      }}
                    </span>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    <b>{{ $t("interest level") }}:</b>
                    {{ potential.interest }}
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" align="start">
                    <b>{{ $t("comments from the coach") }}:</b>
                    {{ potential.remark }}
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <b>{{ $t("attachments") }}: </b>
                    <v-card
                      @click="openFile(file.attachmentFiles)"
                      flat
                      class="mb-3"
                      v-for="(
                        file, index_file
                      ) in potential.attachmentPotential"
                      :key="index_file"
                    >
                      <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
                        <v-row>
                          <v-col align="center">
                            <imgFileType
                              :mime_type="file.filesType"
                            ></imgFileType>
                          </v-col>
                          <v-col cols="12" sm="10" align="start">
                            <span class="font-bold">{{
                              file.originalFilesName
                            }}</span
                            ><br />
                            <span class="text-caption"
                              >{{ $t("file size") }} :
                              {{ (file.filesSize / 1000000).toFixed(2) }}
                              MB</span
                            >
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </div>
      <div
        v-for="(day_list, index_day) in my_course_detail.checkIn"
        :key="index_day"
      >
        <v-card outlined class="rounded-lg my-5">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" v-if="checked == true">
                <v-checkbox
                  v-model="checked[index]"
                  color="#FF6B81"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-icon color="#FF6B81" style="margin-top: -4px"
                  >mdi-calendar-month-outline</v-icon
                >

                <span class="text-lg font-bold">
                  {{ genDate(day_list.date) }}
                </span>
              </v-col>
              <!-- ตรงเวลา -->
              <v-col cols="3" align="end">
                <v-card flat>
                  <v-card-text
                    v-if="day_list.status"
                    class="pa-1 rounded-xl text-center"
                    :class="
                      check_in_status_options.filter(
                        (v) => v.value === day_list.status
                      ).length > 0
                        ? check_in_status_options.filter(
                            (v) => v.value === day_list.status
                          )[0].class
                        : ''
                    "
                  >
                    <span
                      :class="
                        check_in_status_options.filter(
                          (v) => v.value === day_list.status
                        ).length > 0
                          ? check_in_status_options.filter(
                              (v) => v.value === day_list.status
                            )[0].class
                          : ''
                      "
                    >
                      {{
                        check_in_status_options.filter(
                          (v) => v.value === day_list.status
                        ).length > 0
                          ? check_in_status_options.filter(
                              (v) => v.value === day_list.status
                            )[0].label
                          : "-"
                      }}
                    </span>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col class="text-slate-400">
                {{ $t("class time") }}
                {{
                  !my_course_detail.time.start
                    ? "-"
                    : my_course_detail.time.start
                }}
                -
                {{
                  !my_course_detail.time.end ? "-" : my_course_detail.time.end
                }}
                น.
              </v-col>
            </v-row>
            <v-row dense>
              <!-- พัฒนาการ -->
              <v-col cols="12" sm="4" align="start">
                <div v-if="day_list.assessment.evolution">
                  <b>{{ $t("developmental level") }}:</b>
                  <span>
                    {{
                      evolution_options.filter(
                        (v) => v.value === day_list.assessment.evolution
                      ).length > 0
                        ? evolution_options.filter(
                            (v) => v.value === day_list.assessment.evolution
                          )[0].label
                        : "-"
                    }}
                  </span>
                </div>
              </v-col>
              <!-- ความสนใจ -->
              <v-col cols="12" sm="auto" align="start">
                <div v-if="day_list.assessment.interest">
                  <b> {{ $t("interest level") }}:</b>
                  <span>
                    {{
                      interest_options.filter(
                        (v) => v.value === day_list.assessment.interest
                      ).length > 0
                        ? interest_options.filter(
                            (v) => v.value === day_list.assessment.interest
                          )[0].label
                        : "-"
                    }}
                  </span>
                </div>
              </v-col>
            </v-row>
            <div align="center">
              <v-btn color="#FF6B81" text @click="showAssessment(index_day)">
                {{ $t("see more") }}
                <v-icon>{{
                  day_list.show ? "mdi-chevron-up" : "mdi-chevron-down"
                }}</v-icon>
              </v-btn>
            </div>
            <v-expand-transition>
              <div v-show="day_list.show">
                <!-- <pre>{{ day_list.dailySummary }}</pre> -->
                <label class="font-bold mb-2 text-[#FF6B81]">
                  {{ $t("teaching summary notes") }}
                </label>
                <!-- บันทึกการสอน -->
                <v-row dense>
                  <v-col cols="12" class="indent-3">
                    <b>{{ $t("teaching notes") }} : </b>
                    {{
                      day_list.dailySummary.summary
                        ? day_list.dailySummary.summary
                        : $t("no recording")
                    }}
                  </v-col>
                </v-row>
                <!-- พัฒนาการ / การบ้าน  -->
                <v-row dense>
                  <v-col cols="12" class="indent-3">
                    <b>{{ $t("development / homework") }} : </b>
                    {{
                      day_list.dailySummary.homework
                        ? day_list.dailySummary.homework
                        : $t("no development/homework")
                    }}
                  </v-col>
                </v-row>
                <!-- ไฟล์แนบจากบันทึกสรุปการสอน -->
                <v-row dense>
                  <v-col cols="12" class="indent-3">
                    <b
                      >{{
                        $t("attached file from teaching summary notes")
                      }}
                      :</b
                    ><span v-if="day_list.dailySummary.attachment == ''">
                      {{ $t("no attachments from teaching summary notes") }}
                    </span>

                    <v-card
                      v-else
                      @click="openFile(file.attachmentFiles)"
                      flat
                      class="mb-3"
                      v-for="(file, index_file) in day_list.dailySummary
                        .attachment"
                      :key="index_file"
                    >
                      <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
                        <v-row dense>
                          <v-col cols="12" sm="1" align="center">
                            <imgFileType
                              :mime_type="file.filesType"
                            ></imgFileType>
                          </v-col>
                          <v-col cols="12" sm="10" align="start">
                            <span class="font-bold">{{
                              file.originalFilesName
                            }}</span
                            ><br />
                            <span class="text-caption"
                              >{{ $t("file size") }} :
                              {{ (file.filesSize / 1000000).toFixed(2) }}
                              MB</span
                            >
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <label class="font-bold mb-2 text-[#FF6B81]">
                  {{ $t("assess students") }}
                </label>
                <v-row dense>
                  <!-- ความคิดเห็น -->
                  <v-col class="indent-3">
                    <b>{{ $t("comments") }}:</b>
                    {{
                      !day_list.assessment.remark
                        ? $t("no comment")
                        : day_list.assessment.remark
                    }}
                  </v-col>
                </v-row>
                <!-- ไฟล์แนบจากประเมินนักเรียน -->
                <v-row dense>
                  <v-col cols="12" class="indent-3">
                    <b>{{ $t("attachment from student assessment") }} :</b>
                    <span v-if="day_list.assessment.attachment == ''">
                      {{ $t("no attachment from student assessment") }}
                    </span>
                    <v-card
                      @click="openFile(file.attachmentFiles)"
                      flat
                      class="mb-3"
                      v-for="(file, index_file) in day_list.assessment
                        .attachment"
                      :key="index_file"
                    >
                      <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
                        <v-row dense>
                          <v-col cols="12" sm="1" align="center">
                            <imgFileType
                              :mime_type="file.filesType"
                            ></imgFileType>
                          </v-col>
                          <v-col cols="12" sm="10" align="start">
                            <span class="font-bold">{{
                              file.originalFilesName
                            }}</span
                            ><br />
                            <span class="text-caption"
                              >{{ $t("file size") }} :
                              {{ (file.filesSize / 1000000).toFixed(2) }}
                              MB</span
                            >
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { dateFormatter } from "@/functions/functions";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import imgFileType from "@/components/file_type/imgFileType.vue";

export default {
  components: {
    loadingOverlay,
    imgFileType,
  },
  data: () => ({
    show: false,
    checked: false,
    dialog_show: false,
    show_id: "",
    item_data: "",
    evolution_options: [
      { label: "⭐⭐⭐⭐⭐", value: "very good", color: "#ff6b81" },
      { label: "⭐⭐⭐⭐", value: "good", color: "#58A144" },
      { label: "⭐⭐⭐", value: "adjust", color: "#FCC419" },
    ],
    interest_options: [
      { label: "⭐⭐⭐⭐⭐", value: "very good", color: "#ff6b81" },
      { label: "⭐⭐⭐⭐", value: "good", color: "#58A144" },
      { label: "⭐⭐⭐", value: "adjust", color: "#FCC419" },
    ],
    relations: [],
  }),
  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    if (localStorage.getItem("relations")) {
      this.relations = JSON.parse(localStorage.getItem("relations"));
    } else {
      this.relations = null;
    }

    this.show_id = this.$route.params.course_id;
    if (this.relations && this.relations.length > 0) {
      for (const item_data of this.relations) {
        this.GetMyCourseDetail({
          account_id: item_data.student.studentId,
          course_id: this.$route.params.course_id,
        });
      }
    } else {
      this.GetMyCourseDetail({
        account_id: this.user_detail.account_id,
        course_id: this.$route.params.course_id,
      });
    }
    if (
      this.my_course_detail.checkIn &&
      this.my_course_detail.checkIn.length !== 0
    ) {
      this.my_course_detail.checkIn.map((val) => {
        val["show"] = false;
      });
    }
  },
  mounted() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "course information"
    );
    if (
      this.my_course_detail.checkIn &&
      this.my_course_detail.checkIn.length !== 0
    ) {
      this.my_course_detail.checkIn.map((val) => {
        val["show"] = false;
      });
    }
  },
  methods: {
    ...mapActions({
      GetMyCourseDetail: "MyCourseModules/GetMyCourseDetail",
      GetAll: "ProfileModules/GetAll",
    }),
    download() {
      this.checked = true;
    },
    closedownload() {
      this.checked = false;
    },
    openFile(file) {
      window.open(file, "_blank");
    },
    dayOfWeekName(days) {
      const daysOfWeek = [
        "อาทิตย์",
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัสบดี",
        "ศุกร์",
        "เสาร์",
      ];
      const dayNames = [];
      for (let i = 0; i < days.length; i++) {
        const dayIndex = days[i];
        dayNames.push(daysOfWeek[dayIndex]);
      }
      return dayNames.join(" - ");
    },

    showImg(item) {
      return `${process.env.VUE_APP_URL}/api/v1/files/${item}`;
    },

    genDate(date) {
      return dateFormatter(new Date(date), "DW DD MMT YYYYT");
    },

    checkInStatusOptions(day) {
      for (const item of this.my_course_detail.checkIn.filter(
        (v) => new Date(v.date) === new Date(day)
      )) {
        return item.status;
      }
    },

    showAssessment(key) {
      this.my_course_detail.checkIn = this.my_course_detail.checkIn.map(
        (val, index) => {
          if (key === index) {
            val.show = !val.show;
          } else {
            val.show = false;
          }
          return val;
        }
      );
    },
  },
  computed: {
    ...mapGetters({
      my_course_detail: "MyCourseModules/getMyCourseDetail",
      profile_user: "ProfileModules/getProfileUser",
      course_list_is_loading: "MyCourseModules/getCourseListIsLoading",
    }),

    pdfFiles() {
      return this.attachment.filter((file) => file.attFiles.endsWith(".pdf"));
    },
    check_in_status_options() {
      return [
        {
          label: this.$t("punctual"),
          value: "punctual",
          class: "text-[#58A144] bg-[#F0F9EE]",
          color: "#58A144",
          bg_color: "#F0F9EE",
        },
        {
          label: this.$t("late"),
          value: "late",
          class: "text-[#FCC419] bg-[#FFF9E8]",
          color: "#FCC419",
          bg_color: "#FFF9E8",
        },
        {
          label: this.$t("leave"),
          value: "leave",
          class: "text-[#43A4F5] bg-[#F0F6FB]",
          color: "#43A4F5",
          bg_color: "#F0F6FB",
        },
        {
          label: this.$t("emergency leave"),
          value: "emergency leave",
          class: "text-[#43A4F5] bg-[#CFE2F3]",
          color: "#43A4F5",
          bg_color: "#CFE2F3",
        },
        {
          label: this.$t("absent"),
          value: "absent",
          class: "text-[#F03D3E] bg-[#faeaea]",
          color: "#F03D3E",
          bg_color: "#faeaea",
        },
      ];
    },
  },
};
</script>

<style scoped></style>
