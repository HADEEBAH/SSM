
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
              src="../../assets/login/login.jpg"
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
                @keypress="validate($event, 'en')"
                dense
                :rules="usernameRules"
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
                :rules="passwordRules"
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
          <div class="text-center mt-2 text_bottom" v-if="bottomtext">
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
    rules: {
      username: [
        (val) =>
          (val || "").length > 5 ||
          "โปรดระบุชื่อผู้ใช้ความยาวไม่น้อยกว่า 6 ตัวอักษร",
      ],
      password: [
        (val) =>
          (val || "").length > 7 ||
          "โปรดระบุรหัสผ่านความยาวไม่น้อยกว่า 8 ตัวอักษร",
      ],
    },
  }),

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

    usernameRules() {
      const specialCharsRegex = /[&*/#@!]/g;
      const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      return [
        (val) =>
          (val || "").length > 5 ||
          "Username must be at least 6 characters long",
        (val) =>
          !specialCharsRegex.test(val) ||
          "Username cannot contain special characters",
        (val) => !emojiRegex.test(val) || "Username cannot contain emojis",
      ];
    },
    passwordRules() {
      const specialCharsRegex = /[&*/#@!]/g;
      return [
        (val) =>
          (val || "").length > 7 ||
          "Password must be at least 8 characters long",
        (val) =>
          !specialCharsRegex.test(val) ||
          "Password cannot contain special characters",
      ];
    },
  },

  methods: {
    ...mapActions({
      loginOneId: "loginModules/loginOneId",
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
  },
};
</script>

<style scoped>
.text_bottom {
  color: #ff6b81;
}
</style>
  