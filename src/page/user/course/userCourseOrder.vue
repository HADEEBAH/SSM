<template>
  <v-app>
    <v-container>
      {{ setFunctions }}
      <!-- <pre>{{ course_data }}</pre> -->
      <ImgCard color="#FEFBFC" outlined class="mb-3">
        <template v-slot:img>
          <v-row dense class="d-flex align-center h-full">
            <v-col>
              <v-img
                class="rounded-lg"
                :src="
                  course_data.course_img || course_data.course_img !== ''
                    ? course_data.course_img
                    : require(`@/assets/course/default_course_img.svg`)
                "
                max-height="122"
                max-width="122"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="#ff6b81"
                    ></v-progress-circular>
                  </v-row> </template
              ></v-img>
            </v-col>
          </v-row>
        </template>
        <template v-slot:header>
          <div class="text-md font-bold">
            {{ `${course_data.course_name_th}(${course_data.course_name_en})` }}
          </div>
          <div class="text-sm">{{ course_data.location }}</div>
        </template>
        <template v-slot:detail>
          <v-row dense>
            <v-col cols="12" sm="6" class="pa-0">
              <rowData mini col_detail="5" icon="mdi-clock-outline">
                {{ course_data.course_hours }} ชม. / ครั้ง</rowData
              >
            </v-col>
            <v-col
              cols="12"
              sm="6"
              class="pa-0"
              v-if="course_data.course_type_id === 'CT_1'"
            >
              <rowData mini col_detail="5" icon="mdi-book-multiple-outline">
                {{ course_order.package }}</rowData
              >
            </v-col>
            <!-- <v-col cols="12" sm="6"  class="pa-0">
                            <rowData mini col_detail="5" icon="mdi-account-group-outline">9 / 15 ที่นั่ง</rowData>
                        </v-col> -->
          </v-row>
        </template>
      </ImgCard>
      <!-- SELECT CLASS DATE -->
      <template v-if="course_order.course_type_id == 'CT_1'">
        <!-- <pre>{{  course_data.days_of_class  }}</pre> -->
        <v-row dense>
          <v-col class="text-lg font-bold"> เลือกช่วงวันเรียน </v-col>
        </v-row>
        <!-- <pre>{{ course_data.days }}</pre>  -->
        <v-radio-group v-model="course_order.day" @change="resetTime">
          <v-row>
            <v-col
              cols="6"
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
            <v-col class="text-lg font-bold">เลือกช่วงเวลาเรียน</v-col>
          </v-row>
          <v-radio-group v-model="course_order.time">
            <v-row>
              <v-col
                cols="6"
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
                  <!-- <v-col v-if="GenReserve() >= time.maximumStudent">
                                        <v-btn @click="CreateReserve(time)" text class="underline" color="#ff6b81">จอง</v-btn>
                                    </v-col> -->
                </v-row>
              </v-col>
            </v-row>
          </v-radio-group>
        </template>
        <template v-if="course_order.time">
          <v-row>
            <v-col class="text-lg font-bold">เลือกโค้ช</v-col>
          </v-row>
          <!-- {{course_data.coachs.filter(v => course_order.day.course_coach_id.includes(v.course_coach_id))}} -->
          <v-autocomplete
            dense
            v-model="course_order.coach_id"
            color="#FF6B81"
            @change="coachSelected($event)"
            :items="course_order.time.timeData"
            item-text="coach_name"
            item-value="coach_id"
            item-color="pink"
            outlined
            placeholder="เลือกโค้ช"
          >
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
                      course_order.coach === item.course_coach_id
                        ? 'font-bold'
                        : ''
                    "
                    >{{ item.coach_name }}
                    {{
                      GenCoachNumberStudent(
                        item.coach_id,
                        item.dayOfWeekId,
                        item.timeId
                      )
                    }}</span
                  ></v-list-item-title
                >
              </v-list-item-content>
              <v-list-item-action>
                <v-icon v-if="course_order.coach === item.course_coach_id"
                  >mdi-check-circle</v-icon
                >
              </v-list-item-action>
            </template>
          </v-autocomplete>
        </template>
      </template>
      <!-- REGISTER -->
      <v-row dense>
        <v-col class="text-lg font-bold"> สมัครเรียนให้ </v-col>
      </v-row>
      <v-row dense class="d-flex align-center">
        <v-col>
          <v-checkbox
            :disabled="
              course_order.apply_for_yourself
                ? false
                : checkMaximumStudent() || checkApplyForYourselfRole()
            "
            v-model="course_order.apply_for_yourself"
            color="#ff6B81"
            label="สมัครเรียนให้ตัวเอง"
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
            ><v-icon>mdi-plus-circle-outline</v-icon>เพิ่มข้อมูลผู้ปกครอง</v-btn
          >
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-checkbox
            :disabled="course_order.apply_for_others ? false : checkMaximumStudent() "
            v-model="course_order.apply_for_others"
            color="#ff6B81"
            label="สมัครเรียนให้ผู้อื่น"
          ></v-checkbox>
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
          <v-col class="text-lg font-bold">{{ `รายชื่อผู้ปกครอง` }}</v-col>
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
                <div>ชื่อ-สกุล</div>
                <div class="pl-2 font-semibold">
                  {{
                    `${relation.parent.parentFirstnameTh} ${relation.parent.parentLastnameTh}`
                  }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <!-- PARENT -->
      <template v-if=" course_order.students.filter((v) => v.is_other === false).length > 0 ">
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
            <v-col class="text-lg font-bold">{{ `ผู้ปกครอง` }}</v-col>
            <v-col cols="auto">
              <v-btn
                @click=" removeParent( course_order.students.filter((v) => v.is_other === false)[0]) "
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
                  <labelCustom text="Username (ถ้ามี)"></labelCustom>
                  <v-text-field
                    :disabled="!edit_parent"
                    @blur=" parent.username > 3 ? checkUsername(parent.username) : ''"
                    @keyup.enter="parent.username > 3 ? checkUsername(parent.username) : '' "
                    dense
                    :rules="rules.usernameRules"
                    @keypress="Validation($event, 'en-number')"
                    outlined
                    v-model="parent.username"
                    placeholder="Username"
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
                    >แก้ไขข้อมูลผู้ปกครอง</v-btn
                  >
                </v-col>
              </v-row>
              <v-row dense v-if="edit_parent">
                <v-col cols="6">
                  <labelCustom text="Username (ถ้ามี)"></labelCustom>
                  <v-text-field
                    :hide-details="!parent.account_id"
                    dense
                    outlined
                    :rules="rules.usernameRules"
                    @keypress="Validation($event, 'en-number')"
                    v-model="parent.username"
                    @change="parent.username > 3 ? checkUsername(parent.username) : ''"
                    @keyup.enter=" parent.username > 3 ? checkUsername(parent.username) : ''"
                    @blur="parent.username > 3 ? checkUsername(parent.username) : '' "
                    placeholder="Username"
                  >
                    <template v-slot:append>
                      <v-icon v-if="parent.account_id" color="green"
                        >mdi-checkbox-marked-circle-outline</v-icon
                      >
                    </template>
                  </v-text-field>
                  <template v-if="!parent.account_id">
                    <label> หากยังไม่มีบัญชีผู้ใช้กรุณา </label>
                    <label
                      class="text-[#ff6b81] underline cursor-pointer mt-5"
                      @click="registerParent"
                      >สมัคร One ID</label
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
                    depressed
                    >ตกลง</v-btn
                  >
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="4">
                  <labelCustom required text="ชื่อ(ภาษาอักฤษ)"></labelCustom>
                  <v-text-field
                    :disabled="user_data.length > 0 || !edit_parent"
                    dense
                    outlined
                    v-model="parent.firstname_en"
                    placeholder="ชื่อภาษาอังกฤษ"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <labelCustom required text="นามสกุล(ภาษาอักฤษ)"></labelCustom>
                  <v-text-field
                    :disabled="user_data.length > 0 || !edit_parent"
                    dense
                    outlined
                    v-model="parent.lastname_en"
                    placeholder="นามสกุลภาษาอังกฤษ"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <labelCustom required text="เบอร์โทรศัพท์"></labelCustom>
                  <v-text-field
                    :disabled="user_data.length > 0 || !edit_parent"
                    dense
                    outlined
                    v-model="parent.tel"
                    placeholder="เบอร์โทรศัพท์"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </template>
      <!-- STUDENT -->
      <div
        v-for="(student, index_student) in course_order.students.filter((v) => v.is_other === true )"
        :key="index_student"
      >
        <v-row dense>
          <v-col cols="auto"
            ><v-icon color="#ff6b81"
              >mdi-card-account-details-outline</v-icon
            ></v-col
          >
          <v-col class="text-lg font-bold">{{
            `ผู้เรียน ${index_student + 1}`
          }}</v-col>
          <!--  v-if="course_order.students.filter(v => v.is_other === true).length > 1" -->
          <v-col cols="auto">
            <v-btn @click="removeStudent(student)" small icon color="red" dark
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <v-card outlined class="mb-3">
          <v-card-text>
            <v-row dense class="d-flex align-start">
              <v-col cols="9" sm="5">
                <labelCustom text="Username (ถ้ามี)"></labelCustom>
                <v-text-field
                  dense
                  outlined
                  :rules="rules.usernameRules"
                  @keypress="Validation($event, 'en-number')"
                  v-model="student.username"
                  @change="
                    student.username.length > 3
                      ? checkUsername(
                          student.username,
                          'student',
                          index_student
                        )
                      : ''
                  "
                  @keyup.enter="
                    student.username.length > 3
                      ? checkUsername(
                          student.username,
                          'student',
                          index_student
                        )
                      : ''
                  "
                  placeholder="Username"
                >
                  <template v-slot:append>
                    <v-icon v-if="student.account_id" color="green"
                      >mdi-checkbox-marked-circle-outline</v-icon
                    >
                  </template>
                </v-text-field>
                <template v-if="!student.account_id">
                  <label> หากยังไม่มีบัญชีผู้ใช้กรุณา </label>
                  <label
                    class="text-[#ff6b81] underline cursor-pointer mt-5"
                    @click="registerStudent"
                    >สมัคร One ID</label
                  >
                </template>
              </v-col>
              <v-col cols="auto" class="mb-2">
                <br />
                <v-btn
                  :loading="is_loading"
                  :dark="!student.username.length < 3"
                  :disabled="student.username.length < 3"
                  color="#ff6b81"
                  @click="
                    checkUsername(student.username, 'student', index_student)
                  "
                  depressed
                  >ตกลง</v-btn
                >
              </v-col>
            </v-row>
            <template v-if="student.account_id">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <labelCustom required text="ชื่อ(ภาษาอักฤษ)"></labelCustom>
                  <v-text-field
                    :disabled="student.account_id ? true : false"
                    dense
                    outlined
                    v-model="student.firstname_en"
                    placeholder="ชื่อภาษาอังกฤษ"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <labelCustom required text="นามสกุล(ภาษาอักฤษ)"></labelCustom>
                  <v-text-field
                    :disabled="student.account_id ? true : false"
                    dense
                    outlined
                    v-model="student.lastname_en"
                    placeholder="นามสกุลภาษาอังกฤษ"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <labelCustom required text="เบอร์โทรศัพท์"></labelCustom>
                  <v-text-field
                    :disabled="student.account_id ? true : false"
                    dense
                    outlined
                    v-model="student.tel"
                    placeholder="เบอร์โทรศัพท์"
                  ></v-text-field>
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
            <v-btn v-if="!checkMaximumStudent()"
              @click="addStudent"
              text
              dense
              color="#ff6b81">
                <v-icon>mdi-plus-circle-outline</v-icon>เพิ่มผู้เรียน
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-row dense>
        <v-col>
          <v-checkbox
            color=pink
            v-model="policy"
            class="inline-block"
          >
            <template v-slot:label>
              ยอมรับ <a class="mx-2 font-weight-bold"> ข้อกำหนดการใช้บริการ </a> และ <a class="mx-2 font-weight-bold" >นโยบายความคุ้มครองข้อมูลส่วนบุคคล</a>
            </template>
        </v-checkbox>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" sm="6">
          <template v-if="course_order.course_type_id === 'CT_1'">
            <v-btn
              v-if="
                course_order.time && course_order.coach_id
                  ? GenMonitors() === 'Open'
                  : false
              "
              class="w-full"
              :disabled="validateButton"
              outlined
              dense
              color="#ff6b81"
              @click="addToCart"
              >เพิ่มไปยังรถเข็น</v-btn
            >
            <v-btn
              v-else
              class="w-full"
              disabled
              outlined
              dense
              color="#ff6b81"
              @click="addToCart"
              >เพิ่มไปยังรถเข็น</v-btn
            >
          </template>
          <template v-else>
            <v-btn
              class="w-full"
              :disabled="validateButton"
              outlined
              dense
              color="#ff6b81"
              @click="addToCart"
              >เพิ่มไปยังรถเข็น</v-btn
            >
          </template>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            v-if=" course_order.time && course_order.coach_id
                ? GenMonitors() === 'Close'
                : false
            "
            class="w-full white--text"
            :disabled="validateButton || ValidateReserve()"
            elevation="0"
            dense
            @click="CreateReserve"
            :color="disable_checkout ? '#C4C4C4' : '#ff6b81'"
            >จอง</v-btn
          >
          <!-- v-if="course_order.time ? GenReserve() < course_order.time.maximumStudent && GenMonitors() === 'Open' : false" -->
          <v-btn
            v-else-if="
              course_order?.time && course_order.coach_id
                ? GenMonitors() === 'Open'
                : false
            "
            class="w-full white--text"
            :disabled="validateButton"
            elevation="0"
            dense
            @click="checkOut"
            :color="disable_checkout ? '#C4C4C4' : '#ff6b81'"
          >
            ชำระเงิน
          </v-btn>
          <v-btn
            v-else
            class="w-full white--text"
            :disabled="validateButton"
            elevation="0"
            dense
            @click="checkOut"
            :color="disable_checkout ? '#C4C4C4' : '#ff6b81'"
            >ชำระเงิน</v-btn
          >
        </v-col>
      </v-row>
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
          title="ผู้ปกครอง"
        >
        </header-card>
        <v-card-text class="pb-2">
          <v-row dense>
            <v-col cols="9">
              <!-- :hide-details="!parent.account_id" -->
              <labelCustom text="Username (ถ้ามี)"></labelCustom>
              <v-text-field
                :rules="rules.usernameRules"
                dense
                outlined
                v-model="parent.username"
                @keypress="Validation($event, 'en-number')"
                @change="parent.username.length > 3 ? checkUsername(parent.username) : '' "
                @keyup.enter=" parent.username.length > 3 ? checkUsername(parent.username) : '' "
                @blur="parent.username.length > 3 ? checkUsername(parent.username) : '' "
                placeholder="Username"
              >
                <template v-slot:append>
                  <v-icon v-if="parent.account_id" color="green"
                    >mdi-checkbox-marked-circle-outline</v-icon
                  >
                </template>
              </v-text-field>
              <template v-if="!parent.account_id">
                <label> หากยังไม่มีบัญชีผู้ใช้กรุณา </label>
                <label
                  class="text-[#ff6b81] underline cursor-pointer mt-5"
                  @click="registerParent"
                  >สมัคร One ID</label
                >
              </template>
            </v-col>
            <v-col cols="auto">
              <br />
              <!-- :disabled="parent.username.length < 3" -->
              <v-btn
                :loading="is_loading"
                :dark="!parent.username.length < 3"
                color="#ff6b81"
                @click="checkUsername(parent.username)"
                depressed
                >ตกลง</v-btn
              >
            </v-col>
          </v-row>
          <template>
            <v-row dense>
              <v-col cols="12">
                <labelCustom required text="ชื่อ(ภาษาอักฤษ)"></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="parent.firstname_en"
                  placeholder="ชื่อภาษาอังกฤษ"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <labelCustom required text="นามสกุล(ภาษาอักฤษ)"></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="parent.lastname_en"
                  placeholder="นามสกุลภาษาอังกฤษ"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <labelCustom required text="เบอร์โทรศัพท์"></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="parent.tel"
                  placeholder="เบอร์โทรศัพท์"
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
                >ยกเลิก</v-btn
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
                >บันทึก</v-btn
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
        <dialog-card checkmark text="เพิ่มคอร์สเรียนไปยังรถเข็นเรียบร้อยแล้ว">
          <template #btn>
            <v-btn
              depressed
              class="w-full"
              dense
              color="#ff6b81"
              dark
              @click="closeDialogCart"
              >ตกลง</v-btn
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
        title="สมัคร One ID"
        :state="register_type"
      ></registerDialogForm>
    </v-dialog>
    <!-- policy -->
    <v-dialog 
      v-model="policy_show" 
      v-if="policy_show" 
      persistent
      :width="$vuetify.breakpoint.smAndUp ? `60vw` : ''"
    >
      <v-card flat class="pa-2">
        <v-row dense>
          <v-col class="pa-2" align="right">
            <v-btn
              icon
              @click="policy_show = false"
            >  
              <v-icon color="red">
                mdi-close
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!-- <v-card-title >
          <v-row dense>
            <v-col align="center">
              policy
            </v-col>
          </v-row>
        </v-card-title> -->
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <TermOfUse/>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-checkbox
                hide-details
                color="pink"
                v-model="policy"
              >
              <template v-slot:label>
                ยอมรับ <a class="mx-2 font-weight-bold"> ข้อกำหนดการใช้บริการ </a> และ <a class="mx-2 font-weight-bold" >นโยบายความคุ้มครองข้อมูลส่วนบุคคล</a>
              </template>
            </v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row dense>
            <v-col align="right">
              <v-btn outlined color="#ff6b81" text-color="#ff6b81" @click="closePolicy()">
                ยกเลิก
              </v-btn>
            </v-col>
            <v-col>
              <v-btn depressed dark color="#ff6b81" @click="policy_show = false">
                ตกลง
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import ImgCard from "@/components/course/imgCard.vue";
import rowData from "@/components/label/rowData.vue";
import headerCard from "@/components/header/headerCard.vue";
import labelCustom from "@/components/label/labelCustom.vue";
import registerDialogForm from "@/components/user_menage/registerDialogForm.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";
import loadingOverlay from "../../../components/loading/loadingOverlay.vue";
import TermOfUse from '@/components/termOfUse.vue'
import Swal from "sweetalert2";
import { mapActions, mapGetters } from "vuex";
import { inputValidation } from "@/functions/functions";

export default {
  name: "userCourseOrder",
  components: {
    ImgCard,
    rowData,
    headerCard,
    labelCustom,
    registerDialogForm,
    dialogCard,
    loadingOverlay,
    TermOfUse
  },
  data: () => ({
    policy : false,
    policy_show : false,
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
    rules: {
      usernameRules: [
        (val) =>
          (val || "").length > 5 ||
          "โปรดระบุชื่อผู้ใช้ความยาวไม่น้อยกว่า 6 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุชื่อผู้ใชความยาวไม่เกิน 20 ตัวอักษร",
        (val) => /[A-Za-z0-9 ]/g.test(val) || "ชื่อผู้ใช้ต้องไม่มีอักขระพิเศษ",
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          "ชื่อผู้ใช้ต้องไม่มีอิโมจิ",
      ],
      passwordRules: [
        (val) =>
          (val || "").length > 7 ||
          "โปรดระบุรหัสผ่านความยาวอย่างน้อย 8 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุรหัสผ่านความยาวไม่เกิน 20 ตัวอักษร",
        (val) => !/[ ]/g.test(val) || "ชื่อผู้ใช้ต้องไม่มีอักขระพิเศษ",
      ],
    },
  }),
  created() {
    this.order_data = JSON.parse(localStorage.getItem("Order"));
    this.user_login = JSON.parse(localStorage.getItem("userDetail"));
    // this.course_order = {...this.order_data}
  },
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "สมัครเรียน");
    this.changeCourseOrderData(this.order_data);
    if (!this.course_order.course_id) {
      this.$router.replace({ name: "UserKingdom" });
    }
  },
  watch: {
    "course_order.time": function () {
      // // console.log(this.course_order)
      this.course_order.coach_id = null;
      this.coachSelect = false;
    },
    "course_order.apply_for_yourself": function () {
      if (this.course_order.apply_for_yourself) {
        // // console.log("user_login => ",this.user_login.username)
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
        this.course_order.students[
          this.course_order.students.length - 1
        ].account_id = this.last_user_registered.account_id;
        this.course_order.students[
          this.course_order.students.length - 1
        ].firstname_en = this.last_user_registered.firstname_en;
        this.course_order.students[
          this.course_order.students.length - 1
        ].lastname_en = this.last_user_registered.lastname_en;
        this.course_order.students[
          this.course_order.students.length - 1
        ].firstname_th = this.last_user_registered.firstname_th;
        this.course_order.students[
          this.course_order.students.length - 1
        ].lastname_th = this.last_user_registered.lastname_th;
        this.course_order.students[
          this.course_order.students.length - 1
        ].student_name = `${this.last_user_registered.firstname_en} ${this.last_user_registered.lastname_en} `;
        this.course_order.students[this.course_order.students.length - 1].tel =
          this.last_user_registered.phone_number;
        this.course_order.students[
          this.course_order.students.length - 1
        ].username = this.last_user_registered.username;
        this.course_order.students[
          this.course_order.students.length - 1
        ].is_other = true;
        this.course_order.students[
          this.course_order.students.length - 1
        ].is_account = true;
        this.course_order.students[
          this.course_order.students.length - 1
        ].parents = [];
      }
      this.dialog_parent = false;
    },
    "course_order.coach_id": function () {
      // console.log("course_order.coach_id :", this.course_order.coach_id);
    },
  },
  computed: {
    ...mapGetters({
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
    }),
    setFunctions() {
      this.GetReserceByCreatedBy({ account_id: this.user_login.account_id });
      this.checkMaximumStudent();
      if (this.order_data) {
        if (this.order_data.course_type_id === "CT_1") {
          this.GetCourseStudent({
            course_id: this.course_order.course_id,
            cpo_id: this.course_order.option.course_package_option_id,
          });
          this.GetShortCourseMonitor({
            course_id: this.course_order.course_id,
          });
          // this.GetGeneralCourseMonitor({course_id: this.course_order.course_id, cpo_id: this.course_order.option.course_package_option_id})
        } else {
          this.GetShortCourseMonitor({
            course_id: this.course_order.course_id,
          });
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
      if (this.course_order.coach_id) {
        this.GenMonitors();
        this.ValidateReserve();
      }
      // // console.log(this.course_order.coach_id)
      if (this.course_order.course_type_id === "CT_1") {
        let time = this.course_order.time ? true : false;
        let day = this.course_order.day ? true : false;
        let coach =
          this.coachSelect || this.course_order.coach_id ? true : false;
        let student = false;
        if (this.course_order.students.length > 0) {
          if (
            this.course_order.students.filter((v) => !v.account_id).length > 0
          ) {
            student = false;
          } else {
            student = true;
          }
        }
        // // console.log(time && day && coach && student);
        return !(time && day && coach && student);
      } else {
        let student = true;
        if (this.course_order.students.length > 0) {
          if (
            this.course_order.students.filter((v) => !v.account_id).length > 0
          ) {
            student = false;
          }
        } else {
          student = false;
        }
        return !student;
      }
    },
  },
  methods: {
    ...mapActions({
      GetCourseStudent: "CourseModules/GetCourseStudent",
      GetRelations: "OrderModules/GetRelations",
      GetCourse: "CourseModules/GetCourse",
      changeCourseOrderData: "OrderModules/changeCourseOrderData",
      resetCourseData: "OrderModules/resetCourseData",
      changeOrderData: "OrderModules/changeOrderData",
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      saveOrder: "OrderModules/saveOrder",
      saveCart: "OrderModules/saveCart",
      checkUsernameOneid: "loginModules/checkUsernameOneid",
      checkUsernameOneidByOrder :"loginModules/checkUsernameOneidByOrder",
      CreateReserveCourse: "OrderModules/CreateReserveCourse",
      GetReserceByCreatedBy: "OrderModules/GetReserceByCreatedBy",
      // monitor
      GetGeneralCourseMonitor: "CourseMonitorModules/GetGeneralCourseMonitor",
      GetShortCourseMonitor: "CourseMonitorModules/GetShortCourseMonitor",
    }),
    closePolicy(){
      this.policy = false
      this.policy_show = false
    },
    Validation(e, lang) {
      inputValidation(e, lang);
    },
    ValidateReserve() {
      // // console.log(this.reserve_list)
      // // console.log("ValidateReserve",this.reserve_list.filter(v => v.courseId === this.course_order.course_id && v.coachId === this.course_order.coach_id))
      if (
        this.reserve_list.filter(
          (v) =>
            v.courseId === this.course_order.course_id &&
            v.coachId === this.course_order.coach_id
        ).length > 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    GenCoachNumberStudent(coach_id, dayOfWeekId, timeId) {
      // let time_data = this.course_order.time;
      // console.log(coach_id, dayOfWeekId, timeId);
      let current_student = 0;
      let maximum_student = 0;
      // console.log(coach_id);
      let course_monitors_filter = this.course_monitors.filter(
        (v) =>
          v.m_coach_id == coach_id &&
          v.m_course_id == this.course_order.course_id &&
          v.m_day_of_week_id === dayOfWeekId &&
          v.m_time_id == timeId
      );
      if (course_monitors_filter.length > 0) {
        for (const monitor of course_monitors_filter) {
          current_student = monitor.m_current_student;
          maximum_student = monitor.m_maximum_student;
        }
      } else {
        // console.log(this.course_order);
        maximum_student = this.course_order.package_data.students;
      }
      return `(${current_student}/${maximum_student})`;
    },
    GenMonitors() {
      if (this.course_monitors) {
        if (this.course_order.time && this.course_order.coach_id) {
          let time_data = this.course_order.time;
          // // console.log(time_data.timeData)
          let dayOfWeekId = time_data?.timeData
            ? time_data.timeData.filter(
                (v) => v.coach_id === this.course_order.coach_id
              )[0].dayOfWeekId
            : time_data.dayOfWeekId;
          let timeId = time_data?.timeData
            ? time_data.timeData.filter(
                (v) => v.coach_id === this.course_order.coach_id
              )[0].timeId
            : time_data.timeId;
          if (this.course_order.course_type_id === "CT_1") {
            let course_monitors_filter = this.course_monitors.filter(
              (v) =>
                v.m_course_id == this.course_order.course_id &&
                v.m_day_of_week_id === dayOfWeekId &&
                v.m_time_id == timeId
            );
            if (course_monitors_filter.length > 0) {
              if (
                this.course_order.students.length +
                  course_monitors_filter[0].m_current_student <=
                course_monitors_filter[0].m_maximum_student
              ) {
                if ( this.course_order.option.course_package_option_id === course_monitors_filter[0].m_course_package_options_id) {
                  return course_monitors_filter[0]?.m_status;
                } else if(course_monitors_filter[0]?.m_status === "Open" && course_monitors_filter[0]?.m_current_student <= course_monitors_filter[0].m_maximum_student){
                  // // console.log("1167");
                  return "Open"
                }else{
                  // // console.log("1169");
                  return "Close";
                }
              } else {
                // // console.log("1174")
                return "Close";
              }
            } else {
              // // console.log("1178")
              return "Open";
            }
          }
        }
      } else {
        // console.log("1184")
        return "Open";
      }
    },
    coachSelected(coach_id) {
      this.coachSelect = true;
      this.course_order.coach_id = coach_id;
      // this.validateButton
    },
    resetTime() {
      this.course_order.time = null;
      this.course_order.coach_id = null;
    },
    groupByDay(originalArray) {
      return originalArray;
    },
    CreateReserve() {
      Swal.fire({
        icon: "question",
        title: "ต้องการจองคอร์สนี้ใช่หรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (this.course_order.course_type_id == "CT_1") {
            this.course_order.coach = this.course_order.coach_id;
            this.course_order.coach_name =
              this.course_order.time.timeData.filter(
                (v) => v.coach_id === this.course_order.coach_id
              )[0].coach_name;
          } else {
            this.course_order.time = this.course_data.days_of_class[0].times[0];
            this.course_order.coach_name =
              this.course_data.coachs[0].coach_name;
            this.course_order.coach = this.course_data.coachs[0].coach_id;
            this.course_order.coach_id = this.course_data.coachs[0].coach_id;
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
          // console.log(this.course_order);
          this.CreateReserveCourse({ course_data: this.course_order });
        }
      });
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
    dayOfWeekArray(day) {
      const daysOfWeek = [
        "วันอาทิตย์",
        "วันจันทร์",
        "วันอังคาร",
        "วันพุธ",
        "วันพฤหัสบดี",
        "วันศุกร์",
        "วันเสาร์",
      ];

      const validDays = day.filter((d) => d >= 0 && d <= 6);
      if (validDays) {
        const firstThreeDays = validDays.map((d) => daysOfWeek[d]);
        return `${firstThreeDays.join(" , ")}`;
      } else {
        return "Invalid days";
      }
    },
    checkMaximumStudent() {
      let max = false;
      if (this.course_order.course_type_id === "CT_1") {
        if (this.course_order.package_data.students) {
          max =
            this.course_order.package_data.students <=
            this.course_order.students.length;
        }
      } else if (this.course_order.course_type_id === "CT_2") {
        max = false;
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
      });
    },
    closeDialogCart() {
      this.show_dialog_cart = false;
      this.$router.push({ name: "UserKingdom" });
    },
    addToCart() {
      Swal.fire({
        icon: "question",
        title: "ต้องการเพิ่มเข้าตะกร้าใช่หรือไม่ ?",
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
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
          this.saveCart({ cart_data: this.order });
          this.resetCourseData();
          this.show_dialog_cart = true;
        }
      });
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
    checkOut() {
      if(!this.policy){
        this.policy_show = true
      }else{
        Swal.fire({
        icon: "question",
        title: "ดำเนินการชำระเงินใช่หรือไม่ ?",
        showDenyButton: false,
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
        }).then(async (result) => {
          if (result.isConfirmed) {
            if (this.course_order.course_type_id == "CT_1") {
              if (new Date(this.course_data.course_open_date) > new Date()) {
                this.course_order.start_date = this.course_data.course_open_date;
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
              if (
                new Date(this.course_data.course_study_start_date) > new Date()
              ) {
                this.course_order.start_date =
                  this.course_data.course_study_start_date;
              } else {
                this.course_order.start_date = "";
              }
              this.course_order.time = this.course_data.days_of_class[0].times[0];
              this.course_order.coach_name =
                this.course_data.coachs[0].coach_name;
              this.course_order.coach = this.course_data.coachs[0].coach_id;
              this.course_order.coach_id = this.course_data.coachs[0].coach_id;
            }
            if( this.order.courses.length === 0){
              if ( this.order.courses.filter((v) => v.course_id === this.course_order.course_id).length === 0
              ) { this.order.courses.push({ ...this.course_order }); }
            }else{
              this.order.courses = []
              this.order.courses.push({ ...this.course_order }); 
            }
            this.order.created_by = this.user_login.account_id;
            this.changeOrderData(this.order);
            if (this.course_order.course_type_id == "CT_1") {
              if (this.course_order.day && this.course_order.time) {
                this.saveOrder();
              } else {
                Swal.fire({
                  icon: "error",
                  text: `ข้อมูลไม่ถูกต้อง ${this.course_order.day} : ${this.course_order.time}`,
                });
              }
            } else {
              this.saveOrder();
            }
          }
        });
      }
      
    },
    checkUsername(username, type) {
      if (username) {
        if (type === "student") {
          this.checkUsernameOneidByOrder({
          username: username,
          status: "",
          type: type,
          course_id : this.course_data.course_id
          }).then(() => {
            // // console.log(this.course_order.students.filter((v) => v.username === username))
              if (type === "student") {
                if(this.course_order.students.filter((v) => v.username === username).length === 1){
                    let student = this.course_order.students.filter((v) => v.username === username)[0]
                    if (this.user_student_data.length > 0) {
                      student.firstname_en = this.user_student_data[0].firstNameEng;
                      student.lastname_en = this.user_student_data[0].lastNameEng;
                      student.firstname_th = this.user_student_data[0].firstNameTh;
                      student.lastname_th = this.user_student_data[0].lastNameTh;
                      student.student_name = `${this.user_student_data[0].firstNameEng} ${this.user_student_data[0].lastNameEng} `;
                      student.tel = this.user_student_data[0].mobileNo;
                      student.username = username;
                    student.account_id = this.user_student_data[0].userOneId;
                    } else {
                      if(student){
                        student.firstname_en = ""
                        student.lastname_en = ""
                        student.firstname_th = ""
                        student.lastname_th = ""
                        student.student_name = ""
                        student.tel =""
                        student.username = ""
                        student.account_id = ""
                      }else{
                        // console.log(student)
                      }
                    }
                  }else if(this.course_order.students.filter((v) => v.username === username).length > 1){
                    Swal.fire({
                      icon: "error",
                      title: "ชื่อผู้ใช้นี้ถูกใส่ข้อมูลมาแล้ว กรุณาตรวจสอบอีกครั้ง"
                    })
                }
              }
          });
        }else{
          this.checkUsernameOneid({
          username: username,
          status: "",
          type: type,
          course_id : this.course_data.course_id
          }).then(() => {
            // // console.log(this.course_order.students.filter((v) => v.username === username))
            if(this.course_order.students.filter((v) => v.username === username).length === 0){
              // console.log(this.user_data)
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
                if ( this.course_order.students.filter((v) => v.is_other === false )[0].parents.length > 0) {
                  let parents = this.course_order.students.filter( (v) => v.is_other === false )[0].parents;
                  parents[0].firstname_en = this.user_data[0].firstNameEng;
                  parents[0].lastname_en = this.user_data[0].lastNameEng;
                  parents[0].tel = this.user_data[0].mobileNo;
                  parents[0].account_id = this.user_data[0].userOneId;
                  parents[0].username = username;
                }
              }else{
                this.parent = {
                  account_id: "",
                  username: "",
                  firstname_en: "",
                  lastname_en: "",
                  tel: ""
                };
                let parents = this.course_order.students.filter( (v) => v.is_other === false )[0].parents;
                parents[0].firstname_en = ""
                parents[0].lastname_en = ""
                parents[0].tel = ""
                parents[0].account_id = ""
                parents[0].username = ""
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
