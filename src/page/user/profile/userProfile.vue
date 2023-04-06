<template>
    <v-container>
      <loading-overlay :loading="categorys_is_loading"></loading-overlay>
      <div class="profileCard my-5 center">
        <v-img
          src="@/assets/userManagePage/imgcardafterupload.png"
          class="iconInCard drop-shadow-md"
        >
        </v-img>
        <div style="position: absolute">
       
          <div>
            <v-img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC_N_JBXW49fAT5BDrX0izmY5Z8lx-we3Oag&usqp=CAU"
              class="image-cropper "
            >
            </v-img>
          </div>
        </div>
      </div>
      <div class="text-center font-bold">{{ data_local.first_name_en }}</div>
      <div class="my-3 text-center">
        <v-btn depressed color="#FF6B81" class="white--text rounded-xl " @click="show_detail()">
          ดูข้อมูลส่วนตัว
        </v-btn>
      </div>


    <!-- ROLE STUDENT คอร์สเรียน-->
    <div v-if="data_local.roles.includes('R_5')">
        <div class="mt-8">
        <label-custom text="คอร์สเรียน"></label-custom>
      </div>
      <v-divider class=""></v-divider>
      <!-- COURSE -->
      <v-row dense class="mt-3" @click="$router.push({name:'StudentsSchedule'})">
        <v-col cols="2" sm="1">
          <img src="../../../assets/profile/cource.png" />
        </v-col>
        <v-col cols="5" sm="6" align="left" class="mt-1" >
          <label>คอร์สเรียนของฉัน</label>
        </v-col>
        <v-col cols="3" sm="4" align="right" class="mt-1">
          <label class="pink--text">{{ student_data.length }} คอร์ส</label>
        </v-col>
        <v-col cols="2" sm="1" align="right" class="mt2">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>
      <!-- CERTIFICATE -->
      <v-row dense class="mt-3" @click="show_certificate()">
        <v-col cols="2" sm="1">
          <img src="../../../assets/profile/certificate.png" />
        </v-col>
        <v-col cols="5" sm="6" align="left" class="mt-1">
          <label>การแข่งขันและเกียรติบัตร</label>
        </v-col>
        <v-col cols="3" sm="4" align="right" class="mt-1">
          <label class="pink--text">2 การแข่ง</label>
        </v-col>
        <v-col cols="2" sm="1" align="right" class="mt-2">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>
    </div>

 
  <div v-if="data_local.roles.includes('R_2')"></div>
  <!-- ROLE STUDENT ข้อมูลผู้ปกครอง -->
     <div v-if="data_local.roles.includes('R_5')">
      <div class="mt-8">
        <label-custom text="ข้อมูลผู้ปกครอง"></label-custom>
      </div>
      <v-divider class=""></v-divider>
      <!-- card parent -->
      <v-card class=" mt-8 " v-for="(profile, index) in profile_user" :key="`${index}-profile`" @click="show_relations">
        <v-row dense class="my-5">
          <!-- col avatar -->
          <v-col cols="12" sm="2">
            <v-img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgifOpyja9K5DLbn2xldBaslS_Aat6ALgMAA&usqp=CAU"
              alt="Card image"
              class="rounded-full ml-3 image-cropper"
              style="max-width: 100px; max-height: 100px"
            />
          </v-col>
          <!-- col name -->
          <v-col cols="12" sm="10">
            <v-row dense>
              <v-col>
              <v-col cols="12">{{ profile.parent_firstname_en }}</v-col>
              <v-col cols="12" class="text-slate-400">{{ profile.tel }}</v-col>
            </v-col>
            <!-- col arrow -->
          <v-col cols="12" sm="2" class="mt-5" align="center">
            <span class="mdi mdi-chevron-right"></span>
          </v-col>
            </v-row>
        </v-col>
        </v-row>
      </v-card>
     </div>

  <!-- ROLE ALL ทั่วไป -->
    <div >
      <div class="mt-8">
        <label-custom text="ทั่วไป"></label-custom>
      </div>
      <v-divider class=""></v-divider>
      <!-- password -->
      <v-row dense class="mt-3" @click="show_password()">
        <v-col cols="2" sm="1">
          <img src="@/assets/profile/password.png" />
        </v-col>
        <v-col cols="8" sm="9" align="left" class="mt-1">
          <label>รหัสผ่าน</label>
        </v-col>
  
        <v-col cols="2" sm="2" align="right">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>
      <!-- translate -->
      <v-row dense class="mt-3"  @click="$router.push({name:'ProfileLanguages'})">
        <v-col cols="2" sm="1">
          <img src="@/assets/profile/langueges.png" />
        </v-col>
        <v-col cols="8" sm="9" align="left" class="mt-1">
          <label>ภาษา</label>
        </v-col>
  
        <v-col cols="2" sm="2" align="right">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>
    </div>
   <!-- ROLE PARENT ข้อมูลนักเรียนในความดูแล-->
   <div v-if="data_local.roles.includes('R_4')">
      <div class="mt-8">
        <label-custom text="ข้อมูลนักเรียนในความดูแล"></label-custom>
      </div>
      <v-divider class=""></v-divider>
      <!-- card Students -->
      <v-card class=" mt-8 " v-for="(profile, index) in profile_user" :key="`${index}-profile`" @click="show_relations">
        <v-row dense class="my-5">
          <!-- col avatar -->
          <v-col cols="12" sm="2" align="center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEpKC_pI1Y_lmnOSDilaMdTDvWbDicz53xGA&usqp=CAU"
              alt="Card image"
              class="rounded-full image-cropper ml-3"
              
              style="max-width: 100px; max-height: 100px "
            />
          </v-col>
          <!-- col name -->
          <v-col cols="12" sm="10">
            <v-row dense>
              <v-col>
              <v-col cols="12">{{ profile.firstNameTh }} {{ profile.firstNameTh }}</v-col>
              <v-col cols="12" class="pink--text"> {{ student_data.length }} คอร์ส</v-col>
            </v-col>
            <!-- col arrow -->
          <v-col cols="12" sm="2" class="mt-5" align="center" >
            <span class="mdi mdi-chevron-right"></span>
          </v-col>
            </v-row>
        </v-col>
        </v-row>
      </v-card>
  </div>
    <!-- ROLE ALL -->
      <div class="mt-8">
        <label-custom text="นโยบาย"></label-custom>
      </div>
      <v-divider class=""></v-divider>
      <!-- policy -->
      <v-row dense class="mt-3" @click="show_policy()">
        <v-col cols="2" sm="1">
          <img src="@/assets/profile/policy.png" />
        </v-col>
        <v-col cols="8" sm="9" align="left" class="mt-1">
          <label>นโยบายการคุ้มครองข้อมูลส่วนบุคลล</label>
        </v-col>
  
        <v-col cols="2" sm="2" align="right">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>
      <!-- rules -->
      <v-row dense class=" mt-3" @click="show_rules()">
        <v-col cols="2" sm="1">
          <img src="@/assets/profile/rules.png" />
        </v-col>
        <v-col cols="8" sm="9" align="left" class="mt-1">
          <label>ข้อกำหนดการและเงื่อนไขการใช้บริการ</label>
        </v-col>
  
        <v-col cols="2" sm="2" align="right">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>
      <div class="text-center my-5">
          <v-btn
        outlined
        color="pink"
        @click="logOut"
      >
      ออกจากระบบ
      </v-btn>
      </div>
    </v-container>
  </template>
  
  <script>
  import { mapActions, mapGetters } from "vuex";
  import labelCustom from "@/components/label/labelCustom.vue";
  import loadingOverlay from "../../../components/loading/loadingOverlay.vue";
  // import axios from "axios";
  // import VueCookie from "vue-cookie"
  export default {
    components: {
      labelCustom,
    loadingOverlay
  },
    data: () => ({
      data_local: JSON.parse(localStorage.getItem("userDetail")),

    }),
    created() {
        this.user_login = JSON.parse(localStorage.getItem("userDetail"))
        this.GetAll(this.user_login.account_id);
        for (const item_data of this.profile_user) {
        this.GetStudentData(item_data.student_id);}

  },
    mounted() {
      this.$store.dispatch("NavberUserModules/changeTitleNavber", "บัญชีผู้ใช้");
      
    },
  
    methods: {
      ...mapActions({
        loginOneId: "loginModules/loginOneId",
        logOut: "loginModules/logOut",
        GetAll: "ProfileModules/GetAll",
        GetStudentData: "MyCourseModules/GetStudentData",

        
      }),

      async getStudentData(order_item_id) {
    await this.$store.dispatch('getStudentData', order_item_id)
    // Access the data in your component
    const studentData = this.$store.state.studentData
    console.log(studentData)
        },
  
      show_detail() {
          this.$router.push({ name: 'ProfileDetail', params:{profile_id : this.data_local.account_id} })
      },
        show_relations() {
          // role parent
          if (this.data_local.roles.includes('R_4')) {
              this.$router.push({ name: "ProfileRelations", params: { action: "Roleparent_view" } });
              
          } else {
              this.$router.push({ name: "ProfileRelations", params: { action: "Rolestudent_view"} });
              
          }
        
      },
        show_certificate() {
        this.$router.push({name :'ProfileCertificate'})
      },
        show_password() {
        this.$router.push({name : 'ProfilePassword'})
      },
        show_policy() {
        this.$router.push({name: 'ProfilePolicy'})
      },
        show_rules() {
          this.$router.push({name: 'ProfileRules'})
      },



    },
    computed: {
      ...mapGetters({
        user_one_id: "loginModules/getUserOneId",
        student_data: "MyCourseModules/getStudentData",
        categorys_is_loading: "CategoryModules/getCategorysIsLoading",
        profile_user:"ProfileModules/getProfileUser"
      }),


      studentData: {
      get() {
        return this.student_data;
      },
    },
    },
  };
  </script>
  
  <style scoped>
  .profileCard {
    min-height: 200px;
    min-width: 200px;
    max-height: 200px;
    max-width: 200px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .center {
    margin-left: auto;
    margin-right: auto;
  }
  
  /* .btncenter {
    display: block;
    margin-left: auto;
    margin-right: auto;
  } */
  
  .profileInCard {
    min-height: 160px;
    min-width: 160px;
    max-height: 160px;
    max-width: 160px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-cropper {
  width: 180px;
  height: 180px;
  position: relative;
  overflow: hidden;
  border-radius: 100%;
  margin-top: -2%;
}



  </style>