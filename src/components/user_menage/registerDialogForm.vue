<template>
  <v-container class="p-0">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card
        :flat="crad_flat"
        :class="
          $vuetify.breakpoint.mdAndUp ? (dialog ? '' : 'card-padding') : 'py-2'
        "
      >
        <v-card-title>
          <v-row dense v-if="dialog">
            <v-col class="text-right">
              <v-btn icon @click="changeDialogRegisterOneId(false)"
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col class="text-center text-lg font-bold">{{ title }}</v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="6">
              <label>ชื่อ(ภาษาไทย)</label>
              <v-text-field
                dense
                ref="firstname_th"
                :rules="rules.firstNameThRules"
                required
                v-model="user_one_id.firstname_th"
                placeholder="ระบุชื่อ(ภาษาไทย)"
                @change="changeUserOneId(user_one_id)"
                @keypress="Validation($event, 'th-special')"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <label>นามสกุล(ภาษาไทย)</label>
              <v-text-field
                dense
                ref="lastname_th"
                :rules="rules.lastNameThRules"
                required
                v-model="user_one_id.lastname_th"
                placeholder="ระบุนามสกุล(ภาษาไทย)"
                @change="changeUserOneId(user_one_id)"
                @keypress="Validation($event, 'th-special')"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="6">
              <label>ชื่อ(ภาษาอังกฤษ)</label>
              <v-text-field
                dense
                ref="firstname_en"
                :rules="rules.firstNameEnRules"
                required
                v-model="user_one_id.firstname_en"
                placeholder="ระบุชื่อ(ภาษาอังกฤษ)"
                @change="changeUserOneId(user_one_id)"
                @keypress="Validation($event, 'en-special')"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <label>นามสกุล(ภาษาอังกฤษ)</label>
              <v-text-field
                dense
                ref="lastname_en"
                :rules="rules.lastNameEnRules"
                required
                v-model="user_one_id.lastname_en"
                placeholder="ระบุนามสกุล(ภาษาอังกฤษ)"
                @change="changeUserOneId(user_one_id)"
                @keypress="Validation($event, 'en-special')"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <label>เบอร์โทรศัพท์</label>
              <v-text-field
                dense
                ref="phone_number"
                maxlength="12"
                :rules="rules.phone_number"
                required
                v-model="user_one_id.phone_number"
                @input="checkPhoneNumber"
                @keypress="Validation($event, 'number')"
                placeholder="ระบุเบอร์โทรศัพท์"
                @change="changeUserOneId(user_one_id)"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <!-- <label>ผู้ใช้งาน/OneID(ภาษาอังกฤษ)</label> -->
              <label>Username</label>
              <v-text-field
                autocomplete="off-autofill"
                dense
                ref="username_rig"
                :rules="rules.usernameRules"
                required
                v-model="user_one_id.username"
                placeholder="ระบุชื่อผู้ใช้งาน"
                @keypress="Validation($event, 'en-number')"
                @change="changeUserOneId(user_one_id)"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <label>รหัสผ่าน</label>
              <v-text-field
                dense
                autocomplete="off-autofill"
                ref="password_rig"
                @keypress="Validation($event, 'en')"
                :type="show_password ? 'text' : 'password'"
                :rules="rules.passwordRules"
                required
                v-model="user_one_id.password"
                :append-icon="
                  show_password ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                "
                @click:append="show_password = !show_password"
                placeholder="ระบุรหัสผ่าน"
                @change="changeUserOneId(user_one_id)"
                outlined
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <label>ยืนยันรหัสผ่าน</label>
              <v-text-field
                dense
                ref="confirm_password"
                :type="show_confirm_password ? 'text' : 'password'"
                :rules="[
                  rules.confirm_password,
                  rules.match(user_one_id.password),
                ]"
                required
                v-model="user_one_id.confirm_password"
                placeholder="ยืนยันรหัสผ่าน"
                :append-icon="
                  show_confirm_password
                    ? 'mdi-eye-outline'
                    : 'mdi-eye-off-outline'
                "
                @click:append="show_confirm_password = !show_confirm_password"
                @change="changeUserOneId(user_one_id)"
                outlined
                @keypress="Validation($event, 'en')"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense class="d-flex align-center">
            <v-col cols="auto">
              <v-checkbox
                class="inline-block"
                v-model="user_one_id.accept_terms"
                @change="changeUserOneId(user_one_id)"
                color="pink lighten-1"
              >
                <template v-slot:label>
                  <label>
                    การเปิดบัญชี ท่านรับทราบและตกลงตาม
                    <a
                      @click="policy_show = true"
                      class="cursor-pointer underline text-[#FF6B81]"
                      >เงื่อนไขการบริการ & นโยบายความเป็นส่วนตัว</a
                    >
                  </label>
                </template>
              </v-checkbox>
              <!-- <a @click="alert('555')" class="mb-[8px] cursor-pointer underline text-[#FF6B81] inline-block font-[16px!important]"
                    >เงื่อนไขการบริการ & นโยบายความเป็นส่วนตัว</a
                  > -->
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row dense>
            <v-col class="text-center">
              <v-btn
                :loading="is_loading"
                :disabled="!user_one_id.accept_terms"
                depressed
                class="white--text"
                :class="
                  $vuetify.breakpoint.mdAndUp
                    ? 'btn-register'
                    : 'w-full btn-register'
                "
                @click="save"
                >ลงทะเบียน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>

    <v-dialog
      v-model="policy_show"
      v-if="policy_show"
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
              <TermOfUse />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-checkbox
                hide-details
                color="pink"
                v-model="user_one_id.accept_terms"
              >
                <!-- <template v-slot:label>
                  ยอมรับ
                  <a class="mx-2 font-weight-bold"> ข้อกำหนดการใช้บริการ </a>
                  และ
                  <a class="mx-2 font-weight-bold"
                    >นโยบายความคุ้มครองข้อมูลส่วนบุคคล</a
                  >
                      @click="policy_show = true"

                </template> -->
                <template v-slot:label>
                  <label>
                    ยอมรับ
                    <a class="cursor-pointer underline text-[#FF6B81]"
                      >ข้อกำหนดการใช้บริการ &
                      นโยบายความคุ้มครองข้อมูลส่วนบุคคล</a
                    >
                  </label>
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
                @click="
                  (policy_show = false), (user_one_id.accept_terms = false)
                "
              >
                ยกเลิก
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                depressed
                dark
                color="#ff6b81"
                @click="policy_show = false"
              >
                ตกลง
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>  
<script>
import { mapActions, mapGetters } from "vuex";
import { inputValidation } from "@/functions/functions";
import TermOfUse from "@/components/termOfUse.vue";
export default {
  components: {
    TermOfUse,
  },
  name: "registerDialogForm",
  props: {
    title: { type: String },
    dialog: { type: Boolean, default: false },
    crad_flat: { type: Boolean, default: false },
    state: { type: String },
  },
  data: () => ({
    policy_show: false,
    policy: false,
    valid: true,
    show_password: false,
    show_confirm_password: false,
    phone_number: "",
    rules: {
      phone_number: [
        (val) =>
          ((val || "").length > 0 && val[0] === "0") ||
          "โปรดระบุเบอร์โทรขึ้นต้นด้วยเลข 0",
        (val) =>
          ((val || "").length > 0 && val.length === 12) ||
          "โปรดระบุเบอร์โทรศัพท์ 10 หลัก",
      ],
      usernameRules: [
        (val) =>
          (val || "").length > 5 ||
          "โปรดระบุชื่อผู้ใช้ความยาวอย่างน้อย 6 ตัวอักษร",
        // (val) =>
        //   (val || "").length < 20 ||
        //   "โปรดระบุชื่อผู้ใชความยาวไม่เกิน 20 ตัวอักษร",
        (val) => /[A-Za-z0-9 ]/g.test(val) || "ชื่อผู้ใช้ต้องไม่มีอักขระพิเศษ",
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          "ชื่อผู้ใช้ต้องไม่มีอิโมจิ",
      ],
      firstNameThRules: [
        (val) =>
          (val || "").length > 1 ||
          "โปรดระบุชื่อ (ภาษาไทย) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุชื่อ (ภาษาไทย) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) => /[ก-๏\s]/g.test(val) || "กรุณากรอกชื่อภาษาไทย",
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          "กรุณากรอกชื่อภาษาไทย",
      ],
      firstNameEnRules: [
        (val) =>
          (val || "").length > 1 ||
          "โปรดระบุชื่อ (ภาษาอังกฤษ) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุชื่อ (ภาษาอังกฤษ) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) => /[A-Za-z]/g.test(val) || "กรุณากรอกชื่อภาษาอังกฤษ",
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          "กรุณากรอกชื่อภาษาอังกฤษ",
      ],
      lastNameThRules: [
        (val) =>
          (val || "").length > 1 ||
          "โปรดระบุนามสกุล (ภาษาไทย) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุนามสกุล (ภาษาไทย) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) => /[ก-๏\s]/g.test(val) || "กรุณากรอกนามสกุลภาษาไทย",
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          "กรุณากรอกสกุลภาษาไทย",
      ],
      lastNameEnRules: [
        (val) =>
          (val || "").length > 1 ||
          "โปรดระบุนามสกุล (ภาษาอังกฤษ) ความยาวอย่างน้อย 2 ตัวอักษร",
        (val) =>
          (val || "").length < 20 ||
          "โปรดระบุนามสกุล (ภาษาอังกฤษ) ความยาวไม่เกิน 20 ตัวอักษร",
        (val) => /[A-Za-z ]/g.test(val) || "กรุณากรอกนามสกุลภาษาอังกฤษ",
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF ]/g.test(val) ||
          "กรุณากรอกสกุลภาษาอังกฤษ",
      ],
      passwordRules: [
        (val) =>
          (val || "").length > 7 ||
          "โปรดระบุรหัสผ่านความยาวอย่างน้อย 8 ตัวอักษร",
        // (val) =>
        //   (val || "").length < 20 ||
        //   "โปรดระบุรหัสผ่านความยาวไม่เกิน 20 ตัวอักษร",
        (val) => !/[ ]/g.test(val) || "รหัสผ่านต้องไม่มีอักขระพิเศษ",
      ],
      confirm_password: (val) =>
        (val && val.length > 7) ||
        "โปรดระบุยืนยันรหัสผ่านความยาวอย่างน้อย 8 ตัวอักษร",
      match: (password) => (value) => value === password || "รหัสผ่านไม่ตรงกัน",
    },
  }),
  created() {},
  mounted() {},
  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      changeUserOneId: "RegisterModules/changeUserOneId",
      registerUserOneId: "RegisterModules/registerUserOneId",
      registerParent: "RegisterModules/registerParent",
    }),
    checkPhoneNumber() {
      let x = this.user_one_id.phone_number.replace(/\D/g, "");
      x = x.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.user_one_id.phone_number = !x[2]
        ? x[1]
        : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    },
    save() {
      if (this.state === "parent" || this.state === "student") {
        if (this.$refs.form.validate()) {
          // console.log(this.registerParent({ type: this.state }));
        }
      } else {
        if (this.$refs.form.validate()) {
          this.registerUserOneId();
        }
      }
    },
    Validation(e, lang) {
      inputValidation(e, lang);
    },
  },
  computed: {
    ...mapGetters({
      is_loading: "RegisterModules/getIsLoading",
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      user_one_id: "RegisterModules/getUserOneId",
      course_data: "CourseModules/getCourseData",
    }),
  },
  watch: {},
};
</script>
<style>
.child-header {
  font-weight: 600;
  font-size: 22px;
}
.title {
  font-weight: 700;
  font-size: 24px;
}
.sub-title {
  font-weight: 700;
  font-size: 12px;
}
.btn-register {
  background-color: #ff6b81 !important;
}
.card-padding {
  padding: 40px 32px 40px 32px;
}
</style>
        
