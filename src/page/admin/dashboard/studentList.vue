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
          placeholder="ค้นหา"
          v-model="search"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- 4 TAB -->
    <v-row dense class="mb-10" v-if="get_potential.countStudents">
      <!-- TAB 1  ผู้เรียนทั้งหมด-->
      <v-col cols="12" sm="6" md="6" lg="3" @click="tab = 'allLearners'">
        <img-card
          class="cursor-pointer drop-shadow-lg"
          :class="tab === 'allLearners' ? 'img-card-active' : ''"
          style="border-radius: 16px"
        >
          <template v-slot:img>
            <v-img src="../../../assets/studentsList/allstudent.svg"></v-img>
          </template>
          <template v-slot:header>
            <div class="font-bold">ผู้เรียนทั้งหมด</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{ get_potential.countStudents }}
              </v-col>
              <v-col class="text-sm">คน</v-col>
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
            <v-img src="../../../assets/studentsList/nowstudent.svg"></v-img>
          </template>
          <template v-slot:header>
            <div class="font-bold">ผู้เรียนปัจจุบัน</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{ get_potential.currentStudent.countStudentCurrent }}
              </v-col>
              <v-col class="text-sm">คน</v-col>
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
              src="../../../assets/studentsList/studentgrad.svg"
            ></v-img>
          </template>
          <template v-slot:header>
            <div class="font-bold">ผู้เรียนใกล้จบ</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{ get_potential.potencialsStudent.countStudentPotencials }}
              </v-col>
              <v-col class="text-sm">คน</v-col>
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
            <v-img src="../../../assets/studentsList/booked.svg"></v-img>
          </template>

          <template v-slot:header>
            <div class="font-bold">ผู้เรียนจองคอร์ส</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{ get_potential.countReserve.studentList.length }}
              </v-col>
              <v-col class="text-sm">คน</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
    </v-row>

    <!-- Detail Tab 1 -->
    <div v-for="(items, index) in get_potential.studentAll" :key="index">
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
            {{ `${item.courseCount} คอร์ส` }}
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

    <!-- Detail Tab 2 -->
    <div v-if="tab == 'currentLearners'">
      <v-data-table
        :headers="data_tab_two"
        @page-count="pageCount = $event"
        class="elevation-1 header-table"
        :items="get_potential.currentStudent.studentList"
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
        :items="get_potential.potencialsStudent.potencials"
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
        :items="get_potential.countReserve.studentList"
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
      <v-card style="border-radius: 16px">
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

        <v-card-title>
          <!-- <pre>{{ detail_dialog_end }}</pre> -->
          <v-row dense>
            <v-col cols="12" class="my-2">
              <span class="font-bold"> ชื่อคอร์ส: </span>
              {{ detail_dialog_end.courseNameTh }}
            </v-col>
            <v-col cols="12" class="my-2">
              <span class="font-bold"> ชนิดคอร์ส: </span>
              {{ detail_dialog_end.courseTypeNameTh }}
              <span
                :style="`color:${
                  course_type_options.filter(
                    (v) => v.value === detail_dialog_end.packageName
                  )[0]?.color
                }`"
              >
                ({{
                  course_type_options.filter(
                    (v) => v.value === detail_dialog_end.packageName
                  )[0]?.label
                }})
              </span>
            </v-col>
          </v-row>
        </v-card-title>
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

        <v-card-title
          v-for="(item, index) in detail_dialog_booked.course"
          :key="index"
        >
          <v-row dense>
            <v-col cols="12" class="my-2">
              <span class="font-bold"> ชื่อคอร์ส: </span>{{ item.courseNameTh }}
            </v-col>
            <v-col cols="6" class="my-2">
              <span class="font-bold"> สถานะคอร์ส: </span>
              <span
                :style="`color:${
                  course_status_options.filter(
                    (v) => v.value === item.status
                  )[0]?.color
                }`"
              >
                ({{
                  course_status_options.filter(
                    (v) => v.value === item.status
                  )[0]?.label
                }})
              </span>
            </v-col>

            <v-col cols="6" class="my-2">
              <span class="font-bold">แพ็กเกจ:</span> {{ item.optionName }}
              <span
                :style="`color:${
                  course_type_options.filter(
                    (v) => v.value === item.packageName
                  )[0]?.color
                }`"
              >
                ({{
                  course_type_options.filter(
                    (v) => v.value === item.packageName
                  )[0]?.label
                }})
              </span>
            </v-col>
            <v-col cols="6" class="my-2">
              <span class="font-bold"> ชนิดคอร์ส: </span>
              {{ item.courseTypeNameTh }}
            </v-col>

            <v-col cols="6" class="my-2">
              <span class="font-bold"> วันที่จอง: </span>
              {{ new Date(item.createdDate).toLocaleDateString("th-TH") }}
            </v-col>

            <v-col cols="12" class="my-2">
              <span class="font-bold"> โค้ช: </span>
              {{ item.coachName }}
            </v-col>
          </v-row>
        </v-card-title>
      </v-card>
    </v-dialog>
  </v-container>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import headerPage from "@/components/header/headerPage.vue";
import imgCard from "@/components/course/imgCard.vue";
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";

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
  }),
  mounted() {
    this.GetPotential();
  },
  methods: {
    ...mapActions({
      GetPotential: "DashboardModules/GetPotential",
    }),

    dialogDetailEnd(items) {
      this.course_detail_dialog_end = true;
      this.detail_dialog_end = items;
      // // console.log("detail_dialog_end", this.detail_dialog_end);
    },

    dialogDetailBooked(items) {
      this.course_detail_dialog_booked = true;
      this.detail_dialog_booked = items;
    },
  },
  computed: {
    ...mapGetters({
      get_potential: "DashboardModules/getPotential",
      dashboard_loading: "DashboardModules/getloading",
    }),
  },
};
</script>
  
  <style>
</style>