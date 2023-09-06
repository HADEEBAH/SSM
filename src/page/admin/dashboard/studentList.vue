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
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- 4 TAB -->
    <v-row dense class="mb-10" v-if="get_potential_student_list.countStudents">
      <!-- TAB 1  ผู้เรียนทั้งหมด-->
      <v-col cols="12" sm="6" md="6" lg="3" @click="tab = 'allLearners'">
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
                {{ get_potential_student_list.countStudents }}
              </v-col>
              <v-col class="text-sm">{{ $t("person") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
      <!-- TAB 2 ผู้เรียนปัจจุบัน-->
      <v-col cols="12" sm="6" md="6" lg="3" @click="tab = 'currentLearners'">
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
                {{ get_potential_student_list.currentStudent.countStudentCurrent }}
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
        @click="tab = 'learnersNearingGrad'"
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
                {{ get_potential_student_list.potencialsStudent.countStudentPotencials }}
              </v-col>
              <v-col class="text-sm">{{ $t("person") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
      <!-- TAB 4 ผู้เรียนจองคอร์ส-->
      <v-col cols="12" sm="6" md="6" lg="3" @click="tab = 'learnersBooked'">
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
                {{ get_potential_student_list.countReserve.studentList.length }}
              </v-col>
              <v-col class="text-sm">{{ $t("person") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
    </v-row>

    <!-- Detail Tab 1 -->
    <div v-for="(items, index) in get_potential_student_list.studentAll" :key="index">
      <v-data-table
        :headers="data_tab_one"
        @page-count="pageCount = $event"
        class="elevation-1 header-table"
        :items="items.studentListAll"
        :search="search"
        v-if="tab == 'allLearners'"
      >
        <template v-slot:[`item.course`]="{ item }">
          <div text color="#FF6B81">
            {{ `${item.courseCount} ${$t("course")}` }}
          </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            color="#FF6B81"
            @click="
              $router.push({
                name: 'UserDetail',
                params: {
                  action: 'view',
                  account_id: item.studentId,
                  from: 'Dashboard',
                },
              })
            "
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
        :items="get_potential_student_list.currentStudent.studentList"
        :search="search"
      >
        <template v-slot:[`item.course`]="{ item }">
          {{ `${item.courseCount} คอร์ส` }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            color="#FF6B81"
            @click="
              $router.push({
                name: 'UserDetail',
                params: {
                  action: 'view',
                  account_id: item.studentId,
                  from: 'Dashboard',
                },
              })
            "
          >
            <v-icon>mdi-text-box-search-outline</v-icon>
            ดูรายละเอียดผู้เรียน
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
        :items="get_potential_student_list.potencialsStudent.potencials"
        :search="search"
      >
        <template v-slot:[`item.courseDetail`]="{ item }">
          <v-btn text color="#FF6B81" @click="dialogDetailEnd(item)">
            <v-icon>mdi-text-box-search-outline</v-icon>
            ดูรายละเอียดคอร์ส
          </v-btn>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            color="#FF6B81"
            @click="
              $router.push({
                name: 'UserDetail',
                params: {
                  action: 'view',
                  account_id: item.studentId,
                  from: 'Dashboard',
                },
              })
            "
          >
            <v-icon>mdi-text-box-search-outline</v-icon>
            ดูรายละเอียดผู้เรียน
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
        :items="get_potential_student_list.countReserve.studentList"
        :search="search"
      >
        <template v-slot:[`item.courseDetail`]="{ item }">
          <v-btn text color="#FF6B81" @click="dialogDetailBooked(item)">
            <v-icon>mdi-text-box-search-outline</v-icon>
            ดูรายละเอียดคอร์ส
          </v-btn>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            text
            color="#FF6B81"
            @click="
              $router.push({
                name: 'UserDetail',
                params: {
                  action: 'view',
                  account_id: item.studentId,
                  from: 'Dashboard',
                },
              })
            "
          >
            <v-icon>mdi-text-box-search-outline</v-icon>
            ดูรายละเอียดผู้เรียน
          </v-btn>
        </template>
      </v-data-table>
    </div>

    <!-- DIALOG END-->
    <v-dialog v-model="course_detail_dialog_end" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <v-row dense>
            <v-col cols="12" align="end">
              <v-btn icon @click="course_detail_dialog_end = false">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
            <v-row dense>
              <v-col cols="12" align="center"> รายละเอียดคอร์ส </v-col>
            </v-row>
          </v-row>
        </v-card-title>

        <v-card-text v-if="potential_user_course.length > 0">
          <v-row
            v-for="(data, data_index) in this.potential_user_course"
            :key="data_index"
          >
            <label class="text-[#FF6B81] font-bold"
              >คอร์สที่ {{ data_index + 1 }}</label
            >
            <!-- ชื่อคอร์ส -->
            <v-col cols="12">
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="data.courseNameTh"
                label="ชื่อคอร์ส"
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
                :value="data.coachName"
                label="ชื่อโค้ช"
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
                :value="data.courseTypeNameTh"
                label="ชนิดคอร์ส"
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
                :value="`${data.optionName} (${data.packageName})`"
                label="แพ็กเกจ"
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
        <v-card-title>
          <v-row dense>
            <v-col cols="12" align="end">
              <v-btn icon @click="course_detail_dialog_booked = false">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
            <v-row dense>
              <v-col cols="12" align="center"> รายละเอียดคอร์ส </v-col>
            </v-row>
          </v-row>
        </v-card-title>

        <v-card-text v-if="detail_dialog_booked?.course?.length > 0">
          <v-row
            v-for="(item, index) in detail_dialog_booked.course"
            :key="index"
          >
            <!-- ชื่อคอร์ส -->
            <v-col cols="12">
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="item.courseNameTh"
                label="ชื่อคอร์ส"
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
                :value="item.coachName"
                label="โค้ช"
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
                label="สถานะคอร์ส"
                color="#FF6B81"
              >
                <template v-slot:append>
                  <v-icon :color="'#FF6B81'">mdi-book-multiple-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <!-- แพ็กเกจ -->
            <v-col cols="12" sm="6">
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="`${item.optionName}  (${item.packageName})`"
                label="แพ็กเกจ"
                color="#FF6B81"
              >
                <template v-slot:append>
                  <v-icon :color="'#FF6B81'">mdi-book-multiple-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- ชนิดคอร์ส -->
            <v-col cols="12" sm="6" class="mb-5">
              <v-text-field
                hide-details
                outlined
                readonly
                dense
                :value="item.courseTypeNameTh"
                label="ชนิดคอร์ส"
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
                :value="item.fullDateTh"
                label="วันที่จอง"
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
    breadcrumbs: [
      { text: "แดชบอร์ด", to: "Dashboard" },
      { text: "รายชื่อนักเรียน", to: "" },
    ],
    search: "",
    tab: "allLearners",
    data_tab_one: [
      { text: "ชื่อ", value: "firstNameTh", sortable: false },
      { text: "นามสกุล", value: "lastNameTh", sortable: false },
      { text: "เบอร์โทรศัพท์", value: "tel", sortable: false },
      { text: "อีเมล", value: "email", sortable: false },
      { text: "ชื่อผู้ใช้", value: "username", sortable: false },
      { text: "จำนวนคอร์ส", value: "course", sortable: false },
      { text: "", align: "center", value: "actions", sortable: false },
    ],
    data_tab_two: [
      { text: "ชื่อ", value: "firstNameTh", sortable: false },
      { text: "นามสกุล", value: "lastNameTh", sortable: false },
      { text: "เบอร์โทรศัพท์", value: "tel", sortable: false },
      { text: "อีเมล", value: "email", sortable: false },
      { text: "ชื่อผู้ใช้", value: "username", sortable: false },
      { text: "จำนวนคอร์ส", value: "course", sortable: false },
      { text: "", align: "center", value: "actions", sortable: false },
    ],
    data_tab_three: [
      { text: "ชื่อ", value: "firstNameTh", sortable: false },
      { text: "นามสกุล", value: "lasttNameTh", sortable: false },
      { text: "เบอร์โทรศัพท์", value: "tel", sortable: false },
      { text: "อีเมล", value: "email", sortable: false },
      { text: "ชื่อผู้ใช้", value: "username", sortable: false },
      { text: "รายละเอียดคอร์ส", value: "courseDetail", sortable: false },
      { text: "", align: "center", value: "actions", sortable: false },
    ],
    data_tab_four: [
      { text: "ชื่อ", value: "firstNameTh", sortable: false },
      { text: "นามสกุล", value: "lastNameTh", sortable: false },
      { text: "เบอร์โทรศัพท์", value: "tel", sortable: false },
      { text: "อีเมล", value: "email", sortable: false },
      { text: "ชื่อผู้ใช้", value: "username", sortable: false },
      { text: "รายละเอียดคอร์ส", value: "courseDetail", sortable: false },
      { text: "", align: "center", value: "actions", sortable: false },
    ],

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
    course_status_options: [
      {
        label: "คอร์สเต็ม",
        value: "Close",
        color: "#A1A1A1",
      },
      {
        label: "คอร์สว่าง",
        value: "Open",
        color: "#8CD977",
      },
    ],
    date_course_booked: "",
    potential_user_course: [],
  }),
  mounted() {
    this.GetPotentialStudentList();
  },
  methods: {
    ...mapActions({
      GetPotentialStudentList: "DashboardModules/GetPotentialStudentList",
    }),

    dialogDetailEnd(items) {
      this.potential_user_course = items.coursesDetaill;
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
  },
  computed: {
    ...mapGetters({
      get_potential_student_list: "DashboardModules/getPotentialStudentList",
      dashboard_loading: "DashboardModules/getloading",
    }),
  },
};
</script>
  
  <style>
</style>