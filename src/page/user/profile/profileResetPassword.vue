<template>
  <v-container>
    <v-row>
        <v-col  align="center">
        <img src="../../../assets/profile/rePassword.png" class="pa-10" />
          <div class="text-xl font-bold pa-2">เปลี่ยนรหัสผ่านใหม่</div>
          <div class="text-slate-400 pa-2">
            รหัสผ่านนี้ใช้เพื่อเข้าสู่ระบบใช้งานบัญชี One ID ของคุณ 
          </div>
          <div class="text-slate-400 pa-1">
            บนแพลตฟอร์มอื่นๆ
          </div>
        </v-col>
    </v-row>
    <v-row dense>
          <v-col>
            <label class="font-bold">รหัสผ่าน</label>
            <v-text-field 
              dense
              ref="password.new_password" 
              :type="show_password ? 'text' : 'password' "
              :rules="rules.password" 
              required 
              v-model="password.new_password" 
              :append-icon="show_password ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
              @click:append="show_password = !show_password"
              placeholder="ระบุรหัสผ่าน" 
              @change="ChangePassword(password)"
              outlined>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <label class="font-bold">ยืนยันรหัสผ่าน</label>
            <v-text-field 
              dense
              ref="password.confirm_password" 
              :type="show_confirm_password ? 'text' : 'password' " 
              :rules="[rules.confirm_password, rules.match(password)]" 
              required 
              v-model="password.confirm_password" 
              placeholder="กรุณายืนยันรหัสผ่านใหม่" 
              :append-icon="show_confirm_password ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
              @click:append="show_confirm_password = !show_confirm_password"
              @change="ChangePassword(password)"
              outlined>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
            <v-col>
        <v-btn
            class="white--text my-5 w-full"
            depressed
            :disabled="!isInputValid"
            :color="isInputValid ? '#ff6b81' : ''"
            @click="submitEdit()"
          >
          เปลี่ยนรหัสผ่าน
          </v-btn>
            </v-col>
        </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
    data: () => ({
        rules: {
      password : [val =>(val && val.length > 7) || 'โปรดระบุรหัสผ่านความยาวอย่างน้อย 8 ตัวอักษร'],
      
      confirm_password : val =>(val && val.length > 7) || 'โปรดระบุรหัสผ่านความยาวอย่างน้อย 8 ตัวอักษร',
      match: password => value => value === password || 'รหัสผ่านไม่ตรงกัน'
        },
    show_password: false,
    show_confirm_password: false,
    }),
    mounted() { this.$store.dispatch("NavberUserModules/changeTitleNavber", "รหัสผ่าน"); },
    methods: {
        ...mapActions({
            ChangePassword: "ProfileModules/ChangePassword",
        }),
    },
    computed: {
        ...mapGetters({
            password: "ProfileModules/getPassword"
        }),
        isInputValid() {
      return (
        this.password.new_password.trim().length > 7 &&
        this.password.confirm_password.trim().length > 7
      );
    },
    },
}
</script>

<style>

</style>