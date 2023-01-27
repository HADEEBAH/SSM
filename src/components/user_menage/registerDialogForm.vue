<template>
   <v-card flat class="pa-2">
    <v-row dense>
      <v-col class="text-right">
        <v-btn icon @click="changeDialogRegisterOneId(false)"><v-icon>mdi-close</v-icon></v-btn>
      </v-col>
    </v-row>
    <v-card-title>
      <v-row dense>
        <v-col class="text-center">สมัคร One ID</v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col class="pr-8">
          <label>ชื่อ(ภาษาไทย)</label>
          <v-text-field ref="firstname_th" :rules="rules.name_th" required v-model="user_one_id.firstname_th" placeholder="ชื่อ(ภาษาไทย)" filled></v-text-field>
        </v-col>
        <v-col class="pl-8">
          <label>นามสกุล(ภาษาไทย)</label>
          <v-text-field ref="lastname_th" :rules="rules.name_th" required v-model="user_one_id.lastname_th" placeholder="นามสกุล(ภาษาไทย)" filled></v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col class="pr-8">
          <label>ชื่อ(ภาษาอังกฤษ)</label>
          <v-text-field ref="firstname_en" :rules="rules.name_en" required v-model="user_one_id.firstname_en" placeholder="ชื่อ(ภาษาอังกฤษ)" filled></v-text-field>
        </v-col>
        <v-col class="pl-8">
          <label>นามสกุล(ภาษาอังกฤษ)</label>
          <v-text-field ref="lastname_en" :rules="rules.name_en" required v-model="user_one_id.lastname_en" placeholder="นามสกุล(ภาษาอังกฤษ)" filled></v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <label>เบอร์โทร</label>
          <v-text-field ref="phone_number" :rules="rules.phone_number" required v-model="user_one_id.phone_number" placeholder="xxx-xxx-xxxxx" filled></v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <label>ผู้ใช้งาน(ภาษาอังกฤษ)</label>
          <v-text-field ref="username" :rules="rules.username" required v-model="user_one_id.username" placeholder="ผู้ใช้งาน(ภาษาอังกฤษ)" filled></v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <label>รหัสผ่าน</label>
          <v-text-field ref="password" :rules="rules.password" required v-model="user_one_id.password" placeholder="รหัสผ่าน" filled></v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <label>ยืนยันรหัสผ่าน</label>
          <v-text-field ref="confirm_password" :rules="rules.confirm_password" required v-model="user_one_id.confirm_password" placeholder="ยืนยันรหัสผ่าน" filled></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row dense>
        <v-col class="text-center">
          <v-btn depressed x-large width="195.68" @click="save">ลงทะเบียน</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>  
<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: "registerDialogForm",
  data: () => ({
    rules: {
      name_th: [val => (val || '').length > 0 || 'This field is required'],
      name_en: [val => (val || '').length > 0 || 'This field is required'],
      phone_number: [val => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'This field is required'],
      username : [val => (val || '').length > 0 || 'This field is required'],
      password : [val => (val || '').length > 0 || 'This field is required'],
      confirm_password : [val => (val || '').length > 0 || 'This field is required'],
    },
  }),
  created() {},
  mounted() {},
  methods: {
    ...mapActions({
      changeDialogRegisterOneId : "AdminMudules/changeDialogRegisterOneId",
      changeUserOneId : "dminMudules/changeUserOneId"
    }),
    save(){

    }
  },
  computed: {
    ...mapGetters({
      show_dialog_register_one_id : "AdminMudules/getShowDialogRegisterOneId",
      user_one_id : "AdminMudules/getUserOneId"
    })
  },
  watch: {},

  
};
</script>
<style>
.child-header {
  font-weight: 600;
  font-size: 22px;
}
.sub-title {
  font-weight: 700;
  font-size: 12px;
}
</style>
        