<template>
  <v-container>
    <header-page :breadcrumbs="breadcrumbs"></header-page>
    <v-card flat>
      <v-card-title>
        <v-row dense>
          <v-col cols="auto">
            <span class="text-[#ff6b81]">{{
              $i18n.locale == "th"
                ? coach_leave.fullNameTh
                : coach_leave.fullNameEn
            }}</span>
          </v-col>
          <v-col cols="auto">
            <v-chip
              :color="
                coach_leave.status === 'pending'
                  ? '#FFF9E8'
                  : coach_leave.status === 'approved'
                  ? '#F0F9EE'
                  : coach_leave.status === 'cancel'
                  ? '#e8e8e8'
                  : '#ffeeee'
              "
              :text-color="
                coach_leave.status === 'pending'
                  ? '#FCC419'
                  : coach_leave.status === 'approved'
                  ? '#58A144'
                  : coach_leave.status === 'cancel'
                  ? '#636363'
                  : '#f00808'
              "
              class="chips"
            >
              {{
                coach_leave.status == "pending"
                  ? this.$t("waiting for approval")
                  : coach_leave.status === "approved"
                  ? this.$t("approved")
                  : coach_leave.status === "cancel"
                  ? this.$t("cancel")
                  : this.$t("refuse")
              }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle v-if="coach_leave.status === 'reject'">
        <v-row>
          <v-col>
            <span class="text-[#999999]">{{ $t("reason for refusal") }}: </span>
            <span class="text-[#333333] font-semibold">{{
              coach_leave.remark_reject ? coach_leave.remark_reject : "-"
            }}</span>
          </v-col>
        </v-row>
      </v-card-subtitle>
      <v-card-text>
        <v-card class="mb-3">
          <v-card-text>
            <v-row dense>
              <v-col>
                <span class="text-[#999999]">{{ $t("leave date") }}:</span>
                <div class="text-[#2F3542] font-semibold mr-2">
                  {{
                    `${GenDate(coach_leave.startDate)} - ${GenDate(
                      coach_leave.endDate
                    )}`
                  }}
                </div>
              </v-col>
              <v-col>
                <span class="text-[#999999] ml-2">{{ $t("leave type") }}:</span>
                <div class="text-[#2F3542] font-semibold ml-2">
                  {{ $t(coach_leave.leaveType) }}
                </div>
              </v-col>
              <v-col>
                <span class="text-[#999999]">{{ $t("period") }}: </span>
                <div class="text-[#2F3542] font-semibold">
                  {{
                    periods.filter((v) => v.value == coach_leave.period)
                      .length > 0
                      ? periods.filter((v) => v.value == coach_leave.period)[0]
                          .label
                      : "-"
                  }}
                </div>
              </v-col>
              <v-col>
                <span class="text-[#999999]"
                  >{{ $t("date of request") }}:
                </span>
                <div class="text-[#2F3542] font-semibold">
                  {{ GenDate(coach_leave.createdDate) }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <div
          class="mb-3"
          v-for="(date, index_date) in coach_leave.dates"
          :key="`${index_date}-course`"
        >
          <v-row dense>
            <v-col cols="auto">
              <v-icon color="#ff6b81">mdi-calendar-outline</v-icon>
            </v-col>
            <v-col class="font-bold text-lg">
              {{ date.date ? GenDate(new Date(date.date)) : "-" }}
            </v-col>
          </v-row>
          <v-card
            class="mb-3"
            flat
            v-for="(course, index) in date.courses"
            :key="index"
          >
            <v-card-text class="rounded-md border">
              <v-radio-group readonly v-model="course.type" row>
                <v-radio
                  :label="$t('have a substitute teacher')"
                  color="#ff6b81"
                  value="teach"
                ></v-radio>
                <v-radio
                  :label="$t('there is no substitute teacher')"
                  color="#ff6b81"
                  value="date"
                ></v-radio>
              </v-radio-group>
              <v-row dense>
                <v-col cols="auto">
                  <v-icon color="#ff6b81"
                    >mdi-card-account-details-outline</v-icon
                  >
                </v-col>
                <v-col class="font-bold text-lg"> {{ $t("courses") }} </v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-card flat>
                <v-card-text class="border border-1 rounded-lg">
                  <v-row dense>
                    <v-col>
                      <div>{{ $t("course name") }}</div>
                      <div class="font-semibold pl-2">
                        {{
                          $i18n.locale == "th"
                            ? course.courseNameTh
                            : course.courseNameEn
                        }}
                        <!-- {{ `${course.courseNameEn}` }} -->
                      </div>
                    </v-col>
                  </v-row>
                  <v-row dense v-if="course.type === 'teach'">
                    <v-col>
                      <div>{{ $t("substitute teacher") }}</div>
                      <div class="font-semibold pl-2">
                        <v-select
                          dense
                          :disabled="
                            coach_leave.status === 'pending' ? false : true
                          "
                          v-model="course.substituteCoachId"
                          outlined
                          hide-details
                          item-value="accountId"
                          item-text="fullNameTh"
                          @change="selectCoach(course)"
                          :items="
                            coachs.filter(
                              (v) => v.accountId !== coach_leave.coachId
                            )
                          "
                        >
                        </v-select>
                      </div>
                    </v-col>
                    <v-col v-if="coach_leave.status === 'approved'">
                      {{ $t("period") }}

                      <v-row>
                        <v-col>
                          <v-text-field
                            dense
                            readonly
                            outlined
                            color="#ff6b81"
                            v-model="course.compensationStartTime"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                            dense
                            readonly
                            outlined
                            color="#ff6b81"
                            v-model="course.compensationEndTime"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row dense v-else-if="course.type === 'date'">
                    <v-col>
                      {{ $t("compensation date") }}
                      <v-menu
                        :disabled="
                          coach_leave.status === 'pending' ? false : true
                        "
                        v-model="course.menuCompensationDate"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            dense
                            outlined
                            hide-details
                            :value="GenDate(course.compensationDate_str)"
                            readonly
                            :placeholder="$t('choose a compensation date')"
                            v-bind="attrs"
                            v-on="on"
                            color="#ff6b81"
                          >
                            <template v-slot:append>
                              <v-icon
                                :color="
                                  course.compensationDate ? '#FF6B81' : ''
                                "
                                >mdi-calendar</v-icon
                              >
                            </template>
                          </v-text-field>
                        </template>
                        <v-date-picker
                          :disabled="
                            coach_leave.status === 'pending' ? false : true
                          "
                          color="#ff6b81"
                          @input="InputDate(course.compensationDate, course)"
                          :min="new Date().toISOString()"
                          v-model="course.compensationDate"
                          locale="th-TH"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col>
                      {{ $t("period") }}
                      <v-row
                        dense
                        class="mb-3"
                        v-if="coach_leave.status === 'pending'"
                      >
                        <v-col class="px-2" cols="12" sm="6">
                          <v-text-field
                            outlined
                            color="#ff6b81"
                            item-color="#ff6b81"
                            dense
                            :style="`width:${width()}px;`"
                            style="
                              position: absolute;
                              display: block;
                              z-index: 4;
                            "
                            @focus="
                              SelectedStartTime(
                                $event,
                                course.compensationStartTime
                              )
                            "
                            v-model="course.compensationStartTime"
                          >
                          </v-text-field>
                          <VueTimepicker
                            class="time-picker-hidden"
                            advanced-keyboard
                            hide-clear-button
                            v-model="course.compensationStartTimeObj"
                            color="#ff6b81"
                            item-color="#ff6b81"
                            close-on-complete
                            @change="
                              ChengeTimeMin(
                                course.compensationStartTimeObj,
                                index,
                                index_date,
                                'start'
                              )
                            "
                            :hour-range="
                              checkHour(
                                coach_leave.period,
                                course.compensationDate,
                                course,
                                'start'
                              )
                            "
                          ></VueTimepicker>
                        </v-col>
                        <v-col class="px-2" cols="12" sm="6">
                          <v-text-field
                            outlined
                            dense
                            :style="`width:${width()}px;`"
                            style="
                              position: absolute;
                              display: block;
                              z-index: 4;
                            "
                            @focus="
                              SelectedStartTime(
                                $event,
                                course.compensationEndTime
                              )
                            "
                            v-model="course.compensationEndTime"
                          >
                          </v-text-field>
                          <VueTimepicker
                            class="time-picker-hidden"
                            advanced-keyboard
                            hide-clear-button
                            v-model="course.compensationEndTimeObj"
                            close-on-complete
                            @change="
                              ChengeTimeMin(
                                course.compensationEndTimeObj,
                                index,
                                index_date,
                                'end'
                              )
                            "
                            :hour-range="
                              checkHour(
                                coach_leave.period,
                                course.compensationDate,
                                course,
                                'end'
                              )
                            "
                          ></VueTimepicker>
                        </v-col>
                      </v-row>
                      <v-row v-else>
                        <v-col>
                          <v-text-field
                            dense
                            readonly
                            outlined
                            color="#ff6b81"
                            v-model="course.compensationStartTime"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                            dense
                            readonly
                            outlined
                            color="#ff6b81"
                            v-model="course.compensationEndTime"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </div>
        <v-card class="mb-3">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" class="text-[#999999] font-bold">
                {{ $t("reason for leave") }}
              </v-col>
              <v-col class="text-[#333333] pl-5">{{
                coach_leave.remark
              }}</v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" class="font-bold">{{ $t("attachments") }}</v-col>
              <v-col>
                <template v-if="coach_leave.attachments.length > 0">
                  <v-card
                    flat
                    class="mb-3"
                    v-for="(file, index) of coach_leave.attachments"
                    :key="`${index}-file`"
                    @click="dowloadFile(file)"
                  >
                    <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
                      <v-row>
                        <v-col cols="auto" class="pr-2">
                          <imgFileType :mime_type="file.fileType"></imgFileType>
                        </v-col>
                        <v-col class="px-2">
                          <span class="font-bold">{{ file.fileName }}</span>
                          <br />
                          <span class="text-caption"
                            >{{ $t("file size") }} :
                            {{ (file.size / 1000000).toFixed(2) }} MB</span
                          >
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-row dense v-if="coach_leave.status === 'pending'">
          <v-col align="right">
            <v-btn
              @click="show_disapproved = true"
              class="mr-3"
              outlined
              color="#ff6b81"
            >
              {{ $t("refuse") }}
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              @click="updateStatus('approved')"
              depressed
              dark
              color="#ff6b81"
            >
              {{ $t("approved") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog
      v-if="show_disapproved"
      persistent
      v-model="show_disapproved"
      :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
    >
      <v-card>
        <v-container>
          <v-row dense>
            <v-col align="right">
              <v-btn icon @click="closeDisapprovedDialog()"
                ><v-icon color="#ff6b81">mdi-close</v-icon></v-btn
              >
            </v-col>
          </v-row>
          <v-card-title>
            <v-row dense>
              <v-col align="center">
                <span class="text-[#D1392B] font-bold">{{
                  $t("refuse leave request")
                }}</span>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col align="center">
                <v-img
                  width="175"
                  height="185"
                  src="@/assets/coachLeave/disapproved.png"
                ></v-img>
              </v-col>
            </v-row>
            <v-form ref="user_form" v-model="user_form">
              <v-row>
                <v-col>
                  <label-custom :text="$t('refusal reason')"></label-custom>
                  <v-textarea
                    v-model="coach_leave.remark_reject"
                    outlined
                    dense
                    :placeholder="`${$t('enter details')}...`"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
            <v-row dense>
              <v-col align="right">
                <v-btn
                  @click="closeDisapprovedDialog()"
                  text
                  color="#ff6b81"
                  dark
                  >{{ $t("no") }}</v-btn
                >
              </v-col>

              <v-col>
                <v-btn
                  depressed
                  color="#ff6b81"
                  @click="updateStatus('reject')"
                  :disabled="!coach_leave.remark_reject"
                  >{{ $t("agree") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import headerPage from "@/components/header/headerPage.vue";
import Swal from "sweetalert2";
import { mapActions, mapGetters } from "vuex";
import LabelCustom from "@/components/label/labelCustom.vue";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import imgFileType from "@/components/file_type/imgFileType.vue";

export default {
  name: "leaveDetail",
  components: { headerPage, LabelCustom, VueTimepicker, imgFileType },
  data: () => ({
    user_form: false,
    item: { status: "pending" },
    // column: [
    //   {
    //     text: "ชื่อคอร์ส",
    //     align: "start",
    //     sortable: false,
    //     value: "courseNameTh",
    //   },
    //   {
    //     text: "ชื่อผู้แทน",
    //     align: "start",
    //     sortable: false,
    //     value: "coach",
    //     width: 400,
    //   },
    // ],
    show_disapproved: false,
  }),
  created() {
    this.GetCoach();
    this.GetLeavesDetail({ coach_leave_id: this.$route.params.coachleave_id });
  },
  mounted() {},
  computed: {
    ...mapGetters({
      coach_leave: "CoachModules/getCoachLeave",
      coachs: "CourseModules/getCoachs",
      coach_leaves_is_loading: "CoachModules/getCoachLeavesIsLoading",
    }),

    periods() {
      return [
        { label: this.$t("full day leave"), value: "full" },
        { label: this.$t("morning leave"), value: "morning" },
        { label: this.$t("afternoon leave"), value: "afternoon" },
      ];
    },

    breadcrumbs() {
      return [
        { text: this.$t("leaves"), to: "LeaveList" },
        { text: this.$t("details"), to: "" },
      ];
    },
  },

  methods: {
    ...mapActions({
      GetLeavesDetail: "CoachModules/GetLeavesDetail",
      GetCoach: "CourseModules/GetCoachs",
      updateStatusCoachLeaveAndCoach:
        "CoachModules/updateStatusCoachLeaveAndCoach",
    }),
    GenDate(date) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(date).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        options
      );
    },
    ChengeTimeMin(time, index_course, index_date, type) {
      if (time.mm === "") {
        time.mm = "00";
      }
      if (type === "start") {
        this.coach_leave.dates[index_date].courses[
          index_course
        ].compensationStartTime = `${time.HH}:${time.mm}`;
      } else {
        this.coach_leave.dates[index_date].courses[
          index_course
        ].compensationEndTime = `${time.HH}:${time.mm}`;
      }
    },
    checkHour(period, date, course, type) {
      if (date) {
        if (
          new Date(date) >= new Date(this.coach_leave.startDate) &&
          new Date(date) <= new Date(this.coach_leave.endDate)
        ) {
          if (this.periods.filter((v) => v.value === period).length > 0) {
            let hrs = [];
            let start = this.periods.filter((v) => v.value === period)[0].start;
            let end = this.periods.filter((v) => v.value === period)[0].end;
            if (type && type === "end") {
              if (course.compensationStartTimeObj.HH) {
                for (let hr = 0; hr < 24; hr++) {
                  if (
                    hr > parseInt(course.compensationStartTimeObj.HH) &&
                    hr <= end
                  ) {
                    hrs.push(hr);
                  }
                }
              }
            } else {
              for (let hr = 0; hr < 24; hr++) {
                if (hr >= start && hr <= end) {
                  hrs.push(hr);
                }
              }
            }
            return hrs;
          }
        } else {
          let hrs = [];
          if (type && type === "end") {
            if (course.compensationStartTimeObj.HH) {
              for (let hr = 0; hr < 24; hr++) {
                if (hr > parseInt(course.compensationStartTimeObj.HH)) {
                  hrs.push(hr);
                }
              }
            }
          } else {
            for (let hr = 0; hr < 24; hr++) {
              hrs.push(hr);
            }
          }
          return hrs;
        }
      }
    },
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 99;
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
    SelectedStartTime(e) {
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode
        .getElementsByClassName("time-picker-hidden")[0]
        .getElementsByTagName("input")[0]
        .focus();
    },
    InputDate(date, course) {
      course.compensationDate_str = date;
    },
    closeDisapprovedDialog() {
      this.show_disapproved = false;
    },
    selectCoach(coach_selected) {
      let coach_detail = this.coachs.filter(
        (v) => v.accountId === coach_selected.substituteCoachId
      )[0];
      coach_selected.substitutefirstNameEn = coach_detail.firstNameEng;
      coach_selected.substitutefirstNameTh = coach_detail.firstNameTh;
      coach_selected.substitutelastNameEn = coach_detail.lastNameEng;
      coach_selected.substitutelastNameTh = coach_detail.lastNameTh;
      coach_selected.substitutefullNameEn = coach_detail.fullNameEh;
      coach_selected.substitutefullNameTh = coach_detail.fullNameTh;
    },
    dowloadFile(file) {
      window.open(file.attachmentFileUrl, "_blank");
    },
    updateStatus(status) {
      if (status == "reject") {
        this.$refs.user_form.validate();
      } else if (status == "approved") {
        this.user_form = true;
        if (this.user_form) {
          let text =
            status === "reject"
              ? this.$t("do you want to reject this leave?")
              : this.$t("do you want to approve this leave?");
          Swal.fire({
            icon: "question",
            text: text,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: this.$t("agree"),
            cancelButtonText: this.$t("no"),
          }).then(async (result) => {
            if (result.isConfirmed) {
              this.coach_leave.status = status;
              this.updateStatusCoachLeaveAndCoach({
                coach_leave_id: this.coach_leave.coachLeaveId,
                coach_leave_data: this.coach_leave,
              }).then(() => {
                this.closeDisapprovedDialog();
              });
            }
          });
        }
      }
      if (this.user_form) {
        let text =
          status === "reject"
            ? this.$t("do you want to reject this leave?")
            : this.$t("do you want to approve this leave?");
        Swal.fire({
          icon: "question",
          text: text,
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("no"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.coach_leave.status = status;
            this.updateStatusCoachLeaveAndCoach({
              coach_leave_id: this.coach_leave.coachLeaveId,
              coach_leave_data: this.coach_leave,
            }).then(() => {
              this.closeDisapprovedDialog();
            });
          }
        });
      }
    },
  },
};
</script>
  