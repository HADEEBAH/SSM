<template>
  <v-app class="background-color">
    <v-container class="overflow-x: hidden;">
      <loading-overlay :loading="dashboard_loading"> </loading-overlay>

      <headerPage :title="$t('dashboard')"></headerPage>
      <!-- TOP CARD -->
      <!-- <pre>{{ get_student_value }}</pre> -->

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
                      <div class="font-bold my-5 text-lg">
                        {{ $t("all students") }}
                      </div>
                    </v-col>
                  </v-row>
                  <div
                    align="center"
                    style="color: #ff6b81; font-size: xx-large"
                    class="font-bold text-lg"
                  >
                    {{ get_student_value.countStudents }}
                  </div>
                  <v-col align="center">
                    <div class="my-3">{{ $t("person") }}</div>
                  </v-col>
                </v-card>
              </v-col>
              <!-- ผู้เรียนปัจจุบัน -->
              <v-col cols="6" sm="3">
                <v-card class="rounded-lg">
                  <v-row dense>
                    <v-col cols="12" align="center">
                      <div class="my-5 text-lg">
                        {{ $t("current students") }}
                      </div>
                    </v-col>
                  </v-row>
                  <div
                    align="center"
                    style="color: #1876d1; font-size: xx-large"
                    class="font-bold text-lg"
                  >
                    {{ get_student_value.currentStudent?.countStudentCurrent }}
                  </div>
                  <v-col align="center">
                    <div class="my-3">{{ $t("person") }}</div>
                  </v-col>
                </v-card>
              </v-col>
              <!-- ผู้เรียนที่ใกล้จบ -->
              <v-col cols="6" sm="3">
                <v-card class="rounded-lg">
                  <v-row dense>
                    <v-col cols="12" align="center">
                      <div class="my-5 text-lg">
                        {{ $t("graduating students") }}
                      </div>
                    </v-col>
                  </v-row>
                  <div
                    align="center"
                    style="color: #1876d1; font-size: xx-large"
                    class="font-bold text-lg"
                  >
                    {{
                      get_student_value.potencialsStudent
                        ?.countStudentPotencials
                    }}
                  </div>
                  <v-col align="center">
                    <div class="my-3">{{ $t("person") }}</div>
                  </v-col>
                </v-card>
              </v-col>
              <!-- ผู้เรียนจองคอร์ส -->
              <v-col cols="6" sm="3">
                <v-card class="rounded-lg">
                  <v-row dense>
                    <v-col cols="12" align="center">
                      <div class="my-5 text-lg">
                        {{ $t("students reserve a course") }}
                      </div>
                    </v-col>
                  </v-row>
                  <div
                    align="center"
                    style="color: #1876d1; font-size: xx-large"
                    class="font-bold text-lg"
                  >
                    {{ get_student_value.countReserve?.countStudent }}
                  </div>
                  <v-col align="center">
                    <div class="my-3">{{ $t("person") }}</div>
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
                    <div class="font-bold my-5 text-lg">{{ $t("course") }}</div>
                  </v-col>
                  <!-- คอร์สเรียน -->
                  <v-col cols="12" align="center">
                    <div
                      class="font-bold text-lg"
                      style="color: #ff6b81; font-size: 30px"
                    >
                      {{
                        get_course_type.allCourse?.generalCourse
                          ? get_course_type.allCourse?.generalCourse
                          : "0"
                      }}
                    </div>
                  </v-col>
                  <v-col align="center">
                    <div class="my-5">{{ $t("courses") }}</div>
                  </v-col>
                </v-row>
              </v-col>
              <!-- คอร์สทั่วไป -->
              <v-col cols="6" sm="6">
                <v-row dense>
                  <v-col cols="12" align="center">
                    <div class="font-medium my-5 text-lg">
                      {{ $t("general course") }}
                    </div>
                    <div
                      class="font-bold text-lg"
                      style="color: #1876d1; font-size: xx-large"
                    >
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
                    <div class="font-medium my-2 text-lg">
                      {{ $t("short course") }}
                    </div>
                    <div
                      class="font-bold text-lg"
                      style="color: #1876d1; font-size: xx-large"
                    >
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
              <v-row dense>
                <v-col cols="6" align="end">
                  <div class="mt-5 ml-2">
                    <v-icon color="#ff6b81">mdi-account</v-icon>
                  </div>
                </v-col>
                <v-col cols="6" align="start">
                  <div class="font-bold my-5 text-lg">{{ $t("coach") }}</div>
                </v-col>
              </v-row>
              <v-card-text
                align="center"
                style="color: #ff6b81; font-size: 30px; font-weight: 900"
              >
                {{ get_student_value.countCoaches }}
              </v-card-text>
              <v-card-text align="center"> {{ $t("person") }} </v-card-text>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <!-- BOTTOM CARD -->
      <v-card style="background-color: #ffdde2" class="my-5 rounded-lg">
        <v-row dense class="pa-2">
          <!-- รายได้ GRAF -->
          <v-col cols="12" md="12" lg="6">
            <v-card style="background-color: #ffffff" class="rounded-lg">
              <v-card-title>
                <v-row dense>
                  <v-col
                    cols="12"
                    style="color: #ff6b81; font-weight: bold; margin-top: 8px"
                  >
                    <v-icon color="#ff6b81" class="mb-1"
                      >mdi-currency-thb</v-icon
                    >
                    {{ $t("income") }}
                  </v-col>

                  <!-- Year -->
                  <v-col cols="6">
                    <v-select
                      v-model="selected_years"
                      :items="filter_years"
                      item-value="usYears"
                      :item-text="
                        $i18n.locale == 'th' ? 'thaiYears' : 'usYears'
                      "
                      return-object
                      dense
                      outlined
                      @input="selectYears()"
                      color="#ff6b81"
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ $t("no data found") }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                  <!-- Month -->
                  <v-col cols="6">
                    <v-select
                      v-model="selected_mounth"
                      :items="thaiMonths"
                      :item-text="$i18n.locale == 'th' ? 'name' : 'nameEn'"
                      return-object
                      dense
                      outlined
                      @input="selectMunth()"
                      color="#ff6b81"
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ $t("no data found") }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>

                      <!-- <template v-slot:selected="{ item }">
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ $i18n.locale == "th" ? item.name : item.nameEn }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </template> -->
                    </v-select>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-title>
                <v-row dense>
                  <div class="font-bold">
                    {{
                      get_graf.sumSuccess
                        ? get_graf.sumSuccess
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : "0"
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
                    style="color: #ff6b81; font-weight: bold; margin-top: 8px"
                  >
                    <v-icon color="#ff6b81" class="mb-2"
                      >mdi-elevation-rise</v-icon
                    >
                    {{ $t("income proportion") }}
                  </v-col>
                  <!-- YEAR -->
                  <v-col cols="6">
                    <v-select
                      v-model="donut_years"
                      :items="filter_years"
                      item-value="usYears"
                      :item-text="
                        $i18n.locale == 'th' ? 'thaiYears' : 'usYears'
                      "
                      dense
                      outlined
                      @input="selectDonutYears()"
                      color="#ff6b81"
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ $t("no data found") }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <!-- <template v-slot:selected="{ item }">
                        <v-list-item-content>
                          <v-list-item-title>
                            {{
                              $i18n.locale == "th"
                                ? item.thaiYears
                                : item.usYears
                            }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </template> -->
                    </v-select>
                  </v-col>
                  <!-- MONTH -->
                  <v-col cols="6">
                    <v-select
                      v-model="donut_mounth"
                      :items="thaiMonths"
                      :item-text="$i18n.locale == 'th' ? 'name' : 'nameEn'"
                      return-object
                      dense
                      outlined
                      @input="selectDonutMounth()"
                      color="#ff6b81"
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ $t("no data found") }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-row dense>
                <!-- DOnut -->
                <v-col cols="12" sm="12" md="12" lg="12" align="center">
                  <apexchart
                    type="donut"
                    :options="donutOptions"
                    :series="get_series_chart"
                    :width="widthDonut()"
                  ></apexchart>
                </v-col>
                <!-- Dot Data -->
                <v-col cols="12" sm="12" md="12" lg="12" align="start">
                  <v-row dense class="my-2">
                    <!-- ชำระแล้ว -->
                    <v-col cols="12" sm="6" lg="12" align="center">
                      <div class="mr-8">
                        <v-icon color="#ff6b81">mdi-circle-medium</v-icon>
                        <span class="text-xl">
                          {{ $t("paid") }}
                          <span
                            style="color: #ff6b81"
                            class="font-bold text-xl"
                          >
                            {{
                              get_donut?.sumTotalSuccess?.toLocaleString()
                                ? get_donut?.sumTotalSuccess?.toLocaleString()
                                : "0"
                            }}
                          </span>
                          <span
                            style="
                              font-weight: normal;
                              color: #999999;
                              font-size: small;
                            "
                          >
                            {{ $t("baht") }}
                            ({{ genPersentSucces() }}%)
                          </span>
                        </span>
                      </div>
                    </v-col>
                    <!-- รอดำเนินการ -->

                    <v-col cols="12" sm="6" lg="12" align="center">
                      <div>
                        <v-icon color="#999999">mdi-circle-medium</v-icon>
                        <span class="text-xl">
                          {{ $t("pending") }}
                          <span
                            style="color: #999999"
                            class="font-bold text-xl"
                          >
                            {{
                              get_donut?.sumTotalPending?.toLocaleString()
                                ? get_donut?.sumTotalPending?.toLocaleString()
                                : "0"
                            }}</span
                          >
                          <span
                            style="
                              font-weight: normal;
                              color: #999999;
                              font-size: small;
                            "
                          >
                            {{ $t("baht") }} ({{ genPersentPending() }}%)
                          </span>
                        </span>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-row dense>
          <v-card-title>
            <v-img
              src="@/assets/navbar/barCourse.svg"
              style="max-width: 25px; margin-left: 30px"
            ></v-img>
            <span class="indent-5">{{ $t("course status") }}</span>
          </v-card-title>
        </v-row>

        <v-row dense class="pa-2">
          <v-col cols="12">
            <v-card class="bg-white rounded-lg" style="height: 100%">
              <!-- PIE CHART-->
              <v-col cols="12" align="center">
                <apexchart
                  style="width: 100%; height: 100%"
                  type="pie"
                  :options="pieChartOptions"
                  :series="pieSeries"
                  :width="widthPie()"
                ></apexchart>
              </v-col>
              <v-col cols="12" align="start">
                <v-row dense class="my-2 pa-2">
                  <!-- PIE DOT DATA -->

                  <v-row>
                    <!-- คอร์สเต็ม -->
                    <v-col cols="12" sm="6">
                      <!-- คอร์สเต็ม -->
                      <v-row>
                        <v-col cols="12" align="center">
                          <div>
                            <v-icon color="#999999">mdi-circle-medium</v-icon>
                            <span class="text-xl">
                              {{ $t("full courses") }}
                              <span style="font-weight: bold; color: #999999">{{
                                get_empty_course?.countClose
                                  ? get_empty_course?.countClose
                                  : "0"
                              }}</span>
                              {{ $t("courses") }}
                            </span>
                          </div>
                        </v-col>
                      </v-row>

                      <!-- search คอร์สเต็ม -->
                      <v-row>
                        <v-col cols="12" align="center">
                          <v-text-field
                            v-model="search_course_close"
                            :class="`bg-white rounded-full ${
                              !MobileSize ? 'w-3/5' : 'w-full'
                            } `"
                            hide-details
                            dense
                            outlined
                            :label="$t('search full course name here')"
                            prepend-inner-icon="mdi-magnify"
                            color="#ff6b81"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <!-- COURSE CLOSE -->
                      <v-col cols="12" class="my-2" :width="pieCardWidth()">
                        <v-card
                          outlined
                          style="overflow-y: scroll; overflow-x: hidden"
                          height="400px"
                          class="rounded-lg"
                        >
                          <v-card-text
                            style="
                              background-color: #ffdde2;
                              position: sticky;
                              top: 0;
                              z-index: 1;
                            "
                            align="center"
                            class="rounded-t-lg"
                          >
                            <span class="mr-2 font-bold">
                              {{ $t("full courses") }}
                            </span>
                            <v-badge
                              color="#999999"
                              :content="
                                get_empty_course?.countClose
                                  ? get_empty_course?.countClose
                                  : '0'
                              "
                              class="indent-5 font-bold"
                            >
                            </v-badge>
                          </v-card-text>

                          <v-card-text>
                            <v-card
                              outlined
                              class="mb-3 rounded-lg"
                              v-for="(item, index) in searchCourseClose(
                                search_course_close
                              )"
                              :key="index"
                            >
                              <v-card-text class="pa-0">
                                <v-row dense>
                                  <v-col cols="12">
                                    <v-card-title class="font-bold">
                                      <!-- {{ item.courseNameTh }} -->
                                      {{
                                        `${
                                          $i18n.locale == "th"
                                            ? item.courseNameTh
                                            : item.courseNameEn
                                        }`
                                      }}
                                    </v-card-title>
                                  </v-col>
                                  <v-col cols="12" sm="12" md="8">
                                    <v-card-subtitle class="mt-n7">
                                      {{
                                        `${
                                          $i18n.locale == "th"
                                            ? item.courseTypeNameTh
                                            : item.courseTypeNameEn
                                        }`
                                      }}
                                      <span
                                        v-if="
                                          item.courseTypeNameTh == 'คอร์สทั่วไป'
                                        "
                                        >({{ item.packageName }})</span
                                      >
                                      <span
                                        v-if="
                                          item.courseTypeNameTh ==
                                          'คอร์สระยะสั้น'
                                        "
                                      ></span>
                                    </v-card-subtitle>
                                  </v-col>
                                  <v-col cols="12" sm="12" md="4" align="start">
                                    <v-card-subtitle class="mt-n8">
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
                                  <v-col cols="12" sm="5">
                                    <v-card-subtitle class="mt-n6">
                                      <v-icon color="#ff6b81" class="mt-n2">
                                        mdi-sofa-single-outline
                                      </v-icon>
                                      {{ $t("seat") }}
                                      {{
                                        ` ${item.currentStudent}/${item.maximumStudent}`
                                      }}
                                    </v-card-subtitle>
                                  </v-col>
                                  <!-- v-if="item.courseTypeNameTh == 'คอร์สทั่วไป'" -->
                                  <v-col cols="12" sm="7" align="center">
                                    <v-card-subtitle class="mt-n8">
                                      <div>
                                        <v-btn
                                          text
                                          color="#FF6B81"
                                          @click="dialogDetail(item)"
                                        >
                                          <v-icon
                                            >mdi-text-box-search-outline</v-icon
                                          >
                                          {{ $t("view details") }}
                                        </v-btn>
                                      </div>
                                    </v-card-subtitle>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-card-text>
                          <!-- ไม่พบข้อมูลของคอร์สนี้ -->
                          <v-row
                            v-if="
                              searchCourseClose(search_course_close).length ===
                              0
                            "
                          >
                            <v-col align="center" class="text-lg font-bold">
                              <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                              {{ $t("can't find full course information") }}
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-col>
                    </v-col>

                    <!-- คอร์สว่าง -->
                    <v-col cols="12" sm="6">
                      <!-- คอร์สว่าง -->
                      <v-row>
                        <v-col cols="12" align="center">
                          <div>
                            <v-icon color="#ff6b81">mdi-circle-medium</v-icon>
                            <span class="text-xl">
                              {{ $t("course available") }}
                              <span style="font-weight: bold; color: #ff6b81">{{
                                get_empty_course?.countOpen
                                  ? get_empty_course?.countOpen
                                  : "0"
                              }}</span>
                              {{ $t("courses") }}
                            </span>
                          </div>
                        </v-col>
                      </v-row>

                      <!-- search คอร์สว่าง -->
                      <v-row>
                        <v-col cols="12" align="center">
                          <v-text-field
                            v-model="search_course_open"
                            :class="`bg-white
                    rounded-full ${!MobileSize ? 'w-3/5' : 'w-full'} `"
                            hide-details
                            dense
                            outlined
                            :label="$t('search available course name here')"
                            prepend-inner-icon="mdi-magnify"
                            color="#ff6b81"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <!-- COURSE OPEN -->
                      <v-col cols="12" class="my-2" :width="pieCardWidth()">
                        <v-card
                          outlined
                          style="overflow-y: scroll; overflow-x: hidden"
                          height="400px"
                          class="rounded-lg"
                        >
                          <v-card-text
                            style="
                              background-color: #ffdde2;
                              position: sticky;
                              top: 0;
                              z-index: 1;
                            "
                            align="center"
                            class="rounded-t-lg"
                          >
                            <span class="mr-2 font-bold">
                              {{ $t("course available") }}
                            </span>
                            <v-badge
                              color="#ff6b81"
                              :content="
                                get_empty_course.countOpen
                                  ? get_empty_course.countOpen
                                  : '0'
                              "
                              class="indent-5 font-bold justify-center"
                            >
                            </v-badge>
                          </v-card-text>

                          <v-card-text>
                            <v-card
                              outlined
                              class="mb-3 rounded-lg"
                              v-for="(item, index) in searchCourseOpen(
                                search_course_open
                              )"
                              :key="index"
                            >
                              <v-card-text class="pa-0">
                                <v-row dense>
                                  <v-col cols="12">
                                    <v-card-title class="font-bold">
                                      {{
                                        $i18n.locale == "th"
                                          ? item.courseNameTh
                                          : item.courseNameEn
                                      }}</v-card-title
                                    >
                                  </v-col>
                                  <v-col cols="12" sm="12" md="8" lg="8">
                                    <v-card-subtitle class="mt-n7">
                                      {{
                                        `${
                                          $i18n.locale == "th"
                                            ? item.courseTypeNameTh
                                            : item.courseTypeNameEn
                                        }`
                                      }}
                                      <span
                                        v-if="
                                          item.courseTypeNameTh == 'คอร์สทั่วไป'
                                        "
                                        >({{ item.packageName }})</span
                                      >
                                      <span
                                        v-if="
                                          item.courseTypeNameTh ==
                                          'คอร์สระยะสั้น'
                                        "
                                      ></span>
                                    </v-card-subtitle>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="12"
                                    md="4"
                                    lg="4"
                                    align="start"
                                  >
                                    <v-card-subtitle class="mt-n8">
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

                                  <v-col cols="12" sm="5">
                                    <v-card-subtitle class="mt-n6">
                                      <v-icon color="#ff6b81" class="mt-n2">
                                        mdi-sofa-single-outline
                                      </v-icon>
                                      {{ $t("seat") }}
                                      {{
                                        ` ${item.currentStudent}/${item.maximumStudent}`
                                      }}
                                    </v-card-subtitle>
                                  </v-col>
                                  <!-- v-if="item.courseTypeNameTh == 'คอร์สทั่วไป'" -->
                                  <v-col cols="12" sm="7" align="center">
                                    <v-card-subtitle class="mt-n8">
                                      <div>
                                        <v-btn
                                          text
                                          color="#FF6B81"
                                          @click="dialogDetail(item)"
                                        >
                                          <v-icon
                                            >mdi-text-box-search-outline</v-icon
                                          >
                                          {{ $t("view details") }}
                                        </v-btn>
                                      </div>
                                    </v-card-subtitle>
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-card-text>

                          <!-- ไม่พบข้อมูลของคอร์สนี้ -->
                          <v-row
                            v-if="
                              searchCourseOpen(search_course_open).length === 0
                            "
                          >
                            <v-col align="center" class="text-lg font-bold">
                              <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                              {{
                                $t("can't find available course information")
                              }}
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-col>
                    </v-col>
                  </v-row>

                  <!-- DIALOG COURSES -->
                  <v-dialog
                    v-model="dialog_course"
                    persistent
                    max-width="600px"
                  >
                    <v-card>
                      <v-container>
                        <v-card-title>
                          <v-row dense>
                            <v-col
                              cols="12"
                              class="absolute right-0 top-0"
                              align="end"
                            >
                              <v-btn icon @click="dialog_course = false">
                                <v-icon color="#ff6b81">mdi-close</v-icon>
                              </v-btn>
                            </v-col>
                            <v-col
                              cols="12"
                              align="center"
                              class="font-weight-bold"
                            >
                              {{
                                items_dialog.status == "Close"
                                  ? this.$t("full course information")
                                  : this.$t("available course information")
                              }}
                            </v-col>
                          </v-row>
                        </v-card-title>
                        <!-- row 1 -->
                        <v-card-text>
                          <v-row dense>
                            <v-col cols="12">
                              <v-text-field
                                hide-details
                                outlined
                                readonly
                                dense
                                :value="
                                  this.$i18n.locale == 'th'
                                    ? items_dialog.courseNameTh
                                      ? items_dialog.courseNameTh
                                      : '-'
                                    : items_dialog.courseNameEn
                                    ? items_dialog.courseNameEn
                                    : '-'
                                "
                                :label="$t('course name')"
                                color="#FF6B81"
                              >
                                <template v-slot:append>
                                  <v-icon :color="'#FF6B81'"
                                    >mdi-school-outline</v-icon
                                  >
                                </template>
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <!-- row 2 -->
                        <v-card-text>
                          <v-row dense>
                            <v-col cols="12">
                              <v-text-field
                                hide-details
                                outlined
                                readonly
                                dense
                                :value="`${
                                  this.$i18n.locale == 'th'
                                    ? items_dialog.courseTypeNameTh
                                      ? items_dialog.courseTypeNameTh
                                      : '-'
                                    : items_dialog.courseTypeNameEn
                                    ? items_dialog.courseTypeNameEn
                                    : '-'
                                } ${
                                  items_dialog.packageName
                                    ? `(${items_dialog.packageName})`
                                    : ''
                                }`"
                                :label="$t('package')"
                                color="#FF6B81"
                              >
                                <template v-slot:append>
                                  <v-icon :color="'#FF6B81'">
                                    mdi-book-multiple-outline
                                  </v-icon>
                                </template>
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <!-- row 3 -->
                        <v-card-text>
                          <v-row dense>
                            <v-col cols="12">
                              <v-text-field
                                hide-details
                                outlined
                                readonly
                                dense
                                :value="items_dialog.dayOfWeek"
                                :label="$t('study date')"
                                color="#FF6B81"
                              >
                                <template v-slot:append>
                                  <v-icon :color="'#FF6B81'"
                                    >mdi-calendar</v-icon
                                  >
                                </template>
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <!-- row 4 -->
                        <v-card-text>
                          <v-row dense>
                            <v-col cols="12">
                              <v-text-field
                                hide-details
                                outlined
                                readonly
                                dense
                                :value="`${
                                  this.$i18n.locale == 'th'
                                    ? items_dialog.firstNameTh
                                      ? items_dialog.firstNameTh
                                      : '-'
                                    : items_dialog.firstNameEn
                                    ? items_dialog.firstNameEn
                                    : '-'
                                }  ${
                                  this.$i18n.locale == 'th'
                                    ? items_dialog.lastNameTh
                                      ? items_dialog.lastNameTh
                                      : '-'
                                    : items_dialog.lastNameEn
                                    ? items_dialog.lastNameEn
                                    : '-'
                                }`"
                                :label="$t('first name - last name coach')"
                                color="#FF6B81"
                              >
                                <template v-slot:append>
                                  <v-icon :color="'#FF6B81'"
                                    >mdi-account-outline</v-icon
                                  >
                                </template>
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <!-- row 5 -->
                        <v-card-text>
                          <v-row dense>
                            <v-col cols="12" sm="6">
                              <v-text-field
                                hide-details
                                outlined
                                readonly
                                dense
                                :value="items_dialog.time"
                                :label="$t('class time')"
                                color="#FF6B81"
                              >
                                <template v-slot:append>
                                  <v-icon :color="'#FF6B81'"
                                    >mdi-clock-outline</v-icon
                                  >
                                </template>
                              </v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6">
                              <v-text-field
                                hide-details
                                outlined
                                readonly
                                dense
                                :value="`${
                                  items_dialog.currentStudent
                                    ? items_dialog.currentStudent
                                    : '0'
                                } / ${
                                  items_dialog.maximumStudent
                                    ? items_dialog.maximumStudent
                                    : '0'
                                }`"
                                :label="$t('seat')"
                                color="#FF6B81"
                              >
                                <template v-slot:append>
                                  <v-icon :color="'#FF6B81'"
                                    >mdi-sofa-single-outline</v-icon
                                  >
                                </template>
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-container>
                    </v-card>
                  </v-dialog>
                </v-row>
              </v-col>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import headerPage from "@/components/header/headerPage.vue";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";

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

    selected_mounth: "",
    donut_mounth: "",
    selected_years: "",
    donut_years: "",
    dashboard_graf: {
      year: "",
      month: "",
    },
    thai_day_name: [],
    mapMonth: "",
    totalPrice: [],
    dialog_course: false,
    items_dialog: "",
    day: "จันทร์",
    time: "13.00:15.00",
    search_course_close: "",
    search_course_open: "",
    sumTotal: "",
  }),
  created() {
    this.FilterYears().then(() => {
      if (this.filter_years.length > 0) {
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
  async mounted() {
    this.selected_mounth = this.mapMonth;
    this.donut_mounth = this.mapMonth;
    // await this.GetEmptyCourse();
    await this.GetStudentValue();
    // await this.GetCourseType();
    // await this.GetPotential();
  },
  methods: {
    ...mapActions({
      GetEmptyCourse: "DashboardModules/GetEmptyCourse",
      GetCourseType: "DashboardModules/GetCourseType",
      // GetPotential: "DashboardModules/GetPotential",
      GetDonut: "DashboardModules/GetDonut",
      GetGraf: "DashboardModules/GetGraf",
      FilterYears: "DashboardModules/FilterYears",
      GetStudentValue: "DashboardModules/GetStudentValue",
    }),

    genPersentSucces() {
      console.log(
        this.get_donut.sumTotalSuccess,
        this.get_donut.sumTotalPending
      );

      let persent =
        parseFloat(this.get_donut.sumTotalSuccess) /
        (parseFloat(this.get_donut.sumTotalPending) +
          parseFloat(this.get_donut.sumTotalSuccess))
          ? parseFloat(this.get_donut.sumTotalSuccess) /
            (parseFloat(this.get_donut.sumTotalPending) +
              parseFloat(this.get_donut.sumTotalSuccess))
          : 0;
      persent = persent * 100;
      return persent.toFixed(2);
    },

    genPersentPending() {
      let persent =
        parseFloat(this.get_donut.sumTotalPending) /
        (parseFloat(this.get_donut.sumTotalPending) +
          parseFloat(this.get_donut.sumTotalSuccess))
          ? parseFloat(this.get_donut.sumTotalPending) /
            (parseFloat(this.get_donut.sumTotalPending) +
              parseFloat(this.get_donut.sumTotalSuccess))
          : 0;
      persent = persent * 100;
      return persent.toFixed(2);
    },
    selectYears() {
      this.GetGraf(this.dashboard_graf);
    },

    selectMunth() {
      this.dashboard_graf.month = this.selected_mounth.key;
      this.GetGraf(this.dashboard_graf);
    },

    selectDonutYears() {
      this.GetDonut(this.dashboard_graf);
    },

    selectDonutMounth() {
      this.dashboard_graf.month = this.donut_mounth.key;
      this.GetDonut(this.dashboard_graf);
    },

    heightGraf() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 350;
        case "sm":
          return 300;
        case "md":
          return 250;
      }
    },
    widthDonut() {
      switch (this.$vuetify.breakpoint.name) {
        case "sm":
          return 480;
        case "md":
          return 460;
        case "lg":
          return 390;
      }
    },
    widthPie() {
      switch (this.$vuetify.breakpoint.name) {
        case "sm":
          return 400;
        case "md":
          return 350;
        case "lg":
          return 380;
      }
    },

    pieCardWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "md":
          return 400;
        case "lg":
          return 380;
      }
    },

    customTooltip(series, seriesIndex, w) {
      // let waiting for payment = ''
      // let
      let item = w.globals;
      let color = item.colors[seriesIndex];
      return this.get_donut?.datas[seriesIndex]
        ? `
        <div class="pa-3 ml-auto" style='background-color: ${color}'>
          <h3 class="font-weight-bold">${item.seriesNames[seriesIndex]}</h3>
          <i class="mdi mdi-circle " style="font-size:10px; color: #8cd977"></i> <span class="font-weight-bold">
            ${this.$t("paid")} :</span> ${
            this.get_donut?.datas[seriesIndex].stringSumSuccess
          } ${this.$t("baht")}<br/>
        <i class="mdi mdi-circle " style="font-size:10px; color: #fcc419"></i> <span class="font-weight-bold">${this.$t(
          "pending"
        )} : </span>${
            this.get_donut?.datas[seriesIndex].stringSumPending
          } ${this.$t("baht")}<br/>
          <span class="font-weight-bold">${this.$t("total")} : </span>${
            this.get_donut?.datas[seriesIndex].stringTotal
          } ${this.$t("baht")}
        </div>
      `
        : `
        <div class="pa-3 ml-auto" style='background-color: ${color}'>
          <h3 class="font-weight-bold">${item.seriesNames[seriesIndex]}</h3>
          <i class="mdi mdi-circle " style="font-size:10px; color: #8cd977"></i> <span class="font-weight-bold"> ${this.$t(
            "paid"
          )} : </span>${this.get_donut?.otherTotal.sumSuccess
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${this.$t("baht")}<br/>
          <i class="mdi mdi-circle " style="font-size:10px; color: #fcc419"></i> <span class="font-weight-bold">${this.$t(
            "pending"
          )} : </span>${this.get_donut?.otherTotal.sumPending
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${this.$t("baht")}<br/>
          <span class="font-weight-bold">${this.$t("total")} : </span>${series[
            seriesIndex
          ]
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${this.$t("baht")}
        </div>
        `;
    },
    dialogDetail(item) {
      this.items_dialog = item;
      this.dialog_course = true;
    },

    searchCourseClose(val) {
      if (val) {
        return this.get_empty_course_close.filter(
          (v) =>
            v.courseNameTh.indexOf(val) !== -1 ||
            v.courseNameEn.indexOf(val) !== -1
        );
      } else {
        return this.get_empty_course_close;
      }
    },
    searchCourseOpen(val) {
      if (val) {
        return this.get_empty_course_open.filter(
          (v) =>
            v.courseNameTh.indexOf(val) !== -1 ||
            v.courseNameEn.indexOf(val) !== -1
        );
      } else {
        return this.get_empty_course_open;
      }
    },
  },
  computed: {
    ...mapGetters({
      get_empty_course: "DashboardModules/getEmptyCourse",
      get_empty_course_open: "DashboardModules/getEmptyCourseOpen",
      get_empty_course_close: "DashboardModules/getEmptyCourseClose",
      get_course_type: "DashboardModules/getCourseType",
      // get_potential: "DashboardModules/getPotential",
      get_donut: "DashboardModules/getDonut",
      get_graf: "DashboardModules/getGraf",
      dashboard_loading: "DashboardModules/getloading",
      filter_years: "DashboardModules/getFilterYears",
      get_series_chart: "DashboardModules/getSeriesChart",
      get_labels_chart: "DashboardModules/getLabelsChart",
      get_series_line_chart: "DashboardModules/getSeriesLineChart",
      get_labels_line_chart: "DashboardModules/getLabelsLineChart",
      get_labels_line_chart_month: "DashboardModules/getLabelsLineChartMonth",
      labels_chart_en: "DashboardModules/getLabelsChartEn",
      get_student_value: "DashboardModules/getStudentValue",
    }),
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    thaiMonths() {
      return [
        { name: "ทั้งปี", nameEn: "all year", key: "", type: "month" },
        { name: "มกราคม", nameEn: "January", key: "01", type: "month" },
        { name: "กุมภาพันธ์", nameEn: "February", key: "02", type: "month" },
        { name: "มีนาคม", nameEn: "March", key: "03", type: "month" },
        { name: "เมษายน", nameEn: "April", key: "04", type: "month" },
        { name: "พฤษภาคม", nameEn: "May", key: "05", type: "month" },
        { name: "มิถุนายน", nameEn: "June", key: "06", type: "month" },
        { name: "กรกฎาคม", nameEn: "July", key: "07", type: "month" },
        { name: "สิงหาคม", nameEn: "August", key: "08", type: "month" },
        { name: "กันยายน", nameEn: "September", key: "09", type: "month" },
        { name: "ตุลาคม", nameEn: "October", key: "10", type: "month" },
        { name: "พฤศจิกายน", nameEn: "November", key: "11", type: "month" },
        { name: "ธันวาคม", nameEn: "December", key: "12", type: "month" },
      ];
    },
    chartOptions() {
      let income = "";
      let baht = "";
      if (this.$i18n.locale == "th") {
        income = "รายได้";
        baht = "บาท";
      } else {
        income = "Income";
        baht = "Bath";
      }
      let labels = [];
      if (this.get_graf.length !== 0) {
        if (this.get_graf.type == "month") {
          labels = this.get_labels_line_chart;
        } else if (this.get_graf.type == "year") {
          labels = this.get_labels_line_chart_month;
        }
      }
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
          text: this.$t("income"),
          align: "left",
        },

        grid: {},
        xaxis: {
          categories: labels,
        },
        tooltip: {
          custom: function ({ series, seriesIndex, dataPointIndex }) {
            return (
              '<div class="pa-2 font-bold" style="font-size:15px; color: #000000">' +
              "<span>" +
              '<i class="mdi mdi-circle " style="font-size:10px; color: #ff6b81"></i>' +
              " " +
              income +
              " " +
              series[seriesIndex][dataPointIndex]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
              "</span>" +
              " " +
              baht +
              "</div>"
            );
          },
        },
      };

      return lineChartOptions;
    },
    chartSeries() {
      const lineChart = [
        {
          data: this.get_series_line_chart,
        },
      ];

      return lineChart;
    },

    donutOptions() {
      const donutdata = {
        colors: [
          "#ff6b81",
          "#ff7588",
          "#ff7e90",
          "#ff8898",
          "#ff929f",
          "#ff9ca6",
          "#ffa5ae",
          "#ffafb6",
          "#ffb9bd",
          "#ffc2c4",
          "#999999",
        ],
        labels:
          this.$i18n.locale == "th"
            ? this.get_labels_chart
            : this.labels_chart_en,
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
                name: {
                  show: true,
                  fontSize: "18px",
                  color: "#ff6b81",
                },
                value: {
                  show: true,
                  fontSize: "18px",
                  color: "#373d3f",
                  offsetY: 16,
                  formatter: function (val) {
                    return parseFloat(val).toLocaleString();
                  },
                },
                total: {
                  show: true,
                  label: this.$t("total"),
                  color: "#373d3f",
                  fontSize: "18px",
                  formatter: function (w) {
                    let sumTotal = 0;
                    for (let items of w.globals.seriesTotals) {
                      sumTotal = sumTotal + items;
                      // console.log("sumTotal :>> ", sumTotal);
                      items = items.toLocaleString();
                    }
                    return sumTotal.toLocaleString();
                  },
                },
              },
            },
            dataLabels: {
              enabled: true,
              minAngleToShowLabel: 5,
            },
          },
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
              return val.toLocaleString();
            },
          },
          custom: ({ series, seriesIndex, w }) => {
            return this.customTooltip(series, seriesIndex, w);
          },
        },
      };
      return donutdata;
    },

    pieSeries() {
      let Open = !this.get_empty_course.countOpen
        ? 0
        : this.get_empty_course.countOpen;
      let Close = !this.get_empty_course.countClose
        ? 0
        : this.get_empty_course.countClose;
      const pieData = [Open, Close];
      return pieData;
    },
    pieChartOptions() {
      const pieChartOptions = {
        colors: ["#ff6b81", "#999999"],
        chart: {
          type: "pie",
        },
        dataLabels: {
          enabled: true,
        },
        labels: [this.$t("course available"), this.$t("full courses")],
        legend: {
          show: false,
        },
      };
      return pieChartOptions;
    },
    course_close_options() {
      return [
        {
          label: this.$t("full courses"),
          value: "Close",
          color: "#999999",
        },
        {
          label: this.$t("course available"),
          value: "Open",
          color: "#ff6b81",
        },
      ];
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
