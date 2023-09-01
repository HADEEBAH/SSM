<template>
  <v-container class="h-full">
    <v-row class="h-full">
      <v-col cols="12" sm="6" :class="MobileSize ? '' : 'h-full'">
        <v-img
          contain
          :class="`${
            MobileSize ? 'rounded-lg mb-3 max-h-[180px]' : 'rounded-lg mb-3'
          } max-h-[576px] max-w-[1024px]`"
          :src="
            course_data.course_img || course_data.course_img !== ''
              ? course_data.course_img
              : require(`@/assets/course/default_course_img.svg`)
          "
          max-height="500"
          max-width="500"
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
      <v-col cols="12" sm="6">
        <v-row dense
          ><v-col class="text-lg font-bold">
            {{
              `${$i18n.locale == 'th' ? course_data.course_name_th : course_data.course_name_en}`
            }}
          </v-col>
        </v-row>
        <v-row dense>
          <v-col class="text-md">{{ `${$t("by")} ${course_data.location}` }}</v-col>
        </v-row>
        <v-row v-if="course_data.course_type_id === 'CT_2'" dense>
          <v-col cols="auto">
            <v-icon class="mr-2" color="#ff6b81">mdi-currency-usd</v-icon>
          </v-col>
          <v-col class="font-bold"
            >{{
              parseFloat(course_data.price_course).toLocaleString()
            }}
            {{ $t("baht") }}/{{ $t("person") }}</v-col
          >
        </v-row>
        <rowData
          v-if="course_data.course_type_id === 'CT_2'"
          col_detail="5"
          mini
          icon="mdi-account-group-outline"
        >
          {{
            course_data.course_studant_amount
              ? course_data.course_studant_amount
              : 0
          }}
          / {{ course_data.student_recived }} {{ $t("seat") }}</rowData
        >
        <rowData
          v-if="course_data.course_type_id === 'CT_1'"
          col_detail="5"
          mini
          icon="mdi-clock-time-four-outline"
          >{{ course_data.course_hours }} {{ $t("hrs.") }}/{{ $t("time") }}</rowData
        >
        <v-row dense>
          <v-col cols="12" class="text-[#999999]">
            <label v-html="course_data.detail"></label>
          </v-col>
        </v-row>
        <v-expansion-panels flat>
          <v-expansion-panel v-if="course_data.course_type_id === 'CT_2'">
            <v-expansion-panel-header class="px-0 font-bold">
              {{$t('date and time')}}
              <template v-slot:actions>
                <v-icon color="#ff6b81"> $expand </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="border-t pt-3">
              <v-row dense>
                <v-col cols="auto" class="font-bold">{{ $t("admission date") }}:</v-col>
                <v-col>
                  {{
                    new Date(
                      course_data.course_register_start_date
                    ).toLocaleDateString( $i18n.locale == 'th' ? "th-TH" : "en-US", date_options)

                  }}
                  -
                  {{
                    new Date(
                      course_data.course_register_end_date
                    ).toLocaleDateString($i18n.locale == 'th' ? "th-TH" : "en-US", date_options)
                  }}</v-col
                >
              </v-row>
              <v-row dense>
                <v-col cols="auto" class="font-bold">{{ $t('study date') }}:</v-col>
                <v-col
                  >{{
                    new Date(
                      course_data.course_study_start_date
                    ).toLocaleDateString($i18n.locale == 'th' ? "th-TH" : "en-US", date_options)
                  }}
                  -
                  {{
                    new Date(
                      course_data.course_study_end_date
                    ).toLocaleDateString($i18n.locale == 'th' ? "th-TH" : "en-US", date_options)
                  }}
                  ({{ course_data.course_period_start_date }}-{{course_data.course_period_end_date}} {{ $t("o'clock")}})</v-col
                >
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="course_data.course_type_id === 'CT_1'">
            <v-expansion-panel-header class="px-0 font-bold">
              {{$t('performance')}}
              <template v-slot:actions>
                <v-icon color="#ff6b81"> $expand </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="border-t pt-3">
              <label v-html="course_data.music_performance"></label>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header class="px-0 font-bold">
              {{  $t('certification')  }}
              <template v-slot:actions>
                <v-icon color="#ff6b81"> $expand </v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="border-t pt-3">
              <label v-html="course_data.catification"></label>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-row>
          <v-col
            v-if="course_order.course_type_id === 'CT_1'"
            cols="12"
            class="flex justify-center"
          >
            <v-btn
              depressed
              class="w-full font-bold white--text"
              @click="
                $router.push({
                  name: 'userCoursePackage_courseId',
                  params: { course_id: $route.params.course_id },
                })
              "
              color="#ff6b81"
            >
                {{ $t('choose a package') }}
            </v-btn>
          </v-col>
          <v-col
            v-if="course_order.course_type_id === 'CT_2'"
            cols="12"
            class="flex justify-center"
          >
            <v-btn
              v-if="
                course_data.course_studant_amount
                  ? course_data.course_studant_amount <
                    course_data.student_recived
                  : 0 < course_data.student_recived
              "
              depressed
              class="w-full font-bold white--text"
              @click="registerCourse"
              color="#ff6b81"
            >
              {{$t("register for a course")}}
            </v-btn>
            <v-btn
              v-else
              depressed
              disabled
              class="w-full font-bold white--text"
              color="#ff6b81"
            >
              {{ $t('full course') }}
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
            :subtitle="$t('currently our class is full of students. thank you for your interest in our course.')"
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
                >{{ $t('agree') }}</v-btn
              >
            </template>
          </dialog-card>
        </v-card-text>
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
// import ImgCard from "@/components/course/imgCard.vue";

export default {
  name: "userCourseDetail",
  components: {
    rowData,
    dialogCard,
    loadingOverlay,
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
  }),
  created() {
    this.order_data = JSON.parse(localStorage.getItem("Order"));
    if (this.order_data.course_type_id === "CT_2") {
      this.GetCourseStudent({
        course_id: this.order_data.course_id,
        cpo_id: null,
      });
    }
  },
  beforeMount() {
    this.GetCourse(this.$route.params.course_id);
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
    }),
    getTime(time) {
      return moment(time).format("HH:mm");
    },
    reserveCourse() {
      Swal.fire({
        icon: "question",
        title: "ต้องการจองคอร์สนี้ใช่หรือไม่",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "ตกลง",
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (this.course_data.course_type_id === "CT_2") {
            this.course_order.price = parseFloat(this.course_data.price_course);
            this.CreateReserveCourse({ course_data: this.course_order });
          }
        }
      });
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
        this.course_order.price = parseFloat(this.course_data.price_course);
        this.changeCourseOrderData(this.course_order);
      }
      this.changeOrderData(this.order);
      localStorage.setItem("Order", JSON.stringify(this.course_order));
      this.$router.push({ name: "userCourseOrder" });
    },
  },
};
</script>
