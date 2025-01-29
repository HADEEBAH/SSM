<template>
  <v-container class="h-full">
    <v-row dense>
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-img
            :aspect-ratio="16 / 9"
            class="rounded-lg"
            :src="
              course_data.course_img || course_data.course_img !== ''
                ? course_data.course_img
                : require(`@/assets/course/default_course_img.svg`)
            "
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="#ff6b81"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
        <v-col cols="12" sm="6" class="d-flex flex-column">
          <v-row dense
            ><v-col class="text-lg font-bold">
              {{
                `${
                  $i18n.locale == "th"
                    ? course_data.course_name_th
                    : course_data.course_name_en
                }`
              }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="text-md">{{
              `${$t("by")} ${course_data.location}`
            }}</v-col>
          </v-row>
          <v-row v-if="course_data.course_type_id === 'CT_2'" dense>
            <v-col cols="auto">
              <v-icon class="mr-2" color="#ff6b81">mdi-currency-usd</v-icon>
            </v-col>
            <v-col class="font-bold"
              >{{
                parseFloat(
                  course_data.course_price ? course_data.course_price : 0
                ).toLocaleString()
              }}
              {{ $t("baht") }}/{{ $t("course") }}</v-col
            >
          </v-row>
          <v-row
            v-if="course_data.course_type_id === 'CT_2' && course_data.discount"
            dense
          >
            <v-col cols="auto">
              <v-icon class="mr-2" color="#ff6b81">mdi-sale</v-icon>
            </v-col>
            <v-col class="font-bold">
              {{ `${$t("discount")}` }}
              {{ parseFloat(course_data.discount).toLocaleString() }}
              {{ $t("baht") }}/{{ $t("course") }}</v-col
            >
          </v-row>
          <rowData
            v-if="course_data.course_type_id === 'CT_2'"
            col_detail="5"
            mini
            icon="mdi-account-group-outline"
          >
            <!-- {{
            course_monitors?.length == 1
              ? course_monitors[0].m_current_student
              : 0
          }}
          / {{ course_data.student_recived }} {{ $t("seat") }} -->
            {{
              course_seat.countSeatByCourse ? course_seat.countSeatByCourse : 0
            }}
            /
            {{
              course_seat.maxStudentByCourse
                ? course_seat.maxStudentByCourse
                : 0
            }}
            {{ $t("seat") }}
          </rowData>
          <rowData
            v-if="course_data.course_type_id === 'CT_1'"
            col_detail="5"
            mini
            icon="mdi-clock-time-four-outline"
            >{{ course_data.course_hours.toFixed(2) }} {{ $t("hrs.") }}/{{
              $t("time")
            }}</rowData
          >
          <v-row dense>
            <v-col cols="12" class="text-[#999999] overflow-hidden">
              <label v-html="course_data.detail"></label>
            </v-col>
          </v-row>
          <v-expansion-panels flat>
            <v-expansion-panel v-if="course_data.course_type_id === 'CT_2'">
              <v-expansion-panel-header class="px-0 font-bold">
                {{ $t("date and time") }}
                <template v-slot:actions>
                  <v-icon color="#ff6b81"> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="border-t pt-3">
                <v-row dense>
                  <v-col cols="auto" class="font-bold"
                    >{{ $t("admission date") }}:</v-col
                  >
                  <v-col>
                    {{
                      new Date(
                        course_data.course_register_start_date
                      ).toLocaleDateString(
                        $i18n.locale == "th" ? "th-TH" : "en-US",
                        date_options
                      )
                    }}
                    -
                    {{
                      new Date(
                        course_data.course_register_end_date
                      ).toLocaleDateString(
                        $i18n.locale == "th" ? "th-TH" : "en-US",
                        date_options
                      )
                    }}</v-col
                  >
                </v-row>
                <v-row dense>
                  <v-col cols="auto" class="font-bold"
                    >{{ $t("study date") }}:</v-col
                  >
                  <v-col
                    >{{
                      new Date(
                        course_data.course_study_start_date
                      ).toLocaleDateString(
                        $i18n.locale == "th" ? "th-TH" : "en-US",
                        date_options
                      )
                    }}
                    -
                    {{
                      new Date(
                        course_data.course_study_end_date
                      ).toLocaleDateString(
                        $i18n.locale == "th" ? "th-TH" : "en-US",
                        date_options
                      )
                    }}
                    ({{ course_data.course_period_start_date }}-{{
                      course_data.course_period_end_date
                    }}
                    {{ $t("o'clock") }})</v-col
                  >
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel v-if="course_data.course_type_id === 'CT_1'">
              <v-expansion-panel-header class="px-0 font-bold">
                {{ "Performance" }}
                <template v-slot:actions>
                  <v-icon color="#ff6b81"> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="border-t pt-3 overflow-hidden">
                <label v-html="course_data.music_performance"></label>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header class="px-0 font-bold">
                {{ "Certification" }}
                <template v-slot:actions>
                  <v-icon color="#ff6b81"> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="border-t pt-3 overflow-hidden">
                <label v-html="course_data.catification"></label>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <div
            v-if="
              course_data.artWorkImage?.length > 0 &&
              !$vuetify.breakpoint.smAndUp
            "
          >
            <!-- <headerCard title="Learning Journey"></headerCard> -->
            <v-row dense>
              <v-col cols="12" class="text-2xl my-5 font-bold">
                {{ $t("Learning Journey") }}
              </v-col>
              <v-col class="text-xl">
                {{ $t("image") }}
              </v-col>
            </v-row>
            <!-- IMAGE -->
            <v-row dense class="my-5">
              <v-col
                cols="6"
                v-for="(event, index) in course_data.artWorkImage"
                :key="index"
                class="d-flex flex-column"
              >
                <!-- IMAGE -->
                <v-card class="mt-auto">
                  <v-btn
                    icon
                    small
                    class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
                    dark
                    @click="showImageDialog(event)"
                    ><v-icon>mdi-eye</v-icon></v-btn
                  >
                  <v-img
                    :src="event.attachmentUrl"
                    cover
                    align="center"
                    style="
                      max-width: 100%;
                      max-height: 100%;
                      height: 219.6px;
                      width: 100%;
                      object-fit: cover;
                    "
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
                </v-card>
              </v-col>
            </v-row>
          </div>
          <!-- VDO -->

          <div
            v-if="
              course_data.artWorkVideo?.length > 0 &&
              !$vuetify.breakpoint.smAndUp
            "
          >
            <v-row dense>
              <v-col class="text-xl">
                {{ $t("link vdo") }}
              </v-col>
            </v-row>
            <v-row dense class="my-5">
              <v-col
                cols="6"
                v-for="(event, index) in course_data.artWorkVideo"
                :key="index"
                class="d-flex flex-column"
              >
                <!-- VDO -->
                <v-card
                  class="mt-auto"
                  v-if="
                    event.filesType === 'video/mp4' ||
                    event.filesType === 'video/x-matroska'
                  "
                >
                  <v-btn
                    icon
                    small
                    class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
                    dark
                    @click="showImageDialog(event)"
                    ><v-icon>mdi-eye</v-icon></v-btn
                  >
                  <video
                    style="
                      max-width: 100%;
                      max-height: 100%;
                      height: 219.6px;
                      width: 100%;
                      object-fit: cover;
                    "
                    :aspect-ratio="16 / 9"
                    autoplay
                    muted
                    controls
                    loop
                  >
                    <source :src="event.attachmentUrl" type="video/mp4" />
                  </video>
                </v-card>
                <!-- YOUTUBE -->
                <v-card class="mt-auto" v-else-if="event.filesType === 'link'">
                  <v-btn
                    icon
                    small
                    class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
                    dark
                    @click="showImageDialog(event)"
                    ><v-icon>mdi-eye</v-icon></v-btn
                  >
                  <!-- <iframe height="100%" width="100%" :src="event.link"> </iframe> -->
                  <div
                    id="video"
                    style="
                      max-width: 100%;
                      max-height: 100%;
                      height: 219.6px;
                      width: 100%;
                      object-fit: cover;
                    "
                    v-html="event.attachmentCourse"
                    :aspect-ratio="16 / 9"
                  ></div>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <v-row>
            <v-col
              v-if="course_order.course_type_id === 'CT_1'"
              cols="12"
              class="flex justify-center"
            >
              <v-btn
                depressed
                class="w-full font-bold white--text mt-auto"
                @click="
                  $router.push({
                    name: 'userCoursePackage_courseId',
                    params: { course_id: $route.params.course_id },
                  })
                "
                color="#ff6b81"
              >
                {{ $t("choose a package") }}
              </v-btn>
            </v-col>
            <v-col
              v-if="course_order.course_type_id === 'CT_2'"
              cols="12"
              class="flex justify-center"
            >
              <!-- v-if="
                course_monitors?.length == 1
                  ? course_monitors[0].m_current_student <
                    course_data.student_recived
                  : 0 < course_data.student_recived
              " -->
              <v-btn
                v-if="
                  course_seat?.countSeatByCourse <
                  course_seat?.maxStudentByCourse
                "
                depressed
                :disabled="validateRegisterCourse() ? true : false"
                class="w-full font-bold white--text mt-auto"
                @click="registerCourse"
                color="#ff6b81"
              >
                {{ $t("register for a course") }}
              </v-btn>
              <v-btn
                v-else
                depressed
                disabled
                class="w-full font-bold white--text mt-auto"
                color="#ff6b81"
              >
                {{ $t("full course") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- GENERAL COURSE -->

      <!-- DIALOG :: COURSE FULL -->
      <v-dialog width="60vw" v-model="show_dialog" persistent>
        <v-card>
          <v-card-title>
            <v-row>
              <v-col align="right">
                <v-btn icon @click="show_dialog = false"
                  ><v-icon color="#ff6b81">mdi-close</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <dialog-card
              :text="$t('the course is full')"
              :subtitle="
                $t(
                  'currently our class is full of students. thank you for your interest in our course.'
                )
              "
            >
              <template #img>
                <v-img
                  max-height="124"
                  max-width="156"
                  src="@/assets/course/course_full.png"
                ></v-img>
              </template>
              <template #btn>
                <v-btn
                  @click="show_dialog = false"
                  depressed
                  color="#ff6b81"
                  class="w-full"
                  dark
                  >{{ $t("agree") }}</v-btn
                >
              </template>
            </dialog-card>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- IMAGE -->
    <div
      v-if="course_data.artWorkImage?.length > 0 && $vuetify.breakpoint.smAndUp"
    >
      <v-row dense>
        <v-col cols="12" class="text-2xl my-5 font-bold">
          {{ $t("Learning Journey") }}
        </v-col>
        <v-col class="text-xl">
          {{ $t("image") }}
        </v-col>
      </v-row>

      <v-row dense class="my-5">
        <v-col
          cols="6"
          sm="3"
          v-for="(event, index) in course_data.artWorkImage"
          :key="index"
          class="d-flex flex-column"
        >
          <!-- IMAGE -->
          <v-card class="mt-auto">
            <v-btn
              icon
              small
              class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
              dark
              @click="showImageDialog(event)"
              ><v-icon>mdi-eye</v-icon></v-btn
            >
            <v-img
              :src="event.attachmentUrl"
              cover
              align="center"
              style="height: 219.6px; width: 100%; object-fit: cover"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="#ff6b81"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- VDO -->

    <div
      v-if="course_data.artWorkVideo?.length > 0 && $vuetify.breakpoint.smAndUp"
    >
      <v-row dense>
        <v-col class="text-xl">
          {{ $t("link vdo") }}
        </v-col>
      </v-row>
      <v-row dense class="my-5">
        <v-col
          cols="6"
          sm="3"
          v-for="(event, index) in course_data.artWorkVideo"
          :key="index"
          class="d-flex flex-column"
        >
          <!-- VDO -->
          <v-card
            class="mt-auto"
            v-if="
              event.filesType === 'video/mp4' ||
              event.filesType === 'video/x-matroska'
            "
          >
            <v-btn
              icon
              small
              class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
              dark
              @click="showImageDialog(event)"
              ><v-icon>mdi-eye</v-icon></v-btn
            >
            <video
              style="height: 219.6px; width: 100%; object-fit: cover"
              autoplay
              muted
              controls
              loop
            >
              <source :src="event.attachmentUrl" type="video/mp4" />
            </video>
          </v-card>
          <!-- YOUTUBE -->
          <v-card class="mt-auto" v-else-if="event.filesType === 'link'">
            <v-btn
              icon
              small
              class="bg-[#cdcdcd] absolute top-2 right-3 z-[4]"
              dark
              @click="showImageDialog(event)"
              ><v-icon>mdi-eye</v-icon></v-btn
            >
            <!-- <iframe height="100%" width="100%" :src="event.link"> </iframe> -->
            <div
              id="video"
              style="height: 219.6px; width: 100%; object-fit: cover"
              v-html="event.attachmentCourse"
            ></div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- DIALOG SHOW IMAGE -->
    <v-dialog
      persistent
      :width="$vuetify.breakpoint.smAndUp ? '100vw' : ''"
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
                @click="closeShowImage()"
                ><v-icon>mdi-close</v-icon></v-btn
              >
              <span class="font-weight-bold">{{ $t("image example") }} </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <!-- IMAGE -->
              <!-- class="max-h-[300px] max-w-300px rounded-lg" -->

              <v-img
                v-if="
                  typeImg === 'img' ||
                  typeImg === 'image/png' ||
                  typeImg === 'image/jpeg'
                "
                contain
                :src="biggesImage"
                class="rounded-lg"
                :style="
                  $vuetify.breakpoint.lgAndUp
                    ? 'height: 600px; width: 1000px; object-fit: cover; margin: auto;'
                    : $vuetify.breakpoint.mdAndUp
                    ? 'height: 1000px; width: 800px; object-fit: cover; margin: auto;'
                    : $vuetify.breakpoint.smAndUp
                    ? 'height: 800px; width: 600px; object-fit: cover; margin: auto;'
                    : 'object-fit: cover; margin: auto;'
                "
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
              <!-- style="object-fit: cover; margin: auto" -->

              <video
                v-else-if="
                  typeImg === 'video' ||
                  typeImg === 'video/mp4' ||
                  typeImg === 'video/x-matroska'
                "
                class="rounded-lg d-flex justify-center align-center"
                :style="
                  $vuetify.breakpoint.lgAndUp
                    ? 'height: 600px; width: 1000px; object-fit: cover; margin: auto;'
                    : $vuetify.breakpoint.mdAndUp
                    ? 'height: 1000px; width: 800px; object-fit: cover; margin: auto;'
                    : $vuetify.breakpoint.smAndUp
                    ? 'height: 800px; width: 600px; object-fit: cover; margin: auto;'
                    : 'object-fit: cover; margin: auto;'
                "
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
                  $vuetify.breakpoint.lgAndUp
                    ? 'height: 600px; width: 1000px; object-fit: cover; margin: auto;'
                    : $vuetify.breakpoint.mdAndUp
                    ? 'height: 1000px; width: 800px; object-fit: cover; margin: auto;'
                    : $vuetify.breakpoint.smAndUp
                    ? 'height: 800px; width: 600px; object-fit: cover; margin: auto;'
                    : 'object-fit: cover; margin: auto;'
                "
                v-html="biggesImage"
              ></div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <loading-overlay :loading="course_is_loading"></loading-overlay>
  </v-container>
</template>

<script>
import dialogCard from "@/components/dialog/dialogCard.vue";
import rowData from "@/components/label/rowData.vue";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import Swal from "sweetalert2";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
// import headerCard from "@/components/header/headerCard.vue";

// import ImgCard from "@/components/course/imgCard.vue";

export default {
  name: "userCourseDetail",
  components: {
    rowData,
    dialogCard,
    loadingOverlay,
    // headerCard,
    // ImgCard
  },
  data: () => ({
    show_dialog: false,
    date_options: {
      year: "numeric",
      month: "long",
      day: "numeric",
      locale: "th-TH",
    },
    show_attachment_dialog: false,
    biggesImage: null,
    typeImg: null,
    testCard: [
      {
        link: "data:image/jpeg;base64,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",
        fileType: "img",
      },
      {
        link: "data:image/jpeg;base64,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",
        fileType: "img",
      },
      {
        link: "https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4",
        fileType: "video",
      },
      {
        link: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/KOFFt04zS6o?si=ahE26X4iqHEtMTAr&autoplay=1&mute=1" title="Zweed n&#39; Roll - ช่วงเวลา (A Moment) [Official Video]" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen allow="autoplay"></iframe>`,
        fileType: "youtube",
      },
    ],
  }),
  async created() {
    this.order_data = JSON.parse(localStorage.getItem("Order"));
    this.changeCourseOrderData(this.order_data);
    await this.GetCourse(this.$route.params.course_id);

    if (this.order_data.course_type_id === "CT_2") {
      await this.GetCourseStudent({
        course_id: this.order_data.course_id,
        cpo_id: null,
      });
      // await this.GetCourse(this.$route.params.course_id);
      await this.GetShortCourseMonitor({
        course_id: this.order_data.course_id,
      });
      await this.GetCourseSeats({
        courseId: this.course_data?.course_id,
        coursePackageOptionsId: "",
        dayOfWeekId:
          this.course_data?.days[0]?.times[0]?.timeData[0]?.dayOfWeekId,
        timeId: this.course_data?.days[0]?.times[0]?.timeData[0]?.timeId,
        coachId: this.course_data?.days[0]?.times[0]?.timeData[0]?.coach_id,
        studentId: "",
        courseTypeId: this.course_data?.course_type_id,
      });
    }
  },
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "course");
  },
  computed: {
    ...mapGetters({
      course_data: "CourseModules/getCourseData",
      course_order: "OrderModules/getCourseOrder",
      order: "OrderModules/getOrder",
      course_is_loading: "CourseModules/getCourseIsLoading",
      course_monitors: "CourseMonitorModules/getCourseMonitor",
      course_seat: "CourseModules/getCourseSeats",
    }),
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
  },
  methods: {
    ...mapActions({
      GetCourse: "CourseModules/GetCourse",
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
      changeOrderData: "OrderModules/changeOrderData",
      GetCourseStudent: "CourseModules/GetCourseStudent",
      CreateReserveCourse: "OrderModules/CreateReserveCourse",
      GetGeneralCourseMonitor: "CourseMonitorModules/GetGeneralCourseMonitor",
      GetShortCourseMonitor: "CourseMonitorModules/GetShortCourseMonitor",
      GetCourseSeats: "CourseModules/GetCourseSeats",
    }),

    showImageDialog(item) {
      this.biggesImage = item.attachmentUrl
        ? item.attachmentUrl
        : item.attachmentCourse
        ? item.attachmentCourse
        : item;
      this.typeImg = item.type ? item.type : item.filesType;
      this.show_attachment_dialog = true;
    },
    closeShowImage() {
      this.show_attachment_dialog = false;
      this.typeImg = null;
      this.biggesImage = null;
    },

    getTime(time) {
      return moment(time).format("HH:mm");
    },
    reserveCourse() {
      Swal.fire({
        icon: "question",
        title: this.$t("want to book this course?"),
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: this.$t("agree"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (this.course_data.course_type_id === "CT_2") {
            this.course_order.price = parseFloat(this.course_data.course_price);
            // this.course_order.price = parseFloat(this.course_data.price_course);
            this.CreateReserveCourse({ course_data: this.course_order });
          }
        }
      });
    },
    validateRegisterCourse() {
      // eslint-disable-next-line no-unused-vars
      let tobay = moment().format("YYYY-MM-DD");

      return !moment(tobay).isBetween(
        this.course_data.course_register_start_date,
        this.course_data.course_register_end_date,
        null,
        "[]"
      );
      // return false;
    },
    registerCourse() {
      this.order.order_step = 1;
      if (this.course_order.students.length > 0) {
        (this.course_order.apply_for_yourself = false),
          (this.course_order.apply_for_others = false),
          (this.course_order.times_in_class = 0);
        this.course_order.day = "";
        this.course_order.time = "";
        this.course_order.coach = "";
        this.course_order.start_day = "";
        this.course_order.price = 0;
        this.course_order.detail = "";
        this.course_order.remark = "";
        this.course_order.selected = true;
        this.course_order.parents = [];
        this.course_order.students = [];
      }
      if (this.course_data.course_type_id === "CT_2") {
        this.course_order.price = parseFloat(this.course_data.course_price);
        // this.course_order.price = parseFloat(this.course_data.price_course);
        this.changeCourseOrderData(this.course_order);
      }
      this.changeOrderData(this.order);
      localStorage.setItem("Order", JSON.stringify(this.course_order));
      this.$router.push({ name: "userCourseOrder" });
    },
  },
};
</script>
