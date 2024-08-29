<template>
  <v-app>
    <v-container>
      <v-form ref="course_form" v-model="validate_form">
        <headerPage :title="$t(`add a learner`)"></headerPage>
        <v-row dense>
          <v-col cols="12" sm>
            <label-custom :text="$t(`learner`)"></label-custom>
            <v-row dense>
              <v-col cols="12" sm="8">
                <v-autocomplete
                  dense
                  color="#FF6B81"
                  item-color="#ff6b81"
                  chips
                  deletable-chips
                  :loading="loading"
                  prepend-inner-icon="mdi-magnify"
                  :rules="rules.student"
                  v-model="students"
                  cache-items
                  :items="username_list"
                  :search-input.sync="search"
                  :placeholder="$t(`search/Please select a student`)"
                  :label="$t(`search`)"
                  item-text="fullname"
                  item-value="userOneId"
                  outlined
                  multiple
                  clearable
                  @input="search = null"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{
                          search
                            ? $t(`data not found`)
                            : $t(`please enter the student's name`)
                        }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      color="#FBF3F5"
                    >
                      {{
                        $i18n.locale == "th"
                          ? `${data.item.firstNameTh} ${data.item.lastNameTh}`
                          : `${data.item.firstNameEng} ${data.item.lastNameEng}`
                      }}
                      <v-icon
                        @click="remove(data.item.userOneId)"
                        color="#ff6b81"
                        >mdi-close-circle</v-icon
                      >
                    </v-chip>
                  </template>
                  <template v-slot:item="{ item }">
                    {{
                      $i18n.locale == "th"
                        ? `${item.firstNameTh} ${item.lastNameTh}`
                        : `${item.firstNameEng} ${item.lastNameEng}`
                    }}
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="auto">
                <label
                  class="primary--text cursor-pointer underline"
                  @click="changeDialogRegisterOneId(true)"
                  >{{ $t("sign up for One ID") }}</label
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-card
          outlined
          v-for="(course, course_index) in order.courses"
          class="mb-3"
          :key="course_index"
        >
          <v-row class="pa-2">
            <v-col align="right">
              <v-icon
                larg
                color="#FF6B81"
                @click="removeCourse(course_index)"
                v-if="order.courses?.length >= 2"
              >
                mdi-delete
              </v-icon>
            </v-col>
          </v-row>
          <v-card-text>
            <v-row>
              <!--  คอร์สทั่วไป btn -->
              <v-col cols="auto">
                <v-btn
                  outlined
                  @click="selectCourseType('CT_1', course)"
                  :color="
                    course.course_type_id === 'CT_1' ? '#ff6b81' : '#999999'
                  "
                  ><v-icon>
                    {{
                      course.course_type_id === "CT_1"
                        ? "mdi-radiobox-marked"
                        : "mdi-radiobox-blank"
                    }}</v-icon
                  >
                  {{ $t("general course") }}</v-btn
                >
              </v-col>
              <!-- คอร์สระยะสั้น btn -->
              <v-col>
                <v-btn
                  @click="selectCourseType('CT_2', course)"
                  outlined
                  :color="
                    course.course_type_id === 'CT_2' ? '#ff6b81' : '#999999'
                  "
                  ><v-icon>{{
                    course.course_type_id === "CT_2"
                      ? "mdi-radiobox-marked"
                      : "mdi-radiobox-blank"
                  }}</v-icon>
                  {{ $t("short course") }}</v-btn
                >
              </v-col>
            </v-row>
            <!-- คอร์สทั่วไป detail -->
            <v-row dense>
              <v-col cols="12" sm="4">
                <label-custom :text="$t(`wls`)"></label-custom>
                <v-autocomplete
                  dense
                  item-value="categoryId"
                  :item-text="
                    $i18n.locale == 'th' ? 'categoryNameTh' : 'categoryNameEng'
                  "
                  v-model="course.category_id"
                  :items="categorys"
                  :placeholder="$t(`select wls`)"
                  :rules="rules.category"
                  outlined
                  color="pink"
                  item-color="pink"
                  @change="
                    selectCategory($event, course.course_type_id, course)
                  "
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ $t("no data found") }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title
                        ><span
                          :class="
                            course.category_id === item.categoryId
                              ? 'font-bold'
                              : ''
                          "
                          >{{
                            $i18n.locale == "th"
                              ? item.categoryNameTh
                              : item.categoryNameEng
                          }}</span
                        ></v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon>{{
                        course.category_id === item.categoryId
                          ? "mdi-check-circle"
                          : "mdi-radiobox-blank"
                      }}</v-icon>
                    </v-list-item-action>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4">
                <label-custom :text="$t(`course`)"></label-custom>
                <!-- :items="openCourses(course.course_options)" -->
                <!-- :items="course.course_options" -->

                <v-autocomplete
                  dense
                  item-value="course_id"
                  :item-text="
                    $i18n.locale == 'th' ? 'course_name_th' : 'course_name_en'
                  "
                  v-model="course.course_id"
                  :items="course.course_options"
                  :rules="rules.course"
                  :placeholder="$t(`select course`)"
                  :loading="loading_course"
                  outlined
                  color="pink"
                  item-color="pink"
                  @change="selectCourse(course.course_id, course)"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ $t("no data found") }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title
                        ><span
                          :class="
                            course.course_id === item.course_id
                              ? 'font-bold'
                              : ''
                          "
                          >{{
                            $i18n.locale == "th"
                              ? item.course_name_th
                              : item.course_name_en
                          }}</span
                        ></v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon>
                        {{
                          course.course_id === item.course_id
                            ? "mdi-check-circle"
                            : "mdi-radiobox-blank"
                        }}</v-icon
                      >
                    </v-list-item-action>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row
              dense
              v-if="
                course.course_type_id == 'CT_1' && course.course_data && course
              "
            >
              <v-col cols="12" sm="4">
                <label-custom :text="$t('package')"></label-custom>
                <!-- <pre>{{ course.course_data }}</pre> -->
                <v-autocomplete
                  item-value="package_id"
                  item-text="package"
                  item-color="pink"
                  color="pink"
                  dense
                  :rules="rules.package"
                  v-model="course.package"
                  :items="course.course_data.packages"
                  :placeholder="$t('choose a package')"
                  outlined
                  @change="selectPackage(course)"
                >
                  <template v-slot:no-data>
                    <div class="mx-3 font-bold">
                      {{ $t("no data available") }}
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4" v-if="course.package">
                <label-custom :text="$t('periods')"></label-custom>
                <v-autocomplete
                  dense
                  outlined
                  :rules="rules.option"
                  v-model="course.option"
                  :items="
                    course.course_data.packages.filter(
                      (v) => v.package_id == course.package
                    )[0].options
                  "
                  :placeholder="$t('choose duration')"
                  @change="Calprice(course)"
                  item-color="white"
                  color="pink"
                >
                  <template v-slot:selection="data">
                    {{
                      `${
                        $i18n.locale == "th"
                          ? data.item.option_name
                          : data.item.option_name_en
                      }`
                    }}
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title class=""
                        ><span
                          :class="
                            course.option.option_id === item.option_id
                              ? 'font-bold text-[#ff6b81]'
                              : 'text-[#000]'
                          "
                          >{{
                            $i18n.locale == "th"
                              ? item.option_name
                              : item.option_name_en
                          }}</span
                        ></v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon
                        :color="
                          course.option.option_id === item.option_id
                            ? '#ff6b81'
                            : '#9999'
                        "
                      >
                        {{
                          course.option.option_id === item.option_id
                            ? "mdi-check-circle"
                            : "mdi-radiobox-blank"
                        }}</v-icon
                      >
                    </v-list-item-action>
                  </template>
                  <template v-slot:no-data>
                    <div class="mx-3 font-bold">
                      {{ $t("no data available") }}
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col v-if="course.option" cols="12" sm="2">
                <label-custom :text="$t('number of times')"></label-custom>
                <v-text-field
                  dense
                  disabled
                  :value="course.option.amount"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row
              dense
              v-if="
                course.course_type_id == 'CT_1' &&
                course.course_data &&
                course.course_id
              "
            >
              <v-col cols="12" sm="2" v-if="course.option.amount">
                <label-custom :text="$t('day')"></label-custom>
                <v-autocomplete
                  dense
                  :rules="rules.day"
                  v-model="course.day"
                  item-text="dayName"
                  item-value="dayName"
                  :items="course.course_data.days"
                  :placeholder="$t('pick a day')"
                  outlined
                  item-color="pink"
                  color="pink"
                >
                  <template v-slot:no-data>
                    <div class="mx-3 font-bold">
                      {{ $t("no data available") }}
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="3" v-if="course.day">
                <label-custom :text="$t('times')"></label-custom>
                <v-select
                  dense
                  :rules="rules.time"
                  v-model="course.time"
                  :items="
                    course.course_data.days.filter(
                      (v) => v.dayName === course.day
                    )[0].times
                  "
                  :placeholder="$t('choose a time')"
                  outlined
                  item-color="white"
                  @change="selectTime(course.time, course)"
                  color="#FF6B81"
                >
                  <template v-slot:selection="data">
                    {{ `${data.item.start}-${data.item.end} ${$t("o'clock")}` }}
                  </template>
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ $t("data not found") }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title
                        ><span
                          :class="
                            course.time === item
                              ? 'font-bold text-[#ff6b81]'
                              : 'text-[#000]'
                          "
                          >{{ item.start }}-{{ item.end }}
                          {{ $t("o'clock") }}</span
                        ></v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon
                        :color="course.time === item ? '#ff6b81' : '#999'"
                        >{{
                          course.time === item
                            ? "mdi-check-circle"
                            : "mdi-radiobox-blank"
                        }}</v-icon
                      >
                    </v-list-item-action>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12" sm="4" v-if="course.course_data && course.time">
                <label-custom :text="$t('coach')"></label-custom>
                <!-- :items="coachOptions(course.time.timeData)" -->

                <!-- <pre>{{ course.time }}</pre> -->
                <v-autocomplete
                  dense
                  :rules="rules.coach"
                  v-model="course.coach"
                  :items="course.time.timeData"
                  :placeholder="$t('choose a coach')"
                  item-color="pink"
                  outlined
                  color="pink"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        {{ $t("no data found") }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="data">
                    {{
                      `${
                        $i18n.locale == "th"
                          ? data.item.coach_name
                          : data.item.coach_name_en
                      }`
                    }}
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title
                        ><span
                          :class="
                            course.coach.courseCoachId === item.courseCoachId
                              ? 'font-bold  text-[#ff6b81]'
                              : ''
                          "
                          >{{
                            $i18n.locale == "th"
                              ? item.coach_name
                              : item.coach_name_en
                          }}</span
                        ></v-list-item-title
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon
                        :color="
                          course.coach.courseCoachId === item.courseCoachId
                            ? '#ff6b81'
                            : ''
                        "
                        >{{
                          course.coach.courseCoachId === item.courseCoachId
                            ? "mdi-check-circle"
                            : "mdi-radiobox-blank"
                        }}</v-icon
                      >
                    </v-list-item-action>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="3" v-if="course.coach">
                <label-custom :text="$t('start date')"></label-custom>
                <v-menu
                  v-model="course.menu_start_date"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      dense
                      outlined
                      :rules="rules.start_date"
                      v-model="course.start_date_str"
                      readonly
                      :placeholder="$t('start date')"
                      v-bind="attrs"
                      v-on="on"
                      color="#FF6B81"
                    >
                      <template v-slot:append>
                        <v-icon :color="course.start_date ? '#FF6B81' : ''"
                          >mdi-calendar</v-icon
                        >
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    :min="minStartDate(course.course_data.course_open_date)"
                    v-model="course.start_date"
                    @input="inputDate($event, 'course open', course)"
                    :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row
              dense
              v-if="course.course_type_id == 'CT_2' && course.course_id"
            >
              <v-col cols="12" sm="4" v-if="course.course_type_id == 'CT_2'">
                <label-custom :text="$t('date')"></label-custom>
                <v-text-field
                  v-if="course.course_id"
                  dense
                  disabled
                  outlined
                  :value="course.start_date_str"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <label-custom :text="$t('times')"></label-custom>
                <v-text-field
                  disabled
                  outlined
                  dense
                  :value="`${course.time_str}`"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <label-custom :text="$t('coach')"></label-custom>
                <v-text-field
                  dense
                  outlined
                  disabled
                  :value="
                    $i18n.locale == 'th'
                      ? course.coach.coach_name
                      : course.coach.coach_name_en
                  "
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <!-- PRICE -->
              <v-col cols="12" sm="4">
                <label-custom :text="$t(`price`)"></label-custom>
                <!-- :rules="rules.price" -->
                <!-- @change="CalTotalPrice()" -->
                <v-text-field
                  dense
                  v-model="course.price"
                  outlined
                  @keydown="Validation($event, 'number')"
                  type="number"
                  color="pink"
                  :suffix="$t(`baht`)"
                >
                </v-text-field>
              </v-col>
              <!-- discount -->
              <v-col cols="12" sm="4">
                <label-custom :text="$t(`discount`)"></label-custom>
                <!-- :rules="rules.price" -->

                <v-text-field
                  dense
                  :value="
                    course?.option?.discount_price
                      ? course?.option?.discount_price
                      : '0'
                  "
                  outlined
                  @keydown="Validation($event, 'number')"
                  type="number"
                  color="pink"
                  :suffix="$t(`baht`)"
                  disabled
                >
                </v-text-field>
              </v-col>
              <!-- หมายเหตุราคา -->
              <v-col cols="12">
                <label-custom :text="$t(`price note`)"></label-custom>
                <v-textarea
                  v-model="course.remark"
                  auto-grow
                  :rules="rules.remark"
                  outlined
                  color="#ff6b81"
                ></v-textarea>
              </v-col>
            </v-row>
            <!-- Discount Checkbox-->
            <v-row dense class="mt-[-8]">
              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="course.checkedDis"
                  :label="`${$t('there is a new discount')} (${$t('baht')})`"
                  color="#FF6B81"
                  @click="
                    checkBoxFunc(course_index, order.courses, course.checkedDis)
                  "
                  :disabled="course.checkedPercent"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="course.checkedPercent"
                  :label="`${$t('there is a new discount')} (${$t(
                    'percentage'
                  )})`"
                  color="#FF6B81"
                  @click="
                    checkBoxFunc(
                      course_index,
                      order.courses,
                      course.checkedPercent
                    )
                  "
                  :disabled="course.checkedDis"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-row class="mb-3">
          <v-col align="center">
            <v-btn outlined class="" color="#ff6b81" @click="addCourse"
              ><span class="mdi mdi-plus-circle-outline">{{
                $t("add a course")
              }}</span></v-btn
            >
          </v-col>
        </v-row>
        <template v-if="order.courses?.length > 0">
          <div class="text-lg font-bold">{{ $t("payment status") }}</div>
          <v-divider class="mb-3"></v-divider>
          <v-row dense class="mb-3">
            <v-col cols="12" sm="8">
              <v-card class="text-xl" color="#FBF3F5">
                <v-card-text>
                  <v-row>
                    <v-col class="text-lg font-bold"
                      >{{ $t("total price") }} :</v-col
                    >
                    <v-col
                      cols="auto"
                      class="text-lg font-bold text-pink-500"
                      >{{
                        (order.total_price * students?.length).toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2 }
                        )
                      }}</v-col
                    >
                    <v-col cols="auto" class="text-lg font-bold">{{
                      $t("baht")
                    }}</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="8">
              <v-card
                class="cursor-pointer mb-3"
                @click="order.payment_status = 'paid'"
              >
                <v-card-text>
                  <v-row dense class="d-flex align-start">
                    <v-col cols="auto" class="mr-2">
                      <v-icon
                        :color="
                          order.payment_status === 'paid' ? '#FF6B81' : ''
                        "
                        >{{
                          order.payment_status === "paid"
                            ? "mdi-radiobox-marked"
                            : "mdi-radiobox-blank"
                        }}</v-icon
                      ></v-col
                    >
                    <v-col class="ml-2">
                      <v-row>
                        <v-col cols="auto" class="pa-0">
                          <v-avatar>
                            <v-img
                              src="@/assets/create_student/check 1.png"
                              max-height="24"
                              max-width="24"
                            ></v-img>
                          </v-avatar>
                        </v-col>
                        <v-col> {{ $t("already paid") }} </v-col>
                      </v-row>
                      <v-row dense v-if="order.payment_status === 'paid'">
                        <v-col cols="auto">
                          <v-autocomplete
                            dense
                            :rules="
                              order.payment_status === 'paid'
                                ? rules.payment_type
                                : false
                            "
                            v-model="order.payment_type"
                            item-value="value"
                            item-text="label"
                            :items="transfer"
                            :placeholder="$t(`choose a payment method`)"
                            outlined
                            color="pink"
                            item-color="pink"
                          >
                            <template v-slot:no-data>
                              <v-list-item>
                                <v-list-item-title>
                                  {{ $t("no data found") }}
                                </v-list-item-title>
                              </v-list-item>
                            </template>
                            <template v-slot:item="{ item }">
                              <v-list-item-content>
                                <v-list-item-title
                                  ><span
                                    :class="
                                      order.payment_type === item.value
                                        ? 'font-bold'
                                        : ''
                                    "
                                    >{{ item.label }}</span
                                  ></v-list-item-title
                                >
                              </v-list-item-content>
                              <v-list-item-action>
                                <v-icon>
                                  {{
                                    order.payment_type === item.value
                                      ? "mdi-check-circle"
                                      : "mdi-radiobox-blank"
                                  }}</v-icon
                                >
                              </v-list-item-action>
                            </template>
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="auto">
                          <v-menu
                            v-model="menu_pay_date"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                dense
                                outlined
                                :value="
                                  pay_date_str ? pay_date_str : todayDate()
                                "
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                color="#FF6B81"
                              >
                                <template v-slot:append>
                                  <v-icon color="#FF6B81">mdi-calendar</v-icon>
                                </template>
                              </v-text-field>
                            </template>
                            <v-date-picker
                              :max="today.toISOString()"
                              v-model="pay_date"
                              @input="inputPayDate($event)"
                              :locale="$i18n.locale == 'th' ? 'th-TH' : 'en-US'"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="auto">
                          {{ $t("payee") }} :
                          <span class="text-pink-500 font-medium">
                            <!-- {{
                            `${user_detail.first_name_th} ${user_detail.last_name_th}`
                          }} -->
                            {{
                              $i18n.locale === "th"
                                ? user_detail.first_name_th +
                                  " " +
                                  user_detail.last_name_th
                                : user_detail.first_name_en +
                                  " " +
                                  user_detail.last_name_en
                            }}
                          </span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card
                class="cursor-pointer mb-3"
                @click="order.payment_status = 'warn'"
              >
                <v-card-text>
                  <v-row class="d-flex align-center">
                    <v-col cols="auto"
                      ><v-icon
                        :color="
                          order.payment_status === 'warn' ? '#FF6B81' : ''
                        "
                        >{{
                          order.payment_status === "warn"
                            ? "mdi-radiobox-marked"
                            : "mdi-radiobox-blank"
                        }}</v-icon
                      ></v-col
                    >
                    <v-col cols="auto" class="pa-0">
                      <v-avatar>
                        <v-img
                          src="@/assets/create_student/notification 1.png"
                          max-height="24"
                          max-width="24"
                        ></v-img>
                      </v-avatar>
                    </v-col>
                    <v-col> {{ $t("send payment notification") }} </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
        <!-- BUTTON :ACTION -->
        <v-row>
          <v-col align="right" sm="" cols="12">
            <v-btn
              outlined
              @click="ClearData()"
              :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
              color="#ff6b81"
            >
              {{ $t("cancel") }}
            </v-btn>
          </v-col>
          <v-col align="right" sm="auto" cols="12">
            <v-btn
              depressed
              :disabled="!order.courses?.length > 0"
              :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
              :dark="order.courses?.length > 0"
              color="#ff6b81"
              @click="save()"
            >
              {{ $t("confirm") }}
            </v-btn>
          </v-col>
        </v-row>
        <v-dialog
          persistent
          v-model="show_dialog_register_one_id"
          :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
        >
          <registerDialogForm
            state="student"
            dialog
            :title="$t('sign up for One ID')"
          ></registerDialogForm>
        </v-dialog>
      </v-form>
    </v-container>
    <!-- LOADING -->
    <loading-overlay :loading="order_is_loading"></loading-overlay>
    <!-- DIALOG -->
    <v-dialog class="pa-2" width="50vw" v-model="dialog_show" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="12" align="right">
              <v-btn icon @click="dialog_show = false">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <dialogCard
          :text="$t('confirmation of successful payments')"
        ></dialogCard>
        <v-btn
          class="centerbtn mt-10"
          color="#ff6b81"
          @click="$router.push({ name: 'Finance' })"
          ><div class="text-white">
            {{ $t("view financial status") }}
          </div></v-btn
        >
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import LabelCustom from "@/components/label/labelCustom.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";
import registerDialogForm from "@/components/user_menage/registerDialogForm.vue";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import { mapActions, mapGetters } from "vuex";
import { dateFormatter, inputValidation } from "@/functions/functions";
import Swal from "sweetalert2";
import mixin from "@/mixin";
import router from "@/router";
import moment from "moment";

export default {
  name: "addlearnPage",
  components: {
    headerPage,
    LabelCustom,
    registerDialogForm,
    dialogCard,
    loadingOverlay,
  },
  mixins: [mixin],
  props: {},
  data: () => ({
    notification_name: "แจ้งเตือนการสมัครคอร์สเรียน",
    notification_description: "แอตมินได้เพิ่มคอร์สเรียนให้คุณ",
    validate_form: null,
    user_detail: null,
    course_name_th: "",
    course_id: "",
    search: null,
    students: [],
    loading: false,
    dialog_show: false,
    date: "",
    username: "",
    show_dialog: false,
    filter_search: "",
    add_data: {},
    today: new Date(),
    selected: [""],
    pay: "",
    menu_pay_date: "",
    pay_date_str: "",
    pay_date: "",
    loading_course: false,
  }),
  created() {
    this.ClearData();
  },
  mounted() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    this.GetCategorys();
  },
  computed: {
    ...mapGetters({
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      order: "OrderModules/getOrder",
      categorys: "CategoryModules/getCategorys",
      course_data: "CourseModules/getCourseData",
      courses: "CourseModules/getCourses",
      packages: "CourseModules/getPackages",
      last_user_registered: "RegisterModules/getLastUserRegistered",
      username_list: "loginModules/getUsernameList",
      order_is_loading: "OrderModules/getOrderIsLoading",
      course_monitors: "CourseMonitorModules/getCourseMonitor",
      order_is_status: "OrderModules/getOrderIsStatus",
    }),
    transfer() {
      return [
        { label: this.$t("transfer to account"), value: "transfer" },
        { label: this.$t("credit card"), value: "Credit Card" },
        { label: this.$t("cash"), value: "cash" },
      ];
    },
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
    },
    rules() {
      return {
        student: [
          (val) =>
            (val || "")?.length > 0 || this.$t("please select a student"),
        ],
        category: [
          (val) => (val || "")?.length > 0 || this.$t("please select a wls"),
        ],
        course: [
          (val) => (val || "").length > 0 || this.$t("please select a course"),
        ],
        package: [
          (val) =>
            (val || "")?.length > 0 || this.$t("please select a package"),
        ],
        option: [
          (val) =>
            (val.option_id ? true : false) || this.$t("please select a period"),
        ],
        day: [
          (val) =>
            (val || "")?.length > 0 || this.$t("please select a class day"),
        ],
        time: [
          (val) =>
            (val ? true : false) || this.$t("please select a class time"),
        ],
        coach: [
          (val) =>
            (val.courseCoachId ? true : false) ||
            this.$t("please select a coach"),
        ],
        start_date: [
          (val) =>
            (val || "")?.length > 0 || this.$t("please select a start date"),
        ],
        pay_date: [
          (val) =>
            (val || "")?.length > 0 || this.$t("please select a pay date"),
        ],
        price: [(val) => (val || "") > 0 || this.$t("please select a price")],
        remark: [
          (val) =>
            val?.length < 256 ||
            this.$t("note that the length exceeds the limit"),
        ],
        payment_type: [
          (val) =>
            val ? true : false || this.$t("please choose a payment method"),
        ],
      };
    },
  },

  watch: {
    last_user_registered: function () {
      if (this.last_user_registered?.account_id) {
        this.students.push(this.last_user_registered.account_id);
        this.username_list.push({
          userOneId: this.last_user_registered.account_id,
          firstNameEng: this.last_user_registered.firstname_en,
          lastNameEng: this.last_user_registered.lastname_en,
          firstNameTh: this.last_user_registered.firstname_th,
          lastNameTh: this.last_user_registered.lastname_th,
          mobileNo: this.last_user_registered.phone_number,
          userName: this.last_user_registered.username,
          fullname: `${this.last_user_registered.firstname_th} ${this.last_user_registered.lastname_th}(${this.last_user_registered.firstname_en} ${this.last_user_registered.lastname_en})|${this.last_user_registered.username} `,
        });
      }
    },
    search(val) {
      if (val?.length > 3) {
        this.loading = true;
        this.searchNameUser({ search_name: val }).then(() => {
          this.loading = false;
        });
      }
    },
  },
  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      changeOrderData: "OrderModules/changeOrderData",
      saveOrder: "OrderModules/saveOrder",
      GetCategorys: "CategoryModules/GetCategorys",
      GetCoursesFilter: "CourseModules/GetCoursesFilter",
      GetPackages: "CourseModules/GetPackages",
      GetCourse: "CourseModules/GetCourse",
      searchNameUser: "loginModules/searchNameUser",
      GetAllCourseMonitor: "CourseMonitorModules/GetAllCourseMonitor",
    }),
    todayDate() {
      let todayDate = new Date();
      return dateFormatter(todayDate, "DD MMT YYYYT");
    },
    openCourses(items) {
      return items.filter((course) => course.statusCourse === "Open");
    },
    // packageOptions(items) {
    //   console.log("items :>> ", items);
    //   return items.filter((packageStatus) => packageStatus.status === "Open");
    // },
    coachOptions(timeData) {
      console.log("timeData :>> ", timeData);
      return timeData.filter((coach) => coach.status_coach === "Open");
      // return items.filter((coach) => coach.status_coach === "Open");
    },
    minStartDate(startDate) {
      let date = new Date();
      if (moment(startDate).isSameOrAfter(date)) {
        date = new Date(startDate);
      }
      return date.toISOString();
    },
    Validation(e, lang) {
      inputValidation(e, lang);
    },
    remove(item) {
      const index = this.students.indexOf(item);
      if (index >= 0) this.students.splice(index, 1);
    },
    CalTotalPrice() {
      this.order.total_price = 0;
      for (let course of this.order.courses) {
        if (course.price) {
          this.order.total_price =
            this.order.total_price + parseInt(course.price);
        }
      }
    },
    selectCourseType(type, course) {
      course.category_id = "";
      course.course_id = "";
      course.course_type_id = type;
      course.course_type = "";
      course.package_data = {};
      course.package = "";
      course.option = {};
      course.option_data = {};
      course.day = "";
      course.time = "";
      course.time_str = "";
      course.coach = "";
      course.manu_start_date = false;
      course.start_date_str = "";
      course.start_date = "";
      course.price = 0;
      course.detail = "";
      course.remark = "";
    },
    selectPackage(course) {
      course.option = {};
      course.package_data = course.course_data.packages.filter(
        (v) => v.package_id === course.package
      )[0];
    },
    addCourse() {
      this.order.courses.push({
        course_options: [],
        course_data: null,
        apply_for_yourself: false,
        apply_for_others: false,
        course_id: "",
        course_type: "",
        course_type_id: "CT_1",
        category_id: "",
        package: "",
        package_data: null,
        option: {},
        option_data: "",
        period: 0,
        times_in_class: 0,
        day: "",
        time: "",
        coach: "",
        manu_start_date: true,
        start_date_str: "",
        start_date: "",
        start_day: "",
        price: 0,
        detail: "",
        remark: "",
        selected: true,
        parents: [],
        students: [],
      });
    },
    Calprice(course) {
      course.price = course.option.net_price;
      this.CalTotalPrice();
    },
    inputDate(e, type, data) {
      switch (type) {
        case "course open":
          data.start_date_str = dateFormatter(e, "DD MMT YYYYT");
          break;
      }
    },
    inputPayDate(e) {
      this.pay_date_str = dateFormatter(e, "DD MMT YYYYT");
      this.order.pay_date = this.pay_date;
    },
    openDialog() {
      this.dialog_show = true;
    },
    removeCourse(index) {
      this.order.courses.splice(index, 1);
    },
    selectTime(time, course) {
      course.coach = {};
    },
    selectCategory(categoryId, course_type_id, course) {
      course.course_id = "";
      course.package_data = {};
      course.package = "";
      course.option = {};
      course.option_data = {};
      course.day = "";
      course.time = "";
      course.time_str = "";
      course.coach = "";
      course.manu_start_date = false;
      course.start_date_str = "";
      course.start_date = "";
      course.price = 0;
      course.detail = "";
      course.remark = "";
      this.loading_course = false;
      this.GetCoursesFilter({
        category_id: categoryId,
        status: "Active",
        course_type_id: course_type_id,
      }).then(() => {
        this.loading_course = false;
        let course_ids = [];
        for (let order_course of this.order.courses) {
          course_ids.push(order_course.course_id);
        }
        course.course_options = this.courses.filter(
          (v) => !course_ids.includes(v.course_id)
        );
      });
      this.loading_course = true;
    },
    selectCourse(courseId, course) {
      console.log("111 :>> ", courseId);
      course.package_data = {};
      course.package = "";
      course.option = {};
      course.option_data = {};
      course.day = "";
      course.time = "";
      course.time_str = "";
      course.coach = "";
      course.manu_start_date = false;
      course.start_date_str = "";
      course.start_date = "";
      course.price = 0;
      course.detail = "";
      course.remark = "";
      if (courseId) {
        this.GetCourse(courseId).then(() => {
          console.log("22 :>> ", 22);
          if (this.course_data) {
            course.course_data = this.course_data;
          }
          console.log("this.course_data :>> ", this.course_data);

          if (this.course_data.course_type_id === "CT_2") {
            course.start_date = this.course_data.course_study_start_date;
            course.start_date_str = new Date(
              course.start_date
            ).toLocaleDateString(
              this.$i18n.locale == "th" ? "th-TH" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            );
            course.coach = this.course_data.coachs[0];
            let startTimePart =
              this.course_data.course_period_start_date.split(":");
            let endTimePart =
              this.course_data.course_period_end_date.split(":");
            let period_start = `${startTimePart[0].padStart(
              2,
              "0"
            )}:${startTimePart[1].padStart(2, "0")}`;
            let period_end = `${endTimePart[0].padStart(
              2,
              "0"
            )}:${endTimePart[1].padStart(2, "0")}`;
            course.time_str = `${period_start}-${period_end} ${this.$t(
              "o'clock"
            )}`;
            course.price = parseInt(this.course_data.price_course);
            course.time = this.course_data.days_of_class[0].times[0];
            this.CalTotalPrice();
          }
        });
      }
    },
    save() {
      this.GetAllCourseMonitor().then(() => {
        this.$refs.course_form.validate();
        let isValiDateCourse = [];
        let studentFail = false;
        if (this.validate_form && this.course_monitors?.length > 0) {
          for (let course of this.order.courses) {
            if (course.package_data.students < this.students?.length) {
              studentFail = true;
            } else {
              if (
                this.course_monitors.filter(
                  (v) =>
                    v.courseMonitorEntity_coach_id === course.coach.coach_id &&
                    v.courseMonitorEntity_course_id === course.course_id &&
                    v.courseMonitorEntity_day_of_week_id ===
                      course.time.dayOfWeekId &&
                    v.courseMonitorEntity_time_id === course.time.timeId
                )?.length > 0
              ) {
                if (
                  this.course_monitors.some(
                    (v) =>
                      v.courseMonitorEntity_coach_id ===
                        course.coach.coach_id &&
                      v.courseMonitorEntity_course_id === course.course_id &&
                      v.courseMonitorEntity_day_of_week_id ===
                        course.time.dayOfWeekId &&
                      v.courseMonitorEntity_time_id === course.time.timeId &&
                      v.courseMonitorEntity_current_student +
                        course.students?.length <=
                        v.courseMonitorEntity_maximum_student &&
                      v.courseMonitorEntity_status === "Open"
                  )
                ) {
                  isValiDateCourse.push(true);
                } else {
                  isValiDateCourse.push(false);
                }
              } else {
                isValiDateCourse.push(true);
              }
            }
          }
          if (studentFail) {
            Swal.fire({
              icon: "error",
              title: this.$t("the number of students is incorrect"),
              text: this.$t(
                "the number of students exceeds the number of students allowed in the package"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else if (isValiDateCourse.includes(false)) {
            Swal.fire({
              icon: "error",
              title: this.$t("something went wrong"),
              text: this.$t(
                "the selected course is full and payment cannot be made"
              ),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          } else {
            Swal.fire({
              icon: "question",
              title: this.$t("do you want to add learner?"),
              showDenyButton: false,
              showCancelButton: true,
              confirmButtonText: this.$t("agree"),
              cancelButtonText: this.$t("no"),
            }).then(async (result) => {
              if (result.isConfirmed) {
                if (this.order.payment_status === "warn") {
                  let account = [];
                  let course_name_noti = [];
                  let course_name_noti_en = [];
                  this.order.courses.forEach((course) => {
                    course_name_noti.push(course?.course_data?.course_name_th);
                    course_name_noti_en.push(
                      course?.course_data?.course_name_en
                    );
                    course.students = [];
                    course.coach_id = course.coach.coach_id;
                    course.coach_name = course.coach.coach_name;
                    for (const student of this.students) {
                      if (student) {
                        account.push({
                          studentId: student,
                        });
                        course.students.push({
                          account_id: student,
                          student_name: null,
                          username: null,
                          firstname_en: null,
                          lastname_en: null,
                          tel: null,
                          parents: [],
                          is_account: false,
                          is_other: false,
                        });
                      }
                    }
                  });
                  this.order.type = "addStudent";
                  this.changeOrderData(this.order);
                  console.log("this.order :>> ", this.order);
                  await this.saveOrder({ regis_type: "addStudent" });
                  if (this.order_is_status) {
                    let payload = {
                      notificationName: this.notification_name,
                      notificationNameEn: "Notification of course application",
                      notificationDescription: `แอดมินสมัครคอร์ส ${course_name_noti?.join(
                        course_name_noti?.length > 1 ? ", " : ""
                      )} ให้คุณแล้ว (รอชำระเงิน)`,
                      notificationDescriptionEn: `Admin applies for course ${course_name_noti_en?.join(
                        course_name_noti_en?.length > 1 ? ", " : ""
                      )} already given to you (waiting for payment)`,
                      accountId: account,
                      // path: null,
                      path: "/order/history",
                    };
                    this.sendNotification(payload);
                    // router.replace({ name: "Finance" });
                  }
                  router.replace({ name: "Finance" });
                } else {
                  let account = [];
                  let course_name_noti = [];
                  let course_name_noti_en = [];
                  this.order.courses.forEach((course) => {
                    course_name_noti.push(course?.course_data?.course_name_th);
                    course_name_noti_en.push(
                      course?.course_data?.course_name_en
                    );
                    course.students = [];
                    course.coach_id = course.coach.coach_id;
                    course.coach_name = course.coach.coach_name;
                    for (const student of this.students) {
                      if (student) {
                        account.push({
                          studentId: student,
                        });
                        course.students.push({
                          account_id: student,
                          student_name: null,
                          username: null,
                          firstname_en: null,
                          lastname_en: null,
                          tel: null,
                          parents: [],
                          is_account: false,
                          is_other: false,
                        });
                      }
                    }
                  });
                  this.order.type = "addStudent";
                  this.changeOrderData(this.order);
                  await this.saveOrder({ regis_type: "addStudent" });
                  if (this.order_is_status) {
                    let payload = {
                      notificationName: this.notification_name,
                      notificationNameEn: "Notification of course application",
                      notificationDescription: `แอดมินสมัครคอร์ส ${course_name_noti?.join(
                        course_name_noti?.length > 1 ? "และ" : ""
                      )} ให้คุณแล้ว`,
                      notificationDescriptionEn: `Admin applies for course ${course_name_noti_en?.join(
                        course_name_noti_en?.length > 1 ? "and" : ""
                      )} already given to you`,
                      accountId: account,
                      path: null,
                    };
                    this.sendNotification(payload);
                    // router.replace({ name: "Finance" });
                  }
                  router.replace({ name: "Finance" });
                }
              }
            });
          }
        }
      });
    },
    ClearData() {
      this.students = [];
      this.changeOrderData({
        type: "",
        order_step: 0,
        order_number: "",
        courses: [
          {
            course_options: [],
            course_data: null,
            apply_for_yourself: false,
            apply_for_others: false,
            course_id: "",
            course_type: "",
            course_type_id: "CT_1",
            category_id: "",
            package: "",
            package_data: null,
            option: {},
            option_data: "",
            period: 0,
            times_in_class: 0,
            day: "",
            time: "",
            coach: "",
            manu_start_date: true,
            start_date_str: "",
            start_date: "",
            start_day: "",
            price: 0,
            detail: "",
            remark: "",
            selected: true,
            parents: [],
            students: [],
          },
        ],
        created_by: "",
        payment_status: "",
        payment_type: "",
        total_price: 0,
      });
    },
  },
};
</script>
<style scoped>
.sub-register-pc {
  position: absolute;
  left: 65%;
  margin-top: 48px;
}

sub-register-sm {
  left: 65%;
  margin-top: 180px;
}

.centerbtn {
  margin: 0;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
// creatStudent(featureSekectDate)