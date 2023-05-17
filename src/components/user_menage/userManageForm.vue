<template>
  <v-container fluid class="overflow-x-hidden overflow-y-hidden">
    <v-row dense class="mt-5">
      <!-- {{ show_by_id }} -->
      <v-col cols="12">
        <headerPage :breadcrumbs="breadcrumbs"></headerPage>
        <v-card class="rounded-lg">
          <v-container fluid>
            <v-row dense>
              <v-col cols="12">
                <headerCard
                  :icon="'mdi-card-account-details-outline'"
                  :icon_color="'#FF6B81'"
                  :title="title"
                ></headerCard>
                <v-divider></v-divider>

                <v-card class="rounded-lg my-3" color="#FCFCFC">
                  <v-card-text>
                    <v-row justify="between">
                      <v-col cols="12" sm="6">
                        <label-custom text="Username(English)"></label-custom>
                        <v-text-field
                          placeholder="กรุณาระบุชื่อผู้ใช้งาน(ภาษาอังกฤษ)"
                          @keypress="validate($event, 'en-number')"
                          v-model="show_by_id.userName"
                          hide-details
                          outlined
                          dense
                          disabled
                        >
                          <template #append>
                            <v-icon color="green"
                              >mdi-checkbox-marked-circle-outline</v-icon
                            >
                          </template>
                        </v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        offset-sm="2"
                        sm="4"
                        class="align-self-center"
                      >
                        <v-img
                          :class="
                            MobileSize ? `mx-auto w-2/4` : `ml-auto w-2/5`
                          "
                          src="@/assets/manageuser/logo_one platform.svg"
                      /></v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <!--DETAIL -->
              <v-col cols="12">
                <v-card class="rounded-lg my-3" color="#FCFCFC">
                  <v-card-text>
                    <v-row>
                      <v-col
                        class="webkit-center"
                        cols="12"
                        sm="5"
                        align-self="center"
                      >
                        <div class="cicle">
                          <v-img
                            v-if="!show_by_id.image && preview_img == ''"
                            class="image-cropper items-end"
                            src="../../assets/userManagePage/default_img_update_profile.svg"
                          >
                            <v-btn
                              v-if="preview_img == ''"
                              color="#ff6b81"
                              @click="openFileSelector"
                              class="w-full white--text"
                              >เพิ่มรูป</v-btn
                            >
                            <v-btn
                              v-if="preview_img !== ''"
                              color="#ff6b81"
                              @click="removeImg"
                              class="w-full white--text"
                            >
                              <span class="mdi mdi-close">ยกเลิก</span>
                            </v-btn>
                          </v-img>

                          <v-img
                            v-else
                            class="image-cropper items-end"
                            :src="
                              preview_img != ''
                                ? preview_img
                                : show_by_id != ''
                                ? show_by_id.image
                                : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC_N_JBXW49fAT5BDrX0izmY5Z8lx-we3Oag&usqp=CAU`
                            "
                          >
                            <v-btn
                              v-if="preview_img == ''"
                              color="#ff6b81"
                              @click="openFileSelector"
                              class="w-full white--text"
                              >เปลี่ยนรูป</v-btn
                            >
                            <v-btn
                              v-if="preview_img !== ''"
                              color="#ff6b81"
                              @click="removeImg"
                              class="w-full white--text"
                            >
                              <span class="mdi mdi-close">ยกเลิก</span>
                            </v-btn>
                          </v-img>
                        </div>
                        <input
                          id="fileInput"
                          ref="fileInput"
                          type="file"
                          @change="uploadFile"
                          accept="image/*"
                          hidden
                        />
                      </v-col>

                      <!-- NAME DETAIL -->
                      <v-col cols="12" sm="7">
                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
                            <!-- @keypress="validate($event, 'th-special')" -->

                            <v-text-field
                              @keypress="validate($event, 'th')"
                              placeholder="-"
                              v-model="show_by_id.firstNameTh"
                              :rules="rules.name"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="นามสกุล (ภาษาไทย)"
                            ></label-custom>
                            <v-text-field
                              @keypress="validate($event, 'th')"
                              placeholder="-"
                              v-model="show_by_id.lastNameTh"
                              :rules="rules.name"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="First Name (English)"
                            ></label-custom>
                            <v-text-field
                              v-bind:disabled="isDisabled"
                              @keypress="validate($event, 'en-special')"
                              placeholder="-"
                              v-model="show_by_id.firstNameEng"
                              :rules="rules.name"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="Last Name (English)"
                            ></label-custom>
                            <v-text-field
                              v-bind:disabled="isDisabled"
                              @keypress="validate($event, 'en-special')"
                              placeholder="-"
                              v-model="show_by_id.lastNameEng"
                              :rules="rules.name"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom text="อีเมล"></label-custom>
                            <v-text-field
                              disabled
                              placeholder="-"
                              v-model="show_by_id.email"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom text="เบอร์โทรศัพท์"></label-custom>
                            <v-text-field
                              disabled
                              @keypress="validate($event, 'number')"
                              v-model="show_by_id.mobileNo"
                              :rules="rules.name"
                              outlined
                              dense
                              required
                              @input="checkPhoneNumber"
                              maxlength="12"
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <!-- การจัดการสิทธิ์ ไม่มี Role-->
          <v-container fluid v-if="show_by_id.userRoles.length <= 0">
            <v-row>
              <v-col cols="12">
                <headerCard
                  :icon="'mdi-card-account-details-outline'"
                  :icon_color="'#FF6B81'"
                  :title="titlePermissionManage"
                ></headerCard>
                <v-divider></v-divider>
                <v-card class="rounded-lg my-3" color="#FCFCFC">
                  <v-card-text>
                    <v-row class="mr-3 ml-3">
                      <v-col cols="12" sm="5">
                        <label-custom text="บทบาทผู้ใช้งาน"></label-custom>
                        <v-autocomplete
                          dense
                          v-model="seledtedRole"
                          :items="roles"
                          item-text="role"
                          item-value="roleNumber"
                          label="กรุณาเลือกบทบาทผู้ใช้งาน"
                          solo
                          item-color="#ff6b81"
                          color="#ff6b81"
                          @change="selectRole(seledtedRole)"
                        >
                          <template v-slot:item="{ item }">
                            <v-list-item-content>
                              {{ item.role }}
                            </v-list-item-content>
                            <!-- <v-list-item-action>
                              <v-icon color="#FF6B81">
                                {{
                                  selectRoles.includes(item.role)
                                    ? "mdi-checkbox-marked"
                                    : "mdi-checkbox-blank-circle-outline"
                                }}</v-icon
                              >
                            </v-list-item-action> -->
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <!-- การจัดการสิทธิ์ มี role -->
          <v-container
            fluid
            v-for="(item, index) in show_by_id.userRoles"
            :key="index"
          >
            <v-row dense>
              <v-col cols="12">
                <headerCard
                  :icon="'mdi-card-account-details-outline'"
                  :icon_color="'#FF6B81'"
                  :title="titlePermissionManage"
                ></headerCard>
                <v-divider></v-divider>
                <v-card class="rounded-lg mt-5" color="#FCFCFC">
                  <v-card-text class="mt-3">
                    <v-row class="mr-3 ml-3">
                      <v-col cols="12" sm="5">
                        <label-custom text="บทบาทผู้ใช้งาน"></label-custom>
                        <v-autocomplete
                          dense
                          v-model="seledtedRole"
                          :items="roles"
                          item-text="role"
                          item-value="roleNumber"
                          label="กรุณาเลือกบทบาทผู้ใช้งาน"
                          solo
                          item-color="#ff6b81"
                          color="#ff6b81"
                          @change="selectRole(seledtedRole)"
                        >
                          <template v-slot:item="{ item }">
                            <v-list-item-content>
                              {{ item.role }}
                            </v-list-item-content>
                            <!-- <v-list-item-action>
                              <v-icon color="#FF6B81">
                                {{
                                  seledtedRole.includes(item.role)
                                    ? "mdi-checkbox-marked-circle"
                                    : "mdi-checkbox-blank-circle-outline"
                                }}</v-icon
                              >
                            </v-list-item-action> -->
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <!-- <v-container
                  grid-list-xs
                  
                > -->
              <!-- <v-row v-if="seledtedRole === 'R_4' || seledtedRole === 'R_5'"> -->
              <v-col
                v-if="seledtedRole === 'R_4' || seledtedRole === 'R_5'"
                cols="12"
              >
                <headerCard
                  class="mt-5"
                  :icon="'mdi-file-plus-outline'"
                  :icon_color="'#FF6B81'"
                  :title="
                    item.roleId === 'R_4'
                      ? 'เพิ่มข้อมูลนักเรียนในการดูแล'
                      : 'เพิ่มข้อมูลผู้ปกครอง'
                  "
                ></headerCard>
                <v-divider></v-divider>

                <v-card
                  v-if="data_user_relation_management.length <= 0"
                  class="rounded-lg my-3"
                >
                  <v-card-text
                    class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
                  >
                    <span class="text-lg font-bold">
                      <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                      {{
                        item.roleId === "R_5"
                          ? `ไม่พบข้อมูลของผู้ปกครอง`
                          : `ไม่พบข้อมูลของนักเรียนในการดูแล`
                      }}
                    </span>
                  </v-card-text>
                </v-card>

                <v-card
                  v-else
                  class="rounded-lg my-5"
                  color="#FCFCFC"
                  v-for="(
                    relations, index_relations
                  ) in data_user_relation_management"
                  :key="index_relations"
                >
                  <v-card-text>
                    <v-col align="right">
                      <v-icon
                        larg
                        color="#FF6B81"
                        @click="removeRelations(relations)"
                        v-if="data_user_relation_management.length >= 1"
                      >
                        mdi-delete
                      </v-icon>
                    </v-col>
                    <v-row dense align="center">
                      <v-col cols="12" sm="6">
                        <label-custom
                          :text="
                            item.roleId === 'R_4'
                              ? 'Student’s Username (English)'
                              : 'Parent’s Username (English)'
                          "
                        ></label-custom>
                        <v-text-field
                          outlined
                          dense
                          disabled
                          v-if="item.roleId === 'R_4'"
                          :value="relations.student.studentUsername"
                        ></v-text-field>
                        <v-text-field
                          outlined
                          dense
                          disabled
                          v-else
                          :value="relations.parent.parentUsername"
                        ></v-text-field>
                        <!-- <div>
                          {{
                            item.roleId === "R_4"
                              ? relations.student.studentUsername
                              : relations.parent.parentUsername
                          }}
                        </div> -->
                      </v-col>

                      <v-col cols="12" sm="6">
                        <label-custom
                          text="First Name (English)"
                        ></label-custom>
                        <v-text-field
                          outlined
                          dense
                          disabled
                          v-if="item.roleId === 'R_4'"
                          :value="relations.student.studentFirstnameEn"
                        ></v-text-field>
                        <v-text-field
                          outlined
                          dense
                          disabled
                          v-else
                          :value="relations.parent.parentFirstnameEn"
                        ></v-text-field>
                        <!-- <div>
                                {{
                                  item.roleId === "R_4"
                                    ? relations.student.studentFirstnameEn
                                    : relations.parent.parentFirstnameEn
                                }}
                              </div> -->
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom text="Last Name (English)"></label-custom>
                        <v-text-field
                          outlined
                          dense
                          disabled
                          v-if="item.roleId === 'R_4'"
                          :value="relations.parent.parentLastnameEn"
                        ></v-text-field>
                        <v-text-field
                          outlined
                          dense
                          disabled
                          v-else
                          :value="relations.parent.parentLastnameEn"
                        ></v-text-field>

                        <!-- <div>
                                {{
                                  item.roleId === "R_4"
                                    ? relations.student.studentLastnameEn
                                    : relations.parent.parentLastnameEn
                                }}
                              </div> -->
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom text="เบอร์โทรศัพท์"></label-custom>
                        <v-text-field
                          outlined
                          dense
                          disabled
                          v-if="item.roleId === 'R_4'"
                          :value="relations.student.studentTel"
                        ></v-text-field>
                        <v-text-field
                          outlined
                          dense
                          disabled
                          v-else
                          :value="relations.parent.parentTel"
                        ></v-text-field>

                        <!-- <div>
                                {{
                                  item.roleId === "R_4"
                                    ? relations.student.studentTel
                                    : relations.parent.parentTel
                                }}
                              </div> -->
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <!-- </v-row> -->
              <!-- </v-container> -->

              <!-- check box In relations -->
              <!-- <v-row v-if="item.roleId === 'R_4' || item.roleId === 'R_5'"> -->
              <v-col
                cols="12"
                sm="6"
                v-if="item.roleId === 'R_4' || item.roleId === 'R_5'"
              >
                <v-checkbox
                  v-model="isCheckedRelation"
                  :label="
                    item.roleId === 'R_4'
                      ? 'ต้องการเพิ่มนักเรียนในการดูแล'
                      : 'ต้องการเพิ่มผู้ปกครอง'
                  "
                  value="Jacob"
                  color="pink"
                  item-color="pink"
                  @change="onCheckboxChange(item.roleId)"
                ></v-checkbox>
              </v-col>
              <!-- </v-row> -->

              <!-- เพิ่มความสัมพันธ์ -->
              <!-- <v-row dense v-if="isCheckedRelation"> -->
              <v-col cols="12" class="text-center" v-if="isCheckedRelation">
                <v-btn
                  dense
                  outlined
                  color="#ff6b81"
                  @click="
                    openAddRelationsDialog(relation.username, item.roleId)
                  "
                >
                  <v-icon>mdi-plus-circle-outline</v-icon
                  >{{
                    item.roleId === "R_4"
                      ? "เพิ่มข้อมูลนักเรียน"
                      : "เพิ่มข้อมูลผู้ปกครอง"
                  }}</v-btn
                >
              </v-col>
              <!-- </v-row> -->
              <!-- ----------------------------------------------- -->

              <!-- TABLE Role PARENT -->
              <v-col cols="12" v-if="item.roleId === 'R_4'">
                <headerCard
                  :icon="'mdi-school-outline'"
                  :icon_color="'#FF6B81'"
                  :title="titleCourseDetail"
                ></headerCard>
                <v-divider></v-divider>
                <v-data-table
                  :headers="roleParentTable"
                  @page-count="pageCount = $event"
                  class="elevation-1 header-table"
                  :items="student_schedule"
                  :search="search"
                >
                  <template v-slot:[`item.dates`]="{ item }">
                    {{ dayOfWeekName(item.dates.day) }}
                    <!-- ({{
                          getThaiDayOfWeek(item.dates.day)
                        }}) -->
                  </template>
                </v-data-table>
              </v-col>

              <!-- TABLE Role STUDENT -->
              <v-col cols="12" v-if="item.roleId === 'R_5'">
                <headerCard
                  :icon="'mdi-school-outline'"
                  :icon_color="'#FF6B81'"
                  :title="titleCourseDetail"
                ></headerCard>
                <v-divider></v-divider>
                <v-data-table
                  :headers="roleStudentTable"
                  @page-count="pageCount = $event"
                  class="elevation-1 header-table"
                  :items="student_schedule"
                  :search="search"
                >
                  <template v-slot:[`item.dates`]="{ item }">
                    {{ dayOfWeekName(item.dates.day) }}
                    <!-- ({{
                          getThaiDayOfWeek(item.dates.day)
                        }}) -->
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>

          <v-col class="text-right mt-5">
            <v-btn
              depressed
              class="white--text"
              color="#ff6b81"
              @click="updateData(show_by_id.userOneId)"
            >
              บันทึก
            </v-btn>
          </v-col>
        </v-card>
      </v-col>
    </v-row>

    <!-- CHECK RELATIONs DIALOG-->
    <v-dialog
      v-model="add_relations"
      :width="$vuetify.breakpoint.smAndUp ? '50vw' : ''"
      class="w-full d-flex align-center"
    >
      <v-card
        class="pa-2 w-full"
        :width="$vuetify.breakpoint.smAndUp ? '50vw' : ''"
      >
        <!-- <header-card
          icon="mdi-card-account-details-outline"
          icon_color="#ff6b81"
          :title="global_role_id === 'R_4' ? 'เพิ่มนักเรียน2' : 'เพิ่มผู้ปกครอง'"
        >
          <template #actions>
            <v-btn icon @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
          </template>
        </header-card> -->

        <v-app-bar flat color="white">
          <v-toolbar-title class="text-h6 pl-0">
            <v-icon class="text-[#ff6b81!important] mb-1"
              >mdi-card-account-details-outline</v-icon
            >
            {{ global_role_id === "R_4" ? "เพิ่มนักเรียน" : "เพิ่มผู้ปกครอง" }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>

        <v-card-text class="pb-2">
          <v-row dense class="mb-5">
            <v-col cols="12">
              <labelCustom required text="Username"></labelCustom>
              <!-- :hide-details="!relation.account_id" -->
              <v-text-field
                :rules="rules.usernameRules"
                dense
                outlined
                @keypress="validate($event, 'en-number')"
                v-model="relation.username"
                @change="
                  checkUsername(
                    relation.username,
                    global_role_id === 'R_4' ? 'parent' : 'student'
                  )
                "
                @keyup.enter="
                  checkUsername(
                    relation.username,
                    global_role_id === 'R_4' ? 'parent' : 'student'
                  )
                "
                @blur="
                  checkUsername(
                    relation.username,
                    global_role_id === 'R_4' ? 'parent' : 'student'
                  )
                "
                placeholder="Username"
              >
                <template v-slot:append>
                  <v-icon v-if="relation.account_id" color="green"
                    >mdi-checkbox-marked-circle-outline</v-icon
                  >
                </template>
                <template v-slot:append-outer>
                  <v-icon
                    size="24"
                    class="cursor-pointer"
                    @click="
                      checkUsername(
                        relation.username,
                        global_role_id === 'R_4' ? 'parent' : 'student'
                      )
                    "
                    >mdi-magnify</v-icon
                  >
                </template>
              </v-text-field>
              <template v-if="!relation.account_id">
                <label> หากยังไม่มีบัญชีผู้ใช้กรุณา </label>
                <label
                  class="text-[#ff6b81] underline cursor-pointer mt-5"
                  @click="registerParent"
                  >สมัคร One ID</label
                >
              </template>
            </v-col>

            <!-- <v-col cols="3">
              <v-btn
                block
                :loading="is_loading"
                color="#ff6b81"
                @click="
                  checkUsername(
                    relation.username,
                    global_role_id === 'R_4' ? 'parent' : 'student'
                  )
                "
                depressed
                dark
                >ตกลง</v-btn
              >
            </v-col> -->
          </v-row>
          <!-- <v-row dense>
            <v-col cols="12" v-if="!relation.account_id">
                <label> หากยังไม่มีบัญชีผู้ใช้กรุณา </label>
                <label
                  class="text-[#ff6b81] underline cursor-pointer"
                  @click="registerParent"
                  >สมัคร One ID</label
                >
              </v-col>
          </v-row> -->
          <!-- <v-container> -->
          <v-row dense>
            <v-col cols="12">
              <labelCustom text="ชื่อ(ภาษาอักฤษ)"></labelCustom>
              <v-text-field
                disabled
                dense
                outlined
                v-model="relation.firstname_en"
                placeholder="ชื่อภาษาอังกฤษ"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <labelCustom text="นามสกุล(ภาษาอักฤษ)"></labelCustom>
              <v-text-field
                disabled
                dense
                outlined
                v-model="relation.lastname_en"
                placeholder="นามสกุลภาษาอังกฤษ"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <labelCustom text="เบอร์โทรศัพท์"></labelCustom>
              <v-text-field
                disabled
                dense
                outlined
                v-model="relation.tel"
                placeholder="เบอร์โทรศัพท์"
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- </v-container> -->
        </v-card-text>
        <v-card-actions class="px-6">
          <v-row dense>
            <v-col>
              <v-btn
                @click="closeDialog"
                class="w-full"
                color="#ff6b81"
                outlined
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                :disabled="relation.username === '' ? true : false"
                :color="relation.username !== '' ? '#ff6b81' : '#ccc'"
                :dark="relation.username !== '' ? true : false"
                class="w-full"
                depressed
                @click="addRealions"
                >บันทึก</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG::REGISTER -->
    <v-dialog
      persistent
      v-if="show_dialog_register_one_id"
      v-model="show_dialog_register_one_id"
      :width="!MobileSize ? `60vw` : ``"
    >
      <registerDialogForm
        dialog
        title="สมัคร One ID"
        :state="register_type"
      ></registerDialogForm>
    </v-dialog>

    <!-- DIALOG PATCH SUCCESS -->
    <v-dialog class="pa-2" width="50vw" v-model="show_sucsess" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="12" align="right">
              <v-btn icon @click="closeDialog">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <dialogCard text="แก้ไขข้อมูลเรียบร้อย"></dialogCard>
        <div class="my-5 text-center">
          <v-btn color="#ff6b81" @click="closeDialog"> ตกลง </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- DIALOG SUCCESSS -->
    <v-dialog class="pa-2" width="50vw" v-model="dialog_show" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="12" align="right">
              <v-btn icon @click="closeDialog">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <dialogCard text="บันทึกข้อมูลสำเร็จ"></dialogCard>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { inputValidation } from "@/functions/functions";
import LabelCustom from "@/components/label/labelCustom.vue";
import headerPage from "@/components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import registerDialogForm from "@/components/user_menage/registerDialogForm.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";
import { mapActions, mapGetters } from "vuex";
import VueCookie from "vue-cookie";
import Swal from "sweetalert2";
import axios from "axios";
export default {
  name: "userMenagePage",
  components: {
    headerPage,
    headerCard,
    registerDialogForm,
    LabelCustom,
    dialogCard,
  },
  data: () => ({
    saved: false,
    isDisabled: false,
    isEnabled: true,
    previewUrl: null,
    inputValue: "",
    username_alert: "",
    isMatch: false,
    isNotMatch: true,
    searchTerm: "",
    selectRoles: [],
    isOpenParent: false,
    isOpenStudent: false,
    add_parent: false,
    add_student: false,
    add_relations: false,
    show_sucsess: false,
    seledtedRole: "",
    dataArray: ["apple", "banana", "orange"],
    dialog_show: false,
    show_dialog: false,
    selectedItem: false,
    student_id: "",
    register_type: "",
    test: "",
    search: "",

    // sortBy: [],
    // privilege: "",
    relation: {
      account_id: "",
      firstname_en: "",
      lastname_en: "",
      username: "",
      tel: "",
    },

    roles: [
      { role: "Super Admin", privilege: "superAdmin", roleNumber: "R_1" },
      { role: "Admin", privilege: "admin", roleNumber: "R_2" },
      { role: "โค้ช", privilege: "โค้ช", roleNumber: "R_3" },
      { role: "ผู้ปกครอง", privilege: "ผู้ปกครอง", roleNumber: "R_4" },
      { role: "นักเรียน", privilege: "นักเรียน", roleNumber: "R_5" },
    ],
    roleParentTable: [
      { text: "ชื่อ", value: "student.firstNameTh", sortable: false },
      { text: "นามสกุล", value: "student.lastNameTh", sortable: false },
      { text: "ชื่อคอร์ส", value: "courseNameTh", sortable: false },
      { text: "แพ็คเกจ", value: "cpo.packageName", sortable: false },
      { text: "โค้ช", value: "coachName", sortable: false },
      { text: "ประเภท", value: "cpo.courseTypeNameTh", sortable: false },
      { text: "ระยะเวลา", value: "cpo.optionName", sortable: false },
      { text: "วัน", value: "dates", sortable: false },
      { text: "เวลาเริ่ม", value: "start", sortable: false },
      { text: "เวลาสิ้นสุด", value: "end", sortable: false },
    ],
    roleStudentTable: [
      { text: "ชื่อ", value: "student.firstNameTh", sortable: false },
      { text: "นามสกุล", value: "student.lastNameTh", sortable: false },
      { text: "ชื่อคอร์ส", value: "courseNameTh", sortable: false },
      { text: "แพ็คเกจ", value: "cpo.packageName", sortable: false },
      { text: "โค้ช", value: "coachName", sortable: false },
      { text: "ประเภท", value: "cpo.courseTypeNameTh", sortable: false },
      { text: "ระยะเวลา", value: "cpo.optionName", sortable: false },
      { text: "วัน", value: "dates", sortable: false },
      { text: "เวลาเริ่ม", value: "start", sortable: false },
      { text: "เวลาสิ้นสุด", value: "end", sortable: false },
      { text: "ราคา", value: "price", sortable: false },
    ],
    period: ["admin", "Super admin", "โค้ช", "ผู้ปกครอง"],
    breadcrumbs: [
      { text: "จัดการผู้ใช้งาน", to: "UserList" },
      { text: "แก้ไขข้อมูลผู้ใช้งาน", to: "" },
    ],
    title: "ข้อมูลผู้ใช้งาน",
    titlePermissionManage: "การจัดการสิทธิ์",
    titleCourseDetail: "ข้อมูลคอร์สเรียน",
    addStudentData: "เพิ่มข้อมูลผู้ใช้นักเรียน",
    addParentData: "เพิ่มข้อมูลผู้ใช้ของผู้ปกครอง",
    titleCreateRelation: "",
    rules: {
      name: [
        (val) =>
          (val || "").length > 0 ||
          "ชื่อผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง",
      ],
      username: [
        () =>
          !this.isMatch ? "ชื่อผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง " : "",
      ],
      email: [
        (value) => !!value || "Required.",
        (value) => (value || "").length <= 20 || "Max 20 characters",
        (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      ],
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

    clickCount: 0,
    isCheckedRelation: false,
    global_username: "",
    global_role_id: "",
    global_data_relation: [],
    preview_img: "",
    send_image_profile: null,
    thaiDaysOfWeek: [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ],
    error_message: "",
  }),
  // bef
  created() {
    // if (this.show_by_id.userRoles.length > 0) {
    //   for (const items of this.show_by_id.userRoles) {
    //     console.log("items=>", items);
    //     this.seledtedRole = items.roleId;
    //   }
    // }
  },

  beforeMount() {
    this.params = this.$route.params.account_id;
    for (const item_relation of this.data_user_relation_management) {
      console.log("test", item_relation.studentId);
      this.student_id = item_relation.studentId;
    }

    console.log("show_by_id=>", this.show_by_id);
    if (this.show_by_id.userRoles.length > 0) {
      for (const items of this.show_by_id.userRoles) {
        console.log("items=>", items);
        this.seledtedRole = items.roleId;
      }
    }

    this.GetDataRelationsManagement(this.show_by_id);
    // this.GetDataRelationsManagement(this.data_user_by_id);
    console.log(
      "before mounted data_user_relation_management",
      this.data_user_relation_management
    );
  },

  mounted() {
    if (this.$route.params.action == "edit") {
      this.isMatch = true;
      if (
        this.user_data.selectedbox ==
        this.user_data.privilege.includes("นักเรียน")
      ) {
        console.log("นักเรียน");
        this.user_data.isCardOpen = true;
      }
      if (this.user_data.selectedbox == false) {
        console.log("ปิดนักเรียน");
        this.user_data.isCardOpen = false;
      } else if (
        this.user_data.selectedbox ==
        this.user_data.privilege.includes("ผู้ปกครอง")
      ) {
        this.user_data.isCardParentOpen = true;
      }
    }

    this.GetDataRelationsManagement(this.show_by_id);
    console.log(
      "mounted data_user_relation_management",
      this.data_user_relation_management
    );
    // this.GetDataRelationsManagement(this.data_user_by_id);

    // for (const show_data of this.show_by_id.userRoles) {
    //   console.log("show_data", show_data);
    //   if (show_data.roleId == "R_4") {
    //     if (this.data_user_relation_management.length > 0) {
    //       this.isOpenParent = true;
    //       for (const item_relation of this.data_user_relation_management) {
    //         this.GetStudentSchedule(item_relation.studentId);
    //       }
    //     } else {
    //       this.data_user_relation_management = [];
    //     }
    //   } else if (show_data.roleId == "R_5") {
    //     if (this.data_user_relation_management.length > 0) {
    //       this.isOpenStudent = true;
    //       for (const item_relation of this.data_user_relation_management) {
    //         this.GetStudentSchedule(item_relation.studentId);
    //       }
    //     } else {
    //       this.data_user_relation_management = [];
    //     }
    //   } else {
    //     console.log("show_data", show_data.roleId);
    //   }
    // }
  },
  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      changeStudentsData: "UserManageModules/changeStudentsData",
      changeParentData: "UserManageModules/changeParentData",
      ChangeCardStudens: "UserManageModules/ChangeCardStudens",
      GetShowById: "UserModules/GetShowById",
      GetStudentSchedule: "UserModules/GetStudentSchedule",
      GetDataRelationsManagement:
        "UserManageModules/GetDataRelationsManagement",
      GetUserById: "UserModules/GetUserById",
      checkUsernameOneid: "loginModules/checkUsernameOneid",
      AddRelations: "RegisterModules/AddRelations",
      RemoveRelation: "RegisterModules/RemoveRelation",
    }),
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    selectRole(roles) {
      this.selectRoles;
      console.log("roles", roles);
      console.log("selectRoles", this.selectRoles);
    },

    showImg(item) {
      return `${process.env.VUE_APP_URL}/api/v1/files/${item}`;
    },

    // uploadFile() {
    //   this.file = this.$refs.fileInput.files[0];
    //   if (!this.file) return;
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     this.previewUrl = e.target.result;
    //   };
    //   reader.readAsDataURL(this.file);
    // },

    // uploadFile() {
    //   this.file = this.$refs.fileInput.files[0];
    //   console.log("file=>", this.file);
    //   if (!this.file) return;
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     this.previewUrl = e.target.result;
    //   };
    //   reader.readAsDataURL(this.file);
    // },

    uploadFile() {
      let allowedExtension = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
      ];
      let files = this.$refs.fileInput.files[0];

      if (files.size > 10240 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "ขนาดไฟล์ใหญ่เกินไป",
          text: "( กำหนดขนาดไม่เกิน 10MB )",
        });
        document.getElementById("fileInput").value = "";
      } else if (allowedExtension.indexOf(files.type) === -1) {
        Swal.fire({
          icon: "warning",
          title: "รูปแบบไฟล์ไม่ถูกต้อง",
          text: "( กรุณาอัปโหลดไฟล์รูปภาพ )",
        });
        document.getElementById("fileInput").value = "";
      } else {
        this.preview_img = URL.createObjectURL(files);
        this.send_image_profile = files;
      }
    },

    removeImg() {
      document.getElementById("fileInput").value = "";
      this.preview_img = "";
    },

    checkData() {
      if (
        this.dataArray.includes(
          this.user_data.username_en ||
            this.students.username ||
            this.parents.username
        )
      ) {
        this.isMatch = true;
        this.isNotMatch = false;
      } else {
        this.isMatch = false;
        this.isNotMatch = true;
        this.username_alert = "ชื่อผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง ";
        console.log(this.username_alert, "--> false");
      }
    },

    validate(e, type) {
      inputValidation(e, type);
    },
    checkPhoneNumber() {
      let x = this.user_data.phone_num.replace(/\D/g, "");
      x = x.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      console.log(x);
      this.user_data.phone_num = !x[2]
        ? x[1]
        : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    },

    openDialog() {
      this.dialog_show = true;
      this.isDisabled = true;
      this.isEnabled = false;
      this.show_sucsess = true;
    },

    closeDialog() {
      this.dialog_show = false;
      this.saved = true;
      this.add_relations = false;
      this.show_sucsess = false;
      this.relation = {
        account_id: "",
        firstname_en: "",
        lastname_en: "",
        username: "",
        tel: "",
      };
    },

    edit() {
      this.isDisabled = false;
      this.isEnabled = true;
    },

    onClick() {
      if (this.clickCount === 0) {
        // Show modal on the first click
        this.dialog_show = true;
        this.clickCount++;
      } else {
        // Navigate to another page on the second click
        this.$router.push({ name: "Finance" });
      }
    },

    onCheckboxChange(role_id) {
      console.log("role_id=>", role_id);
      // if (this.user_data.selectedbox) {
      //   // Checkbox is selected, open the card
      //   this.user_data.isCardOpen = true;
      // } else {
      //   // Checkbox is unselected, close the card
      //   this.user_data.isCardOpen = false;
      // }
    },

    addStudentsCard() {
      this.students.students_detail.push({
        username: "",
        firstname: "",
        lastname: "",
        tel: "",
      });
      this.ChangeCardStudens(this.students);
    },

    removeCardStudent(index) {
      this.students.students_detail.splice(index, 1);
      this.ChangeCardStudens(this.students);
    },
    remove(item) {
      console.log(item, "dddd");
      const index = this.selectRoles.indexOf(item.role);
      this.selectRoles.splice(index, 1);

      // console.log(index, "sss");
      // if (index >= 0) this.roles.splice(index, 1);
    },

    checkUsername(username, type) {
      console.log("username=>", username);
      console.log("type=>", type);
      if (username != "") {
        this.checkUsernameOneid({
          username: username,
          status: null,
          type: type,
        }).then(() => {
          console.log("global_data_relation", this.global_data_relation);
          this.global_data_relation =
            type == "student" ? this.user_student_data[0] : this.user_data[0];
          this.relation.account_id = this.global_data_relation.userOneId;
          this.relation.firstname_en = this.global_data_relation.firstNameEng;
          this.relation.lastname_en = this.global_data_relation.lastNameEng;
          this.relation.tel = this.global_data_relation.mobileNo;

          // if (type === "student") {
          //   console.log("data_student=>", this.user_student_data);
          // } else {
          //   console.log("data_user=>",this.user_student_data);
          // }
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "ไม่มี username",
        });
      }
    },

    addRealions() {
      Swal.fire({
        icon: "question",
        title: "คุณต้องการเพิ่มความสัมพันธ์หรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let config = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
              },
            };

            console.log("object", this.user_data);
            for (const data of this.user_data) {
              console.log("data", data);
              this.set_parent_id = data.userOneId;
              console.log("userOneId", this.set_parent_id);
            }
            let payload = {
              studentId:
                this.global_role_id === "R_5"
                  ? this.$route.params.account_id
                  : this.relation.account_id,
              parentId:
                this.global_role_id === "R_4"
                  ? this.$route.params.account_id
                  : this.relation.account_id,
              // parentId: this.set_parent_id,
              // this.$route.params.account_id
            };
            console.log("payload :", payload);
            let { data } = await axios.post(
              `${process.env.VUE_APP_URL}/api/v1/relations/user`,
              payload,
              config
            );

            if (data.statusCode === 201) {
              if (data.data && data.data.message !== "Duplicate relation.") {
                Swal.fire({
                  icon: "success",
                  title: "บันทึกสำเร็จ",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    this.add_relations = false;
                    this.relation = {
                      account_id: "",
                      firstname_en: "",
                      lastname_en: "",
                      username: "",
                      tel: "",
                    };
                    this.GetDataRelationsManagement(this.show_by_id);
                    // this.GetDataRelationsManagement(this.data_user_by_id);
                    console.log("tset", this.data_user_relation_management);
                  }
                });
              } else {
                throw { error: data };
              }
            } else {
              throw { message: data.message };
            }
          } catch ({ response }) {
            if (
              response?.data?.message === "parentId not found." ||
              response?.data?.message === "studentId and parentId not found." ||
              response?.data?.message === "studentId not found."
            ) {
              this.error_message = "ชื่อผู้ใช้ไม่ถูกต้อง";
            } else if (response?.data?.message === "Duplicate relation.") {
              this.error_message = "ความสัมพันธ์ซ้ำ";
            } else if (
              response?.data?.message ===
              "Student does not have the required role."
            ) {
              this.error_message = "username นี้ยังไม่มีบทบาท";
            } else if (
              response?.data?.message ===
              "Parent does not have the required role."
            ) {
              this.error_message = "username นี้ยังไม่มีบทบาท";
            } else if (
              response?.data?.message ===
              "parentId and studentId must not be duplicate."
            ) {
              this.error_message =
                "ชื่อผู้ใช้ของผู้ปกครองและนักเรียนต้องไม่ซ้ำกัน";
            } else {
              this.error_message = "เกิดข้อผิดพลาด";
            }

            console.log("error=>", response);
            Swal.fire({
              icon: "error",
              title: this.error_message,
            });
          }
        } else {
          Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
        }
      });
    },

    removeRelations(relations) {
      Swal.fire({
        icon: "question",
        title: "คุณต้องการลบรายการนี้ใช่หรือไม่ ?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.dialog_show = false;
          console.log("remove");
          for (const role of this.show_by_id.userRoles) {
            console.log("role.roleId", role.roleId);
            console.log("relations", relations);

            this.RemoveRelation({
              parentId:
                role.roleId === "R_4"
                  ? this.$route.params.account_id
                  : relations.parentId,
              studentId:
                role.roleId === "R_5"
                  ? this.$route.params.account_id
                  : relations.studentId,
            }).then(() => {
              // this.GetAll(this.user_login.account_id);
              this.GetDataRelationsManagement(this.show_by_id);
              // this.GetDataRelationsManagement(this.data_user_by_id);
            });
          }
        }
      });
    },

    openAddRelationsDialog(username, role_id) {
      console.log("username", username);
      this.global_username = username;
      this.global_role_id = role_id;
      this.add_relations = true;
    },
    registerParent() {
      this.register_type = "parent";
      this.register_type = "student";
      // this.changeCourseOrderData(this.course_order)
      this.changeDialogRegisterOneId(true);
    },
    updateData(account_id) {
      console.log("user_account_id", account_id);

      Swal.fire({
        icon: "question",
        title: "คุณต้องการแก้ไขข้อมูลหรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let config = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
              },
            };

            let payload = {
              firstNameTh: this.show_by_id.firstNameTh,
              lastNameTh: this.show_by_id.lastNameTh,
              firstNameEng: this.show_by_id.firstNameEng,
              lastNameEng: this.show_by_id.lastNameEng,
              email: this.show_by_id.email,
              mobileNo: this.show_by_id.mobileNo,
              roles:
                this.seledtedRole != "" ? [{ roleId: this.seledtedRole }] : [],
            };
            console.log("payload", payload);
            let bodyFormData = new FormData();
            bodyFormData.append(
              "image",
              this.send_image_profile
              // "image",
              // this.send_image_profile?.length != 0
              //   ? this.send_image_profile
              //   : null
            );
            bodyFormData.append("payload", JSON.stringify(payload));
            console.log("bodyFormData", bodyFormData);

            let { data } = await axios.patch(
              // `http://localhost:3000/api/v1/usermanagement/update/${account_id}`,
              `${process.env.VUE_APP_URL}/api/v1/usermanagement/update/${account_id}`,
              bodyFormData,
              config
            );
            if (data.statusCode === 200) {
              if (data.data !== "Cannot update: Relation Already exists") {
                Swal.fire({
                  icon: "success",
                  title: "บันทึกสำเร็จ",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    this.$router.push({
                      name: "UserDetail",
                      params: {
                        action: "view",
                        account_id: this.$route.params.account_id,
                      },
                    });
                  }
                  console.log("data", data.data);
                });
                this.GetShowById(this.$route.params.account_id);
              }
              // else if (
              //   data.data &&
              //   data.message === "Relation Already exists"
              // ) {
              //   Swal.fire({
              //     icon: "error",
              //     title: "เกิดข้อผิดพลาด",
              //     text: "USER นี้มีความสัมพันธ์แล้ว!",
              //   }).then(async (result) => {
              //     if (result.isConfirmed) {
              //       this.$router.push({
              //         name: "UserDetail",
              //         params: {
              //           action: "view",
              //           account_id: this.$route.params.account_id,
              //         },
              //       });
              //     }
              //   });
              //   this.GetShowById(this.$route.params.account_id);
              // }
              else if (data.data === "Cannot update: Relation Already exists") {
                Swal.fire({
                  icon: "success",
                  title: "บันทึกสำเร็จ22",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    this.$router.push({
                      name: "UserDetail",
                      params: {
                        action: "view",
                        account_id: this.$route.params.account_id,
                      },
                    });
                  }
                });
                this.GetShowById(this.$route.params.account_id);
              }
            } else {
              throw { message: data.data };
            }
          } catch (error) {
            console.log("catch");

            Swal.fire({
              icon: "error",
              title: error.data.data.message,
            });
          }
        } else {
          Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
        }
      });
    },

    dayOfWeekName(days) {
      const daysOfWeek = [
        "อาทิตย์",
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัสบดี",
        "ศุกร์",
        "เสาร์",
      ];
      const dayNames = [];
      for (let i = 0; i < days.length; i++) {
        const dayIndex = days[i];
        dayNames.push(daysOfWeek[dayIndex]);
      }
      return dayNames.join(" , ");
    },

    // getThaiDayOfWeek(date) {
    //   const dayIndex = new Date(date).getDay();
    //   return this.thaiDaysOfWeek[dayIndex];
    // },
  },

  computed: {
    ...mapGetters({
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      students: "UserManageModules/getStudent",
      // user_data: "UserManageModules/getUserData",
      parents: "UserManageModules/getParent",
      show_by_id: "UserModules/getShowById",
      student_schedule: "UserModules/getStudentSchedule",
      data_user_relation_management:
        "UserManageModules/getDataRelationsManagement",
      data_user_by_id: "UserModules/getUserById",
      user_one_id: "loginModules/getUserOneId",
      user_data: "loginModules/getUserData",
      is_loading: "loginModules/getIsLoading",
      user_student_data: "loginModules/getUserStudentData",
      last_user_registered: "RegisterModules/getLastUserRegistered",
    }),

    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
    },
  },
  watch: {
    last_user_registered: async function (val) {
      this.add_parent = false;
      this.add_student = false;

      console.log(this.last_user_registered);
      console.log("val", val);
      if (this.last_user_registered.type === "parent") {
        this.AddRelations({
          studentId: this.$route.params.account_id,
          parentId: this.last_user_registered.account_id,
        }).then(() => {
          this.GetDataRelationsManagement(this.show_by_id);
          // this.GetDataRelationsManagement(this.data_user_by_id);
        });
      } else if (this.last_user_registered.type === "student") {
        this.AddRelations({
          parentId: this.$route.params.account_id,
          studentId: this.last_user_registered.account_id,
        }).then(() => {
          this.GetDataRelationsManagement(this.show_by_id);
          // this.GetDataRelationsManagement(this.data_user_by_id);
        });
      }
      this.dialog_parent = false;
    },

    "data_user_relation_management.length": function () {
      this.GetDataRelationsManagement(this.show_by_id);
      // this.GetDataRelationsManagement(this.data_user_by_id);
      for (const show_data of this.show_by_id.userRoles) {
        console.log("show_data", show_data);
        if (show_data.roleId == "R_4") {
          if (this.data_user_relation_management.length > 0) {
            this.isOpenParent = true;
            for (const item_relation of this.data_user_relation_management) {
              this.GetStudentSchedule(item_relation.studentId);
            }
          } else {
            this.data_user_relation_management = [];
          }
        } else if (show_data.roleId == "R_5") {
          if (this.data_user_relation_management.length > 0) {
            this.isOpenStudent = true;
            for (const item_relation of this.data_user_relation_management) {
              this.GetStudentSchedule(item_relation.studentId);
            }
          } else {
            this.data_user_relation_management = [];
          }
        } else {
          console.log("show_data", show_data.roleId);
        }
      }
    },

    "show_by_id.userRoles.length": function () {
      if (this.show_by_id.userRoles.length > 0) {
        for (const items of this.show_by_id.userRoles) {
          console.log("items=>", items);
          this.seledtedRole = items?.roleId ? items.roleId : "abc";
        }
      }
    },

    show_by_id: function () {
      console.log("len", this.show_by_id.userRoles.length);
      if (this.show_by_id.userRoles.length > 0) {
        this.show_by_id.userRoles.map((val) => {
          this.seledtedRole = val.roleId;
        });
      } else {
        this.seledtedRole = "";
      }
      console.log("this.seledtedRole", this.seledtedRole);
    },
  },
};
</script>
<style scoped>
.img-one {
  width: 140px;
  height: 60px;
}
.btn-manage {
  position: absolute;
  left: 86%;
  top: 95%;
}
.upload-photo {
  border-color: #ff6b81;
}

.profileCard {
  min-height: 200px;
  min-width: 200px;
  max-height: 200px;
  max-width: 200px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.iconInCard {
  min-height: 200px;
  min-width: 200px;
  max-height: 200px;
  max-width: 200px;
}

.profileInCard {
  min-height: 160px;
  min-width: 160px;
  max-height: 160px;
  max-width: 160px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.camera {
  position: absolute;
  margin-left: 60px;
}
.webkit-center {
  text-align: -webkit-center;
}
.image-cropper {
  width: 180px;
  height: 180px;
  position: relative;
  overflow: hidden;
  border-radius: 100%;
  margin: -1%;
}

.cicle {
  /* margin: 25px 0; */
  /* padding: 1px; */
  width: 200px;
  height: 200px;
  border-radius: 100%;
  border: 12px solid transparent;
  /* background-size: 100% 100%, 50% 50%, 50% 50%, 50% 50%, 50% 50%; */
  background-repeat: no-repeat;
  background-image: linear-gradient(white, white),
    linear-gradient(30deg, #ff6b81 36%, #ff6b81 30%),
    linear-gradient(120deg, #ff6b81 36%, #ff6b81 30%),
    linear-gradient(300deg, #ff6b81 36%, #ff6b81 30%),
    linear-gradient(210deg, #ff6b81 36%, #ff6b81 30%);
  background-position: center center, left top, right top, left bottom,
    right bottom;
  background-origin: content-box, border-box, border-box, border-box, border-box;
  background-clip: content-box, border-box, border-box, border-box, border-box;
  /* transform: rotate(30deg); */
}
</style>
