<template>
  <v-container>
    <!-- {{ checkData }} -->
    <!-- <v-row dense>
      <v-col cols="12"> -->
    <headerPage :breadcrumbs="breadcrumbs"></headerPage>
    <v-card class="mx-auto">
      <v-container>
        <v-row dense>
          <v-col cols="12">
            <headerCard
              class="ml-6 mt-8"
              :icon="'mdi-card-account-details-outline'"
              :icon_color="'#FF6B81'"
              :title="title"
            ></headerCard>
            <v-divider class="mx-10"></v-divider>
            <v-card class="mx-10 my-10" color="#FCFCFC">
              <v-card-text class="mt-3">
                <labelCustom text="Username"></labelCustom>
                <v-row>
                  <!-- :hide-details="!checkData.account_id" -->

                  <v-col cols="12" sm="6">
                    <v-text-field
                      :rules="rules.usernameRules"
                      dense
                      outlined
                      @keypress="validate($event, 'en-number')"
                      v-model="checkData.username"
                      @change="checkDataRelation(checkData.username)"
                      @keyup.enter="checkDataRelation(checkData.username)"
                      @blur="checkDataRelation(checkData.username)"
                      placeholder="Username"
                    >
                      <template v-slot:append>
                        <v-icon v-if="checkData.account_id" color="green"
                          >mdi-checkbox-marked-circle-outline</v-icon
                        >
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <template v-if="!relation.account_id">
                      <label> หากยังไม่มีบัญชีผู้ใช้กรุณา </label>
                      <label
                        class="text-[#ff6b81] underline cursor-pointer mt-5"
                        @click="registerParent"
                        >สมัคร One ID</label
                      >
                    </template>
                  </v-col>
                  <v-col cols="12" sm="4" align="end">
                    <v-img
                      class="ml-auto mr-10 mb-2"
                      src="@/assets/manageuser/logo_one platform.svg"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div v-if="checkData.account_id">
              <!-- USER DETAIL -->
              <v-col cols="12">
                <v-card color="#FCFCFC" class="my-10 mx-10 w 1/5">
                  <v-card-text class="mt-3">
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
                            v-if="preview_img == ''"
                            class="image-cropper items-end"
                            src="../../../assets/userManagePage/default_img_update_profile.svg"
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
                              >เพิ่มรูปภาพ</v-btn
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

                      <v-col cols="12" sm="6">
                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
                            <v-text-field
                              @keypress="validate($event, 'th')"
                              placeholder=""
                              v-model="checkData.firstname_th"
                              outlined
                              dense
                              disabled
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="นามสกุล (ภาษาไทย)"
                            ></label-custom>
                            <v-text-field
                              @keypress="validate($event, 'th')"
                              placeholder=""
                              v-model="checkData.lastname_th"
                              outlined
                              dense
                              disabled
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
                              @keypress="validate($event, 'en')"
                              placeholder=""
                              v-model="checkData.firstname_en"
                              outlined
                              dense
                              disabled
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom
                              text="Last Name (English)"
                            ></label-custom>
                            <v-text-field
                              @keypress="validate($event, 'en')"
                              placeholder=""
                              v-model="checkData.lastname_en"
                              outlined
                              dense
                              disabled
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12" sm="6">
                            <label-custom text="อีเมล"></label-custom>
                            <v-text-field
                              @keypress="validate($event, 'en', 'number')"
                              placeholder=""
                              v-model="checkData.email"
                              outlined
                              dense
                              disabled
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <label-custom text="เบอร์โทรศัพท์"></label-custom>
                            <v-text-field
                              disabled
                              @keypress="validate($event, 'number')"
                              v-model="checkData.tel"
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

              <!-- การจัดการสิทธิ์ -->
              <v-row dense>
                <v-col cols="12">
                  <headerCard
                    class="ml-6 mt-8"
                    :icon="'mdi-card-account-details-outline'"
                    :icon_color="'#FF6B81'"
                    :title="titlePermissionManage"
                  ></headerCard>
                  <v-divider class="mx-10"></v-divider>
                  <v-card class="mt-10 ml-5 mr-5" color="#FCFCFC">
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
                            outlined
                            chips
                            item-color="#ff6b81"
                            color="#ff6b81"
                            @change="selectRole(seledtedRole)"
                          >
                            <template v-slot:item="{ item }">
                              <v-list-item-content>
                                {{ item.role }}
                              </v-list-item-content>
                              <v-list-item-action>
                                <v-icon color="#FF6B81">
                                  {{
                                    selectRoles.includes(item.role)
                                      ? "mdi-checkbox-marked"
                                      : "mdi-checkbox-blank-circle-outline"
                                  }}</v-icon
                                >
                              </v-list-item-action>
                            </template>
                          </v-autocomplete>

                          <!-- <v-autocomplete
                            dense
                            v-model="seledtedRole"
                            :items="roles"
                            item-text="role"
                            item-value="roleNumber"
                            label="กรุณาเลือกบทบาทผู้ใช้งาน"
                            placeholder="กรุณาเลือกบทบาทผู้ใช้งาน"
                            single-line
                            outlined
                            chips
                            item-color="#ff6b81"
                            color="#ff6b81"
                            @change="selectRole(seledtedRole)"
                          >
                          <template v-slot:item="{ item }">
                            <v-list-item-content>
                              {{ item.role }}
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-icon color="#FF6B81">
                                {{
                                  selectRoles.includes(item.role)
                                    ? "mdi-checkbox-marked"
                                    : "mdi-checkbox-blank-circle-outline"
                                }}</v-icon
                              >
                            </v-list-item-action>
                          </template>
                          </v-autocomplete> -->
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-container
                grid-list-xs
                v-if="
                  roles.privilege === 'ผู้ปกครอง' ||
                  roles.privilege === 'นักเรียน'
                "
              >
                <!-- หัวข้อ เพิ่มข้อมูล -->
                <v-row>
                  <v-col cols="12">
                    <headerCard
                      class="ml-6 mt-8"
                      :icon="'mdi-file-plus-outline'"
                      :icon_color="'#FF6B81'"
                      :title="
                        roles.privilege === 'ผู้ปกครอง'
                          ? 'เพิ่มข้อมูลนักเรียนในการดูแล'
                          : 'เพิ่มข้อมูลผู้ปกครอง'
                      "
                    ></headerCard>
                    <v-divider class="mx-10"></v-divider>
                  </v-col>
                </v-row>

                <!-- ข้อมูล ความสัมพันธ -->
                <v-card
                  class="my-5"
                  color="#FCFCFC"
                  v-for="(data_relations, index_relations) in user_student_data"
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
                            roles.privilege === 'ผู้ปกครอง'
                              ? 'Student’s Username (English)'
                              : 'Parent’s Username (English)'
                          "
                        ></label-custom>

                        <!-- v-if="roles.privilege === 'ผู้ปกครอง'" -->
                        <v-text-field
                          outlined
                          dense
                          disabled
                          :value="data_relations.userName"
                          v-model="data_relations.userName"
                        ></v-text-field>
                        <!-- <v-text-field
                              outlined
                              dense
                              disabled
                              v-else
                              :value="relations.parent.parentUsername"
                            ></v-text-field> -->
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
                          :value="data_relations.firstNameEng"
                          v-model="data_relations.firstNameEng"
                        ></v-text-field>
                        <!-- <v-text-field
                              outlined
                              dense
                              disabled
                              v-else
                              :value="relations.parent.parentFirstnameEn"
                            ></v-text-field> -->
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
                          :value="data_relations.lastNameEng"
                          v-model="data_relations.lastNameEng"
                        ></v-text-field>
                        <!-- <v-text-field
                              outlined
                              dense
                              disabled
                              v-else
                              :value="relations.parent.parentLastnameEn"
                            ></v-text-field> -->

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
                          :value="data_relations.mobileNo"
                          v-model="data_relations.mobileNo"
                        ></v-text-field>
                        <!-- <v-text-field
                              outlined
                              dense
                              disabled
                              v-else
                              :value="relations.parent.parentTel"
                            ></v-text-field> -->

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

                <!-- check box -->
                <v-row>
                  <v-col cols="12" sm="6" class="ml-10">
                    <v-checkbox
                      v-model="isCheckedRelation"
                      :label="
                        roles.privilege === 'ผู้ปกครอง'
                          ? 'ต้องการเพิ่มนักเรียนในการดูแล'
                          : 'ต้องการเพิ่มผู้ปกครอง'
                      "
                      value="Jacob"
                      color="pink"
                      item-color="pink"
                    ></v-checkbox>
                  </v-col>
                </v-row>

                <!-- เพิ่มความสัมพันธ์ -->
                <v-row dense v-if="isCheckedRelation">
                  <v-col cols="12" class="text-center">
                    <v-btn
                      dense
                      outlined
                      color="#ff6b81"
                      @click="
                        openAddRelationsDialog(
                          relation.username,
                          roles.privilege
                        )
                      "
                    >
                      <v-icon>mdi-plus-circle-outline</v-icon
                      >{{
                        roles.privilege === "ผู้ปกครอง"
                          ? "เพิ่มข้อมูลนักเรียน"
                          : "เพิ่มข้อมูลผู้ปกครอง"
                      }}</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
              <v-col class="text-right mt-5">
                <v-btn
                  depressed
                  class="white--text"
                  color="#ff6b81"
                  @click="submitData(checkData.account_id)"
                >
                  บันทึก
                </v-btn>
              </v-col>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <!-- </v-col>
    </v-row> -->

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
          :title="global_role_id === 'R_4' ? 'เพิ่มนักเรียน' : 'เพิ่มผู้ปกครอง'"
        >
          <template #actions>
            <v-btn icon @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
          </template>
        </header-card>
        <v-card-text class="pb-2">
          <v-row dense>
            <!-- :hide-details="!relation.account_id" -->
            <v-col cols="9">
              <labelCustom text="Username"></labelCustom>
              <v-text-field
                :rules="rules.usernameRules"
                dense
                outlined
                v-model="relation.username"
                @keypress="validate($event, 'en-number')"
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
                  v-model="relation.firstname_en"
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
                  v-model="relation.lastname_en"
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
                  v-model="relation.tel"
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
                @click="closeDialog"
                class="w-full"
                color="#ff6b81"
                outlined
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                class="w-full"
                color="#ff6b81"
                dark
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
    title: "ข้อมูลผู้ใช้งาน",
    titlePermissionManage: "การจัดการสิทธิ์",
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
    },

    breadcrumbs: [
      { text: "จัดการผู้ใช้งาน", to: "UserList" },
      { text: "เพิ่มผู้ใช้งาน", to: "" },
    ],

    roles: [
      { role: "Super Admin", privilege: "superAdmin", roleNumber: "R_1" },
      { role: "Admin", privilege: "admin", roleNumber: "R_2" },
      { role: "โค้ช", privilege: "โค้ช", roleNumber: "R_3" },
      { role: "ผู้ปกครอง", privilege: "ผู้ปกครอง", roleNumber: "R_4" },
      { role: "นักเรียน", privilege: "นักเรียน", roleNumber: "R_5" },
    ],
  }),

  beforeMount() {
    console.log("show_by_id=>", this.show_by_id);
    if (this.show_by_id.userRoles.length > 0) {
      for (const items of this.show_by_id.userRoles) {
        console.log("items=>", items);
        this.seledtedRole = items.roleId;
      }
    }
  },

  mounted() {
    console.log("relation.account_id", this.relation.account_id);
    this.GetShowById(this.relation.account_id);
    this.GetDataRelationsManagement(this.data_user_by_id);
  },

  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      checkUsernameOneid: "loginModules/checkUsernameOneid",
      AddRelations: "RegisterModules/AddRelations",
      GetDataRelationsManagement:
        "UserManageModules/GetDataRelationsManagement",
      GetUserById: "UserModules/GetUserById",
      GetShowById: "UserModules/GetShowById",
    }),

    checkUsername(username, type) {
      console.log("username=>", username);
      console.log("type=>", type);
      if (username != "") {
        this.checkUsernameOneid({
          username: username,
          status: null,
          type: type,
        }).then(() => {
          console.log("user_data", this.user_data);
          console.log("user_student_data", this.user_student_data);
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
          title: "ไม่มี username",
        });
      }
    },

    checkDataRelation(username, type) {
      console.log("username=>", username);
      console.log("type=>", type);
      if (username != "") {
        this.checkUsernameOneid({
          username: username,
          status: null,
          type: type,
        }).then(() => {
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
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "ไม่มี username",
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

    // selectRole(roleName) {
    //   console.log("test", roleName);
    // },

    openAddRelationsDialog(username, role_id) {
      console.log("username", username);
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

            console.log("privilege", this.roles.privilege); //ข้อมูลที่เลือกจากcheckbox
            console.log("relation", this.relation); // ข้อมูลจากการที่กำลังจะเชื่อมความ3000
            let payload = {
              parentId:
                this.roles.privilege === "ผู้ปกครอง"
                  ? this.checkData.account_id
                  : this.relation.account_id,
              studentId:
                this.roles.privilege === "นักเรียน"
                  ? this.checkData.account_id
                  : this.relation.account_id,
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
                this.add_relations = false;
                this.relation = {
                  account_id: "",
                  firstname_en: "",
                  lastname_en: "",
                  username: "",
                  tel: "",
                };
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

    registerParent() {
      this.register_type = "parent";
      this.register_type = "student";
      // this.changeCourseOrderData(this.course_order)
      this.changeDialogRegisterOneId(true);
    },

    submitData(account_id) {
      console.log("object--01", this.seledtedRole);
      console.log("object--02", account_id);

      Swal.fire({
        icon: "question",
        title: "คุณต้องการบันทึกหรือไม่",
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
              firstNameTh: this.checkData.firstname_th,
              lastNameTh: this.checkData.lastname_tn,
              firstNameEng: this.checkData.firstname_en,
              lastNameEng: this.checkData.lastname_en,
              email: this.checkData.email,
              mobileNo: this.checkData.tel,
              roles:
                this.seledtedRole != "" ? [{ roleId: this.seledtedRole }] : [],
            };
            console.log(payload, "payload");
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

            let { data } = await axios.patch(
              `${process.env.VUE_APP_URL}/api/v1/usermanagement/update/${account_id}`,
              // `http://localhost:3000/api/v1/usermanagement/update/${account_id}`,
              bodyFormData,
              config
            );

            if (data.statusCode === 200) {
              // if (data.data && data.data.message !== "") {
              Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  // this.$router.push({
                  //   name: "UserDetail",
                  //   params: {
                  //     action: "view",
                  //     account_id: this.checkData.account_id,
                  //   },
                  // });
                  this.$router.push({ name: "UserList" });
                }
              });

              // } else {
              //   throw { error: data };
              // }
            } else {
              throw { message: data.message };
            }
          } catch (error) {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "ข้อมูลผิดพลาด",
            });
          }
        } else {
          Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
        }
      });
    },
    selectRole(roles) {
      this.selectRoles;
      console.log("roles", roles);
      console.log("selectRoles", this.selectRoles);
    },
  },
  computed: {
    ...mapGetters({
      user_one_id: "loginModules/getUserOneId",
      user_data: "loginModules/getUserData",
      is_loading: "loginModules/getIsLoading",
      user_student_data: "loginModules/getUserStudentData",
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      data_user_relation_management:
        "UserManageModules/getDataRelationsManagement",
      data_user_by_id: "UserModules/getUserById",
      show_by_id: "UserModules/getShowById",
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
          this.GetDataRelationsManagement(this.data_user_by_id);
        });
      } else if (this.last_user_registered.type === "student") {
        this.AddRelations({
          parentId: this.$route.params.account_id,
          studentId: this.last_user_registered.account_id,
        }).then(() => {
          this.GetDataRelationsManagement(this.data_user_by_id);
        });
      }
      this.dialog_parent = false;
    },

    "data_user_relation_management.length": function () {
      // for (const item_relation of this.data_user_relation_management) {
      //   this.GetStudentSchedule(item_relation.studentId);
      //   console.log("test", item_relation.studentId);
      // }

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


  