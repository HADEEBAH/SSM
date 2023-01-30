<template>
  <v-container>
    <headerPage title="จัดการผู้ใช้งาน"></headerPage>
    <childHeader title="เพิ่มผู้ใช้งาน" divider arrow_left></childHeader>
    <v-row class="my-6">
      <v-col>
        <childHeader title="ข้อมูลผู้ใช้"></childHeader>
      </v-col>
    </v-row>
    <v-card outlined>
      <v-card-text>
        <v-row align="center">
          <v-col>
            <label>Username(English)</label>
            <v-text-field 
              append-icon="mdi-navigation-variant-outline"
              placeholder="กรุณาระบุชื่อผู้ใช้งาน(ภาษาอังกฤษ)" 
              v-model="username">
            </v-text-field>
          </v-col>
          <v-col>
            <label>
              <span>หากไม่มี กรุณา </span>
            </label>
            <label class="primary--text cursor-pointer underline " @click="changeDialogRegisterOneId(true)">สมัคร One ID</label>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog persistent v-model="show_dialog_register_one_id" width="60vw" >
      <registerDialogForm></registerDialogForm>
    </v-dialog>
  </v-container> 
</template>  
<script>
  import headerPage from '../header/headerPage.vue';
  import childHeader from '../header/childHeader.vue';
  import registerDialogForm from './registerDialogForm.vue';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    name:"userMenagePage",
    components:{
      headerPage,
      childHeader,
      registerDialogForm
    },  
    data: () => ({
      username: "",
      show_dialog : false,
    }),

    created() {
      
    },

    mounted(){

    },
    methods: {
      ...mapActions({
        changeDialogRegisterOneId : "AdminMudules/changeDialogRegisterOneId"
      })
    },
    computed: {
      ...mapGetters({
        show_dialog_register_one_id : "AdminMudules/getShowDialogRegisterOneId"
      })
    },
    watch: {},
   
  }
</script>
  