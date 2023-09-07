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
                        {{ search ? $t(`data not found`) : $t(`please enter the student's name`) }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      color="#FBF3F5"
                    >
                      {{ `${data.item.firstNameTh} ${data.item.lastNameTh}` }}
                      <v-icon
                        @click="remove(data.item.userOneId)"
                        color="#ff6b81"
                        >mdi-close-circle</v-icon
                      >
                    </v-chip>
                  </template>
                  <template v-slot:item="{ item }">
                    {{ `${item.firstNameTh} ${item.lastNameTh}` }}
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
                v-if="order.courses.length >= 2"
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
                  {{$t("general course")}}</v-btn
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
                  {{$t("short course")}}</v-btn
                >
              </v-col>
            </v-row>
            <!-- คอร์สทั่วไป detail -->
            <v-row dense>
              <v-col cols="12" sm="4">
                <label-custom :text="$t(`kingdom`)"></label-custom>
                <v-autocomplete
                  dense
                  item-value="categoryId"
                  item-text="categoryNameTh"
                  v-model="course.category_id"
                  :items="categorys"
                  :placeholder="$t(`select kingdom`)"
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
                      <v-list-item-title> {{ $t("no data found") }} </v-list-item-title>
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
                          >{{ item.categoryNameTh }}</span
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
                <v-autocomplete
                  dense
                  item-value="course_id"
                  item-text="course_name_th"
                  v-model="course.course_id"
                  :items="course.course_options"
                  :rules="rules.course"
                  :placeholder="$t(`select course`)"
                  outlined
                  color="pink"
                  item-color="pink"
                  @change="selectCourse(course.course_id, course)"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title> {{ $t("no data found") }} </v-list-item-title>
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
                          >{{ item.course_name_th }}</span
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
                <label-custom text="แพ็กเกจ"></label-custom>
                <v-autocomplete
                  item-value="package_id"
                  item-text="package"
                  item-color="pink"
                  color="pink"
                  dense
                  :rules="rules.package"
                  v-model="course.package"
                  :items="course.course_data.packages"
                  placeholder="เลือกแพ็กเกจ"
                  outlined
                  @change="selectPackage(course)"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4" v-if="course.package">
                <label-custom text="ระยะเวลา"></label-custom>
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
                  placeholder="เลือกระยะเวลา"
                  @change="Calprice(course)"
                  item-color="white"
                  color="pink"
                >
                  <template v-slot:selection="data">
                    {{ `${data.item.option_name}` }}
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
                          >{{ item.option_name }}</span
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
                </v-autocomplete>
              </v-col>
              <v-col v-if="course.option" cols="12" sm="2">
                <label-custom text="จำนวนครั้ง"></label-custom>
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
                <label-custom text="วัน"></label-custom>
                <v-autocomplete
                  dense
                  :rules="rules.day"
                  v-model="course.day"
                  item-text="dayName"
                  item-value="dayName"
                  :items="course.course_data.days"
                  placeholder="เลือกวัน"
                  outlined
                  item-color="pink"
                  color="pink"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="3" v-if="course.day">
                <label-custom text="เวลา"></label-custom>
                <v-select
                  dense
                  :rules="rules.time"
                  v-model="course.time"
                  :items="
                    course.course_data.days.filter(
                      (v) => v.dayName === course.day
                    )[0].times
                  "
                  placeholder="เลือกเวลา"
                  outlined
                  item-color="white"
                  @change="selectTime(course.time, course)"
                >
                  <template v-slot:selection="data">
                    {{ `${data.item.start}-${data.item.end}น.` }}
                  </template>
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title> ไม่พบข้อมูล </v-list-item-title>
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
                          >{{ item.start }}-{{ item.end }}น.</span
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
                <label-custom text="โค้ช"></label-custom>
                <v-autocomplete
                  dense
                  :rules="rules.coach"
                  v-model="course.coach"
                  :items="course.time.timeData"
                  placeholder="เลือกโค้ช"
                  item-color="pink"
                  outlined
                >
                  <template v-slot:selection="data">
                    {{ `${data.item.coach_name}` }}
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
                          >{{ item.coach_name }}</span
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
                <label-custom text="วันเริ่ม"></label-custom>
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
                      placeholder="เลือกวันเริ่ม"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <template v-slot:append>
                        <v-icon :color="course.start_date ? '#FF6B81' : ''"
                          >mdi-calendar</v-icon
                        >
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    :min="today.toISOString()"
                    v-model="course.start_date"
                    @input="inputDate($event, 'course open', course)"
                    locale="th-TH"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row
              dense
              v-if="course.course_type_id == 'CT_2' && course.course_id"
            >
              <v-col cols="12" sm="4" v-if="course.course_type_id == 'CT_2'">
                <label-custom text="วันที่"></label-custom>
                <v-text-field
                  v-if="course.course_id"
                  dense
                  disabled
                  outlined
                  :value="course.start_date_str"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <label-custom text="เวลา"></label-custom>
                <v-text-field
                  disabled
                  outlined
                  dense
                  :value="`${course.time_str}น.`"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <label-custom text="โค้ช"></label-custom>
                <v-text-field
                  dense
                  outlined
                  disabled
                  :value="course.coach.coach_name"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <!-- PRICE -->
            <v-row dense>
              <v-col cols="12" sm="4">
                <label-custom :text="$t(`price`)"></label-custom>
                <v-text-field
                  dense
                  :rules="rules.price"
                  v-model="course.price"
                  @change="CalTotalPrice()"
                  outlined
                  @keypress="Validation($event, 'number')"
                  type="number"
                  color="pink"
                  :suffix="$t(`baht`)"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <label-custom :text="$t(`price note`)"></label-custom>
                <v-textarea
                  v-model="course.remark"
                  auto-grow
                  :rules="rules.remark"
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-row class="mb-3">
          <v-col align="center">
            <v-btn outlined class="" color="#ff6b81" @click="addCourse"
              ><span class="mdi mdi-plus-circle-outline"
                >{{ $t("add a course") }}</span
              ></v-btn
            >
          </v-col>
        </v-row>
        <template v-if="order.courses.length > 0">
          <div class="text-lg font-bold">{{$t("payment status")}}</div>
          <v-divider class="mb-3"></v-divider>
          <v-row dense class="mb-3">
            <v-col cols="12" sm="8">
              <v-card class="text-xl" color="#FBF3F5">
                <v-card-text>
                  <v-row>
                    <v-col class="text-lg font-bold">{{$t("total price")}} :</v-col>
                    <v-col
                      cols="auto"
                      class="text-lg font-bold text-pink-500"
                      >{{
                        (order.total_price * students.length).toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2 }
                        )
                      }}</v-col
                    >
                    <v-col cols="auto" class="text-lg font-bold">{{$t("baht")}}</v-col>
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
                        <v-col> {{$t("already paid")}} </v-col>
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
                                  ไม่พบข้อมูล
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
                          {{$t('payee')}} :
                          <span class="text-pink-500 font-medium">
                            <!-- {{
                            `${user_detail.first_name_th} ${user_detail.last_name_th}`
                          }} -->
{{ $i18n.locale === 'th' ? user_detail.first_name_th + ' ' + user_detail.last_name_th : user_detail.first_name_en + ' ' + user_detail.last_name_en }}
  
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
                    <v-col> {{$t("send payment notification")}} </v-col>
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
              {{ $t("clear data") }}
            </v-btn>
          </v-col>
          <v-col align="right" sm="auto" cols="12">
            <v-btn
              depressed
              :disabled="!order.courses.length > 0"
              :class="$vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-full'"
              :dark="order.courses.length > 0"
              color="#ff6b81"
              @click="save()"
            >
              {{$t("confirm")}}
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
            title="สมัคร One ID"
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
        <dialogCard text="ยืนยันการชำระเงินเรียบร้อย"></dialogCard>
        <v-btn
          class="centerbtn mt-10"
          color="#ff6b81"
          @click="$router.push({ name: 'Finance' })"
          ><div class="text-white">ดูสถานะการเงิน</div></v-btn
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
    rules: {
      student: [(val) => (val || "").length > 0 || "โปรดเลือกผู้เรียน"],
      category: [(val) => (val || "").length > 0 || "โปรดเลือกอาณาจักร"],
      course: [(val) => (val || "").length > 0 || "โปรดเลือกคอร์สเรียน"],
      package: [(val) => (val || "").length > 0 || "โปรดเลือกแพ็กเกจ"],
      option: [(val) => (val.option_id ? true : false) || "โปรดเลือกระยะเวลา"],
      day: [(val) => (val || "").length > 0 || "โปรดเลือกวันเรียน"],
      time: [(val) => (val ? true : false) || "โปรดเลือกเวลาเรียน"],
      coach: [(val) => (val.courseCoachId ? true : false) || "โปรดเลือกโค้ช"],
      start_date: [(val) => (val || "").length > 0 || "โปรดเลือกวันเริ่ม"],
      price: [(val) => (val || "") > 0 || "โปรดเลือกระบุราคา"],
      remark: [(val) => val.length < 256 || "หมายเหตุความยาวเกินกว่าที่กำหนด"],
      payment_type: [
        (val) => (val ? true : false || "โปรดเลือกช่องทางการชำระเงิน"),
      ],
    },
  }),
  created() {
    if (this.order.courses.length == 0) {
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
    }
  },
  mounted() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    this.GetCategorys();
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
      if (val.length > 3) {
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
      this.GetCoursesFilter({
        category_id: categoryId,
        status: "Active",
        course_type_id: course_type_id,
      }).then(() => {
        let course_ids = [];
        for (let order_course of this.order.courses) {
          course_ids.push(order_course.course_id);
        }
        course.course_options = this.courses.filter(
          (v) => !course_ids.includes(v.course_id)
        );
      });
    },
    selectCourse(courseId, course) {
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
          if (this.course_data) {
            course.course_data = this.course_data;
          }
          if (this.course_data.course_type_id === "CT_2") {
            course.start_date = this.course_data.course_study_start_date;
            course.start_date_str = new Date(
              course.start_date
            ).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

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
            course.time_str = `${period_start}-${period_end}`;
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
        if (this.validate_form && this.course_monitors.length > 0) {
          for (let course of this.order.courses) {
            if (course.package_data.students < this.students.length) {
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
                ).length > 0
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
                        course.students.length <=
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
              title: "จำนวนนักเรียนไม่ถูกต้อง",
              text: "จำนวนนักเรียนเกินกว่าจำนวนที่จะรับได้ใน Package",
              showDenyButton: false,
              showCancelButton: true,
              cancelButtonText: "ยกเลิก",
              confirmButtonText: "ตกลง",
            });
          } else if (isValiDateCourse.includes(false)) {
            Swal.fire({
              icon: "error",
              title: "คอร์สที่เลือกเต็มแล้วไม่สามารถชำระเงินได้",
              showDenyButton: false,
              showCancelButton: true,
              cancelButtonText: "ยกเลิก",
              confirmButtonText: "ตกลง",
            });
          } else {
            Swal.fire({
              icon: "question",
              title: "ต้องการเพิ่มผู้เรียนใช่หรือไม่",
              showDenyButton: false,
              showCancelButton: true,
              confirmButtonText: "ตกลง",
              cancelButtonText: "ยกเลิก",
            }).then(async (result) => {
              if (result.isConfirmed) {
                if (this.order.payment_status === "warn") {
                  let account = [];
                  let course_name_noti = [];
                  this.order.courses.forEach((course) => {
                    course_name_noti.push(course?.course_data?.course_name_th);
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

                  let payload = {
                    notificationName: this.notification_name,
                    notificationDescription: `แอดมินสมัครคอร์ส ${course_name_noti?.join(
                      course_name_noti.length > 1 ? ", " : ""
                    )} ให้คุณแล้ว (รอชำระเงิน)`,
                    accountId: account,
                    path: null,
                  };
                  this.sendNotification(payload);
                  this.saveOrder({regis_type : 'addStudent'});
                } else {
                  let account = [];
                  let course_name_noti = [];
                  this.order.courses.forEach((course) => {
                    course_name_noti.push(course?.course_data?.course_name_th);
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
                  let payload = {
                    notificationName: this.notification_name,
                    notificationDescription: `แอดมินสมัครคอร์ส ${course_name_noti?.join(
                      course_name_noti.length > 1 ? "และ" : ""
                    )} ให้คุณแล้ว`,
                    accountId: account,
                    path: null,
                  };
                  this.sendNotification(payload);
                  this.saveOrder({regis_type : "addStudent"});
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
    }),
    transfer() {
     return [
        { label: this.$t("transfer to account"), value: "transfer" },
        { label: this.$t("credit card"), value: "Credit Card" },
        { label:this.$t("cash"), value: "cash" },
      ]
    },
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
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
