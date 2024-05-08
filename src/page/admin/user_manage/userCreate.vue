<template>
  <v-container fluid>
    <v-row class="mt-5">
      <v-col cols="12">
        <headerPage :breadcrumbs="breadcrumbs"></headerPage>
        <v-card class="rounded-lg my-5">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <headerCard
                  :icon="'mdi-card-account-details-outline'"
                  :icon_color="'#FF6B81'"
                  :title="this.$t('user information')"
                ></headerCard>
                <v-divider></v-divider>

                <v-card class="rounded-lg my-5" color="#FCFCFC">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="4">
                        <labelCustom :text="this.$t('username')"></labelCustom>
                        <v-text-field
                          :rules="rules.usernameRules"
                          dense
                          outlined
                          @keydown="validate($event, 'en-number')"
                          v-model="checkData.username"
                          @keyup.enter="checkDataRelation(checkData.username)"
                          :placeholder="this.$t('username')"
                          color="#FF6B81"
                        >
                          <template v-slot:append>
                            <v-icon v-if="checkData.account_id" color="green"
                              >mdi-checkbox-marked-circle-outline</v-icon
                            >
                          </template>
                        </v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        class="align-self-center text-center"
                      >
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
                      <v-col cols="12" sm="4" class="align-self-center">
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

          <v-container v-if="checkData.account_id" fluid>
            <v-row>
              <!-- USER DETAIL -->
              <v-col cols="12">
                <v-card color="#FCFCFC" class="rounded-lg my-5">
                  <v-card-text>
                    <v-row>
                      <!-- IMG DETAIL -->
                      <v-col
                        class="webkit-center"
                        cols="12"
                        sm="5"
                        align-self="center"
                      >
                        <div class="cicle">
                          <v-img
                            class="image-cropper items-end"
                            :src="
                              checkData.image && checkData.image !== ''
                                ? checkData.image
                                : require(`@/assets/userManagePage/default_img_update_profile.svg`)
                            "
                            :aspect-ratio="16 / 9"
                          >
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

                      <v-col cols="12" sm="6">
                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="this.$t('first name(thai)')"
                            ></label-custom>
                            <v-text-field
                              disabled
                              @keydown="validate($event, 'th')"
                              placeholder="-"
                              v-model="checkData.firstname_th"
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
                              disabled
                              @keydown="validate($event, 'th')"
                              placeholder="-"
                              v-model="checkData.lastname_th"
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
                              disabled
                              @keydown="validate($event, 'en')"
                              placeholder="-"
                              v-model="checkData.firstname_en"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="this.$t('last name(english)')"
                            ></label-custom>
                            <v-text-field
                              disabled
                              @keydown="validate($event, 'en')"
                              placeholder="-"
                              v-model="checkData.lastname_en"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="this.$t('nickname(thai)')"
                            ></label-custom>
                            <v-text-field
                              disabled
                              @keydown="validate($event, 'th')"
                              placeholder="-"
                              v-model="checkData.nicknameEn"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="this.$t('nickname(en)')"
                            ></label-custom>
                            <v-text-field
                              disabled
                              @keydown="validate($event, 'en')"
                              placeholder="-"
                              v-model="checkData.nicknameTh"
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
                              @keydown="validate($event, 'en', 'number')"
                              placeholder="-"
                              v-model="checkData.email"
                              outlined
                              dense
                              disabled
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="this.$t('phone number')"
                            ></label-custom>
                            <v-text-field
                              disabled
                              @keydown="validate($event, 'number')"
                              v-model="checkData.tel"
                              outlined
                              dense
                              @input="checkPhoneNumber"
                              maxlength="12"
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="this.$t('school(thai)')"
                            ></label-custom>
                            <v-text-field
                              disabled
                              @keydown="validate($event, 'th')"
                              placeholder="-"
                              v-model="checkData.school.schoolNameTh"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="this.$t('school(en)')"
                            ></label-custom>
                            <v-text-field
                              disabled
                              @keydown="validate($event, 'th')"
                              placeholder="-"
                              v-model="checkData.school.schoolNameEn"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="this.$t('class')"
                            ></label-custom>
                            <v-autocomplete
                              v-model="checkData.class.classNameTh"
                              :items="class_list"
                              item-text="classNameTh"
                              color="#ff6B81"
                              item-color="#ff6b81"
                              outlined
                              :disabled="!isEnabled"
                              dense
                            >
                              <template #no-data>
                                <v-list-item>
                                  {{ $t("data not found") }}
                                </v-list-item>
                              </template>
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              :text="this.$t('congenital disease')"
                            ></label-custom>
                            <v-text-field
                              disabled
                              placeholder="-"
                              v-model="checkData.congenitalDiseaseTh"
                              outlined
                              dense
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <headerCard
                  class=""
                  :icon="'mdi-card-account-details-outline'"
                  :icon_color="'#FF6B81'"
                  :title="this.$t('permission management')"
                ></headerCard>
                <v-divider></v-divider>
                <v-card class="rounded-lg my-5" color="#FCFCFC">
                  <v-card-text>
                    <v-row class="mr-3 ml-3">
                      <v-col cols="12" sm="5">
                        <label-custom
                          :text="this.$t('user role')"
                        ></label-custom>

                        <v-autocomplete
                          disabled
                          dense
                          solo
                          v-model="seledtedRole"
                          value="test"
                          :items="roles"
                          item-text="role"
                          item-value="roleNumber"
                          :placeholder="this.$t('select user role')"
                          item-color="#ff6b81"
                          color="#ff6b81"
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

            <v-row
              v-if="global_role_code === 'R_4' || global_role_code === 'R_5'"
            >
              <v-col cols="12">
                <headerCard
                  class=""
                  :icon="'mdi-file-plus-outline'"
                  :icon_color="'#FF6B81'"
                  :title="
                    global_role_code === 'R_4'
                      ? this.$t('add student information in charge')
                      : this.$t('add parent information')
                  "
                ></headerCard>
                <v-divider></v-divider>
              </v-col>

              <v-col v-if="data_user_relation_management.length > 0" cols="12">
                <v-card
                  class="my-5"
                  color="#FCFCFC"
                  v-for="(
                    data_relations, index_relations
                  ) in data_user_relation_management"
                  :key="index_relations"
                >
                  <v-card-text>
                    <v-row dense align="center">
                      <v-col cols="12" sm="6">
                        <label-custom :text="$t('username')"></label-custom>

                        <!-- <label-custom
                          :text="
                            global_role_code === 'R_4'
                              ? 'Student’s Username (English)'
                              : 'Parent’s Username (English)'
                          "
                        ></label-custom> -->

                        <v-text-field
                          v-if="global_role_code === 'R_4'"
                          outlined
                          dense
                          disabled
                          v-model="data_relations.student.studentUsername"
                        ></v-text-field>

                        <v-text-field
                          v-else
                          outlined
                          dense
                          disabled
                          v-model="data_relations.parent.parentUsername"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <label-custom
                          :text="$t('first name(english)')"
                        ></label-custom>
                        <v-text-field
                          v-if="global_role_code === 'R_4'"
                          outlined
                          dense
                          disabled
                          v-model="data_relations.student.studentFirstnameEn"
                        ></v-text-field>

                        <v-text-field
                          v-else
                          outlined
                          dense
                          disabled
                          v-model="data_relations.parent.parentFirstnameEn"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <label-custom
                          :text="$t('last name(english)')"
                        ></label-custom>
                        <v-text-field
                          v-if="global_role_code === 'R_4'"
                          outlined
                          dense
                          disabled
                          v-model="data_relations.student.studentLastnameEn"
                        ></v-text-field>

                        <v-text-field
                          v-else
                          outlined
                          dense
                          disabled
                          v-model="data_relations.parent.parentLastnameEn"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <label-custom :text="$t('phone number')"></label-custom>
                        <v-text-field
                          v-if="global_role_code === 'R_4'"
                          outlined
                          dense
                          disabled
                          v-model="data_relations.student.studentTel"
                        ></v-text-field>

                        <v-text-field
                          v-else
                          outlined
                          dense
                          disabled
                          v-model="data_relations.parent.parentTel"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" v-else>
                <v-card class="rounded-lg">
                  <v-card-text
                    class="pa-5 text-center border-2 border-[#ff6b81] rounded-lg"
                  >
                    <span class="text-lg font-bold">
                      <v-icon color="#ff6b81">mdi-alert-outline</v-icon>
                      {{
                        global_role_code === "R_4"
                          ? this.$t(
                              "can't find information on students in care"
                            )
                          : this.$t("parent information not found")
                      }}
                    </span>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <v-container v-if="checkData.account_id" fluid>
            <v-row>
              <v-col class="text-right mt-5">
                <v-btn
                  depressed
                  class="white--text"
                  color="#ff6b81"
                  @click="toUserDetail()"
                >
                  {{ $t("edit") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
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
        <header-card
          icon="mdi-card-account-details-outline"
          icon_color="#ff6b81"
          :title="
            global_role_id === 'R_4' ? $t('add student') : $t('add parents')
          "
        >
          <template #actions>
            <v-btn icon @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
          </template>
        </header-card>
        <v-card-text>
          <v-row dense>
            <v-col cols="9">
              <labelCustom :text="this.$t('username')"></labelCustom>
              <v-text-field
                :rules="rules.usernameRules"
                dense
                outlined
                v-model="relation.username"
                @keydown="validate($event, 'en-number')"
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
                :placeholder="this.$t('username')"
                color="#ff6b81"
              >
                <template v-slot:append>
                  <v-icon v-if="relation.account_id" color="green"
                    >mdi-checkbox-marked-circle-outline</v-icon
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
            <v-col cols="auto">
              <br />
              <v-btn
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
                >{{ $t("agree") }}</v-btn
              >
            </v-col>
          </v-row>
          <template>
            <v-row dense>
              <v-col cols="12">
                <labelCustom
                  :text="this.$t('first name(english)')"
                ></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="relation.firstname_en"
                  :placeholder="this.$t('first name(english)')"
                  color="#ff6b81"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <labelCustom
                  :text="this.$t('last name(english)')"
                ></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="relation.lastname_en"
                  :placeholder="this.$t('last name(english)')"
                  color="#ff6b81"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <labelCustom :text="this.$t('phone number')"></labelCustom>
                <v-text-field
                  disabled
                  dense
                  outlined
                  v-model="relation.tel"
                  :placeholder="this.$t('phone number')"
                  color="#ff6b81"
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
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
                class="w-full"
                :color="relation.username.length < 1 ? '#CCCCCC' : '#ff6b81'"
                dark
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
        :title="this.$t('sign up for One ID')"
        :state="register_type"
      ></registerDialogForm>
    </v-dialog>
  </v-container>
</template>
<script>
import headerPage from "@/components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import LabelCustom from "@/components/label/labelCustom.vue";
import { mapActions, mapGetters } from "vuex";
import Swal from "sweetalert2";
import axios from "axios";
import VueCookie from "vue-cookie";
import { inputValidation } from "@/functions/functions";
import registerDialogForm from "@/components/user_menage/registerDialogForm.vue";

export default {
  components: {
    headerPage,
    headerCard,
    LabelCustom,
    registerDialogForm,
  },

  data: () => ({
    global_role_id: "",
    register_type: "",
    seledtedRole: "",
    preview_img: "",
    send_image_profile: null,
    // rules: {
    //   usernameRules: [
    //     (val) =>
    //       (val || "").length > 5 ||
    //       "โปรดระบุชื่อผู้ใช้ความยาวไม่น้อยกว่า 6 ตัวอักษร",
    //     (val) =>
    //       (val || "").length < 20 ||
    //       "โปรดระบุชื่อผู้ใชความยาวไม่เกิน 20 ตัวอักษร",
    //     (val) => /[A-Za-z0-9 ]/g.test(val) || "ชื่อผู้ใช้ต้องไม่มีอักขระพิเศษ",
    //     (val) =>
    //       !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
    //       "ชื่อผู้ใช้ต้องไม่มีอิโมจิ",
    //   ],
    //   passwordRules: [
    //     (val) =>
    //       (val || "").length > 7 ||
    //       "โปรดระบุรหัสผ่านความยาวอย่างน้อย 8 ตัวอักษร",
    //     (val) =>
    //       (val || "").length < 20 ||
    //       "โปรดระบุรหัสผ่านความยาวไม่เกิน 20 ตัวอักษร",
    //     (val) => !/[ ]/g.test(val) || "ชื่อผู้ใช้ต้องไม่มีอักขระพิเศษ",
    //   ],
    // },
    // title: "ข้อมูลผู้ใช้งาน",
    // titlePermissionManage: "การจัดการสิทธิ์",
    selectRoles: [],
    previewUrl: null,
    isCheckedRelation: false,
    add_relations: false,

    relation: {
      account_id: "",
      firstname_en: "",
      lastname_en: "",
      username: "",
      tel: "",
    },
    checkData: {
      account_id: "",
      firstname_th: "",
      lastname_th: "",
      firstname_en: "",
      lastname_en: "",
      username: "",
      tel: "",
      email: "",
      image: "",
    },

    // breadcrumbs: [
    //   { text: "จัดการผู้ใช้งาน", to: "UserList" },
    //   { text: "เพิ่มผู้ใช้งาน", to: "" },
    // ],

    roles: [
      { role: "Super Admin", privilege: "superAdmin", roleNumber: "R_1" },
      { role: "Admin", privilege: "admin", roleNumber: "R_2" },
      { role: "โค้ช", privilege: "โค้ช", roleNumber: "R_3" },
      { role: "ผู้ปกครอง", privilege: "ผู้ปกครอง", roleNumber: "R_4" },
      { role: "นักเรียน", privilege: "นักเรียน", roleNumber: "R_5" },
    ],

    payloadSend: "",
    global_role_code: "",
    user_data_temp: {},
  }),

  beforeMount() {
    if (this.show_by_id?.userRoles?.length > 0) {
      for (const items of this.show_by_id.userRoles) {
        this.seledtedRole = items.roleId;
      }
    }
  },
  async created() {
    await this.GetClassList();
  },
  methods: {
    ...mapActions({
      GetClassList: "ProfileModules/GetClassList",
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      checkUsernameOneid: "loginModules/checkUsernameOneid",
      AddRelations: "RegisterModules/AddRelations",
      GetDataRelationsManagement:
        "UserManageModules/GetDataRelationsManagement",
      GetUserById: "UserModules/GetUserById",
      GetShowById: "UserModules/GetShowById",
      ChangeUserOneTemp: "UserModules/ChangeUserOneTemp",
      SetRegisterOneId: "RegisterModules/SetRegisterOneId",
    }),

    async toUserDetail() {
      const items = this.user_data[0];

      await this.SetRegisterOneId(items);
      this.$router.push({
        name: "UserDetail",
        params: {
          action: "edit",
          account_id: items?.userOneId,
          from: "userList",
        },
      });
    },

    checkUsername(username, type) {
      if (username != "") {
        this.checkUsernameOneid({
          username: username,
          status: null,
          type: type,
        }).then(() => {
          console.log("global_data_relation");
          this.global_data_relation =
            type == "student" ? this.user_student_data[0] : this.user_data[0];
          this.relation.account_id = this.global_data_relation?.userOneId;
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

    async checkDataRelation(username, type) {
      if (username != "") {
        this.checkUsernameOneid({
          username: username,
          status: null,
          type: type,
        }).then(async () => {
          if (type == "" ? this.user_student_data[0] : this.user_data[0]) {
            this.user_data_temp = this.user_data[0];
            this.seledtedRole = "";
            this.preview_img = "";
            this.global_data_relation_checked =
              type == "" ? this.user_student_data[0] : this.user_data[0];
            this.checkData.account_id =
              this.global_data_relation_checked.userOneId;
            this.checkData.firstname_en =
              this.global_data_relation_checked.firstNameEng;
            this.checkData.lastname_en =
              this.global_data_relation_checked.lastNameEng;
            this.checkData.firstname_th =
              this.global_data_relation_checked.firstNameTh;
            this.checkData.lastname_th =
              this.global_data_relation_checked.lastNameTh;
            this.checkData.tel = this.global_data_relation_checked.mobileNo;
            this.checkData.email = this.global_data_relation_checked.email;
            this.checkData.image = this.global_data_relation_checked.imgUrl;
            this.global_role_code = this.global_data_relation_checked.roles
              .map((val) => {
                return val.roleId;
              })
              .join();
            this.checkData.school = this.global_data_relation_checked?.school
              ? this.global_data_relation_checked.school
              : {
                  schoolNameEn: "",
                  schoolNameTh: "",
                };
            this.checkData.class = this.global_data_relation_checked?.class
              ? this.global_data_relation_checked?.class
              : {
                  classNameTh: "",
                  classNameEn: "",
                };
            this.roles.map((val) => {
              if (this.global_role_code === val.roleNumber) {
                this.seledtedRole = val.roleNumber;
              }
            });

            this.global_data_relation_checked.userRoles =
              this.global_data_relation_checked.roles;
            await this.GetDataRelationsManagement(
              this.global_data_relation_checked
            );
          }
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

    openFileSelector() {
      this.$refs.fileInput.click();
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

    openAddRelationsDialog(username, role_id) {
      this.global_username = username;
      this.global_role_id = role_id;
      this.add_relations = true;
    },

    closeDialog() {
      this.add_relations = false;
      this.relation = {
        account_id: "",
        firstname_en: "",
        lastname_en: "",
        username: "",
        tel: "",
      };
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

            for (const testRole of this.global_data_relation_checked.roles) {
              this.payloadSend = {
                parentId:
                  testRole.roleNameTh === "ผู้ปกครอง"
                    ? this.checkData.account_id
                    : this.relation.account_id,
                studentId:
                  testRole.roleNameTh === "นักเรียน"
                    ? this.checkData.account_id
                    : this.relation.account_id,
              };
            }

            let { data } = await axios.post(
              `${process.env.VUE_APP_URL}/api/v1/relations/user`,
              this.payloadSend,
              config
            );

            if (data.statusCode === 201) {
              if (data.data && data.data.message !== "Duplicate relation.") {
                // Swal.fire({
                //   icon: "success",
                //   title: " เพิ่มข้อมูลสำเร็จ",
                // }).then(async (result) => {
                //   if (result.isConfirmed) {
                //     this.$router.push({
                //       name: "UserList",
                //     });
                //   }
                // });
                this.$router.push({
                  name: "UserList",
                });
                this.add_relations = false;
                this.relation = {
                  account_id: "",
                  firstname_en: "",
                  lastname_en: "",
                  username: "",
                  tel: "",
                };

                Swal.fire({
                  icon: "success",
                  title: this.$t("succeed"),
                  text: this.$t("information added successfully"),
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
          } catch (error) {
            if (error.response.data.statusCode === 400) {
              if (
                error.response.data.message ==
                "Parent does not have the required role."
              ) {
                Swal.fire({
                  icon: "info",
                  title: this.$t("something went wrong"),
                  text: this.$t(
                    "duplicate roles or the user does not yet have a role"
                  ),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
                this.add_relations = false;
                this.relation = {
                  account_id: "",
                  firstname_en: "",
                  lastname_en: "",
                  username: "",
                  tel: "",
                };
              } else if (error.response.data.message == "Duplicate relation.") {
                Swal.fire({
                  icon: "error",
                  title: this.$t("something went wrong"),
                  text: this.$t("duplicate relationship"),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });

                this.add_relations = false;
                this.relation = {
                  account_id: "",
                  firstname_en: "",
                  lastname_en: "",
                  username: "",
                  tel: "",
                };
              }
            }
          }
        } else {
          Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
        }
      });
    },

    registerParent() {
      this.register_type = "parent";
      this.register_type = "student";
      this.changeDialogRegisterOneId(true);
    },

    submitData(account_id) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to save it?"),
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

            let payload = {
              firstNameTh: this.checkData.firstname_th,
              lastNameTh: this.checkData.lastname_tn,
              firstNameEng: this.checkData.firstname_en,
              lastNameEng: this.checkData.lastname_en,
              email: this.checkData.email,
              mobileNo: this.checkData.tel,
              roles:
                this.seledtedRole != "" ? [{ roleId: this.seledtedRole }] : [],
              schoolTh: this.checkData.school.schoolNameTh,
              schoolEn: this.checkData.school.schoolNameEn,
              nicknameTh: this.checkData.nicknameTh,
              nicknameEn: this.checkData.nicknameEn,
              className: this.checkData.class.classNameTh,
              congenitalDiseaseTh: this.checkData.congenitalDisease,
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
              if (data.data && data.message !== "Relation Already exists") {
                this.$router.push({
                  name: "UserList",
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
                //       name: "UserList",
                //     });
                //   }
                // });
              } else if (
                data.data &&
                data.message === "Relation Already exists"
              ) {
                Swal.fire({
                  icon: "error",
                  title: this.$t("something went wrong"),
                  text: this.$t("this USER is already in a relationship"),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    this.$router.push({
                      name: "UserList",
                    });
                  }
                });
              }
            } else {
              throw { message: data.data };
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: this.$t("something went wrong"),
              text: this.$t("error information"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          }
        } else {
          Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
        }
      });
    },
  },
  computed: {
    ...mapGetters({
      class_list: "ProfileModules/classList",
      user_one_id: "loginModules/getUserOneId",
      user_data: "loginModules/getUserData",
      is_loading: "loginModules/getIsLoading",
      user_student_data: "loginModules/getUserStudentData",
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      data_user_relation_management:
        "UserManageModules/getDataRelationsManagement",
      data_user_by_id: "UserModules/getUserById",
      show_by_id: "UserModules/getShowById",
      last_user_registered: "RegisterModules/getLastUserRegistered",
      register_by_one: "RegisterModules/setRegisterOneId",
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
        { text: this.$t("add user"), to: "" },
      ];
    },

    rules() {
      return {
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
      this.checkData.username = this.last_user_registered.username;
      this.checkDataRelation(this.last_user_registered.username);
    },

    "data_user_relation_management.length": function () {
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
  },

  beforeDestroy() {
    this.ChangeUserOneTemp(this.user_data_temp);
  },
};
</script>

<style scoped>
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
