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
                  :title="$t('user information')"
                ></headerCard>
                <v-divider></v-divider>

                <v-card class="rounded-lg my-3" color="#FCFCFC">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <labelCustom :text="this.$t('username')"></labelCustom>
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
                            :aspect-ratio="16 / 9"
                          >
                          </v-img>
                        </div>
                      </v-col>

                      <v-col cols="12" sm="8" class="align-self-center">
                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="this.$t('first name(thai)')"
                            ></label-custom>
                            <v-text-field
                              :disabled="!isEnabled"
                              @keydown="validate($event, 'th')"
                              placeholder="-"
                              v-model="show_by_id.firstNameTh"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="this.$t('last name(thai)')"
                            ></label-custom>
                            <v-text-field
                              :disabled="!isEnabled"
                              @keydown="validate($event, 'th')"
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
                              :text="this.$t('first name(english)')"
                            ></label-custom>
                            <v-text-field
                              :disabled="!isEnabled"
                              @keydown="validate($event, 'en')"
                              placeholder="-"
                              v-model="show_by_id.firstNameEng"
                              :rules="rules.name"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="this.$t('last name(english)')"
                            ></label-custom>
                            <v-text-field
                              :disabled="!isEnabled"
                              @keydown="validate($event, 'en')"
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
                            <label-custom
                              :text="this.$t('email')"
                            ></label-custom>
                            <v-text-field
                              disabled
                              @keydown="validate($event, 'en', 'number')"
                              placeholder="-"
                              v-model="show_by_id.email"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="this.$t('phone number')"
                            ></label-custom>
                            <v-text-field
                              disabled
                              @keydown="validate($event, 'en', 'number')"
                              placeholder="-"
                              v-model="show_by_id.mobileNo"
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
                  :title="$t('permission management')"
                ></headerCard>
                <v-divider></v-divider>
                <v-card class="rounded-lg my-5" color="#FCFCFC">
                  <v-card-text class="mt-3">
                    <v-row class="mr-3 ml-3">
                      <v-col cols="12" sm="6">
                        <label-custom :text="$t('user role')"></label-custom>
                        <v-text-field
                          dense
                          outlined
                          disabled
                          :placeholder="this.$t('no user roles yet')"
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
                  ['R_1', 'R_2', 'R_3', 'R_4'].some((v) => v == item.roleId)
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
                            :aspect-ratio="16 / 9"
                          >
                          </v-img>
                        </div>
                      </v-col>

                      <v-col cols="12" sm="8">
                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="$t('first name(thai)')"
                            ></label-custom>
                            <v-text-field
                              :disabled="!isEnabled"
                              @keydown="validate($event, 'th')"
                              placeholder="-"
                              v-model="show_by_id.firstNameTh"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="$t('last name(thai)')"
                            ></label-custom>
                            <v-text-field
                              :disabled="!isEnabled"
                              @keydown="validate($event, 'th')"
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
                              :text="$t('first name(english)')"
                            ></label-custom>
                            <v-text-field
                              :disabled="!isEnabled"
                              @keydown="validate($event, 'en')"
                              placeholder="-"
                              v-model="show_by_id.firstNameEng"
                              :rules="rules.name"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="$t('last name(english)')"
                            ></label-custom>
                            <v-text-field
                              :disabled="!isEnabled"
                              @keydown="validate($event, 'en')"
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
                            <label-custom :text="$t('email')"></label-custom>
                            <v-text-field
                              disabled
                              @keydown="validate($event, 'en', 'number')"
                              placeholder="-"
                              v-model="show_by_id.email"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="$t('phone number')"
                            ></label-custom>
                            <v-text-field
                              disabled
                              @keydown="validate($event, 'en', 'number')"
                              placeholder="-"
                              v-model="show_by_id.mobileNo"
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
                  :title="$t('permission management')"
                ></headerCard>
                <v-divider></v-divider>

                <v-card class="rounded-lg my-3" color="#FCFCFC">
                  <v-card-text class="mt-3">
                    <v-row class="mr-3 ml-3">
                      <v-col cols="12" sm="6">
                        <label-custom :text="$t('user role')"></label-custom>
                        <v-text-field
                          dense
                          outlined
                          disabled
                          :value="
                            $i18n.locale == 'th'
                              ? item.roleNameTh
                              : item.roleNameEng
                          "
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
                                    :aspect-ratio="16 / 9"
                                  >
                                  </v-img>
                                </div>
                              </v-col>

                              <v-col cols="12" sm="8">
                                <v-row>
                                  <v-col cols="12" sm="6">
                                    <label-custom
                                      :text="$t('first name(thai)')"
                                    ></label-custom>
                                    <v-text-field
                                      :disabled="!isEnabled"
                                      @keydown="validate($event, 'th')"
                                      placeholder="-"
                                      v-model="show_by_id.firstNameTh"
                                      outlined
                                      dense
                                    >
                                    </v-text-field>
                                  </v-col>

                                  <v-col cols="12" sm="6">
                                    <label-custom
                                      :text="$t('last name(thai)')"
                                    ></label-custom>
                                    <v-text-field
                                      :disabled="!isEnabled"
                                      @keydown="validate($event, 'th')"
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
                                      :text="$t('first name(english)')"
                                    ></label-custom>
                                    <v-text-field
                                      :disabled="!isEnabled"
                                      @keydown="validate($event, 'en')"
                                      placeholder="-"
                                      v-model="show_by_id.firstNameEng"
                                      :rules="rules.name"
                                      outlined
                                      dense
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6">
                                    <label-custom
                                      :text="$t('last name(english)')"
                                    ></label-custom>
                                    <v-text-field
                                      :disabled="!isEnabled"
                                      @keydown="validate($event, 'en')"
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
                                    <label-custom
                                      t
                                      :text="$t('email')"
                                    ></label-custom>
                                    <v-text-field
                                      disabled
                                      @keydown="
                                        validate($event, 'en', 'number')
                                      "
                                      placeholder="-"
                                      v-model="show_by_id.email"
                                      outlined
                                      dense
                                    >
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6">
                                    <label-custom
                                      :text="$t('phone number')"
                                    ></label-custom>
                                    <v-text-field
                                      disabled
                                      @keydown="
                                        validate($event, 'en', 'number')
                                      "
                                      placeholder="-"
                                      v-model="show_by_id.mobileNo"
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
                          :title="$t('permission management')"
                        ></headerCard>
                        <v-divider></v-divider>

                        <v-card class="rounded-lg my-3" color="#FCFCFC">
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" sm="6">
                                <label-custom
                                  :text="$t('user role')"
                                ></label-custom>

                                <v-text-field
                                  :value="
                                    $i18n.locale == 'th'
                                      ? item.roleNameTh
                                      : item.roleNameEng
                                  "
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
                          :title="$t('parent information')"
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
                                  :text="$t('username')"
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
                                  :text="$t('first name(english)')"
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
                                  :text="$t('last name(english)')"
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
                                  :text="$t('phone number')"
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
                              {{ $t("parent information not found") }}
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
                          :title="$t('course')"
                        ></headerCard>
                        <v-divider></v-divider>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-text-field
                          dense
                          outlined
                          :label="$t('search')"
                          color="pink"
                          hide-details
                          v-model="search"
                          @input="search_data(search)"
                          prepend-inner-icon="mdi-magnify"
                        ></v-text-field>
                      </v-col>
                      <!-- <pre>{{ student_schedule }}</pre> -->
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
                              item.cpo.courseTypeNameTh
                                ? item.cpo.courseTypeNameTh
                                : "คอร์สระยะสั้น"
                            }}
                            <!-- {{
                              item.cpo
                                ? item.cpo.courseTypeNameTh
                                : "คอร์สระยะสั้น"
                            }} -->
                          </template>

                          <template v-slot:[`item.timeLine`]="{ item }">
                            {{ item.cpo ? item.cpo.optionName : "-" }}
                          </template>

                          <template v-slot:[`no-results`]>
                            <div class="font-bold">
                              {{ $t("no data found in table") }}
                            </div>
                          </template>
                          <template v-slot:no-data>
                            <v-list-item>
                              <v-list-item-title>
                                {{ $t("no data found") }}
                              </v-list-item-title>
                            </v-list-item>
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
                      <v-col cols="12">
                        <headerCard
                          :icon="'mdi-book-account-outline'"
                          :icon_color="'#FF6B81'"
                          :title="$t('port')"
                        ></headerCard>
                        <v-divider></v-divider>
                      </v-col>
                      <v-col cols="12">
                        <v-btn
                          color="#ff6b81"
                          text
                          @click="
                            $router.push({
                              name: 'FrontPortfolio',
                              params: { account_id: $route.params.account_id },
                            })
                          "
                        >
                          <v-icon>mdi-book-account-outline</v-icon>
                          <span class="indent-2">{{
                            $t("view portfolio")
                          }}</span>
                        </v-btn>
                      </v-col>
                    </v-row>

                    <v-row class="mb-3">
                      <v-col>
                        <headerCard
                          :icon="'mdi-file-certificate-outline'"
                          :icon_color="'#FF6B81'"
                          :title="$t('competitions and certificates')"
                        ></headerCard>
                        <v-divider></v-divider>
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="4">
                        <v-text-field
                          v-model="certificate_search"
                          @input="searchCertificate($event)"
                          :label="$t('search')"
                          dense
                          outlined
                          prepend-inner-icon="mdi-magnify"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="8" class="text-right">
                        <v-btn
                          color="#ff6b81"
                          text
                          @click="DialogCertificate('', 'create')"
                        >
                          <v-icon>mdi-file-plus-outline</v-icon>
                          {{ $t("add competitions and certificates") }}
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-card
                      outlined
                      class="mb-3"
                      v-if="certificate_filter.length == 0"
                    >
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" class="text-center">
                            {{ $t("no match information found") }}
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                    <div
                      v-for="(certificate, index) in certificate_filter"
                      :key="`certificate-${index}`"
                    >
                      <v-card outlined class="mb-3">
                        <v-card-text>
                          <v-row dense class="flax align-center">
                            <v-col>
                              <v-row dense>
                                <v-col class="text-lg font-bold">
                                  {{ certificate.certificateName }}
                                </v-col>
                                <v-col>
                                  {{ $t("race day") }}:
                                  {{ genDate(certificate.certificateDate) }}
                                </v-col>
                              </v-row>
                              <v-row dense>
                                <v-col cols="auto">
                                  <v-img
                                    width="32"
                                    height="32"
                                    src="@/assets/userManagePage/certificate .png"
                                  ></v-img>
                                </v-col>
                                <v-col
                                  v-if="!certificate.certificateAttachment"
                                ></v-col>
                                <v-col
                                  v-else
                                  class="text-[#ff6b81] underline cursor-pointer"
                                  align-self="center"
                                  @click="
                                    OpenFileCertificate(
                                      certificate.certificateAttachment
                                    )
                                  "
                                >
                                  {{ certificate.originalFileName }}
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col cols="auto">
                              <v-btn
                                dark
                                v-if="certificate.certificateAttachment"
                                depressed
                                color="#ff6b81"
                                @click="
                                  DialogCertificate(certificate, 'detail')
                                "
                              >
                                {{ $t("show certificate") }}
                              </v-btn>
                              <v-btn
                                dark
                                v-else
                                depressed
                                color="#ff6b81"
                                @click="DialogCertificate(certificate, 'edit')"
                              >
                                <v-icon>mdi-plus</v-icon>
                                {{ $t("add certificate") }}
                              </v-btn>
                            </v-col>
                            <v-col cols="auto">
                              <v-btn
                                depressed
                                color="#FDECEC"
                                @click="
                                  removeCertificate(certificate.certificateId)
                                "
                              >
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
              <!-- Role R 4 -->
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
                  :title="$t('student information')"
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
                        <label-custom :text="$t('username')"></label-custom>
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
                          :text="$t('first name(english)')"
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
                        <label-custom
                          :text="$t('last name(english)')"
                        ></label-custom>
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
                        <label-custom :text="$t('phone number')"></label-custom>
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
                  :title="$t('student information')"
                ></headerCard>
                <v-divider></v-divider>

                <v-card class="rounded-lg my-3">
                  <v-card-text
                    class="text-center border-2 border-[#ff6b81] rounded-lg"
                  >
                    <span class="text-lg font-bold">
                      <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                      {{ $t("student information not found") }}
                    </span>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- TABLE R4 -->
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
                    <!-- {{ item.cpo ? item.cpo.courseTypeNameTh : "คอร์สระยะสั้น" }} -->
                    {{
                      item.cpo.courseTypeNameTh
                        ? item.cpo.courseTypeNameTh
                        : "คอร์สระยะสั้น"
                    }}
                  </template>

                  <template v-slot:[`item.timeLine`]="{ item }">
                    {{ item.cpo ? item.cpo.optionName : "-" }}
                  </template>

                  <template v-slot:[`no-results`]>
                    <div class="font-bold">
                      {{ $t("no data found in table") }}
                    </div>
                  </template>
                </v-data-table>
              </v-col>
              <!-- TABLE R3 -->
              <v-col cols="13" v-if="item.roleId == 'R_3'">
                <headerCard
                  :icon="'mdi-book-outline'"
                  :icon_color="'#FF6B81'"
                  :title="$t('courses')"
                ></headerCard>
                <v-divider></v-divider>
                <v-data-table
                  :headers="roleCoachTable"
                  class="header-table elevation-1"
                  :search="course_search"
                  :items="course_coach_list"
                >
                  <template v-slot:no-data="">
                    <v-row>
                      <v-col class="text-center">
                        {{ $t("course not found") }}
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`no-results`]>
                    <div class="font-bold">
                      {{ $t("no data found in table") }}
                    </div>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>

          <!-- Button -->
          <v-container v-if="tab == 0" fluid>
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
                        from: 'userList',
                      },
                    })
                  "
                >
                  <v-icon size="18">mdi-pencil-outline</v-icon>
                  <span>{{ $t("edit") }}</span>
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
                  {{ $t("cancel") }}
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
                  {{ $t("save") }}
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
      width="60vw"
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
            {{ $t("add competitions and certificates") }}
          </div>
          <v-row dense class="ml-5 mx-5">
            <v-col cols="12">
              <LabelCustom
                required
                :text="$t('competition name')"
              ></LabelCustom>
              <v-text-field
                ref="certificate_name"
                dense
                :disabled="certificate_data.state == 'create' ? false : true"
                :placeholder="$t('please specify the name of the competition')"
                v-model="certificate_data.certificate_name"
                outlined
                :rules="certificate_dialog_show ? rules_certificate_name : []"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <LabelCustom required :text="$t('date')"></LabelCustom>
              <v-menu
                v-model="certificate_data.menu_certificate_date"
                :close-on-content-click="false"
                transition="scale-transition"
                :disabled="certificate_data.state == 'create' ? false : true"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    ref="certificate_date"
                    dense
                    outlined
                    :disabled="
                      certificate_data.state == 'create' ? false : true
                    "
                    v-model="certificate_data.certificate_date_src"
                    readonly
                    :rules="
                      certificate_dialog_show ? rules_certificate_date : []
                    "
                    :placeholder="
                      $t('please specify the date of the competition')
                    "
                    v-bind="attrs"
                    v-on="on"
                  >
                    <template v-slot:append>
                      <v-icon
                        :color="
                          certificate_data.certificate_date ? '#FF6B81' : ''
                        "
                        >mdi-calendar</v-icon
                      >
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  :max="today.toISOString()"
                  v-model="certificate_data.certificate_date"
                  locale="th-TH"
                  @change="inputDate($event)"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <!-- Upload file -->
          <template v-if="certificate_data.state !== 'detail'">
            <v-card class="mx-5 my-5" flat>
              <v-card-text
                class="border-dashed border-2 rounded-lg my-3"
                style="border: dashed rgb(255, 107, 129)"
              >
                <v-row>
                  <v-col cols="12" class="flex align-center justify-center">
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
                    {{ $t("upload certificate") }}
                  </v-col>
                  <v-col
                    cols="12"
                    class="flex align-center justify-center text-caption"
                  >
                    {{ $t("recommendation") }}
                  </v-col>
                  <v-col cols="12" class="flex align-center justify-center">
                    <v-btn
                      :disabled="certificate_data.fileName ? true : false"
                      outlined
                      color="#ff6b81"
                      @click="openFileSelector"
                      >{{ $t("choose file") }}</v-btn
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
            <v-card outlined v-if="certificate_data.fileName" class="pa-4 ma-4">
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
          </template>
          <div v-else class="pa-3">
            <v-card flat align="center">
              <v-img
                :src="certificate_data.certificate_attachment"
                class="rounded-lg"
                :aspect-ratio="16 / 9"
                style="max-width: 500px"
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
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </div>
          <div class="text-center mx-5 mb-5">
            <v-btn
              :disabled="!certificate_form"
              v-if="certificate_data.state !== 'detail'"
              depressed
              class="white--text btn-size-lg"
              color="#ff6b81"
              @click="saveDialog()"
            >
              {{ $t("save") }}
            </v-btn>
            <v-btn
              v-else
              depressed
              class="white--text"
              color="#ff6b81"
              @click="certificate_dialog_show = false"
            >
              {{ $t("close") }}
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
import { CheckFileSize, dateFormatter } from "@/functions/functions";
import axios from "axios";
import VueCookie from "vue-cookie";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  components: {
    headerPage,
    headerCard,
    userManageForm,
    LabelCustom,
  },
  data: () => ({
    tab: null,
    show_certificates: false,
    course_search: "",
    certificate_search: "",
    certificate_filter: [],
    certificate_form: false,
    certificate_data: {
      certificate_name: "",
      certificate_date: "",
      certificate_date_src: "",
      menu_certificate_date: false,
      file: null,
      fileName: null,
      preview_url: "",
      certificate_attachment: "",
      state: "create",
    },
    search: "",
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
    today: new Date(),
    rules_certificate_date: [],
    rules_certificate_name: [],
  }),
  created() {
    this.params = this.$route?.params?.account_id;
    this.user_login = JSON.parse(localStorage.getItem("userDetail"));
  },
  mounted() {
    this.GetUserById(this.params);
    this.show_by_id.userRoles;
    setTimeout(() => {
      this.GetDataRelationsManagement(this.show_by_id);
      if (this.show_by_id.userRoles?.some((v) => v.roleId == "R_3")) {
        this.GetCourseCoachList({ account_id: this.params });
      }
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

    // let re = localStorage.getItem("relations");
    // if (re) {
    //   for (const item of JSON.parse(localStorage.getItem("relations"))) {
    //     this.GetStudentData(item.student.studentId);
    //   }

    //   for (const item of JSON.parse(localStorage.getItem("relations"))) {
    //     this.GetStudentSchedule(item.student.studentId);
    //   }
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
      // Cartificate
      UpdateCertificate: "UserManageModules/UpdateCertificate",
      GetCertificateListByAccount:
        "UserManageModules/GetCertificateListByAccount",
      CreateCertificate: "UserManageModules/CreateCertificate",
      DeleteCertificate: "UserManageModules/DeleteCertificate",
      // Course Coach List
      GetCourseCoachList: "UserManageModules/GetCourseCoachList",
    }),
    inputDate(e) {
      this.certificate_data.menu_certificate_date = false;
      this.certificate_data.certificate_date_src = dateFormatter(
        e,
        "DD MMT YYYYT"
      );
    },
    OpenFileCertificate(url) {
      window.open(url, "_blank");
    },
    genDate(date) {
      let dateObj = new Date(date);
      return dateObj.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
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
      this.buttonName = this.$t("save");
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
    submitEdit() {
      Swal.fire({
        title: this.$t("do you want to edit the information?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
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
    DialogCertificate(certificate, state) {
      // console.log(certificate)
      this.rules_certificate_name = [
        (val) =>
          (val || "").length > 0 ||
          this.$t("please specify the name of the competition"),
        (val) =>
          (val || "").length <= 50 ||
          this.$t(
            "please specify the name of the competition with no more than 50 characters"
          ),
      ];
      this.rules_certificate_date = [
        (val) =>
          (val || "").length > 0 ||
          this.$t("please specify the date of the competition"),
      ];
      if (state !== "create") {
        this.certificate_data = {
          certificate_id: certificate.certificateId,
          certificate_name: certificate.certificateName,
          certificate_date: moment(certificate.certificateDate).format(
            "YYYY-MM-DD"
          ),
          certificate_date_src: new Date(
            certificate.certificateDate
          ).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          menu_certificate_date: false,
          file: null,
          fileName: null,
          preview_url: "",
          certificate_attachment: certificate.certificateAttachment,
          state: state,
        };
      }
      this.certificate_dialog_show = true;
    },
    closeDialog() {
      this.$refs.certificate_name.resetValidation();
      this.$refs.certificate_date.resetValidation();
      this.certificate_dialog_show = false;
      this.certificate_show = false;
      this.addCertificate_dialog_show = false;
      this.certificate_data = {
        certificate_name: "",
        certificate_date: "",
        certificate_date_src: "",
        menu_certificate_date: false,
        file: null,
        fileName: null,
        preview_url: "",
        certificate_attachment: "",
        state: "create",
      };
    },
    uploadFile(event) {
      this.certificate_data.file = this.$refs.fileInput.files[0];
      if (!this.certificate_data.file) return;
      if (CheckFileSize(this.certificate_data.file, event.target.id) === true) {
        const fileType = this.certificate_data.file.type;
        if (fileType === "image/png" || fileType === "image/jpeg") {
          this.certificate_data.fileName = this.certificate_data.file.name;
          const reader = new FileReader();
          reader.onload = (e) => {
            this.certificate_data.preview_url = e.target.result;
          };
          reader.readAsDataURL(this.certificate_data.file);
        } else {
          Swal.fire({
            icon: "error",
            text: this.$t("upload only image files (png, jpeg) only"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      }
    },
    removeFile() {
      // console.log("removeFile");
      this.certificate_data.file = null;
      this.certificate_data.fileName = "";
      this.certificate_data.preview_url = null;
    },
    showImg(item) {
      return `${process.env.VUE_APP_URL}/api/v1/files/${item}`;
    },
    searchCertificate(search) {
      const searchQuery = search.toLowerCase();
      this.certificate_filter = this.certificates.filter((v) => {
        const certificateName = v.certificateName.toLowerCase();
        if (!certificateName.includes(searchQuery)) {
          return false;
        } else {
          return certificateName.includes(searchQuery);
        }
      });
    },
    saveDialog() {
      if (this.certificate_data.state == "create") {
        this.$refs.certificate_form.validate();
        if (this.certificate_form) {
          this.CreateCertificate({
            certificate_data: {
              ...this.certificate_data,
              account_id: this.params,
            },
          });
          this.certificate_dialog_show = false;
          this.certificate_show = false;
          this.addCertificate_dialog_show = false;
          this.certificate_data = {
            certificate_name: "",
            certificate_date: "",
            certificate_date_src: "",
            menu_certificate_date: false,
            file: null,
            fileName: null,
            preview_url: "",
            certificate_attachment: "",
            state: "create",
          };
          this.certificate_dialog_show = false;
        }
      } else if (this.certificate_data.state == "edit") {
        // console.log(this.certificate_data);
        this.$refs.certificate_form.validate();
        if (this.certificate_form) {
          this.UpdateCertificate({
            certificate_data: {
              ...this.certificate_data,
              account_id: this.params,
            },
            certificate_id: this.certificate_data.certificate_id,
          });
          this.certificate_dialog_show = false;
          this.certificate_show = false;
          this.addCertificate_dialog_show = false;
          this.certificate_data = {
            certificate_name: "",
            certificate_date: "",
            certificate_date_src: "",
            menu_certificate_date: false,
            file: null,
            fileName: null,
            preview_url: "",
            certificate_attachment: "",
            state: "create",
          };
          this.certificate_dialog_show = false;
        }
      }
      this.$refs.certificate_name.resetValidation();
      this.$refs.certificate_date.resetValidation();
    },
    removeCertificate(certificate_id) {
      // console.log(certificate_id)
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to delete this contest?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("cancel"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.DeleteCertificate({
            cartificate_id: certificate_id,
            account_id: this.params,
          });
        }
      });
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
        title: this.$t("do you want to add a parent?"),
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
              title: this.$t("something went wrong"),
              text: this.$t("duplicate relationship"),
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
      course_coach_list: "UserManageModules/course_coach_list",
    }),
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },

    breadcrumbs() {
      if (this.$route?.params?.from === "Dashboard") {
        return [
          { text: this.$t("dashboard"), to: "StudentList" },
          { text: this.$t("add accounts"), to: "UserList" },
          { text: this.$t("add user"), to: "" },
        ];
      } else {
        return [
          { text: this.$t("add accounts"), to: "UserList" },
          { text: this.$t("add user"), to: "" },
        ];
      }
    },

    items() {
      return [
        this.$t("general information"),
        this.$t("courses"),
        this.$t("competitions and certificates"),
      ];
    },
    roleCoachTable() {
      return [
        {
          text: this.$t("course name"),
          value: this.$i18n.locale == "th" ? "courseNameTh" : "courseNameEn",
          sortable: false,
        },
        {
          text: this.$t("wls name"),
          value:
            this.$i18n.locale == "th" ? "categoryNameTh" : "categoryNameEn",
          sortable: false,
        },
        {
          text: this.$t("course type"),
          value:
            this.$i18n.locale == "th" ? "courseTypeNameTh" : "courseTypeNameEn",
          sortable: false,
        },
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
        certificate_name: [
          (val) =>
            (val || "").length > 0 ||
            this.$t("please specify the name of the competition"),
          (val) =>
            (val || "").length <= 50 ||
            this.$t(
              "please specify the name of the competition with no more than 50 characters"
            ),
        ],
        certificate_date: [
          (val) =>
            (val || "").length > 0 ||
            this.$t("please specify the date of the competition"),
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
      };
    },
  },

  watch: {
    certificates: function () {
      this.searchCertificate("");
    },
    tab: function (val) {
      if (val == 2) {
        this.GetCertificateListByAccount({ account_id: this.params });
      }
    },
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
