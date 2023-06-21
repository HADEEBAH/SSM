<template >
  <v-app class="background-color">
    <v-container class="overflow-y: hidden; overflow-x: hidden;">
      <loading-overlay :loading="dashboard_loading"> </loading-overlay>

      <headerPage title="แดชบอร์ด"></headerPage>
      <pre>{{ get_potential }}</pre>

      <!-- TOP CARD -->
      <v-row dense>
        <!-- STUDENT -->
        <v-col cols="12" sm="12" md="12" lg="7">
          <v-card class="pa-4 rounded-lg drop-shadow-lg">
            <v-row dense>
              <!-- ผู้เรียนทั้งหมด -->
              <v-col cols="6" sm="3">
                <v-card
                  @click="$router.push({ name: 'StudentList' })"
                  class="cursor-pointer rounded-lg"
                >
                  <v-row dense>
                    <v-col cols="3" sm="3">
                      <div class="my-5 ml-2">
                        <v-icon color="#ff6b81">mdi-account-group</v-icon>
                      </div>
                    </v-col>
                    <v-col cols="9" md="9">
                      <div class="font-bold my-5 text-lg">ผู้เรียนทั้งหมด</div>
                    </v-col>
                  </v-row>
                  <div
                    align="center"
                    style="color: #ff6b81; font-size: xx-large"
                    class="font-bold text-lg"
                  >
                    {{ get_potential.countStudents }}
                  </div>
                  <v-col align="center">
                    <div class="my-3">คน</div>
                  </v-col>
                </v-card>
              </v-col>
              <!-- ผู้เรียนปัจจุบัน -->
              <v-col cols="6" sm="3">
                <v-card class="rounded-lg">
                  <v-row dense>
                    <v-col cols="12" align="center">
                      <div class="my-5">ผู้เรียนปัจจุบัน</div>
                    </v-col>
                    <v-col cols="12" align="center">
                      <div style="color: #1876d1; font-size: 30px">
                        {{ get_potential.currentStudent.length }}
                      </div>
                    </v-col>
                    <v-col cols="12" align="center">
                      <div class="mb-5">คน</div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <!-- ผู้เรียนที่ใกล้จบ -->
              <v-col cols="6" sm="3">
                <v-card class="rounded-lg">
                  <v-row dense>
                    <v-col cols="12" align="center">
                      <div class="my-5">ผู้เรียนที่ใกล้จบ</div>
                    </v-col>
                    <v-col cols="12" align="center">
                      <div style="color: #1876d1; font-size: 30px">
                        {{ get_potential.potencialsStudent.length }}
                      </div>
                    </v-col>
                    <v-col cols="12" align="center">
                      <div class="mb-5">คน</div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <!-- ผู้เรียนจองคอร์ส -->
              <v-col cols="6" sm="3">
                <v-card class="rounded-lg">
                  <v-row dense>
                    <v-col cols="12" align="center">
                      <div class="my-5">ผู้เรียนจองคอร์ส</div>
                    </v-col>
                    <v-col cols="12" align="center">
                      <div style="color: #1876d1; font-size: 30px">
                        {{ get_potential.countReserve.studentList.length }}
                      </div>
                    </v-col>
                    <v-col cols="12" align="center">
                      <div class="mb-5">คน</div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <!-- COURSE -->
        <v-col cols="12" sm="6" md="6" lg="3">
          <v-card class="rounded-lg drop-shadow-lg" height="202px">
            <v-row dense>
              <v-col cols="6" sm="6">
                <v-row dense>
                  <v-col cols="3" sm="4" md="4">
                    <div class="my-5 ml-3">
                      <v-icon color="#ff6b81"> mdi-book-open-variant </v-icon>
                    </div>
                  </v-col>
                  <v-col cols="9" sm="8" md="8">
                    <div class="font-bold my-5 text-lg">คอร์สเรียน</div>
                  </v-col>
                  <v-col cols="12" align="center">
                    <div
                      class="font-bold text-lg"
                      style="color: #ff6b81; font-size: 30px"
                    >
                      {{ get_course_type.allCourse.generalCourse }}
                    </div>
                  </v-col>
                  <v-col align="center">
                    <div class="my-5">คอร์ส</div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6" sm="6">
                <v-row dense>
                  <v-col cols="12" align="center">
                    <div class="font-medium my-5 text-lg">คอร์สทั่วไป</div>
                    <div class="font-medium text-lg" style="color: #1876d1">
                      {{ get_course_type.generalCourse.generalCourse }}
                    </div>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" align="center">
                    <div class="font-medium my-2 text-lg">คอร์สระยะสั้น</div>
                    <div class="font-medium text-lg" style="color: #1876d1">
                      {{ get_course_type.shortCourse.shortCourse }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <!-- COACH -->
        <v-col cols="12" sm="6" md="6" lg="2">
          <v-card class="rounded-lg drop-shadow-lg" height="202">
            <v-row dense>
              <!-- <v-col cols="12" sm="12"> -->
              <v-col cols="12" sm="12" align="center">
                <div class="my-5 mx-10 font-bold text-lg">
                  <v-icon color="#ff6b81">mdi-account</v-icon>
                  <span>โค้ช</span>
                </div>
              </v-col>
              <!-- <v-col cols="9" sm="9" align="center">
                <div class="font-bold my-5 text-lg ml-2">โค้ช</div>
              </v-col> -->
              <v-card-text
                align="center"
                style="color: #ff6b81; font-size: 30px; font-weight: 900"
              >
                {{ get_potential.countCoaches }}
              </v-card-text>
              <v-card-text align="center"> คน </v-card-text>
              <!-- </v-col> -->
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <!-- BOTTOM CARD -->
      <v-card style="background-color: #ffdde2" class="my-5 rounded-lg">
        <v-row dense class="pa-2">
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
                      v-model="selected_mounth"
                      :items="thaiMonths"
                      item-text="name"
                      return-object
                      dense
                      outlined
                      @input="selectMunth()"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-title>
                <v-row dense>
                  <v-badge color="green" content="6">
                    {{ get_graf.sumSuccess }}
                  </v-badge>
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
            <v-card class="bg-white rounded-lg" style="height: 100%">
              <!-- TITLE -->
              <v-card-title>
                <v-row dense>
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
                      v-model="donut_mounth"
                      :items="thaiMonths"
                      item-text="name"
                      return-object
                      dense
                      outlined
                      @input="selectDonutMounth()"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-title>

              <v-row dense>
                <!-- DOnut -->
                <v-col cols="12" sm="12" md="12" lg="6" align="center">
                  <div style="height: 100%">
                    <!-- <v-progress-circular
                      style="stroke-linecap: round"
                      :rotate="-90"
                      :size="250"
                      :width="20"
                      :model-value="get_donut.sumSuccess"
                      :value="
                        (get_donut.sumPending / get_donut.sumSuccess) * 10000
                      "
                      color="#ff6b81"
                    >
                      ทั้งหมด
                      <br />
                      {{
                        `${get_donut.sumPending + get_donut.sumSuccess}`
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }}
                    </v-progress-circular> -->
                    <apexchart
                      type="donut"
                      width="380"
                      :options="donutOptions"
                      :series="donutSeries"
                    ></apexchart>
                  </div>
                </v-col>
                <!-- Dot Data -->
                <!-- <v-col cols="12" sm="12" md="12" lg="6">
                  <v-row dense class="mb-2">
                    ชำระแล้ว
                    <v-col cols="12" sm="12" class="mx-10">
                      <div>
                        <v-icon color="#ff6b81">mdi-circle-medium</v-icon>
                        <span class="font-bold text-xl">ชำระแล้ว</span>
                      </div>
                      <div
                        style="font-weight: bold; color: #58a144"
                        class="mx-5"
                      >
                        {{ get_donut.sumSuccess.toLocaleString() }}
                        <span
                          style="
                            font-weight: normal;
                            color: #999999;
                            font-size: small;
                          "
                        >
                          บาท({{ get_donut.sumSuccessPercentage }}%)
                        </span>
                      </div>
                    </v-col>
                    รอดำเนินการ
                    <v-col cols="12" sm="12" class="mx-10">
                      <div>
                        <v-icon color="#E8E7E7">mdi-circle-medium</v-icon>
                        <span class="font-bold text-xl">รอดำเนินการ</span>
                      </div>
                      <div
                        style="font-weight: bold; color: #fcc419"
                        class="mx-5"
                      >
                        {{
                          get_donut.sumPending
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }}

                        <span
                          style="
                            font-weight: normal;
                            color: #999999;
                            font-size: small;
                          "
                          >บาท ({{ get_donut.sumPendingPercentage }}%)
                        </span>
                      </div>
                    </v-col>
                  </v-row>
                </v-col> -->
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-row dense>
          <v-card-title>
            <v-img
              src="../../../assets/navbar/barCourse.svg"
              style="max-width: 25px; margin-left: 30px"
            ></v-img>
            <span class="indent-5">สถานะคอร์สเรียน</span>
          </v-card-title>
        </v-row>
        <v-card class="bg-white mx-5 pa-5 my-5">
          <v-row dense>
            <!-- PIE -->
            <v-col cols="12" sm="12" md="12" lg="4" align="center">
              <apexchart
                type="pie"
                :options="pieChartOptions"
                :series="pieSeries"
              ></apexchart>
            </v-col>
            <!-- COURSE CLOSE -->
            <v-col cols="12" sm="6" md="6" lg="4">
              <v-card outlined style="overflow-y: scroll" height="340px">
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
                    :content="get_empty_course.countClose"
                    class="indent-5"
                  >
                  </v-badge>
                </v-card-text>

                <v-card-text>
                  <v-card
                    outlined
                    class="mb-3"
                    v-for="(
                      item, index
                    ) in get_empty_course.courseStatus.filter(
                      (v) => v.status == 'Close'
                    )"
                    :key="index"
                  >
                    <v-card-text class="pa-2">
                      <v-row dense>
                        <v-col cols="12" md="4" lg="4">
                          {{ item.courseNameTh }}
                        </v-col>
                        <v-col cols="12" md="8" lg="8">
                          {{ `${item.courseTypeNameTh}(${item.packageName})` }}
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col cols="6">
                          <v-icon color="#ff6b81">
                            mdi-sofa-single-outline
                          </v-icon>
                          ที่นั่ง{{
                            `${item.currentStudent}/${item.maximumStudent}`
                          }}
                        </v-col>
                        <v-col cols="6">
                          <v-chip
                            dark
                            :color="
                              course_close_options.filter(
                                (v) => v.value === item.status
                              )[0].color
                            "
                          >
                            {{
                              course_close_options.filter(
                                (v) => v.value === item.status
                              ).length > 0
                                ? course_close_options.filter(
                                    (v) => v.value === item.status
                                  )[0].label
                                : "-"
                            }}
                          </v-chip>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
              <!-- </v-card> -->
            </v-col>
            <!-- COURSE OPEN -->
            <v-col cols="12" sm="6" md="6" lg="4">
              <v-card outlined style="overflow-y: scroll" height="340px">
                <v-card-text
                  style="
                    background-color: #ffdde2;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                  "
                >
                  <span class="mr-2">คอร์สว่าง</span>
                  <v-badge
                    color="#8CD977"
                    :content="get_empty_course.countOpen"
                  >
                  </v-badge>
                </v-card-text>

                <v-card-text>
                  <v-card
                    outlined
                    class="mb-3"
                    v-for="(
                      item, index
                    ) in get_empty_course.courseStatus.filter(
                      (v) => v.status == 'Open'
                    )"
                    :key="index"
                  >
                    <v-card-text class="pa-2">
                      <v-row dense>
                        <v-col cols="12" md="4" lg="4">{{
                          item.courseNameTh
                        }}</v-col>
                        <v-col cols="12" md="8" lg="8">{{
                          `${item.courseTypeNameTh}(${item.packageName})`
                        }}</v-col>
                      </v-row>
                      <v-row dense>
                        <v-col cols="6">
                          <v-icon color="#ff6b81"
                            >mdi-sofa-single-outline</v-icon
                          >
                          ที่นั่ง{{
                            `${item.currentStudent}/${item.maximumStudent}`
                          }}</v-col
                        >
                        <v-col cols="6">
                          <v-chip
                            dark
                            :color="
                              course_close_options.filter(
                                (v) => v.value === item.status
                              )[0].color
                            "
                          >
                            {{
                              course_close_options.filter(
                                (v) => v.value === item.status
                              ).length > 0
                                ? course_close_options.filter(
                                    (v) => v.value === item.status
                                  )[0].label
                                : "-"
                            }}
                          </v-chip>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-card>
    </v-container>
  </v-app>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import headerPage from "@/components/header/headerPage.vue";
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";

import chart from "vue-apexcharts";

export default {
  components: {
    apexchart: chart,
    headerPage,
    loadingOverlay,
  },
  data: () => ({
    course_close_options: [
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

    thaiMonths: [
      { name: "มกราคม", key: "01", type: "month" },
      { name: "กุมภาพันธ์", key: "02", type: "month" },
      { name: "มีนาคม", key: "03", type: "month" },
      { name: "เมษายน", key: "04", type: "month" },
      { name: "พฤษภาคม", key: "05", type: "month" },
      { name: "มิถุนายน", key: "06", type: "month" },
      { name: "กรกฎาคม", key: "07", type: "month" },
      { name: "สิงหาคม", key: "08", type: "month" },
      { name: "กันยายน", key: "09", type: "month" },
      { name: "ตุลาคม", key: "10", type: "month" },
      { name: "พฤศจิกายน", key: "11", type: "month" },
      { name: "ธันวาคม", key: "12", type: "month" },
    ],
    selected_mounth: "",
    donut_mounth: "",
    setSelectedMonth: null,
    // donutSeries: [44, 55, 41, 17, 15],
    donutOptions: {
      labels: ["คอร์ส 1", "คอร์ส 2"],
      chart: {
        width: 380,
        type: "donut",
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
        },
      },
      dataLabels: {
        // labels: ["คอร์ส 1", "คอร์ส 2", "คอร์ส 3", "คอร์ส 4", "คอร์ส 5"],
        enabled: true,
      },
      fill: {
        type: "gradient",
      },
      legend: {
        // formatter: function (val, opts) {
        //   return val + " - " + opts.w.globals.series[opts.seriesIndex];
        // },
      },

      // responsive: [
      //   {
      //     breakpoint: 600,
      //     options: {
      //       chart: {
      //         width: 500,
      //       },
      //       legend: {
      //         position: "bottom",
      //       },
      //     },
      //   },
      // ],
    },
  }),
  created() {
    this.selectMunth();
    this.selectDonutMounth();
  },
  beforeMount() {
    const month = new Date().getMonth() + 1;
    const mapMonth = this.thaiMonths.filter(
      (item) => parseInt(item.key) === month
    )[0];
    console.log("mapMonth", mapMonth);
    this.selected_mounth = mapMonth;
    this.selectMunth();
    this.donut_mounth = mapMonth;
    this.selectDonutMounth();
  },
  mounted() {
    this.GetEmptyCourse();
    this.GetCourseType();
    this.GetPotential();
    this.GetDonut();
    this.GetGraf();
  },
  methods: {
    ...mapActions({
      GetEmptyCourse: "DashboardModules/GetEmptyCourse",
      GetCourseType: "DashboardModules/GetCourseType",
      GetPotential: "DashboardModules/GetPotential",
      GetDonut: "DashboardModules/GetDonut",
      GetGraf: "DashboardModules/GetGraf",
    }),

    selectMunth() {
      console.log("thaiMonths", this.selected_mounth);
      this.GetGraf(this.selected_mounth);
    },

    selectDonutMounth() {
      console.log("thaiMonthsD", this.donut_mounth);
      this.GetDonut(this.donut_mounth);
    },
  },
  computed: {
    ...mapGetters({
      get_empty_course: "DashboardModules/getEmptyCourse",
      get_course_type: "DashboardModules/getCourseType",
      get_potential: "DashboardModules/getPotential",
      get_donut: "DashboardModules/getDonut",
      get_graf: "DashboardModules/getGraf",
      dashboard_loading: "DashboardModules/getloading",
    }),

    chartOptions() {
      const lineChartOptions = {
        chart: {
          type: "line",
          toolbar: {
            show: false,
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
        grid: {},
        xaxis: {
          categories:
            this.get_graf.length !== 0
              ? this.get_graf.orderData.map((item) => {
                  return item.date;
                })
              : "",
        },
      };

      return lineChartOptions;
    },
    series() {
      const lineChart = [
        {
          data:
            this.get_graf.length !== 0
              ? this.get_graf.orderData.map((item) => {
                  return item.sumSuccess;
                })
              : "",
        },
      ];
      return lineChart;
    },
    //   donutOptions() {
    //     const donutdata = {}
    //   return donutdata
    // },

    // donutOptions: {
    //   labels: ["คอร์ส 1", "คอร์ส 2"],
    //   chart: {
    //     width: 380,
    //     type: "donut",
    //   },
    //   plotOptions: {
    //     pie: {
    //       startAngle: -90,
    //       endAngle: 270,
    //     },
    //   },
    //   dataLabels: {
    //     enabled: true,
    //   },
    //   fill: {
    //     type: "gradient",
    //   },
    //   legend: {
    //     // formatter: function (val, opts) {
    //     //   return val + " - " + opts.w.globals.series[opts.seriesIndex];
    //     // },
    //   },

    //   // responsive: [
    //   //   {
    //   //     breakpoint: 600,
    //   //     options: {
    //   //       chart: {
    //   //         width: 500,
    //   //       },
    //   //       legend: {
    //   //         position: "bottom",
    //   //       },
    //   //     },
    //   //   },
    //   // ],
    // },

    donutSeries() {
      let success = this.get_empty_course.countOpen;
      let pending = this.get_donut.sumPending;
      const donut = [success, pending];
      return donut;
    },
    pieSeries() {
      let Open = this.get_empty_course.countOpen;
      let Close = this.get_empty_course.countClose;
      const pieData = [Open, Close];
      return pieData;
    },
    pieChartOptions() {
      let Open = this.get_empty_course.countOpen;
      let Close = this.get_empty_course.countClose;
      const pieChartOptions = {
        colors: ["#7CD464", "#A1A1A1"],
        chart: {
          width: 380,
          type: "pie",
        },
        dataLabels: {
          enabled: false,
        },
        labels: [`คอร์สว่าง ${Open} คอร์ส`, `คอร์สเต็ม ${Close} คอร์ส`],
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
      };
      return pieChartOptions;
    },
  },
  // watch: {
  //   currentMonthThai(newValue) {
  //     console.log("newValue", newValue);
  //     this.selected_mounth = newValue;
  //   },
  // },
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