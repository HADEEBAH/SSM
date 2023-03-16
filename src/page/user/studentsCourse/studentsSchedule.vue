<template>
  <v-container>
    <div class="mx-10 my-5">
      <label class="text-xl font-bold">ข้อมูลตารางเรียน</label>

      <v-row dense class="my-3">
        <pre>{{ courseData }}</pre>
        <!-- <v-col
          cols="4"
          v-for="(type, type_index) in course_type"
          :key="type_index"
        >
          <v-card flat @click="type_selected = type.value" class="rounded-lg">
            <v-card-text
              :class="
                type_selected === type.value ? 'bg-[#FF6B81]' : 'bg-[#F5F5F5]'
              "
              class="rounded-lg flex justify-center align-center pa-2"
            >
              <label
                :class="
                  type_selected === type.value
                    ? 'text-white'
                    : ' text-[#B3B3B3]'
                "
                class="font-bold mr-2"
                >{{ type.name }}</label
              >
            </v-card-text>
          </v-card>
        </v-col> -->
      </v-row>
      <v-expand-x-transition transition="scale-transition">
   
        <div
          v-if="type_selected == 'students_course'"
         
        >
          <v-card v-for="(item, item_index) in course_data" :key="item_index">
            <v-card class="pa-2">
                <v-row>
                    <v-col cols="4">
                        {{ item.category_id }}
                    </v-col>
                    <v-col cols="4">

                    </v-col>
                    <v-col cols="4">

                    </v-col>
                </v-row>
                 {{ item.courseNameEn }}
            </v-card>
           
          </v-card>
        </div>
      </v-expand-x-transition>

      <v-expand-x-transition transition="scale-transition">
        <div v-if="type_selected == 'students_schedule'">
          <h1>Page 2</h1>
        </div>
      </v-expand-x-transition>

      <v-expand-x-transition transition="scale-transition">
        <div v-if="type_selected == 'students_bookedcourse'">
          <h1>Page 3</h1>
        </div>
      </v-expand-x-transition>
    </div>
  </v-container>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
export default {
  components: {},
  data: () => ({
    activePage: 1,
    loading: true,
    course_type: [
      { name: "คอร์สของฉัน", value: "students_course" },
      { name: "ตารางเรียน", value: "students_schedule" },
      { name: "คอร์สที่จอง", value: "students_bookedcourse" },
    ],
    type_selected: "students_course",
  }),

  mounted() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "ข้อมูลตารางเรียน"
    );
    // this.GetCourse(this.courseId)
        // this.$store.dispatch('GetCourse', (this.course_data.course_id))
        // this.$store.dispatch('GetCourse', this.$route.params.course_id)

  },
      created() {
    this.GetCourse(this.course_data.course_id)
    // this.$store.dispatch('GetCourse', this.course_data.course_id);
  },
  watch: {
    type_selected: function () {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 200);
    },
  },
  methods: {
    ...mapActions({
      GetCourse: "CourseModules/GetCourse",
    }),

    getCouse(courseId) {
      console.log("course_id", courseId);
      this.GetCourse(courseId);
    },
  },

  computed: {
    ...mapGetters({
          course_data: "CourseModules/getCourseData",
    
    }),
    courseData: {
   get() {
       return this.course_data
   },
 },
  },
};
</script>
  
  <style>
</style>