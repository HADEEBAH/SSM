<template>
  <loading-overlay
    v-if="get_all_course_is_loading && get_all_holidays_is_loading"
    :loading="get_all_course_is_loading && get_all_holidays_is_loading"
  ></loading-overlay>
  <v-container v-else>
    <headerPage title="จัดการตาราง"></headerPage>
    <v-row class="py-2">
      <v-col cols="12" sm="8" class="w-full">
        <v-text-field
          dense
          class="w-full"
          outlined
          label="ค้นหา"
          color="pink"
          hide-details
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          @keyup="GetSearchSchedule(search)"
        ></v-text-field>
      </v-col>
      <v-col cols="6" sm="2" align="center" class="w-full">
        <v-btn
          @click="show_dialog_holoday = true"
          color="#FF6B81"
          class="white--text btn-size-lg w-full"
          depressed
          block
          ><span class="mdi mdi-plus">เพิ่มวันหยุด</span>
        </v-btn>
      </v-col>
      <v-col cols="6" sm="2" align="center" class="w-full">
        <v-btn
          outlined
          color="#FF6B81"
          class="w-full"
          depressed
          block
          @click="filter_dialog = true"
        >
          <v-icon size="24" class="mdi mdi-filter-variant"></v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8" sm="8">
        <template>
          <calendarAdmin></calendarAdmin>
        </template>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-card class="my-3 pa-2 max-h-[300px] overflow-auto rounded-lg">
          <!-- วันที่ -->
          <v-card-text>
            <div class="pink--text font-bold text-center">
              {{ formattedDate }}
            </div>
          </v-card-text>

          <div class="font-bold">ตารางวิชาเรียน</div>
          <!-- ตารางวิชาเรียน -->
          <v-alert
            class="my-2"
            border="left"
            colored-border
            color="#ff6b81"
            elevation="2"
            v-for="(item, index) in courseDate"
            :key="index"
          >
            <!-- {{ item }} -->
            <v-row dense class="font-bold">
              <v-col cols="12" sm="6">
                {{ item?.courseName?.courseNameTh }}</v-col
              >
              <v-col cols="12" sm="6">
                {{ item?.time?.start }} - {{ item?.time?.end }}</v-col
              >
            </v-row>

            <v-row dense>
              <v-col cols="12" sm="6">โค้ช : {{ item?.coachName }} </v-col>
              <v-col cols="12" sm="6">
                <v-chip
                  v-if="item?.cpo?.packageName"
                  :color="
                    item?.cpo?.packageName
                      ? package_options.filter(
                          (v) => v.value === item?.cpo?.packageName
                        )[0]?.bg_color
                      : ''
                  "
                  :style="
                    item.cpo.packageName
                      ? `color:${
                          package_options.filter(
                            (v) => v.value === item?.cpo?.packageName
                          )[0]?.color
                        }`
                      : ''
                  "
                >
                  {{
                    item?.cpo?.packageName
                      ? package_options.filter(
                          (v) => v.value === item?.cpo?.packageName
                        )[0]?.label
                      : ""
                  }}
                </v-chip>
              </v-col>
            </v-row>

            <div v-if="item?.courseMonitor?.length > 0">
              <v-row
                dense
                v-for="(seat, index) in item?.courseMonitor.filter(
                  (v) => v.timeId === item.time.timeId
                )"
                :key="index"
              >
                <v-col
                  cols="12"
                  class="mdi mdi-account-group-outline"
                  style="color: #ff6b81"
                >
                  {{ seat?.currentStudent }} /
                  {{ seat?.maximumStudent }} ที่นั่ง
                </v-col>
              </v-row>
            </div>
          </v-alert>
          <!-- แก้ไขวันหยุด -->
        </v-card>
        <v-card class="pa-2 max-h-[300px] overflow-auto rounded-lg">
          <div class="font-bold">วันหยุด</div>
          <v-card-text
            v-for="(getHolidays, index_holidays) in get_all_holidays"
            :key="index_holidays"
            class="bg-[#FDF1E7] my-2 rounded-lg"
            color="#ED7D2B"
          >
            <v-row dense>
              <v-col cols="6" sm="6" class="font-bold" style="color: #f19a5a">
                วันหยุด {{ getHolidays?.fullDateHolidaysTh }}
              </v-col>
              <v-col
                cols="6"
                sm="6"
                @click="editHolidays(getHolidays)"
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
      </v-col>
    </v-row>

    <!-- แก้ไขวันหยุด -->
    <template>
      <v-row justify="center">
        <v-dialog
          v-model="show_dialog_edit_holoday"
          persistent
          max-width="600px"
        >
          <v-card>
            <v-container>
              <v-card-title>
                <v-row dense>
                  <v-col class="absolute top-0 right-0" cols="12" align="end">
                    <v-btn icon @click="closeDialog">
                      <v-icon color="#ff6b81">mdi-close</v-icon>
                    </v-btn>
                  </v-col>

                  <v-col cols="12" align="center" class="font-bold">
                    แก้ไขวันหยุด
                  </v-col>
                </v-row>
              </v-card-title>

              <v-card-text>
                <v-row dense>
                  <!-- วันที่ -->
                  <v-col cols="12" sm="8">
                    <label class="font-weight-bold">วันที่</label>
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
                          append-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="#FF6B81"
                          :value="
                            holidaydatesTh
                              ? holidaydatesTh
                              : setDataEditDialog.fullDateHolidaysTh
                          "
                        ></v-text-field>
                      </template>

                      <v-date-picker
                        v-model="editHolidayDates"
                        @input="
                          setHolidaydates(editHolidayDates),
                            (selectEditHolidaydates = false)
                        "
                        :min="tomorrowDate()"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- Switch -->
                  <v-col cols="12" sm="4" class="text-center align-self-center">
                    <v-switch
                      v-model="setDataEditDialog.allDay"
                      :label="`ทั้งวัน`"
                      color="#FF6B81"
                      inset
                    ></v-switch>
                  </v-col>
                </v-row>

                <v-row dense v-if="setDataEditDialog.allDay === false">
                  <!-- เวลาเริ่ม -->
                  <v-col cols="12" sm="6">
                    <label class="font-weight-bold">เวลาเริ่ม</label>
                    <br />
                    <vue-timepicker
                      v-model="setDataEditDialog.ob_holidayStartTime"
                      color="#FF6B81"
                      item-color="#FF6B81"
                      hide-clear-button
                      dense
                    >
                    </vue-timepicker>
                  </v-col>
                  <!-- เวลาสิ้นสุด -->
                  <v-col cols="12" sm="6">
                    <label class="font-weight-bold">เวลาสิ้นสุด</label>
                    <br />
                    <vue-timepicker
                      v-model="setDataEditDialog.ob_holidayEndTime"
                      color="#FF6B81"
                      item-color="#FF6B81"
                      hide-clear-button
                      dense
                      class=""
                    >
                    </vue-timepicker>
                  </v-col>
                </v-row>

                <v-row dense>
                  <v-col cols="12">
                    <label class="font-weight-bold">ชื่อวันหยุด</label>
                    <v-textarea
                      v-model="setDataEditDialog.holidayName"
                      outlined
                      placeholder="ระบุชื่อวันหยุด เช่น วันสงกรานต์"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-row dense>
                  <v-col cols="6" align="center">
                    <v-btn class="w-full" depressed @click="deleteHoliday">
                      ลบวันหยุด
                    </v-btn>
                  </v-col>
                  <v-col cols="6" align="center">
                    <v-btn
                      depressed
                      color="#FF6B81"
                      class="white--text w-full"
                      @click="editHolidaysData()"
                    >
                      บันทึก
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-container>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <!-- เพิ่มวันหยุด -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="show_dialog_holoday" persistent max-width="600px">
          <v-card>
            <v-container>
              <v-card-title>
                <v-row>
                  <v-col
                    cols="12"
                    align="end"
                    class="font-bold absolute right-0 top-0"
                  >
                    <v-btn icon @click="closeDialog">
                      <v-icon color="#ff6b81">mdi-close</v-icon>
                    </v-btn>
                  </v-col>

                  <v-col cols="12" align="center" class="font-bold">
                    เพิ่มวันหยุด
                  </v-col>
                </v-row>
              </v-card-title>

              <v-card-text>
                <v-row dense>
                  <!-- วันที่ -->
                  <v-col cols="12" sm="8">
                    <label class="font-weight-bold">วันที่</label>

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
                          append-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="rules.dates"
                          color="#FF6B81"
                          v-model="holidaydatesTh"
                        >
                        </v-text-field>
                      </template>

                      <v-date-picker
                        v-model="holidaydates"
                        @input="
                          setHolidaydates(holidaydates),
                            (selectHolidaydates = false)
                        "
                        :min="tomorrowDate()"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- Switch -->
                  <v-col cols="12" sm="4" class="align-self-center">
                    <v-switch
                      v-model="holidaySwitch"
                      :label="`ทั้งวัน`"
                      color="#FF6B81"
                      inset
                      @change="changeSwitchHoliday($event)"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row v-if="!holidaySwitch" dense>
                  <v-col cols="6">
                    <label class="font-weight-bold">เวลาเริ่ม</label>
                    <br />
                    <vue-timepicker
                      v-model="holidayStartTime"
                      color="#FF6B81"
                      item-color="#FF6B81"
                      dense
                    >
                    </vue-timepicker>
                  </v-col>
                  <v-col cols="6">
                    <label class="font-weight-bold">เวลาสิ้นสุด</label>
                    <br />
                    <vue-timepicker
                      v-model="holidayEndTime"
                      :disabled="!holidayStartTime"
                      color="#FF6B81"
                      item-color="#FF6B81"
                      dense
                    >
                    </vue-timepicker>
                  </v-col>
                </v-row>

                <v-row dense>
                  <v-col cols="12">
                    <label class="font-weight-bold">ชื่อวันหยุด</label>
                    <v-textarea
                      v-model="nameHoliday"
                      outlined
                      placeholder="ระบุชื่อวันหยุด เช่น วันสงกรานต์"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-row dense>
                  <v-col cols="12" align="center">
                    <v-btn
                      depressed
                      color="#FF6B81"
                      class="white--text w-full"
                      @click="CreateHolidays()"
                    >
                      บันทึก
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-container>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <!-- DIALOG FILTER -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="filter_dialog" persistent max-width="600px">
          <v-card>
            <v-container>
              <v-card-title>
                <v-row dense>
                  <v-col
                    cols="12"
                    align="end"
                    class="font-bold absolute top-0 right-0"
                  >
                    <v-btn class="" icon @click="filter_dialog = false">
                      <v-icon color="#ff6b81">mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" align="center" class="font-bold">
                    ตัวกรอง
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-badge
                  color="#FF6B81"
                  :content="selectedCourse.length"
                  :value="selectedCourse.length"
                >
                  <label class="font-weight-bold">คอร์ส</label>
                </v-badge>
                <v-autocomplete
                  outlined
                  v-model="selectedCourse"
                  :items="get_filter_course"
                  item-text="courseNameTh"
                  item-value="courseId"
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  dense
                  placeholder="คอร์ส"
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

                <!-- v-if="selectedCourseType != ''" -->
                <!-- {{ selectedCourseType }} -->
                <v-badge
                  color="#FF6B81"
                  :content="selectedCourseType.length"
                  :value="selectedCourseType.length"
                >
                  <label class="font-weight-bold">สถานะคอร์ส</label>
                </v-badge>
                <v-autocomplete
                  outlined
                  v-model="selectedCourseType"
                  :items="courseType"
                  item-text="coursTypeName"
                  item-value="courseTypeValue"
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  dense
                  placeholder="สถานะคอร์ส"
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
                <!-- v-if="selectedCoach != ''" -->
                <v-badge
                  color="#FF6B81"
                  :content="selectedCoach.length"
                  :value="selectedCoach.length"
                >
                  <label class="font-weight-bold">โค้ช</label>
                </v-badge>

                <v-autocomplete
                  outlined
                  v-model="selectedCoach"
                  :items="get_coachs"
                  item-text="fullNameTh"
                  item-value="accountId"
                  multiple
                  color="#FF6B81"
                  item-color="#FF6B81"
                  dense
                  placeholder="โค้ช"
                >
                  <template v-slot:selection="{ item, index }">
                    <!-- {{ item }} -->
                    <v-chip v-if="index === 0">
                      <span>{{ item.fullNameTh }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ selectedCoach.length - 1 }} others)
                    </span>
                  </template>
                </v-autocomplete>

                <v-row>
                  <v-col cols="12" sm="6" align="center">
                    <v-btn
                      @click="
                        GetDataInSchedule(),
                          (filter_dialog = false),
                          (selectedCourseType = []),
                          (selectedCourse = []),
                          (selectedCoach = [])
                      "
                      depressed
                      outlined
                      :color="'#ff6b81'"
                      class="w-full"
                    >
                      ล้างค่า
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6" align="center">
                    <v-btn
                      @click="
                        filterSchedules(
                          selectedCourse,
                          selectedCoach,
                          selectedCourseType
                        )
                      "
                      depressed
                      :color="'#ff6b81'"
                      class="white--text w-full"
                    >
                      กรอง
                    </v-btn>
                  </v-col>
                </v-row>
                <!-- </v-container> -->
              </v-card-text>
            </v-container>
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
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";
export default {
  components: {
    calendarAdmin,
    dialogCard,
    VueTimepicker,
    headerPage,
    loadingOverlay,
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
      { coursTypeName: "คอร์สเต็ม", courseTypeValue: "Close" },
      { coursTypeName: "คอร์สว่าง", courseTypeValue: "Open" },
    ],

    show_dialog_holoday: false,
    dialog_show_success: false,
    show_dialog_edit_holoday: false,
    selectHolidaydates: false,
    holidaydates: "",
    holidaydatesTh: "",
    holidaySwitch: true,
    nameHoliday: "",
    filter_dialog: false,
    selectedCourse: [],
    selectedCourseType: [],
    selectedCoach: [],
    holidayStartTime: {},
    holidayEndTime: {},
    selectEditHolidaydates: false,
    editHolidayName: "",
    selectEditHoliday: "",
    selectEditStartTime: "",
    selectEditEndTime: "",
    editHolidayDates: null,

    EditHolidayStartTime: "",
    EditHolidayEndTime: "",

    package_options: [
      {
        label: "Family Package",
        value: "Family Package",
        color: "#FFFFFF",
        bg_color: "#58A144",
      },
      {
        label: "Exclusive Package",
        value: "Exclusive Package",
        color: "#FFFFFF",
        bg_color: "#FCC419",
      },

      {
        label: "Group Package",
        value: "Group Package",
        color: "#FFFFFF",
        bg_color: "#43A4F5",
      },
    ],

    time_frame: "month",
    nowDate: new Date().toISOString(),
    todayDate: new Date().toLocaleDateString(),
    rules: {
      dates: [
        (val) =>
          (val || "").length > 0 || "กรุณาเลือกอย่างน้อย 1 วันก่อนวันหยุด",
      ],
    },

    // events: [],
    setDataEditDialog: {},
    courseToday: [],
    resultSearchSchedule: null,
  }),

  created() {
    this.GetAllHolidays();
    this.GetAllCourse();
  },
  beforeMount() {
    // const events = [];
    // const startDate = new Date();
    // const endDate = new Date();
    // events.push({
    //   name: this.names[this.rnd(0, this.names.length - 1)],
    //   start: startDate,
    //   end: endDate,
    //   color: this.colors[this.rnd(0, this.colors.length - 1)],
    // });
    // this.events = events;
  },
  mounted() {
    this.GetCoachs();
    this.GetFilterCourse();
    this.GetDataInSchedule();
  },
  methods: {
    ...mapActions({
      GetFilterCourse: "ManageScheduleModules/GetFilterCourse",
      GetAllCourse: "ManageScheduleModules/GetAllCourse",
      GetCoachs: "CourseModules/GetCoachs",
      GetAllHolidays: "ManageScheduleModules/GetAllHolidays",
      GetHolidaysById: "ManageScheduleModules/GetHolidaysById",
      GetEditHolidays: "ManageScheduleModules/GetEditHolidays",
      GetDataInSchedule: "ManageScheduleModules/GetDataInSchedule",
      GetFilterSchedule: "ManageScheduleModules/GetFilterSchedule",
      GetSearchSchedule: "ManageScheduleModules/GetSearchSchedule",
    }),

    setHolidaydates(item) {
      // console.log("item", item);
      const thaiMonths = [
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
      ];
      if (item !== "") {
        const newDate = new Date(item).toLocaleDateString("th-TH");
        const date = newDate.split("/")[0];
        const month = newDate.split("/")[1];
        const year = newDate.split("/")[2];
        this.holidaydatesTh = `${date} ${thaiMonths[month - 1]} ${year}`;
      }
    },

    // searchSchedule() {
    //   // console.log("search", this.search);
    //   if (this.search !== "") {
    //     if (this.data_filter_schedule) {
    //       let res = this.data_filter_schedule.filter((items)=> this.search === items.name || this.search === items.coach || items.search === items.package || items.name.indexOf(this.search) !== -1 || items.coach.indexOf(this.search) !== -1 || items.package.indexOf(this.search) !== -1)
    //       // console.log("res=>", res);
    //       this.resultSearchSchedule = res
    //     }
    //   }
    // },

    async filterSchedules(courseId, coachId, status) {
      this.GetFilterSchedule({ courseId, coachId, status });
      // console.log({
      //   courseId: courseId,
      //   coach_id: coachId,
      //   status: status,
      // });
      this.filter_dialog = false;
    },

    async deleteHoliday() {
      // console.log("del", this.setDataEditDialog);
      Swal.fire({
        icon: "question",
        title: "คุณต้องการลบวันหยุดใช่หรือไม่ ?",
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
            let { data } = await axios.delete(
              `${process.env.VUE_APP_URL}/api/v1/holiday/id/${this.setDataEditDialog.holidayId}`,
              config
            );
            if (data.statusCode === 200) {
              Swal.fire({
                icon: "success",
                title: "บันทึกเรียบร้อย",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  (this.show_dialog_edit_holoday = false),
                    this.GetAllHolidays();
                  this.GetDataInSchedule();
                }
              });
            }
          } catch (error) {
            // console.log("SetDeleteHoliday", error);
          }
        }
      });
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
              holidayDate: this.holidaydates.split("-")[2],
              holidayMonth: this.holidaydates.split("-")[1],
              holidayYears: this.holidaydates.split("-")[0],
              holidayStartTime: this.holidayStartTime
                ? this.holidayStartTime
                : null,
              holidayEndTime: this.holidayEndTime ? this.holidayEndTime : null,
            };
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
                    this.show_dialog_holoday = false;
                    this.holidaydates = "";
                    this.holidaySwitch = true;
                    this.holidayStartTime = "";
                    this.holidayEndTime = "";
                    this.nameHoliday = "";
                    this.GetAllHolidays();
                    this.GetDataInSchedule();
                    this.holidaydatesTh = "";
                  }
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "บันทึกไม่สำเร็จ",
                });
              }
            }
          } catch (error) {
            // console.log(error);
            if (error.response.data.statusCode === 400) {
              if (
                error.response.data.message ==
                "Holiday with the same date already exists."
              ) {
                Swal.fire({
                  icon: "info",
                  title: "เกิดข้อผิดพลาด",
                  text: "วันที่นี้ถูกสร้างลงในวันหยุดแล้ว",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    this.holidaydates = "";
                    this.holidaySwitch = true;
                    this.holidayStartTime = "";
                    this.holidayEndTime = "";
                    this.nameHoliday = "";
                    this.GetAllHolidays();
                  }
                });
              }
            }
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

    editHolidays(holiday) {
      this.show_dialog_edit_holoday = true;
      // console.log("holiday", holiday);
      // console.log(
      //   "++++",
      //   new Date(
      //     `${holiday.holidayDate}/${holiday.holidayMonth}/${holiday.holidayYears}`
      //   )
      // );
      // this.editHolidayDates = `${holiday.holidayDate}/${holiday.holidayMonth}/${holiday.holidayYears}`
      // this.editHolidayDates = new Date(`${holiday.holidayDate}/${holiday.holidayMonth}/${holiday.holidayYears}`)
      this.setDataEditDialog = { ...holiday };
    },

    async editHolidaysData() {
      // console.log("setDataEditDialog", this.setDataEditDialog);
      this.setDataEditDialog.holidayDate = this.editHolidayDates
        ? this.editHolidayDates.split("-")[2]
        : this.setDataEditDialog.holidayDate;
      this.setDataEditDialog.holidayMonth = this.editHolidayDates
        ? this.editHolidayDates.split("-")[1]
        : this.setDataEditDialog.holidayMonth;
      this.setDataEditDialog.holidayYears = this.editHolidayDates
        ? this.editHolidayDates.split("-")[0]
        : this.setDataEditDialog.holidayYears;
      if (this.setDataEditDialog.allDay === true) {
        this.setDataEditDialog.holidayStartTime = null;
        this.setDataEditDialog.holidayEndTime = null;
      } else {
        this.setDataEditDialog.holidayStartTime =
          this.setDataEditDialog.ob_holidayStartTime.HH +
          ":" +
          this.setDataEditDialog.ob_holidayStartTime.mm;

        this.setDataEditDialog.holidayEndTime =
          this.setDataEditDialog.ob_holidayEndTime.HH +
          ":" +
          this.setDataEditDialog.ob_holidayEndTime.mm;
      }

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
            let payload = {};
            payload = { ...this.setDataEditDialog };
            this.GetEditHolidays(payload);
            this.GetDataInSchedule();
            this.show_dialog_edit_holoday = false;
            this.editHolidayDates = null;
            this.setDataEditDialog = {};
          } catch (error) {
            // console.log(error);
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
      this.editHolidayDates = null;
    },

    closeDialog() {
      this.show_dialog_holoday = false;
      this.holidaydates = "";
      this.holidaySwitch = true;
      this.holidayStartTime = "";
      this.holidayEndTime = "";
      this.nameHoliday = "";
      this.show_dialog_edit_holoday = false;
      this.setDataEditDialog = {};
      this.editHolidayDates = null;
      this.holidaydatesTh = null;
    },
  },

  computed: {
    ...mapGetters({
      itemTime: "MyCourseModules/getcourseSchedule",
      get_filter_course: "ManageScheduleModules/getFilterCourse", //get all course
      get_all_course: "ManageScheduleModules/getAllCourse",
      get_all_course_is_loading: "ManageScheduleModules/getAllCourseIsLoading",
      date_arr: "ManageScheduleModules/getDateArray",
      get_coachs: "CourseModules/getCoachs",
      get_all_holidays: "ManageScheduleModules/getAllHolidays",
      get_all_holidays_is_loading:
        "ManageScheduleModules/getAllHolidaysIsLoading",
      get_holidays_by_id: "ManageScheduleModules/getHolidaysById",
      data_in_schedule: "ManageScheduleModules/getdataInSchadule",
      data_filter_schedule: "ManageScheduleModules/getFilterSchedule",
      data_search_schedule: "ManageScheduleModules/getSearchFilterSchedule",
    }),
    formattedDate() {
      const date = new Date();
      const day = this.thaiDaysOfWeek[date.getDay()];
      const dateNumber = date.getDate();
      const month = this.thaiMonths[date.getMonth()];
      const year = date.getFullYear() + 543; // Add 543 to convert to Thai year

      return `${day} ${dateNumber} ${month} ${year}`;
    },

    courseDate() {
      let courseTodayDate = new Date().toLocaleDateString("en-CA");
      // let courseTodayDate = new Date("2023-06-13").toLocaleDateString("en-CA");

      let getAllCourseDate = [];
      let success = "";
      let allCourse = [];

      for (let [index, item] of this.date_arr.entries()) {
        for (const CourseDate of item) {
          getAllCourseDate.push(CourseDate);
          if (courseTodayDate == CourseDate) {
            success = true;
            allCourse.push(this.get_all_course[index]);
          }
        }
      }

      return success && allCourse;
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