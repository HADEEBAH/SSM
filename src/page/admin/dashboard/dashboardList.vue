<template >
  <v-app class="background-color">
    <v-container class="overflow-y: hidden; overflow-x: hidden;">
      <headerPage title="แดชบอร์ด"></headerPage>
      <!-- TOP CARD -->
      <v-row dense>
        <!-- STUDENT -->
        <v-col cols="12" sm="7">
          <v-card class="pa-4 rounded-lg drop-shadow-lg">
            <v-row>
              <!-- ผู้เรียนทั้งหมด -->
              <v-col cols="6" sm="3">
                <v-card
                  @click="$router.push({ name: 'StudentList' })"
                  class="cursor-pointer rounded-lg"
                >
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
                <v-card class="rounded-lg">
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
                <v-card class="rounded-lg">
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
                <v-card class="rounded-lg">
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
          <v-card class="rounded-lg drop-shadow-lg">
            <v-row class="pa-2">
              <v-col cols="6" sm="6">
                <v-card-text class="font-bold my-2">
                  <v-icon color="#ff6b81">mdi-book-open-variant</v-icon>
                  คอร์สเรียน
                </v-card-text>
                <v-card-text
                  dense
                  align="center"
                  style="color: #ff6b81; font-size: 30px; font-weight: 700"
                >
                  10
                </v-card-text>
                <v-card-text align="center"> คอร์ส </v-card-text>
              </v-col>
              <v-col cols="6" sm="6">
                <v-card-text align="end" class="font-bold my-2">
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
          <v-card class="rounded-lg drop-shadow-lg">
            <v-row class="pa-4">
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
      <v-card style="background-color: #ffdde2" class="my-5 rounded-lg">
        <v-row dense class="my-5 mx-5 pa-2">
          <!-- รายได้ GRAF -->
          <v-col cols="12" sm="6">
            <v-card
              style="background-color: #ffffff; max-height: 500px; height: 100%"
              class="rounded-lg"
            >
              <v-card-title>
                <v-row dense>
                  <v-col
                    cols="6"
                    sm="6"
                    style="color: #ff6b81; font-weight: bold"
                  >
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
              <v-card-text>
                <template>
                  <v-row class="my-2">
                    <v-col cols="12">
                      <apexchart
                        type="line"
                        :options="chartOptions"
                        :series="series"
                      >
                      </apexchart>
                    </v-col>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- สัดส่วนรายได้ DONUT -->
          <v-col cols="12" sm="6">
            <v-card
              class="bg-white rounded-lg"
              style="max-height: 500px; height: 100%"
            >
              <v-card-title>
                <v-row>
                  <v-col
                    cols="6"
                    sm="6"
                    style="color: #ff6b81; font-weight: bold"
                  >
                    <v-icon color="#ff6b81">mdi-elevation-rise</v-icon>
                    สัดส่วนรายได้
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

              <v-card-title class="mb-24">
                <v-row>
                  <v-col cols="7" sm="7">
                    <v-progress-circular
                      style="stroke-linecap: round"
                      :rotate="-90"
                      :size="260"
                      :width="30"
                      :value="this.donutSeries"
                      color="#ff6b81"
                      class="my-6"
                    >
                      ทั้งหมด
                      <br />158,500
                    </v-progress-circular>
                  </v-col>
                  <v-col cols="5" sm="5">
                    <div class="my-10">
                      <v-icon color="#ff6b81">mdi-circle-medium</v-icon>
                      ชำระแล้ว
                      <div
                        style="
                          font-weight: bold;
                          color: #58a144;
                          margin-left: 30px;
                        "
                      >
                        131,610
                        <span
                          style="
                            font-weight: normal;
                            color: #999999;
                            font-size: small;
                          "
                          >บาท (82%)</span
                        >
                      </div>
                    </div>
                    <div>
                      <v-icon color="#E8E7E7">mdi-circle-medium</v-icon>
                      รอดำเนินการ

                      <div
                        style="
                          font-weight: bold;
                          color: #fcc419;
                          margin-left: 30px;
                        "
                      >
                        25,500
                        <span
                          style="
                            font-weight: normal;
                            color: #999999;
                            font-size: small;
                          "
                          >บาท (18%)</span
                        >
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-card-title>
            <v-img
              src="../../../assets/navbar/barCourse.svg"
              style="max-width: 25px; margin-left: 30px"
            ></v-img>
            <span class="indent-5">สถานะคอร์สเรียน</span>
          </v-card-title>
        </v-row>
        <v-card class="bg-white mx-5 pa-5 my-5">
          <v-row>
            <!-- PIE -->
            <v-col cols="12" sm="4" class="d-flex align-center">
              <apexchart
                class="w-full"
                type="pie"
                :options="pieChartOptions"
                :series="pieSeries"
              ></apexchart>
            </v-col>
            <!-- COURSE FULL -->
            <v-col cols="12" sm="4">
              <v-card outlined style="overflow-y: scroll" height="327px">
                <v-card-text
                  style="
                    background-color: #ffdde2;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                  "
                >
                  <span class="mr-2">คอร์สเต็ม</span>
                  <v-badge
                    color="#A1A1A1"
                    :content="coursefull.length"
                    class="indent-5"
                  >
                  </v-badge>
                </v-card-text>
                <v-card-text>
                  <v-card
                    outlined
                    class="mb-3"
                    v-for="(item, index) in coursefull"
                    :key="index"
                  >
                    <v-card-text class="pa-2">
                      <v-row dense>
                        <v-col cols="6">{{ item.courseName }}</v-col>
                        <v-col cols="6">{{
                          `${item.courseType} ${
                            item.coursePackage ? item.coursePackage : ""
                          }`
                        }}</v-col>
                      </v-row>
                      <v-row dense>
                        <v-col cols="6">
                          <v-icon color="#ff6b81">mdi-sofa-single</v-icon>
                          ที่นั่ง{{ `${item.seat}` }}</v-col
                        >
                        <v-col cols="6"
                          ><v-badge
                            color="#A1A1A1"
                            :content="item.courseStatus"
                          ></v-badge
                        ></v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
              <!-- </v-card> -->
            </v-col>

            <v-col cols="12" sm="4">
              <v-card outlined style="overflow-y: scroll" height="327px">
                <v-card-text
                  style="
                    background-color: #ffdde2;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                  "
                >
                  <span class="mr-2">คอร์สว่าง</span>
                  <v-badge color="#8CD977" :content="emptyCourse.length">
                  </v-badge>
                </v-card-text>
                <v-card-text>
                  <v-card
                    outlined
                    class="mb-3"
                    v-for="(item, index) in emptyCourse"
                    :key="index"
                  >
                    <v-card-text class="pa-2">
                      <v-row dense>
                        <v-col cols="6">{{ item.courseName }}</v-col>
                        <v-col cols="6">{{
                          `${item.courseType} ${
                            item.coursePackage ? item.coursePackage : ""
                          }`
                        }}</v-col>
                      </v-row>
                      <v-row dense>
                        <v-col cols="6">
                          <v-icon color="#ff6b81">mdi-sofa-single</v-icon>
                          ที่นั่ง{{ `${item.seat}` }}</v-col
                        >
                        <v-col cols="6"
                          ><v-badge
                            color="#8CD977"
                            :content="item.courseStatus"
                          ></v-badge
                        ></v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
        <!-- <v-row>
        <v-col cols="12">
          
        </v-col>
      </v-row> -->
        <!-- <v-card class="mx-5">
        <v-card-title>
          <v-row>
            <v-col cols="12" sm="4">
              <apexchart
                type="pie"
                width="380"
                :options="pieChartOptions"
                :series="pieSeries"
              ></apexchart>
            </v-col>
            <v-col cols="12" sm="4"></v-col>
            <v-col cols="12" sm="4"></v-col>
          </v-row>
        </v-card-title>
      </v-card> -->
      </v-card>
    </v-container>
  </v-app>
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
    coursefull: [
      {
        courseName: "เปียโนเวิร์คช้อป",
        courseType: "คอร์สระยะสั้น",
        seat: "(12/12)",
        courseStatus: "คอร์สเต็ม",
      },
      {
        courseName: "เปียโนเวิร์คช้อป",
        courseType: "คอร์สทั่วไป",
        coursePackage: "(Exclusive)",
        seat: "(12/12)",
        courseStatus: "คอร์สเต็ม",
      },
      {
        courseName: "เปียโนเวิร์คช้อป",
        courseType: "คอร์สทั่วไป",
        coursePackage: "(Exclusive)",
        seat: "(12/12)",
        courseStatus: "คอร์สเต็ม",
      },
      {
        courseName: "เปียโนเวิร์คช้อป",
        courseType: "คอร์สระยะสั้น",
        seat: "(12/12)",
        courseStatus: "คอร์สเต็ม",
      },
      {
        courseName: "เปียโนเวิร์คช้อป",
        courseType: "คอร์สทั่วไป",
        coursePackage: "(Exclusive)",
        seat: "(12/12)",
        courseStatus: "คอร์สเต็ม",
      },
      {
        courseName: "เปียโนเวิร์คช้อป",
        courseType: "คอร์สทั่วไป",
        coursePackage: "(Exclusive)",
        seat: "(12/12)",
        courseStatus: "คอร์สเต็ม",
      },
    ],

    emptyCourse: [
      {
        courseName: "เปียโนเวิร์คช้อป",
        courseType: "คอร์สระยะสั้น",
        seat: "(2/12)",
        courseStatus: "คอร์สว่าง",
      },
      {
        courseName: "เปียโนเวิร์คช้อป",
        courseType: "คอร์สทั่วไป",
        coursePackage: "(Exclusive)",
        seat: "(2/12)",
        courseStatus: "คอร์สว่าง",
      },
      {
        courseName: "เปียโนเวิร์คช้อป",
        courseType: "คอร์สทั่วไป",
        coursePackage: "(Exclusive)",
        seat: "(2/12)",
        courseStatus: "คอร์สว่าง",
      },
      {
        courseName: "เปียโนเวิร์คช้อป",
        courseType: "คอร์สระยะสั้น",
        seat: "(2/12)",
        courseStatus: "คอร์สว่าง",
      },
      {
        courseName: "เปียโนเวิร์คช้อป",
        courseType: "คอร์สทั่วไป",
        coursePackage: "(Exclusive)",
        seat: "(2/12)",
        courseStatus: "คอร์สว่าง",
      },
      {
        courseName: "เปียโนเวิร์คช้อป",
        courseType: "คอร์สทั่วไป",
        coursePackage: "(Exclusive)",
        seat: "(2/12)",
        courseStatus: "คอร์สว่าง",
      },
    ],
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
        type: "line",
        zoom: {
          enabled: false,
        },
      },
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
    donutSeries: [82, 18],
    pieSeries: [7, 3],
    pieChartOptions: {
      colors: ["#7CD464", "#A1A1A1"],
      chart: {
        width: 380,
        type: "pie",
      },
      dataLabels: {
        enabled: false,
      },
      labels: ["คอร์สว่าง 7 คอร์ส", "คอร์สเต็ม 3 คอร์ส"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
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
.background-color {
  background: linear-gradient(rgba(255, 250, 251, 1), rgba(255, 250, 250, 1)),
    linear-gradient(white, white);
}

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #c7c7c7;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #c7c7c7;
}

.navbar {
  overflow: hidden;
  background-color: #333;
  position: fixed;
  top: 0;
  width: 100%;
}

.navbar a {
  float: left;
  display: block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.navbar a:hover {
  background: #ddd;
  color: black;
}
</style>