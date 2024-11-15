<template>
  <v-app>
    <v-container>
      {{ setFunctions }}
      <v-card class="mb-3">
        <v-row dense>
          <v-col cols="12" sm="3" class="d-flex align-center">
            <v-img
              class="rounded-lg my-3 mx-3"
              :class="
                $vuetify.breakpoint.smAndUp ? 'width-img' : 'width-img-sm'
              "
              :src="
                course_data.course_img || course_data.course_img !== ''
                  ? course_data.course_img
                  : require(`@/assets/course/default_course_img.svg`)
              "
              :aspect-ratio="16 / 9"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="#ff6b81"
                  ></v-progress-circular>
                </v-row> </template
            ></v-img>
          </v-col>
          <v-col cols="12" sm="6" align-self="start">
            <!-- <template v-slot:header> -->
            <div class="text-xl font-bold my-3 mx-3">
              {{
                `${
                  $i18n.locale == "th"
                    ? course_data.course_name_th
                    : course_data.course_name_en
                }`
              }}
            </div>
            <div class="text-sm my-3 mx-3">{{ course_data.location }}</div>
            <v-row dense class="my-3 mx-3">
              <v-col cols="12" sm="6" class="pa-0">
                <rowData mini col_detail="8" icon="mdi-clock-outline">
                  {{ course_data.course_hours.toFixed(2) }} {{ $t("hrs.") }}/{{
                    $t("time")
                  }}</rowData
                >
              </v-col>
              <v-col
                cols="12"
                sm="6"
                class="pa-0"
                v-if="course_data.course_type_id === 'CT_1'"
              >
                <rowData mini col_detail="7" icon="mdi-book-multiple-outline">
                  {{ course_order.package }}</rowData
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>

      <!-- SELECT CLASS DATE -->
      <template v-if="course_order.course_type_id == 'CT_1'">
        <v-row dense>
          <v-col class="text-lg font-bold">
            {{ $t("choose a course date") }}
          </v-col>
        </v-row>
        <v-radio-group v-model="course_order.day" @change="resetTime">
          <v-row>
            <v-col
              cols="12"
              sm="6"
              v-for="(date, date_index) in course_data.days"
              :key="date_index"
            >
              <v-radio
                :label="date.dayName"
                color="#ff6B81"
                :value="date"
              ></v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
        <template v-if="course_order.day">
          <v-row>
            <v-col class="text-lg font-bold">{{
              $t("choose a class time")
            }}</v-col>
          </v-row>
          <v-radio-group v-model="course_order.time" @change="getCoach">
            <v-row>
              <v-col
                cols="12"
                sm="6"
                v-for="(time, time_index) in course_order.day.times"
                :key="time_index"
              >
                <v-row dense>
                  <v-col cols="auto" class="d-flex aling-center">
                    <v-radio color="#ff6B81" :value="time">
                      <template v-slot:label>
                        {{ `${time.start}-${time.end}` }}
                      </template>
                    </v-radio>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-radio-group>
        </template>
        <template v-if="course_order.time">
          <v-form ref="form_coach" v-model="validate_coach">
            <v-row>
              <v-col class="text-lg font-bold">{{
                $t("choose a coach")
              }}</v-col>
            </v-row>
            <v-autocomplete
              dense
              v-model="course_order.coach_id"
              color="pink"
              @change="coachSelected($event)"
              :rules="coachRules"
              :items="all_course_seat"
              :item-text="$i18n.locale == 'th' ? 'fullnameTh' : 'fullnameEn'"
              item-value="coachId"
              item-color="pink"
              outlined
              :placeholder="$t('choose a coach')"
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
                        course_order.coach === item.course_coach_id
                          ? 'font-bold'
                          : ''
                      "
                    >
                      {{
                        $i18n.locale == "th"
                          ? `${item?.firstNameTh} ${item?.lastNameTh}`
                          : `${item?.firstNameEn} ${item?.lastNameEn}`
                      }}
                      {{
                        `(${
                          item?.countSeatByCourse ? item?.countSeatByCourse : 0
                        }/${
                          item?.maxStudentByCourse ? item.maxStudentByCourse : 0
                        })`
                      }}
                    </span></v-list-item-title
                  >
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon v-if="course_order.coach === item.course_coach_id"
                    >mdi-check-circle</v-icon
                  >
                </v-list-item-action>
              </template>
            </v-autocomplete>
          </v-form>
        </template>
      </template>
      <!-- REGISTER -->
      <v-row dense>
        <v-col class="text-lg font-bold"> {{ $t("register for") }} </v-col>
      </v-row>
      <v-row dense class="d-flex align-center">
        <v-col>
          <v-checkbox
            :disabled="
              course_order.apply_for_parent
                ? true
                : course_order.apply_for_yourself
                ? false
                : checkMaximumStudent() || checkApplyForYourselfRole()
            "
            v-model="course_order.apply_for_yourself"
            color="#ff6B81"
            :label="$t('register for yourself')"
          ></v-checkbox>
        </v-col>
        <v-col cols="auto" v-if="course_order.apply_for_yourself">
          <v-btn
            :disabled="
              course_order.students.filter((v) => v.is_other === false)[0]
                .parents.length > 0
            "
            dense
            outlined
            color="#ff6b81"
            @click="openDialogParent"
            ><v-icon>mdi-plus-circle-outline</v-icon
            >{{ $t("add parent information") }}</v-btn
          >
        </v-col>
      </v-row>
      <v-row dense v-if="course_order.apply_for_yourself">
        <v-col cols="12" sm="6">
          <labelCustom required :text="$t('nickname')"></labelCustom>
          <v-text-field
            v-model="course_order.students.find((v) => !v.is_other).nicknameTh"
            color="#ff6B81"
            outlined
            @keydown="Validation($event, 'free-nonum')"
            dense
            @input="
              realtimeCheckNickname(
                course_order.students.find((v) => !v.is_other).nicknameTh
              )
            "
            :placeholder="$t('please filter yourse nickname')"
          >
            <!-- :disabled="profile_detail?.nicknameTh" -->
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <labelCustom required :text="$t('class')"></labelCustom>
          <!-- :disabled="profile_detail.class.classNameTh !== ''" -->

          <v-autocomplete
            v-model="course_order.students.find((v) => !v.is_other).class"
            :items="class_list"
            item-text="classNameTh"
            outlined
            color="#ff6B81"
            item-color="#ff6b81"
            dense
            @input="
              realtimeCheckClass(
                course_order.students.find((v) => !v.is_other).class,
                course_order.students.find((v) => !v.is_other)
              )
            "
            :placeholder="$t('please specify class')"
          >
            <!-- :disabled="profile_detail.class.classNameTh" -->
            <template #no-data>
              <v-list-item>
                {{ $t("data not found") }}
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>

        <!-- SCHOOL -->
        <v-col cols="12" sm="6">
          <label-custom required :text="$t('school')"></label-custom>
          <v-text-field
            :placeholder="$t('please specify the name of the school')"
            v-model="course_order.students.find((v) => !v.is_other).school"
            outlined
            dense
            color="#ff6b81"
          >
            <!-- :disabled="profile_detail.school.schoolNameTh" -->
          </v-text-field>
        </v-col>
        <!-- Food allergicList -->
        <v-col cols="12" sm="6">
          <label-custom
            required
            :text="$t('congenital disease')"
          ></label-custom>
          <v-text-field
            :placeholder="$t('please specify congenital disease')"
            v-model="course_order.students.find((v) => !v.is_other).congenital"
            outlined
            dense
            color="#ff6b81"
          >
            <!-- :disabled="profile_detail.congenitalDisease !== null" -->
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          v-if="
            course_order.students.find((v) => !v.is_other).class === 'อื่นๆ'
          "
        >
          <labelCustom
            required
            :text="$t('enter your more class')"
          ></labelCustom>
          <v-text-field
            v-model="myCheckClassData"
            :placeholder="$t('please specify more details of class')"
            outlined
            color="#ff6b81"
            dense
          >
          </v-text-field>
        </v-col>
      </v-row>
      <!-- Apply For Others -->
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-checkbox
            :disabled="
              course_order.apply_for_parent
                ? true
                : course_order.apply_for_others
                ? false
                : checkMaximumStudent()
            "
            v-model="course_order.apply_for_others"
            color="#ff6B81"
            :label="$t('register to study for others')"
          ></v-checkbox>
        </v-col>
      </v-row>
      <!-- Apply For Parent -->
      <v-row dense v-if="checkRoleParent()">
        <v-col cols="12" sm="6" class="d-flex align-center">
          <v-checkbox
            :disabled="
              course_order.apply_for_others
                ? true
                : course_order.apply_for_parent
                ? false
                : checkMaximumStudent()
            "
            v-model="course_order.apply_for_parent"
            color="#ff6B81"
            :label="$t('register to student of parent')"
          ></v-checkbox>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-information-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("for parents to purchase for students") }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <!-- PARENT RELATION -->
      <template v-if="relations.length > 0 && course_order.apply_for_yourself">
        <v-row dense>
          <v-col cols="auto"
            ><v-icon color="#ff6b81"
              >mdi-card-account-details-outline</v-icon
            ></v-col
          >
          <v-col class="text-lg font-bold">{{ $t("parents list") }}</v-col>
        </v-row>
        <v-divider class="my-2"></v-divider>
        <v-row>
          <v-col
            cols="12"
            sm="4"
            v-for="(relation, index) in relations"
            :key="`${index}-relation`"
          >
            <v-card flat class="mb-3">
              <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
                <div>{{ $t("first name") }} - {{ $t("last name") }}</div>
                <div class="pl-2 font-semibold">
                  {{
                    $i18n.locale == "th"
                      ? `${relation.parent.parentFirstnameTh} ${relation.parent.parentLastnameTh}`
                      : `${relation.parent.parentFirstnameEn} ${relation.parent.parentLastnameEn}`
                  }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <!-- PARENT -->
      <template
        v-if="
          course_order.students.filter((v) => v.is_other === false).length > 0
        "
      >
        <div
          class="mb-3"
          v-for="(parent, index_parent) in course_order.students.filter(
            (v) => v.is_other === false
          )[0].parents"
          :key="`${index_parent}-perent`"
        >
          <v-row dense class="mb-3">
            <v-col cols="auto"
              ><v-icon color="#ff6b81"
                >mdi-card-account-details-outline</v-icon
              ></v-col
            >
            <v-col class="text-lg font-bold">{{ $t("parent") }}</v-col>
            <v-col cols="auto">
              <v-btn
                @click="
                  removeParent(
                    course_order.students.filter((v) => v.is_other === false)[0]
                  )
                "
                small
                icon
                color="red"
                dark
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </v-col>
          </v-row>
          <v-card outlined>
            <v-card-text>
              <v-row dense class="d-flex align-center" v-if="!edit_parent">
                <v-col cols="12" sm="6">
                  <labelCustom
                    :text="$t('username') + ' (' + $t('optional') + ')'"
                  ></labelCustom>
                  <v-text-field
                    :disabled="!edit_parent"
                    @keyup.enter="
                      parent.username > 3 ? checkUsername(parent.username) : ''
                    "
                    color="#ff6b81"
                    dense
                    :rules="usernameRules"
                    @keydown="Validation($event, 'en-number')"
                    outlined
                    v-model="parent.username"
                    :placeholder="$t('username')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-btn
                    :disabled="parent.username < 3"
                    dense
                    outlined
                    color="#ff6b81"
                    @click="edit_parent = true"
                    ><v-icon>mdi-account-edit-outline</v-icon
                    >{{ $t("edit parent information") }}</v-btn
                  >
                </v-col>
              </v-row>
              <v-row dense v-if="edit_parent">
                <v-col cols="6">
                  <labelCustom
                    :text="$t('username') + ' (' + $t('optional') + ')'"
                  ></labelCustom>
                  <v-text-field
                    :hide-details="!parent.account_id"
                    dense
                    outlined
                    color="#ff6b81"
                    :rules="usernameRules"
                    @keydown="Validation($event, 'en-number')"
                    v-model="parent.username"
                    @keyup.enter="
                      parent.username > 3 ? checkUsername(parent.username) : ''
                    "
                    placeholder="Username"
                  >
                    <template v-slot:append>
                      <v-icon v-if="parent.account_id" color="green"
                        >mdi-checkbox-marked-circle-outline</v-icon
                      >
                    </template>
                  </v-text-field>
                  <template v-if="!parent.account_id">
                    <label>
                      {{ $t("if you don't have an account yet, please") }}
                    </label>
                    <label
                      class="text-[#ff6b81] underline cursor-pointer mt-5"
                      @click="registerParent"
                      >{{ $t("register") }} One ID</label
                    >
                  </template>
                </v-col>
                <v-col cols="auto">
                  <br />
                  <v-btn
                    :dark="!parent.username < 3"
                    :disabled="parent.username < 3"
                    :loading="is_loading"
                    color="#ff6b81"
                    @click="checkUsername(parent.username)"
                    @keyup.enter="checkUsername(parent.username)"
                    depressed
                  >
                    {{ $t("agree") }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="4">
                  <labelCustom
                    required
                    :text="$t('first name(english)')"
                  ></labelCustom>
                  <v-text-field
                    :disabled="user_data.length > 0 || !edit_parent"
                    dense
                    outlined
                    v-model="parent.firstname_en"
                    :placeholder="$t('english first name')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <labelCustom
                    required
                    :text="$t('last name(english)')"
                  ></labelCustom>
                  <v-text-field
                    :disabled="user_data.length > 0 || !edit_parent"
                    dense
                    outlined
                    v-model="parent.lastname_en"
                    :placeholder="$t('english last name')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <labelCustom
                    required
                    :text="$t('phone number')"
                  ></labelCustom>
                  <v-text-field
                    :disabled="user_data.length > 0 || !edit_parent"
                    dense
                    outlined
                    v-model="parent.tel"
                    :placeholder="$t('phone number')"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </template>
      <!-- STUDENT -->
      <div
        v-for="(student, index_student) in course_order.students.filter(
          (v) => v.is_other === true
        )"
        :key="index_student"
      >
        <v-row dense>
          <v-col cols="auto"
            ><v-icon color="#ff6b81"
              >mdi-card-account-details-outline</v-icon
            ></v-col
          >
          <v-col class="text-lg font-bold">{{
            `${$t("learner")} ${index_student + 1}`
          }}</v-col>
          <v-col cols="auto">
            <v-btn @click="removeStudent(student)" small icon color="red" dark
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <v-card outlined class="mb-3">
          <v-card-text>
            <v-row dense class="d-flex align-start">
              <v-col cols="12">
                <labelCustom
                  :text="$t('username') + ' (' + $t('optional') + ')'"
                ></labelCustom>
                <v-text-field
                  dense
                  outlined
                  color="#ff6b81"
                  :rules="usernameRules"
                  @keydown="Validation($event, 'en-number')"
                  v-model="student.username"
                  @keyup.enter="
                    student.username.length > 3
                      ? checkUsername(
                          student.username,
                          'student',
                          index_student
                        )
                      : ''
                  "
                  :placeholder="$t('username')"
                  append-outer-icon="mdi-magnify"
                  @click:append-outer="
                    checkUsername(student.username, 'student', index_student)
                  "
                >
                  <template v-slot:append>
                    <v-icon v-if="student.account_id" color="green"
                      >mdi-checkbox-marked-circle-outline</v-icon
                    >
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <template v-if="!student.account_id">
                  <label>
                    {{ $t("if you don't have an account yet, please") }}
                  </label>
                  <label
                    class="text-[#ff6b81] underline cursor-pointer mt-5"
                    @click="registerStudent"
                    >{{ $t("register") }} One ID</label
                  >
                </template>
              </v-col>
            </v-row>
            <template v-if="student.account_id">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <labelCustom
                    required
                    :text="$t('first name(english)')"
                  ></labelCustom>
                  <v-text-field
                    :disabled="student.account_id ? true : false"
                    dense
                    outlined
                    v-model="student.firstname_en"
                    :placeholder="$t('english first name')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <labelCustom
                    required
                    :text="$t('last name(english)')"
                  ></labelCustom>
                  <v-text-field
                    :disabled="student.account_id ? true : false"
                    dense
                    outlined
                    v-model="student.lastname_en"
                    :placeholder="$t('english last name')"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" sm="6">
                  <labelCustom required :text="$t('nickname')"></labelCustom>
                  <v-text-field
                    dense
                    outlined
                    v-model="student.nicknameTh"
                    :placeholder="$t('please filter yourse nickname')"
                    color="#ff6B81"
                    @keydown="Validation($event, 'free-nonum')"
                    @input="realtimeCheckNickname(student.nicknameTh)"
                  ></v-text-field>
                  <!-- :disabled="student?.nicknameData" -->
                </v-col>
                <!-- CLASS -->
                <v-col
                  cols="12"
                  sm="6"
                  v-if="
                    student.role === 'R_5' ||
                    student.role === 'R_4' ||
                    !student.role
                  "
                >
                  <labelCustom required :text="$t('class')"></labelCustom>
                  <!-- :disabled="student?.classData" -->

                  <v-autocomplete
                    v-model="student.class"
                    :items="class_list"
                    item-text="classNameTh"
                    color="#ff6B81"
                    item-color="#ff6b81"
                    outlined
                    dense
                    @input="realtimeCheckClass(student.class, student)"
                    :placeholder="$t('please specify class')"
                  >
                    <!-- :disabled="student?.classData" -->
                    <template #no-data>
                      <v-list-item>
                        {{ $t("data not found") }}
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
                <!-- SCHOOL -->
                <v-col
                  cols="12"
                  sm="6"
                  v-if="
                    student.role === 'R_5' ||
                    student.role === 'R_4' ||
                    !student.role
                  "
                >
                  <labelCustom required :text="$t('school')"></labelCustom>
                  <!-- :disabled="student?.classData" -->
                  <v-text-field
                    :placeholder="$t('please specify the name of the school')"
                    v-model="student.school"
                    outlined
                    dense
                    color="#ff6b81"
                  >
                    <!-- :disabled="student.schoolData" -->
                  </v-text-field>
                </v-col>
                <!-- ALERGICT -->
                <v-col
                  cols="12"
                  sm="6"
                  v-if="
                    student.role === 'R_5' ||
                    student.role === 'R_4' ||
                    !student.role
                  "
                >
                  <label-custom
                    required
                    :text="$t('congenital disease')"
                  ></label-custom>
                  <v-text-field
                    :placeholder="$t('please specify congenital disease')"
                    v-model="student.congenital"
                    outlined
                    dense
                    color="#ff6b81"
                  >
                    <!-- :disabled="student.congenitalData" -->
                  </v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  v-if="
                    student.class === 'อื่นๆ' &&
                    (student.role === 'R_5' ||
                      student.role === 'R_4' ||
                      !student.role)
                  "
                >
                  <labelCustom
                    required
                    :text="$t('enter your more class')"
                  ></labelCustom>
                  <v-text-field
                    v-model="student.otherClass"
                    :placeholder="$t('please specify more details of class')"
                    outlined
                    color="#ff6b81"
                    dense
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </template>
          </v-card-text>
        </v-card>
        <v-row
          class="mb-3"
          dense
          v-if="
            index_student ===
            course_order.students.filter((v) => v.is_other === true).length - 1
          "
        >
          <v-col>
            <v-btn
              v-if="!checkMaximumStudent()"
              @click="addStudent"
              text
              dense
              color="#ff6b81"
            >
              <v-icon>mdi-plus-circle-outline</v-icon> {{ $t("add a learner") }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-row dense>
        <v-col>
          <v-checkbox color="pink" v-model="policy" class="inline-block">
            <template v-slot:label>
              {{ $t("accept")
              }}<a class="mx-2 font-weight-bold" @click="policy_show = true">
                {{ $t("terms of service and privacy policy") }}
              </a>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-btn
            class="w-full"
            :disabled="validateButton"
            outlined
            dense
            color="#ff6b81"
            @click="addToCart"
            >{{ $t("add to cart") }}</v-btn
          >
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            v-if="
              course_seat?.status === 'Close' ||
              course_order.students.length + course_seat?.countSeatByCourse >
                course_seat?.maxStudentByCourse ||
              course_data.course_status === 'Reserve'
            "
            class="w-full"
            :disabled="validateButton || ValidateReserve()"
            :class="
              validateButton || ValidateReserve()
                ? 'bg-[#C4C4C4] font-black'
                : 'bg-[#ff6b81] white--text'
            "
            outlined
            dense
            @click="CreateReserve"
            :color="validateButton || ValidateReserve() ? '#C4C4C4' : '#ff6b81'"
            >{{ $t("reserve") }}
          </v-btn>

          <v-btn
            v-else
            class="w-full"
            :disabled="validateButton"
            :class="
              validateButton
                ? 'bg-[#C4C4C4] font-black'
                : 'bg-[#ff6b81] white--text'
            "
            outlined
            dense
            @click="checkOut"
            :color="validateButton ? '#C4C4C4' : '#ff6b81'"
            >{{ $t("cash out") }}
          </v-btn>
        </v-col>
      </v-row>
      <!-- <v-row v-else>
        <v-col cols="12" sm="6">
          <v-btn
            class="w-full"
            :disabled="validateButton"
            outlined
            dense
            color="#ff6b81"
            @click="addToCart"
            >{{ $t("add to cart") }}</v-btn
          >
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            class="w-full"
            :disabled="validateButton"
            :class="
              validateButton
                ? 'bg-[#C4C4C4] font-black'
                : 'bg-[#ff6b81] white--text'
            "
            outlined
            dense
            color="#ff6b81"
            @click="checkOut"
            >{{ $t("cash out") }}</v-btn
          >
        </v-col>
      </v-row> -->
    </v-container>
    <!-- LOADING -->
    <loading-overlay :loading="order_is_loading"></loading-overlay>
    <!-- DIALOG :: ADD PARENT-->
    <v-dialog
      persistent
      v-model="dialog_parent"
      :width="$vuetify.breakpoint.smAndUp ? '50vw' : ''"
      class="d-flex align-center"
    >
      <v-card class="pa-2">
        <v-row dense>
          <v-col align="right">
            <v-btn icon @click="closeDialogParent"
              ><v-icon color="#ff6b81">mdi-close</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <header-card
          icon="mdi-card-account-details-outline"
          icon_color="#ff6b81"
          :title="$t('parent')"
        >
        </header-card>
        <v-card-text class="pa-2">
          <v-row dense>
            <v-col cols="8" sm="">
              <labelCustom
                :text="$t('username') + ' (' + $t('optional') + ')'"
              ></labelCustom>
              <v-text-field
                :rules="usernameRules"
                dense
                outlined
                color="#ff6b81"
                v-model="parent.username"
                @keydown="Validation($event, 'en-number')"
                @change="
                  parent.username.length > 3
                    ? checkUsername(parent.username)
                    : ''
                "
                @keyup.enter="
                  parent.username.length > 3
                    ? checkUsername(parent.username)
                    : ''
                "
                :placeholder="$t('username')"
              >
                <template v-slot:append>
                  <v-icon v-if="parent.account_id" color="green"
                    >mdi-checkbox-marked-circle-outline</v-icon
                  >
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="auto">
              <br />
              <v-btn
                :loading="is_loading"
                :dark="!parent.username.length < 3"
                color="#ff6b81"
                @click="checkUsername(parent.username)"
                @keyup.enter="checkUsername(parent.username)"
                depressed
              >
                {{ $t("agree") }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <template v-if="!parent.account_id">
                <label>
                  {{ $t("if you don't have an account yet, please") }}</label
                >
                <label
                  class="text-[#ff6b81] underline cursor-pointer mt-5"
                  @click="registerParent"
                  >{{ $t("register") }} One ID</label
                >
              </template>
            </v-col>
          </v-row>
          <template>
            <v-row dense>
              <v-col cols="12">
                <labelCustom
                  required
                  :text="$t('first name(english)')"
                ></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="parent.firstname_en"
                  :placeholder="$t('english first name')"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <labelCustom
                  required
                  :text="$t('last name(english)')"
                ></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="parent.lastname_en"
                  :placeholder="$t('english last name')"
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
        </v-card-text>
        <v-card-actions class="px-6">
          <v-row dense>
            <v-col>
              <v-btn
                @click="closeDialogParent"
                class="w-full"
                color="#ff6b81"
                outlined
                >{{ $t("cancel") }}</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                :color="!parent.account_id ? '#CCCCCC' : '#ff6b81'"
                class="w-full"
                :dark="parent.account_id ? true : false"
                depressed
                :disabled="!parent.account_id ? true : false"
                @click="addParent"
                >{{ $t("save") }}</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      persistent
      v-model="show_dialog_cart"
      :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
    >
      <v-card>
        <v-card-title>
          <v-row>
            <v-col align="right">
              <v-btn @click="closeDialogCart" icon
                ><v-icon color="#ff6b81">mdi-close</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </v-card-title>
        <dialog-card
          checkmark
          :text="$t('the course has been successfully added to the cart')"
        >
          <template #btn>
            <v-btn
              depressed
              class="w-full"
              dense
              color="#ff6b81"
              dark
              @click="closeDialogCart"
              >{{ $t("agree") }}</v-btn
            >
          </template>
        </dialog-card>
      </v-card>
    </v-dialog>
    <!-- DIALOG::REGISTER -->
    <v-dialog
      persistent
      v-if="show_dialog_register_one_id"
      v-model="show_dialog_register_one_id"
      :width="$vuetify.breakpoint.smAndUp ? `60vw` : ''"
    >
      <registerDialogForm
        dialog
        :title="$t('register') + 'One ID'"
        :state="register_type"
      ></registerDialogForm>
    </v-dialog>
    <!-- policy -->
    <v-dialog
      v-model="policy_show"
      persistent
      :width="$vuetify.breakpoint.smAndUp ? `60vw` : ''"
    >
      <v-card flat class="pa-2">
        <v-row dense>
          <v-col class="pa-2" align="right">
            <v-btn icon @click="policy_show = false">
              <v-icon color="red"> mdi-close </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <TermOfUse />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-checkbox hide-details color="pink" v-model="policy">
                <template v-slot:label>
                  {{ $t("accept") }}
                  <a class="mx-2 font-weight-bold">
                    {{ $t("terms of service and privacy policy") }}
                  </a>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row dense>
            <v-col align="right">
              <v-btn
                outlined
                color="#ff6b81"
                text-color="#ff6b81"
                @click="closePolicy()"
              >
                {{ $t("cancel") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                depressed
                dark
                color="#ff6b81"
                @click="policy_show = false"
              >
                {{ $t("agree") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog !nickname && !class -->
    <v-dialog
      persistent
      v-model="chaeckConditions"
      :width="$vuetify.breakpoint.smAndUp ? '60vw' : ''"
    >
      <v-card flat class="pa-2">
        <v-row dense>
          <v-col class="pa-2" align="right">
            <v-btn icon @click="chaeckConditions = false">
              <v-icon color="red"> mdi-close </v-icon>
            </v-btn>
          </v-col>

          <!-- <v-col cols="12" align-self="center" align="center">
            <v-icon style="max-width: 300px; max-height: 300px"
              >mdi-alert-circle</v-icon
            >
          </v-col> -->
          <v-col cols="12" align-self="center" align="center">
            <strong class="text-red-500 text-[30px]">{{
              $t("warning")
            }}</strong>
          </v-col>
          <v-col cols="12" align-self="center" align="center">
            <div class="text-red-500 text-[25px]">
              {{ $t("please filter yourse nickname and class") }}
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import rowData from "@/components/label/rowData.vue";
import headerCard from "@/components/header/headerCard.vue";
import labelCustom from "@/components/label/labelCustom.vue";
import registerDialogForm from "@/components/user_menage/registerDialogForm.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import TermOfUse from "@/components/termOfUse.vue";
import Swal from "sweetalert2";
import { mapActions, mapGetters } from "vuex";
import { inputValidation } from "@/functions/functions";
import moment from "moment";
export default {
  name: "userCourseOrder",
  components: {
    rowData,
    headerCard,
    labelCustom,
    registerDialogForm,
    dialogCard,
    loadingOverlay,
    TermOfUse,
  },
  data: () => ({
    validate_coach: false,
    policy: false,
    policy_show: false,
    usernameExists: false,
    edit_parent: false,
    parent: {
      account_id: "",
      firstname_en: "",
      lastname_en: "",
      username: "",
      tel: "",
    },
    order_data: null,
    user_login: {},
    show_dialog_cart: false,
    dialog_parent: false,
    register_type: "parent",
    disable_add_to_cart: false,
    disable_checkout: false,
    coachSelect: false,
    chaeckConditions: false,
    inputClass: "",
    inputNickName: "",
    myCheckClassData: "",
    otherCheckClassData: "",
  }),
  async created() {
    this.order_data = JSON.parse(localStorage.getItem("Order"));
    this.user_login = JSON.parse(localStorage.getItem("userDetail"));
    await this.GetProfileDetail(this.user_login.account_id);
    await this.GetClassList();
  },
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "register");
    this.changeCourseOrderData(this.order_data);
    if (!this.course_order.course_id) {
      this.$router.replace({ name: "UserKingdom" });
    }
  },
  watch: {
    "course_order.time": function () {
      this.course_order.coach_id = null;
      this.coachSelect = false;
    },

    "course_order.students.find((v) => !v.is_other).class": function (
      newClass
    ) {
      if (newClass !== "อื่นๆ") {
        (this.myCheckClassData = ""), (this.otherCheckClassData = ""); // Reset checkClassData if class is not 'อื่นๆ'
      }
    },

    "course_order.apply_for_parent": function () {
      if (this.course_order.apply_for_parent) {
        this.course_order.students.push({
          student_name: "",
          account_id: "",
          username: "",
          firstname_en: "",
          lastname_en: "",
          tel: "",
          parents: [
            {
              account_id: this.profile_detail.userOneId,
              firstname_en: this.profile_detail.firstNameEng,
              lastname_en: this.profile_detail.lastNameEng,
              firstname_th: this.profile_detail.firstNameTh,
              lastname_th: this.profile_detail.lastNameTh,
              tel: this.profile_detail.mobileNo,
              username: this.profile_detail.userName,
            },
          ],
          is_account: false,
          is_other: true,
          class: null,
          nickName: null,
          otherClass: null,
        });
      } else {
        this.course_order.students.forEach((student, index) => {
          if (student.is_other === true) {
            this.course_order.students.splice(index, 1);
          }
        });
      }
    },
    "course_order.apply_for_yourself": function () {
      if (this.course_order.apply_for_yourself) {
        this.course_order.students.push({
          account_id: this.user_login.account_id,
          student_name: `${this.user_login.first_name_th} ${this.user_login.last_name_th}`,
          username: this.user_login.username,
          firstname_en: this.user_login.first_name_th,
          lastname_en: this.user_login.last_name_th,
          tel: this.user_login.tel,
          parents: [],
          is_account: false,
          is_other: false,
          school: this.profile_detail.school.schoolNameTh,
          congenital: this.profile_detail.congenitalDisease,
          nicknameTh: this.profile_detail.nicknameTh,
          class: this.profile_detail?.class?.classNameTh,
          otherClass: this.otherCheckClassData,
        });
      } else {
        this.course_order.students.forEach((student, index) => {
          if (student.is_other === false) {
            this.course_order.students.splice(index, 1);
          }
        });
      }
    },
    "course_order.apply_for_others": function () {
      if (this.course_order.apply_for_others) {
        this.course_order.students.push({
          student_name: "",
          account_id: "",
          username: "",
          firstname_en: "",
          lastname_en: "",
          tel: "",
          parents: [],
          is_account: false,
          is_other: true,
          class: null,
          nickName: null,
          school: null,
          congenital: null,
          otherClass: null,
        });
      } else {
        this.course_order.students.forEach((student, index) => {
          if (student.is_other === true) {
            this.course_order.students.splice(index, 1);
          }
        });
      }
    },
    last_user_registered: function () {
      if (this.last_user_registered.type === "parent") {
        if (
          this.course_order.students.filter((v) => v.is_other === false)[0]
            .parents.length === 0
        ) {
          this.course_order.students
            .filter((v) => v.is_other === false)[0]
            .parents.push({
              account_id: this.last_user_registered.account_id,
              firstname_en: this.last_user_registered.firstname_en,
              lastname_en: this.last_user_registered.lastname_en,
              firstname_th: this.last_user_registered.firstname_th,
              lastname_th: this.last_user_registered.lastname_th,
              tel: this.last_user_registered.phone_number,
              username: this.last_user_registered.username,
            });
        } else {
          this.course_order.students
            .filter((v) => v.is_other === false)[0]
            .parents.forEach((parent) => {
              parent.account_id = this.last_user_registered.account_id;
              parent.firstname_en = this.last_user_registered.firstname_en;
              parent.lastname_en = this.last_user_registered.lastname_en;
              parent.firstname_th = this.last_user_registered.firstname_th;
              parent.lastname_th = this.last_user_registered.lastname_th;
              parent.phone_number = this.last_user_registered.phone_number;
              parent.username = this.last_user_registered.username;
            });
        }
      } else if (this.last_user_registered.type === "student") {
        let student =
          this.course_order.students[this.course_order.students.length - 1];
        student.account_id = this.last_user_registered.account_id;
        student.firstname_en = this.last_user_registered.firstname_en;
        student.lastname_en = this.last_user_registered.lastname_en;
        student.firstname_th = this.last_user_registered.firstname_th;
        student.lastname_th = this.last_user_registered.lastname_th;
        student.student_name = `${this.last_user_registered.firstname_en} ${this.last_user_registered.lastname_en} `;
        student.tel = this.last_user_registered.phone_number;
        student.username = this.last_user_registered.username;
        student.is_other = true;
        student.is_account = true;
        student.parents = [];
        student.classData = this.last_user_registered?.class?.classNameTh;
        student.nicknameData = this.last_user_registered.nickNameTh;
        student.class = this.last_user_registered?.class?.classNameTh;
        student.nicknameTh = this.last_user_registered.nickNameTh;
        student.school = this.last_user_registered.school;
        student.congenital = this.last_user_registered.congenitalDisease;
        student.schoolData = this.last_user_registered.school;
        student.congenitalData = this.last_user_registered.congenitalDisease;
        student.otherClass = this.otherCheckClassData;
      }
      this.dialog_parent = false;
    },
    "$i18n.locale": function () {
      this.GetCourse(this.order_data.course_id);
    },
  },
  computed: {
    ...mapGetters({
      class_list: "ProfileModules/classList",
      profile_detail: "ProfileModules/getProfileDetail",
      course_order: "OrderModules/getCourseOrder",
      course_data: "CourseModules/getCourseData",
      order: "OrderModules/getOrder",
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      user_data: "loginModules/getUserData",
      user_student_data: "loginModules/getUserStudentData",
      is_loading: "loginModules/getIsLoading",
      order_is_loading: "OrderModules/getOrderIsLoading",
      last_user_registered: "RegisterModules/getLastUserRegistered",
      relations: "OrderModules/getRelations",
      course_student: "CourseModules/getCourseStudent",
      course_is_loading: "CourseModules/getCourseIsLoading",
      course_monitors: "CourseMonitorModules/getCourseMonitor",
      reserve_list: "OrderModules/getReserveList",
      get_user_oneId: "loginModules/getUserOneId",
      course_seat: "CourseModules/getCourseSeats",
      all_course_seat: "CourseModules/getAllSeats",
      check_date: "CourseModules/getCheckDate",

      // getUserOneId
    }),
    coachRules() {
      return [
        (val) => (val || "").length > 5 || this.$t("please select a coach"),
      ];
    },
    usernameRules() {
      return [
        (val) =>
          (val || "").length > 5 ||
          this.$t("please enter a username at least 6 characters long"),
        (val) =>
          (val || "").length < 20 ||
          this.$t("please enter a username no longer than 20 characters"),
        (val) =>
          /[A-Za-z0-9 ]/g.test(val) ||
          this.$t("the username cannot contain special characters"),
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          this.$t("username cannot contain emojis"),
      ];
    },
    setFunctions() {
      if (this.course_order.course_id) {
        this.GetReserceCourse({ course_id: this.course_order.course_id });
      }
      // this.checkMaximumStudent();
      if (this.order_data) {
        if (this.order_data.course_type_id === "CT_1") {
          this.GetCourseStudent({
            course_id: this.course_order.course_id,
            cpo_id: this.course_order.option.course_package_option_id,
          });

          // if (this.course_order.time) {
          //   let checkDayId = [];
          //   let checkTimeId = [];
          //   let checkCoachId = [];
          //   for (const items of this.course_order.time.timeData) {
          //     checkDayId.push(items.dayOfWeekId);
          //     checkTimeId.push(items.timeId);
          //     checkCoachId.push(items.coach_id);
          //   }
          //   this.GetAllSeats({
          //     courseId: this.course_order?.course_id,
          //     coursePackageOptionsId:
          //       this.course_order?.option?.course_package_option_id,
          //     dayOfWeekId: checkDayId,
          //     timeId: checkTimeId,
          //     coachId: checkCoachId,
          //     studentId: "",
          //     courseTypeId: this.course_order?.course_type_id,
          //   });
          // }

          if (this.course_order.course_id) {
            this.GetShortCourseMonitor({
              course_id: this.course_order.course_id,
            });
          }
        } else {
          if (this.course_order.course_id) {
            this.GetShortCourseMonitor({
              course_id: this.course_order.course_id,
            });
          }
        }
        this.GetRelations({
          student_id: this.user_login.account_id,
          parent_id: "",
        });
        this.GetCourse(this.order_data.course_id);
      }
      return "";
    },
    validateButton() {
      if (this.course_order.course_type_id === "CT_1") {
        let time = this.course_order.time ? true : false;
        let day = this.course_order.day ? true : false;
        let coach =
          this.coachSelect || this.course_order.coach_id ? true : false;
        let student = this.course_order.students.length > 0 ? true : false;
        let missingAccountIds =
          this.course_order.students.filter((v) => !v.account_id).length > 0;
        // if (this.course_order.students.length > 0) {
        //   if (
        //     this.course_order.students.filter((v) => !v.account_id).length > 0
        //   ) {
        //     student = false;
        //   } else {
        //     student = true;
        //   }
        // }
        // return !(time && day && coach && student);
        return time && day && coach && student && !missingAccountIds
          ? false
          : true;
      } else {
        // let student = this.course_order.students.length > 0 ? true : false;
        // return !student;
        let hasStudents = this.course_order.students.length > 0;
        let missingAccountIds =
          this.course_order.students.filter((v) => !v.account_id).length > 0;

        let student = hasStudents && !missingAccountIds;
        return !student;

        // let student = true;
        // if (this.course_order.students.length > 0) {
        //   if (
        //     this.course_order.students.filter((v) => !v.account_id).length > 0
        //   ) {
        //     student = false;
        //   }
        // } else {
        //   student = false;
        // }
        // return !student;
      }
    },
  },
  methods: {
    ...mapActions({
      GetClassList: "ProfileModules/GetClassList",
      GetProfileDetail: "ProfileModules/GetProfileDetail",
      GetCourseStudent: "CourseModules/GetCourseStudent",
      GetRelations: "OrderModules/GetRelations",
      GetCourse: "CourseModules/GetCourse",
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
      resetCourseData: "OrderModules/resetCourseData",
      changeOrderData: "OrderModules/changeOrderData",
      changeDialogRegisterOneId:
        "RegisterModules/changenmogeDialogRegisterOneId",
      saveOrder: "OrderModules/saveOrder",
      saveCart: "OrderModules/saveCart",
      checkUsernameOneid: "loginModules/checkUsernameOneid",
      checkUsernameOneidByOrder: "loginModules/checkUsernameOneidByOrder",
      CreateReserveCourse: "OrderModules/CreateReserveCourse",
      GetReserceByCreatedBy: "OrderModules/GetReserceByCreatedBy",
      GetGeneralCourseMonitor: "CourseMonitorModules/GetGeneralCourseMonitor",
      GetShortCourseMonitor: "CourseMonitorModules/GetShortCourseMonitor",
      GetReserceCourse: "OrderModules/GetReserceCourse",
      GetCourseSeats: "CourseModules/GetCourseSeats",
      GetAllSeats: "CourseModules/GetAllSeats",
      GetCheckDate: "CourseModules/GetCheckDate",
    }),
    getCoach() {
      if (this.course_order.time) {
        let checkDayId = [];
        let checkTimeId = [];
        let checkCoachId = [];
        for (const items of this.course_order.time.timeData) {
          checkDayId.push(items.dayOfWeekId);
          checkTimeId.push(items.timeId);
          checkCoachId.push(items.coach_id);
        }
        this.GetAllSeats({
          courseId: this.course_order?.course_id,
          coursePackageOptionsId:
            this.course_order?.option?.course_package_option_id,
          dayOfWeekId: checkDayId,
          timeId: checkTimeId,
          coachId: checkCoachId,
          studentId: "",
          courseTypeId: this.course_order?.course_type_id,
        });
      }
    },

    realtimeCheckNickname(items) {
      this.inputNickName = items;
    },
    realtimeCheckClass(items, datas) {
      this.inputClass = items;
      if (items !== "อื่นๆ") {
        (this.myCheckClassData = ""),
          (this.otherCheckClassData = ""),
          (datas.otherClass = "");
      }
    },
    checkRoleParent() {
      return ["R_4", ""].includes(this.profile_detail.userRoles.roleId);
    },
    closePolicy() {
      this.policy = false;
      this.policy_show = false;
    },
    Validation(e, lang) {
      inputValidation(e, lang);
    },
    ValidateReserve() {
      if (this.course_data.course_status === "Reserve") {
        // console.log('this.course_data.reservation_start_date :>> ', this.course_data.reservation_start_date);
        // console.log('this.course_data.reservation_start_date :>> ', this.course_data.reservation_start_date);
        const today = moment().format("YYYY-MM-DD");
        const start = moment(this.course_data.reservation_start_date).format(
          "YYYY-MM-DD"
        );
        const end = moment(this.course_data.reservation_end_date).format(
          "YYYY-MM-DD"
        );
        if (!(moment(today) >= moment(start) && moment(today) <= moment(end))) {
          return true;
          // let validate_reserve = [];
          // if (this.course_order.students.length > 0) {
          //   for (let student of this.course_order.students) {
          //     validate_reserve.push(
          //       this.reserve_list.some((v) => v.studentId == student.account_id)
          //     );
          //   }
          // }
          // if (validate_reserve.includes(true)) {
          //   return true;
          // } else {
          //   return false;
          // }
        } else {
          let validate_reserve = [];
          if (this.course_order.students.length > 0) {
            for (let student of this.course_order.students) {
              validate_reserve.push(
                this.reserve_list.some((v) => v.studentId == student.account_id)
              );
            }
          } else {
            return true;
          }
          if (validate_reserve.includes(true)) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        let validate_reserve = [];
        if (this.course_order.students.length > 0) {
          for (let student of this.course_order.students) {
            validate_reserve.push(
              this.reserve_list.some((v) => v.studentId === student.account_id)
            );
          }
        } else {
          return true;
        }
        if (validate_reserve.includes(true)) {
          return true;
        } else {
          return false;
        }
      }
    },
    GenCoachNumberStudent(coach_id, dayOfWeekId, timeId, item) {
      let checkPackage = "";
      for (const items of item?.package_data?.options) {
        checkPackage = items.package_id;
      }
      let current_student = 0;
      let maximum_student = 0;
      let course_monitors_filter = this.course_monitors.filter(
        (v) =>
          v.m_coach_id == coach_id &&
          v.m_course_id == this.course_order.course_id &&
          v.m_day_of_week_id === dayOfWeekId &&
          v.m_time_id == timeId &&
          v.m_package_id == checkPackage
      );
      if (course_monitors_filter.length > 0) {
        for (const monitor of course_monitors_filter) {
          current_student = monitor.m_current_student;
          maximum_student = monitor.m_maximum_student;
        }
      } else {
        maximum_student = this.course_order.package_data.students;
      }
      return `(${current_student}/${maximum_student})`;
    },
    GenMonitors() {
      if (this.course_monitors) {
        if (this.course_data.course_status === "Reserve") {
          return "Close";
        } else {
          if (this.course_order.time && this.course_order.coach_id) {
            let time_data = this.course_order.time;
            let dayOfWeekId = time_data?.timeData
              ? time_data?.timeData?.filter(
                  (v) => v.coach_id === this?.course_order?.coach_id
                )[0].dayOfWeekId
              : time_data?.dayOfWeekId;
            let timeId = time_data?.timeData
              ? time_data?.timeData?.filter(
                  (v) => v.coach_id === this?.course_order?.coach_id
                )[0].timeId
              : time_data?.timeId;
            if (this.course_order.course_type_id === "CT_1") {
              let course_monitors_filter = this.course_monitors.filter(
                (v) =>
                  v.m_course_id == this.course_order.course_id &&
                  v.m_day_of_week_id === dayOfWeekId &&
                  v.m_time_id == timeId &&
                  v.m_package_id == this.course_order.option.package_id
              );
              // if (course_monitors_filter.length > 0) {
              //   if (
              //     this.course_order.students.length +
              //       course_monitors_filter[0].m_current_student <=
              //     course_monitors_filter[0].m_maximum_student
              //   ) {
              //     if (
              //       this.course_order.option.package_id ===
              //       course_monitors_filter[0].m_package_id
              //     ) {
              //       return course_monitors_filter[0]?.m_status;
              //     } else {
              //       return "Close";
              //     }
              //   } else {
              //     return "Close";
              //   }
              // } else {
              //   return "Open";
              // }
              // console.log(
              //   this.course_order.students.length +
              //     this.course_seat?.countSeatByCourse
              // );
              if (course_monitors_filter.length > 0) {
                if (
                  this.course_order.students.length +
                    this.course_seat?.countSeatByCourse <=
                  this.course_seat?.maxStudentByCourse
                ) {
                  if (
                    this.course_order.option.package_id ===
                    course_monitors_filter[0].m_package_id
                  ) {
                    return course_monitors_filter[0]?.m_status;
                  } else {
                    return "Close";
                  }
                } else {
                  return "Close";
                }
              } else {
                return "Open";
              }
            }
          }
        }
      } else {
        return "Open";
      }
    },
    coachSelected(coach_id) {
      this.coachSelect = false;
      this.course_order.coach_id = coach_id;

      const matchedData = this?.course_order?.time?.timeData?.find(
        (item) => item.coach_id === coach_id
      );

      this.GetCourseSeats({
        courseId: this.course_order?.course_id,
        coursePackageOptionsId:
          this.course_order?.option?.course_package_option_id,
        dayOfWeekId: matchedData.dayOfWeekId,
        timeId: matchedData.timeId,
        coachId: matchedData.coach_id,
        studentId: "",
        courseTypeId: this.course_order?.course_type_id,
      });
      this.coachSelect = true;
    },
    resetTime() {
      this.course_order.time = null;
      this.course_order.coach_id = null;
    },
    groupByDay(originalArray) {
      return originalArray;
    },
    CreateReserve() {
      let checkNickname = null;
      let checkClass = null;
      let checkSchool = null;
      let checkcongenital = null;
      let roles = "";
      let yourself = this.course_order.apply_for_yourself;

      for (const items of this.course_order?.students) {
        checkNickname = items.nicknameTh ? items.nicknameTh : null;
        checkClass =
          items.class || items.class?.classNameTh
            ? items.class || items.class?.classNameTh
            : null;
        checkSchool = items.school ? items.school : null;
        checkcongenital = items.congenital ? items.congenital : null;
      }
      for (const items of this.user_student_data) {
        roles = items?.roles?.roleId;
      }

      if (
        (roles !== "R_5" && yourself === false && checkNickname) ||
        (roles === "R_5" &&
          checkNickname &&
          checkClass &&
          checkSchool &&
          checkcongenital) ||
        (roles === undefined && checkNickname) ||
        (yourself === true &&
          checkNickname &&
          checkClass &&
          checkSchool &&
          checkcongenital)
      ) {
        if (this.course_order.course_type_id == "CT_1") {
          this.$refs.form_coach.validate();
        } else {
          this.validate_coach = true;
        }
        if (this.validate_coach) {
          Swal.fire({
            icon: "question",
            title: this.$t("want to book this course?"),
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: this.$t("agree"),
            cancelButtonText: this.$t("no"),
          }).then(async (result) => {
            if (result.isConfirmed) {
              if (this.course_order.course_type_id == "CT_1") {
                this.course_order.coach = this.course_order.coach_id;
                this.course_order.coach_name =
                  this.course_order.time.timeData.filter(
                    (v) => v.coach_id === this.course_order.coach_id
                  )[0].coach_name;
              } else {
                this.course_order.time =
                  this.course_data.days_of_class[0].times[0];
                this.course_order.coach_name =
                  this.course_data.coachs[0].coach_name;
                this.course_order.coach = this.course_data.coachs[0].coach_id;
                this.course_order.coach_id =
                  this.course_data.coachs[0].coach_id;
              }
              if (
                this.order.courses.filter(
                  (v) => v.course_id === this.course_order.course_id
                ).length === 0
              ) {
                this.order.courses.push({ ...this.course_order });
              }
              this.order.created_by = this.user_login.account_id;
              this.changeOrderData(this.order);
              let id_coach = "";
              for (const item of this.course_data.coachs) {
                id_coach = item.coach_id;
              }

              this.CreateReserveCourse({
                course_data: this.course_order,
                profile_id: this.profile_detail?.userOneId,
                // profile_data: this.profile_detail,
                coach_id: id_coach,
              });
            }
          });
        }
      } else {
        // this.chaeckConditions = true;
        Swal.fire({
          icon: "warning",
          title: this.$t("something went wrong"),
          text: this.$t("please filter yourse nickname and class"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    },
    checkApplyForYourselfRole() {
      let roles = ["R_1", "R_2", "R_3", "R_4"];
      let is_equal = false;
      if (is_equal === false) {
        for (const role of this.user_login.roles) {
          is_equal = roles.includes(role);
          if (is_equal) {
            return is_equal;
          }
        }
      }
      return is_equal;
    },
    checkMaximumStudent() {
      let max = false;
      if (this.course_order.course_type_id === "CT_1") {
        if (this.course_seat?.maxStudentByCourse) {
          // max =
          //   this.course_seat?.maxStudentByCourse <=
          //   this.course_order.students.length +
          //     this.course_seat?.countSeatByCourse;
          // }
          // if (this.course_order.package_data.students) {
          max =
            this.course_order.package_data.students <=
            this.course_order.students.length;
        }
      } else if (this.course_order.course_type_id === "CT_2") {
        // let check = this.course_monitors[0]?.m_current_student;
        // let count = (check += this.course_order.students.length);
        // max = this.course_data.student_recived <= count;
        // this.course_data.student_recived <= this.course_order.students.length;

        max =
          this.course_seat?.maxStudentByCourse <=
          this.course_order.students.length +
            this.course_seat?.countSeatByCourse;
      }
      return max;
    },
    registerStudent() {
      this.register_type = "student";
      this.changeCourseOrderData(this.course_order);
      this.changeDialogRegisterOneId(true);
    },
    registerParent() {
      this.register_type = "parent";
      this.changeCourseOrderData(this.course_order);
      this.changeDialogRegisterOneId(true);
    },
    openDialogParent() {
      this.parent = {
        account_id: "",
        firstname_en: "",
        lastname_en: "",
        username: "",
        tel: "",
      };
      this.dialog_parent = true;
    },
    addParent() {
      this.course_order.students
        .filter((v) => v.is_other === false)[0]
        .parents.push({
          ...this.parent,
        });
      this.parent = {
        account_id: "",
        firstname_en: "",
        lastname_en: "",
        username: "",
        tel: "",
      };
      this.user_data = [];
      this.changeCourseOrderData(this.course_order);
      this.dialog_parent = false;
    },
    addStudent() {
      if (this.course_order.apply_for_parent) {
        this.course_order.students.push({
          account_id: "",
          student_name: "",
          username: "",
          firstname_en: "",
          lastname_en: "",
          tel: "",
          is_other: true,
          is_account: false,
          parents: [
            {
              account_id: this.profile_detail.userOneId,
              firstname_en: this.profile_detail.firstNameEng,
              lastname_en: this.profile_detail.lastNameEng,
              firstname_th: this.profile_detail.firstNameTh,
              lastname_th: this.profile_detail.lastNameTh,
              tel: this.profile_detail.mobileNo,
              username: this.profile_detail.userName,
            },
          ],
          class: "",
        });
        this.inputClass = "";
      } else {
        this.course_order.students.push({
          account_id: "",
          student_name: "",
          username: "",
          firstname_en: "",
          lastname_en: "",
          tel: "",
          is_other: true,
          is_account: false,
          parents: [],
          school: "",
          congenital: "",
          class: "",
        });
        this.inputClass = "";
      }
    },
    closeDialogCart() {
      this.show_dialog_cart = false;
      this.$router.push({ name: "UserKingdom" });
    },
    addToCart() {
      // let checkNickname = "";
      // let checkClass = "";
      // let roles = "";
      // let yourself = this.course_order.apply_for_yourself;

      // for (const items of this.course_order?.students) {
      //   checkNickname = items.nicknameTh ? items.nicknameTh : null;
      //   checkClass =
      //     items.class || items.class?.classNameTh
      //       ? items.class || items.class?.classNameTh
      //       : null;
      // }
      // for (const items of this.user_student_data) {
      //   roles = items?.roles?.roleId;
      // }

      // if (
      //   (roles !== "R_5" && yourself === false && checkNickname) ||
      //   (roles === "R_5" && checkNickname && checkClass) ||
      //   (roles === undefined && checkNickname) ||
      //   (yourself === true && checkNickname && checkClass)
      // ) {
      if (this.course_order.course_type_id == "CT_1") {
        this.$refs.form_coach.validate();
      } else {
        this.validate_coach = true;
      }
      if (this.validate_coach) {
        Swal.fire({
          icon: "question",
          title: this.$t("want to add to cart?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("no"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            if (this.course_order.course_type_id == "CT_2") {
              let days_of_class = this.course_data.days_of_class[0];
              this.course_order.time = days_of_class.times[0];
              this.course_order.coach_name =
                this.course_data.coachs[0].coach_name;
              this.course_order.coach_id = this.course_data.coachs[0].coach_id;
              this.course_order.coach = this.course_data.coachs[0].coach_id;
            } else {
              this.course_order.coach = this.course_order.coach_id;
              this.course_order.coach_name =
                this.course_order.time.timeData.filter(
                  (v) => v.coach_id === this.course_order.coach_id
                )[0].coach_name;
            }
            this.order.courses.push({ ...this.course_order });
            this.order.created_by = this.user_login.account_id;
            this.changeOrderData(this.order);
            localStorage.setItem(
              this.user_login.account_id,
              JSON.stringify(this.order)
            );
            this.saveCart({
              cart_data: this.order,
              discount: this.course_data?.discount,
              courseData: this.course_data,
            });
            // this.resetCourseData();
            // this.show_dialog_cart = true;
            // Swal.fire({
            //   icon: "success",
            //   title: this.$t("succeed"),
            //   text: this.$t(
            //     "the course has been successfully added to the cart"
            //   ),
            //   showCancelButton: false,
            //   showConfirmButton: false,
            //   showDenyButton: false,
            //   timer: 3000,
            //   timerProgressBar: true,
            // }).finally(() => {
            //   this.$router.push({ name: "CartList" });
            // });
          }
        });
      }
      // } else {
      //   // this.chaeckConditions = true;
      //   Swal.fire({
      //     icon: "warning",
      //     title: this.$t("something went wrong"),
      //     text: this.$t("please filter yourse nickname and class"),
      //     timer: 3000,
      //     showDenyButton: false,
      //     showCancelButton: false,
      //     showConfirmButton: false,
      //     timerProgressBar: true,
      //   });
      // }
    },
    removeParent(student) {
      this.course_order.students
        .filter((v) => v.username === student.username)[0]
        .parents.splice(0, 1);
    },
    removeStudent(student) {
      this.course_order.students.splice(
        this.course_order.students.findIndex(
          (v) => v.username === student.username
        ),
        1
      );
      if (
        this.course_order.students.filter((v) => v.is_other === true).length ===
        0
      ) {
        this.course_order.apply_for_others = false;
      }
    },
    closeDialogParent() {
      this.dialog_parent = false;
    },
    async checkOut() {
      let yourself = this.course_order.apply_for_yourself;

      if (this.course_order.course_type_id == "CT_1") {
        this.$refs.form_coach.validate();
      } else {
        this.validate_coach = true;
      }
      if (this.validate_coach) {
        if (!this.policy) {
          this.policy_show = true;
        } else {
          Swal.fire({
            icon: "question",
            title: this.$t("proceed with payment?"),
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: this.$t("agree"),
            cancelButtonText: this.$t("no"),
          }).then(async (result) => {
            if (result.isConfirmed) {
              if (this.course_order.course_type_id == "CT_1") {
                if (new Date(this.course_data.course_open_date) > new Date()) {
                  this.course_order.start_date =
                    this.course_data.course_open_date;
                } else {
                  this.course_order.start_date = "";
                }
                this.course_order.coach = this.course_order.coach_id;
                this.course_order.coach_name =
                  this.course_order.time.timeData.filter(
                    (v) => v.coach_id === this.course_order.coach_id
                  )[0].coach_name;
              } else {
                //  CT_2

                await this.GetCheckDate({
                  courseId: this.course_data?.course_id,
                  coursePackageOptionsId: "",
                  dayOfWeekId:
                    this.course_data?.days[0]?.times[0]?.timeData[0]
                      ?.dayOfWeekId,
                  timeId:
                    this.course_data?.days[0]?.times[0]?.timeData[0]?.timeId,
                  coachId:
                    this.course_data?.days[0]?.times[0]?.timeData[0]?.coach_id,
                  courseTypeId: this.course_data?.course_type_id,
                  studentId: "",
                });
                if (
                  new Date(this.course_data.course_study_start_date) >
                  new Date()
                ) {
                  this.course_order.start_date =
                    this.course_data.course_study_start_date;
                } else {
                  this.course_order.start_date = "";
                }
                this.course_order.time =
                  this.course_data.days_of_class[0].times[0];
                this.course_order.coach_name =
                  this.course_data.coachs[0].coach_name;
                this.course_order.coach = this.course_data.coachs[0].coach_id;
                this.course_order.coach_id =
                  this.course_data.coachs[0].coach_id;
              }

              if (this.order.courses.length === 0) {
                if (
                  this.order.courses.filter(
                    (v) => v.course_id === this.course_order.course_id
                  ).length === 0
                ) {
                  this.order.courses.push({ ...this.course_order });
                }
              } else {
                this.order.courses = [];
                this.order.courses.push({ ...this.course_order });
              }
              this.order.created_by = this.user_login.account_id;
              this.changeOrderData(this.order);
              if (this.course_order.course_type_id == "CT_1") {
                if (this.course_order.day && this.course_order.time) {
                  this.saveOrder({
                    regis_type: "",
                    my_data_class: this.myCheckClassData,
                    othert_data_class: this.otherCheckClassData,
                    type_checked: yourself,
                    courseData: this.course_data,
                  });
                } else {
                  Swal.fire({
                    icon: "error",
                    text: `${this.$t("invalid data")} ${
                      this.course_order.day
                    } : ${this.course_order.time}`,
                  });
                }
              } else {
                if (this.check_date?.during == "1") {
                  // สามารถซื้อได้

                  await this.saveOrder({
                    regis_type: "",
                    my_data_class: this.myCheckClassData,
                    othert_data_class: this.otherCheckClassData,
                    type_checked: yourself,
                    // course_type_id: this?.course_data?.course_type_id,
                    discount:
                      this?.course_data?.course_type_id == "CT_2"
                        ? this?.course_data?.discount
                        : 0,
                    courseData: this.course_data,
                  });
                } else {
                  await Swal.fire({
                    icon: "error",
                    title: this.$t("unable to register"),
                    text: this.$t("the application period has ended"),
                    timer: 3000,
                    timerProgressBar: true,
                    showCancelButton: false,
                    showConfirmButton: false,
                  });
                }
                // this.saveOrder({ regis_type: "" });
              }
            }
          });
        }
      }
    },
    checkUsername(username, type) {
      if (username) {
        if (type === "student") {
          this.checkUsernameOneidByOrder({
            username: username,
            status: "",
            type: type,
            course_id: this.course_data.course_id,
          }).then(() => {
            if (type === "student") {
              if (
                this.course_order.students.filter(
                  (v) => v.username === username
                ).length === 1
              ) {
                let student = this.course_order.students.filter(
                  (v) => v.username === username
                )[0];
                if (this.user_student_data.length > 0) {
                  student.firstname_en = this.user_student_data[0].firstNameEng;
                  student.lastname_en = this.user_student_data[0].lastNameEng;
                  student.firstname_th = this.user_student_data[0].firstNameTh;
                  student.lastname_th = this.user_student_data[0].lastNameTh;
                  student.student_name = `${this.user_student_data[0].firstNameEng} ${this.user_student_data[0].lastNameEng} `;
                  student.tel = this.user_student_data[0].mobileNo;
                  student.username = username;
                  student.account_id = this.user_student_data[0].userOneId;
                  student.IsWaraphat = this.user_student_data[0].IsWaraphat;
                  student.nicknameTh = this.user_student_data[0].nicknameTh;
                  student.class = this.user_student_data[0]?.class?.classNameTh;
                  student.school =
                    this.user_student_data[0]?.school?.schoolNameTh;
                  student.congenital =
                    this.user_student_data[0]?.congenitalDisease;
                  student.nicknameData = this.user_student_data[0].nicknameTh;
                  student.classData =
                    this.user_student_data[0]?.class?.classNameTh;
                  student.schoolData =
                    this.user_student_data[0]?.school?.schoolNameTh;
                  student.congenitalData =
                    this.user_student_data[0]?.congenitalDisease;
                  student.otherClass =
                    this.user_student_data[0]?.class?.classNameTh;

                  student.role = this.user_student_data[0]?.roles?.roleId;
                } else {
                  if (student) {
                    student.firstname_en = "";
                    student.lastname_en = "";
                    student.firstname_th = "";
                    student.lastname_th = "";
                    student.student_name = "";
                    student.tel = "";
                    student.username = "";
                    student.account_id = "";
                  }
                }
              } else if (
                this.course_order.students.filter(
                  (v) => v.username === username
                ).length > 1
              ) {
                Swal.fire({
                  icon: "warning",
                  title: this.$t("warning"),
                  text: this.$t(
                    "this username has already been entered. please check again"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              }
            }
          });
        } else {
          this.checkUsernameOneid({
            username: username,
            status: "",
            type: type,
            course_id: this.course_data.course_id,
          }).then(() => {
            if (
              this.course_order.students.filter((v) => v.username === username)
                .length === 0
            ) {
              if (this.user_data.length > 0) {
                if (this.edit_parent) {
                  this.edit_parent = false;
                }
                this.parent = {
                  account_id: this.user_data[0].userOneId,
                  username: username,
                  firstname_en: this.user_data[0].firstNameEng,
                  lastname_en: this.user_data[0].lastNameEng,
                  tel: this.user_data[0].mobileNo,
                };
                if (
                  this.course_order.students.filter(
                    (v) => v.is_other === false
                  )[0].parents.length > 0
                ) {
                  let parents = this.course_order.students.filter(
                    (v) => v.is_other === false
                  )[0].parents;
                  parents[0].firstname_en = this.user_data[0].firstNameEng;
                  parents[0].lastname_en = this.user_data[0].lastNameEng;
                  parents[0].tel = this.user_data[0].mobileNo;
                  parents[0].account_id = this.user_data[0].userOneId;
                  parents[0].username = username;
                }
              } else {
                this.parent = {
                  account_id: "",
                  username: "",
                  firstname_en: "",
                  lastname_en: "",
                  tel: "",
                };
                let parents = this.course_order.students.filter(
                  (v) => v.is_other === false
                )[0].parents;
                parents[0].firstname_en = "";
                parents[0].lastname_en = "";
                parents[0].tel = "";
                parents[0].account_id = "";
                parents[0].username = "";
              }
            }
          });
        }
      } else {
        this.user_data = [];
      }
    },
  },
};
</script>
<style>
</style>
