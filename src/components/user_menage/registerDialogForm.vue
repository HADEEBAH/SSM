<template>
   <v-card :flat="crad_flat" :class="$vuetify.breakpoint.mdAndUp ? 'card-padding' : 'py-5'">
    <v-row dense v-if="dialog" >
      <v-col class="text-right">
        <v-btn icon @click="changeDialogRegisterOneId(false)"><v-icon>mdi-close</v-icon></v-btn>
      </v-col>
    </v-row>
    <v-card-title >
      <v-row dense>
        <v-col  class="text-center title">{{  title  }}</v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" sm="6">
          <label>ชื่อ(ภาษาไทย)</label>
          <v-text-field dense ref="firstname_th" :rules="rules.name_th" required v-model="user_one_id.firstname_th" placeholder="ระบุชื่อ(ภาษาไทย)" outlined></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <label>นามสกุล(ภาษาไทย)</label>
          <v-text-field dense ref="lastname_th" :rules="rules.name_th" required v-model="user_one_id.lastname_th" placeholder="ระบุนามสกุล(ภาษาไทย)" outlined></v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" sm="6">
          <label>ชื่อ(ภาษาอังกฤษ)</label>
          <v-text-field dense ref="firstname_en" :rules="rules.name_en" required v-model="user_one_id.firstname_en" placeholder="ระบุชื่อ(ภาษาอังกฤษ)" outlined></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <label>นามสกุล(ภาษาอังกฤษ)</label>
          <v-text-field dense ref="lastname_en" :rules="rules.name_en" required v-model="user_one_id.lastname_en" placeholder="ระบุนามสกุล(ภาษาอังกฤษ)" outlined></v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <label>เบอร์โทร</label>
          <v-text-field dense ref="phone_number"  maxlength="12" :rules="rules.phone_number" required v-model="user_one_id.phone_number" @input="checkPhoneNumber($event)" placeholder="ระบุเบอร์โทร" outlined></v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <label>ผู้ใช้งาน/OneID(ภาษาอังกฤษ)</label>
          <v-text-field dense ref="username" :rules="rules.username" required v-model="user_one_id.username" placeholder="ระบุชื่อผู้ใช้งาน" outlined></v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <label>รหัสผ่าน</label>
          <v-text-field 
            dense
            ref="password" 
            :type="show_password ? 'text' : 'password' "
            :rules="rules.password" 
            required 
            v-model="user_one_id.password" 
            :append-icon="show_password ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            @click:append="show_password = !show_password"
            placeholder="ระบุรหัสผ่าน" 
            outlined>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <label>ยืนยันรหัสผ่าน</label>
          <v-text-field 
            dense
            ref="confirm_password" 
            :type="show_confirm_password ? 'text' : 'password' " 
            :rules="rules.confirm_password" 
            required 
            v-model="user_one_id.confirm_password" 
            placeholder="ยืนยันรหัสผ่าน" 
            :append-icon="show_confirm_password ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            @click:append="show_confirm_password = !show_confirm_password"
            @change="changeUserOneId(user_one_id)"
            outlined>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-checkbox v-model="user_one_id.accept_terms" color="pink lighten-1">
            <template v-slot:label>
              <div>
                <label> การเปิดบัญชี ท่านรับทราบและตกลงตาม </label>
                <label style="color:#FF6B81" class="cursor-pointer underline " >เงื่อนไขการบริการ & นโยบายความเป็นส่วนตัว</label> 
              </div>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row dense>
        <v-col class="text-center">
          <v-btn depressed class="white--text" :class="$vuetify.breakpoint.mdAndUp ? 'btn-register' : 'w-full btn-register' " @click="save">ลงทะเบียน</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>  
<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: "registerDialogForm",
  props:{
    title:{type : String},
    dialog : {type : Boolean, default: false},
    crad_flat : {type : Boolean, default:false}
  },
  data: () => ({
    show_password: false,
    show_confirm_password: false,
    rules: {
      name_th: [val => (val || '').length > 0 || 'โปรดระบุชื่อ-นามสกุล(ภาษาไทย)'],
      name_en: [val => (val || '').length > 0 || 'โปรดระบุชื่อ-นามสกุล(ภาษาอังกฤษ)'],
      phone_number: [val => (val || '').length > 0 && val.length === 12 || 'โปรดระบุเบอร์โทร'],
      username : [val => (val || '').length > 0 || 'โปรดระบุชื่อผู้ใช้'],
      password : [val => (val || '').length > 0 || 'โปรดระบุรหัสผ่าน'],
      confirm_password : [val => (val || '').length > 0 || 'โปรดยืนยันรหัสผ่าน'],
    },
  }),
  created() {},
  mounted() {},
  methods: {
    ...mapActions({
      changeDialogRegisterOneId : "AdminMudules/changeDialogRegisterOneId",
      changeUserOneId : "dminMudules/changeUserOneId",
    }),
    checkPhoneNumber() {
      let x = this.user_one_id.phone_number.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.user_one_id.phone_number = !x[2] ? x[1] :   x  [1] + '-' + x[2] + (x[3] ? '-' + x[3] : '');
    },
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
.title{
  font-weight: 700;
  font-size: 24px;
}
.sub-title {
  font-weight: 700;
  font-size: 12px;
}
.btn-register{
  background-color:#FF6B81 !important;
}
.card-padding{
  padding: 40px 32px 40px 32px
}
</style>
        