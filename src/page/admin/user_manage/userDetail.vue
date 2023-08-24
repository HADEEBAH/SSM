<template>
  <v-container fluid class="overflow-x-hidden overflow-y-hidden">
    <v-row v-if="$route?.params?.action == 'view'" dense class="mt-5">
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
                    <v-row>
                      <v-col cols="12" sm="6">
                        <labelCustom text="Username"></labelCustom>
                        <v-text-field
                          v-model="show_by_id.userName"
                          dense
                          outlined
                          disabled
                        >
                          <template v-slot:append>
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
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <v-container fluid v-if="show_by_id.userRoles <= 0">
            <v-row>
              <v-col cols="12">
                <v-card class="rounded-lg my-3" color="#FCFCFC">
                  <v-card-text>
                    <v-row>
                      <v-col
                        class="webkit-center"
                        cols="12"
                        sm="4"
                        align-self="center"
                      >
                        <div class="cicle">
                          <v-img
                            class="image-cropper items-end"
                            :src="
                              show_by_id.image || show_by_id.image !== ''
                                ? show_by_id.image
                                : require(`@/assets/userManagePage/default_img_update_profile.svg`)
                            "
                          >
                          </v-img>
                        </div>
                      </v-col>

                      <v-col cols="12" sm="8" class="align-self-center">
                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
                            <v-text-field
                              :disabled="!isEnabled"
                              @keypress="validate($event, 'th')"
                              placeholder="-"
                              v-model="show_by_id.firstNameTh"
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
                              :disabled="!isEnabled"
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
                              :disabled="!isEnabled"
                              @keypress="validate($event, 'en')"
                              placeholder="-"
                              v-model="show_by_id.firstNameEng"
                              :rules="rules.name"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="Last Name (English)"
                            ></label-custom>
                            <v-text-field
                              :disabled="!isEnabled"
                              @keypress="validate($event, 'en')"
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
                              @keypress="validate($event, 'en', 'number')"
                              placeholder="-"
                              v-model="show_by_id.email"
                              :rules="rules.email"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom text="เบอร์โทรศัพท์"></label-custom>
                            <v-text-field
                              disabled
                              @keypress="validate($event, 'en', 'number')"
                              placeholder="-"
                              v-model="show_by_id.mobileNo"
                              :rules="rules.email"
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

                <!-- การจัดการสิทธิ์ -->
                <headerCard
                  icon="mdi-card-account-details-outline"
                  icon_color="#FF6B81"
                  :title="title2"
                ></headerCard>
                <v-divider></v-divider>

                <v-card class="rounded-lg my-5" color="#FCFCFC">
                  <v-card-text class="mt-3">
                    <v-row class="mr-3 ml-3">
                      <v-col cols="12" sm="6">
                        <label-custom text="บทบาทผู้ใช้งาน"></label-custom>
                        <v-text-field
                          dense
                          outlined
                          disabled
                          placeholder="ยังไม่มีบทบาทผู้ใช้งาน"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <v-container fluid>
            <v-row v-for="(item, index) in show_by_id.userRoles" :key="index">
              <v-col
                cols="12"
                v-if="
                  item.roleId == 'R_1' ||
                  item.roleId == 'R_2' ||
                  item.roleId == 'R_3' ||
                  item.roleId == 'R_4'
                "
              >
                <!-- Role admin || Role coach || Parent -->
                <v-card class="rounded-lg my-3" color="#FCFCFC">
                  <v-card-text>
                    <v-row>
                      <v-col
                        class="webkit-center"
                        cols="12"
                        sm="4"
                        align-self="center"
                      >
                        <div class="cicle">
                          <v-img
                            class="image-cropper"
                            :src="
                              show_by_id.image || show_by_id.image !== ''
                                ? show_by_id.image
                                : require(`@/assets/userManagePage/default_img_update_profile.svg`)
                            "
                          >
                          </v-img>
                        </div>
                      </v-col>

                      <v-col cols="12" sm="8">
                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
                            <v-text-field
                              :disabled="!isEnabled"
                              @keypress="validate($event, 'th')"
                              placeholder="-"
                              v-model="show_by_id.firstNameTh"
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
                              :disabled="!isEnabled"
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
                              :disabled="!isEnabled"
                              @keypress="validate($event, 'en')"
                              placeholder="-"
                              v-model="show_by_id.firstNameEng"
                              :rules="rules.name"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="Last Name (English)"
                            ></label-custom>
                            <v-text-field
                              :disabled="!isEnabled"
                              @keypress="validate($event, 'en')"
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
                              @keypress="validate($event, 'en', 'number')"
                              placeholder="-"
                              v-model="show_by_id.email"
                              :rules="rules.email"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom text="เบอร์โทรศัพท์"></label-custom>
                            <v-text-field
                              disabled
                              @keypress="validate($event, 'en', 'number')"
                              placeholder="-"
                              v-model="show_by_id.mobileNo"
                              :rules="rules.email"
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

                <!-- การจัดการสิทธิ์ R1-R4 -->
                <headerCard
                  :icon="'mdi-card-account-details-outline'"
                  :icon_color="'#FF6B81'"
                  :title="title2"
                ></headerCard>
                <v-divider></v-divider>

                <v-card class="rounded-lg my-3" color="#FCFCFC">
                  <v-card-text class="mt-3">
                    <v-row class="mr-3 ml-3">
                      <v-col cols="12" sm="6">
                        <label-custom text="บทบาทผู้ใช้งาน"></label-custom>

                        <v-text-field
                          v-model="item.roleNameTh"
                          dense
                          outlined
                          disabled
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Role Student -->
              <v-col cols="12" v-if="item.roleId == 'R_5'">
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
                <v-expand-transition>
                  <v-container fluid v-if="tab === 0">
                    <v-row>
                      <v-col cols="12">
                        <v-card class="rounded-lg my-3" color="#FCFCFC">
                          <v-card-text>
                            <v-row>
                              <v-col
                                class="webkit-center"
                                cols="12"
                                sm="4"
                                align-self="center"
                              >
                                <div class="cicle">
                                  <v-img
                                    class="image-cropper items-end"
                                    :src="
                                      show_by_id.image ||
                                      show_by_id.image !== ''
                                        ? show_by_id.image
                                        : require(`@/assets/userManagePage/default_img_update_profile.svg`)
                                    "
                                  >
                                  </v-img>
                                </div>
                              </v-col>

                              <v-col cols="12" sm="8">
                                <v-row>
                                  <v-col cols="12" sm="6">
                                    <label-custom
                                      text="ชื่อ (ภาษาไทย)"
                                    ></label-custom>
                                    <v-text-field
                                      :disabled="!isEnabled"
                                      @keypress="validate($event, 'th')"
                                      placeholder="-"
                                      v-model="show_by_id.firstNameTh"
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
                                      :disabled="!isEnabled"
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
                                      :disabled="!isEnabled"
                                      @keypress="validate($event, 'en')"
                                      placeholder="-"
                                      v-model="show_by_id.firstNameEng"
                                      :rules="rules.name"
                                      outlined
                                      dense
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6">
                                    <label-custom
                                      text="Last Name (English)"
                                    ></label-custom>
                                    <v-text-field
                                      :disabled="!isEnabled"
                                      @keypress="validate($event, 'en')"
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
                                      @keypress="
                                        validate($event, 'en', 'number')
                                      "
                                      placeholder="-"
                                      v-model="show_by_id.email"
                                      :rules="rules.email"
                                      outlined
                                      dense
                                    >
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6">
                                    <label-custom
                                      text="เบอร์โทรศัพท์"
                                    ></label-custom>
                                    <v-text-field
                                      disabled
                                      @keypress="
                                        validate($event, 'en', 'number')
                                      "
                                      placeholder="-"
                                      v-model="show_by_id.mobileNo"
                                      :rules="rules.email"
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

                        <!-- การจัดการสิทธิ์ R5  -->
                        <headerCard
                          :icon="'mdi-card-account-details-outline'"
                          :icon_color="'#FF6B81'"
                          :title="title2"
                        ></headerCard>
                        <v-divider></v-divider>

                        <v-card class="rounded-lg my-3" color="#FCFCFC">
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" sm="6">
                                <label-custom
                                  text="บทบาทผู้ใช้งาน"
                                ></label-custom>

                                <v-text-field
                                  v-model="item.roleNameTh"
                                  dense
                                  outlined
                                  disabled
                                >
                                </v-text-field>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>

                        <!-- Parent Detail in Student Role -->
                        <headerCard
                          :icon="'mdi-human-male-boy'"
                          :icon_color="'#FF6B81'"
                          :title="parent_detail"
                        ></headerCard>
                        <v-divider></v-divider>
                      </v-col>
                    </v-row>

                    <v-row v-if="data_user_relation_management.length > 0">
                      <v-col
                        cols="12"
                        v-for="(
                          relations, index_relations
                        ) in data_user_relation_management"
                        :key="index_relations"
                      >
                        <v-card class="rounded-lg my-3" color="#FCFCFC">
                          <v-card-text>
                            <v-row dense align="center">
                              <v-col cols="12" sm="6">
                                <label-custom
                                  text="Parent’s Username (English)"
                                ></label-custom>
                                <v-text-field
                                  v-model="relations.parent.parentUsername"
                                  dense
                                  outlined
                                  disabled
                                  placeholder="-"
                                >
                                </v-text-field>
                              </v-col>

                              <v-col cols="12" sm="6">
                                <label-custom
                                  text="First Name (English)"
                                ></label-custom>
                                <v-text-field
                                  v-model="relations.parent.parentFirstnameEn"
                                  dense
                                  outlined
                                  disabled
                                  placeholder="-"
                                >
                                </v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6">
                                <label-custom
                                  text="Last Name (English)"
                                ></label-custom>
                                <v-text-field
                                  v-model="relations.parent.parentLastnameEn"
                                  dense
                                  outlined
                                  disabled
                                  placeholder="-"
                                >
                                </v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6">
                                <label-custom
                                  text="เบอร์โทรศัพท์"
                                ></label-custom>
                                <v-text-field
                                  v-model="relations.parent.parentTel"
                                  dense
                                  outlined
                                  disabled
                                  placeholder="-"
                                >
                                </v-text-field>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>

                    <v-row v-else>
                      <v-col cols="12">
                        <v-card class="rounded-lg my-3">
                          <v-card-text
                            class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
                          >
                            <span class="text-lg font-bold">
                              <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                              ไม่พบข้อมูลของผู้ปกครอง
                            </span>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-expand-transition>

                <!-- TabS 2 -->
                <v-expand-transition>
                  <v-container fluid v-if="tab === 1">
                    <v-row>
                      <v-col cols="12">
                        <headerCard
                          :icon="'mdi-calendar-today'"
                          :icon_color="'#FF6B81'"
                          :title="title3"
                        ></headerCard>
                        <v-divider></v-divider>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-text-field
                          dense
                          outlined
                          label="ค้นหา"
                          color="pink"
                          hide-details
                          v-model="search"
                          @input="search_data(search)"
                          prepend-inner-icon="mdi-magnify"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12">
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

                          <template v-slot:[`item.package`]="{ item }">
                            {{ item.cpo ? item.cpo.packageName : "-" }}
                          </template>

                          <template v-slot:[`item.courseType`]="{ item }">
                            {{
                              item.cpo
                                ? item.cpo.courseTypeNameTh
                                : "คอร์สระยะสั้น"
                            }}
                          </template>

                          <template v-slot:[`item.timeLine`]="{ item }">
                            {{ item.cpo ? item.cpo.optionName : "-" }}
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-expand-transition>

                 <!-- TABS 3 -->
                 <v-expand-transition>
                  <v-container fluid v-if="tab === 2">
                    <v-row class="mb-3">
                      <v-col>
                        <headerCard
                          :icon="'mdi-file-certificate-outline'"
                          :icon_color="'#FF6B81'"
                          title="การแข่งขันและเกียรติบัตร"
                        ></headerCard>
                        <v-divider></v-divider>
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="4">
                        <v-text-field dense outlined prepend-inner-icon="mdi-magnify"></v-text-field>
                      </v-col>
                      <v-col cols="8" class="text-right">
                        <v-btn color='#ff6b81' text @click="DialogCertificate()">
                          <v-icon>mdi-file-plus-outline</v-icon>
                          เพิ่มการแข่งขันและเกียรติบัตร
                        </v-btn>
                      </v-col>
                    </v-row>
                    <div v-for="(certificate,index) in certificates" :key="`certificate-${index}`">
                      <v-card outlined class="mb-3">
                        <v-card-text>
                          <v-row dense class="flax align-center">
                            <v-col>
                              <v-row dense>
                                <v-col class="text-lg font-bold">
                                  {{certificate.certificateName}}
                                </v-col>
                                <v-col>
                                  วันที่แข่ง: {{genDate(certificate.certificateDate)}}
                                </v-col>
                              </v-row>
                              <v-row dense>
                                <v-col cols="auto">
                                  <v-img width="32" height="32" src="@/assets/userManagePage/certificate .png"></v-img>
                                </v-col>
                                <v-col class="text-[#ff6b81] underline">
                                  {{ certificate.originalFileName }}
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col cols="auto">
                              <v-btn dark v-if="certificate.certificateAttachment" depressed color="#ff6b81" @click="DialogCertificate()">
                                แสดงหนังสือรับรอง
                              </v-btn>
                              <v-btn dark v-else depressed color="#ff6b81" @click="DialogCertificate()">
                                <v-icon>mdi-plus</v-icon>
                                เพิ่มหนังสือรับรอง
                              </v-btn>
                            </v-col>
                            <v-col cols="auto">
                              <v-btn depressed color="#FDECEC">
                                <v-icon color="#F03D3E">mdi-delete</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </div>
                  </v-container>
                 </v-expand-transition>
              </v-col>

              <v-col
                cols="12"
                v-if="
                  item.roleId == 'R_4' &&
                  data_user_relation_management.length > 0
                "
              >
                <headerCard
                  :icon="'mdi-file-plus-outline'"
                  :icon_color="'#FF6B81'"
                  :title="student_detail"
                ></headerCard>
                <v-divider></v-divider>
                <v-card
                  class="rounded-lg my-3"
                  color="#FCFCFC"
                  v-for="(data_item, index) in data_user_relation_management"
                  :key="index"
                >
                  <v-card-text>
                    <!-- Student Data -->
                    <v-row dense align="center">
                      <v-col cols="12" sm="6">
                        <label-custom
                          text="Student’s Username (English)"
                        ></label-custom>
                        <v-text-field
                          v-model="data_item.student.studentUsername"
                          dense
                          outlined
                          disabled
                          placeholder="-"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom
                          text="First Name (English)"
                        ></label-custom>
                        <v-text-field
                          v-model="data_item.student.studentFirstnameEn"
                          dense
                          outlined
                          disabled
                          placeholder="-"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom text="Last Name (English)"></label-custom>
                        <v-text-field
                          v-model="data_item.student.studentLastnameEn"
                          dense
                          outlined
                          disabled
                          placeholder="-"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom text="เบอร์โทรศัพท์"></label-custom>
                        <v-text-field
                          v-model="data_item.student.studentTel"
                          dense
                          outlined
                          disabled
                          placeholder="-"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col
                cols="12"
                v-if="
                  item.roleId == 'R_4' &&
                  data_user_relation_management.length <= 0
                "
              >
                <headerCard
                  :icon="'mdi-file-plus-outline'"
                  :icon_color="'#FF6B81'"
                  :title="student_detail"
                ></headerCard>
                <v-divider></v-divider>

                <v-card class="rounded-lg my-3">
                  <v-card-text
                    class="text-center border-2 border-[#ff6b81] rounded-lg"
                  >
                    <span class="text-lg font-bold">
                      <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                      ไม่พบข้อมูลของนักเรียน
                    </span>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- TABLE -->
              <v-col cols="12" v-if="item.roleId == 'R_4'">
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

                  <template v-slot:[`item.package`]="{ item }">
                    {{ item.cpo ? item.cpo.packageName : "-" }}
                  </template>

                  <template v-slot:[`item.courseType`]="{ item }">
                    {{ item.cpo ? item.cpo.courseTypeNameTh : "คอร์สระยะสั้น" }}
                  </template>

                  <template v-slot:[`item.timeLine`]="{ item }">
                    {{ item.cpo ? item.cpo.optionName : "-" }}
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>

          <!-- Button -->
          <v-container  v-if="tab == 0" fluid>
            <v-row>
              <v-col v-if="!isEnabled" align="right" cols="12">
                <v-btn
                  class="white--text mb-5"
                  depressed
                  color="#ff6b81"
                  @click="
                    $router.push({
                      name: 'UserDetail',
                      params: {
                        action: 'edit',
                        account_id: $route.params.account_id,
                      },
                    })
                  "
                >
                  <v-icon size="18">mdi-pencil-outline</v-icon>
                  <span>แก้ไข</span>
                </v-btn>
              </v-col>

              <v-col v-if="isEnabled" align="right" sm="" cols="12">
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
              <v-col v-if="isEnabled" sm="auto" cols="12">
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
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <userManageForm></userManageForm>
    </v-row>

    <!-- DIALOG -->
    <v-dialog
      class="pa-2"
      width="50vw"
      v-model="certificate_dialog_show"
      persistent
    >
    <v-form ref="certificate_form" v-model="certificate_form">
      <v-card flat>
        <v-card-title>
          <v-row>
            <v-col cols="12" align="right">
              <v-btn icon @click="closeDialog">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <div class="mx-5 text-center mb-3 font-bold text-lg">
          เพิ่มการแข่งขันและเกียรติบัตร
        </div>
        <v-row dense class="ml-5 mx-5">
          <v-col cols="12">
            <LabelCustom required text="การแข่งขัน"></LabelCustom>
            <v-text-field
              ref="certificate_name"
              dense
              placeholder="กรุณาระบุชื่อการแข่งขัน"
              v-model="certificate_data.certificate_name"
              outlined
              :rules="rules.certificate_name"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <LabelCustom required text="วันที่"></LabelCustom>
             <v-menu
              v-model="certificate_data.menu_certificate_date"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  ref="certificate_date"
                  dense
                  outlined
                  v-model="certificate_data.certificate_date_src"
                  readonly
                  :rules="rules.certificate_date"
                  placeholder="ระบุวันที่แข่งขัน"
                  v-bind="attrs"
                  v-on="on"
                >
                  <template v-slot:append>
                    <v-icon
                      :color="certificate_data.certificate_date ? '#FF6B81' : ''"
                      >mdi-calendar</v-icon
                    >
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                :max="today.toISOString()"
                v-model="certificate_data.certificate_date"
                locale="th-TH"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <!-- Upload file -->
        <v-card class="mx-5 my-5" flat>
          <v-card-text
            class="border-dashed border-2 border-blue-600 rounded-lg"
          >
            <v-row>
              <v-col cols="12" class="flex align-center justify-center">
                <v-img
                  src="@/assets/course/upload_file.png"
                  max-height="105"
                  max-width="122"
                ></v-img>
              </v-col>
              <v-col cols="12" class="flex align-center justify-center text-h5">
                อัปโหลดเกียรติบัตร
              </v-col>
              <v-col
                cols="12"
                class="flex align-center justify-center text-caption"
              >
                ( คำแนะนำ : ควรอัปโหลดรูปที่มีขนาด 1024 x 576 (16:9) และ
                ขนาดไฟล์ไม่เกิน 5 Mb ต้องเป็นไฟล์ JPG, PNG )
              </v-col>
              <v-col cols="12" class="flex align-center justify-center">
                <v-btn :disabled="certificate_data.fileName ? true : false" outlined color="blue" @click="openFileSelector"
                  >เลือกไฟล์</v-btn
                >
                <input
                  id="inputFile"
                  ref="fileInput"
                  type="file"
                  @change="uploadFile($event)"
                  style="display: none"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card v-if="certificate_data.fileName" class="pa-4 ma-4">
          <v-row class="align-center">
            <v-col cols="auto">
              <v-img
                src="@/assets/userManagePage/certificate .png"
                width="50px"
                height="50px"
              ></v-img>
            </v-col>
            <v-col cols="8"
              ><span>{{ certificate_data.fileName }}</span></v-col
            >
            <v-col cols="2" align="end">
              <v-btn icon @click="removeFile()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <div class="text-center mx-5 mb-5">
          <v-btn
            v-if="status === 'create'"
            depressed
            class="white--text btn-size-lg"
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
    </v-form>
    </v-dialog>
  </v-container>
</template>

<script>
import Swal from "sweetalert2";
import { inputValidation } from "@/functions/functions";
import LabelCustom from "@/components/label/labelCustom.vue";
import headerPage from "@/components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import userManageForm from "@/components/user_menage/userManageForm.vue";
import { CheckFileSize } from "@/functions/functions";
import axios from "axios";
import VueCookie from "vue-cookie";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    headerPage,
    headerCard,
    userManageForm,
    LabelCustom,
  },
  data: () => ({
    tab: null,
    items: ["ข้อมูลทั่วไป", "คอร์สเรียน", "การแข่งขันและเกียรติบัตร"],
    show_certificates: false,
    certificate_form : false,
    certificate_data:{
      certificate_name: "",
      certificate_date: "",
      certificate_date_src:'',
      menu_certificate_date: false,
      file: null,
      fileName : null,
      preview_url : "",
      certificateAttachment:""
    },
    certificates:[
      {
        certificateName : 'การแข่งขันเปียโนการกุศล กลายปี 2565',
        certificateDate : '2023-08-23',
        certificateAttachment : "",
        originalFileName : "ประกาศนียบัตรรับรองการเข้าแข่งขัน รางวัลการแข่งขัน.pdf",
        fileType: "",
        fileSize: "",
      },
      {
        certificateName : 'การแข่งขันเปียโนการกุศล กลายปี 2565',
        certificateDate : '2023-08-23',
        certificateAttachment : "",
        originalFileName : "ประกาศนียบัตรรับรองการเข้าแข่งขัน รางวัลการแข่งขัน.pdf",
        fileType: "",
        fileSize: "",
      }
    ],
    breadcrumbs: [
      { text: "แดชบอร์ด", to: "StudentList" },
      { text: "จัดการผู้ใช้งาน", to: "UserList" },
      { text: "เพิ่มผู้ใช้งาน", to: "" },
    ],
    roleParentTable: [
      { text: "ชื่อ", value: "student.firstNameTh", sortable: false },
      { text: "นามสกุล", value: "student.lastNameTh", sortable: false },
      { text: "ชื่อคอร์ส", value: "courseNameTh", sortable: false },
      { text: "แพ็กเกจ", value: "package", sortable: false },
      { text: "โค้ช", value: "coachName", sortable: false },
      { text: "ประเภท", value: "courseType", sortable: false },
      { text: "ระยะเวลา", value: "timeLine", sortable: false },
      { text: "วัน", value: "dates", sortable: false },
      { text: "เวลาเริ่ม", value: "start", sortable: false },
      { text: "เวลาสิ้นสุด", value: "end", sortable: false },
    ],
    roleStudentTable: [
      { text: "ชื่อ", value: "student.firstNameTh", sortable: false },
      { text: "นามสกุล", value: "student.lastNameTh", sortable: false },
      { text: "ชื่อคอร์ส", value: "courseNameTh", sortable: false },
      { text: "แพ็กเกจ", value: "package", sortable: false },
      { text: "โค้ช", value: "coachName", sortable: false },
      { text: "ประเภท", value: "courseType", sortable: false },
      { text: "ระยะเวลา", value: "timeLine", sortable: false },
      { text: "วัน", value: "dates", sortable: false },
      { text: "เวลาเริ่ม", value: "start", sortable: false },
      { text: "เวลาสิ้นสุด", value: "end", sortable: false },
      { text: "ราคา", value: "price", sortable: false },
    ],

    rules: {
      certificate_name:[
        (val) => (val || "").length > 0 || "กรุณาระบุชื่อการแข่งขัน",
        (val) => (val || "").length <= 50 || "กรุณาระบุชื่อการแข่งขันไม่เกิน 50 ตัวอักษร",
      ],
      certificate_date:[(val) => (val || "").length > 0 || "กรุณาระบุวันที่แข่งขัน"],
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
    title: "ข้อมูลผู้ใช้งาน",
    title2: "การจัดการสิทธิ์",
    title3: "คอร์สเรียน",
    parent_detail: "ข้อมูลผู้ปกครอง",
    student_detail: "ข้อมูลนักเรียน",
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
    today : new Date()
  }),
  created() {
    this.params = this.$route?.params?.account_id;
  },
  mounted() {
    this.GetUserById(this.params);
    this.show_by_id.userRoles;
    setTimeout(() => {
      this.GetDataRelationsManagement(this.show_by_id);
    }, 500);
    this.relations = localStorage.getItem("relations");

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
      this.user_data.isCardOpen = false;
      this.user_data.isCardParentOpen = false;
    }
    let re = localStorage.getItem("relations")
    if(re){
      for (const item of JSON.parse(localStorage.getItem("relations"))) {
        this.GetStudentData(item.student.studentId);
      }

      for (const item of JSON.parse(localStorage.getItem("relations"))) {
        this.GetStudentSchedule(item.student.studentId);
      }
    }
    
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
    genDate(date){
      let dateObj = new Date(date)
      return dateObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', })
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

    openFileSelector() {
      this.$refs.fileInput.click();
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
      }
    },
    submitEdit() {
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
      this.certificate_data = {

      }
    },

    uploadFile(event) {
      this.certificate_data.file = this.$refs.fileInput.files[0];
      if (!this.certificate_data.file) return;
      if (CheckFileSize(this.certificate_data.file, event.target.id) === true) {
        const fileType = this.certificate_data.file.type;
        if (fileType === "image/png" || fileType === "image/jpeg") {
          this.certificate_data.fileName = this.certificate_data.file.name
          const reader = new FileReader();
          reader.onload = (e) => {
            this.preview_url = e.target.result;
          };
          reader.readAsDataURL(this.file);
        } else {
          Swal.fire({
            icon: "error",
            text: "อัปโหลดเฉพาะไฟล์รูปภาพ(png, jpeg)เท่านั้น",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
          });
        }
      }
    },
    removeFile() {
      console.log("removeFile")
      this.certificate_data.file = null
      this.certificate_data.fileName = "";
    },
    showImg(item) {
      return `${process.env.VUE_APP_URL}/api/v1/files/${item}`;
    },

    addCertificateCard() {
      this.certificates.push({
        certificate_name: "",
        certificate_date: "",
        previewUrl: null,
      });
    },
    showCertificate() {
      this.certificate_show = true;
    },

    addCertificateDialog() {
      this.status = "create";
      this.certificate_data.certificate_name = "";
      this.certificate_data.certificate_date = "";
      this.certificate_data.file = null;
      this.certificate_data.fileName = "";
      this.certificate_data.preview_url = null;
      this.certificate_dialog_show = true;
    },
    editCertificateDialog(item, index) {
      this.status = "edit";
      this.selectedIndex = index;
      this.certificate_data.certificate_name = item.certificate_name;
      this.certificate_data.certificate_date = item.certificate_date;
      this.certificate_data.preview_url = item.previewUrl;
      this.certificate_dialog_show = true;
    },
    detailCertificateDialog(item, index) {
      this.status = "detail";
      this.selectedIndex = index;
      this.certificate_name = item.certificate_name;
      this.certificate_date = item.certificate_date;
      this.previewUrl = item.previewUrl;
      this.certificate_dialog_show = true;
    },
    saveDialog() {
      if (this.status == "create") {
        this.$refs.certificate_form.validate()
        if(this.certificate_form){
          this.certificates.push({
            certificate_name: this.certificate_name,
            certificate_date: this.certificate_date,
            previewUrl: this.previewUrl,
            fileName: this.fileName,
          });
          this.certificate_dialog_show = false;
        }
      }
    },
    saveEditDialog(index) {
      if (this.status !== "create") {
        this.students.certificates[index].certificate_name =
          this.certificate_name;
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

              if (
                this.course_order.students.filter(
                  (v) => v.is_other === false
                )[0]?.parents?.length > 0
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

            for (const data of this.user_data) {
              this.set_parent_id = data.userOneId;
            }
            let payload = {
              studentId: this.user_login.account_id,
              parentId: this.set_parent_id,
            };
            let { data } = await axios.post(
              `${process.env.VUE_APP_URL}/api/v1/relations/user`,
              payload,
              config
            );

            if (data.statusCode === 201) {
              if (data.data && data.data.message !== "Duplicate relation.") {
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
      return dayNames.join(" , ");
    },
    async search_data(name) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/usermanagement/search?name=${name}`,
          config
        );
      } catch (error) {
        console.log(error);
      }
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
      relations_detail: "UserManageModules/getRelationData",
      user_one_temp: "UserModules/getUserOneTemp",
    }),
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
  },

  watch: {
    show_by_id: async function () {
      await this.GetDataRelationsManagement(this.show_by_id);
      for await (const show_data of this.show_by_id?.userRoles) {
        if (show_data.roleId == "R_4") {
          if (this.data_user_relation_management.length > 0) {
            for (const item_relation of this.data_user_relation_management) {
              this.GetStudentSchedule(item_relation.studentId);
            }
          } else {
            this.GetStudentSchedule(this.show_by_id.userOneId);
          }
        } else if (show_data.roleId == "R_5") {
          if (this.data_user_relation_management.length > 0) {
            for (const item_relation of this.data_user_relation_management) {
              this.GetStudentSchedule(item_relation.studentId);
            }
          } else {
            this.GetStudentSchedule(this.show_by_id.userOneId);
          }
        }
      }
    },
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

.webkit-center {
  text-align: -webkit-center;
}
</style>
