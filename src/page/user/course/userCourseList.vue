<template>
  <v-app>
    <v-container>
      <!-- seasrch -->
      <v-row dense ref="seasrch">
        <v-col cols="12">
          <v-text-field
            outlined
            hide-details
            dense
            prepend-inner-icon="mdi-magnify"
            :placeholder="
              $t('find the learning course that interests you here')
            "
            v-model="search_course"
            @input="searchCourse($event)"
          ></v-text-field>
        </v-col>
      </v-row>
      <!-- categoryName -->
      <v-row dense ref="category_name">
        <v-col class="text-lg font-bold">{{
          $i18n.locale == "th"
            ? category.categoryNameTh
            : category.categoryNameEng
        }}</v-col>
      </v-row>
      <!-- courseType -->
      <v-row dense ref="course_type">
        <v-col
          cols="6"
          v-for="(type, type_index) in course_types"
          :key="`${type_index}-type`"
        >
          <v-card flat @click="selectCourseType(type)" class="rounded-lg">
            <v-card-text
              :class="
                type_selected === type.course_type_id
                  ? 'bg-[#FF6B81]'
                  : 'bg-[#F5F5F5]'
              "
              class="rounded-lg flex justify-center align-center pa-2"
            >
              <label
                :class="
                  type_selected === type.course_type_id
                    ? 'text-white'
                    : ' text-[#B3B3B3]'
                "
                class="font-bold mr-2"
                >{{
                  $i18n.locale == "th"
                    ? type.course_type_name_th
                    : type.course_type_name_en
                }}</label
              >
              <v-avatar
                size="32"
                color="white"
                class="font-bold"
                :class="
                  type_selected === type.course_type_id
                    ? 'text-[#ff6b81]'
                    : 'text-[#B3B3B3]'
                "
              >
              {{ type.total_course }}
                <!-- {{
                  search_results.filter(
                    (v) => v.course_type_id === type_selected
                  ).length > 0
                    ? search_results.filter(
                        (v) => v.course_type_id === type.course_type_id
                      ).length
                    : search_course
                    ? search_results.filter(
                        (v) => v.course_type_id === type.course_type_id
                      ).length
                    : type.total_course
                }} -->
              </v-avatar>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- Detail -->
      <v-row dense ref="course_list">
        <template v-if="!courses_is_loading">
          <v-col
            cols="6"
            sm="4"
            v-for="(course, course_index) in search_results.filter(
              (v) => v.course_type_id === type_selected
            ).length > 0
              ? search_results.filter((v) => v.course_type_id === type_selected)
              : search_course
              ? search_results
              : courses"
            :key="course_index"
          >
            <v-card class="overflow-hidden h-full rounded-lg box-shadows">
              <v-img
                @click="selectedCourse(course)"
                :aspect-ratio="16 / 9"
                cover
                :src="
                  course.course_url || course.course_url !== ''
                    ? course.course_url
                    : require(`@/assets/course/default_course_img.svg`)
                "
              >
                <v-row>
                  <v-col class="pa-4" align="right">
                    <v-chip color="#F9B320" text-color="white">{{
                      `${GerPeriod(course.period)} ${$t("hour")} `
                    }}</v-chip></v-col
                  >
                </v-row>
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
              <v-card-title
                @click="selectedCourse(course)"
                class="font-bold text-sm pa-2"
              >
                <v-row
                  @click="selectedCourse(course)"
                  dense
                  class="d-flex align-center"
                >
                  <v-col>{{
                    `${
                      $i18n.locale == "th"
                        ? course.course_name_th
                        : course.course_name_en
                    }`
                  }}</v-col>
                </v-row>
              </v-card-title>
              <v-card-text class="text-xs pa-2">
                <div>
                  <div v-if="course.show" v-html="course.course_detail"></div>
                  <div
                    v-else
                    v-html="course.course_detail.slice(0, 150).trim()"
                  ></div>
                  <span
                    v-if="course.course_detail?.length > 150"
                    class="text-red-500 cursor-pointer"
                    @click="course.show = !course.show"
                    >{{
                      course.show ? $t("lesser") : $t("read more") + `...`
                    }}</span
                  >
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            v-if="
              search_course ? search_results.length == 0 : courses.length == 0
            "
          >
            <v-card outlined>
              <v-card-text align="center">
                <span class="font-bold">{{
                  $t("course information not found")
                }}</span>
              </v-card-text>
            </v-card>
          </v-col>
        </template>
        <template v-else>
          <v-col
            cols="6"
            sm="4"
            v-for="(course, course_index) in 6"
            :key="course_index"
          >
            <v-card>
              <v-skeleton-loader type="image, list-item"></v-skeleton-loader>
            </v-card>
          </v-col>
        </template>
      </v-row>
      <v-row v-if="isDataReceived">
        <v-col cols="12" align="center">
          <v-progress-circular
            indeterminate
            color="#ff6b81"
            size="50"
          ></v-progress-circular>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  components: {},
  name: "userCourseList",
  data: () => ({
    search_course: "",
    search_results: [],
    loading: true,
    offsetTop: null,
    course_type: [
      {
        course_type_id: "CT_1",
        name: "คอร์สทั่วไป",
        amount: "8",
        value: "general_course",
      },
      {
        course_type_id: "CT_2",
        name: "คอร์สระยะสั้น",
        amount: "2",
        value: "short_course",
      },
    ],
    type_selected: "CT_1",
    scrollTop: 0,
    countDatePerPage: 0,
    isDataReceived: false,
    waitingProcess: false,
    sameHistoryLength: false,
  }),
  created() {
    this.GetCourseTypes({ category_id: this.$route.params.category_id });
    if (this.course_types?.length > 0) {
      this.type_selected = this.course_types[0].course_type_id;
    }
  },
  async mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.GetCategory(this.$route.params.category_id);
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "course");
    await this.GetCoursesFilter({
      category_id: this.$route.params.category_id,
      status: "Active",
      course_type_id: this.type_selected,
      limit: this.filter_course_option.limit,
      page: this.filter_course_option.page + 1,
    });
    // this.$store.dispatch("CourseModules/GetCoursesFilter", {
    //   category_id: this.$route.params.category_id,
    //   status: "Active",
    //   limit: 12,
    //   page: 1,
    // });
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  computed: {
    ...mapGetters({
      courses_type_is_loading: "CourseModules/getCourseTypeIsLoading",
      courses_is_loading: "CourseModules/getCoursesIsLoading",
      courses: "CourseModules/getCourses",
      course_order: "OrderModules/getCourseOrder",
      category: "CategoryModules/getCategory",
      course_types: "CourseModules/getCourseTypes",
      course_potential: "CourseModules/getCoursePotential",
      filter_course_option: "CourseModules/getFilterCourseOption",
    }),
  },
  methods: {
    ...mapActions({
      GetCourseTypes: "CourseModules/GetCourseTypes",
      GetCategory: "CategoryModules/GetCategory",
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
      GetCoursesFilter: "CourseModules/GetCoursesFilter",
      // GetPotential: "CourseModules/GetPotential",
    }),

    handleScroll() {
      this.scrollTop = window.scrollY; // ตัวเลขเมื่อ scroll ตัวเลขเริ่มนับจากบนสุด = 0
      let ref_seasrch = this.$refs.seasrch?.clientHeight; // ค่ามาจาก ref_seasrch
      let ref_category_name = this.$refs.category_name?.clientHeight; // ค่ามาจาก ref_category_name
      let ref_course_type = this.$refs.course_type?.clientHeight; // ค่ามาจาก ref_course_type
      let ref_course_list = this.$refs.course_list?.clientHeight; // ค่ามาจาก ref_detail
      let device = document.body.offsetHeight - 56; // ค่าของหน้าจอ device
      let del_ref_seasrch = device - ref_seasrch; //
      let del_category_name = del_ref_seasrch - ref_category_name;
      let del_course_type = del_category_name - ref_course_type;
      let total_del = del_course_type;
      let countA = this.scrollTop + total_del;

      if (countA >= ref_course_list && !this.sameHistoryLength) {
        this.loadMoreData();
      }

      if (countA < ref_course_list) {
        this.sameHistoryLength = false;
      }
    },

    async loadMoreData() {
      this.countDatePerPage = this.course_list?.length;

      if (!this.isDataReceived) {
        this.isDataReceived = true;

        if (!this.waitingProcess) {
          this.waitingProcess = true;

          await this.GetCoursesFilter({
            category_id: this.$route.params.category_id,
            status: "Active",
            course_type_id: this.type_selected,
            limit: this.filter_course_option.limit,
            page: this.filter_course_option.page + 1,
          });

          this.isDataReceived = false;
          this.waitingProcess = false;

          if (this.course_list?.length === this.countDatePerPage) {
            this.sameHistoryLength = true;
          } else {
            this.sameHistoryLength = false;
          }
        }
      }
    },

    GerPeriod(period) {
      if(period){
        let str = period.toString();
        let part_period = str.split(".");
        if (part_period.length > 1) {
          return period.toLocaleString("en-US", { minimumFractionDigits: 2 });
        } else {
          return period;
        }
      }
    },
    searchCourse(event) {
      const searchQuery = event.toLowerCase();
      this.search_results = this.courses.filter((course) => {
        const courseNameTh = course.course_name_th.toLowerCase();
        const courseNameEn = course.course_name_en.toLowerCase();
        if (
          !courseNameTh.includes(searchQuery) &&
          !courseNameEn.includes(searchQuery)
        ) {
          return false;
        } else {
          return (
            courseNameTh.includes(searchQuery) ||
            courseNameEn.includes(searchQuery)
          );
        }
      });
    },
    CutWold(course) {
      return course.course_detail.slice(0, 122) + "...";
    },
    selectCourseType(course_type) {
      this.type_selected = course_type.course_type_id;
      this.search_course = "";
      this.GetCoursesFilter({
        category_id: this.$route.params.category_id,
        status: "Active",
        course_type_id: course_type.course_type_id,
        limit: 6,
        page: 1,
      });
    },
    selectedCourse(course) {
      this.course_order.option = {};
      this.course_order.option_data = "";
      this.course_order.package = "";
      this.course_order.package_data = {};
      this.course_order.course_id = course.course_id;
      this.course_order.course_name = `${course.course_name_th}(${course.course_name_en})`;
      this.course_order.course_type = course.course_type_th;
      this.course_order.course_type_id = course.course_type_id;
      this.course_order.detail = course.course_detail;
      this.course_order.period = course.period;
      this.changeCourseOrderData(this.course_order);
      localStorage.setItem("Order", JSON.stringify(this.course_order));
      this.$router.push({
        name: "userCourseDetail_courseId",
        params: { course_id: course.course_id },
      });
    },
  },
};
</script>
