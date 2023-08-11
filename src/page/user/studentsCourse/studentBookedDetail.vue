<template>
  <v-container>
    <v-card
      v-for="(item, item_index) in student_data"
      :key="item_index"
      class="my-5"
    >
      <v-card-text>
        <v-row dense>
          <!-- img -->
          <v-col cols="4" sm="2">
            <v-col>
              <img src="../../../assets/student_course/download.png" />
            </v-col>
          </v-col>
          <!-- detail -->
          <v-col cols="4" sm="8">
            <v-col class="text-lg font-bold"> </v-col>
            <v-col class="text-slate-400"> </v-col>
            <v-col class="text-slate-400"> </v-col>
            <v-col>
              <v-card color="yellow" class="rounded-lg w-48 text-center">
                วันจันทร์ 16:00 - 17:00 น.
              </v-card>
            </v-col>
          </v-col>

          <!-- circle -->
          <v-col cols="4" sm="2" class="pt-8">
            <v-col>
              <v-progress-circular
                :size="90"
                :width="15"
                value="booked"
                color="#DBDBDB"
                ><span class="text-pink-500">
                  {{ booked }}</span
                ></v-progress-circular
              >
            </v-col>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- DETAIL -->
    <!-- Music performance  -->
    <v-expansion-panels flat>
      <v-expansion-panel>
        <v-expansion-panel-header class="px-0 font-bold">
          Music performance
          <template v-slot:actions>
            <v-icon color="#ff6b81"> $expand </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content> Some content </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels flat>
      <v-expansion-panel>
        <!-- Certification -->
        <v-expansion-panel-header class="px-0 font-bold">
          Certification
          <template v-slot:actions>
            <v-icon color="#ff6b81"> $expand </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content> Some content </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    booked: "จองแล้ว",
  }),
  mounted() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "ข้อมูลตารางเรียน"
    );
  },
  methods: {
    ...mapActions({
      GetStudentData: "OrderTestModules/GetStudentData",
      GetCourse: "CourseModules/GetCourse",
    }),
    selectCourse(course) {
      this.GetCourse(course);
    },
  },
  computed: {
    ...mapGetters({
      student_data: "OrderTestModules/getStudentData",
      course_data: "CourseModules/getCourseData",
    }),
  },
};
</script>

