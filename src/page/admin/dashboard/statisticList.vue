<template>
  <v-container>
    <loading-overlay :loading="statistic_loading"> </loading-overlay>
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
          :placeholder="$t('search category or course name here')"
          v-model="search"
          color="#FF6B81"
          @click:append-outer="seachData(search)"
          @keyup.enter="seachData(search)"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headersStatistic"
      :items-per-page="itemsPerPage"
      :items="get_statustic.data"
      class="elevation-1 header-table my-5"
      :footer-props="{
        'items-per-page-options': [10, 20, 30, 40, 50],
        'items-per-page-text': 'Rows per page:',
      }"
      :server-items-length="computedServerItemsLength"
      @update:options="onPaginationChange"
      :options.sync="options"
      ref="statisticLists"
    >
      <template v-slot:[`item.courseType`]="{ item }">
        {{
          $i18n.locale == "th"
            ? `${item.courseTypeNameTh}`
            : `${item.courseTypeNameEn}`
        }}
      </template>
      <template v-slot:[`item.category`]="{ item }">
        {{
          $i18n.locale == "th"
            ? `${item.categoryNameTh}`
            : `${item.categoryNameEn}`
        }}
      </template>
      <template v-slot:[`item.courseName`]="{ item }">
        {{
          $i18n.locale == "th" ? `${item.courseNameTh}` : `${item.courseNameEn}`
        }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import headerPage from "@/components/header/headerPage.vue";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";

export default {
  components: {
    headerPage,
    loadingOverlay,
  },
  data: () => ({
    search: "",
    itemsPerPage: 10,
    page: 1,
    previousPage: 1,
    isInitialized: false,
    countSearchStatistic: 36,
    isSearchActive: false,
    pagination: 1,
    options: {},
  }),

  computed: {
    ...mapGetters({
      get_statustic: "DashboardModules/getStatistic",
      limit_statistic: "DashboardModules/getLimitStatistic",
      statistic_loading: "DashboardModules/getloadingStatistic",
    }),
    breadcrumbs() {
      return [
        { text: this.$t("dashboard"), to: "Dashboard" },
        { text: this.$t("statistic"), to: "" },
      ];
    },
    headersStatistic() {
      return [
        {
          text: this.$t("no."),
          align: "start",
          value: "index",
          sortable: false,
        },
        { text: this.$t("course type"), value: "courseType", sortable: false },
        { text: this.$t("category"), value: "category", sortable: false },
        { text: this.$t("course name"), value: "courseName", sortable: false },
        {
          text: this.$t("number of students currently studying"),
          align: "center",
          sortable: false,
          value: "studentCountInStudy",
        },
        // {
        //   text: this.$t("number of students who have purchased courses"),
        //   align: "center",
        //   sortable: false,
        //   value: "studentCountInPotential",
        // },
      ];
    },
    computedServerItemsLength() {
      return this.isSearchActive
        ? this.get_statustic.countResponse
        : this.get_statustic.countAllStatistic;
    },
  },
  mounted() {
    this.GetStatistic({
      limit: 10,
      page: 1,
      search: this.search,
      category: "",
      course: "",
      courseTypeId: "",
    });
  },
  methods: {
    ...mapActions({
      GetStatistic: "DashboardModules/GetStatistic",
    }),

    async seachData(search) {
      this.search = search;
      this.isSearchActive = search !== "";
      // API
      await this.GetStatistic({
        limit: 10,
        page: 1,
        search: search,
        category: "",
        course: "",
        courseTypeId: "",
      });
      this.$refs.statisticLists.$props.options.page = 1;
      this.$refs.statisticLists.$props.options.itemsPerPage = 10;
    },
    onPaginationChange(newPagination) {
      if (!this.isInitialized) {
        this.isInitialized = true;
        this.previousItemsPerPage = newPagination.itemsPerPage;
        return;
      }

      if (newPagination.itemsPerPage !== this.previousItemsPerPage) {
        this.limit_statistic.limit = newPagination.itemsPerPage;
        this.limit_statistic.page = 1;
        this.page = 1;

        this.GetStatistic({
          limit: this.limit_statistic.limit,
          page: this.limit_statistic.page,
          search: this.search ? this.search : "",
          category: "",
          course: "",
          courseTypeId: "",
        });

        if (this.search !== "") {
          this.get_statustic.countAllStatistic =
            this.get_statustic.countResponse;
        }

        this.previousItemsPerPage = newPagination.itemsPerPage;
        return;
      }

      if (newPagination.page !== this.page) {
        this.limit_statistic.page = newPagination.page;

        this.GetStatistic({
          limit: this.limit_statistic.limit,
          page: this.limit_statistic.page,
          search: this.search ? this.search : "",
          category: "",
          course: "",
          courseTypeId: "",
        });

        if (this.search !== "") {
          this.get_statustic.countAllStatistic =
            this.get_statustic.countResponse;
        }

        this.page = newPagination.page;
      }
    },
  },
};
</script>

<style>
</style>