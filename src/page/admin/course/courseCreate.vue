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
          <v-form ref="course_form" v-model="steps[step-1]">
            <course-card :categorys="categorys" :coachs="coachs"></course-card>
          </v-form>
        </v-stepper-content>
        <!-- Step 2 -->
        <v-stepper-content step="2" class="pa-2">
          <v-form ref="coach_form" v-model="steps[step-1]">
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
                <coachs-card :coachs="coachs"></coachs-card>
              </v-card-text>
            </v-card>
          </v-form>
        </v-stepper-content>
        <!-- Step 3 -->
        <v-stepper-content step="3" class="pa-2">
          <v-form ref="package_form" v-model="steps[step-1]">
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
          </v-form>
        </v-stepper-content>
        <v-card flat>
          <v-card-text>
            <v-row dense v-if="course_data.type === 'general_course'">
              <v-col cols="12" sm align="right">
                <v-btn
                  v-if="step > 1"
                  color="#FF6B81"
                  :class="$vuetify.breakpoint.smAndDown ? 'w-full' : ''"
                  text
                  @click="step = step - 1"
                  >ย้อนกลับ</v-btn
                >
              </v-col>
              <v-col cols="12" sm="auto" v-if="step < 3">
                <v-btn
                  dark
                  color="#FF6B81"
                  :class="$vuetify.breakpoint.smAndDown ? 'w-full' : 'btn-size-lg'"
                  class="white--text"
                  depressed
                  @click="submitStep(step-1)"
                  >ถัดไป</v-btn
                >
              </v-col>
              <v-col cols="12" sm="auto" v-else>
                <v-btn
                  color="#FF6B81"
                  class="white--text w-full"
                  depressed
                  @click="submitStep(step-1)"
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
                  @click="submitStep(step-1)"
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
    steps:[false, false, false],
    file: null,
    dragOver: false,
    previewUrl: null,
    filter: {
      kingdom: "",
      option: "",
      package: "",
    },
    step_header_data: ["คอร์สเรียน", "ช่วงเวลาและโค้ช", "แพ็คเกจ"],
    courses: ["โค้ชหนุ่ม", "โค้ชพอล"],
    kingdoms: ["อาณาจักรศิลปะสมัยใหม่", "อาณาจักร P.E."],
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
  created() {
    if(this.course_data){
      this.ResetCourseData()
    }
    this.$store.dispatch("CategoryModules/GetCategorys")
    this.$store.dispatch("CourseModules/GetCoachs");
  },
  mounted() {
    this.$store.dispatch("CategoryModules/GetCategorys")
    this.$store.dispatch("CourseModules/GetCoachs");
  },
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
      coachs: "CourseModules/getCoachs",
      categorys : "CategoryModules/getCategorys",
    }),
  },
  methods: {
    ...mapActions({
      ChangeCourseData: "CourseModules/ChangeCourseData",
      CreateCourse : "CourseModules/CreateCourse",
      ResetCourseData : "CourseModules/ResetCourseData"
    }),
    save(){
      this.course_data.course_file = this.file
      this.ChangeCourseData(this.course_data);
      this.CreateCourse()
    },
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
    submitStep(index){
      console.log(this.course_data.type)
      if(this.course_data.type === "general_course"){
        if(index === 0){
          this.$refs.course_form.validate()
          if(this.steps[index]){
            this.step += 1;
          }
        }else if(index === 1){
          this.$refs.coach_form.validate()
          if(this.steps[index]){
            this.step += 1;
          }
        }else if(index === 2){
          this.$refs.package_form.validate()
          if(this.steps[index]){
            this.save()
          }
        }
      }else if(this.course_data.type === "short_course"){
        this.$refs.course_form.validate()
          if(this.steps[index]){
            this.save()
          }
      } 
    },
    // uploadFile() {
    //   this.file = this.$refs.fileInput.files[0];
    //   console.log("file=>",this.file);
    //   if (!this.file) return;
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     this.preview_url = e.target.result;
    //   };
    //   reader.readAsDataURL(this.file);
    // },
    
    addCoach() {
      this.course_data.coachs.push({
        coach_id : "",
        coach_name: "",
        teach_days_used : [],
        teach_day_data: [
          {
            class_open: false,
            teach_day: [],
            class_date: [
              {
                class_date_range: {
                  start_time: "",
                  menu_start_time: false,
                  end_time: "",
                  menu_end_time: false,
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
          start_time: "",
          end_time: "",
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

      