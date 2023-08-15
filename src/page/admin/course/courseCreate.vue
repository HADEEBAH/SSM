<template>
  <v-app>
    <v-img
      v-if="$vuetify.breakpoint.smAndUp"
      class="img-header"
      src="@/assets/course/img_header.png"
    ></v-img>
    <v-container>
      <headerPage title="สร้างคอร์สเรียน"></headerPage>
      <v-radio-group v-model="course_data.course_type_id">
        <v-row dense>
          <v-col cols="12" sm="3">
            <v-radio color="green" value="CT_1">
              <template v-slot:label>
                <v-row dense>
                  <v-col cols="4" sm="12">
                    <v-img
                      src="@/assets/course/general_course_icon.jpg"
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
            <v-radio color="green" value="CT_2">
              <template v-slot:label>
                <v-row dense>
                  <v-col cols="4" sm="12">
                    <v-img
                      src="@/assets/course/short_course_icon.jpg"
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
          v-if="course_data.course_type_id === 'CT_1'"
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
          <v-form ref="course_form" v-model="steps[step - 1]">
            <course-card :categorys="categorys" :coachs="coachs"></course-card>
          </v-form>
        </v-stepper-content>
        <!-- Step 2 -->
        <v-stepper-content class="overflow-none pa-2" step="2">
          <v-form ref="coach_form" v-model="steps[step - 1]">
            <v-card flat>
              <headerCard title="รายละเอียดเวลาและโค้ช">
                <template v-slot:actions>
                  <v-btn outlined color="#FF6B81" @click="addCoach">
                    <v-icon>mdi-plus-circle-outline</v-icon>
                    เพิ่มโค้ช
                  </v-btn>
                </template>
              </headerCard>
              <v-card-text>
                <v-divider class="mb-3"></v-divider>
                <!-- COACH -->
                <coachs-card :coachs="coachs"></coachs-card>
              </v-card-text>
            </v-card>
          </v-form>
        </v-stepper-content>
        <!-- Step 3 -->
        <v-stepper-content step="3" class="pa-2">
          <v-form ref="package_form" v-model="steps[step - 1]">
            <package-card></package-card>
            <v-row dense>
              <v-col class="d-flex align-center justify-center" cols="12">
                <v-btn
                  outlined
                  color="#FF6B81"
                  @click="addPackage(course_data.packages)"
                  ><v-icon>mdi-plus-circle-outline</v-icon>เพิ่มแพ็กเกจ</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-stepper-content>
        <!-- STEP 4 -->
        <v-stepper-content step="4" class="pa-2">
          <v-form ref="privilege_form" v-model="steps[step - 1]">
            <v-card class="mx-3" flat>
              <headerCard title="สิทธิ์พิเศษ"></headerCard>
              <v-card-text
                class="border-dashed border-2 border-blue-600 rounded-lg"
              >
                <v-row v-if="preview_privilege_url">
                  <v-col align="center" class="rounded-lg pa-0">
                    <v-img
                      :src="preview_privilege_url"
                      contain
                      style="max-width: 200px"
                      align="right"
                    >
                      <v-btn
                        icon
                        class="bg-[#f00]"
                        dark
                        @click="removePrivilegeFile"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </v-img>
                  </v-col>
                </v-row>
                <v-row v-if="!preview_privilege_url">
                  <v-col cols="12" class="flex align-center justify-center">
                    <v-img
                      src="@/assets/course/upload_file.png"
                      max-height="105"
                      max-width="122"
                    ></v-img>
                  </v-col>
                  <v-col
                    cols="12"
                    class="flex align-center justify-center text-h5"
                  >
                    อัปโหลดภาพสิทธิ์พิเศษ
                  </v-col>
                  <v-col
                    cols="12"
                    class="flex align-center justify-center text-caption"
                  >
                    ( คำแนะนำ : ควรอัปโหลดรูปที่มีขนาด 1024 x 576 (16:9) และ
                    ขนาดไฟล์ไม่เกิน 10 Mb ต้องเป็นไฟล์ JPG, PNG )
                  </v-col>
                  <v-col cols="12" class="flex align-center justify-center">
                    <v-btn
                      outlined
                      color="blue"
                      @click="openFilePrivilegeSelector"
                      >เลือกไฟล์</v-btn
                    >
                    <input
                      ref="fileInputPrivilege"
                      type="file"
                      @change="uploadPrivilegeFile"
                      accept="image/png, image/jpeg"
                      style="display: none"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
              <headerCard title="Learning Journey"></headerCard>
              <v-card-text
                class="border-dashed border-2 border-blue-600 rounded-lg"
              >
                <v-row
                  v-if="
                    preview_artwork_files && preview_artwork_files.length > 0
                  "
                >
                  <v-col
                    cols="3"
                    align="center"
                    class="rounded-lg pa-2"
                    v-for="(file, index) in preview_artwork_files"
                    :key="index"
                  >
                    <v-img
                      :src="file"
                      contain
                      max-height="200"
                      max-width="200"
                      align="right"
                    >
                      <v-btn
                        icon
                        class="bg-[#f00]"
                        dark
                        @click="removeArtworkFile(index)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </v-img>
                  </v-col>
                </v-row>
                <v-row
                  v-if="
                    !preview_artwork_files || preview_artwork_files.length == 0
                  "
                >
                  <v-col cols="12" class="flex align-center justify-center">
                    <v-img
                      src="@/assets/course/upload_file.png"
                      max-height="105"
                      max-width="122"
                    ></v-img>
                  </v-col>
                  <v-col
                    cols="12"
                    class="flex align-center justify-center text-h5"
                  >
                    อัปโหลดภาพ Learning Journey
                  </v-col>
                  <v-col
                    cols="12"
                    class="flex align-center justify-center text-caption"
                  >
                    ( คำแนะนำ : ควรอัปโหลดรูปที่มีขนาด 1024 x 576 (16:9) และ
                    ขนาดไฟล์ไม่เกิน 10 Mb ต้องเป็นไฟล์ JPG, PNG )
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col align="center">
                    <input
                      ref="fileInputArtwork"
                      type="file"
                      @change="previewArtWorkFile"
                      accept="image/png, image/jpeg"
                      multiple
                      style="display: none"
                    />
                    <v-btn outlined color="blue" @click="openFileArtworSelector"
                      >เลือกไฟล์</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-form>
        </v-stepper-content>
        <v-card flat>
          <v-card-text>
            <v-row dense v-if="course_data.course_type_id === 'CT_1'">
              <v-col cols="12" sm align="right">
                <v-btn
                  v-if="step > 1"
                  color="#FF6B81"
                  :class="
                    $vuetify.breakpoint.smAndDown ? 'w-full' : 'btn-size-lg'
                  "
                  text
                  @click="step = step - 1"
                  >ย้อนกลับ</v-btn
                >
              </v-col>
              <v-col cols="12" sm="auto" v-if="step < 4">
                <v-btn
                  dark
                  color="#FF6B81"
                  :class="
                    $vuetify.breakpoint.smAndDown ? 'w-full' : 'btn-size-lg'
                  "
                  class="white--text"
                  depressed
                  @click="submitStep(step - 1)"
                  >ถัดไป</v-btn
                >
              </v-col>
              <v-col cols="12" sm="auto" v-else>
                <v-btn
                  color="#FF6B81"
                  class="white--text w-full"
                  depressed
                  :loading="loading"
                  @click="submitStep(step - 1)"
                  >สร้างคอร์สเรียน</v-btn
                >
              </v-col>
            </v-row>
            <v-row dense v-else>
              <v-col cols="12" sm align="right">
                <v-btn
                  color="#FF6B81"
                  class="white--text"
                  depressed
                  :loading="loading"
                  @click="submitStep(step - 1)"
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
import CourseCard from "@/components/course/courseCard.vue";
import {
  inputValidation,
  dateFormatter,
  CheckFileSize,
} from "@/functions/functions";
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
    steps: [false, false, false, false],
    file: null,
    dragOver: false,
    previewUrl: null,
    filter: {
      kingdom: "",
      option: "",
      package: "",
    },
    step_header_data: [
      "คอร์สเรียน",
      "ช่วงเวลาและโค้ช",
      "แพ็กเกจ",
      "สิทธิ์พิเศษ",
    ],
    courses: ["โค้ชหนุ่ม", "โค้ชพอล"],
    kingdoms: ["อาณาจักรศิลปะสมัยใหม่", "อาณาจักร P.E."],
    course_open_date_str: "",
    register_date_range_str: {
      start_date: "",
      end_date: "",
    },
    class_date_range_str: {
      start_date: "",
      end_date: "",
    },
    privilege_file: null,
    preview_privilege_url: null,
    artwork_files: [],
    preview_artwork_files: [],
    loading: false,
  }),
  created() {
    if (this.course_data) {
      this.ResetCourseData();
    }
    this.$store.dispatch("CategoryModules/GetCategorys");
    this.$store.dispatch("CourseModules/GetCoachs");
  },
  mounted() {
    this.$store.dispatch("CategoryModules/GetCategorys");
    this.$store.dispatch("CourseModules/GetCoachs");
  },
  watch: {
    "course_data.course_type_id"(newQuestion) {
      if (newQuestion) {
        this.ResetCourseData();
        this.step = 1;
        this.course_data.course_type_id = newQuestion;
        this.privilege_file = null;
        this.preview_privilege_url = null;
        this.artwork_files = [];
        this.preview_artwork_files = [];
      }
    },
  },
  computed: {
    ...mapGetters({
      course_data: "CourseModules/getCourseData",
      coachs: "CourseModules/getCoachs",
      categorys: "CategoryModules/getCategorys",
    }),
  },
  methods: {
    ...mapActions({
      ChangeCourseData: "CourseModules/ChangeCourseData",
      CreateCourse: "CourseModules/CreateCourse",
      ResetCourseData: "CourseModules/ResetCourseData",
    }),
    save() {
      this.loading = true;
      this.course_data.course_file = this.file;
      this.ChangeCourseData(this.course_data);
      this.CreateCourse();
    },
    inputName(e, lang) {
      inputValidation(e, lang);
    },
    inputDate(e, data) {
      switch (data) {
        case "course open":
          this.course_data.course_open_date_str = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
        case "register start date":
          this.register_date_range_str.start_date = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
        case "register end date":
          this.register_date_range_str.end_date = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
        case "class start date":
          this.class_date_range_str.start_date = dateFormatter(
            e,
            "DD MT YYYYT"
          );
          break;
        case "class end date":
          this.class_date_range_str.end_date = dateFormatter(e, "DD MT YYYYT");
          break;
      }
    },
    openFilePrivilegeSelector() {
      this.$refs.fileInputPrivilege.click();
    },
    openFileArtworSelector() {
      this.$refs.fileInputArtwork.click();
    },
    submitStep(index) {
      if (this.course_data.course_type_id === "CT_1") {
        if (index === 0) {
          this.$refs.course_form.validate();
          if (this.steps[index]) {
            this.step += 1;
          }
        } else if (index === 1) {
          this.$refs.coach_form.validate();
          if (this.steps[index]) {
            this.step += 1;
          }
        } else if (index === 2) {
          this.$refs.package_form.validate();
          if (this.steps[index]) {
            this.step += 1;
          }
        } else if (index === 3) {
          this.save();
        }
      } else if (this.course_data.course_type_id === "CT_2") {
        this.$refs.course_form.validate();
        if (this.steps[index]) {
          this.save();
        }
      }
    },
    addCoach() {
      this.course_data.coachs.push({
        coach_id: "",
        coach_name: "",
        teach_days_used: [],
        teach_day_data: [
          {
            class_open: false,
            teach_day: [],
            class_date: [
              {
                class_date_range: {
                  start_time: "",
                  start_time_object: { HH: "", mm: "" },
                  menu_start_time: false,
                  end_time: "",
                  end_time_object: { HH: "", mm: "" },
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
          start_time_object: { HH: "", mm: "" },
          end_time: "",
          end_time_object: { HH: "", mm: "" },
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
    // UPDATE FILE
    uploadPrivilegeFile() {
      this.privilege_file = this.$refs.fileInputPrivilege.files[0];
      const allowedTypes = ["image/png", "image/jpeg"];
      if (CheckFileSize(this.privilege_file) === true) {
        this.course_data.privilege_file =
          this.$refs.fileInputPrivilege.files[0];
        this.ChangeCourseData(this.course_data);
        if (
          this.privilege_file &&
          allowedTypes.includes(this.privilege_file.type)
        ) {
          if (!this.privilege_file) return;
          const reader = new FileReader();
          reader.onload = (e) => {
            this.preview_privilege_url = e.target.result;
          };
          reader.readAsDataURL(this.privilege_file);
        }
      }
    },
    previewArtWorkFile(event) {
      const selectedFiles = event.target.files;
      const allowedTypes = ["image/png", "image/jpeg"];
      const fileUrls = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (CheckFileSize(file) === true) {
          if (allowedTypes.includes(file.type)) {
            this.course_data.artwork_file.push(file);
            const reader = new FileReader();
            reader.onload = () => {
              fileUrls.push(reader.result);
              if (fileUrls.length == selectedFiles.length) {
                this.preview_artwork_files = [
                  ...this.preview_artwork_files,
                  ...fileUrls,
                ];
              }
            };
            reader.readAsDataURL(file);
          } else {
            // Display error message or handle invalid file type
          }
        }
      }
      this.ChangeCourseData(this.course_data);
    },
    // REMOVE
    removeArtworkFile(index) {
      this.preview_artwork_files.splice(index, 1);
    },
    removePrivilegeFile() {
      this.preview_privilege_url = null;
    },
  },
};
</script>
