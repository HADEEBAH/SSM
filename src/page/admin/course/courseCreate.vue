<template>
  <v-app>
    <v-img
      v-if="$vuetify.breakpoint.smAndUp"
      class="img-header"
      src="../../../assets/course/img_header.png"
    ></v-img>
    <v-container>
      <headerPage title="สร้างคอร์สเรียน"></headerPage>
      <v-radio-group v-model="course_data.type">
        <v-row dense>
          <v-col cols="12" sm="3">
            <v-radio color="green" value="general_course">
              <template v-slot:label>
                <v-row dense>
                  <v-col cols="4" sm="12">
                    <v-img
                      src="../../../assets/course/general_course_icon.jpg"
                      height="50"
                      max-height="80"
                      max-width="80"
                    ></v-img>
                  </v-col>
                  <v-col cols="8" sm="12">
                    <label>คอร์สทั่วไป</label>
                  </v-col>
                </v-row>
              </template>
            </v-radio>
          </v-col>
          <v-col cols="12" sm="3">
            <v-radio color="green" value="short_course">
              <template v-slot:label>
                <v-row dense>
                  <v-col cols="4" sm="12">
                    <v-img
                      src="../../../assets/course/short_course_icon.jpg"
                      height="50"
                      max-height="80"
                      max-width="80"
                    ></v-img>
                  </v-col>
                  <v-col cols="8" sm="12">
                    <label>คอร์สระยะสั้น</label>
                  </v-col>
                </v-row>
              </template>
            </v-radio>
          </v-col>
        </v-row>
      </v-radio-group>
      <v-stepper alt-labels v-model="step">
        <v-stepper-header
          v-if="course_data.type === 'general_course'"
          style="box-shadow: none !important"
        >
          <template v-for="(header, index) in step_header_data">
            <v-stepper-step
              :key="`${index}-step`"
              color="#FF6B81"
              :step="index + 1"
            >
              <label
                :class="step == index + 1 ? 'text-[#FF6B81] font-bold' : ''"
                >{{ header }}</label
              >
            </v-stepper-step>
            <v-divider
              :key="index"
              v-if="index !== step_header_data.length - 1"
            ></v-divider>
          </template>
        </v-stepper-header>
        <!-- Step 1 -->
        <v-stepper-content step="1" class="pa-2 pt-3">
          <course-card></course-card>
        </v-stepper-content>
        <!-- Step 2 -->
        <v-stepper-content step="2" class="pa-2">
          <v-card flat>
            <headerCard title="รายละเอียดเวลาและโค้ช">
              <template v-slot:actions>
                <v-btn outlined color="#FF6B81" @click="addCoach">
                  <v-icon>mdi-plus-circle-outline</v-icon>
                  เพิ่มโค้ช
                </v-btn>
              </template>
            </headerCard>
            <v-card-text class="pt-0">
              <v-divider class="mb-3"></v-divider>
              <!-- COACH -->
              <coachs-card></coachs-card>
            </v-card-text>
          </v-card>
        </v-stepper-content>
        <!-- Step 3 -->
        <v-stepper-content step="3" class="pa-2">
          <package-card></package-card>
          <v-row dense>
            <v-col class="d-flex align-center justify-center" cols="12">
              <v-btn
                outlined
                color="#FF6B81"
                @click="addPackage(course_data.packages)"
                ><v-icon>mdi-plus-circle-outline</v-icon>เพิ่มแพ็คเกจ</v-btn
              >
            </v-col>
          </v-row>
        </v-stepper-content>
        <v-card flat>
          <v-card-text>
            <v-row dense v-if="course_data.type === 'general_course'">
              <v-col cols="12" sm align="right">
                <v-btn
                  v-if="step > 1"
                  color="#FF6B81"
                  style="width: 120px"
                  text
                  @click="step = step - 1"
                  >ย้อนกลับ</v-btn
                >
              </v-col>
              <v-col cols="auto" v-if="step < 3">
                <v-btn
                  dark
                  color="#FF6B81"
                  class="white--text"
                  style="width: 120px"
                  depressed
                  @click="step = step + 1"
                  >ถัดไป</v-btn
                >
              </v-col>
              <v-col cols="auto" v-else>
                <v-btn
                  color="#FF6B81"
                  class="white--text w-full"
                  depressed
                  @click="save"
                  >สร้างคอร์สเรียน</v-btn
                >
              </v-col>
            </v-row>
            <v-row dense v-else>
              <v-col cols="12" align="right">
                <v-btn
                  color="#FF6B81"
                  class="white--text"
                  depressed
                  @click="save"
                  >สร้างคอร์สเรียน</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-stepper>
    </v-container>
  </v-app>
</template>  
<script>
import headerPage from "@/components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import CoachsCard from "@/components/course/coachsCard.vue";
import PackageCard from "@/components/course/packageCard.vue";
import CourseCard from '@/components/course/courseCard.vue';
import {inputValidation, dateFormatter} from "@/functions/functions" 
import { mapGetters, mapActions } from "vuex";
export default {
  name: "CourseCreate",
  components: {
    headerPage,
    headerCard,
    CoachsCard,
    PackageCard,
    CourseCard,
  },
  data: () => ({
    menu: false,
    step: 1,
    file: null,
    dragOver: false,
    previewUrl: null,
    filter: {
      kingdom: "",
      option: "",
      package: "",
    },
    days: [
      { label: "วันอาทิตย์", value: "Sunday" },
      { label: "วันจันทร์", value: "Monday" },
      { label: "วันอังคาร", value: "Tuesday" },
      { label: "วันพุท", value: "Wednesday" },
      { label: "วันพฤหัสบดี", value: "Thursday" },
      { label: "วันศุกร์", value: "Friday" },
      { label: "วันเสาร์", value: "Saturday" },
    ],
    packages: ["Exclusive Package", "Family Package", "Group Package"],
    packages_selected: [],
    options: ["รายวัน", "รายเดือน", "รายเทมอ", "รายปี"],
    options_selected: [],
    step_header_data: ["คอร์สเรียน", "ช่วงเวลาและโค้ช", "แพ็คเกจ"],
    courses: ["โค้ชหนุ่ม", "โค้ชพอล"],
    kingdoms: ["อาณาจักรศิลปะสมัยใหม่", "อาณาจักร P.E."],
    rules: {  
      course_name_th: [val => (val || '').length > 0 || 'โปรดระบุชื่อคอร์ส(ภาษาไทย)'],
      course_name_en: [val => (val || '').length > 0 || 'โปรดระบุชื่อคอร์ส(ภาษาอังกฤษ)'],
      kingdom: [val => (val || '').length > 0 || 'โปรดเลือกอาณาจักร'],
      course_open_date : [val => (val || '').length > 0 || 'โปรดเลือกวันที่เปิดคอร์ส'],
      course_hours : [val => (val || '').length > 0 || 'โปรดระบุชั่วโมงการเรียน/ครั้ง'],
      location : [val => (val || '').length > 0 || 'โปรดระบุสถานที่'],
      course :[val => (val || '').length > 0 || 'โปรดระบุโค้ช'],
      start_date : [val => (val || '').length > 0 || 'โปรดเลือกวันที่เริ่ม'],
      end_date : [val => (val || '').length > 0 || 'โปรดเลือกวันที่สิ้นสุด'],
      start_time : [val => (val || '').length > 0 || 'โปรดเลือกเวลาเริ่ม'],
      end_time : [val => (val || '').length > 0 || 'โปรดเลือกเวลาสิ้นสุด'],
    },
    course_open_date_str : "",
    register_date_range_str : {
      start_date : "",
      end_date : "",
    },
    class_date_range_str : {
      start_date : "",
      end_date : "",
    }
  }),
  created() {},
  mounted() {},
  watch: {
    "course_data.type"(newQuestion) {
      if (newQuestion) {
        this.step = 1;
      }
    },
  },
  computed: {
    ...mapGetters({
      course_data: "CourseModules/getCourseData",
    }),
  },
  methods: {
    ...mapActions({
      ChangeCourseData: "CourseModules/ChangeCourseData",
    }),
    save(){},
    inputName(e, lang){
      inputValidation(e, lang)
    },
    inputDate(e,data){
      switch (data) {
        case "course open":
            this.course_data.course_open_date_str = dateFormatter(e, "DD MT YYYYT")
          break;
        case "register start date":
            this.register_date_range_str.start_date = dateFormatter(e, "DD MT YYYYT")
          break;
        case "register end date":
            this.register_date_range_str.end_date = dateFormatter(e, "DD MT YYYYT")
          break;
        case "class start date":
            this.class_date_range_str.start_date = dateFormatter(e, "DD MT YYYYT")
          break;
        case "class end date":
            this.class_date_range_str.end_date = dateFormatter(e, "DD MT YYYYT")
          break;
      }
    },
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      if (!this.file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.file);
    },
    addCoach() {
      this.course_data.coachs.push({
        close_coach: false,
        coach_name: "",
        teach_day_data: [
          {
            teach_day: [],
            class_date: [
              {
                class_date_range: {
                  start_date: "",
                  menu_start_date: false,
                  end_date: "",
                  menu_end_date: false,
                },
                students: 0,
              },
            ],
          },
        ],
        class_date_range: {
          start_date: "",
          menu_start_date: false,
          end_date: "",
          menu_end_date: false,
        },
        register_date_range: {
          start_date: "",
          menu_start_date: false,
          end_date: "",
          menu_end_date: false,
        },
        period: {
          start_date: "",
          menu_start_date: false,
          end_date: "",
          menu_end_date: false,
        },
      });
      this.ChangeCourseData(this.course_data);
    },
    removeCoach(data, index) {
      data.splice(index, 1);
      this.ChangeCourseData(this.course_data);
    },
    addPackage(data) {
      data.push({
        package: "",
        students: 0,
        options: [
          {
            period_package: "",
            amount: 0,
            price_unit: 0,
            discount: false,
            discount_price: 0,
            privilege: "",
            net_price: 0,
            net_price_unit: 0,
          },
        ],
      });
      this.ChangeCourseData(this.course_data);
    },
  },
};
</script>

      