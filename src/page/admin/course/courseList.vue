<template>
  <v-app>
    <v-container>
      <header-page slot_tag :title="$t('manage courses')">
        <v-text-field
          class="w-full"
          outlined
          dense
          hide-details
          prepend-inner-icon="mdi-magnify"
          v-model="search"
          :placeholder="$t('search')"
          color="#FF6B81"
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
                src="@/assets/course/all_course.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">{{ $t("all courses") }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">{{
                  courses.length
                }}</v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
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
                src="@/assets/course/general_course.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">{{ $t("regular course") }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">{{
                  courses.filter((v) => v.course_type_id === "CT_1").length
                }}</v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
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
                src="@/assets/course/short_course.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">{{ $t("short course") }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">{{
                  courses.filter((v) => v.course_type_id === "CT_2").length
                }}</v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
      </v-row>
      <!-- <pre>{{ courses }}</pre> -->
      <v-data-table
        class="elevation-1 header-table"
        :headers="column"
        :search="search"
        :items="
          tab === 'all'
            ? courses
            : courses.filter((v) => v.course_type_id === tab)
        "
        :loading="LoadingTable"
      >
        <template v-slot:no-data>
          <v-row dense>
            <v-col align="center"> {{ $t("no data found") }} </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.course_open`]="{ item }">
          {{
            item.course_open_date
              ? `${GenDate(item.course_open_date)}`
              : `${GenDate(item.course_open_start_time)} - ${GenDate(
                  item.course_open_end_time
                )}`
          }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-select
            @change="updateStatusCourse(item, item.course_id, item.status)"
            dense
            outlined
            hide-details
            item-color="pink"
            :items="status"
            :item-text="$i18n.locale == 'th' ? 'label' : 'label_en'"
            item-value="value"
            v-model="item.status"
          >
            <template v-slot:selection="{ item }">
              <v-list-item-title>
                <v-icon :color="item.color">
                  {{ item.icon }}
                </v-icon>
                {{ $i18n.locale == "th" ? item.label : item.label_en }}
              </v-list-item-title>
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item-avatar v-bind="props">
                <v-icon :color="item.color">
                  {{ item.icon }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-title v-bind="props">
                {{ $i18n.locale == "th" ? item.label : item.label_en }}
              </v-list-item-title>
            </template>
          </v-select>
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
            {{ $t("view details") }}
          </v-btn>
        </template>
        <template v-slot:[`item.delete`]="{ item }">
          <v-btn icon color="#FF6B81" @click="deleteCourse(item.course_id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <template v-slot:[`no-results`]>
          <div class="font-bold">
            {{ $t("no data found in table") }}
          </div>
        </template>
      </v-data-table>
    </v-container>
  </v-app>
</template>
  <script>
import headerPage from "@/components/header/headerPage.vue";
import imgCard from "@/components/course/imgCard.vue";
import Swal from "sweetalert2";
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
      {
        label: "เปิดคอร์ส",
        label_en: "Open",
        value: "Active",
        icon: "mdi-play-circle",
        color: "green",
      },
      {
        label: "ปิดคอร์สชั่วคราว",
        label_en: "Temporarily closed",
        value: "TemporaryInActive",
        icon: "mdi-pause-circle",
        color: "#f1c232",
      },
      {
        label: "ปิดคอร์ส",
        label_en: "Closed",
        value: "InActive",
        icon: "mdi-close-circle",
        color: "red",
      },
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
      course_monitors: "CourseMonitorModules/getCourseMonitor",
    }),
    LoadingTable() {
      return !this.courses;
    },
    column() {
      return [
        {
          text: this.$t("course name"),
          align: "start",
          sortable: false,
          value: this.$i18n.locale == "th" ? "course_th" : "course_en",
        },
        {
          text: this.$t("wls name"),
          align: "start",
          sortable: false,
          value: this.$i18n.locale == "th" ? "category" : "category_en",
        },
        {
          text: this.$t("course type"),
          align: "start",
          sortable: false,
          value: this.$i18n.locale == "th" ? "course_type" : "course_type_en",
        },
        {
          text: this.$t("open-close register date"),
          align: "start",
          sortable: false,
          value: "course_open",
        },
        {
          text: this.$t("course status"),
          align: "center",
          sortable: false,
          value: "status",
        },
        { text: "", align: "center", value: "actions", sortable: false },
        { text: "", align: "center", value: "delete", sortable: false },
      ];
    },
  },
  methods: {
    ...mapActions({
      UpdateStatusCourse: "CourseModules/UpdateStatusCourse",
      GetShortCourseMonitor: "CourseMonitorModules/GetShortCourseMonitor",
      DeleteCourse: "CourseModules/DeleteCourse",
    }),
    deleteCourse(course_id) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete course?"),
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("agree"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.GetShortCourseMonitor({ course_id: course_id }).then(
            async () => {
              if (this.course_monitors) {
                let current_student = 0;
                current_student = this.course_monitors.map(
                  (v) => (current_student += v.m_current_student)
                );
                if (current_student.some((v) => v > 0)) {
                  Swal.fire({
                    icon: "error",
                    title: this.$t("unable to delete course"),
                    text: this.$t("because there are students in the course"),
                    timer: 3000,
                    timerProgressBar: true,
                    showCancelButton: false,
                    showConfirmButton: false,
                  });
                } else {
                  this.DeleteCourse({
                    course_id: course_id,
                  });
                }
              }
            }
          );
        }
      });
    },
    GenDate(date) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(date).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        options
      );
    },
    updateStatusCourse(item, course_id, status) {
      if (status !== "Active") {
        this.GetShortCourseMonitor({ course_id: course_id }).then(async () => {
          if (this.course_monitors) {
            let current_student = 0;
            current_student = this.course_monitors.map(
              (v) => (current_student += v.m_current_student)
            );
            if (current_student.some((v) => v > 0)) {
              item.status = "Active";
              Swal.fire({
                icon: "error",
                title: this.$t("unable to close course"),
                text: this.$t("because there are students in the course"),
                timer: 3000,
                timerProgressBar: true,
                showCancelButton: false,
                showConfirmButton: false,
              });
            } else {
              this.UpdateStatusCourse({
                courseStatus: status,
                courseId: course_id,
              });
            }
          }
        });
      } else {
        this.UpdateStatusCourse({
          courseStatus: status,
          courseId: course_id,
        });
      }
    },
  },
};
</script>
<style>
</style>
  