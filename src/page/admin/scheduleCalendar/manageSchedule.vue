<template>
  <v-container>
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
        <v-btn color="#FF6B81" class="white--text btn-size-lg" depressed
          ><span class="mdi mdi-plus" @click="show_dialog_holoday = true"
            >เพิ่มวันหยุด</span
          >
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
          <!-- :events="itemTime.dates"
            :type="time_frame" -->
          <calendarStudent></calendarStudent>
        </template>
      </v-col>
      <v-col cols="12" md="4" sm="4">
        <v-card>
          <v-card-text>
            <div class="pink--text font-bold" color="#FF6B81">วันนี้</div>
            {{ formattedDate }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="show_dialog_holoday" width="50vw">
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
                    v-model="holidaydates"
                    label="ระบุวันที่"
                    outlined
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    color="#FF6B81"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="holidaydates"
                  @input="selectHolidaydates = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6" class="mt-5" align="end">
              <v-switch
                v-model="holidaySwitch"
                :label="`ทั้งวัน`"
                color="#FF6B81"
                inset
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-title>
          <v-row v-if="holidaySwitch" dense>
            <v-col cols="12" sm="6">
              เวลา
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
                    v-model="holidaydates"
                    label="ระบุวันที่"
                    outlined
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    color="#FF6B81"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="holidaydates"
                  @input="selectHolidaydates = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-title>

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
                @click="dialog_show_success = true"
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
import calendarStudent from "../../../components/calendar/calendarStudent.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";

import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    calendarStudent,
    dialogCard,
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
    selectHolidaydates: false,
    holidaydates: "",
    holidaySwitch: true,
    nameHoliday: "",
    filter_dialog: false,
    selectedCourse: "",
    selectedCourseType: "",
    selectedCoach: "",
  }),

  created() {},
  beforeMount() {},
  mounted() {
    this.GetCourse();
    this.GetCoachs();
  },

  methods: {
    ...mapActions({
      GetCourse: "ManageScheduleModules/GetCourse",
      GetCoachs: "CourseModules/GetCoachs",
    }),
    deleteHoliday() {
      console.log("deleteHoliday");
    },
  },

  computed: {
    ...mapGetters({
      // itemTime: "MyCourseModules/getcourseSchedule",
      get_course: "ManageScheduleModules/getCourse", //get all course
      get_coachs: "CourseModules/getCoachs",
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
  
  <style>
</style>