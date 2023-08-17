<template>
  <v-container>
    <div class="my-5 mx-5 pa-3">
      <v-row>
        <v-col align="center">
          <img src="@/assets/profile/password1.png" class="" />
          <div class="text-xl font-bold pa-2">กรุณาใส่รหัสผ่านปัจจุบัน</div>
          <div class="text-slate-400 pa-2">
            ใส่รหัสผ่านปัจจุบันที่ใช้งานอยู่ เพื่อยืนยันตัวตน
          </div>
        </v-col>
        <v-col cols="12" align="center">
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
            v-model="password.old_password"
            placeholder="ใส่รหัสผ่านปัจจุบันที่ใช้งานอยู่ เพื่อยืนยันตัวตน"
            @click:append="show_password = !show_password"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn
            class="pa-2"
            width="100%"
            depressed
          
            :disabled="!isInputValid"
            :color="isInputValid ? '#ff6b81' : ''"
            @click="checkPassword()"
          >
            ยืนยัน
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { inputValidation } from "@/functions/functions";
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    rules: {
      password: [
        (val) =>
          (val || "").length > 7 ||
          "โปรดระบุรหัสผ่านความยาวไม่น้อยกว่า 8 ตัวอักษร",
      ],
    },

    
    show_password: false,
  }),
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "รหัสผ่าน");
  },
  methods: {
    ...mapActions({
            ChangePassword: "ProfileModules/ChangePassword",
        }),
    validate(e, type) {
      inputValidation(e, type);
    },

    checkPassword() {
      this.$router.push({name: "ProfileResetPassword"})
    }

  },
  computed: {
    ...mapGetters({
            password: "ProfileModules/getPassword"
        }),
        isInputValid() {
      return (
        this.password.old_password.trim().length > 7 
      );
    },
  },
};
</script>

<style>
</style>