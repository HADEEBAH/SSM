<template>
  <v-container>
    <loading-overlay :loading="coach_leaves_is_loadings"> </loading-overlay>
    <v-row>
      <v-col cols="6">
        <headerPage :title="$t('approval of leave')" slot_tag />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="search_filter"
          :placeholder="$t('search')"
          outlined
          dense
          color="#ff6b81"
          append-outer-icon="mdi-magnify"
          @click:append-outer="clickTab()"
          @keyup.enter="clickTab()"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <!-- search -->

    <v-row>
      <v-col cols="12" align="right">
        <v-btn
          @click="showLeaveForm"
          :class="$vuetify.breakpoint.smAndUp ? '' : 'w-full'"
          outlined
          color="#ff6b81"
          ><v-icon>mdi-plus-circle-outline</v-icon
          >{{ $t("leave request form") }}</v-btn
        >
      </v-col>
    </v-row>
    <v-row dense class="my-5">
      <!-- TAB 1  all-->
      <v-col cols="12" sm="6" @click="(tabs = ''), clickTab()">
        <img-card
          :class="
            tabs === ''
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
                {{ coach_leaves_all.amount ? coach_leaves_all.amount : 0 }}
              </v-col>
              <v-col class="text-sm">{{ $t("list") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
      <!-- TAB 2 approved-->
      <v-col cols="12" sm="6" @click="(tabs = 'approved'), clickTab()">
        <img-card
          class="cursor-pointer drop-shadow-lg"
          :class="tabs === 'approved' ? 'img-card-active' : ''"
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
            <div class="font-bold">{{ $t("approved") }}</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{
                  coach_leaves_all.amountApproved
                    ? coach_leaves_all.amountApproved
                    : 0
                }}
              </v-col>
              <v-col class="text-sm">{{ $t("list") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
    </v-row>
    <v-row dense class="my-5">
      <!-- TAB 3 waiting for approval-->
      <v-col cols="12" sm="4" @click="(tabs = 'pending'), clickTab()">
        <img-card
          class="cursor-pointer drop-shadow-lg"
          :class="tabs === 'pending' ? 'img-card-active' : ''"
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
            <div class="font-bold">{{ $t("waiting for approval") }}</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{
                  coach_leaves_all.amountPending
                    ? coach_leaves_all.amountPending
                    : 0
                }}
              </v-col>
              <v-col class="text-sm">{{ $t("list") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
      <!-- TAB 4 reject-->
      <v-col cols="12" sm="4" @click="(tabs = 'reject'), clickTab()">
        <img-card
          class="cursor-pointer drop-shadow-lg"
          :class="tabs === 'reject' ? 'img-card-active' : ''"
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
            <div class="font-bold">{{ $t("reject") }}</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{
                  coach_leaves_all.amountReject
                    ? coach_leaves_all.amountReject
                    : 0
                }}
              </v-col>
              <v-col class="text-sm">{{ $t("list") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
      <!-- TAB 5 cancel-->
      <v-col cols="12" sm="4" @click="(tabs = 'cancel'), clickTab()">
        <img-card
          class="cursor-pointer drop-shadow-lg"
          :class="tabs === 'cancel' ? 'img-card-active' : ''"
          style="border-radius: 16px"
        >
          <template v-slot:img>
            <v-img
              max-height="90"
              max-width="70"
              src="@/assets/coachLeave/cancel.svg"
            ></v-img>
          </template>

          <template v-slot:header>
            <div class="font-bold">{{ $t("cancel") }}</div>
          </template>
          <template v-slot:detail>
            <v-row class="d-flex align-end">
              <v-col align="center" class="text-3xl font-bold">
                {{
                  coach_leaves_all.amountCancel
                    ? coach_leaves_all.amountCancel
                    : 0
                }}
              </v-col>
              <v-col class="text-sm">{{ $t("list") }}</v-col>
            </v-row>
          </template>
        </img-card>
      </v-col>
    </v-row>

    <!-- new table -->
    <template>
      <div>
        <v-data-table
          class="elevation-1 header-table"
          :items="coach_leaves_all.leaveList"
          :server-items-length="
            search_bool ? coach_leaves_all.totalRows : coach_leaves_all.count
          "
          :options.sync="options"
          :headers="column"
          :items-per-page.sync="itemsPerPage"
          ref="coach_leave"
          :footer-props="{
            'disable-pagination': disable_pagination_btn,
            'items-per-page-options': [10, 20, 30, 40, 50],
            'items-per-page-text': 'Rows per page:',
          }"
        >
          <template v-slot:[`item.count`]="{ item }">
            {{ item.number }}
          </template>

          <template v-slot:no-data>
            <div class="font-bold">
              {{ $t("no data found in table") }}
            </div>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <div
              class="d-flex align-center pa-1 rounded-lg"
              :class="
                item.status === 'pending'
                  ? 'bg-[#FFF9E8] text-[#FCC419]'
                  : item.status === 'approved'
                  ? 'bg-[#F0F9EE] text-[#58A144]'
                  : item.status === 'cancel'
                  ? 'bg-[#e8e8e8] text-[#636363]'
                  : 'bg-[#ffeeee] text-[#f00808]'
              "
            >
              <span class="w-full text-center">{{
                item.status == "pending"
                  ? $t("waiting for approval")
                  : item.status === "approved"
                  ? $t("approved")
                  : item.status === "cancel"
                  ? $t("cancel")
                  : $t("refuse")
              }}</span>
            </div>
          </template>
          <template v-slot:[`item.startDateStr`]="{ item }">
            {{
              new Date(item.startDate).toLocaleDateString(
                $i18n.locale == "th" ? "th-TH" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )
            }}
          </template>
          <template v-slot:[`item.createdDateStr`]="{ item }">
            {{
              new Date(item.createdDate).toLocaleDateString(
                $i18n.locale == "th" ? "th-TH" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )
            }}
          </template>
          <template v-slot:[`item.show`]="{ item }">
            <v-btn
              :to="{
                name: 'LeaveDetail_coachleaveId',
                params: { coachleave_id: item.coachLeaveId },
              }"
              class="mr-3"
              icon
              color="#ff6b81"
              ><v-icon>mdi-eye-outline</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </div>
    </template>

    <v-dialog
      persistent
      :width="$vuetify.breakpoint.smAndUp ? '70vw' : ''"
      v-model="show_dialog_coach_leave_form"
      v-if="show_dialog_coach_leave_form"
    >
      <v-card class="pa-1">
        <v-row dense>
          <v-col class="pa-0" align="right">
            <v-btn
              @click="closeDialogLeaveForm"
              icon
              color="#ff6b81"
              class="mb-2"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <coachLeaveForm admin class="mt-3"></coachLeaveForm>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import imgCard from "@/components/course/imgCard.vue";
import { mapActions, mapGetters } from "vuex";
import coachLeaveForm from "@/components/coach_leave/coachLeaveForm.vue";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";

export default {
  components: {
    headerPage,
    imgCard,
    coachLeaveForm,
    loadingOverlay,
  },

  data() {
    return {
      disable_pagination_btn: false,
      total_array_data: 0,
      array_data: [],
      loading: true,
      options: {},
      startIndex: 0,
      endIndex: 0,
      page: 1,
      itemsPerPage: 10,
      pageStart: 1,
      pageCount: 0,
      // tab: "all",
      tabs: "",
      type_selected: "all",
      search_filter: "",
      coach_leave_data: {
        menu_start_date: false,
        start_date: null,
        start_date_str: "",
        menu_end_date: false,
        end_date: null,
        end_date_str: "",
        period: "",
        coach_id: "",
        remark: "",
        status: "",
        leave_type: "",
        courses: [
          {
            my_course_id: "",
            course_id: "",
            substitute_coach_id: "",
            day_of_week_id: "",
            time_id: "",
          },
        ],
      },
      coach_leave_arr: [],
      coach_leaves_is_loadings: true,
      tabs_temp: "",
      tabs_change: false,
      text_temp: "",
      text_change: false,
      search_bool: false,
    };
  },
  watch: {
    options: {
      handler() {
        this.loadItems();
      },
    },
  },

  created() {
    this.GetCoachs();
  },
  computed: {
    ...mapGetters({
      coach_leaves_all: "CoachModules/getNewCoachLeaves",
      coach_leaves_is_loading: "CoachModules/getCoachLeavesIsLoading",
      show_dialog_coach_leave_form: "CoachModules/getShowDialogCoachLeaveForm",
    }),

    column() {
      return [
        {
          text: this.$t("no."),
          align: "start",
          sortable: false,
          value: "count",
        },
        {
          text: this.$t("coach code"),
          align: "start",
          sortable: false,
          value: "accountId",
        },
        {
          text: this.$t("first name - last name"),
          align: "start",
          sortable: false,
          value: this.$i18n.locale == "th" ? "fullnameTh" : "fullnameEn",
        },
        {
          text: this.$t("leave type"),
          align: "start",
          sortable: false,
          value: this.$i18n.locale == "en" ? "leaveType" : "leaveTypeStr",
        },
        {
          text: this.$t("leave start date"),
          align: "start",
          sortable: false,
          value: "startDateStr",
        },
        {
          text: this.$t("date of request"),
          align: "center",
          sortable: false,
          value: "createdDateStr",
        },
        {
          text: this.$t("status"),
          align: "center",
          value: "actions",
          sortable: false,
        },
        { text: "", align: "center", value: "show", sortable: false },
      ];
    },

    course_type() {
      return [
        {
          name: this.$t("all"),
          value: "all",
          img: "@/assets/coachLeave/all.png",
        },
        {
          name: this.$t("approved"),
          value: "approved",
          img: "@/assets/coachLeave/accept.png",
        },
      ];
    },

    course_type_two() {
      return [
        {
          name: this.$t("waiting for approval"),
          value: "pending",
          img: "@/assets/coachLeave/wait.png",
        },
        {
          name: this.$t("refuse"),
          value: "reject",
          img: "@/assets/coachLeave/disaccept.png",
        },
        {
          name: this.$t("cancel"),
          value: "cancel",
          img: "@/assets/coachLeave/all.png",
        },
      ];
    },
  },

  methods: {
    onIntersect(entries) {
      let index = entries[0].target.textContent;
      if (index == this.dtRowTo) {
        this.dtRowTo += this.dtRowIncr;
      }
    },
    ...mapActions({
      GetCoachs: "CourseModules/GetCoachs",
      GetNewLeavesAll: "CoachModules/GetNewLeavesAll",
      ShowDialogCoachLeaveForm: "CoachModules/ShowDialogCoachLeaveForm",
    }),
    showLeaveForm() {
      this.ShowDialogCoachLeaveForm(true);
    },
    showDetail(coach_leave_id) {
      this.$router.push({
        name: "LeaveDetail_coachleaveId",
        params: { coachleave_id: coach_leave_id },
      });
    },

    closeDialogLeaveForm() {
      this.selected_files = [];
      this.ShowDialogCoachLeaveForm(false);
      this.coach_leave_data = {
        menu_start_date: false,
        start_date: null,
        start_date_str: "",
        menu_end_date: false,
        end_date: null,
        end_date_str: "",
        period: "",
        coach_id: "",
        day_of_week_id: "",
        time_id: "",
        remark: "",
        status: "",
        leave_type: "",
        courses: [
          {
            my_course_id: "",
            course_id: "",
            substitute_coach_id: "",
            day_of_week_id: "",
            time_id: "",
          },
        ],
      };
    },

    async clickTab() {
      this.search_bool = true;
      if (this.tabs_temp !== this.tabs) {
        this.tabs_change = true;
      }
      if (this.text_temp !== this.search_filter) {
        this.text_change = true;
      }

      await this.loadItems(this.tabs);
    },

    async loadItems(status) {
      this.tabs =
        !status || status === "" ? (this.tabs === "" ? "" : this.tabs) : status;

      if (this.tabs_temp !== this.tab_selected) {
        this.tabs_change = true;
      }
      this.tabs_temp = this.tab_selected;

      if (this.text_temp !== this.search_filter) {
        this.text_change = true;
      }
      this.text_temp = this.search_filter;

      this.coach_leaves_is_loadings = true;
      await this.moreData(this.tabs);
      this.coach_leaves_is_loadings = false;
    },

    async moreData(status) {
      let { page, itemsPerPage } = this.options;
      this.disable_pagination_btn = true;
      // this.coach_leaves_all.leaveList = [];
      // this.coach_leaves_is_loadings = true;
      await this.GetNewLeavesAll({
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
        // limit: itemsPerPage,
        // page: this.tabs_change ? 1 : page,
        status: status,
      });
      if (this.tabs_change) {
        this.$refs.coach_leave.$props.options.page = 1;
        this.$refs.coach_leave.$props.options.itemsPerPage = 10;
      }
      if (this.text_change) {
        this.$refs.coach_leave.$props.options.page = 1;
        this.$refs.coach_leave.$props.options.itemsPerPage = 10;
      }

      this.disable_pagination_btn = false;
      this.tabs_change = false;
      this.text_change = false;
      // this.coach_leaves_is_loadings = false;
    },
  },
};
</script>