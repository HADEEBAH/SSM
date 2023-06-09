<template >
  <v-container class="overflow-y: hidden; overflow-x: hidden;">
    <headerPage title="แดชบอร์ด"></headerPage>
    <!-- TOP CARD -->
    <v-row dense>
      <!-- STUDENT -->
      <v-col cols="12" sm="7">
        <v-card class="pa-2">
          <v-row>
            <!-- ผู้เรียนทั้งหมด -->
            <v-col cols="6" sm="3">
              <v-card>
                <v-row dense>
                  <v-col cols="12" sm="12">
                    <v-card-text class="font-bold">
                      <v-icon color="#ff6b81">mdi-account-group</v-icon>
                      ผู้เรียนทั้งหมด
                    </v-card-text>
                  </v-col>
                </v-row>
                <v-card-text
                  align="center"
                  style="color: #ff6b81; font-size: 30px; font-weight: 700"
                >
                  350
                </v-card-text>
                <v-card-text align="center"> คน </v-card-text>
              </v-card>
            </v-col>
            <!-- ผู้เรียนปัจจุบัน -->
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
            <!-- ผู้เรียนที่ใกล้จบ -->
            <v-col cols="6" sm="3">
              <v-card>
                <v-card-text align="center" class="font-bold">
                  ผู้เรียนที่ใกล้จบ
                </v-card-text>
                <v-card-text
                  dense
                  align="center"
                  style="color: #1876d1; font-size: 30px"
                >
                  20
                </v-card-text>
                <v-card-text dense align="center"> คน </v-card-text>
              </v-card>
            </v-col>
            <!-- ผู้เรียนจองคอร์ส -->
            <v-col cols="6" sm="3">
              <v-card>
                <v-card-text align="center" class="font-bold">
                  ผู้เรียนจองคอร์ส
                </v-card-text>
                <v-card-text
                  dense
                  align="center"
                  style="color: #1876d1; font-size: 30px"
                >
                  50
                </v-card-text>
                <v-card-text dense align="center"> คน </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- COURSE -->
      <v-col cols="12" sm="3">
        <v-card>
          <v-row class="pa-2">
            <v-col cols="6" sm="6">
              <v-card-text class="font-bold">
                <v-icon color="#ff6b81">mdi-book-open-variant</v-icon>
                คอร์สเรียน
              </v-card-text>
              <v-card-text
                align="center"
                style="color: #ff6b81; font-size: 30px; font-weight: 900"
              >
                10
              </v-card-text>
              <v-card-text align="center"> คอร์ส </v-card-text>
            </v-col>
            <v-col cols="6" sm="6">
              <v-card-text align="end" class="font-bold">
                คอร์สทั่วไป
                <p style="color: #1876d1; font-size: 15px">8</p>
                <p class="my-2 font-bold">คอร์สระยะสั้น</p>
                <p style="color: #1876d1; font-size: 15px">2</p>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- COACH -->
      <v-col cols="6" sm="2">
        <v-card>
          <v-row class="pa-2">
            <v-col cols="12" sm="12">
              <v-card-text class="font-bold" align="center">
                <v-icon color="#ff6b81">mdi-account</v-icon>
                โค้ช
              </v-card-text>
              <v-card-text
                align="center"
                style="color: #ff6b81; font-size: 30px; font-weight: 900"
              >
                14
              </v-card-text>
              <v-card-text align="center"> คน </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- BOTTOM CARD -->
    <v-card style="background-color: #ffdde2" class="my-5">
      <v-row dense class="my-5 mx-5 pa-2">
        <!-- รายได้ GRAF -->
        <v-col cols="12" sm="6">
          <v-card style="background-color: #ffffff">
            <v-card-title class="font-bold">
              <v-row dense>
                <v-col cols="6" sm="6">
                  <v-icon color="#ff6b81">mdi-currency-usd</v-icon>
                  รายได้
                </v-col>
                <v-col cols="6" sm="6">
                  <v-select
                    :items="thaiMonths"
                    :value="thaiMonths[new Date().getMonth()]"
                    dense
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-title>
              <v-row dense>
                <v-badge color="green" content="6"> 150,000 </v-badge>
              </v-row>
            </v-card-title>
            <v-card-title>
              <template>
                <apexchart
                  type="line"
                  height="360"
                  :options="chartOptions"
                  :series="series"
                >
                </apexchart>
              </template>
            </v-card-title>
          </v-card>
        </v-col>
        <!-- สัดส่วนรายได้ DONUT -->
        <v-col cols="12" sm="6">
          <v-card style="background-color: #ffffff">
            <v-row>
              <v-col col></v-col>
              <v-col></v-col>
            </v-row>
            <v-card-title></v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import headerPage from "@/components/header/headerPage.vue";

import chart from "vue-apexcharts";

export default {
  components: {
    apexchart: chart,
    headerPage,
  },
  data: () => ({
    thaiMonths: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ],

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
  
  <style scoped>
</style>