
<!-- snacbar สำหรับ popup -->
<template>
  <div class="background">
    <v-form ref="form">
      <v-card
        :class="
          MobileSize
            ? 'bg-white rounded-xl my-15 '
            : 'bg-white rounded-xl my-32 '
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
              <v-text-field
                @keypress="validate($event, 'en')"
                dense
                ref="username"
                :rules="rules.username"
                required
                v-model="user_one_id.username"
                placeholder="ระบุชื่อผู้ใช้งาน"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-0 text-bold text-black">
              <label>รหัสผ่าน</label>
              <v-text-field
                @keypress="validate($event, 'en')"
                dense
                ref="password"
                :type="show_password ? 'text' : 'password'"
                :rules="rules.password"
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
                color="#ff6b81"
                @click="login()"
              >
                เข้าสู่ระบบ
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn
                outlined
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
    }),

      login() {
      if (this.$refs.form.validate()) {
        this.loginOneId()
      }
    },
    toRegisterPage() {
      console.log("Register")
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

.background {
  src: ("");
}
</style>
  