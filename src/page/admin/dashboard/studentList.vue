<template>
  <v-container>
    <loading-overlay :loading="dashboard_loading"> </loading-overlay>

    <v-row dense>
      <v-col cols="12" sm="6">
        <headerPage :breadcrumbs="breadcrumbs"></headerPage>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          hide-details
          dense
          prepend-inner-icon="mdi-magnify"
          outlined
          :placeholder="$t('search')"
          v-model="search"
          color="#FF6B81"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- 4 TAB -->
    <v-row dense class="mb-10">
      <!-- TAB 1  ผู้เรียนทั้งหมด-->
      <v-col cols="12" sm="6" md="6" lg="3" @click="clickTab('allLearners')">
        <img-card
          class="cursor-pointer drop-shadow-lg"
          :class="tab === 'allLearners' ? 'img-card-active' : ''"
          style="border-radius: 16px"
        >
          <template v-slot:img>
            <v-img src="@/assets/studentsList/allstudent.svg"></v-img>
          </template>
          <template v-slot:header>
            <div class="font-bold">{{ $t("all students") }}</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{ get_student_value?.countStudents }}
              </v-col>
              <v-col class="text-sm">{{ $t("person") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
      <!-- TAB 2 ผู้เรียนปัจจุบัน-->
      <v-col
        cols="12"
        sm="6"
        md="6"
        lg="3"
        @click="clickTab('currentLearners')"
      >
        <img-card
          class="cursor-pointer drop-shadow-lg"
          :class="tab === 'currentLearners' ? 'img-card-active' : ''"
          style="border-radius: 16px"
        >
          <template v-slot:img>
            <v-img src="@/assets/studentsList/nowstudent.svg"></v-img>
          </template>
          <template v-slot:header>
            <div class="font-bold">{{ $t("current students") }}</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{ get_student_value?.currentStudent }}
              </v-col>
              <v-col class="text-sm">{{ $t("person") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
      <!-- TAB 3 ผู้เรียนใกล้จบ-->
      <v-col
        cols="12"
        sm="6"
        md="6"
        lg="3"
        @click="clickTab('learnersNearingGrad')"
      >
        <img-card
          class="cursor-pointer drop-shadow-lg"
          :class="tab === 'learnersNearingGrad' ? 'img-card-active' : ''"
          style="border-radius: 16px"
        >
          <template v-slot:img>
            <v-img
              max-height="90"
              max-width="70"
              src="@/assets/studentsList/studentgrad.svg"
            ></v-img>
          </template>
          <template v-slot:header>
            <div class="font-bold">{{ $t("graduating students") }}</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{ get_student_value?.potencialsStudent }}
              </v-col>
              <v-col class="text-sm">{{ $t("person") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
      <!-- TAB 4 ผู้เรียนจองคอร์ส-->
      <v-col cols="12" sm="6" md="6" lg="3" @click="clickTab('learnersBooked')">
        <img-card
          class="cursor-pointer drop-shadow-lg"
          :class="tab === 'learnersBooked' ? 'img-card-active' : ''"
          style="border-radius: 16px"
        >
          <template v-slot:img>
            <v-img src="@/assets/studentsList/booked.svg"></v-img>
          </template>

          <template v-slot:header>
            <div class="font-bold">{{ $t("students reserve a course") }}</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{ get_student_value.countReserve }}
              </v-col>
              <v-col class="text-sm">{{ $t("person") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
    </v-row>
    <!-- Detail Tab 1 -->
    <div v-for="(items, index) in get_all_student_list.studentAll" :key="index">
      <v-data-table
        :headers="data_tab_one"
        @page-count="pageCount = $event"
        class="elevation-1 header-table"
        :items="items.studentListAll"
        :search="search"
        v-if="tab == 'allLearners'"
      >
        <!-- <template v-slot:[`header`]="{ data_tab_one }">
          <th v-for="headerItem in data_tab_one" :key="headerItem.text">
            <div class="text-end">{{ headerItem.text }}</div>
          </th>
        </template> -->

        <template v-slot:no-results>
          <span>{{ $t("no data found in table") }}</span>
        </template>

        <template v-slot:[`item.course`]="{ item }">
          {{ `${item.courseCount} ${$t("courses")}` }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            color="#FF6B81"
            :to="{
              name: 'UserDetail',
              params: {
                action: 'view',
                account_id: item.studentId,
                from: 'Dashboard',
              },
            }"
          >
            <v-icon>mdi-text-box-search-outline</v-icon>
            {{ $t("view student details") }}
          </v-btn>
        </template>
      </v-data-table>
    </div>

    <!-- Detail Tab 2 -->
    <div v-if="tab == 'currentLearners'">
      <v-data-table
        :headers="data_tab_two"
        @page-count="pageCount = $event"
        class="elevation-1 header-table"
        :items="get_current_student.currentStudent?.studentList"
        :search="search"
      >
        <template v-slot:no-results>
          <span>{{ $t("no data found in table") }}</span>
        </template>
        <template v-slot:[`item.course`]="{ item }">
          {{ `${item.countStudent} ${$t("courses")}` }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            color="#FF6B81"
            :to="{
              name: 'UserDetail',
              params: {
                action: 'view',
                account_id: item.studentId,
                from: 'Dashboard',
              },
            }"
          >
            <v-icon>mdi-text-box-search-outline</v-icon>
            {{ $t("view student details") }}
          </v-btn>
        </template>
      </v-data-table>
    </div>

    <!-- Detail Tab 3 -->
    <div v-if="tab == 'learnersNearingGrad'">
      <v-data-table
        :headers="data_tab_three"
        @page-count="pageCount = $event"
        class="elevation-1 header-table"
        :items="get_potential_student.potencials"
        :search="search"
      >
        <template v-slot:no-results>
          <span>{{ $t("no data found in table") }}</span>
        </template>
        <template v-slot:[`item.courseDetail`]="{ item }">
          <v-btn text color="#FF6B81" @click="dialogDetailEnd(item)">
            <v-icon>mdi-text-box-search-outline</v-icon>
            {{ $t("view course details") }}
          </v-btn>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            color="#FF6B81"
            :to="{
              name: 'UserDetail',
              params: {
                action: 'view',
                account_id: item.studentId,
                from: 'Dashboard',
              },
            }"
          >
            <v-icon>mdi-text-box-search-outline</v-icon>
            {{ $t("view student details") }}
          </v-btn>
        </template>
      </v-data-table>
    </div>

    <!-- Detail Tab 4 -->
    <div v-if="tab == 'learnersBooked'">
      <v-data-table
        :headers="data_tab_four"
        @page-count="pageCount = $event"
        class="elevation-1 header-table"
        :items="get_reserve_student.countReserve?.studentList"
        :search="search"
      >
        <template v-slot:no-results>
          <span>{{ $t("no data found in table") }}</span>
        </template>
        <template v-slot:[`item.courseDetail`]="{ item }">
          <v-btn text color="#FF6B81" @click="dialogDetailBooked(item)">
            <v-icon>mdi-text-box-search-outline</v-icon>
            {{ $t("view course details") }}
          </v-btn>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            color="#FF6B81"
            :to="{
              name: 'UserDetail',
              params: {
                action: 'view',
                account_id: item.studentId,
                from: 'Dashboard',
              },
            }"
          >
            <v-icon>mdi-text-box-search-outline</v-icon>
            {{ $t("view student details") }}
          </v-btn>
        </template>
      </v-data-table>
    </div>

    <!-- DIALOG END-->
    <v-dialog v-model="course_detail_dialog_end" persistent max-width="600px">
      <v-card>
        <v-card-title class="sticky-header">
          <v-row dense>
            <v-col align="center">
              {{ $t("course details") }}
            </v-col>
            <v-col cols="auto" align="end">
              <v-btn icon @click="course_detail_dialog_end = false">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text v-if="potential_user_course.length > 0">
          <v-row
            v-for="(data, data_index) in this.potential_user_course"
            :key="data_index"
          >
            <label class="text-[#FF6B81] font-bold"
              >{{ $t("courses at") }} {{ data_index + 1 }}</label
            >
            <!-- ชื่อคอร์ส -->
            <v-col cols="12">
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="
                  $i18n.locale == 'th' ? data.courseNameTh : data.courseNameEn
                "
                :label="$t('course name')"
                color="#FF6B81"
              >
                <template v-slot:append>
                  <v-icon :color="'#FF6B81'">mdi-school-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- ชื่อโค้ช -->
            <v-col cols="12">
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="
                  $i18n.locale == 'th' ? data.coachName : data.coachNameEn
                "
                :label="$t('coach name')"
                color="#FF6B81"
              >
                <template v-slot:append>
                  <v-icon :color="'#FF6B81'">mdi-account-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- ชนิดคอร์ส -->
            <v-col cols="12" :sm="data.optionName ? 6 : 0">
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="
                  $i18n.locale == 'th'
                    ? data.courseTypeNameTh
                    : data.courseTypeNameEn
                "
                :label="$t('course type')"
                color="#FF6B81"
              >
                <template v-slot:append>
                  <v-icon :color="'#FF6B81'">mdi-book-multiple-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- แพ็กเกจ -->
            <v-col v-if="data.optionName" cols="12" sm="6">
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="`${
                  $i18n.locale == 'th' ? data.optionName : data.optionNameEn
                } (${data.packageName})`"
                :label="$t('package')"
                color="#FF6B81"
              >
                <template v-slot:append>
                  <v-icon :color="'#FF6B81'">mdi-book-multiple-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- DIALOG BOOKED-->
    <v-dialog
      v-model="course_detail_dialog_booked"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title class="sticky-header">
          <v-row dense>
            <v-col align="center">
              {{ $t("course details") }}
            </v-col>
            <v-col cols="auto" align="end">
              <v-btn icon @click="course_detail_dialog_booked = false">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text v-if="detail_dialog_booked?.course?.length > 0">
          <v-row
            v-for="(item, index) in detail_dialog_booked.course"
            :key="index"
          >
            <label class="text-[#FF6B81] font-bold"
              >{{ $t("courses at") }} {{ index + 1 }}</label
            >
            <!-- ชื่อคอร์ส -->
            <v-col cols="12">
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="
                  $i18n.locale == 'th' ? item.courseNameTh : item.courseNameEn
                "
                :label="$t('course name')"
                color="#FF6B81"
              >
                <template v-slot:append>
                  <v-icon :color="'#FF6B81'">mdi-school-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <!-- โค้ช -->
            <v-col cols="12">
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="
                  $i18n.locale == 'th' ? item.coachName : item.coachNameEn
                "
                :label="$t('coach name')"
                color="#FF6B81"
              >
                <template v-slot:append>
                  <v-icon :color="'#FF6B81'">mdi-account-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <!-- สถานะคอร์ส -->
            <v-col cols="12" sm="6">
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="
                  course_status_options.filter(
                    (v) => v.value === item.status
                  )[0]?.label
                "
                :label="$t('course status')"
                color="#FF6B81"
              >
                <template v-slot:append>
                  <v-icon :color="'#FF6B81'">mdi-book-multiple-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <!-- แพ็กเกจ -->
            <v-col cols="12" sm="6" v-if="item.optionName">
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="`${
                  $i18n.locale == 'th' ? item.optionName : item.optionNameEn
                }  (${item.packageName})`"
                :label="$t('package')"
                color="#FF6B81"
              >
                <template v-slot:append>
                  <v-icon :color="'#FF6B81'">mdi-book-multiple-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- ชนิดคอร์ส -->
            <v-col
              cols="12"
              sm="6"
              :class="
                item.courseTypeNameTh === 'คอร์สเรียนทั่วไป' ? 'mb-5' : ''
              "
            >
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="
                  $i18n.locale == 'th'
                    ? item.courseTypeNameTh
                    : item.courseTypeNameEn
                "
                :label="$t('course type')"
                color="#FF6B81"
              >
                <template v-slot:append>
                  <v-icon :color="'#FF6B81'">mdi-book-multiple-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- วันที่จอง -->
            <v-col cols="12" sm="6" class="mb-5">
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="fulldate(item.createdDate)"
                :label="$t('reserve date')"
                color="#FF6B81"
              >
                <template v-slot:append>
                  <v-icon :color="'#FF6B81'">mdi-calendar</v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import headerPage from "@/components/header/headerPage.vue";
import imgCard from "@/components/course/imgCard.vue";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";

export default {
  components: {
    headerPage,
    imgCard,
    loadingOverlay,
  },
  data: () => ({
    search: "",
    tab: "allLearners",
    course_detail_dialog_booked: false,
    course_detail_dialog_end: false,
    detail_dialog_booked: "",
    detail_dialog_end: "",
    date_booked: "",
    course_type_options: [
      {
        label: "Exclusive",
        value: "Exclusive Package",
        color: "#43A4F5",
      },
      {
        label: "Group",
        value: "Group Package",
        color: "#ED7D2B",
      },
      {
        label: "Family",
        value: "Family Package",
        color: "#58A144",
      },
    ],
    course_type_options_end: [
      {
        label: "Exclusive",
        value: "Exclusive Package",
        color: "#43A4F5",
      },
      {
        label: "Group",
        value: "Group Package",
        color: "#ED7D2B",
      },
      {
        label: "Family",
        value: "Family Package",
        color: "#58A144",
      },
    ],
    date_course_booked: "",
    potential_user_course: [],
  }),
  mounted() {
    this.GetStudentValue();
    this.clickTab(this.tab);
    // this.GetAllStudentList();
  },
  methods: {
    ...mapActions({
      // GetStudentListValue: "DashboardModules/GetStudentListValue",
      GetAllStudentList: "DashboardModules/GetAllStudentList",
      GetCurrentStudent: "DashboardModules/GetCurrentStudent",
      GetPotentialStudent: "DashboardModules/GetPotentialStudent",
      GetReserveStudent: "DashboardModules/GetReserveStudent",
      GetStudentValue: "DashboardModules/GetStudentValue",
    }),

    dialogDetailEnd(items) {
      this.potential_user_course = items.courseDetail;
      this.course_detail_dialog_end = true;
      // this.detail_dialog_end = items;
    },

    dialogDetailBooked(items) {
      this.course_detail_dialog_booked = true;
      this.detail_dialog_booked = items;
      for (const item of items.course) {
        this.date_course_booked = new Date(item.createdDate).toLocaleDateString(
          "th-TH",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
      }
    },
    fulldate(item) {
      return new Date(item).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    },
    clickTab(item) {
      this.tab = item;
      if (item == "allLearners") {
        this.GetAllStudentList();
      } else if (item == "currentLearners") {
        this.GetCurrentStudent();
      } else if (item == "learnersNearingGrad") {
        this.GetPotentialStudent();
      } else if (item == "learnersBooked") {
        this.GetReserveStudent();
      } else {
        this.$t("no data found in table");
      }
    },
  },
  computed: {
    ...mapGetters({
      dashboard_loading: "DashboardModules/getloading",
      get_student_list_value: "DashboardModules/getStudentListValue",
      get_student_value: "DashboardModules/getStudentValue",
      get_all_student_list: "DashboardModules/getAllStudentList",
      get_current_student: "DashboardModules/getCurrentStudent",
      get_potential_student: "DashboardModules/getPotentialStudent",
      get_reserve_student: "DashboardModules/getReserveStudent",
    }),
    breadcrumbs() {
      return [
        { text: this.$t("dashboard"), to: "Dashboard" },
        { text: this.$t("student list"), to: "" },
      ];
    },
    course_status_options() {
      return [
        {
          label: this.$t("full courses"),
          value: "Close",
          color: "#A1A1A1",
        },
        {
          label: this.$t("course available"),
          value: "Open",
          color: "#8CD977",
        },
      ];
    },
    data_tab_one() {
      return [
        {
          text: this.$t("first name"),
          value: this.$i18n.locale == "th" ? "firstNameTh" : "firstNameEng",
          sortable: false,
        },
        {
          text: this.$t("last name"),
          value: this.$i18n.locale == "th" ? "lastNameTh" : "lastNameEng",
          sortable: false,
        },
        { text: this.$t("phone number"), value: "tel", sortable: false },
        { text: this.$t("email"), value: "email", sortable: false },
        { text: this.$t("username"), value: "username", sortable: false },
        {
          text: this.$t("number of courses"),
          value: "course",
          sortable: false,
        },
        { text: "", align: "center", value: "actions", sortable: false },
      ];
    },
    data_tab_two() {
      return [
        {
          text: this.$t("first name"),
          value: this.$i18n.locale == "th" ? "firstNameTh" : "firstNameEng",
          sortable: false,
        },
        {
          text: this.$t("last name"),
          value: this.$i18n.locale == "th" ? "lastNameTh" : "lastNameEng",
          sortable: false,
        },
        { text: this.$t("phone number"), value: "tel", sortable: false },
        { text: this.$t("email"), value: "email", sortable: false },
        { text: this.$t("username"), value: "username", sortable: false },
        {
          text: this.$t("number of courses"),
          value: "course",
          sortable: false,
        },
        { text: "", align: "center", value: "actions", sortable: false },
      ];
    },
    data_tab_three() {
      return [
        {
          text: this.$t("first name"),
          value: this.$i18n.locale == "th" ? "firstNameTh" : "firstNameEng",
          sortable: false,
        },
        {
          text: this.$t("last name"),
          value: this.$i18n.locale == "th" ? "lasttNameTh" : "lasttNameEng",
          sortable: false,
        },
        { text: this.$t("phone number"), value: "tel", sortable: false },
        { text: this.$t("email"), value: "email", sortable: false },
        { text: this.$t("username"), value: "username", sortable: false },
        {
          text: this.$t("course details"),
          value: "courseDetail",
          sortable: false,
        },
        { text: "", align: "center", value: "actions", sortable: false },
      ];
    },
    data_tab_four() {
      return [
        {
          text: this.$t("first name"),
          value: this.$i18n.locale == "th" ? "firstNameTh" : "firstNameEng",
          sortable: false,
        },
        {
          text: this.$t("last name"),
          value: this.$i18n.locale == "th" ? "lastNameTh" : "lastNameEng",
          sortable: false,
        },
        { text: this.$t("phone number"), value: "tel", sortable: false },
        { text: this.$t("email"), value: "email", sortable: false },
        { text: this.$t("username"), value: "username", sortable: false },
        {
          text: this.$t("course details"),
          value: "courseDetail",
          sortable: false,
        },
        { text: "", align: "center", value: "actions", sortable: false },
      ];
    },
  },
};
</script>
  
  <style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  margin-bottom: 15px;
  /* box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); */
}
</style>