<template>
  <v-app>
    <v-container>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            outlined
            hide-details
            dense
            prepend-inner-icon="mdi-magnify"
            placeholder="ค้นหาคอร์สการเรียนรู้ที่คุณสนใจได้ที่นี่"
            v-model="search_course"
            @input="searchCourse($event)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col class="text-lg font-bold">{{ category.categoryNameTh }}</v-col>
      </v-row>
      <v-row dense>
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
                >{{ type.course_type_name_th }}</label
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
                {{
                  search_results.filter(
                    (v) => v.course_type_id === type_selected
                  ).length > 0
                    ? search_results.filter(
                        (v) => v.course_type_id === type.course_type_id
                      ).length
                    : type.total_course
                }}
              </v-avatar>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- <pre>{{ search_results }}</pre> -->
      <v-row dense>
        <template v-if="!courses_is_loading">
          <v-col
            cols="6"
            v-for="(course, course_index) in search_results.filter(
              (v) => v.course_type_id === type_selected
            ).length > 0
              ? search_results.filter((v) => v.course_type_id === type_selected)
              : courses"
            :key="course_index"
          >
            <v-card class="overflow-hidden h-full rounded-lg">
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
                      `${GerPeriod(course.period)}  ชั่วโมง`
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
                    `${course.course_name_th} (${course.course_name_en})`
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
                    v-if="course.course_detail.length > 150"
                    class="text-red-500 cursor-pointer"
                    @click="course.show = !course.show"
                    >{{ course.show ? `น้อยลง` : `อ่านต่อ...` }}</span
                  >
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </template>
        <template v-else>
          <v-col
            cols="4"
            v-for="(course, course_index) in 6"
            :key="course_index"
          >
            <v-card>
              <v-skeleton-loader type="image, list-item"></v-skeleton-loader>
            </v-card>
          </v-col>
        </template>
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
  }),
  created() {
    this.GetCourseTypes({ category_id: this.$route.params.category_id });
    this.$store.dispatch("CourseModules/GetCoursesFilter", {
      category_id: this.$route.params.category_id,
      status: "Active",
    });
    if (this.course_types.length > 0) {
      this.type_selected = this.course_types[0].course_type_id;
    }
  },
  mounted() {
    this.GetCategory(this.$route.params.category_id);
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "คอร์สเรียน");
  },
  watch: {},
  computed: {
    ...mapGetters({
      courses_type_is_loading: "CourseModules/getCourseTypeIsLoading",
      courses_is_loading: "CourseModules/getCoursesIsLoading",
      courses: "CourseModules/getCourses",
      course_order: "OrderModules/getCourseOrder",
      category: "CategoryModules/getCategory",
      course_types: "CourseModules/getCourseTypes",
      course_potential: "CourseModules/getCoursePotential",
    }),
  },
  methods: {
    ...mapActions({
      GetCourseTypes: "CourseModules/GetCourseTypes",
      GetCategory: "CategoryModules/GetCategory",
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
      GetCoursesFilter: "CourseModules/GetCoursesFilter",
      GetPotential: "CourseModules/GetPotential",
    }),
    GerPeriod(period) {
      let str = period.toString();
      let part_period = str.split(".");
      if (part_period.length > 1) {
        // // console.log("219 => ",period.toLocaleString("en-US",{minimumFractionDigits : 2}))
        return period.toLocaleString("en-US", { minimumFractionDigits: 2 });
      } else {
        return period;
      }
    },
    searchCourse(event) {
      const searchQuery = event.toLowerCase();
      // console.log(this.type_selected);
      this.search_results = this.courses.filter((course) => {
        const courseNameTh = course.course_name_th.toLowerCase();
        const courseNameEn = course.course_name_en.toLowerCase();
        return (
          courseNameTh.includes(searchQuery) ||
          courseNameEn.includes(searchQuery)
        );
      });
      // console.log(this.search_results);
    },
    sumCouserPotential(courseData) {
      if (!this.course_potential) {
        this.GetPotential({ course_id: courseData.course_id });
      }
      // console.log(this.course_potential);
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
