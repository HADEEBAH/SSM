<template>
  <v-card class="h-full w-[270px]" hover>
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
          <v-chip small color="#F9B320" text-color="white">{{
            `${GenPeriod(course.period)} ${$t("hour")} `
          }}</v-chip></v-col
        >
      </v-row>
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
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
      <v-row @click="selectedCourse(course)" dense class="d-flex align-center">
        <v-col>{{
          `${
            $i18n.locale == "th" ? course.course_name_th : course.course_name_en
          }`
        }}</v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="text-xs pa-2">
      <div>
        <div v-if="course.show" v-html="course.course_detail"></div>
        <div v-else v-html="course.course_detail.slice(0, 150).trim()"></div>
        <span
          v-if="course.course_detail?.length > 150"
          class="text-red-500 cursor-pointer"
          >{{ course.show ? $t("lesser") : $t("read more") + `...` }}</span
        >
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    course: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters({
      course_order: "OrderModules/getCourseOrder",
    }),
  },
  methods: {
    ...mapActions({
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
    }),
    GenPeriod(period) {
      if (period) {
        let str = period.toString();
        let part_period = str.split(".");
        if (part_period.length > 1) {
          return period.toLocaleString("en-US", { minimumFractionDigits: 2 });
        } else {
          return period;
        }
      }
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
      // console.log("object :>> ", course);
      localStorage.setItem("Order", JSON.stringify(this.course_order));
      this.$router.push({
        name: "userCourseDetail_courseId",
        params: { course_id: course.course_id },
      });
    },
  },
};
</script>

<style>
</style>