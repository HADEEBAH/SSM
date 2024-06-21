<template>
  <v-container fluid class="overflow-x-hidden overflow-y-hidden">
    <v-row dense class="mt-5">
      <v-col cols="12">
        <headerPage :breadcrumbs="breadcrumbs"></headerPage>
        <v-card class="rounded-lg">
          <v-container fluid>
            <v-row dense>
              <v-col cols="12">
                <headerCard
                  :icon="'mdi-card-account-details-outline'"
                  :icon_color="'#FF6B81'"
                  :title="$t('user information')"
                ></headerCard>
                <v-divider></v-divider>

                <v-card class="rounded-lg my-3" color="#FCFCFC">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <label-custom :text="$t('username')"></label-custom>
                        <v-text-field
                          :placeholder="
                            $t('please enter your username (English)')
                          "
                          @keydown="validate($event, 'en-number')"
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

              <v-col cols="12">
                <v-card class="rounded-lg my-3" color="#FCFCFC">
                  <v-card-text>
                    <v-form ref="user_form" v-model="user_form">
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
                              src="@/assets/userManagePage/default_img_update_profile.svg"
                            >
                              <v-btn
                                v-if="preview_img == ''"
                                color="#ff6b81"
                                @click="openFileSelector"
                                class="w-full white--text"
                                >{{ $t("add a picture") }}</v-btn
                              >
                              <v-btn
                                v-if="preview_img !== ''"
                                color="#ff6b81"
                                @click="removeImg"
                                class="w-full white--text"
                              >
                                <span class="mdi mdi-close">{{
                                  $t("cancel")
                                }}</span>
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
                              :aspect-ratio="16 / 9"
                            >
                              <v-btn
                                v-if="preview_img == ''"
                                color="#ff6b81"
                                @click="openFileSelector"
                                class="w-full white--text"
                                >{{ $t("change photo") }}</v-btn
                              >
                              <v-btn
                                v-if="preview_img !== ''"
                                color="#ff6b81"
                                @click="removeImg"
                                class="w-full white--text"
                              >
                                <span class="mdi mdi-close">{{
                                  $t("cancel")
                                }}</span>
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
                              <label-custom
                                :text="$t('first name(thai)')"
                              ></label-custom>

                              <v-text-field
                                @keydown="validate($event, 'th-special')"
                                placeholder="-"
                                v-model="show_by_id.firstNameTh"
                                :rules="rules.firstNameThRules"
                                outlined
                                dense
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom
                                :text="$t('last name(thai)')"
                              ></label-custom>
                              <v-text-field
                                @keydown="validate($event, 'th-special')"
                                placeholder="-"
                                v-model="show_by_id.lastNameTh"
                                :rules="rules.lastNameThRules"
                                outlined
                                dense
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col cols="12" sm="6">
                              <label-custom
                                :text="$t('first name(english)')"
                              ></label-custom>
                              <v-text-field
                                v-bind:disabled="isDisabled"
                                @keydown="validate($event, 'en-special')"
                                placeholder="-"
                                v-model="show_by_id.firstNameEng"
                                :rules="rules.firstNameEnRules"
                                outlined
                                dense
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom
                                :text="$t('last name(english)')"
                              ></label-custom>
                              <v-text-field
                                v-bind:disabled="isDisabled"
                                @keydown="validate($event, 'en-special')"
                                placeholder="-"
                                v-model="show_by_id.lastNameEng"
                                :rules="rules.lastNameEnRules"
                                outlined
                                dense
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6">
                              <label-custom
                                :text="$t('nickname(thai)')"
                              ></label-custom>
                              <v-text-field
                                v-model="show_by_id.nicknameTh"
                                v-bind:disabled="isDisabled"
                                @keydown="validate($event, 'th')"
                                placeholder="-"
                                outlined
                                dense
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom
                                :text="$t('nickname(en)')"
                              ></label-custom>
                              <v-text-field
                                v-model="show_by_id.nicknameEn"
                                v-bind:disabled="isDisabled"
                                @keydown="validate($event, 'en-special')"
                                placeholder="-"
                                outlined
                                dense
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6">
                              <label-custom :text="$t('email')"></label-custom>
                              <v-text-field
                                disabled
                                placeholder="-"
                                v-model="show_by_id.email"
                                outlined
                                dense
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom
                                :text="$t('phone number')"
                              ></label-custom>
                              <v-text-field
                                disabled
                                @keydown="validate($event, 'number')"
                                v-model="show_by_id.mobileNo"
                                outlined
                                dense
                                required
                                @input="checkPhoneNumber"
                                maxlength="12"
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row
                            v-for="items of show_by_id.userRoles"
                            :key="items"
                          >
                            <v-col
                              cols="12"
                              sm="6"
                              v-if="items.roleId === 'R_5'"
                            >
                              <label-custom :text="$t('class')"></label-custom>
                              <!-- <v-autocomplete
                                v-if="show_by_id.class.classNameTh"
                                v-model="show_by_id.class.classNameTh"
                                :items="class_list"
                                item-text="classNameTh"
                                color="#ff6B81"
                                item-color="#ff6b81"
                                outlined
                                :disabled="isDisabled"
                                dense
                              >
                                <template #no-data>
                                  {{ $t("data not found") }}
                                </template>
                              </v-autocomplete> -->

                              <v-autocomplete
                                :value="
                                  show_by_id.class.classNameTh === ''
                                    ? $t('please enter the class')
                                    : show_by_id.class.classNameTh
                                "
                                :items="class_list"
                                item-text="classNameTh"
                                color="#ff6B81"
                                item-color="#ff6b81"
                                outlined
                                :disabled="isDisabled"
                                :placeholder="$t('please enter the class')"
                                dense
                                @change="handleChange($event)"
                              >
                                <template #no-data>
                                  {{ $t("data not found") }}
                                </template>
                              </v-autocomplete>
                            </v-col>

                            <v-col cols="12" sm="6">
                              <label-custom
                                :text="$t('congenital disease')"
                              ></label-custom>
                              <v-text-field
                                :disabled="!isEnabled"
                                placeholder="-"
                                v-model="show_by_id.congenitalDisease"
                                outlined
                                dense
                              >
                              </v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              v-if="items.roleId !== 'R_5'"
                            >
                              <label-custom
                                :text="$t('school(thai)')"
                              ></label-custom>
                              <v-text-field
                                v-bind:disabled="isDisabled"
                                @keydown="validate($event, 'th')"
                                placeholder="-"
                                v-model="show_by_id.school.schoolNameTh"
                                outlined
                                dense
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              v-if="items.roleId === 'R_5'"
                            >
                              <label-custom
                                :text="$t('school(thai)')"
                              ></label-custom>
                              <v-text-field
                                v-bind:disabled="isDisabled"
                                @keydown="validate($event, 'th')"
                                placeholder="-"
                                v-model="show_by_id.school.schoolNameTh"
                                outlined
                                dense
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <!-- <v-row>
                            <v-col cols="12" sm="6">
                              <label-custom
                                :text="$t('school(en)')"
                              ></label-custom>
                              <v-text-field
                                v-bind:disabled="isDisabled"
                                @keydown="validate($event, 'en')"
                                placeholder="-"
                                v-model="show_by_id.school.schoolNameEn"
                                outlined
                                dense
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom
                                :text="$t('school(thai)')"
                              ></label-custom>
                              <v-text-field
                                v-bind:disabled="isDisabled"
                                @keydown="validate($event, 'th')"
                                placeholder="-"
                                v-model="show_by_id.school.schoolNameTh"
                                outlined
                                dense
                                color="#ff6b81"
                              >
                              </v-text-field>
                            </v-col>
                          </v-row> -->
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <!-- การจัดการสิทธิ์ ไม่มี Role-->
          <v-container fluid v-if="show_by_id?.userRoles?.length <= 0">
            <v-row>
              <v-col cols="12">
                <headerCard
                  :icon="'mdi-card-account-details-outline'"
                  :icon_color="'#FF6B81'"
                  :title="$t('permission management')"
                ></headerCard>
                <v-divider></v-divider>
                <v-card class="rounded-lg my-3" color="#FCFCFC">
                  <v-card-text>
                    <v-row class="mr-3 ml-3">
                      <v-col cols="12" sm="5">
                        <label-custom :text="$t('user role')"></label-custom>
                        <v-autocomplete
                          dense
                          v-model="seledtedRole"
                          :items="roles"
                          item-text="role"
                          item-value="roleNumber"
                          :label="$t('select user role')"
                          solo
                          item-color="#ff6b81"
                          color="#ff6b81"
                          @change="selectRole(seledtedRole)"
                        >
                          <template v-slot:item="{ item }">
                            <v-list-item-content>
                              {{ item.role }}
                            </v-list-item-content>
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
                  class=""
                  :icon="'mdi-card-account-details-outline'"
                  :icon_color="'#FF6B81'"
                  :title="$t('permission management')"
                ></headerCard>
                <v-divider></v-divider>
                <v-card class="rounded-lg mt-5" color="#FCFCFC">
                  <v-card-text class="mt-3">
                    <v-row class="mr-3 ml-3">
                      <v-col cols="12" sm="5">
                        <label-custom :text="$t('user role')"></label-custom>
                        <v-autocomplete
                          dense
                          v-model="seledtedRole"
                          :items="roles"
                          item-text="role"
                          item-value="roleNumber"
                          :label="$t('select user role')"
                          outlined
                          item-color="#ff6b81"
                          color="#ff6b81"
                          @change="selectRole()"
                        >
                          <template v-slot:item="{ item }">
                            <v-list-item-content>
                              {{ item.role }}
                            </v-list-item-content>
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
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
                      ? $t('add student information in charge')
                      : $t('add parent information')
                  "
                ></headerCard>
                <v-divider></v-divider>

                <v-card
                  v-if="data_user_relation_management?.length <= 0"
                  class="rounded-lg my-3"
                >
                  <v-card-text
                    class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
                  >
                    <span class="text-lg font-bold">
                      <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                      {{
                        item.roleId === "R_4"
                          ? $t("can't find information on students in care")
                          : $t("parent information not found")
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
                        v-if="data_user_relation_management?.length >= 1"
                      >
                        mdi-delete
                      </v-icon>
                    </v-col>
                    <v-row dense align="center">
                      <v-col cols="12" sm="6">
                        <label-custom :text="$t('username')"></label-custom>
                        <!-- <label-custom
                          :text="
                            item.roleId === 'R_4'
                              ? 'Student’s Username (English)'
                              : 'Parent’s Username (English)'
                          "
                        ></label-custom> -->
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
                      </v-col>

                      <v-col cols="12" sm="6">
                        <label-custom
                          :text="$t('first name(english)')"
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
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom
                          :text="$t('last name(english)')"
                        ></label-custom>
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
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom :text="$t('phone number')"></label-custom>
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
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- check box In relations -->
              <v-col
                cols="12"
                sm="6"
                v-if="item.roleId === 'R_4' || item.roleId === 'R_5'"
              >
                <v-checkbox
                  v-model="isCheckedRelation"
                  :label="
                    item.roleId === 'R_4'
                      ? $t('want to add students to supervision')
                      : $t('want to add a parent')
                  "
                  value="Jacob"
                  color="pink"
                  item-color="pink"
                ></v-checkbox>
              </v-col>

              <!-- เพิ่มความสัมพันธ์ -->
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
                      ? $t("add student")
                      : $t("add parent information")
                  }}</v-btn
                >
              </v-col>
              <!-- ----------------------------------------------- -->
              <!-- <pre>{{ student_schedule }}</pre> -->
              <!-- TABLE Role PARENT -->
              <v-col cols="12" v-if="item.roleId === 'R_4'">
                <headerCard
                  :icon="'mdi-school-outline'"
                  :icon_color="'#FF6B81'"
                  :title="$t('course information')"
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
                  </template>
                </v-data-table>
              </v-col>

              <!-- TABLE Role STUDENT -->
              <v-col cols="12" v-if="item.roleId === 'R_5'">
                <headerCard
                  :icon="'mdi-school-outline'"
                  :icon_color="'#FF6B81'"
                  :title="$t('course information')"
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
              {{ $t("save") }}
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
        <v-app-bar flat color="white">
          <v-toolbar-title class="text-h6 pl-0">
            <v-icon class="text-[#ff6b81!important] mb-1"
              >mdi-card-account-details-outline</v-icon
            >
            {{
              global_role_id === "R_4" ? $t("add student") : $t("add parents")
            }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>

        <v-card-text class="pb-2">
          <v-row dense class="mb-5">
            <v-col cols="12">
              <labelCustom required :text="$t('username')"></labelCustom>
              <v-text-field
                :rules="rules.usernameRules"
                dense
                outlined
                @keydown="validate($event, 'en-number')"
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
                :placeholder="$t('username')"
                color="#ff6b81"
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
                <label>
                  {{ $t("if you don't have an account yet, please") }}
                </label>
                <label
                  class="text-[#ff6b81] underline cursor-pointer mt-5"
                  @click="registerParent"
                  >{{ $t("sign up for One ID") }}</label
                >
              </template>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <labelCustom :text="$t('first name(english)')"></labelCustom>
              <v-text-field
                disabled
                dense
                outlined
                v-model="relation.firstname_en"
                :placeholder="$t('first name(english)')"
                color="#ff6b81"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <labelCustom :text="$t('last name(english)')"></labelCustom>
              <v-text-field
                disabled
                dense
                outlined
                v-model="relation.lastname_en"
                :placeholder="$t('last name(english)')"
                color="#ff6b81"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <labelCustom :text="$t('phone number')"></labelCustom>
              <v-text-field
                disabled
                dense
                outlined
                v-model="relation.tel"
                :placeholder="$t('phone number')"
                color="#ff6b81"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-6">
          <v-row dense>
            <v-col>
              <v-btn
                @click="closeDialog"
                class="w-full"
                color="#ff6b81"
                outlined
                >{{ $t("cancel") }}</v-btn
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
                >{{ $t("save") }}</v-btn
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
        :title="$t('sign up for One ID')"
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
        <dialogCard :text="$t('data has been edited')"></dialogCard>
        <div class="my-5 text-center">
          <v-btn color="#ff6b81" @click="closeDialog">
            {{ $t("agree") }}
          </v-btn>
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
        <dialogCard :text="$t('save data successfully')"></dialogCard>
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
    dialog_show: false,
    show_dialog: false,
    selectedItem: false,
    student_id: "",
    register_type: "",
    test: "",
    search: "",
    relation: {
      account_id: "",
      firstname_en: "",
      lastname_en: "",
      username: "",
      tel: "",
    },
    titleCreateRelation: "",
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
    user_form: false,
    className: "",
    activeClass: false,
  }),

  beforeMount() {
    this.params = this.$route.params.account_id;
    for (const item_relation of this.data_user_relation_management) {
      this.student_id = item_relation.studentId;
    }

    if (this.show_by_id?.userRoles?.length > 0) {
      for (const items of this.show_by_id.userRoles) {
        this.seledtedRole = items.roleId;
      }
    }

    this.GetDataRelationsManagement(this.show_by_id);
  },
  async created() {
    this.GetClassList();
  },
  mounted() {
    this.GetDataRelationsManagement(this.show_by_id);
  },
  methods: {
    ...mapActions({
      GetClassList: "ProfileModules/GetClassList",
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
      registerUserOneId: "RegisterModules/registerUserOneId",
      registerHaveOneId: "RegisterModules/registerHaveOneId",
    }),
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    handleChange(item) {
      this.activeClass = true;
      this.className = item;
    },
    selectRole() {
      this.selectRoles;
    },

    showImg(item) {
      return `${process.env.VUE_APP_URL}/api/v1/files/${item}`;
    },

    uploadFile() {
      let allowedExtension = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
      ];
      let files = this.$refs.fileInput.files[0];

      if (files.size > (10240 * 1024) / 2) {
        Swal.fire({
          icon: "warning",
          title: this.$t("the file size is too large"),
          text: this.$t("set the size not to exceed 5MB"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        document.getElementById("fileInput").value = "";
      } else if (allowedExtension.indexOf(files.type) === -1) {
        Swal.fire({
          icon: "warning",
          title: this.$t("invalid file format"),
          text: this.$t("please upload an image file"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
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
        this.username_alert = this.$t("invalid username Please check again");
      }
    },

    validate(e, type) {
      inputValidation(e, type);
    },
    checkPhoneNumber() {
      let x = this.user_data.phone_num.replace(/\D/g, "");
      x = x.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
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
      const index = this.selectRoles.indexOf(item.role);
      this.selectRoles.splice(index, 1);
    },

    checkUsername(username, type) {
      if (username != "") {
        this.checkUsernameOneid({
          username: username,
          status: null,
          type: type,
        }).then(() => {
          this.global_data_relation =
            type == "student" ? this.user_student_data[0] : this.user_data[0];
          this.relation.account_id = this.global_data_relation.userOneId;
          this.relation.firstname_en = this.global_data_relation.firstNameEng;
          this.relation.lastname_en = this.global_data_relation.lastNameEng;
          this.relation.tel = this.global_data_relation.mobileNo;
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: this.$t("warning"),
          text: this.$t("username not found"),
          timer: 3000,
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    },

    addRealions() {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to increase your relationship?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
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

            for (const data of this.user_data) {
              this.set_parent_id = data.userOneId;
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
            };
            let { data } = await axios.post(
              `${process.env.VUE_APP_URL}/api/v1/relations/user`,
              payload,
              config
            );

            if (data.statusCode === 201) {
              if (data.data && data.data.message !== "Duplicate relation.") {
                this.add_relations = false;
                this.relation = {
                  account_id: "",
                  firstname_en: "",
                  lastname_en: "",
                  username: "",
                  tel: "",
                };
                this.GetDataRelationsManagement(this.show_by_id);
                Swal.fire({
                  icon: "success",
                  title: this.$t("succeed"),
                  text: this.$t("saved successfully"),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
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
              this.error_message = this.$t(
                "invalid username Please check again"
              );
            } else if (response?.data?.message === "Duplicate relation.") {
              this.error_message = this.$t("duplicate relationship");
            } else if (
              response?.data?.message ===
              "Student does not have the required role."
            ) {
              this.error_message = "username นี้ยังไม่มีบทบาท";
            } else if (
              response?.data?.message ===
              "Parent does not have the required role."
            ) {
              this.error_message = this.$t(
                "this username does not yet have a role"
              );
            } else if (
              response?.data?.message ===
              "parentId and studentId must not be duplicate."
            ) {
              this.error_message = this.$t(
                "parent and student usernames must be unique"
              );
            } else if (
              response?.data?.message ===
              "Can not use the same accountID to create Relations."
            ) {
              this.error_message = this.$t(
                "Can not use the same accountID to create Relations."
              );
            } else {
              this.error_message = this.$t("something went wrong");
            }

            Swal.fire({
              icon: "error",
              title: this.$t("something went wrong"),
              text: this.error_message,
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          }
        } else {
          Swal.fire({
            icon: "info",
            title: this.$t("cancel"),
            text: this.$t("your data will not be saved"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      });
    },

    removeRelations(relations) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete this item?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.dialog_show = false;
          for (const role of this.show_by_id.userRoles) {
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
              this.GetDataRelationsManagement(this.show_by_id);
            });
          }
        }
      });
    },

    openAddRelationsDialog(username, role_id) {
      this.global_username = username;
      this.global_role_id = role_id;
      this.add_relations = true;
    },
    registerParent() {
      this.register_type = "parent";
      this.register_type = "student";
      this.changeDialogRegisterOneId(true);
    },
    updateData(account_id) {
      this.$refs.user_form.validate();
      if (this.user_form) {
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to edit the information?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("cancel"),
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
              // if (this.activeClass= true) {

              // }
              let payload = {
                firstNameTh: this.show_by_id.firstNameTh,
                lastNameTh: this.show_by_id.lastNameTh,
                firstNameEng: this.show_by_id.firstNameEng,
                lastNameEng: this.show_by_id.lastNameEng,
                email: this.show_by_id.email,
                mobileNo: this.show_by_id.mobileNo,
                roles:
                  this.seledtedRole != ""
                    ? [{ roleId: this.seledtedRole }]
                    : [],
                schoolTh: this.show_by_id.school.schoolNameTh,
                schoolEn: this.show_by_id.school.schoolNameEn,
                nicknameTh: this.show_by_id.nicknameTh,
                nicknameEn: this.show_by_id.nicknameEn,
                className:
                  this.activeClass === true
                    ? this.className
                    : this.show_by_id.class.classNameTh,
                congenitalDiseaseTh: this.show_by_id.congenitalDisease,
              };
              let bodyFormData = new FormData();
              bodyFormData.append("image", this.send_image_profile);
              bodyFormData.append("payload", JSON.stringify(payload));
              let { data } = await axios.patch(
                `${process.env.VUE_APP_URL}/api/v1/usermanagement/update/${account_id}`,
                bodyFormData,
                config
              );
              if (data.statusCode === 200) {
                if (data.data !== "Can not change role relations is already.") {
                  this.$router.push({
                    name: "UserDetail",
                    params: {
                      action: "view",
                      account_id: this.$route.params.account_id,
                      from: "userList",
                    },
                  });
                  Swal.fire({
                    icon: "success",
                    title: this.$t("succeed"),
                    text: this.$t("saved successfully"),
                    timer: 3000,
                    timerProgressBar: true,
                    showCancelButton: false,
                    showConfirmButton: false,
                  });
                  // Swal.fire({
                  //   icon: "success",
                  //   title: "บันทึกสำเร็จ",
                  // }).then(async (result) => {
                  //   if (result.isConfirmed) {
                  //     this.$router.push({
                  //       name: "UserDetail",
                  //       params: {
                  //         action: "view",
                  //         account_id: this.$route.params.account_id,
                  //       },
                  //     });
                  //   }
                  // });
                  this.GetShowById(this.$route.params.account_id);
                }
              } else {
                throw { message: data.data };
              }
            } catch ({ response }) {
              if (
                response?.data?.message ===
                "Can not change role relations is already."
              ) {
                this.error_message = this.$t("unable to change roles");
                this.$router.push({
                  name: "UserDetail",
                  params: {
                    action: "view",
                    account_id: this.$route.params.account_id,
                  },
                });
              } else if (
                response?.data?.message ===
                "Can not change Coach role, because Coach is teaching the course."
              ) {
                this.error_message = this.$t(
                  "unable to change roles because the coach is in a teaching state"
                );
                this.$router.push({
                  name: "UserDetail",
                  params: {
                    action: "view",
                    account_id: this.$route.params.account_id,
                    from: "userList",
                  },
                });
              } else if (response?.data?.message === "User not found.") {
                if (this.user_one_temp.userName !== "") {
                  this.error_message = this.$t(
                    "your One Id username does not yet exist in the system"
                  );
                  this.checkUsernameOneid({
                    username: this.user_one_temp.userName,
                    status: null,
                    type: null,
                  });
                  setTimeout(() => {
                    let payload = {
                      ...this.show_by_id,
                      passWord: null,
                      roles:
                        this.seledtedRole != ""
                          ? [{ roleId: this.seledtedRole }]
                          : [],
                    };
                    if (this.user_data[0]?.userOneId) {
                      this.registerHaveOneId(payload);
                    }
                  }, 1000);
                } else {
                  this.error_message = this.$t("this user could not be found");
                }
              } else {
                this.error_message = this.$t("something went wrong");
              }
              Swal.fire({
                icon: `${
                  this.error_message === this.$t("something went wrong")
                    ? "error"
                    : "warning"
                }`,
                title: `${
                  this.error_message === this.$t("something went wrong")
                    ? this.error_message
                    : "คำเตือน"
                }`,
                text: `${
                  this.error_message === this.$t("something went wrong")
                    ? ""
                    : `(${this.error_message})`
                }`,
                timer: 3000,
                timerProgressBar: true,
                showCancelButton: false,
                showConfirmButton: false,
              });
            }
          } else {
            Swal.fire({
              icon: "info",
              title: this.$t("cancel"),
              text: this.$t("your data will not be saved"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          }
        });
      }
    },

    dayOfWeekName(days) {
      const daysOfWeek = [
        this.$t("sunday"),
        this.$t("monday"),
        this.$t("tuesday"),
        this.$t("wednesday"),
        this.$t("thursday"),
        this.$t("friday"),
        this.$t("saturday"),
      ];
      const dayNames = [];
      for (let i = 0; i < days.length; i++) {
        const dayIndex = days[i];
        dayNames.push(daysOfWeek[dayIndex]);
      }
      return dayNames.join(" , ");
    },
  },

  computed: {
    ...mapGetters({
      class_list: "ProfileModules/classList",
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      students: "UserManageModules/getStudent",
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
      user_one_temp: "UserModules/getUserOneTemp",
    }),

    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
    },

    breadcrumbs() {
      return [
        { text: this.$t("add accounts"), to: "UserList" },
        { text: this.$t("edit user information"), to: "" },
      ];
    },
    roles() {
      return [
        {
          role: this.$t("super admin"),
          privilege: "superAdmin",
          roleNumber: "R_1",
        },
        { role: this.$t("admin"), privilege: "admin", roleNumber: "R_2" },
        { role: this.$t("coach"), privilege: "โค้ช", roleNumber: "R_3" },
        { role: this.$t("parent"), privilege: "ผู้ปกครอง", roleNumber: "R_4" },
        { role: this.$t("student"), privilege: "นักเรียน", roleNumber: "R_5" },
      ];
    },
    roleParentTable() {
      return [
        {
          text: this.$t("first name"),
          value:
            this.$i18n.locale == "th"
              ? "student.firstNameTh"
              : "student.firstNameEng",
          sortable: false,
        },
        {
          text: this.$t("last name"),
          value:
            this.$i18n.locale == "th"
              ? "student.lastNameTh"
              : "student.lastNameEng",
          sortable: false,
        },
        {
          text: this.$t("course name"),
          value: this.$i18n.locale == "th" ? "courseNameTh" : "courseNameEn",
          sortable: false,
        },
        { text: this.$t("package"), value: "cpo.packageName", sortable: false },
        { text: this.$t("coach"), value: "coachName", sortable: false },
        {
          text: this.$t("course type"),
          value:
            this.$i18n.locale == "th"
              ? "cpo.courseTypeNameTh"
              : "cpo.courseTypeNameEn",
          sortable: false,
        },
        {
          text: this.$t("periods"),
          value:
            this.$i18n.locale == "th" ? "cpo.optionName" : "cpo.optionNameEn",
          sortable: false,
        },
        { text: this.$t("day"), value: "dates", sortable: false },
        { text: this.$t("start time"), value: "start", sortable: false },
        { text: this.$t("end time"), value: "end", sortable: false },
      ];
    },

    roleStudentTable() {
      return [
        {
          text: this.$t("first name"),
          value:
            this.$i18n.locale == "th"
              ? "student.firstNameTh"
              : "student.firstNameEng",
          sortable: false,
        },
        {
          text: this.$t("last name"),
          value:
            this.$i18n.locale == "th"
              ? "student.lastNameTh"
              : "student.lastNameEng",
          sortable: false,
        },
        {
          text: this.$t("course name"),
          value: this.$i18n.locale == "th" ? "courseNameTh" : "courseNameEn",
          sortable: false,
        },
        { text: this.$t("package"), value: "cpo.packageName", sortable: false },
        {
          text: this.$t("coach"),
          value: this.$i18n.locale == "th" ? "coachNameTh" : "coachNameEn",
          sortable: false,
        },
        {
          text: this.$t("course type"),
          value:
            this.$i18n.locale == "th"
              ? "cpo.courseTypeNameTh"
              : "cpo.courseTypeNameEn",
          sortable: false,
        },
        {
          text: this.$t("periods"),
          value:
            this.$i18n.locale == "th" ? "cpo.optionName" : "cpo.optionNameEn",
          sortable: false,
        },
        { text: this.$t("day"), value: "dates", sortable: false },
        { text: this.$t("start time"), value: "start", sortable: false },
        { text: this.$t("end time"), value: "end", sortable: false },
        { text: this.$t("price"), value: "price", sortable: false },
      ];
    },

    rules() {
      return {
        firstNameThRules: [
          (val) =>
            (val || "").length > 1 ||
            this.$t(
              "please enter your name (thai) with a length of at least 2 characters"
            ),
          (val) =>
            (val || "").length < 100 ||
            this.$t(
              "please enter your name (thai) length not exceeding 20 characters"
            ),
          (val) =>
            /[ก-๏\s]/g.test(val) || this.$t("please enter your thai name"),
          (val) =>
            !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
            this.$t("please enter your thai name"),
        ],
        firstNameEnRules: [
          (val) =>
            (val || "").length > 1 ||
            this.$t(
              "please enter your name (english), at least 2 characters long"
            ),
          (val) =>
            (val || "").length < 100 ||
            this.$t(
              "please enter your name (english) length not exceeding 20 characters"
            ),
          (val) =>
            /[A-Za-z]/g.test(val) ||
            this.$t("please enter your name in english"),
          (val) =>
            !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
            this.$t("please enter your name in english"),
        ],
        lastNameThRules: [
          (val) =>
            (val || "").length > 1 ||
            this.$t(
              "please enter your last name (Thai), at least 2 characters long"
            ),
          (val) =>
            (val || "").length < 100 ||
            this.$t(
              "please enter your last name (Thai) not more than 20 characters"
            ),
          (val) =>
            /[ก-๏\s]/g.test(val) ||
            this.$t("please enter your last name in thai"),
          (val) =>
            !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
            this.$t("please enter your last name in thai"),
        ],
        lastNameEnRules: [
          (val) =>
            (val || "").length > 1 ||
            this.$t(
              "please enter your last name (English), at least 2 characters long"
            ),
          (val) =>
            (val || "").length < 100 ||
            this.$t(
              "please enter your last name (English). length not exceeding 20 characters"
            ),
          (val) =>
            /[A-Za-z ]/g.test(val) ||
            this.$t("please enter your last name in English"),
          (val) =>
            !/[\uD800-\uDBFF][\uDC00-\uDFFF ]/g.test(val) ||
            this.$t("please enter your last name in English"),
        ],
        name: [
          (val) =>
            (val || "").length > 0 ||
            this.$t("invalid username Please check again"),
        ],
        username: [
          () =>
            !this.isMatch ? this.$t("invalid username Please check again") : "",
        ],
        email: [
          (value) => !!value || "Required.",
          (value) => (value || "").length <= 20 || "Max 20 characters",
          (value) => {
            const pattern =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || this.$t("invalid email");
          },
        ],
        usernameRules: [
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
        ],
        passwordRules: [
          (val) =>
            (val || "").length > 7 ||
            this.$t(
              "please enter a password that is at least 8 characters long"
            ),
          (val) =>
            (val || "").length < 20 ||
            this.$t("please enter a password of no more than 20 characters"),
          (val) =>
            !/[ ]/g.test(val) ||
            this.$t("the username cannot contain special characters"),
        ],
      };
    },
  },
  watch: {
    last_user_registered: async function () {
      this.add_parent = false;
      this.add_student = false;

      if (this.last_user_registered.type === "parent") {
        this.AddRelations({
          studentId: this.$route.params.account_id,
          parentId: this.last_user_registered.account_id,
        }).then(() => {
          this.GetDataRelationsManagement(this.show_by_id);
        });
      } else if (this.last_user_registered.type === "student") {
        this.AddRelations({
          parentId: this.$route.params.account_id,
          studentId: this.last_user_registered.account_id,
        }).then(() => {
          this.GetDataRelationsManagement(this.show_by_id);
        });
      }
      this.dialog_parent = false;
    },

    "data_user_relation_management.length": function () {
      this.GetDataRelationsManagement(this.show_by_id);
      for (const show_data of this.show_by_id.userRoles) {
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
        }
      }
    },

    "show_by_id.userRoles.length": function () {
      if (this.show_by_id.userRoles.length > 0) {
        for (const items of this.show_by_id.userRoles) {
          this.seledtedRole = items?.roleId ? items.roleId : "abc";
        }
      }
    },

    show_by_id: function () {
      if (this.show_by_id.userRoles.length > 0) {
        this.show_by_id.userRoles.map((val) => {
          this.seledtedRole = val.roleId;
        });
      } else {
        this.seledtedRole = "";
      }
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
