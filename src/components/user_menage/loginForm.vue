
<!-- snacbar สำหรับ popup -->
<template>
  <div :style="MobileSize ? 'width: 90%; ' : 'width: 50%;'">
    <v-form ref="form">
      <v-card
        :class="
          MobileSize
            ? 'bg-white rounded-xl my-20 drop-shadow-lg '
            : 'bg-white rounded-xl my-20 drop-shadow-lg '
        "
      >
        <v-card-text>
          <div class="w-full" align="center" v-if="image">
            <v-img
              :src="logo"
              style="width: 50%; height: 50%"
            ></v-img>
          </div>
          <v-row v-else>
            <v-col class="text-2xl text-center text-bold text-black">
              เข้าสู่ระบบ
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" class="pa-0 text-bold text-black">
              <label>ชื่อผู้ใช้งาน / OneID</label>
              <!-- :rules="rules.username" -->
              <v-text-field
                @keypress="validate($event, 'en-number')"
                dense
                :rules="rules.usernameRules"
                required
                v-model="user_one_id.username"
                placeholder="ระบุชื่อผู้ใช้งาน"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0 text-bold text-black">
              <label>รหัสผ่าน</label>
              <!-- :rules="rules.password" -->
              <v-text-field
                @keypress="validate($event, 'en')"
                dense
                ref="password"
                :type="show_password ? 'text' : 'password'"
                :rules="rules.passwordRules"
                required
                :append-icon="
                  show_password ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                "
                v-model="user_one_id.password"
                placeholder="ระบุรหัสผ่าน"
                @click:append="show_password = !show_password"
                outlined
                @keyup.enter="login()"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn
                width="100%"
                depressed
                dark
                :loading="is_loading"
                color="#ff6b81"
                @click="login()"
              >
                เข้าสู่ระบบ
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn
                outlined
                :disabled="is_loading"
                color="#ff6b81"
                width="100%"
                @click="toRegisterPage()"
              >
                ลงทะเบียน
              </v-btn>
            </v-col>
          </v-row>
          <div
            class="text-center mt-2 text_bottom cursor-pointer"
            v-if="bottomtext"
            @click="forgot_password()"
          >
            ลืมรหัสผ่านใช่หรือไม่ ?
          </div>
          <div v-else class="text-center mt-2">
            ยังไม่มีบัญชีใช่หรือไม่ ? <span class="text_bottom">ลงทะเบียน</span>
          </div>
        </v-card-text>
      </v-card>
    </v-form>
  </div>
</template>

  <script>
import { inputValidation } from "@/functions/functions";

import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    image: { type: Boolean, default: false },
    bottomtext: { type: String, default: "ลืมรหัสผ่านใช่หรือไม่ ?" },
  },
  data: () => ({
    show_password: false,
    logo: `${process.env.VUE_APP_URL}/logo.svg`,
    rules: {
      usernameRules: [
        (val) =>
          (val || "").length > 5 ||
          "โปรดระบุชื่อผู้ใช้ความยาวไม่น้อยกว่า 6 ตัวอักษร",
        // (val) =>
        //   (val || "").length < 20 ||
        //   "โปรดระบุชื่อผู้ใชความยาวไม่เกิน 20 ตัวอักษร",
        (val) => /[A-Za-z0-9 ]/g.test(val) || "ชื่อผู้ใช้ต้องไม่มีอักขระพิเศษ",
        (val) =>
          !/[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(val) ||
          "ชื่อผู้ใช้ต้องไม่มีอิโมจิ",
      ],
      passwordRules: [
        (val) =>
          (val || "").length > 7 ||
          "โปรดระบุรหัสผ่านความยาวอย่างน้อย 8 ตัวอักษร",
        // (val) =>
        //   (val || "").length < 20 ||
        //   "โปรดระบุรหัสผ่านความยาวไม่เกิน 20 ตัวอักษร",
        (val) => !/[ ]/g.test(val) || "ชื่อผู้ใช้ต้องไม่มีอักขระพิเศษ",
      ],
    },
  }),
  beforeMount() {
    if (this.$route.query.token) {
     this.loginShareToken(this.$route)
    }
  },
  computed: {
    ...mapGetters({
      user_one_id: "loginModules/getUserOneId",
      is_loading: "loginModules/getIsLoading",
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

  methods: {
    ...mapActions({
      loginOneId: "loginModules/loginOneId",
      loginShareToken: "loginModules/loginShareToken",
    }),

    login() {
      if (this.$refs.form.validate()) {
        this.loginOneId();
      }
    },
    toRegisterPage() {
      console.log("Register");
      this.$router.replace({ name: "Register" });
    },
    validate(e, type) {
      inputValidation(e, type);
    },

    forgot_password() {
      window.location.href = `${process.env.VUE_APP_ONE}/type_forgot_password`;
    },
  },

  beforeDestroy() {
    this.$store.commit("loginModules/SetIsLoading", false)
  }
};
</script>

<style scoped>
.text_bottom {
  color: #ff6b81;
}
</style>
  