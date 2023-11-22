<template>
  <v-container>
    <loading-overlay :loading="reserve_is_loadings"></loading-overlay>
    <header-page slot_tag :title="$t(`manage course booking`)">
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
    </header-page>

    <v-row class="mb-2" dense>
      <template v-for="(type, type_index) in course_type">
        <v-col
          cols="12"
          sm="3"
          :key="`${type_index}-type`"
          @click="(type_selected = type.value), clickTab(type_selected)"
        >
          <img-card
            class="cursor-pointer"
            :class="type_selected === type.value ? 'img-card-active' : ''"
          >
            <template v-slot:img>
              <v-img
                v-if="type.value == ''"
                max-height="90"
                max-width="70"
                src="@/assets/coachLeave/all.png"
              ></v-img>
              <v-img
                v-if="type.value == 'contacted'"
                max-height="90"
                max-width="70"
                src="@/assets/coachLeave/accept.png"
              ></v-img>
              <v-img
                v-if="type.value == 'waiting'"
                max-height="90"
                max-width="70"
                src="@/assets/coachLeave/wait.png"
              ></v-img>
              <v-img
                v-if="type.value == 'cancel'"
                max-height="90"
                max-width="70"
                src="@/assets/coachLeave/disaccept.png"
              ></v-img>
            </template>
            <template v-slot:header>
              <div class="font-bold">{{ type.name }}</div>
            </template>
            <template v-slot:detail>
              <v-row class="d-flex align-end">
                <v-col cols="12" align="center" class="text-3xl font-bold">{{
                  type.value == ""
                    ? reserve_list.length
                    : reserve_list.filter((v) => v.status == type.value).length
                }}</v-col>
                <v-col class="text-center text-sm">{{ $t("list") }}</v-col>
              </v-row>
            </template>
          </img-card>
        </v-col>
      </template>
    </v-row>
    <loading-overlay
      v-if="reserve_list_is_loading"
      :loading="reserve_list_is_loading"
    ></loading-overlay>
    <v-card v-else outlined>
      <v-data-table
        class="header-table"
        :headers="columns"
        :items="
          type_selected === ''
            ? reserve_list.result
            : reserve_list.result?.filter((v) => v.status === type_selected)
        "
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        @update:sort-by="updateSortBy"
        @update:sort-desc="updateSortDesc"
        :items-per-page="itemsPerPage"
        :server-items-length="
          search_bool ? reserve_list.totalRows : reserve_list.count
        "
        :options.sync="options"
        ref="reserveList"
        :footer-props="{
          'disable-pagination': disable_pagination_btn,
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
    type_selected: "",
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
    reserve_is_loadings: true,
    disable_pagination_btn: false,
    options: {},
  }),
  created() {
    // this.GetReserveList();
  },
  mounted() {},

  computed: {
    ...mapGetters({
      reserve_list: "reserveCourseModules/reserveList",
      reserve_list_is_loading: "reserveCourseModules/reserveListIsLoading",
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
          text: this.$t("reserve date"),
          value: "createdDate",
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
    }),
    // clickTab(item) {
    //   console.log("item :>> ", item);
    //   console.log("this.type_selected :>> ", this.type_selected);
    // },
    async clickTab() {
      this.search_bool = true;
      console.log("this.type_selected :>> ", this.type_selected);
      if (this.tabs_temp !== this.type_selected) {
        this.tabs_change = true;
      }
      if (this.text_temp !== this.search_filter) {
        this.text_change = true;
      }
      await this.loadItems(this.type_selected);
    },
    async loadItems(status) {
      this.type_selected =
        !status || status === ""
          ? this.type_selected === ""
            ? ""
            : this.type_selected
          : status;

      if (this.tabs_temp !== this.type_selected) {
        this.tabs_change = true;
      }
      this.tabs_temp = this.type_selected;

      if (this.text_temp !== this.search_filter) {
        this.text_change = true;
      }
      this.text_temp = this.search_filter;

      this.reserve_is_loadings = true;
      await this.moreData(this.type_selected);
      this.reserve_is_loadings = false;
    },

    async moreData(status) {
      let { page, itemsPerPage } = this.options;
      this.disable_pagination_btn = true;
      this.reserve_list.result = [];
      this.reserve_is_loadings = true;
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
        // status: this.type_selected,
      });
      if (this.tabs_change) {
        this.$refs.reserveList.$props.options.page = 1;
      }
      if (this.text_change) {
        this.$refs.reserveList.$props.options.page = 1;
      }

      this.disable_pagination_btn = false;
      this.tabs_change = false;
      this.text_change = false;
      // this.orders_is_loadings = false;
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
          this.UpdateStatusReserve({
            reserve_id: reserve_id,
            reserve_data: reserve_data,
          });
        } else {
          this.GetReserveList();
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
  