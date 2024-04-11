<template>
  <v-container>
    <loading-overlay :loading="reserve_is_loadings"></loading-overlay>
    <header-page slot_tag :title="$t(`manage course booking`)">
      <v-btn
        dark
        dense
        depressed
        color="#ff6b81"
        @click="OpenDialogExport()"
      >{{ $t('export') }}</v-btn>
    </header-page>
    <v-row dense class="mb-3">
      <v-col></v-col>
      <v-col cols="12" md="6">
        <v-text-field
          class="w-full"
          outlined
          dense
          hide-details
          :placeholder="$t(`search`)"
          v-model="search_filter"
          append-outer-icon="mdi-magnify"
          @click:append-outer="clickTab(search_filter)"
          @keyup.enter="clickTab(search_filter)"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row dense class="mb-3">
      <v-col cols="12" sm="3" @click="(tab_selected = ''), clickTab()">
        <img-card
          :class="
            tab_selected === ''
              ? 'img-card-active cursor-pointer drop-shadow-lg'
              : 'cursor-pointer drop-shadow-lg'
          "
          style="border-radius: 16px"
        >
          <template v-slot:img>
            <v-img
              max-height="90"
              max-width="70"
              src="@/assets/coachLeave/all.png"
            ></v-img>
          </template>
          <template v-slot:header>
            <div class="font-bold">{{ $t("all") }}</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{ reserve_list.amount ? reserve_list.amount : 0 }}
              </v-col>
              <v-col class="text-sm">{{ $t("list") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>

      <v-col cols="12" sm="3" @click="(tab_selected = 'waiting'), clickTab()">
        <img-card
          class="cursor-pointer drop-shadow-lg"
          :class="tab_selected === 'waiting' ? 'img-card-active' : ''"
          style="border-radius: 16px"
        >
          <template v-slot:img>
            <v-img
              max-height="90"
              max-width="70"
              src="@/assets/coachLeave/wait.png"
            ></v-img>
          </template>
          <template v-slot:header>
            <div class="font-bold">{{ $t("waiting") }}</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{
                  reserve_list.amountPending ? reserve_list.amountPending : 0
                }}
              </v-col>
              <v-col class="text-sm">{{ $t("list") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>

      <v-col cols="12" sm="3" @click="(tab_selected = 'contacted'), clickTab()">
        <img-card
          class="cursor-pointer drop-shadow-lg"
          :class="tab_selected === 'contacted' ? 'img-card-active' : ''"
          style="border-radius: 16px"
        >
          <template v-slot:img>
            <v-img
              max-height="90"
              max-width="70"
              src="@/assets/coachLeave/accept.png"
            ></v-img>
          </template>
          <template v-slot:header>
            <div class="font-bold">{{ $t("confirmed") }}</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{
                  reserve_list.amountApproved ? reserve_list.amountApproved : 0
                }}
              </v-col>
              <v-col class="text-sm">{{ $t("list") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>

      <v-col cols="12" sm="3" @click="(tab_selected = 'cancel'), clickTab()">
        <img-card
          class="cursor-pointer drop-shadow-lg"
          :class="tab_selected === 'cancel' ? 'img-card-active' : ''"
          style="border-radius: 16px"
        >
          <template v-slot:img>
            <v-img
              max-height="90"
              max-width="70"
              src="@/assets/coachLeave/disaccept.png"
            ></v-img>
          </template>

          <template v-slot:header>
            <div class="font-bold">{{ $t("canceled") }}</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{ reserve_list.amountCancel ? reserve_list.amountCancel : 0 }}
              </v-col>
              <v-col class="text-sm">{{ $t("list") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
    </v-row>

    <loading-overlay
      v-if="reserve_list_is_loading"
      :loading="reserve_list_is_loading"
    ></loading-overlay>
    <v-card>
      <v-data-table
        class="header-table"
        :headers="columns"
        :items="reserve_list.result"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        @update:sort-by="updateSortBy"
        @update:sort-desc="updateSortDesc"
        :items-per-page.sync="itemsPerPage"
        :server-items-length="
          search_bool ? reserve_list.totalRows : reserve_list.count
        "
        :options.sync="options"
        ref="reserveLists"
        :footer-props="{
          'disable-pagination': disable_pagination_btn,
          'items-per-page-options': [10, 20, 30, 40, 50],
          'items-per-page-text': 'Rows per page:',
        }"
      >
        <template v-slot:no-data>
          <v-row dense>
            <v-col align="center"> {{ $t("no data found") }} </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.createdDate`]="{ item }">
          {{ formatDate(item.createdDate) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-select
            @change="update(item.reserveId, item)"
            dense
            outlined
            hide-details
            item-color="pink"
            :items="status"
            item-text="label"
            item-value="value"
            v-model="item.status"
          >
            <template v-slot:selection="{ item }">
              <v-list-item-title>
                <v-icon :color="item.color">
                  {{ item.icon }}
                </v-icon>
                {{ item.label }}
              </v-list-item-title>
            </template>

            <template v-slot:item="{ props, item }">
              <v-list-item-avatar v-bind="props">
                <v-icon :color="item.color">
                  {{ item.icon }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-title v-bind="props">
                {{ item.label }}
              </v-list-item-title>
            </template>
          </v-select>
        </template>
        <!-- เมื่อค้นหาปล้วไม่มีข้อมูล -->
        <template v-slot:[`no-results`]>
          <div class="font-bold">
            {{ $t("no data found in table") }}
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialogExport">
      <v-card class="pa-3">
        <v-row>
          <v-col cols="12" align="right">
            <v-btn icon @click="closeDialogExport()">
              <v-icon color="#ff6b81">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-card-title>
          <v-row dense>
            <v-col cols="12" align="center" class="font-semibold">{{
              $t("export")
            }}</v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6">
              {{ $t('student name') }}
              <v-autocomplete
                dense
                color="#FF6B81"
                item-color="#ff6b81"
                chips
                class="py-1"
                deletable-chips
                :loading="loading"
                prepend-inner-icon="mdi-magnify"
                v-model="export_filter.student_id"
                cache-items
                :items="username_list"
                :search-input.sync="search"
                :placeholder="$t(`search/Please select a student`)"
                :label="$t(`search`)"
                item-text="fullname"
                item-value="userOneId"
                outlined
                multiple
                clearable
                @input="search = null"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title>
                      {{
                        search
                          ? $t(`data not found`)
                          : $t(`please enter the student's name`)
                      }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    color="#FBF3F5"
                  >
                    {{ $i18n.locale == 'th' ? `${data.item.firstNameTh} ${data.item.lastNameTh}` : `${data.item.firstNameEng} ${data.item.lastNameEng}` }}
                    <v-icon
                      @click="remove(data.item.userOneId)"
                      color="#ff6b81"
                      >mdi-close-circle</v-icon
                    >
                  </v-chip>
                </template>
                <template v-slot:item="{ item }">
                  {{  $i18n.locale == 'th' ? `${item.firstNameTh} ${item.lastNameTh}` : `${item.firstNameEng} ${item.lastNameEng}` }}
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6">
              {{$t('course name')}}
              <v-autocomplete
                  dense
                  :items="courses"
                  :item-text="$i18n.locale == 'th' ? 'course_th' : 'course_en'"
                  item-value="course_id"
                  v-model="export_filter.course_id"
                  :placeholder="$t('please select a course')"
                  outlined
                  multiple
                  hide-details
                  class="py-1"
                  color="#FF6B81"
                  item-color="#FF6B81"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ $t(`data not found`) }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item, index }">
                    <v-chip dark v-if="index === 0" color="#FF6B81">
                      <span>{{
                        $i18n.locale == "th" ? item.course_th : item.course_en
                      }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ export_filter.course_id.length - 1 }}
                      {{ $t("others") }})
                    </span>
                  </template>
                </v-autocomplete>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              {{ $t('course type') }}
              <v-autocomplete
                outlined
                dense
                multiple
                hide-details
                class="py-1"
                v-model="export_filter.course_type_id"
                :items="courseType"
                :item-text="$i18n.locale == 'th' ? 'typeName' : 'typeNameEn'"
                item-value="typeOfValue"
                color="#FF6B81"
                item-color="#FF6B81"
                :placeholder="$t('please select a course type')"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title>
                      {{ $t(`data not found`) }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ item }">
                  <v-chip dark color="#FF6B81">
                    <span>{{
                      $i18n.locale == "th" ? item.typeName : item.typeNameEn
                    }}</span>
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col>
              {{ $t("package") }}
              <v-autocomplete
              dense
              :items="packages"
              item-text="packageName"
              item-value="packageId"
              v-model="export_filter.package_id"
              class="py-1"
              :label="$t('please select a package')"
              outlined
              multiple
              color="#FF6B81"
              item-color="#FF6B81"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip dark v-if="index === 0" color="#FF6B81">
                  <span>{{ item.packageName }}</span>
                </v-chip>
                <span
                  v-if="index === 1"
                  class="grey--text text-caption"
                >
                  (+{{ export_filter.package_id.length - 1 }}
                  {{ $t("others") }})
                </span>
              </template>
            </v-autocomplete>
            </v-col>
            <v-col>
              {{ $t('period') }}
              <v-autocomplete
                dense
                :items="options_data"
                :item-text="
                  $i18n.locale == 'th' ? 'optionName' : 'optionNameEn'
                "
                item-value="optionId"
                v-model="export_filter.option_id"
                class="py-1"
                :label="$t('please select a period')"
                outlined
                hide-details
                multiple
                color="#FF6B81"
                item-color="#FF6B81"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip dark v-if="index === 0" color="#FF6B81">
                    <span>{{
                      $i18n.locale == "th"
                        ? item.optionName
                        : item.optionNameEn
                    }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text text-caption"
                  >
                    (+{{ export_filter.option_id.length - 1 }}
                    {{ $t("others") }})
                  </span>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              {{ $t('reservation date range') }}
              <v-menu
                v-model="export_filter.menu_reserve_date"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    class="py-1"
                    :value="
                      !export_filter.reserve_date
                        ? export_filter.reserve_date
                        : GenDate(export_filter.reserve_date)
                    "
                    :placeholder="$t('please select a date')"
                    outlined
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    color="#FF6B81"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="export_filter.reserve_date"
                  @input="export_filter.menu_reserve_date = false"
                  locale="th-TH"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              {{ $t('class date') }}
              <v-autocomplete
                dense
                :items="dow_filter"
                item-text="dowName"
                item-value="dowId"
                v-model="export_filter.day_of_week_id"
                class="py-1"
                :placeholder="$t('please select a class date')"
                outlined
                hide-details
                multiple
                color="#FF6B81"
                item-color="#FF6B81"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip dark v-if="index === 0" color="#FF6B81">
                    <span>{{ item.dowName }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text text-caption"
                  >
                    (+{{ export_filter.day_of_week_id.length - 1 }}
                    {{ $t("others") }})
                  </span>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col>
              {{ $t('class time') }}
              <v-autocomplete
                dense
                :items="time_filter"
                item-text="timeName"
                item-value="timeId"
                v-model="export_filter.time_id"
                class="py-1"
                :placeholder="$t('please select a class time')"
                outlined
                hide-details
                multiple
                color="#FF6B81"
                item-color="#FF6B81"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip dark v-if="index === 0" color="#FF6B81">
                    <span>{{ item.timeName }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text text-caption"
                  >
                    (+{{ export_filter.time_id.length - 1 }}
                    {{ $t("others") }})
                  </span>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col>
              {{ $t('coach') }}
              <v-autocomplete
                dense
                :items="coach_filter"
                item-text="fullName"
                item-value="accountId"
                v-model="export_filter.coach_id"
                class="py-1"
                :placeholder="$t('please select a class time')"
                outlined
                hide-details
                multiple
                color="#FF6B81"
                item-color="#FF6B81"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip dark v-if="index === 0" color="#FF6B81">
                    <span>{{ $i18n.locale === 'th' ? item.fullNameTh : item.fullNameEn }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text text-caption"
                  >
                    (+{{ export_filter.coach_id.length - 1 }}
                    {{ $t("others") }})
                  </span>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col align="right">
              <v-btn
                outlined
                color="#ff6b81"
              >
                {{ $t('cancel') }}
              </v-btn>
            </v-col>
            <v-col align="left">
              <v-btn
                depressed
                dark
                color="#ff6b81"
                @click="exportReserve()"
              >
                {{ $t('export') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>

      </v-card>
    </v-dialog>
  </v-container>
</template>
  
  <script>
import headerPage from "@/components/header/headerPage.vue";
import imgCard from "@/components/course/imgCard.vue";
import { mapActions, mapGetters } from "vuex";
import LoadingOverlay from "../../../components/loading/loadingOverlay.vue";
import Swal from "sweetalert2";
export default {
  name: "manageCourseReserve",
  components: { headerPage, imgCard, LoadingOverlay },
  data: () => ({
    tab_selected: "",
    search_filter: "",
    sortBy: "date",
    sortDesc: false,
    search_bool: false,
    tabs_temp: "",
    tabs_change: false,
    text_temp: "",
    text_change: false,
    page: 1,
    itemsPerPage: 10,
    reserve_is_loadings: false,
    disable_pagination_btn: false,
    today: new Date(),
    options: {},
    dialogExport: false,
    courseType: [
      {
        typeName: "คอร์สทั่วไป",
        typeNameEn: "General course",
        typeOfValue: "CT_1",
      },
      {
        typeName: "คอร์สระยะสั้น",
        typeNameEn: "Short course",
        typeOfValue: "CT_2",
      },
    ],
    loading: false,
    export_filter : {
      option_id: [],
      student_id: [],
      course_id: [],
      course_type_id: [],
      menu_reserve_date : true,
      reserve_date : "",
      package_id: [],
      day_of_week_id: [],
      time_id: [],
      coach_id: [],
    },
    search: "",
  }),
  watch: {
    options: {
      handler() {
        this.loadItems();
      },
    },
    search(val) {
      if (val?.length > 3) {
        this.loading = true;
        this.searchNameUser({ search_name: val }).then(() => {
          this.loading = false;
        });
      }
    },
    "export_filter.course_id": function (val) {
      this.filterDowAndTime({courses: val})
    }
  },
  created() {
    this.GetCoursesList()
    this.GetPackages()
    this.GetOptions()
    this.GetUserByRole()
  },
  mounted() {},
  computed: {
    ...mapGetters({
      reserve_list: "reserveCourseModules/reserveList",
      reserve_list_is_loading: "reserveCourseModules/reserveListIsLoading",
      username_list: "loginModules/getUsernameList",
      courses: "CourseModules/getCourses",
      packages: "CourseModules/getPackages",
      options_data: "CourseModules/getOptions",
      time_filter: "reserveCourseModules/timeFilter",
      dow_filter: "reserveCourseModules/dowFilter",
      coach_filter: "reserveCourseModules/coachFilter",
    }),
    course_type() {
      return [
        { name: this.$t("all"), value: "" },
        { name: this.$t("waiting"), value: "waiting" },
        { name: this.$t("confirmed"), value: "contacted" },
        { name: this.$t("canceled"), value: "cancel" },
      ];
    },
    status() {
      return [
        {
          label: this.$t("waiting"),
          value: "waiting",
          icon: "mdi-timer-sand-complete",
          color: "#f1c232",
        },
        {
          label: this.$t("confirmed"),
          value: "contacted",
          icon: "mdi-check-circle",
          color: "green",
        },
        {
          label: this.$t("canceled"),
          value: "cancel",
          icon: "mdi-close-circle",
          color: "red",
        },
      ];
    },
    columns() {
      return [
        {
          text: this.$t("no."),
          value: "number",
          align: "start",
          sortable: false,
        },
        {
          text: this.$t("reserve date"),
          value: "createdDate",
          sortable: false,
          align: "start",
        },
        {
          text: this.$t("booking time"),
          align: "start",
          sortable: false,
          value: "timeTh",
        },
        {
          text: this.$t("course name"),
          align: "start",
          sortable: false,
          value: this.$i18n.locale == "th" ? "courseName" : "courseNameEn",
        },
        {
          text: this.$t("first name - last name learner"),
          align: "start",
          sortable: false,
          value:
            this.$i18n.locale == "th" ? "studentFullName" : "studentFullNameEn",
        },
        {
          text: this.$t("first name - last name booker"),
          align: "start",
          sortable: false,
          value:
            this.$i18n.locale == "th"
              ? "createdByFullName"
              : "createdByFullNameEn",
        },
        {
          text: this.$t("contact number"),
          align: "start",
          sortable: false,
          value: "tel",
        },
        {
          text: this.$t("booking status"),
          align: "start",
          sortable: false,
          value: "status",
        },
        { text: "", align: "start", value: "actions", sortable: false },
      ];
    },
  },
  methods: {
    ...mapActions({
      GetReserveList: "reserveCourseModules/GetReserveList",
      UpdateStatusReserve: "reserveCourseModules/UpdateStatusReserve",
      searchNameUser: "loginModules/searchNameUser",
      GetPackages: "CourseModules/GetPackages",
      GetOptions: "CourseModules/GetOptions",
      ExportReserveList: "reserveCourseModules/ExportReserveList",
      GetCoursesList: "CourseModules/GetCoursesList",
      filterDowAndTime: "reserveCourseModules/filterDowAndTime",
      GetUserByRole : "reserveCourseModules/GetUserByRole"
    }),
    exportReserve(){
      this.ExportReserveList({
        students: this.export_filter.student_id,
        courses: this.export_filter.course_id,
        course_types: this.export_filter.course_type_id,
        packages: this.export_filter.package_id,
        options: this.export_filter.option_id,
        reserve_date: this.export_filter.reserve_date,
        dows: this.export_filter.day_of_week_id,
        coachs: this.export_filter.coach_id,
        times: this.export_filter.time_id
      })
    },
    GenDate(date) {
      return new Date(date).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    },
    OpenDialogExport(){
      this.dialogExport = true
    },
    closeDialogExport(){
      this.dialogExport = false
    },
    async clickTab() {
      this.search_bool = true;
      if (this.tabs_temp !== this.tab_selected) {
        this.tabs_change = true;
      }
      if (this.text_temp !== this.search_filter) {
        this.text_change = true;
      }
      await this.loadItems(this.tab_selected);
    },
    async loadItems(status) {
      this.tab_selected =
        !status || status === ""
          ? this.tab_selected === ""
            ? ""
            : this.tab_selected
          : status;

      if (this.tabs_temp !== this.tab_selected) {
        this.tabs_change = true;
      }
      this.tabs_temp = this.tab_selected;

      if (this.text_temp !== this.search_filter) {
        this.text_change = true;
      }
      this.text_temp = this.search_filter;

      this.reserve_is_loadings = true;
      await this.moreData(this.tab_selected);
      this.reserve_is_loadings = false;
    },
    async moreData(status) {
      let { page, itemsPerPage } = this.options;
      this.disable_pagination_btn = true;
      // this.reserve_list.result = [];
      // this.reserve_is_loadings = true;
      await this.GetReserveList({
        search: this.search_filter,
        limit: this.search_filter
          ? this.text_change
            ? 10
            : itemsPerPage
          : this.tabs_change
          ? 10
          : itemsPerPage,

        page: this.search_filter
          ? this.text_change
            ? 1
            : page
          : this.tabs_change
          ? 1
          : page,
        status: status,
      });
      if (this.tabs_change) {
        this.$refs.reserveLists.$props.options.page = 1;
        this.$refs.reserveLists.$props.options.itemsPerPage = 10;
      }
      if (this.text_change) {
        this.$refs.reserveLists.$props.options.page = 1;
        this.$refs.reserveLists.$props.options.itemsPerPage = 10;
      }

      this.disable_pagination_btn = false;
      this.tabs_change = false;
      this.text_change = false;
      this.orders_is_loadings = false;
    },

    update(reserve_id, reserve_data) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to change your status?"),
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: this.$t("no"),
        confirmButtonText: this.$t("agree"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.reserve_is_loadings = true;
          this.UpdateStatusReserve({
            reserve_id: reserve_id,
            reserve_data: reserve_data,
            search: this.search_filter,
            limit: this.$refs.reserveLists.$props.options.itemsPerPage,
            page: this.$refs.reserveLists.$props.options.page ,
            status: this.tab_selected,
          });
          this.reserve_is_loadings = false;
        } else {
          this.reserve_is_loadings = true;
          await this.loadItems(this.tab_selected);
          this.reserve_is_loadings = false;
          // this.GetReserveList();
        }
      });
    },

    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        options
      );
    },

    updateSortBy(value) {
      this.sortBy = value;
    },
    updateSortDesc(value) {
      this.sortDesc = value;
    },
    // formatDate(dateString) {
    //   // Format the date using the toLocaleDateString method
    //   return new Date(dateString).toLocaleDateString();
    // },
  },
};
</script>
  