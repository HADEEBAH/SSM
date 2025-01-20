<template>
  <v-container>
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
    <v-data-table
      :headers="headersStatistic"
      :items="statisticData"
      class="elevation-1 header-table my-5"
    ></v-data-table>
  </v-container>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";

export default {
  components: {
    headerPage,
  },
  data: () => ({
    search: null,
    statisticData: [
      {
        index: "1",
        courseType: "ระยะสั้น",
        category: "ทดสอบ อาณาจักร 1",
        courseName: "ทดสอบ 1",
        currentlyStudent: 10,
        numberPurchasedCourses: 10,
      },
      {
        index: "2",
        courseType: "ทั่วไป",
        category: "ทดสอบ อาณาจักร 1",
        courseName: "ทดสอบ 2",
        currentlyStudent: 20,
        numberPurchasedCourses: 30,
      },
      {
        index: "3",
        courseType: "ระยะสั้น",
        category: "ทดสอบ อาณาจักร 2",
        courseName: "ทดสอบ 3",
        currentlyStudent: 30,
        numberPurchasedCourses: 20,
      },
    ],
  }),

  computed: {
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
          value: "currentlyStudent",
        },
        {
          text: this.$t("number of students who have purchased courses"),
          align: "center",
          sortable: false,
          value: "numberPurchasedCourses",
        },
      ];
    },
  },
};
</script>

<style>
</style>