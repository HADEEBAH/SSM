<template>
  <v-app>
    <v-img
      v-if="$vuetify.breakpoint.smAndUp"
      class="img-header"
      src="@/assets/course/img_header.png"
    ></v-img>
    <v-container>
      <headerPage :title="$t(`create a course`)"> </headerPage>
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
                    <label>{{ $t("regular course") }}</label>
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
                    <label>{{ $t("short course") }}</label>
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
                >{{ $t(header) }}</label
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
            <course-card
              :categorys="categorys"
              :coachs="coachs"
              :course_type="course_data.course_type_id"
            ></course-card>
          </v-form>
        </v-stepper-content>
        <!-- Step 2 -->
        <v-stepper-content class="overflow-none pa-2" step="2">
          <v-form ref="coach_form" v-model="steps[step - 1]">
            <v-card flat>
              <headerCard :title="$t(`details of time and coach`)">
                <template v-slot:actions>
                  <v-btn outlined color="#FF6B81" @click="addCoach">
                    <v-icon>mdi-plus-circle-outline</v-icon>
                    {{ $t("add a coach") }}
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
                  v-if="data_package?.length < 3"
                  color="#FF6B81"
                  @click="addPackage()"
                  ><v-icon>mdi-plus-circle-outline</v-icon>
                  {{ $t("add package") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-stepper-content>
        <!-- STEP 4 -->
        <v-stepper-content step="4" class="pa-2">
          <v-form ref="privilege_form" v-model="steps[step - 1]">
            <v-card class="mx-3" flat>
              <headerCard :title="$t(`special rights`)"></headerCard>
              <v-card-text
                class="border-dashed rounded-lg"
                style="border: dashed rgb(255, 107, 129)"
              >
                <v-row v-if="preview_privilege_url">
                  <v-col align="center" class="rounded-lg pa-0">
                    <v-img
                      :src="preview_privilege_url"
                      style="max-width: 300px"
                      :aspect-ratio="16 / 9"
                      class="rounded-lg"
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
                    {{ $t("upload privileged images") }}
                  </v-col>
                  <v-col
                    cols="12"
                    class="flex align-center justify-center text-caption"
                  >
                    {{
                      $t(
                        "suggestion : Should upload an image with size 1024 x 576 (16:9) and file size not over 5 Mb must be JPG, PNG file"
                      )
                    }}
                  </v-col>
                  <v-col cols="12" class="flex align-center justify-center">
                    <v-btn
                      outlined
                      color="#FF6B81"
                      @click="openFilePrivilegeSelector"
                      >{{ $t("select file") }}</v-btn
                    >
                    <input
                      id="fileInputPrivilege"
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
                class="border-dashed border-2 rounded-lg"
                style="border: dashed rgb(255, 107, 129)"
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
                      style="max-width: 300px"
                      :aspect-ratio="16 / 9"
                      class="rounded-lg"
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
                    {{ $t("upload Learning Journey") }}
                  </v-col>
                  <v-col
                    cols="12"
                    class="flex align-center justify-center text-caption"
                  >
                    {{
                      $t(
                        "suggestion : Should upload an image with size 1024 x 576 (16:9) and file size not over 5 Mb must be JPG, PNG file"
                      )
                    }}
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col align="center">
                    <input
                      id="fileInputArtwork"
                      ref="fileInputArtwork"
                      type="file"
                      @change="previewArtWorkFile"
                      accept="image/png, image/jpeg"
                      multiple
                      style="display: none"
                    />
                    <v-btn
                      outlined
                      color="#FF6B81"
                      @click="openFileArtworSelector"
                      >{{ $t("select file") }}</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-text>
              <!-- ADD LINK YOUTUBE -->
              <v-card class="my-5 rounded-lg">
                <v-app-bar dark color="#FF6B81">
                  <v-toolbar-title>{{ $t("add video link") }}</v-toolbar-title>

                  <v-spacer></v-spacer>
                </v-app-bar>
                <!-- <iframe width="100%" height="100%" src="https://www.youtube.com/embed/KOFFt04zS6o?si=ahE26X4iqHEtMTAr&autoplay=1&mute=1" title="Zweed n&#39; Roll - ช่วงเวลา (A Moment) [Official Video]" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen allow="autoplay"></iframe> -->
                <v-card-text>
                  <div
                    v-for="(item_vdo, index_vdo) in linkArray"
                    :key="index_vdo"
                  >
                    <v-row dense>
                      <!-- 1111 -->
                      <v-col cols="4" align-self="center">
                        <v-text-field
                          :label="$t('link vdo')"
                          prepend-icon="mdi-youtube"
                          color="#FF6B81"
                          v-model="item_vdo.url"
                        ></v-text-field>
                      </v-col>
                      <!-- <v-col></v-col> -->
                      <!-- 2222 -->
                      <v-col cols="6">
                        <v-card flat v-if="item_vdo.url">
                          <v-btn
                            icon
                            small
                            class="bg-[#cdcdcd] absolute top-2 right-14 z-[4]"
                            dark
                            @click="showImageDialog(item_vdo)"
                            ><v-icon>mdi-eye</v-icon></v-btn
                          >

                          <div
                            id="video"
                            class="rounded-lg d-flex justify-center align-center"
                            style="
                              max-height: 50%;
                              max-width: 80%;
                              object-fit: cover;
                              margin: auto;
                            "
                            v-html="item_vdo.url"
                          ></div>
                        </v-card>
                      </v-col>
                      <!-- 3333 -->
                      <v-col cols="2" align-self="center">
                        <v-btn text @click="deleteLink(index_vdo)" color="red">
                          <v-icon color="red">mdi-minus-circle</v-icon>
                          {{ $t("delete item") }}
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                  </div>
                  <div
                    class="rounded-lg d-flex justify-center align-center my-3"
                  >
                    <v-btn
                      @click="addNewLink"
                      outlined
                      color="#ff6b81"
                      class="rounded-lg"
                    >
                      <v-icon>mdi-plus-circle</v-icon>
                      {{ $t("add item") }}
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-card>
            <!-- DIALOG SHOW IMAGE -->
            <v-dialog
              persistent
              :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
              v-model="show_attachment_dialog"
            >
              <v-card>
                <v-container grid-list-xs>
                  <v-row>
                    <v-col cols="12" class="text-center">
                      <v-btn
                        icon
                        class="bg-[#cdcdcd] absolute top-1 right-1"
                        dark
                        @click="
                          show_attachment_dialog = !show_attachment_dialog
                        "
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                      <span class="font-weight-bold"
                        >{{ $t("image example") }}
                      </span>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <!-- IMAGE -->
                      <v-img
                        v-if="typeImg === 'img'"
                        contain
                        :src="biggesImage"
                        class="max-h-[300px] max-w-300px rounded-lg"
                        :aspect-ratio="16 / 9"
                      >
                        <template v-slot:placeholder>
                          <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                          >
                            <v-progress-circular
                              indeterminate
                              color="#ff6b81"
                            ></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                      <!-- VDO -->
                      <video
                        v-else-if="typeImg === 'video'"
                        class="rounded-lg d-flex justify-center align-center"
                        style="object-fit: cover; margin: auto"
                        autoplay
                        muted
                        controls
                        loop
                      >
                        <source :src="biggesImage" type="video/mp4" />
                      </video>

                      <!-- YOUTUBE -->
                      <div
                        v-else
                        id="video"
                        class="rounded-lg d-flex justify-center align-center"
                        :aspect-ratio="16 / 9"
                        :style="
                          $vuetify.breakpoint.smAndUp
                            ? 'height: 315px; width: 440px; object-fit: cover; margin: auto;'
                            : 'object-fit: cover; margin: auto;'
                        "
                        v-html="biggesImage"
                      ></div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-dialog>
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
                  >{{ $t("back") }}</v-btn
                >
              </v-col>
              <v-col cols="12" sm="auto" v-if="step < 4">
                <!-- :disabled="!steps[step - 1]" -->
                <v-btn
                  :dark="steps[step - 1]"
                  color="#FF6B81"
                  :class="
                    $vuetify.breakpoint.smAndDown ? 'w-full' : 'btn-size-lg'
                  "
                  class="white--text"
                  depressed
                  :disabled="!steps[step - 1]"
                  @click="submitStep(step - 1)"
                  >{{ $t("next") }}</v-btn
                >
              </v-col>
              <v-col cols="12" sm="auto" v-else>
                <v-btn
                  color="#FF6B81"
                  class="white--text w-full"
                  depressed
                  :loading="loading"
                  @click="submitStep(step - 1)"
                  >{{ $t("create a course") }}</v-btn
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
                  :disabled="!steps[step - 1]"
                  :dark="steps[step - 1]"
                  >{{ $t("create a course") }}</v-btn
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
import Swal from "sweetalert2";

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
    step_header_data: ["course", "duration/coach", "package", "special rights"],
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
    linkArray: [
      {
        url: null,
        type: null,
        close: false,
      },
    ],
    biggesImage: null,
    show_attachment_dialog: false,
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
      course_data: "CourseModules/getCoursesData",
      course_create_data: "CourseModules/getCourseData",
      coachs: "CourseModules/getCoachs",
      categorys: "CategoryModules/getCategorys",
      coach_data: "CourseModules/getCoachData",
      data_package: "CourseModules/getPackageData",
    }),
  },
  methods: {
    ...mapActions({
      // ChangeCourseData: "CourseModules/ChangeCourseData",
      CreateCourse: "CourseModules/CreateCourse",
      ResetCourseData: "CourseModules/ResetCourseData",
      // CoachData: "CourseModules/CoachData",
    }),
    addNewLink() {
      this.linkArray.push({
        url: null,
        type: null,
        close: false,
      });
    },
    deleteLink(index_vdo) {
      this.linkArray.splice(index_vdo, 1);
    },

    showImageDialog(item) {
      this.biggesImage = item.url ? item.url : item;
      this.typeImg = item.type;
      this.show_attachment_dialog = true;
    },
    save() {
      this.loading = true;
      // this.course_data.course_file = this.file;

      if (this.course_data.course_type_id === "CT_1") {
        const mapped_coachs = this.coach_data.map((coach) => ({
          coach_id: coach.coach_id,
          day_of_week: coach.teach_day_data.map((dayData) => ({
            status: dayData.class_open ? "Active" : "Inactive",
            day: dayData.teach_day.join(","),
            times: dayData.class_date.map((classDate) => ({
              start: classDate.class_date_range.start_time,
              end: classDate.class_date_range.end_time,
              maximum_student: classDate.students,
            })),
          })),
        }));

        const mapped_packages = this.data_package.flatMap((items_package) =>
          items_package.options.map((option) => ({
            package_id: items_package.package_id,
            option_id: option.option_id,
            hour_per_pime: option.amount ? option.amount : 0, // Static value as it's not in input data
            option_description: option.option_description
              ? option.option_description
              : null,
            discount_status: option.discount || false,
            discount_price: option.discount_price || 0,
            price_per_person: option.price_unit || 0,
            student_number: items_package.students || 0,
          }))
        );
        let payload_create_course = {
          reservation: !this.course_data.reservation ? false : true,
          reservation_end_date: this.course_data.reservation_end_date,
          reservation_start_date: this.course_data.reservation_start_date,
          category_id: this.course_data.category_id,
          course_type_id: this.course_data.course_type_id,
          course_img: null,
          course_name_th: this.course_data.course_name_th,
          course_name_en: this.course_data.course_name_en,
          course_open_date: this.course_data.course_open_date,
          course_per_time: this.course_data.course_hours,
          course_student_recived: this.course_data.student_recived
            ? this.course_data.student_recived
            : 0,
          course_location: this.course_data.location,
          course_description: this.course_data.description,
          course_music_performance: this.course_data.music_performance,
          course_certification: this.course_data.certification,
          course_price: 0,
          discount_price: 0,
          course_register_start_date: null,
          course_register_end_date: null,
          coachs: mapped_coachs ? mapped_coachs : null,
          // dayOfweek: mapped_dayOfweek ? mapped_dayOfweek : null,
          course_packages: mapped_packages ? mapped_packages : null,
        };
        this.CreateCourse({
          course_payload: payload_create_course,
          course_file: this.course_data.courseImg,
          privilege_file: this.course_create_data.privilege_file,
          artwork_file: this.course_create_data.artwork_file,
        }).then(() => {
          this.loading = false;
        });
      } else {
        let payload_create_course = {
          reservation: !this.course_data.reservation ? false : true,
          reservation_end_date: this.course_data.reservation_end_date,
          reservation_start_date: this.course_data.reservation_start_date,
          category_id: this.course_data.category_id,
          course_type_id: this.course_data.course_type_id,
          course_img: null,
          course_name_th: this.course_data.course_name_th,
          course_name_en: this.course_data.course_name_en,
          course_open_date: this.course_data.course_open_date,
          course_per_time: this.course_data.course_hours,
          course_student_recived: this.course_data.student_recived
            ? this.course_data.student_recived
            : 0,
          course_location: this.course_data.location,
          course_description: this.course_data.description,
          course_music_performance: this.course_data.music_performance,
          course_certification: this.course_data.certification,
          course_register_start_date:
            this.course_data.course_register_date.start_date_formatted,
          course_register_end_date:
            this.course_data.course_register_date.end_date_formatted,
          course_study_start_date:
            this.course_data.course_study_date.start_date_formatted,
          course_study_end_date:
            this.course_data.course_study_date.end_date_formatted,
          course_period_start_date:
            this.course_data.course_study_time.start_time,
          course_period_end_date: this.course_data.course_study_time.end_time,
          course_price: this.course_data.course_price
            ? this.course_data.course_price
            : 0,
          discount_price: this.course_data.discount_price
            ? this.course_data.discount_price
            : 0,
          discount_bool: this.course_data.checked_discount
            ? this.course_data.checked_discount
            : false,
          coachs: [
            {
              coach_id: this.course_data.coach_id,
              day_of_week: [
                {
                  status: "Active",
                  day: this.course_data.teach_day.join(","),
                  times: [
                    {
                      start: this.course_data.course_study_time.start_time,
                      end: this.course_data.course_study_time.end_time,
                      maximum_student: this.course_data.student_recived,
                    },
                  ],
                },
              ],
            },
          ],
          status: "active",
          course_packages: [],
        };
        this.CreateCourse({
          course_payload: payload_create_course,
          course_file: this.course_data.courseImg,
        }).then(() => {
          this.loading = false;
        });
      }
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
      this.$refs.fileInputArtwork.value = null;
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
      this.coach_data.push({
        course_id: null,
        coach_id: null,
        course_coach_id: null,
        coach_name: null,
        register_date_range: {
          start_date: "",
          menu_start_date: false,
          end_date: "",
          menu_end_date: false,
        },
        teach_day_data: [
          {
            day_of_week_id: null,
            class_open: false,
            teach_day: [],
            course_coach_id: null,
            class_date: [
              {
                start_time: null,
                class_date_range: {
                  time_id: null,
                  day_of_week_id: null,
                  start_time: null,
                  start_time_object: {
                    HH: null,
                    mm: null,
                  },
                  menu_start_time: false,
                  end_time: null,
                  end_time_object: {
                    HH: null,
                    mm: null,
                  },
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
        period: {
          start_time: "",
          start_time_object: { HH: "", mm: "" },
          end_time: "",
          end_time_object: { HH: "", mm: "" },
        },
      });

      // this.course_data.coachs.push({
      //   coach_id: "",
      //   coach_name: "",
      //   teach_days_used: [],
      //   teach_day_data: [
      //     {
      //       class_open: false,
      //       teach_day: [],
      //       class_date: [
      //         {
      //           class_date_range: {
      //             start_time: "",
      //             start_time_object: { HH: "", mm: "" },
      //             menu_start_time: false,
      //             end_time: "",
      //             end_time_object: { HH: "", mm: "" },
      //             menu_end_time: false,
      //           },
      //           students: 0,
      //         },
      //       ],
      //     },
      //   ],
      //   class_date_range: {
      //     start_date: "",
      //     menu_start_date: false,
      //     end_date: "",
      //     menu_end_date: false,
      //   },
      //   register_date_range: {
      //     start_date: "",
      //     menu_start_date: false,
      //     end_date: "",
      //     menu_end_date: false,
      //   },
      //   period: {
      //     start_time: "",
      //     start_time_object: { HH: "", mm: "" },
      //     end_time: "",
      //     end_time_object: { HH: "", mm: "" },
      //   },
      // });

      // this.ChangeCourseData(this.course_data);
    },
    removeCoach(data, index) {
      data.splice(index, 1);
      // this.ChangeCourseData(this.course_data);
    },
    addPackage() {
      this.data_package.push({
        package_id: null,
        package: null,
        students: 1,
        options: [
          {
            package_id: null,
            package: null,
            students: 0,
            options: [
              {
                option_id: null,
                period_package: null,
                amount: 0,
                price_unit: 0,
                discount: false,
                discount_price: 0,
                privilege: null,
                net_price: 0,
                net_price_unit: 0,
              },
            ],
          },
        ],
        option_selected: [],
        option_list: [
          {
            option_id: "OP_1",
            option_name: "รายวัน",
            option_name_en: "Daily",
          },
          {
            option_id: "OP_2",
            option_name: "รายเดือน",
            option_name_en: "Monthly",
          },
          {
            option_id: "OP_3",
            option_name: "รายเทอม",
            option_name_en: "Per term",
          },
          {
            option_id: "OP_4",
            option_name: "รายปี",
            option_name_en: "Yearly",
          },
          {
            option_id: "OP_5",
            option_name: "ราย 4 ครั้ง",
            option_name_en: "4 times",
          },
          {
            option_id: "OP_6",
            option_name: "ราย 2 เดือน",
            option_name_en: "2 months",
          },
          {
            option_id: "OP_7",
            option_name: "ราย 10 ครั้ง",
            option_name_en: "10 times",
          },
        ],
      });
      // this.ChangeCourseData(this.course_data);
    },
    // UPDATE FILE
    uploadPrivilegeFile(event) {
      this.privilege_file = this.$refs.fileInputPrivilege.files[0];
      const allowedTypes = ["image/png", "image/jpeg"];
      if (CheckFileSize(this.privilege_file, event.target.id) === true) {
        // this.course_data.privilege_file =
        //   this.$refs.fileInputPrivilege.files[0];
        this.course_create_data.privilege_file =
          this.$refs.fileInputPrivilege.files[0];
        // this.ChangeCourseData(this.course_data);
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
        if (CheckFileSize(file, event.target.id) === true) {
          if (allowedTypes.includes(file.type)) {
            this.course_create_data.artwork_file.push(file);
            // this.course_data.artwork_file.push(file);

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
            Swal.fire({
              icon: "error",
              title: this.$t("something went wrong"),
              text: this.$t("upload only image files (png, jpeg) only"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          }
        }
      }
      // this.ChangeCourseData(this.course_data);
    },
    // REMOVE
    removeArtworkFile(index) {
      this.preview_artwork_files.splice(index, 1);
      this.course_create_data.artwork_file.splice(index, 1);
    },
    removePrivilegeFile() {
      this.preview_privilege_url = null;
      this.course_create_data.privilege_file = null;
    },
  },
};
</script>
