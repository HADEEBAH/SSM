<template>
  <v-container>
    <headerPage :title="$t('approval of leave')" slot_tag>
      <v-text-field
        v-model="search"
        :placeholder="$t('search')"
        prepend-inner-icon="mdi-magnify"
        outlined
        dense
      >
      </v-text-field>
    </headerPage>
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

    <v-row class="mb-2">
      <template v-for="(type, type_index) in course_type">
        <v-col
          cols="12"
          sm="6"
          :key="`${type_index}-type`"
          @click="typeSelected(type.value)"
        >
          <img-card
            class="cursor-pointer"
            :class="type_selected === type.value ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                v-if="type.value == 'all'"
                max-height="90"
                max-width="70"
                src="@/assets/coachLeave/all.png"
              ></v-img>
              <v-img
                v-if="type.value == 'approved'"
                max-height="90"
                max-width="70"
                src="@/assets/coachLeave/accept.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">{{ type.name }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">{{
                  type.value === "all"
                    ? coach_leaves.length
                    : coach_leaves.filter((v) => v.status === type.value).length
                }}</v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
      </template>
    </v-row>

    <v-row class="mb-2">
      <template v-for="(type, type_index) in course_type_two">
        <v-col
          cols="12"
          sm="4"
          :key="`${type_index}-type`"
          @click="typeSelected(type.value)"
        >
          <img-card
            class="cursor-pointer"
            :class="type_selected === type.value ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                v-if="type.value == 'pending'"
                max-height="90"
                max-width="70"
                src="@/assets/coachLeave/wait.png"
              ></v-img>
              <v-img
                v-if="type.value == 'reject'"
                max-height="90"
                max-width="70"
                src="@/assets/coachLeave/disaccept.png"
              ></v-img>
              <v-img
                v-if="type.value == 'cancel'"
                max-height="90"
                max-width="70"
                src="@/assets/coachLeave/cancel.svg"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">{{ type.name }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col align="center" class="text-3xl font-bold">{{
                  type.value === "all"
                    ? coach_leaves.length
                    : coach_leaves.filter((v) => v.status === type.value).length
                }}</v-col>
                <v-col class="text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
      </template>
    </v-row>
    <!-- TABLE -->
    <v-card class="my-5">
      <v-data-table
        :search="search"
        class="elevation-1 header-table"
        :items="coach_leave_arr.length > 0 ? coach_leave_arr : coach_leaves"
        :loading="coach_leaves_is_loading"
        :headers="column"
        hide-no-data
      >
        <template v-slot:[`item.count`]="{ item }"> {{ item.index }} </template>

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
            new Date(item.startDate).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }}
        </template>
        <template v-slot:[`item.createdDateStr`]="{ item }">
          {{
            new Date(item.createdDate).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }}
        </template>
        <template v-slot:[`item.show`]="{ item }">
          <v-btn
            @click="showDetail(item.coachLeaveId)"
            class="mr-3"
            icon
            color="#ff6b81"
            ><v-icon>mdi-eye-outline</v-icon>
          </v-btn>
        </template>
        <template v-slot:[`no-results`]>
          <div class="font-bold">{{ $t("no data found in table") }}</div>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      persistent
      :width="$vuetify.breakpoint.smAndUp ? '70vw' : ''"
      v-model="show_dialog_coach_leave_form"
      v-if="show_dialog_coach_leave_form"
    >
      <v-card class="pa-1">
        <v-row dense>
          <v-col class="pa-0" align="right">
            <v-btn @click="closeDialogLeaveForm" icon color="#ff6b81"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <coachLeaveForm admin></coachLeaveForm>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import imgCard from "@/components/course/imgCard.vue";
import { mapActions, mapGetters } from "vuex";
import coachLeaveForm from "@/components/coach_leave/coachLeaveForm.vue";
export default {
  components: {
    headerPage,
    imgCard,
    coachLeaveForm,
  },
  data: () => ({
    type_selected: "all",
    search: "",
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
    // column: [
    //   { text: "ลำดับ", align: "start", sortable: false, value: "count" },
    //   { text: "รหัสโค้ช", align: "start", sortable: false, value: "accountId" },
    //   {
    //     text: "ชื่อ - นามสกุล",
    //     align: "start",
    //     sortable: false,
    //     value: "fullnameTh",
    //   },
    //   {
    //     text: "ประเภทการลา",
    //     align: "start",
    //     sortable: false,
    //     value: "leaveTypeStr",
    //   },
    //   {
    //     text: "วันเริ่มลา",
    //     align: "start",
    //     sortable: false,
    //     value: "startDateStr",
    //   },
    //   {
    //     text: "วันที่ส่งคำขอ",
    //     align: "center",
    //     sortable: false,
    //     value: "createdDateStr",
    //   },
    //   { text: "สถานะ", align: "center", value: "actions", sortable: false },
    //   { text: "", align: "center", value: "show", sortable: false },
    // ],
    // course_type: [
    //   {
    //     name: "ทั้งหมด",
    //     value: "all",
    //     img: "@/assets/coachLeave/all.png",
    //   },
    //   {
    //     name: "อนุมัติ",
    //     value: "approved",
    //     img: "@/assets/coachLeave/accept.png",
    //   },
    // ],
    // course_type_two: [
    //   {
    //     name: "รออนุมัติ",
    //     value: "pending",
    //     img: "@/assets/coachLeave/wait.png",
    //   },
    //   {
    //     name: "ปฎิเสธ",
    //     value: "reject",
    //     img: "@/assets/coachLeave/disaccept.png",
    //   },
    //   {
    //     name: "ยกเลิก",
    //     value: "cancel",
    //     img: "@/assets/coachLeave/all.png",
    //   },
    // ],
    coach_leave_arr: [],
  }),
  created() {
    this.GetLeavesAll();
    this.GetCoachs();
  },
  computed: {
    ...mapGetters({
      coach_leaves: "CoachModules/getCoachLeaves",
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
  mounted() {},
  methods: {
    ...mapActions({
      GetCoachs: "CourseModules/GetCoachs",
      GetLeavesAll: "CoachModules/GetLeavesAll",
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
    typeSelected(type) {
      this.type_selected = type;
      this.coach_leave_arr = [];
      if (type !== "all") {
        this.coach_leave_arr = this.coach_leaves.filter(
          (items) => type === items.status
        );

        this.coach_leave_arr.map((items, i) => {
          items.index = i + 1;
        });
      } else {
        this.GetLeavesAll();
      }
    },
  },
};
</script>