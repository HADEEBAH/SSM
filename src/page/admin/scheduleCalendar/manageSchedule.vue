<template>
  <v-container>
    <headerPage title="จัดการตาราง"></headerPage>
    <v-row class="py-2">
      <v-col cols="12" md="8" sm="8">
        <v-text-field
          dense
          outlined
          label="ค้นหา"
          color="pink"
          hide-details
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="6" md="2" sm="2" align="center">
        <v-btn
          @click="show_dialog_holoday = true"
          color="#FF6B81"
          class="white--text btn-size-lg"
          depressed
          ><span class="mdi mdi-plus">เพิ่มวันหยุด</span>
        </v-btn>
      </v-col>
      <v-col cols="6" md="2" sm="2" align="center">
        <v-btn
          color="#FF6B81"
          class="white--text btn-size-lg"
          depressed
          @click="filter_dialog = true"
        >
          <span class="mdi mdi-filter-variant"></span>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8" sm="8">
        <template>
          <calendarAdmin :events="itemTime.dates"></calendarAdmin>
        </template>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-card height="500px" style="overflow-y: scroll">
          <!-- วันที่ -->
          <v-card-text>
            <div class="pink--text font-bold">
              {{ formattedDate }}
            </div>
          </v-card-text>

          <div class="font-bold my-2 mx-5">ตารางวิชาเรียน</div>
          <!-- ตารางวิชาเรียน -->
          <v-alert
            border="left"
            colored-border
            color="#ff6b81"
            elevation="2"
            v-for="(getAllCourse, index_course) in get_course"
            :key="index_course"
          >
            <v-row dense class="font-bold">
              <v-col cols="6" sm="6"> {{ getAllCourse.courseNameTh }} </v-col>
              <v-col cols="6" sm="6"> 09:00-11:00 </v-col>
            </v-row>
            <v-row dense class="font-bold">
              <v-col cols="6" sm="6"> เปียโนคลาสสิค ขั้นต้น </v-col>
              <v-col cols="6" sm="6"> 09:00-11:00 </v-col>
            </v-row>
            <v-row dense class="font-bold">
              <v-col cols="6" sm="6"> เปียโนคลาสสิค ขั้นต้น </v-col>
              <v-col cols="6" sm="6"> 09:00-11:00 </v-col>
            </v-row>
          </v-alert>
          <!-- แก้ไขวันหยุด -->
          <v-card
            v-for="(getHolidays, index_holidays) in get_all_holidays"
            :key="index_holidays"
            class="mx-2 my-5"
            color="#FDF1E7"
          >
            <v-card-text>
              <v-row dense>
                <v-col cols="6" sm="6" class="font-bold" style="color: #f19a5a">
                  วันหยุด
                </v-col>
                <v-col
                  cols="6"
                  sm="6"
                  @click="editHolidays(getHolidays.holidayId)"
                  align="end"
                >
                  <span
                    class="mdi mdi-pencil-box cursor-pointer"
                    style="color: #f19a5a; font-size: 2em"
                  ></span>
                </v-col>
              </v-row>
              <div style="color: #f19a5a">
                {{ getHolidays.holidayName }}
              </div>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>

    <!-- เพิ่มวันหยุด -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="show_dialog_holoday" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="12" align="end">
                  <v-btn icon @click="show_dialog_holoday = false">
                    <v-icon color="#ff6b81">mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-title>
              <v-row>
                <v-col cols="12" align="center" class="font-bold">
                  เพิ่มวันหยุด
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-title>
              <v-row dense>
                <!-- วันที่ -->
                <v-col cols="12" sm="6">
                  วันที่
                  <v-menu
                    v-model="selectHolidaydates"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        label="ระบุวันที่"
                        outlined
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="rules.dates"
                        color="#FF6B81"
                        :value="
                          holidaydates
                            ? new Date(holidaydates).toLocaleDateString(
                                'th-TH',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )
                            : holidaydates
                        "
                      ></v-text-field>
                    </template>

                    <v-date-picker
                      v-model="holidaydates"
                      @input="selectHolidaydates = false"
                      :min="tomorrowDate()"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- Switch -->
                <v-col cols="12" sm="6" class="mt-5">
                  <v-switch
                    v-model="holidaySwitch"
                    :label="`ทั้งวัน`"
                    color="#FF6B81"
                    inset
                    @change="changeSwitchHoliday($event)"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-card-title>

            <!-- เวลา -->
            <v-card-title>
              <v-row v-if="!holidaySwitch" dense>
                <v-col cols="12" sm="6">
                  เวลาเริ่ม
                  <br />
                  <vue-timepicker
                    v-model="holidayStartTime"
                    color="#FF6B81"
                    item-color="#FF6B81"
                  >
                  </vue-timepicker>
                </v-col>
                <v-col cols="12" sm="6">
                  เวลาสิ้นสุด
                  <br />
                  <vue-timepicker
                    v-model="holidayEndTime"
                    :disabled="!holidayStartTime"
                    color="#FF6B81"
                    item-color="#FF6B81"
                  >
                  </vue-timepicker>
                </v-col>
              </v-row>
            </v-card-title>
            <!-- ชื่อวันหยุด -->
            <v-card-title>
              <v-row dense>
                <v-col cols="12">
                  ชื่อวันหยุด
                  <v-textarea
                    v-model="nameHoliday"
                    outlined
                    placeholder="ระบุชื่อวันหยุด เช่น วันสงกรานต์"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-title>
              <v-row dense>
                <v-col cols="12" align="center">
                  <v-btn
                    depressed
                    color="#FF6B81"
                    class="white--text"
                    width="30vw"
                    @click="CreateHolidays()"
                  >
                    บันทึก
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-title>
              <v-row dense>
                <v-col cols="12" align="center">
                  <v-btn depressed @click="deleteHoliday" width="30vw">
                    ลบวันหยุด
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <!-- แก้ไขวันหยุด -->
    <template>
      <v-row justify="center">
        <v-dialog
          v-model="show_dialog_edit_holoday"
          persistent
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="12" align="end">
                  <v-btn icon @click="show_dialog_edit_holoday = false">
                    <v-icon color="#ff6b81">mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-title>
              <v-row>
                <v-col cols="12" align="center" class="font-bold">
                  แก้ไขวันหยุด
                </v-col>
              </v-row>
            </v-card-title>

            <div
              v-for="(
                dialog_holidays, index_holidaysDialog
              ) in get_holidays_by_id"
              :key="index_holidaysDialog"
            >
              <v-card-title>
                <v-row dense>
                  <!-- วันที่ -->
                  <v-col cols="12" sm="6">
                    วันที่
                    <v-menu
                      v-model="selectEditHolidaydates"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dense
                          outlined
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#FF6B81"
                          :value="
                            editHolidayDates
                              ? new Date(editHolidayDates).toLocaleDateString(
                                  'th-TH',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  }
                                )
                              : new Date(
                                  dialog_holidays.fullDateHolidays
                                ).toLocaleDateString('th-TH', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                          "
                        ></v-text-field>
                      </template>

                      <v-date-picker
                        v-model="editHolidayDates"
                        @input="selectEditHolidaydates = false"
                        :min="tomorrowDate()"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- Switch -->
                  <!-- @change="
                        () => {
                          if (dialog_holidays.allDay) {
                            dialog_holidays.holidayStartTime = '';
                            dialog_holidays.holidayEndTime = '';
                          }
                        }
                      " -->
                  <v-col cols="12" sm="6" class="mt-5">
                    <v-switch
                      v-model="dialog_holidays.allDay"
                      :label="`ทั้งวัน`"
                      color="#FF6B81"
                      inset
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-title>
                <v-row dense v-if="dialog_holidays.allDay == false">
                  <!-- เวลาเริ่ม -->
                  <v-col cols="12" sm="6">
                    เวลาเริ่ม
                    <br />
                    <!-- holidayStartTime -->
                    <vue-timepicker
                      v-model="holidayStartTime"
                      color="#FF6B81"
                      item-color="#FF6B81"
                      hide-clear-button
                    >
                    </vue-timepicker>
                  </v-col>
                  <!-- เวลาสิ้นสุด -->
                  <v-col cols="12" sm="6">
                    เวลาสิ้นสุด
                    <br />
                    <vue-timepicker
                      v-model="holidayEndTime"
                      color="#FF6B81"
                      item-color="#FF6B81"
                      hide-clear-button
                    >
                    </vue-timepicker>
                  </v-col>
                </v-row>
              </v-card-title>
              <!-- ชื่อวันหยุด -->
              <v-card-title>
                <v-row dense>
                  <v-col cols="12">
                    ชื่อวันหยุด
                    <v-textarea
                      v-model="dialog_holidays.holidayName"
                      outlined
                      placeholder="ระบุชื่อวันหยุด เช่น วันสงกรานต์"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card-title>

              <v-card-title>
                <v-row dense>
                  <v-col cols="12" align="center">
                    <v-btn
                      depressed
                      color="#FF6B81"
                      class="white--text"
                      width="30vw"
                      @click="editHolidaysData(dialog_holidays)"
                    >
                      บันทึก
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-title>

              <v-card-title>
                <v-row dense>
                  <v-col cols="12" align="center">
                    <v-btn depressed @click="deleteHoliday" width="30vw">
                      ลบวันหยุด
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-title>
            </div>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <!-- DIALOG FILTER -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="filter_dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="12" align="end">
                  <v-btn icon @click="filter_dialog = false">
                    <v-icon color="#ff6b81">mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-title>
              <v-row>
                <v-col cols="12" align="center" class="font-bold">
                  ตัวกรอง
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-container>
                คอร์ส
                <v-badge
                  v-if="selectedCourse != ''"
                  color="#FF6B81"
                  :content="selectedCourse.length"
                >
                </v-badge>
                <v-autocomplete
                  v-model="selectedCourse"
                  :items="get_course"
                  item-text="courseNameTh"
                  item-value=""
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  dense
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{ item.courseNameTh }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ selectedCourse.length - 1 }} others)
                    </span>
                  </template>
                </v-autocomplete>

                <!-- สถานะคอร์ส -->
                สถานะคอร์ส
                <v-badge
                  v-if="selectedCourseType != ''"
                  color="#FF6B81"
                  :content="selectedCourseType.length"
                >
                </v-badge>
                <v-autocomplete
                  v-model="selectedCourseType"
                  :items="courseType"
                  item-text="coursTypeName"
                  item-value="courseTypeValue"
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  dense
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{ item.coursTypeName }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ selectedCourseType.length - 1 }} others)
                    </span>
                  </template>
                </v-autocomplete>

                <!-- โค้ช -->
                โค้ช
                <v-badge
                  v-if="selectedCoach != ''"
                  color="#FF6B81"
                  :content="selectedCoach.length"
                >
                </v-badge>

                <v-autocomplete
                  v-model="selectedCoach"
                  :items="get_coachs"
                  item-text="firstNameTh"
                  item-value=""
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  dense
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{ item.firstNameTh }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ selectedCoach.length - 1 }} others)
                    </span>
                  </template>
                </v-autocomplete>

                <v-row>
                  <v-col cols="12" align="center">
                    <v-btn
                      depressed
                      :color="'#ff6b81'"
                      class="white--text"
                      width="30vw"
                      :disabled="
                        selectedCoach.length <= 0 &&
                        selectedCourseType.length <= 0 &&
                        selectedCourse.length <= 0
                      "
                    >
                      บันทึก
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <!-- DIALOG SUCCES -->
    <v-dialog
      class="pa-2"
      width="30vw"
      v-model="dialog_show_success"
      persistent
    >
      <v-card>
        <v-card-title>
          <!-- <v-row>
            <v-col cols="12" align="right">
              <v-btn icon @click="dialog_show_success = false">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row> -->
        </v-card-title>
        <dialogCard text="บันทึกข้อมูลสำเร็จ"></dialogCard>
        <div class="my-5 text-center">
          <v-btn color="#ff6b81" @click="dialog_show_success = false">
            ตกลง
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>
  
  <script>
import calendarAdmin from "../../../components/calendar/calendarAdmin.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";
import VueCookie from "vue-cookie";
import Swal from "sweetalert2";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import headerPage from "@/components/header/headerPage.vue";

export default {
  components: {
    calendarAdmin,
    dialogCard,
    VueTimepicker,
    headerPage,
  },
  data: () => ({
    dialog: true,
    search: "",
    thaiDaysOfWeek: [
      "วันอาทิตย์",
      "วันจันทร์",
      "วันอังคาร",
      "วันพุธ",
      "วันพฤหัสบดี",
      "วันศุกร์",
      "วันเสาร์",
    ],
    thaiMonths: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ],
    courseType: [
      { coursTypeName: "คอร์สเต็ม", courseTypeValue: "full" },
      { coursTypeName: "คอร์สว่าง", courseTypeValue: "free" },
    ],

    show_dialog_holoday: false,
    dialog_show_success: false,
    show_dialog_edit_holoday: false,
    selectHolidaydates: false,
    holidaydates: "",
    holidaySwitch: true,
    nameHoliday: "",
    filter_dialog: false,
    selectedCourse: "",
    selectedCourseType: "",
    selectedCoach: "",
    holidayStartTime: {},
    holidayEndTime: {},
    selectEditHolidaydates: false,
    editHolidayName: "",
    selectEditHoliday: "",
    selectEditStartTime: "",
    selectEditEndTime: "",
    editholidaydates: "",
    editHolidayDates: "",

    check_in_status_options: [
      {
        label: "Family",
        value: "punctual",
        color: "#58A144",
        bg_color: "#F0F9EE",
      },
      {
        label: "Exclusive",
        value: "exclusive",
        color: "#FCC419",
        bg_color: "#FFF9E8",
      },

      {
        label: "Group",
        value: " emergency leave",
        color: "#43A4F5",
        bg_color: "#CFE2F3",
      },
    ],

    time_frame: "month",
    nowDate: new Date().toISOString(),
    todayDate: new Date().toLocaleDateString(),
    rules: {
      dates: [
        (val) => (val || "").length > 0 || "กรุณาเลือกอย่างน้อย1วันก่อนวันหยุด",
      ],
    },
  }),

  created() {
    this.GetAllHolidays();
  },
  beforeMount() {},
  mounted() {
    this.GetCourse();
    this.GetCoachs();
  },

  methods: {
    ...mapActions({
      GetCourse: "ManageScheduleModules/GetCourse",
      GetCoachs: "CourseModules/GetCoachs",
      GetAllHolidays: "ManageScheduleModules/GetAllHolidays",
      GetHolidaysById: "ManageScheduleModules/GetHolidaysById",
    }),
    deleteHoliday() {
      console.log("deleteHoliday");
    },

    async CreateHolidays() {
      Swal.fire({
        icon: "question",
        title: "คุณต้องการสร้างวันหยุดใช่หรือไม่ ?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let config = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
              },
            };

            let payload = {
              holidayName: this.nameHoliday,
              description: "",
              allDay: this.holidaySwitch,
              status: "",
              holidayDate: this.holidaydates.split("-")[2],
              holidayMonth: this.holidaydates.split("-")[1],
              holidayYears: this.holidaydates.split("-")[0],
              holidayStartTime: this.holidayStartTime
                ? this.holidayStartTime
                : null,
              holidayEndTime: this.holidayEndTime ? this.holidayEndTime : null,
            };
            console.log("payload", payload);
            let { data } = await axios.post(
              `${process.env.VUE_APP_URL}/api/v1/holiday/create`,
              payload,
              config
            );

            if (data.statusCode === 201) {
              if (data.data && data.message == "Created Sucessful") {
                Swal.fire({
                  icon: "success",
                  title: "บันทึกเรียบร้อย",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    (this.nameHoliday = ""),
                      (this.holidaySwitch = ""),
                      (this.holidaydates.split("-")[2] = ""),
                      (this.holidaydates.split("-")[1] = ""),
                      (this.holidaydates.split("-")[0] = ""),
                      (this.holidayStartTime = ""),
                      (this.holidayEndTime = ""),
                      (this.show_dialog_holoday = false);
                    this.GetAllHolidays();
                  }
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "บันทึกไม่สำเร็จ",
                });
              }
              console.log("CreateHolidays", data.data);
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    },

    holidayDates() {
      const date = parseInt(this.holidayDate);
      const month = this.thaiMonths[parseInt(this.holidayMonth) - 1];
      const year = parseInt(this.holidayYears) + 543;

      return `${date} ${month} ${year}`;
    },

    editHolidays(holidayId) {
      this.show_dialog_edit_holoday = true;
      this.GetHolidaysById(holidayId).then(() => {
        this.holidayStartTime = this.get_holidays_by_id[0].holidayStartTime
          ? this.get_holidays_by_id[0].holidayStartTime
          : null;
        console.log("this.holidayStartTime", this.holidayStartTime),
          (this.holidayEndTime = this.get_holidays_by_id[0].holidayEndTime
            ? this.get_holidays_by_id[0].holidayEndTime
            : null);
        console.log("this.holidayEndTime", this.holidayEndTime),
          (this.fullDateHolidaysTh = `${this.holidayDate} ${
            this.thaiMonths[parseInt(this.holidayMonth) - 1]
          } ${parseInt(this.holidayYears) + 543}`);

        this.holidayDate = this.editHolidayDates.split("-")[2];
        this.holidayMonth = this.editHolidayDates.split("-")[1];
        this.holidayYears = this.editHolidayDates.split("-")[0];

        this.holidayDate = this.editHolidayDates;
        this.holidayMonth = this.editHolidayDates;
        this.holidayYears = this.editHolidayDates;

        if (this.holidayStartTime == null && this.holidayEndTime == null) {
          this.allDay == false;
        }
      });
    },

    async editHolidaysData(holiday) {
      console.log("editHolidaysData", holiday);
      console.log("holiday.allDay", holiday.allDay);
      Swal.fire({
        icon: "question",
        title: "คุณต้องการแก้ไขวันหยุดใช่หรือไม่ ?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let config = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
              },
            };
            let payload = {
              holidayName: holiday.holidayName,
              description: "",
              allDay: holiday.allDay,
              status: "",
              holidayDate: this.editHolidayDates.split("-")[2],
              holidayMonth: this.editHolidayDates.split("-")[1],
              holidayYears: this.editHolidayDates.split("-")[0],
              holidayStartTime: this.holidayStartTime
                ? this.holidayStartTime.HH + ":" + this.holidayStartTime.mm
                : null,
              holidayEndTime: this.holidayEndTime
                ? this.holidayEndTime.HH + ":" + this.holidayEndTime.mm
                : null,
            };
            console.log("payload", payload);
            let { data } = await axios.patch(
              `${process.env.VUE_APP_URL}/api/v1/holiday/update-holiday/${holiday.holidayId}`,
              payload,
              config
            );
            if (data.statusCode === 200) {
              if (data.data && data.message == "Update Successful") {
                Swal.fire({
                  icon: "success",
                  title: "บันทึกเรียบร้อย",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    (this.show_dialog_edit_holoday = false),
                      this.GetAllHolidays();
                  }
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "บันทึกไม่สำเร็จ",
                });
              }
              console.log("CreateHolidays", data.data);
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    },

    tomorrowDate() {
      const tomorrow = new Date();
      if (this.holidaySwitch) {
        let tomorrowDate = tomorrow.getDate() + 2;
        tomorrow.setDate(tomorrowDate);
      } else {
        let tomorrowDate = tomorrow.getDate() + 1;
        tomorrow.setDate(tomorrowDate);
      }

      return tomorrow.toISOString();
    },

    changeSwitchHoliday() {
      this.holidayStartTime = "";
      this.holidayEndTime = "";
      // this.holidaydates = "";
      this.editHolidayDates = "";
    },
  },

  computed: {
    ...mapGetters({
      itemTime: "MyCourseModules/getcourseSchedule",
      get_course: "ManageScheduleModules/getCourse", //get all course
      get_coachs: "CourseModules/getCoachs",
      get_all_holidays: "ManageScheduleModules/getAllHolidays",
      get_holidays_by_id: "ManageScheduleModules/getHolidaysById",
    }),
    formattedDate() {
      const date = new Date();
      const day = this.thaiDaysOfWeek[date.getDay()];
      const dateNumber = date.getDate();
      const month = this.thaiMonths[date.getMonth()];
      const year = date.getFullYear() + 543; // Add 543 to convert to Thai year

      return `${day} ${dateNumber} ${month}, ${year}`;
    },
  },
};
</script>
  
  <style scoped>
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #c7c7c7;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #c7c7c7;
}
</style>