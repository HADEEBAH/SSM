<template>
  <v-container class="overflow-x-hidden overflow-y-hidden">
    <!-- <pre>{{ show_by_id }}</pre> -->
    <div v-if="$route.params.action == 'view'">
      <v-row dense>
        <v-col>
          <headerPage :breadcrumbs="breadcrumbs"></headerPage>
          <v-card class="mx-auto">
            <headerCard
              class="ml-6 mt-8"
              :icon="'mdi-card-account-details-outline'"
              :icon_color="'#FF6B81'"
              :title="title"
            ></headerCard>
            <v-divider class="mx-10"></v-divider>
            <div>
              <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
                <v-row class="pa-2 ml-5 mr-5">
                  <v-col cols="12"> Username (English) </v-col>
                  <v-col cols="12">
                    <!-- username-->
                    {{ show_by_id.userName }}
                  </v-col>
                </v-row>
              </v-card>
            </div>
            <br />

            <div v-if="show_by_id.userRoles <= 0">
              <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
                <v-card-text class="mt-3">
                  <v-row>
                    <v-row>
                      <v-col cols="12" sm="4" class="ml-5">
                        <div class="profileCard">
                          <v-img
                            v-if="!previewUrl"
                            src="@/assets/userManagePage/imgcard.png"
                            class="drop-shadow-md"
                          >
                          </v-img>
                          <!-- :src="showImg(show_by_id.image)" -->

                          <div style="position: absolute">
                            <img
                              :src="show_by_id.image"
                              class="profileInCard"
                            />
                          </div>
                        </div>
                      </v-col>
                    </v-row>

                    <v-col cols="12" sm="8">
                      <v-row>
                        <v-col cols="12" sm="6">
                          <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
                          <div v-if="!isEnabled">
                            {{ show_by_id.firstNameTh }}
                          </div>
                          <div v-else>
                            <v-text-field
                              v-bind:disabled="isDisabled"
                              @keypress="validate($event, 'th')"
                              placeholder=""
                              v-model="show_by_id.firstNameTh"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </div>
                        </v-col>

                        <v-col cols="12" sm="6">
                          <label-custom text="นามสกุล (ภาษาไทย)"></label-custom>
                          <div v-if="!isEnabled">
                            {{ show_by_id.lastNameTh }}
                          </div>
                          <div v-else>
                            <v-text-field
                              v-bind:disabled="isDisabled"
                              @keypress="validate($event, 'th')"
                              placeholder=""
                              v-model="show_by_id.lastNameTh"
                              :rules="rules.name"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </div>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="6">
                          <label-custom
                            text="First Name (English)"
                          ></label-custom>
                          <div v-if="!isEnabled">
                            {{ show_by_id.firstNameEng }}
                          </div>
                          <div v-else>
                            <v-text-field
                              v-bind:disabled="isDisabled"
                              @keypress="validate($event, 'en')"
                              placeholder=""
                              v-model="show_by_id.firstNameEng"
                              :rules="rules.name"
                              outlined
                              dense
                            ></v-text-field>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <label-custom
                            text="Last Name (English)"
                          ></label-custom>

                          <div v-if="!isEnabled">
                            {{ show_by_id.lastNameEng }}
                          </div>
                          <div v-else>
                            <v-text-field
                              v-bind:disabled="isDisabled"
                              @keypress="validate($event, 'en')"
                              placeholder=""
                              v-model="show_by_id.lastNameEng"
                              :rules="rules.name"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </div>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="6">
                          <label-custom text="อีเมล"></label-custom>
                          <div v-if="!isEnabled">{{ show_by_id.email }}</div>
                          <div v-else>
                            <v-text-field
                              disabled
                              @keypress="validate($event, 'en', 'number')"
                              placeholder=""
                              v-model="show_by_id.email"
                              :rules="rules.email"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <label-custom text="เบอร์โทรศัพท์"></label-custom>
                          <div v-if="!isEnabled">
                            {{ show_by_id.mobileNo }}
                          </div>
                          <div v-else>
                            <v-text-field
                              disabled
                              @keypress="validate($event, 'en', 'number')"
                              placeholder=""
                              v-model="show_by_id.mobileNo"
                              :rules="rules.email"
                              outlined
                              dense
                              required
                              @input="checkPhoneNumber"
                              maxlength="12"
                            >
                            </v-text-field>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <div
                v-for="(user_id, index_user) in show_by_id.userRoles"
                :key="index_user"
              >
                <!-- การจัดการสิทธิ์ -->
                <headerCard
                  class="ml-6 mt-8"
                  :icon="'mdi-card-account-details-outline'"
                  :icon_color="'#FF6B81'"
                  :title="title2"
                ></headerCard>
                <v-divider class="mx-10"></v-divider>
                <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
                  <v-card-text class="mt-3">
                    <v-row class="mr-3 ml-3">
                      <v-col cols="12" sm="6">
                        <label-custom text="บทบาทผู้ใช้งาน"></label-custom>

                        <v-card background-color="#FBF3F5" class="pa-2 w-2/4">
                          {{
                            user_id
                              ? user_id.roleNameTh
                              : "ยังไม่มีบทบาทผู้ใช้งาน"
                          }}
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
            </div>

            <div v-for="(item, index) in show_by_id.userRoles" :key="index">
              <!-- Role admin || Role coach || Parent -->
              <div
                v-if="
                  item.roleId == 'R_1' ||
                  item.roleId == 'R_2' ||
                  item.roleId == 'R_3' ||
                  item.roleId == 'R_4'
                "
              >
                <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
                  <v-card-text class="mt-3">
                    <v-row>
                      <v-row>
                        <v-col cols="12" sm="4" class="ml-5">
                          <div class="profileCard">
                            <v-img
                              v-if="!previewUrl"
                              src="@/assets/userManagePage/imgcard.png"
                              class="drop-shadow-md"
                            >
                            </v-img>

                            <div style="position: absolute">
                              <img
                                :src="show_by_id.image"
                                class="profileInCard"
                              />
                            </div>
                          </div>
                        </v-col>
                      </v-row>

                      <v-col cols="12" sm="8">
                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
                            <div v-if="!isEnabled">
                              {{ show_by_id.firstNameTh }}
                            </div>
                            <div v-else>
                              <v-text-field
                                v-bind:disabled="isDisabled"
                                @keypress="validate($event, 'th')"
                                placeholder=""
                                v-model="show_by_id.firstNameTh"
                                outlined
                                dense
                              >
                              </v-text-field>
                            </div>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <label-custom
                              text="นามสกุล (ภาษาไทย)"
                            ></label-custom>
                            <div v-if="!isEnabled">
                              {{ show_by_id.lastNameTh }}
                            </div>
                            <div v-else>
                              <v-text-field
                                v-bind:disabled="isDisabled"
                                @keypress="validate($event, 'th')"
                                placeholder=""
                                v-model="show_by_id.lastNameTh"
                                :rules="rules.name"
                                outlined
                                dense
                              >
                              </v-text-field>
                            </div>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="First Name (English)"
                            ></label-custom>
                            <div v-if="!isEnabled">
                              {{ show_by_id.firstNameEng }}
                            </div>
                            <div v-else>
                              <v-text-field
                                v-bind:disabled="isDisabled"
                                @keypress="validate($event, 'en')"
                                placeholder=""
                                v-model="show_by_id.firstNameEng"
                                :rules="rules.name"
                                outlined
                                dense
                              ></v-text-field>
                            </div>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="Last Name (English)"
                            ></label-custom>

                            <div v-if="!isEnabled">
                              {{ show_by_id.lastNameEng }}
                            </div>
                            <div v-else>
                              <v-text-field
                                v-bind:disabled="isDisabled"
                                @keypress="validate($event, 'en')"
                                placeholder=""
                                v-model="show_by_id.lastNameEng"
                                :rules="rules.name"
                                outlined
                                dense
                              >
                              </v-text-field>
                            </div>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom text="อีเมล"></label-custom>
                            <div v-if="!isEnabled">{{ show_by_id.email }}</div>
                            <div v-else>
                              <v-text-field
                                disabled
                                @keypress="validate($event, 'en', 'number')"
                                placeholder=""
                                v-model="show_by_id.email"
                                :rules="rules.email"
                                outlined
                                dense
                              >
                              </v-text-field>
                            </div>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom text="เบอร์โทรศัพท์"></label-custom>
                            <div v-if="!isEnabled">
                              {{ show_by_id.mobileNo }}
                            </div>
                            <div v-else>
                              <v-text-field
                                disabled
                                @keypress="validate($event, 'en', 'number')"
                                placeholder=""
                                v-model="show_by_id.mobileNo"
                                :rules="rules.email"
                                outlined
                                dense
                                required
                                @input="checkPhoneNumber"
                                maxlength="12"
                              >
                              </v-text-field>
                            </div>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <!-- การจัดการสิทธิ์ R1-R4 -->
                <headerCard
                  class="ml-6 mt-8"
                  :icon="'mdi-card-account-details-outline'"
                  :icon_color="'#FF6B81'"
                  :title="title2"
                ></headerCard>
                <v-divider class="mx-10"></v-divider>
                <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
                  <v-card-text class="mt-3">
                    <v-row class="mr-3 ml-3">
                      <v-col cols="12" sm="6">
                        <label-custom text="บทบาทผู้ใช้งาน"></label-custom>

                        <v-card background-color="#FBF3F5" class="pa-2 w-2/4">{{
                          item.roleNameTh
                        }}</v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
              <!-- Role Student -->

              <div v-if="item.roleId == 'R_5'">
                <v-tabs
                  v-model="tab"
                  background-color="transparent"
                  color="pink"
                  grow
                >
                  <v-tab v-for="item in items" :key="item">
                    {{ item }}
                  </v-tab>
                </v-tabs>
                <!-- TABS 1 -->
                <v-expand-x-transition transition="scale-transition">
                  <div v-if="tab === 0">
                    <!-- ข้อมูลทั้่วไป -->

                    <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
                      <v-card-text class="mt-3">
                        <v-row>
                          <v-row>
                            <v-col cols="12" sm="4" class="ml-5">
                              <div class="profileCard">
                                <v-img
                                  v-if="!previewUrl"
                                  src="@/assets/userManagePage/imgcard.png"
                                  class="drop-shadow-md"
                                >
                                </v-img>

                                <div style="position: absolute">
                                  <img
                                    :src="show_by_id.image"
                                    class="profileInCard"
                                  />
                                </div>
                              </div>
                            </v-col>
                          </v-row>
                          <v-col cols="12" sm="8">
                            <v-row>
                              <v-col cols="12" sm="6">
                                <label-custom
                                  text="ชื่อ (ภาษาไทย)"
                                ></label-custom>
                                <div v-if="!isEnabled">
                                  {{ show_by_id.firstNameTh }}
                                </div>
                                <div v-else>
                                  <v-text-field
                                    v-bind:disabled="isDisabled"
                                    @keypress="validate($event, 'th')"
                                    placeholder=""
                                    v-model="show_by_id.firstNameTh"
                                    outlined
                                    dense
                                  >
                                  </v-text-field>
                                </div>
                              </v-col>

                              <v-col cols="12" sm="6">
                                <label-custom
                                  text="นามสกุล (ภาษาไทย)"
                                ></label-custom>
                                <div v-if="!isEnabled">
                                  {{ show_by_id.lastNameTh }}
                                </div>
                                <div v-else>
                                  <v-text-field
                                    v-bind:disabled="isDisabled"
                                    @keypress="validate($event, 'th')"
                                    placeholder=""
                                    v-model="show_by_id.lastNameTh"
                                    :rules="rules.name"
                                    outlined
                                    dense
                                  >
                                  </v-text-field>
                                </div>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12" sm="6">
                                <label-custom
                                  text="First Name (English)"
                                ></label-custom>
                                <div v-if="!isEnabled">
                                  {{ show_by_id.firstNameEng }}
                                </div>
                                <div v-else>
                                  <v-text-field
                                    v-bind:disabled="isDisabled"
                                    @keypress="validate($event, 'en')"
                                    placeholder=""
                                    v-model="show_by_id.firstNameEng"
                                    :rules="rules.name"
                                    outlined
                                    dense
                                  ></v-text-field>
                                </div>
                              </v-col>
                              <v-col cols="12" sm="6">
                                <label-custom
                                  text="Last Name (English)"
                                ></label-custom>

                                <div v-if="!isEnabled">
                                  {{ show_by_id.lastNameEng }}
                                </div>
                                <div v-else>
                                  <v-text-field
                                    v-bind:disabled="isDisabled"
                                    @keypress="validate($event, 'en')"
                                    placeholder=""
                                    v-model="show_by_id.lastNameEng"
                                    :rules="rules.name"
                                    outlined
                                    dense
                                  >
                                  </v-text-field>
                                </div>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12" sm="6">
                                <label-custom text="อีเมล"></label-custom>
                                <div v-if="!isEnabled">
                                  {{ show_by_id.email }}
                                </div>
                                <div v-else>
                                  <v-text-field
                                    disabled
                                    @keypress="validate($event, 'en', 'number')"
                                    placeholder=""
                                    v-model="show_by_id.email"
                                    :rules="rules.email"
                                    outlined
                                    dense
                                  >
                                  </v-text-field>
                                </div>
                              </v-col>
                              <v-col cols="12" sm="6">
                                <label-custom
                                  text="เบอร์โทรศัพท์"
                                ></label-custom>
                                <div v-if="!isEnabled">
                                  {{ show_by_id.mobileNo }}
                                </div>
                                <div v-else>
                                  <v-text-field
                                    disabled
                                    @keypress="validate($event, 'en', 'number')"
                                    placeholder=""
                                    v-model="show_by_id.mobileNo"
                                    :rules="rules.email"
                                    outlined
                                    dense
                                    required
                                    @input="checkPhoneNumber"
                                    maxlength="12"
                                  >
                                  </v-text-field>
                                </div>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>

                    <!-- การจัดการสิทธิ์ R5  -->
                    <headerCard
                      class="ml-6 mt-8"
                      :icon="'mdi-card-account-details-outline'"
                      :icon_color="'#FF6B81'"
                      :title="title2"
                    ></headerCard>
                    <v-divider class="mx-10"></v-divider>
                    <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
                      <v-card-text class="mt-3">
                        <v-row class="mr-3 ml-3">
                          <v-col cols="12" sm="6">
                            <label-custom text="บทบาทผู้ใช้งาน"></label-custom>

                            <v-card
                              background-color="#FBF3F5"
                              class="pa-2 w-2/4"
                              >{{ item.roleNameTh }}</v-card
                            >
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>

                    <!-- Parent Detail in Student Role -->
                    <headerCard
                      class="ml-6 mt-8"
                      :icon="'mdi-human-male-boy'"
                      :icon_color="'#FF6B81'"
                      :title="title4"
                    ></headerCard>
                    <v-divider class="mx-10"></v-divider>
                    <div v-if="data_user_relation_management.length >= 1">
                      <v-card
                        class="my-10 mx-10"
                        color="#FCFCFC"
                        v-for="(
                          relations, index_relations
                        ) in data_user_relation_management"
                        :key="index_relations"
                      >
                        <v-card-text class="mt-3">
                          <v-row dense align="center">
                            <v-col cols="12" sm="6">
                              <label-custom
                                text="Parent’s Username (English)"
                              ></label-custom>
                              <div>
                                {{
                                  !relations.parent.parentUsername
                                    ? "-"
                                    : relations.parent.parentUsername
                                }}
                              </div>
                            </v-col>

                            <v-col cols="12" sm="6">
                              <label-custom
                                text="First Name (English)"
                              ></label-custom>
                              <div>
                                {{
                                  !relations.parent.parentFirstnameEn
                                    ? "-"
                                    : relations.parent.parentFirstnameEn
                                }}
                              </div>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom
                                text="Last Name (English)"
                              ></label-custom>
                              <div>
                                {{
                                  !relations.parent.parentLastnameEn
                                    ? "-"
                                    : relations.parent.parentLastnameEn
                                }}
                              </div>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom text="เบอร์โทรศัพท์"></label-custom>
                              <div>
                                {{
                                  !relations.parent.parentTel
                                    ? "-"
                                    : relations.parent.parentTel
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </div>
                    <div v-else>
                      <v-card class="mx-10 my-10">
                        <v-card-text
                          class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
                        >
                          <span class="text-lg font-bold">
                            <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                            ไม่พบข้อมูลของผู้ปกครอง
                          </span>
                        </v-card-text>
                      </v-card>
                    </div>

                    <!-- check box -->
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        class="ml-10"
                        v-if="user_data.privilege.includes('ผู้ปกครอง')"
                      >
                        <v-checkbox
                          v-model="user_data.selectedbox"
                          label="ต้องการเพิ่มนักเรียนในการดูแล"
                          value="Jacob"
                          color="pink"
                          item-color="pink"
                          @change="onCheckboxChange"
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        class="ml-10"
                        v-if="user_data.privilege.includes('นักเรียน')"
                      >
                        <v-checkbox
                          v-model="user_data.selectedboxParent"
                          label="ต้องการเพิ่มผู้ปกครอง"
                          value="parent"
                          color="pink"
                          item-color="pink"
                          @change="onCheckboxChangeParent"
                        ></v-checkbox>
                      </v-col>
                    </v-row>

                    <div v-if="user_data.isCardOpen">
                      <headerCard
                        class="ml-6 mt-8"
                        :icon="'mdi-file-plus-outline'"
                        :icon_color="'#FF6B81'"
                        :title="addStudentData"
                      ></headerCard>
                      <v-divider class="mx-10"></v-divider>
                      <v-card
                        class="mt-10 ml-10 mr-10"
                        color="#FCFCFC"
                        v-for="(student, student_index) in students"
                        :key="`${student_index}-student`"
                      >
                        <v-card-text class="mt-3">
                          <v-row dense>
                            <v-col align="right">
                              <v-icon
                                larg
                                color="#FF6B81"
                                @click="removeCardStudent(student_index)"
                                v-if="student.length >= 1"
                              >
                                mdi-delete
                              </v-icon>
                            </v-col>
                          </v-row>
                          <!-- Student Data In R-5 -->
                          <v-row dense align="center">
                            <v-col cols="12" sm="6">
                              <label-custom
                                text="Student’s Username (English)"
                              ></label-custom>
                              <div>
                                {{
                                  !profile_user.studenFirstNameTh
                                    ? "-"
                                    : profile_user.studenFirstNameTh
                                }}
                              </div>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom
                                text="First Name (English)"
                              ></label-custom>
                              <div>
                                {{
                                  !profile_user.studenFirstNameTh
                                    ? "-"
                                    : profile_user.studenFirstNameTh
                                }}
                              </div>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom
                                text="Last Name (English)"
                              ></label-custom>
                              <div>
                                {{
                                  !profile_user.studenLastNameTh
                                    ? "-"
                                    : profile_user.studenLastNameTh
                                }}
                              </div>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom text="เบอร์โทรศัพท์"></label-custom>
                              <div>
                                {{
                                  !profile_user.studenTel
                                    ? "-"
                                    : profile_user.studenTel
                                }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>

                      <!-- Table In R_5 -->

                      <!-- TABLE -->
                      <!-- :items="datausers"
                  :search="search"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  :sort-by="user_data.sortBy" -->
                      <!-- <div class="my-5 mx-10">
                        <v-data-table
                          :headers="headers"
                          @page-count="pageCount = $event"
                          class="elevation-1 header-table"
                        >
                          <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small color="#FF6B81">
                              mdi-eye-outline
                            </v-icon>
                            <v-icon
                              small
                              class="ml-5"
                              color="#FF6B81"
                              @click="editItem(item)"
                            >
                              mdi-pencil
                            </v-icon>
                            <v-icon
                              class="ml-5"
                              small
                              color="#FF6B81"
                              @click="deleteItem(item)"
                            >
                              mdi-delete
                            </v-icon>
                          </template>
                        </v-data-table>
                      </div> -->
                    </div>

                    <!-- Card Add Parent -->
                    <div v-if="user_data.isCardParentOpen">
                      <headerCard
                        class="ml-6 mt-8"
                        :icon="'mdi-file-plus-outline'"
                        :icon_color="'#FF6B81'"
                        :title="addParentData"
                      ></headerCard>
                      <v-divider class="mx-10"></v-divider>
                      <v-card class="mt-10 ml-10 mr-10" color="#FCFCFC">
                        <v-card-text class="mt-3">
                          <v-row dense align="center">
                            <v-col cols="12" sm="6">
                              <label-custom
                                text="Parent’s Username (English)"
                              ></label-custom>
                              <!-- <div>{{ parents.username }}</div> -->
                              {{
                                !profile_user.parentTel
                                  ? "-"
                                  : profile_user.parentTel
                              }}
                            </v-col>

                            <v-col cols="12" sm="6">
                              <label-custom
                                text="First Name (English)"
                              ></label-custom>
                              {{
                                !profile_user.parentFirstnameTh
                                  ? "-"
                                  : profile_user.parentFirstnameTh
                              }}
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom
                                text="Last Name (English)"
                              ></label-custom>
                              {{
                                !profile_user.parentLastnameTh
                                  ? "-"
                                  : profile_user.parentLastnameTh
                              }}
                            </v-col>
                            <v-col cols="12" sm="6">
                              <label-custom text="เบอร์โทรศัพท์"></label-custom>
                              {{
                                !profile_user.parentTel
                                  ? "-"
                                  : profile_user.parentTel
                              }}
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </div>

                    <!-- ปิดข้อมูลผู้ใช้งาน -->
                  </div>
                </v-expand-x-transition>
                <!-- TabS 2 -->
                <v-expand-x-transition>
                  <div v-if="tab === 1" class="ml-6 mt-8">
                    <headerCard
                      class="ml-6 mt-8"
                      :icon="'mdi-calendar-today'"
                      :icon_color="'#FF6B81'"
                      :title="title3"
                    ></headerCard>
                    <v-divider class="mx-10"></v-divider>
                    <v-row class="mt-5 ml-6 mt-8">
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="search"
                          prepend-inner-icon="mdi-magnify"
                          label="ค้นหา"
                          single-line
                          hide-details
                          dense
                          outlined
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <!-- Table -->
                    <div class="my-5 mx-10">
                      <!--
                  :search="search"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  :sort-by="user_data.sortBy" -->
                      <v-data-table
                        :headers="headersTabs"
                        @page-count="pageCount = $event"
                        class="elevation-1 header-table"
                        :items="student_schedule"
                      >
                      </v-data-table>
                    </div>
                  </div>
                </v-expand-x-transition>
                <!-- Tabs 3 -->
                <div v-if="tab === 2" class="ml-6 mt-8">
                  <headerCard
                    class="ml-6 mt-8"
                    :icon="'mdi-calendar-today'"
                    :icon_color="'#FF6B81'"
                    :title="title3"
                  ></headerCard>
                  <v-divider class="mx-10"></v-divider>
                  <v-row class="mx-5 my-5">
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="search"
                        prepend-inner-icon="mdi-magnify"
                        label="ค้นหา"
                        hide-details
                        dense
                        outlined
                        color="pink"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" align="right">
                      <label
                        class="pink--text cursor-pointer mt-5"
                        @click="addCertificateDialog('add')"
                        ><span class="mdi mdi-file-plus-outline"></span>
                        เพิ่มการแข่งขันและเกียรติบัตร
                      </label>
                    </v-col>
                  </v-row>
                  <!-- Card Certificate -->

                  <v-card
                    class="mb-5"
                    v-for="(item, index) in students.certificates"
                    :key="index"
                  >
                    <div class="mx-5 my-5">
                      <v-row>
                        <v-col cols="12" sm="6" class="ml-5 front-bold">{{
                          item.name_certificate
                        }}</v-col>
                        <v-col cols="12" sm=""
                          >วันที่แข่ง:{{ item.certificate_date }}</v-col
                        >
                      </v-row>

                      <v-row>
                        <v-col cols="8">
                          <v-row>
                            <v-col cols="1">
                              <v-img
                                src="@/assets/userManagePage/certificate .png"
                                width="50px"
                                height="50px"
                                contain
                              ></v-img>
                            </v-col>
                            <v-col cols="" align-self="center"
                              ><span
                                class="pink--text underline underline-offset-2"
                                >{{ item.fileName }}</span
                              ></v-col
                            >
                          </v-row>
                        </v-col>

                        <v-col cols="4" align="end">
                          <v-row>
                            <v-col cols="10" align="end">
                              <v-btn
                                v-if="!item.previewUrl"
                                depressed
                                class="white--text"
                                color="#ff6b81"
                                @click="editCertificateDialog(item, index)"
                              >
                                <span class="mdi mdi-plus"></span>
                                เพิ่มหนังสือรับรอง
                              </v-btn>
                              <v-btn
                                v-else
                                depressed
                                class="white--text"
                                color="#ff6b81"
                                @click="detailCertificateDialog(item, index)"
                              >
                                แสดงหนังสือรับรอง
                              </v-btn>
                            </v-col>

                            <v-col cols="2" align="end">
                              <v-icon
                                larg
                                color="#FF6B81"
                                @click="removeCertificate(index)"
                                v-if="students.certificates.length >= 2"
                              >
                                mdi-delete
                              </v-icon>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>

                  <!-- DIALOG -->
                  <v-dialog
                    class="pa-2"
                    width="50vw"
                    v-model="certificate_dialog_show"
                    persistent
                  >
                    <v-card>
                      <v-card-title>
                        {{ selectedIndex }}
                        <v-row>
                          <v-col cols="12" align="right">
                            <v-btn icon @click="closeDialog">
                              <v-icon color="#ff6b81">mdi-close</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card-title>
                      <div class="mx-5 text-center mb-5">
                        <label-custom
                          text="เพิ่มการแข่งขันและเกียรติบัตร"
                        ></label-custom>
                      </div>

                      <v-row dense class="ml-5 mx-5">
                        <v-col cols="12">
                          <label>การแข่งขัน</label>
                          <v-text-field
                            placeholder="กรุณาระบุชื่อการแข่งขัน"
                            v-model="name_certificate"
                            hide-details
                            outlined
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <label>วันที่</label>
                          <v-text-field
                            placeholder="กรุณาระบุชื่อการแข่งขัน"
                            v-model="certificate_date"
                            hide-details
                            outlined
                          >
                            <template #append>
                              <v-icon>mdi-calendar-today</v-icon>
                            </template>
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <!-- Upload file -->
                      <v-card class="mx-5 my-5" flat>
                        <v-card-text
                          class="border-dashed border-2 border-blue-600 rounded-lg"
                        >
                          <v-row>
                            <v-col
                              cols="12"
                              class="flex align-center justify-center"
                            >
                              <v-img
                                src="@/assets/course/upload_file.png"
                                max-height="105"
                                max-width="122"
                              ></v-img>
                            </v-col>
                            <v-col
                              cols="12"
                              class="flex align-center justify-center text-h5"
                            >
                              อัพโหลดเกียรติบัตร
                            </v-col>
                            <v-col
                              cols="12"
                              class="flex align-center justify-center text-caption"
                            >
                              ( ขนาดไฟล์งานไม่เกิน 500 Mb ต้องเป็นไฟล์ JPG, PNG
                              )
                            </v-col>
                            <v-col
                              cols="12"
                              class="flex align-center justify-center"
                            >
                              <v-btn
                                outlined
                                color="blue"
                                @click="openFileSelector"
                                >เลือกไฟล์</v-btn
                              >
                              <input
                                ref="fileInput"
                                type="file"
                                @change="uploadFile"
                                style="display: none"
                                accept="image/*"
                              />
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                      <v-card v-if="fileName !== ''" class="pa-4 ma-4">
                        <v-row>
                          <v-col cols="2">
                            <v-img
                              src="../../../assets/userManagePage/pdfIcon.png"
                              width="30px"
                              height="30px"
                            ></v-img>
                          </v-col>
                          <v-col cols="8"
                            ><span>{{ fileName }}</span></v-col
                          >
                          <v-col cols="2" align="end"
                            ><v-icon @click="removeFile()"
                              >mdi-close</v-icon
                            ></v-col
                          >
                        </v-row>
                      </v-card>

                      <div class="text-center mx-5 mb-5">
                        <v-btn
                          v-if="status === 'create'"
                          depressed
                          class="white--text"
                          color="#ff6b81"
                          @click="saveDialog()"
                        >
                          บันทึก
                        </v-btn>
                        <v-btn
                          v-else-if="status === 'edit'"
                          depressed
                          class="white--text"
                          color="#ff6b81"
                          @click="saveEditDialog(selectedIndex)"
                        >
                          บันทึก
                        </v-btn>
                        <v-btn
                          v-else
                          depressed
                          class="white--text"
                          color="#ff6b81"
                          @click="certificate_dialog_show = false"
                        >
                          ปิด
                        </v-btn>
                      </div>
                    </v-card>
                  </v-dialog>

                  <!-- DIALOG SHOW CERTIFICATE -->
                  <!-- <v-dialog v-model="certificate_show">
                  <v-row>
                    <v-col cols="12" align="right">
                      <v-btn icon @click="closeDialog">
                        <v-icon color="#ff6b81">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <div
                    v-for="(
                      certificate, certificate_index
                    ) in students.certificates"
                    :key="`${certificate_index}-certificate`"
                  >
                    {{ certificate.previewUrl }}
                  </div>
                </v-dialog> -->
                </div>
              </div>
              <!-- CheckBox Role Parent -->
              <!-- <v-row v-if="item.roleId == 'R_4'">
                <v-col cols="12" sm="6" class="ml-10">
                  <v-checkbox
                    v-model="isOpen"
                    label="ต้องการเพิ่มนักเรียนในการดูแล"
                    value="Jacob"
                    color="pink"
                    item-color="pink"
                    @change="onCheckboxChange"
                  ></v-checkbox>
                </v-col>
              </v-row> -->

              <div v-if="item.roleId == 'R_4'">
                <headerCard
                  class="ml-6 mt-8"
                  :icon="'mdi-file-plus-outline'"
                  :icon_color="'#FF6B81'"
                  :title="addStudentData"
                ></headerCard>
                <v-divider class="mx-10"></v-divider>
                <div v-if="data_user_relation_management.length >= 1">
                  <v-card
                    class="mt-10 ml-10 mr-10"
                    color="#FCFCFC"
                    v-for="(data_item, index) in data_user_relation_management"
                    :key="index"
                  >
                    <!-- v-for="(student, student_index) in students"
                  :key="`${student_index}-student`"
                  @click="removeCardStudent(student_index)" -->
                    <v-card-text class="mt-3">
                      <!-- <v-row dense>
                      <v-col align="right">
                        <v-icon larg color="#FF6B81" v-if="student.length >= 2">
                          mdi-delete
                        </v-icon>
                      </v-col>
                    </v-row> -->
                      <!-- Student Data -->

                      <v-row dense align="center">
                        <v-col cols="12" sm="6">
                          <label-custom
                            text="Student’s Username (English)"
                          ></label-custom>
                          <div>
                            <!-- {{
                            !data_item.student.studentUsername
                              ? "-"
                              : data_item.student.studentUsername
                          }} -->
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <label-custom
                            text="First Name (English)"
                          ></label-custom>
                          <div>
                            {{
                              !data_item.student.studentFirstnameEn
                                ? "-"
                                : data_item.student.studentFirstnameEn
                            }}
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <label-custom
                            text="Last Name (English)"
                          ></label-custom>
                          <div>
                            {{
                              !data_item.student.studentLastnameEn
                                ? "-"
                                : data_item.student.studentLastnameEn
                            }}
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <label-custom text="เบอร์โทรศัพท์"></label-custom>
                          <div>
                            {{
                              !data_item.student.studentTel
                                ? "-"
                                : data_item.student.studentTel
                            }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>
                <div v-else>
                  <v-card class="mx-10 my-10">
                    <v-card-text
                      class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
                    >
                      <span class="text-lg font-bold">
                        <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                        ไม่พบข้อมูลของนักเรียน
                      </span>
                    </v-card-text>
                  </v-card>
                </div>

                <!-- TABLE In R-4 -->
                <!-- 
                  :search="search"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  :sort-by="user_data.sortBy" -->
              </div>

              <!-- TABLE -->
              <div
                class="my-5 mx-10"
                v-if="item.roleId == 'R_4' || item.roleId == 'R_5'"
              >
                <v-data-table
                  :headers="headers"
                  @page-count="pageCount = $event"
                  class="elevation-1 header-table"
                  :items="student_schedule"
                >
                  <template v-slot:[`item.days`]>
                    <div
                      v-for="(item, index) in student_data.dates"
                      :key="index"
                    >
                      {{ item.day }}
                    </div>
                    <!-- {{ student_data.dates.count }} -->
                    <!-- <div
                        v-for="(item_data, index) in student_data.dates.day"
                        :key="index"
                      >
                        {{
                          dayOfWeekName(item_data.dates.day) == ""
                            ? "-"
                            : dayOfWeekName(item_data.dates.day)
                        }}
                        {{ student_data.period.start }} -
                        {{ student_data.period.end }} น.
                      </div> -->
                  </template>

                  <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small color="#FF6B81"> mdi-eye-outline </v-icon>
                    <v-icon
                      small
                      class="ml-5"
                      color="#FF6B81"
                      @click="editItem(item)"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon
                      class="ml-5"
                      small
                      color="#FF6B81"
                      @click="deleteItem(item)"
                    >
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </div>
            </div>

            <!-- Button -->
            <div v-if="!isEnabled">
              <v-row>
                <v-col class="text-right mt-5 mr-10">
                  <v-btn
                    class="white--text mb-5"
                    depressed
                    color="#ff6b81"
                    @click="
                      $router.push({
                        name: 'UserDetail',
                        params: {
                          action: 'edit',
                          account_id: '$route.params.account_id',
                        },
                      })
                    "
                  >
                    <span class="mdi mdi-pencil-outline">แก้ไข</span>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div v-else class="text-right mt-5 mr-10">
              <v-row>
                <v-col align="right" sm="" cols="12">
                  <v-btn
                    :class="
                      $vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-52 ml-10'
                    "
                    class="white--text mb-5"
                    outlined
                    color="error"
                    @click="cancel()"
                  >
                    ยกเลิก
                  </v-btn>
                </v-col>
                <v-col sm="auto" cols="12">
                  <v-btn
                    :class="
                      $vuetify.breakpoint.smAndUp ? 'btn-size-lg' : 'w-52 ml-10'
                    "
                    class="white--text mb-5"
                    depressed
                    color="#ff6b81"
                    @click="submitEdit()"
                  >
                    บันทึก
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-else>
      <userManageForm></userManageForm>
    </div>
  </v-container>
</template>

<script>
import Swal from "sweetalert2";
import { inputValidation } from "@/functions/functions";
import LabelCustom from "@/components/label/labelCustom.vue";
import headerPage from "@/components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import userManageForm from "@/components/user_menage/userManageForm.vue";
import axios from "axios";
import VueCookie from "vue-cookie";

import { mapActions, mapGetters } from "vuex";
// import LabelCustom from '../../../components/label/labelCustom.vue';
export default {
  components: {
    headerPage,
    headerCard,
    userManageForm,
    LabelCustom,
    // LabelCustom,
  },
  data: () => ({
    data_local: JSON.parse(localStorage.getItem("userDetail")),
    tab: null,
    items: ["ข้อมูลทั่วไป", "คอร์สเรียน", "การแข่งขันและเกียรติบัตร"],
    // text: "Lorem ipsum dolor",
    // text2: "Lorem ipsum dolor2",

    breadcrumbs: [
      { text: "จัดการผู้ใช้งาน", to: "UserList" },
      { text: "เพิ่มผู้ใช้งาน", to: "" },
    ],
    headers: [
      { text: "ชื่อ", value: "student.firstNameTh", sortable: false },
      { text: "นามสกุล", value: "student.lastNameTh", sortable: false },
      { text: "ชื่อคอร์ส", value: "cpo.categoryNameTh", sortable: false },
      { text: "แพ็คเกจ", value: "cpo.packageName", sortable: false },
      { text: "โค้ช", value: "coachName", sortable: false },
      { text: "ประเภท", value: "oneid", sortable: false },
      { text: "ระยะเวลา", value: "cpo.optionName", sortable: false },
      { text: "วัน", value: "days", sortable: false },
      { text: "เวลาเริ่ม", value: "period.start", sortable: false },
      { text: "เวลาสิ้นสุด", value: "period.end", sortable: false },
    ],
    headersTabs: [
      { text: "ชื่อ", value: "student.firstNameTh", sortable: false },
      { text: "นามสกุล", value: "student.lastNameTh", sortable: false },
      { text: "ชื่อคอร์ส", value: "cpo.categoryNameTh", sortable: false },
      { text: "แพ็คเกจ", value: "cpo.packageName", sortable: false },
      { text: "โค้ช", value: "coachName", sortable: false },
      { text: "ประเภท", value: "oneid", sortable: false },
      { text: "ระยะเวลา", value: "cpo.optionName", sortable: false },
      { text: "วัน", value: "days", sortable: false },
      { text: "เวลาเริ่ม", value: "period.start", sortable: false },
      { text: "เวลาสิ้นสุด", value: "period.end", sortable: false },
      { text: "ราคา", value: "price", sortable: false },
    ],

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
    },
    search: "",
    name_certificate: "",
    certificate_date: "",
    certificateType: "",
    title: "ข้อมูลผู้ใช้งาน",
    title2: "การจัดการสิทธิ์",
    title3: "คอร์สเรียน",
    title4: "ข้อมูลผู้ปกครอง",
    addStudentData: "เพิ่มข้อมูลผู้ใช้นักเรียน",
    addParentData: "เพิ่มข้อมูลผู้ใช้ของผู้ปกครอง",
    parent: {
      account_id: "",
      firstname_en: "",
      lastname_en: "",
      username: "",
      tel: "",
    },
    selectRoles: [],
    cart_certificate: [],
    isMatch: false,
    isDisabled: false,
    isEnabled: false,
    certificate_show: false,
    addCertificate_dialog_show: false,
    certificate_dialog_show: false,
    fileName: "",
    previewUrl: null,
    status: "create",
    selectedIndex: "",
    isOpen: false,
    params: "",
    relations: [],
    default_img_update_profile:
      "@/assets/userManagePage/default_img_update_profile.svg",
  }),
  created() {
    // this.GetAll(this.$route.params.account_id);
    // for (const item of JSON.parse(localStorage.getItem("relations"))) {
    //   this.GetStudentData(item.student.studentId);
    //   console.log("student");
    // }
  },
  beforeMount() {
    console.log("this.$route.params.account_id", this.$route.params.account_id);
    this.params = this.$route.params.account_id;
  },
  mounted() {
    this.GetUserById(this.params);
    setTimeout(() => {
      this.GetDataRelationsManagement(this.data_user_by_id);
    }, 1000);
    console.log("object=>", this.profile_user);
    this.relations = localStorage.getItem("relations");
    console.log("this.relations", this.relations);

    this.GetShowById(this.$route.params.account_id);

    if (this.user_data.privilege.includes("นักเรียน")) {
      if (this.user_data.selectedbox == true) {
        this.user_data.isCardOpen = true;
      }
    } else if (this.user_data.privilege.includes("ผู้ปกครอง")) {
      if (this.user_data.selectedbox == true) {
        this.user_data.isCardParentOpen = true;
      }
    } else {
      console.log("object");
      this.user_data.isCardOpen = false;
      this.user_data.isCardParentOpen = false;
    }
    for (const item of JSON.parse(localStorage.getItem("relations"))) {
      this.GetStudentData(item.student.studentId);
    }

    for (const item of JSON.parse(localStorage.getItem("relations"))) {
      this.GetStudentSchedule(item.student.studentId);
    }
    // this.GetAll(this.$route.params.account_id);
    // for (const item of this.relations) {
    //   this.GetStudentData(item.student.studentId);
    //   console.log("student");
    // }
  },
  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      changeStudentsData: "UserManageModules/changeStudentsData",
      changeUserData: "UserManageModules/changeUserData",
      changeParentData: "UserManageModules/changeParentData",
      changeStudentsCertificate:
        "ChangeStudentsCertificate/ChangeStudentsCertificate",
      checkUsernameOneid: "loginModules/checkUsernameOneid",
      GetShowById: "UserModules/GetShowById",
      is_loading: "loginModules/getIsLoading",
      GetAll: "ProfileModules/GetAll",
      GetStudentData: "MyCourseModules/GetStudentData",
      GetUserById: "UserModules/GetUserById",
      GetDataRelationsManagement:
        "UserManageModules/GetDataRelationsManagement",
      GetStudentSchedule: "UserModules/GetStudentSchedule",
    }),

    openFileSelector() {
      this.$refs.fileInput.click();
    },

    onCheckboxChange() {
      if (this.selectedbox) {
        // Checkbox is selected, open the card
        this.user_data.isCardOpen = true;
      } else {
        // Checkbox is unselected, close the card
        this.user_data.isCardOpen = false;
      }
    },

    onCheckboxChangeParent() {
      if (this.user_data.selectedboxParent) {
        // Checkbox is selected, open the card
        this.user_data.isCardParentOpen = true;
      } else {
        // Checkbox is unselected, close the card
        this.user_data.isCardParentOpen = false;
      }
    },
    edit() {
      this.isDisabled = false;
      this.isEnabled = true;
      this.buttonName = "บันทึก";
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
    submitEdit() {
      console.log("submitEdit");
      Swal.fire({
        title: "คุณต้องการแก้ไขข้อมูลหรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
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
    addStudents() {
      this.students.push({
        username: "",
        firstname: "",
        lastname: "",
        tel: "",
      });
    },
    DialogCertificate() {
      this.certificate_dialog_show = true;
    },
    closeDialog() {
      this.certificate_dialog_show = false;
      this.certificate_show = false;
      this.addCertificate_dialog_show = false;
    },
    // uploadFile() {
    //   this.file = this.$refs.fileInput.files[0];
    //   this.fileName = this.file.name
    //   console.log(this.file);
    //   if (!this.file) return;
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     console.log(e);
    //     this.previewUrl = e.target.result;
    //   };
    //   reader.readAsDataURL(this.file);
    // },
    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      console.log("file=>", this.file);
      if (!this.file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.preview_url = e.target.result;
      };
      reader.readAsDataURL(this.file);
    },
    removeFile() {
      this.fileName = "";
    },
    showImg(item) {
      return `${process.env.VUE_APP_URL}/api/v1/files/${item}`;
    },

    addCertificateCard() {
      this.students.certificates.push({
        name_certificate: "",
        certificate_date: "",
        previewUrl: null,
      });
    },
    showCertificate() {
      this.certificate_show = true;
    },

    addCertificateDialog(type) {
      this.status = "create";
      this.name_certificate = "";
      this.certificate_date = "";
      this.file = "";
      this.fileName = "";
      this.previewUrl = null;
      this.certificate_dialog_show = true;
      this.certificateType = type;
    },
    editCertificateDialog(item, index) {
      this.status = "edit";
      this.selectedIndex = index;
      this.name_certificate = item.name_certificate;
      this.certificate_date = item.certificate_date;
      this.previewUrl = item.previewUrl;
      this.certificate_dialog_show = true;
    },
    detailCertificateDialog(item, index) {
      this.status = "detail";
      this.selectedIndex = index;
      this.name_certificate = item.name_certificate;
      this.certificate_date = item.certificate_date;
      this.previewUrl = item.previewUrl;
      this.certificate_dialog_show = true;
    },
    saveDialog() {
      console.log("create success", {
        name_certificate: this.name_certificate,
        certificate_date: this.certificate_date,
        previewUrl: this.previewUrl,
      });

      if (this.status == "create") {
        this.students.certificates.push({
          name_certificate: this.name_certificate,
          certificate_date: this.certificate_date,
          previewUrl: this.previewUrl,
          fileName: this.fileName,
        });
      }
      this.certificate_dialog_show = false;
    },
    saveEditDialog(index) {
      console.log("create success", {
        name_certificate: this.name_certificate,
        certificate_date: this.certificate_date,
        previewUrl: this.previewUrl,
      });

      if (this.status !== "create") {
        console.log("edit select array", this.students.certificates[index]);
        this.students.certificates[index].name_certificate =
          this.name_certificate;
        this.students.certificates[index].certificate_date =
          this.certificate_date;
        this.students.certificates[index].previewUrl = this.previewUrl;
        this.students.certificates[index].fileName = this.fileName;
      }
      this.certificate_dialog_show = false;
    },
    removeCertificate(index) {
      this.students.certificates.splice(index, 1);
    },

    checkUsername(username, type) {
      if (username) {
        this.checkUsernameOneid({
          username: username,
          status: "",
          type: type,
        }).then(() => {
          if (type === "student") {
            console.log("user_student_data", this.course_order.students.filter);
            if (this.user_student_data.length > 0) {
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].firstname_en = this.user_student_data[0].firstNameEng;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].lastname_en = this.user_student_data[0].lastNameEng;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].firstname_th = this.user_student_data[0].firstNameTh;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].lastname_th = this.user_student_data[0].lastNameTh;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].student_name = `${this.user_student_data[0].firstNameEng} ${this.user_student_data[0].lastNameEng} `;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].tel = this.user_student_data[0].mobileNo;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].username = username;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].account_id = this.user_student_data[0].userOneId;
            } else {
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].firstname_en = "";
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].lastname_en = "";
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].student_name = "";
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].tel = "";
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].username = username;
              this.course_order.students.filter(
                (v) => v.username === username
              )[0].account_id = "";
            }
          } else {
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
              console.log("course_order", this.course_order);

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
            }
          }
        });
      } else {
        this.user_data = [];
      }
    },
    registerParent() {
      this.register_type = "parent";
      // this.changeCourseOrderData(this.course_order)
      this.changeDialogRegisterOneId(true);
    },
    addParent() {
      Swal.fire({
        icon: "question",
        title: "คุณต้องการเพิ่มผู้ปกครองหรือไม่",
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
            this.user_login = JSON.parse(localStorage.getItem("userDetail"));

            console.log("object", this.user_data);
            for (const data of this.user_data) {
              console.log("data", data);
              this.set_parent_id = data.userOneId;
              console.log("userOneId", this.set_parent_id);
            }
            let payload = {
              studentId: this.user_login.account_id,
              parentId: this.set_parent_id,
            };
            console.log("payload :", payload);
            let { data } = await axios.post(
              `${process.env.VUE_APP_URL}/api/v1/relations/user`,
              payload,
              config
            );

            if (data.statusCode === 201) {
              if (data.data && data.data.message !== "Duplicate relation.") {
                console.log("succes");
                this.add_parent = false;
                this.user_login = JSON.parse(
                  localStorage.getItem("userDetail")
                );
                this.GetAll(this.user_login.account_id);
              } else {
                throw { error: data };
              }
            } else {
              throw { message: data.message };
            }
          } catch (error) {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "Duplicate relation",
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
      return dayNames.join(" - ");
    },
  },
  computed: {
    ...mapGetters({
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      students: "UserManageModules/getStudent",
      user_data: "UserManageModules/getUserData",
      parents: "UserManageModules/getParent",
      certificates: "UserManageModules/getCertificate",
      user_one_id: "loginModules/getUserOneId",
      show_by_id: "UserModules/getShowById",
      profile_user: "ProfileModules/getProfileUser",
      student_data: "MyCourseModules/getStudentData",
      data_user_by_id: "UserModules/getUserById",
      data_user_relation_management:
        "UserManageModules/getDataRelationsManagement",
      student_schedule: "UserModules/getStudentSchedule",
    }),
    // setFunc() {
    //   console.log("=>");
    //   this.GetAll(this.$route.params.account_id);
    //   return "";
    // },
  },
};
</script>

<style scoped>
.upload-photo {
  border-color: #ff6b81;
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
</style>