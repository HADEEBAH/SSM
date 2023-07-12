<template >
  <v-app class="background-color">
    <v-container class="overflow-x: hidden;">
      <loading-overlay :loading="dashboard_loading"> </loading-overlay>

      <headerPage title="แดชบอร์ด"></headerPage>
      <!-- <pre>{{ get_potential }}</pre> -->

      <!-- TOP CARD -->
      <v-row dense>
        <!-- STUDENT -->
        <v-col cols="12" sm="12" md="12" lg="7">
          <v-card class="pa-4 rounded-lg drop-shadow-md">
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
                    {{
                      get_potential.countStudents
                        ? get_potential.countStudents
                        : "0"
                    }}
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
                      <div class="my-5 text-lg">ผู้เรียนปัจจุบัน</div>
                    </v-col>
                  </v-row>
                  <div
                    align="center"
                    style="color: #1876d1; font-size: xx-large"
                    class="font-bold text-lg"
                  >
                    {{
                      get_potential.currentStudent?.countStudentCurrent
                        ? get_potential.currentStudent?.countStudentCurrent
                        : "0"
                    }}
                  </div>
                  <v-col align="center">
                    <div class="my-3">คน</div>
                  </v-col>
                </v-card>
              </v-col>
              <!-- ผู้เรียนที่ใกล้จบ -->
              <v-col cols="6" sm="3">
                <v-card class="rounded-lg">
                  <v-row dense>
                    <v-col cols="12" align="center">
                      <div class="my-5 text-lg">ผู้เรียนที่ใกล้จบ</div>
                    </v-col>
                  </v-row>
                  <div
                    align="center"
                    style="color: #1876d1; font-size: xx-large"
                    class="font-bold text-lg"
                  >
                    {{
                      get_potential.potencialsStudent?.countStudentPotencials
                        ? get_potential.potencialsStudent.countStudentPotencials
                        : "0"
                    }}
                  </div>
                  <v-col align="center">
                    <div class="my-3">คน</div>
                  </v-col>
                </v-card>
              </v-col>
              <!-- ผู้เรียนจองคอร์ส -->
              <v-col cols="6" sm="3">
                <v-card class="rounded-lg">
                  <v-row dense>
                    <v-col cols="12" align="center">
                      <div class="my-5 text-lg">ผู้เรียนจองคอร์ส</div>
                    </v-col>
                  </v-row>
                  <div
                    align="center"
                    style="color: #1876d1; font-size: xx-large"
                    class="font-bold text-lg"
                  >
                    {{
                      get_potential.countReserve?.countStudent
                        ? get_potential.countReserve.countStudent
                        : "0"
                    }}
                  </div>
                  <v-col align="center">
                    <div class="my-3">คน</div>
                  </v-col>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <!-- COURSE -->
        <v-col cols="12" sm="6" md="6" lg="3">
          <v-card class="rounded-lg drop-shadow-md" height="200px">
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
                      {{ get_course_type.allCourse?.generalCourse }}
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
                      {{
                        get_course_type.generalCourse?.generalCourse
                          ? get_course_type.generalCourse.generalCourse
                          : "0"
                      }}
                    </div>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" align="center">
                    <div class="font-medium my-2 text-lg">คอร์สระยะสั้น</div>
                    <div class="font-medium text-lg" style="color: #1876d1">
                      {{
                        get_course_type.shortCourse?.shortCourse
                          ? get_course_type.shortCourse.shortCourse
                          : "0"
                      }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <!-- COACH -->
        <v-col cols="12" sm="6" md="6" lg="2">
          <v-card class="rounded-lg drop-shadow-md" height="200">
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
          <v-col cols="12" sm="12" md="12" lg="6">
            <v-card style="background-color: #ffffff" class="rounded-lg">
              <v-card-title>
                <v-row dense>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    lg="4"
                    style="color: #ff6b81; font-weight: bold"
                  >
                    <v-icon color="#ff6b81">mdi-currency-thb</v-icon>
                    รายได้
                  </v-col>
                  <!-- Year -->
                  <v-col cols="6" sm="6" md="6" lg="4">
                    <v-select
                      v-model="selected_years"
                      :items="filter_years"
                      item-text="thaiYears"
                      item-value="usYears"
                      return-object
                      dense
                      outlined
                      @input="selectYears()"
                    ></v-select>
                  </v-col>
                  <!-- Month -->
                  <v-col cols="6" sm="6" md="6" lg="4">
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
                  <!-- <v-badge color="green" content="6"> -->
                  <div class="font-bold">
                    {{
                      get_graf.sumSuccess
                        ? get_graf.sumSuccess
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : "ยังไม่มีข้อมูล"
                    }}
                  </div>
                  <!-- </v-badge> -->
                </v-row>
              </v-card-title>
              <v-card-text>
                <template>
                  <v-row class="my-2">
                    <v-col cols="12">
                      <apexchart
                        type="line"
                        :options="chartOptions"
                        :series="chartSeries"
                        :height="heightGraf()"
                      >
                      </apexchart>
                    </v-col>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- สัดส่วนรายได้ DONUT -->
          <v-col cols="12" sm="12" md="12" lg="6">
            <v-card class="bg-white rounded-lg" style="height: 100%">
              <!-- TITLE -->
              <v-card-title>
                <v-row dense>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    lg="4"
                    style="color: #ff6b81; font-weight: bold"
                  >
                    <v-icon color="#ff6b81">mdi-elevation-rise</v-icon>
                    สัดส่วนรายได้
                  </v-col>
                  <!-- YEAR -->
                  <v-col cols="6" sm="6" md="6" lg="4">
                    <v-select
                      v-model="donut_years"
                      :items="filter_years"
                      item-text="thaiYears"
                      item-value="usYears"
                      dense
                      outlined
                      @input="selectDonutYears()"
                    ></v-select>
                  </v-col>
                  <!-- MONTH -->
                  <v-col cols="6" sm="6" md="6" lg="4">
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
                <!-- <div>
                  <v-select
                    v-model="donut_years"
                    :items="get_graf.yearName"
                    return-object
                    dense
                    outlined
                    @input="selectDonutYears()"
                  ></v-select>
                </div> -->
              </v-card-title>
              <v-row dense>
                <!-- DOnut -->
                <v-col cols="12" sm="12" md="12" lg="12" align="center">
                  <apexchart
                    type="donut"
                    :options="donutOptions()"
                    :series="seriesOfDonut"
                    :width="widthDonut()"
                  ></apexchart>
                </v-col>
                <!-- Dot Data -->
                <v-col cols="12" sm="12" md="12" lg="12" align="start">
                  <v-row dense class="my-2">
                    <!-- ชำระแล้ว -->
                    <v-col cols="12" sm="6" align="center">
                      <div>
                        <v-icon color="#ff6b81">mdi-circle-medium</v-icon>
                        <span class="text-xl">
                          ชำระแล้ว
                          <span
                            style="color: #58a144"
                            class="font-bold text-xl"
                            >{{ totalSuccessDonut.toLocaleString() }}</span
                          >
                          <span
                            style="
                              font-weight: normal;
                              color: #999999;
                              font-size: small;
                            "
                          >
                            บาท({{
                              (
                                (totalSuccessDonut * 100) /
                                totalPriceDonut
                              ).toLocaleString("us-us", {
                                maximumFractionDigits: 2,
                              })
                            }}%)
                          </span>
                        </span>
                      </div>
                    </v-col>

                    <!-- <v-col cols="6" align="center">
                      <div style="margin-right: 60px">
                        <v-icon color="#ff6b81">mdi-circle-medium</v-icon>
                        <span class="text-xl">ชำระแล้ว</span>
                      </div>
                      <div
                        style="font-weight: bold; color: #58a144"
                        class="mx-5 font-bold text-xl"
                      >
                        {{ totalSuccessDonut.toLocaleString() }}
                        <span
                          style="
                            font-weight: normal;
                            color: #999999;
                            font-size: small;
                          "
                        >
                          บาท({{
                            (
                              (totalSuccessDonut * 100) /
                              totalPriceDonut
                            ).toLocaleString("us-us", {
                              maximumFractionDigits: 2,
                            })
                          }}%)
                        </span>
                      </div>
                    </v-col> -->
                    <!-- รอดำเนินการ -->

                    <v-col cols="12" sm="6" align="center">
                      <div>
                        <v-icon color="#E8E7E7">mdi-circle-medium</v-icon>
                        <span class="text-xl">
                          รอดำเนินการ
                          <span
                            style="color: #fcc419"
                            class="font-bold text-xl"
                          >
                            {{ totalPendingDonut.toLocaleString() }}</span
                          >
                          <span
                            style="
                              font-weight: normal;
                              color: #999999;
                              font-size: small;
                            "
                          >
                            บาท ({{
                              (
                                (totalPendingDonut * 100) /
                                totalPriceDonut
                              ).toLocaleString("us-us", {
                                maximumFractionDigits: 2,
                              })
                            }}%)
                          </span>
                        </span>
                      </div>
                    </v-col>

                    <!-- <v-col cols="6" align="center">
                      <div style="margin-right: 60px">
                        <v-icon color="#E8E7E7">mdi-circle-medium</v-icon>
                        <span class="text-xl">รอดำเนินการ</span>
                      </div>
                      <div
                        style="font-weight: bold; color: #fcc419"
                        class="mx-5 font-bold text-xl"
                      >
                        {{ totalPendingDonut.toLocaleString() }}

                        <span
                          style="
                            font-weight: normal;
                            color: #999999;
                            font-size: small;
                          "
                        >
                          บาท ({{
                            (
                              (totalPendingDonut * 100) /
                              totalPriceDonut
                            ).toLocaleString("us-us", {
                              maximumFractionDigits: 2,
                            })
                          }}%)
                        </span>
                      </div>
                    </v-col> -->
                  </v-row>
                </v-col>
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
                style="width: 100%; height: 100%"
                type="pie"
                :options="pieChartOptions"
                :series="pieSeries"
                :width="widthPie()"
              ></apexchart>
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="12" align="start">
              <v-row dense class="my-2">
                <!-- คอร์สเต็ม -->
                <v-col cols="12" sm="6" align="center">
                  <div style="margin-right: 60px">
                    <v-icon color="#58a144">mdi-circle-medium</v-icon>
                    <span class="text-xl">
                      คอร์สเต็ม
                      <span style="font-weight: bold; color: #58a144">{{
                        this.get_empty_course.countClose.toLocaleString()
                      }}</span>
                      คอร์ส
                    </span>
                  </div>
                </v-col>
                <!-- รอดำเนินการ -->
                <v-col cols="12" sm="6" align="center">
                  <div style="margin-right: 60px">
                    <v-icon color="#A1A1A1">mdi-circle-medium</v-icon>
                    <span class="text-xl">
                      คอร์สว่าง
                      <span style="font-weight: bold; color: #a1a1a1">{{
                        this.get_empty_course.countOpen.toLocaleString()
                      }}</span>
                      คอร์ส
                    </span>
                  </div>
                </v-col>
              </v-row>
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
                  <span class="mr-2 font-bold">คอร์สเต็ม</span>
                  <v-badge
                    color="#A1A1A1"
                    :content="get_empty_course.countClose"
                    class="indent-5 font-bold"
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
                    <v-card-text class="pa-0">
                      <v-row dense>
                        <v-col cols="12">
                          <v-card-title>{{ item.courseNameTh }}</v-card-title>
                        </v-col>
                        <v-col cols="12" sm="8" md="8" lg="8">
                          <v-card-subtitle class="mt-n10">
                            {{
                              `${item.courseTypeNameTh}(${item.packageName})`
                            }}</v-card-subtitle
                          >
                        </v-col>
                        <v-col cols="12" sm="4" md="4" lg="4">
                          <v-card-subtitle class="mt-n10">
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
                          </v-card-subtitle>
                        </v-col>

                        <v-col cols="12">
                          <v-card-subtitle class="mt-n10">
                            <v-icon color="#ff6b81">
                              mdi-sofa-single-outline
                            </v-icon>
                            ที่นั่ง{{
                              ` ${item.currentStudent}/${item.maximumStudent}`
                            }}
                          </v-card-subtitle>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <!-- <v-card-text class="pa-2">
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
                    </v-card-text> -->
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
                  <span class="mr-2 font-bold">คอร์สว่าง</span>
                  <v-badge
                    color="#8CD977"
                    :content="get_empty_course.countOpen"
                    class="indent-5 font-bold"
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
                    <v-card-text class="pa-0">
                      <v-row dense>
                        <v-col cols="12">
                          <v-card-title>{{ item.courseNameTh }}</v-card-title>
                        </v-col>
                        <v-col cols="12" sm="8" md="8" lg="8">
                          <v-card-subtitle class="mt-n10">
                            {{
                              `${item.courseTypeNameTh}(${item.packageName})`
                            }}</v-card-subtitle
                          >
                        </v-col>
                        <v-col cols="12" sm="4" md="4" lg="4">
                          <v-card-subtitle class="mt-n10">
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
                          </v-card-subtitle>
                        </v-col>

                        <v-col cols="12">
                          <v-card-subtitle class="mt-n10">
                            <v-icon color="#ff6b81">
                              mdi-sofa-single-outline
                            </v-icon>
                            ที่นั่ง{{
                              ` ${item.currentStudent}/${item.maximumStudent}`
                            }}
                          </v-card-subtitle>
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
    totalSuccessDonut: 0,
    totalPendingDonut: 0,
    totalPriceDonut: 0,
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
      { name: "ทั้งปี", key: "", type: "month" },
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
    selected_years: "",
    donut_years: "",
    data_year: "",
    data_month: "",
    dashboard_graf: {
      year: "",
      month: "",
    },
    thai_day_name: [],
    mapyears: "",
    mapMonth: "",
    totalPrice: [],
    box: [],
    selectedYear: null,
    currentYear: "",
    year_data: "",
    filter_data: "",
  }),
  created() {
    this.FilterYears().then(() => {
      if (this.filter_years.length > 0) {
        console.log("845", this.filter_years);
        this.selected_years = this.filter_years[0].usYears;
        this.donut_years = this.filter_years[0].usYears;

        this.dashboard_graf = {
          year: this.filter_years[0].usYears,
          month: this.mapMonth.key,
        };
        this.GetDonut(this.dashboard_graf);
        this.GetGraf(this.dashboard_graf);
      }
    });
    const month = new Date().getMonth() + 1;
    this.mapMonth = this.thaiMonths.filter(
      (item) => parseInt(item.key) === month
    )[0];
  },
  beforeMount() {},
  mounted() {
    this.selected_mounth = this.mapMonth;
    this.donut_mounth = this.mapMonth;
    this.GetEmptyCourse();
    this.GetCourseType();
    this.GetPotential();
  },
  methods: {
    ...mapActions({
      GetEmptyCourse: "DashboardModules/GetEmptyCourse",
      GetCourseType: "DashboardModules/GetCourseType",
      GetPotential: "DashboardModules/GetPotential",
      GetDonut: "DashboardModules/GetDonut",
      GetGraf: "DashboardModules/GetGraf",
      FilterYears: "DashboardModules/FilterYears",
    }),

    selectYears() {
      // this.dashboard_graf.year = this.selected_years.key;
      this.GetGraf(this.dashboard_graf);
    },

    selectMunth() {
      this.dashboard_graf.month = this.selected_mounth.key;
      this.GetGraf(this.dashboard_graf);
    },

    selectDonutYears() {
      // console.log("900", this.donut_years);
      // this.dashboard_graf.year = this.donut_years.key;
      this.GetDonut(this.dashboard_graf);
      // for (const items of this.filter_years) {
      //   console.log("906", items.usYears);
      // }
      // this.GetDonut(this.filter_years);
    },

    selectDonutMounth() {
      this.dashboard_graf.month = this.donut_mounth.key;
      this.GetDonut(this.dashboard_graf);
    },

    heightGraf() {
      switch (this.$vuetify.breakpoint.name) {
        case "sm":
          return 250;
        case "md":
          return 250;
      }
    },
    widthDonut() {
      switch (this.$vuetify.breakpoint.name) {
        case "sm":
          return 480;
        case "md":
          return 450;
        case "lg":
          return 390;
      }
    },
    widthPie() {
      switch (this.$vuetify.breakpoint.name) {
        // case "xs":
        //   return 400;
        case "sm":
          return 400;
        case "md":
          return 350;
        case "lg":
          return 380;
      }
    },
    donutSerieses() {
      this.totalPrice = [];
      this.totalSuccessDonut = 0;
      this.totalPendingDonut = 0;
      this.totalPriceDonut = 0;

      let price = 0;
      for (let items of this.get_donut.datas) {
        price = parseFloat(items.totalPrice);
        this.totalPrice.push(price);
        this.totalSuccessDonut =
          this.totalSuccessDonut + parseFloat(items?.sumSuccess);
        this.totalPendingDonut =
          this.totalPendingDonut + parseFloat(items?.sumPending);
        this.totalPriceDonut =
          this.totalPriceDonut + parseFloat(items?.totalPrice);
      }
      this.totalPrice.push(this.get_donut.otherTotal.totalPrice);
      this.totalSuccessDonut =
        this.totalSuccessDonut + this.get_donut.otherTotal.sumSuccess;
      this.totalPendingDonut =
        this.totalPendingDonut + this.get_donut.otherTotal.sumPending;
      this.totalPriceDonut =
        this.totalPriceDonut + this.get_donut.otherTotal.totalPrice;
    },

    // donutSeries() {
    //   for (const items of this.get_donut.datas) {
    //     this.totalSuccessDonut =
    //       this.totalSuccessDonut + parseFloat(items.sumSuccess);
    //     this.totalPendingDonut =
    //       this.totalPendingDonut + parseFloat(items.sumPending);
    //     this.totalPriceDonut =
    //       this.totalPriceDonut + parseFloat(items.totalPrice);
    //   }
    //   this.totalSuccessDonut =
    //     this.totalSuccessDonut + this.get_donut.otherTotal.sumSuccess;
    //   this.totalPendingDonut =
    //     this.totalPendingDonut + this.get_donut.otherTotal.sumPending;
    //   this.totalPriceDonut =
    //     this.totalPriceDonut + this.get_donut.otherTotal.totalPrice;
    // },
    donutLabels() {
      let labels = [];
      for (const items of this.get_donut?.datas) {
        labels.push(items.courseNameTh);
      }
      labels.push(this.get_donut.otherTotal.courseNameTh);

      return labels;
    },

    donutOptions() {
      const donutdata = {
        colors: [
          "#ff6b6b",
          "#ff906b",
          "#ffb56b",
          "#ffda6b",
          "#ffff6b",
          "#daff6b",
          "#b5ff6b",
          "#90ff6b",
          "#6bff6b",
          "#6bff90",
          "#999999",
        ],
        labels: this.donutLabels(),
        // labels: ["a", "b", "c", "d"],
        chart: {
          type: "donut",
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270,
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "รวมทั้งหมด",
                  color: "#373d3f",
                  fontSize: "18px",
                  formatter: function (w) {
                    let sumTotal = 0;
                    for (const items of w.globals.seriesTotals) {
                      sumTotal = sumTotal + items;
                    }
                    return sumTotal.toLocaleString();
                  },
                },
              },
            },
          },
        },
        dataLabels: {
          enabled: true,
        },
        fill: {
          type: "gradient",
        },
        legend: {
          show: false,
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: function (val) {
              return val;
            },
          },
          custom: ({ series, seriesIndex, w }) => {
            return this.customTooltip(series, seriesIndex, w);
          },
        },
      };
      return donutdata;
    },
    customTooltip(series, seriesIndex, w) {
      let item = w.globals;
      let color = item.colors[seriesIndex];
      return this.get_donut?.datas[seriesIndex]
        ? `
        <div class="pa-3 ml-auto" style='background-color: ${color}'>
          <h3 class="font-weight-bold">${item.seriesNames[seriesIndex]}</h3>
          <i class="mdi mdi-circle " style="font-size:10px; color: #8cd977"></i> <span class="font-weight-bold">ที่ชำระแล้ว : </span>${this.get_donut?.datas[seriesIndex].stringSumSuccess}
          <div style="margin-right:20px;"><i class="mdi mdi-circle " style="font-size:10px; color: #a1a1a1"></i> <span class="font-weight-bold">รอชำระ : </span>${this.get_donut?.datas[seriesIndex].stringSumPending}</div>
          <span class="font-weight-bold">รวม : </span>${this.get_donut?.datas[seriesIndex].stringTotal}
        </div>
      `
        : `
        <div class="pa-3 ml-auto" style='background-color: ${color}'>
          <h3 class="font-weight-bold">${item.seriesNames[seriesIndex]}</h3>
          <i class="mdi mdi-circle " style="font-size:10px; color: #8cd977"></i> <span class="font-weight-bold">ที่ชำระแล้ว : </span>${this.get_donut?.otherTotal.sumSuccess
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<br/>
          <i class="mdi mdi-circle " style="font-size:10px; color: #a1a1a1"></i> <span class="font-weight-bold">รอชำระ : </span>${this.get_donut?.otherTotal.sumPending
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<br/>
          <span class="font-weight-bold">รวม : </span>${series[seriesIndex]
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
        `;
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
      filter_years: "DashboardModules/getFilterYears",
    }),

    lineChartLabels() {
      let labelsLine = [];

      for (const items of this.get_graf.orderData) {
        labelsLine.push(items.thaiDayName);
      }
      return labelsLine;
    },

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
        // xaxis: {
        //   categories:
        //     this.get_graf.length !== 0
        //       ? this.get_graf.orderData.map((item) => {
        //           if (this.get_graf.type == "month") {
        //             return item.thaiDayName;
        //           } else if (this.get_graf.type == "year") {
        //             return item?.month;
        //           }
        //         })
        //       : "",
        // },
      };

      return lineChartOptions;
    },
    chartSeries() {
      const lineChart = [
        {
          name: "รายได้",
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

    seriesOfDonut() {
      this.donutSerieses();
      return this.totalPrice;
    },
    donutsuccess() {
      this.donutSerieses();
      return (
        this.totalSuccessDonut && this.totalPendingDonut && this.totalPriceDonut
      );
    },

    pieSeries() {
      let Open = this.get_empty_course.countOpen;
      let Close = this.get_empty_course.countClose;
      const pieData = [Open, Close];
      return pieData;
    },
    pieChartOptions() {
      // let Open = this.get_empty_course.countOpen;
      // let Close = this.get_empty_course.countClose;
      const pieChartOptions = {
        colors: ["#7CD464", "#A1A1A1"],
        chart: {
          type: "pie",
        },
        dataLabels: {
          enabled: true,
        },
        labels: ["คอร์สว่าง", "คอร์สเต็ม"],
        // labels: [`คอร์สว่าง ${Open} คอร์ส`, `คอร์สเต็ม ${Close} คอร์ส`],
        // responsive: [
        //   {
        //     breakpoint: 480,
        //     options: {
        //       chart: {
        //         width: 200,
        //       },
        //     },
        //   },
        // ],
        legend: {
          show: false,
        },
      };
      return pieChartOptions;
    },
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