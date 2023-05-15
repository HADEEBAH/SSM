<template>
  <v-app>
    <v-container>
      <header-page title="จัดการคอร์สทั้งหมด">
        <v-text-field
          class="w-full"
          outlined
          dense
          hide-details
          prepend-inner-icon="mdi-magnify"
          v-model="search"
          placeholder="ค้นหา"
        ></v-text-field>
      </header-page>
      <v-row class="mb-2">
        <v-col cols="12" sm="4" @click="tab = 'all'">
          <img-card
            class="cursor-pointer"
            :class="tab === 'all' ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="../../../assets/course/all_course.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">คอร์สทั้งหมด</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">{{
                  courses.length
                }}</v-col>
                <v-col class="text-sm">รายการ</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
        <v-col cols="12" sm="4" @click="tab = 'CT_1'">
          <img-card
            class="cursor-pointer"
            :class="tab === 'CT_1' ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="../../../assets/course/general_course.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">คอร์สทั่วไป</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">{{
                  courses.filter((v) => v.course_type_id === "CT_1").length
                }}</v-col>
                <v-col class="text-sm">รายการ</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
        <v-col cols="12" sm="4" @click="tab = 'CT_2'">
          <img-card
            class="cursor-pointer"
            :class="tab === 'CT_2' ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                max-height="90"
                max-width="70"
                src="../../../assets/course/short_course.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">คอร์สระยะสั้น</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">{{
                  courses.filter((v) => v.course_type_id === "CT_2").length
                }}</v-col>
                <v-col class="text-sm">รายการ</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
      </v-row>
      <v-data-table
        class="elevation-1 header-table"
        :headers="column"
        :items="
          tab === 'all'
            ? courses
            : courses.filter((v) => v.course_type_id === tab)
        "
        :loading="LoadingTable"
      >
        <template v-slot:[`item.status`]="{ item }">
          <v-autocomplete
            @change="updateStatusCourse(item.course_id, item.status)"
            dense
            outlined
            hide-details
            item-color="pink"
            :items="status"
            item-text="label"
            item-value="value"
            v-model="item.status"
          >
          </v-autocomplete>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            color="#FF6B81"
            @click="
              $router.push({
                name: 'Course_courseID',
                params: { course_id: item.course_id },
              })
            "
          >
            <v-icon>mdi-text-box-search-outline</v-icon>
            ดูรายละเอียด
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </v-app>
</template>
  <script>
import headerPage from "@/components/header/headerPage.vue";
import imgCard from "@/components/course/imgCard.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "courseList",
  components: {
    headerPage,
    imgCard,
  },
  data: () => ({
    search: "",
    tab: "all",
    status: [
        { label: "เปิดคอร์ส", value: "Active" },
        { label: "ปิดคอร์สชั่วคราว", value: "TemporaryInActive" },
        { label: "ปิดคอร์ส", value: "InActive" },
    ],
    column: [
      { text: "ชื่อคอร์ส", align: "start", sortable: false, value: "course" },
      {
        text: "ชื่ออาณาจักร",
        align: "start",
        sortable: false,
        value: "category",
      },
      {
        text: "ประเภทคอร์ส",
        align: "start",
        sortable: false,
        value: "course_type",
      },
      {
        text: "วันเปิด-ปิดรับสมัคร",
        align: "start",
        sortable: false,
        value: "course_open",
      },
      { text: "สถานะ", align: "center", sortable: false, value: "status" },
      { text: "", align: "center", value: "actions", sortable: false },
    ],
  }),
  created() {
    this.$store.dispatch("CourseModules/GetCoursesList");
  },
  mounted() {},
  watch: {},
  computed: {
    ...mapGetters({
      courses: "CourseModules/getCourses",
    }),
    LoadingTable() {
      return !this.courses;
    },
  },
  methods: {
    ...mapActions({
      UpdateStatusCourse: "CourseModules/UpdateStatusCourse",
    }),
    updateStatusCourse(course_id, status) {
      console.log(course_id, status);
      this.UpdateStatusCourse({
        courseStatus: status,
        courseId: course_id,
      });
    },
  },
};
</script>
<style>
</style>
  