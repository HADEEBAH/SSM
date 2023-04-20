<template>
  <v-container>
    <loading-overlay :loading="course_list_is_loading"></loading-overlay>

    <pre>{{ my_course_detail.checkIn }}</pre>
    ----------------------------------
    <pre>{{ check_in_detail }}</pre>
    <!-- {{ check_in_detail }} -->
    <!-- <pre>{{ day_list }}</pre> -->

    <!-- <div v-if="type_selected == 'students_course'"> -->
    <!-- @click="$router.push({ name: 'StudentCourse', params:{course_id: item.courseId }})" -->

    <div v-if="my_course_detail.countCheckIn == 0">
      <v-card-text
        class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
      >
        <span class="text-lg font-bold">
          <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
          ยังไม่มีการเช็คอิน
        </span>
      </v-card-text>
    </div>

    <div v-else>
      <v-card class="my-10 drop-shadow-lg">
        <v-row dense>
          <!-- img -->
          <v-col cols="12" sm="2">
            <v-col
              style="
                display: block;
                margin-left: auto;
                margin-right: auto;
                width: 100%;
                margin-top: 10%;
              "
            >
              <!-- <img src="../../../assets/student_course/download.png" /> -->
              <!-- {{ student_data.courseImg }} -->
              <v-img
                :src="
                  my_course_detail.courseImg
                    ? showImg(my_course_detail.courseImg)
                    : defaultImageUrl
                "
              ></v-img>
            </v-col>
          </v-col>
          <!-- detail -->
          <v-col cols="12" sm="6">
            <v-col class="text-lg font-bold">
              {{
                !my_course_detail.courseNameTh
                  ? "-"
                  : my_course_detail.courseNameTh
              }}
            </v-col>
            <v-col class="text-slate-400">
              {{
                !my_course_detail.courseNameEng
                  ? "-"
                  : my_course_detail.courseNameEng
              }}
            </v-col>
            <v-col class="text-slate-400">
              <span class="mdi mdi-account">โค้ช :</span>
              {{
                !my_course_detail.coachName ? "-" : my_course_detail.coachName
              }}
            </v-col>

            <v-col class="text-slate-400">
              <span class="mdi mdi-account">ผู้เรียน :</span>
              <!-- {{
                !my_course_detail.student.firstNameTh
                  ? "-"
                  : my_course_detail.student.firstNameTh
              }}
              {{
                !my_course_detail.student.lastNameTh
                  ? "-"
                  : my_course_detail.student.lastNameTh
              }} -->
              {{
                !my_course_detail.student
                  ? "-"
                  : my_course_detail.student.firstNameTh
              }}
              {{
                !my_course_detail.student
                  ? "-"
                  : my_course_detail.student.lastNameTh
              }}
            </v-col>

            <v-col class="text-slate-400">
              <span class="mdi mdi-account">ทำรายการโดย :</span>
              <!-- {{ my_course_detail.createdBy.lastNameTh}} -->
              <!-- {{
                !my_course_detail.createdBy.firstNameTh
                  ? "-"
                  : my_course_detail.createdBy.firstNameTh
              }}
              {{
                !my_course_detail.createdBy.lastNameTh
                  ? "-"
                  : my_course_detail.createdBy.lastNameTh
              }} -->
              {{
                !my_course_detail.createdBy
                  ? "-"
                  : my_course_detail.createdBy.firstNameTh
              }}
              {{
                !my_course_detail.createdBy
                  ? "-"
                  : my_course_detail.createdBy.lastNameTh
              }}
            </v-col>

            <v-col>
              <v-card color="yellow" class="rounded-lg text-center">
                <span
                  v-for="(day_list, index_day) in my_course_detail.dates.day"
                  :key="index_day"
                >
                  {{
                    dayOfWeekName(day_list) == ""
                      ? "-"
                      : dayOfWeekName(day_list)
                  }}
                </span>
                {{ my_course_detail.time.start }} -
                {{ my_course_detail.time.end }} น.
              </v-card>
            </v-col>
          </v-col>

          <!-- circle -->
          <v-col cols="12" sm="4" class="pt-6" align="center">
            <v-col>
              <!-- {{ item.courseNameEn }} -->
              <v-progress-circular
                :rotate="-90"
                :size="90"
                :width="10"
                color="#ff6b81"
                :value="
                  (my_course_detail.dates.count /
                    my_course_detail.dates.totalDay) *
                  100
                "
              >
                {{ my_course_detail.dates.count }} /
                {{ my_course_detail.dates.totalDay }} <br />ครั้ง
              </v-progress-circular>
            </v-col>
          </v-col>
        </v-row>
      </v-card>
      <!-- </div> -->
      <!-- </div> -->
      <!-- </v-card> -->

      <!-- <div class="text-lg font-bold">ข้อมูลการเรียน</div> -->

      <v-row>
        <v-col cols="6" align="start">
          <div class="text-lg font-bold">ข้อมูลการเรียน</div>
        </v-col>
        <!-- <v-col cols="6" align="end">
          <div class="text-lg pink--text">เลือกทั้งหมด</div>
        </v-col> -->
      </v-row>

      <!-- v-if=" my_course_detail.checkIn == my_course_detail.dates.totalDay" -->
      <!-- <v-card
        class="pa-2"
        v-if="my_course_detail.checkIn == my_course_detail.dates.totalDay"
      >
        <v-row>
          <v-col cols="2" sm="1">
            <img src="../../../assets/student_course/certificates.png" />
          </v-col>
          <v-col class="text-lg font-bold" cols="8">ผลประเมินศักยาภาพ</v-col>
          <v-col cols="2">
            <v-card
              class="rounded-xl text-center"
              style="color: #58a144; background-color: #f0f9ee"
            >
              ตรงเวลา
            </v-card>
          </v-col>
        </v-row>
        <v-card color="#FBF3F5" class="my-2 mx-5">
          <v-card-title>
            พัฒนาการ: <span class="text-rose-400">ดี</span>
            <span class="ml-2">ความสนใจ: </span>
            <span class="text-rose-400">ความสนใจดี</span>
          </v-card-title>
          <v-card-text>
            ความคิดเห็นจากโค้ช:<span class="text-black ml-1"
              >มีความพยายามอ่านโน๊ตและมีการทำการบ้านมาเป็นอย่างดีมี
              ทักษะเฉพาะตัวคิดไวทำไวมีวินัยใส่ใจในการเรียนปฦิบัติตามคำสอนของโค้ชอย่างเคร่ง
              ครัดมาเรียนตรงเวลา มีมารยาทในการพูดจา</span
            >
          </v-card-text>
          <v-row>
            <v-col sm="4">
              <img
                src="../../../assets/profile/thaiFlag.png"
                class="my-5 mx-5"
              />
            </v-col>
            <v-col sm="4">
              <img
                src="../../../assets/profile/thaiFlag.png"
                class="my-5 mx-5"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-card> -->

      <template>
        <div v-for="(day_list, index_day) in check_in_detail" :key="index_day">
          <v-card class="my-5 drop-shadow-lg rounded-xl">
            <v-card-text>
              <v-row class="" dense>
                <v-col cols="12" v-if="checked == true">
                  <v-checkbox
                    v-model="checked[index]"
                    color="#FF6B81"
                    hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="2" sm="1">
                  <v-icon color="#FF6B81">mdi-calendar-plus-outline</v-icon>
                </v-col>
                <v-col cols="6">
                  {{ genDate(day_list.date) }}
                </v-col>

                <v-col cols="4">
                  <v-card flat>
                    <v-card-text
                      class="pa-1 rounded-xl text-center"
                      :class="`text-[${
                        check_in_status_options.filter(
                          (v) => v.value === day_list.status
                        )[0].color
                      }] bg-[${
                        check_in_status_options.filter(
                          (v) => v.value === day_list.status
                        )[0].bg_color
                      }]`"
                    >
                      <span
                        :class="`text-[${
                          check_in_status_options.filter(
                            (v) => v.value === day_list.status
                          )[0].color
                        }]`"
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
                  เวลาเรียน
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
                <v-col cols="6" sm="6" align="start">
                  <v-card flat>
                    <v-card-text
                      :class="`text-[${
                        evolution_options.filter(
                          (v) => v.value === day_list.assessment.evolution
                        )[0]
                      }]`"
                    >
                      พัฒนาการ:
                      <span
                        :class="`text-[${
                          evolution_options.filter(
                            (v) => v.value === day_list.assessment.evolution
                          )[0]
                        }]`"
                      >
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
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6" sm="6" align="start">
                  <v-card flat>
                    <v-card-text
                      :class="`text-[${
                        interest_options.filter(
                          (v) => v.value === day_list.assessment.interest
                        )[0]
                      }]`"
                    >
                      ความสนใจ:
                      <span
                        :class="`text-[${
                          interest_options.filter(
                            (v) => v.value === day_list.assessment.interest
                          )[0]
                        }]`"
                      >
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
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" align="center">
                  <v-btn
                    color="#FF6B81"
                    text
                    @click="showAssessment(index_day)"
                  >
                    ดูเพิ่มเติม
                    <v-icon>{{
                      day_list.show ? "mdi-chevron-up" : "mdi-chevron-down"
                    }}</v-icon>
                  </v-btn>

                  <v-expand-transition>
                    <div v-show="day_list.show">
                      <v-card-text class="text-start">
                        ความคิดเห็น:
                        {{
                          !day_list.assessment.remark
                            ? "ไม่มีความคิดเห็น"
                            : day_list.assessment.remark
                        }}
                      </v-card-text>

                      <v-card-text class="text-start">
                        {{
                          !day_list.assessment.remarkFiles
                            ? "ไม่มีไฟล์ความคิดเห็น"
                            : day_list.assessment.remarkFiles
                        }}
                      </v-card-text>
                    </div>
                  </v-expand-transition></v-col
                >
              </v-row>
            </v-card-text>

            <v-card-text class="center pa-2"> </v-card-text>
          </v-card>
        </div>
      </template>
      <!-- DIALOG -->
      <!-- <v-dialog class="pa-2" width="50vw" v-model="dialog_show" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="12" align="right">
              <v-btn icon @click="dialog_show = false">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <img src="../../../assets/student_course/download.png" class="mx-40 my-10"/>
        <v-card-text class="text-center font-bold text-xl"> ดาวน์โหลดแบบประเมินเรียบร้อย</v-card-text>
        <v-btn color="#FF6B81" class="white--text w-60 mx-64 my-10" @click="dialog_show = false">
            ตกลง
        </v-btn>
      </v-card>
    </v-dialog> -->

      <!-- <v-row v-if="checked == true">
        <v-col cols="12" class="text-center">
          <v-btn  class="pink--text w-full" @click="closedownload()">
            ยกเลิก
          </v-btn>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn color="#FF6B81" class="white--text w-full" @click="download()">
            ดาวน์โหลด
          </v-btn>
        </v-col>
      </v-row> -->

      <!-- <v-row v-else> -->
      <v-row>
        <v-col cols="12" class="text-center">
          <v-btn
            disabled
            color="#FF6B81"
            class="white--text w-full my-5"
            @click="download()"
          >
            ดาวน์โหลดผลการประเมิน
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

          <!-- <v-card v-for="(data, index) in items" :key="index" class="pa-2 my-5">
            <v-icon color="#FF6B81">mdi-calendar-plus-outline</v-icon>
              <span class="text-lg">{{ data.title }}</span>
          </v-card> -->

  
<script>
import { mapActions, mapGetters } from "vuex";
import { dateFormatter } from "../../../functions/functions";
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";

export default {
  components: {
    loadingOverlay,
  },
  data: () => ({
    show: false,
    checked: false,
    dialog_show: false,
    show_id: "",
    check_in_detail: [],
    defaultImageUrl:
      "https://cdn.vectorstock.com/i/preview-1x/82/99/no-image-available-like-missing-picture-vector-43938299.jpg",
    check: [],
    items: [
      {
        id: 1,
        title: "Card 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        imageUrl: "https://picsum.photos/id/1/200/200",
      },
      {
        id: 2,
        title: "Card 2",
        description:
          "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl: "https://picsum.photos/id/2/200/200",
      },
      {
        id: 3,
        title: "Card 3",
        description:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        imageUrl: "https://picsum.photos/id/3/200/200",
      },
    ],
    item_data: "",
    check_in_status_options: [
      {
        label: "ตรงเวลา",
        value: "punctual",
        color: "#58A144",
        bg_color: "#F0F9EE",
      },
      { label: "สาย", value: "late", color: "#FCC419", bg_color: "#FFF9E8" },
      { label: "ลา", value: "leave", color: "#43A4F5", bg_color: "#CFE2F3" },
      {
        label: "ลาฉุกเฉิน",
        value: " emergency leave",
        color: "#43A4F5",
        bg_color: "#CFE2F3",
      },
      { label: "ขาด", value: "absent", color: "#F03D3E", bg_color: "#F4CCCC" },
    ],
    evolution_options: [
      { label: "ดีมาก", value: "very good", color: "#ff6b81" },
      { label: "ดี", value: "good", color: "#58A144" },
      { label: "ปรับปรุง", value: "adjust", color: "#FCC419" },
    ],
    interest_options: [
      { label: "ดีมาก", value: "very good", color: "#ff6b81" },
      { label: "ดี", value: "good", color: "#58A144" },
      { label: "ปรับปรุง", value: "adjust", color: "#FCC419" },
    ],
  }),
  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    this.show_id = this.$route.params.course_id;
    // this.GetAll(this.user_detail.account_id);
    for (const item_data of JSON.parse(localStorage.getItem("relations"))) {
      this.GetMyCourseDetail({
        account_id: item_data.student.studentId,
        course_id: this.$route.params.course_id,
      });
    }

    this.check_in_detail = this.my_course_detail.checkIn;
    if (this.check_in_detail.length !== 0) {
      this.check_in_detail.map((val) => {
        val["show"] = false;
      });
    }
    // this.GetStudentData(this.item_data.student.studentId);

    // this.GetMyCourseDetail({account_id : this.item_data.student.studentId, course_id: this.$route.params.course_id});
    // this.GetMyCourseDetail(this.show_id);
  },
  mounted() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "ข้อมูลคอร์สเรียน"
    );

    this.check_in_detail = this.my_course_detail.checkIn;
    if (this.check_in_detail.length !== 0) {
      this.check_in_detail.map((val) => {
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
      console.log("open");
      this.checked = true;
    },
    closedownload() {
      this.checked = false;
    },

    // dayOfWeekName(day_numbers, language) {
    //   let day_names = [];
    //   for (let i = 0; i < day_numbers; i++) {
    //     let day_number = +day_numbers[i];
    //     if (language === "th") {
    //       switch (day_number) {
    //         case 0:
    //           day_names.push("อาทิตย์");
    //           break;
    //         case 1:
    //           day_names.push("จันทร์");
    //           break;
    //         case 2:
    //           day_names.push("อังคาร");
    //           break;
    //         case 3:
    //           day_names.push("พุธ");
    //           break;
    //         case 4:
    //           day_names.push("พฤหัสบดี");
    //           break;
    //         case 5:
    //           day_names.push("ศุกร์");
    //           break;
    //         case 6:
    //           day_names.push("เสาร์");
    //           break;
    //         default:
    //           day_names.push(null);
    //       }
    //     } else {
    //       day_names.push(null);
    //     }
    //   }
    //   day_names.sort(function (a, b) {
    //     return b.localeCompare(a, "th", { numeric: true });
    //   });

    //   return day_names.join(", ");
    // },

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
      // console.log(dateFormatter(new Date(date)));
      return dateFormatter(new Date(date), "DW DD MMT YYYYT");
    },

    checkInStatusOptions(day) {
      console.log(day);
      console.log(this.my_course_detail.checkIn);
      for (const item of this.my_course_detail.checkIn.filter(
        (v) => new Date(v.date) === new Date(day)
      )) {
        return item.status;
      }
    },

    showAssessment(key) {
      this.check_in_detail = this.check_in_detail.map((val, index) => {
        if (key === index) {
          val.show = !val.show;
        } else {
          val.show = false;
        }
        return val;
      });
      console.log("key", key);
    },
  },
  computed: {
    ...mapGetters({
      my_course_detail: "MyCourseModules/getMyCourseDetail",
      profile_user: "ProfileModules/getProfileUser",
      course_list_is_loading: "MyCourseModules/getCourseListIsLoading",
    }),
  },
};
</script>
  
  <style scoped>
</style>