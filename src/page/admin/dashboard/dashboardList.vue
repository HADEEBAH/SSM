<template >
  <v-container class="overflow-y: hidden; overflow-x: hidden;">
    <headerPage title="แดชบอร์ด"></headerPage>
    <v-row>
      <v-col cols="12" sm="7">
        <v-row>
          <v-col cols="6" sm="3">
            <v-card>
              <v-card-text align="center" class="font-bold">
                <v-icon class="mr-2" color="#ff6b81">mdi-account-group</v-icon>
                ผู้เรียนทั้งหมด
              </v-card-text>
              <v-card-text
                dense
                align="center"
                style="color: #ff6b81; font-size: 30px"
              >
                350
              </v-card-text>
              <v-card-text dense align="center"> คน </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card>
              <v-card-text align="center" class="font-bold">
                ผู้เรียนปัจจุบัน
              </v-card-text>
              <v-card-text
                dense
                align="center"
                style="color: #1876d1; font-size: 30px"
              >
                280
              </v-card-text>
              <v-card-text dense align="center"> คน </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3"></v-col>
          <v-col cols="6" sm="3"></v-col>
        </v-row>
      </v-col>
      <v-col cols="6" sm="3"> </v-col>
      <v-col cols="6" sm="2"> </v-col>
    </v-row>
    <!-- <template>
      <div>
        <apexchart
          type="line"
          height="350"
          :options="chartOptions"
          :series="series"
        >
        </apexchart>
      </div>
    </template> -->
  </v-container>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import headerPage from "@/components/header/headerPage.vue";

// import chart from "vue-apexcharts";

export default {
  components: {
    //   apexchart: chart,
    headerPage,
  },
  data: () => ({
    series: [
      {
        // name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    chartOptions: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      //   dataLabels: {
      //     enabled: false,
      //   },
      stroke: {
        curve: "straight",
      },
      title: {
        icon: "mdi-delete",
        text: "รายได้",
        align: "left",
      },
      grid: {
        // row: {
        //   colors: ["#000000", "transparent"], // takes an array which will be repeated on columns
        //   opacity: 0.5,
        // },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    },
  }),

  mounted() {},
  methods: {
    ...mapActions({}),
  },
  computed: {
    ...mapGetters({}),
  },
};
</script>
  
  <style>
</style>