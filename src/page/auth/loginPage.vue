<template>
  <v-app>
    <v-container>
      <div
        class="d-flex align-center justify-center"
        style="width: 100%; height: 100%"
      >
        <v-card
          :class="
            MobileSize
              ? 'bg-white rounded-xl my-15 '
              : 'bg-white rounded-xl my-32 '
          "
        >
          <v-card-text>
            <div class="w-full" align="center">
              <v-img
                src="../../assets/login/login.jpg"
                style="width: 50%; height: 50%"
              ></v-img>
            </div>

            <v-row dense>
              <v-col cols="12" class="pa-0">
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
              <v-col cols="12" class="pa-0">
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
                  @click="loginOneId(user_one_id)"
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
            <div class="text-center mt-2" color="#ff6b81">
              ลืมรหัสผ่านใช่หรือไม่ ?
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import router from "@/router";
import { inputValidation } from "@/functions/functions";

import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    show_password: false,
    rules: {
      username: [(val) => (val || "").length > 0 || "โปรดระบุชื่อผู้ใช้"],
      password: [(val) => (val || "").length > 0 || "โปรดระบุรหัสผ่าน"],
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

    toRegisterPage() {
      router.push({ name: "Register" });
    },

    validate(e, type) {
      inputValidation(e, type);
    },
  },
};
</script>

<style scoped>

</style>