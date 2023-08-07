<template>
  <v-container>
    <!-- {{ $route.params.action }} -->
    <!-- <pre>{{profile_user}}</pre> -->
  <div v-for="(profile, index) in profile_user" :key="`${index}-profile`">
  {{ profile.length }}
    
    <!-- Roleparent_view // จะออกข้อมูลของ นักเรียน -->
    <div  v-if="$route.params.action == 'Roleparent_view'" class="mb-5">
        <div class="profileCard my-5 center">
          <v-img
            src="@/assets/userManagePage/imgcardafterupload.png"
            class="iconInCard drop-shadow-md"
          >
          </v-img>
          <div style="position: absolute">
            <div>
              <v-img
                src="@/assets/logo.png"
                max-height="30"
                max-width="30"
                class="mx-15"
              >
              </v-img>
            </div>
          </div>
        </div>
        <v-row dense class="mx-10">
          
          <!--TH NAME -->
          <v-col cols="12" sm="6">
            <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
            <br/>
            {{ profile.firstNameTh == ''? '-' : profile.firstNameTh }}
          </v-col>
          <!-- TH LNAME -->
          <v-col cols="12" sm="6">
            <label-custom text="นามสกุล (ภาษาไทย)"></label-custom>
            <br/>
            {{ profile.lastNameTh == ''? '-' : profile.lastNameTh }}
          </v-col>
          <!-- nationality -->
          <v-col cols="12" sm="6">
            <label-custom text="สัญชาติ"></label-custom>
            <br/>
            {{ profile.nation == null? '-' : profile.nation }}
          </v-col>
          <!-- id_card -->
          <v-col cols="12" sm="6">
            <label-custom text="เลขบัตรประชาชน"></label-custom>
            <br/>
            {{ profile.accountId == ''? '-' : profile.accountId }}
          </v-col>
          <!-- date_of_birth -->
          <v-col cols="12" sm="6">
            <label-custom text="วันเกิด"></label-custom>
            <br/>
            {{ profile.accountId == ''? '-' : profile.accountId }}
          </v-col>
            <!-- tel -->
        <v-col cols="12" sm="6">
          <label-custom text="เบอร์โทรศัพท์"></label-custom>
          <br/>
            {{ profile.tel== ''? '-' : profile.tel}}
        </v-col>
        <!-- email -->
        <v-col cols="12" sm="6">
          <label-custom text="อีเมล"></label-custom>
          <br/>
            {{ profile.email== ''? '-' : profile.email}}
        </v-col>
      </v-row>

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
          <label class="pink--text">คอร์ส</label>
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


    <!-- Rolestudent_view // จะออกข้อมูลของ ผู้ปกครอง-->
    <div v-if="$route.params.action == 'Rolestudent_view'" class="mb-5">
      <div class="profileCard my-5 center">
        <v-img
          src="@/assets/userManagePage/imgcardafterupload.png"
          class="iconInCard drop-shadow-md"
        >
        </v-img>
        <div style="position: absolute">
          <div>
            <v-img
              src="@/assets/logo.png"
              max-height="30"
              max-width="30"
              class="mx-15"
            >
            </v-img>
          </div>
        </div>
      </div>
      <v-row dense class="mx-10">
        <!--TH NAME -->
        <v-col cols="12" sm="6">
          <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
          <br/>
            {{ profile.parent_firstname_th == ''? '-' : profile.parent_firstname_th }}
        </v-col>
        <!-- TH LNAME -->
        <v-col cols="12" sm="6">
          <label-custom text="นามสกุล (ภาษาไทย)"></label-custom>
          <br/>
            {{ profile.parent_lastname_th == ''? '-' : profile.parent_lastname_th }}
        </v-col>
        <!-- nationality -->
        <v-col cols="12" sm="6">
          <label-custom text="สัญชาติ"></label-custom>
          <br/>
            {{ profile.nation == null ? '-' : profile.nation}}
        </v-col>
        <!-- id_card -->
        <v-col cols="12" sm="6">
          <label-custom text="เลขบัตรประชาชน"></label-custom>
          <br/>
           {{profile.student_id == ''? '-': profile.student_id}}
        </v-col>
        <!-- date_of_birth -->
        <v-col cols="12" sm="6">
          <label-custom text="วันเกิด"></label-custom>
          <br/>
            {{ profile.parent_firstname_th == ''? '-' : profile.parent_firstname_th}}
        </v-col>
        <!-- tel -->
        <v-col cols="12" sm="6">
          <label-custom text="เบอร์โทรศัพท์"></label-custom>
          <br/>
            {{ profile.tel== ''? '-' : profile.tel}}
        </v-col>
        <!-- email -->
        <v-col cols="12" sm="6">
          <label-custom text="อีเมล"></label-custom>
          <br/>
            {{ profile.email== ''? '-' : profile.email}}
        </v-col>
      </v-row>
    </div>
  
  </div>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { inputValidation } from "@/functions/functions";
import LabelCustom from "@/components/label/labelCustom.vue";
export default {
  components: {
    LabelCustom,
  },
  data: () => ({
    isEnabled: false,
    rules: {
      email: [
        (value) => !!value || "Required.",
        (value) => (value || "").length <= 20 || "Max 20 characters",
        (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      ],
    },
  }),
  mounted() {
    if (this.$route.params.action == "Rolestudent_view") {
      this.$store.dispatch(
        "NavberUserModules/changeTitleNavber",
        "ข้อมูลผู้ปกครอง"
      );
    } else
      this.$store.dispatch(
        "NavberUserModules/changeTitleNavber",
        "ข้อมูลนักเรียน"
      );

    this.user_login = JSON.parse(localStorage.getItem("userDetail"));
    this.GetAll(this.user_login.account_id);
  },

  methods: {
    ...mapActions({
      loginOneId: "loginModules/loginOneId",
      GetAll: "ProfileModules/GetAll",
    }),
    edit() {
      this.isDisabled = false;
      this.isEnabled = true;
      this.buttonName = "บันทึก";
    },
    submitEdit() {
      this.isDisabled = true;
      this.isEnabled = false;
      this.buttonName = "แก้ไข";
    },
    validate(e, type) {
      inputValidation(e, type);
    },
    checkPhoneNumber() {
      let x = this.user_data.phone_num.replace(/\D/g, "");
      x = x.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      // // console.log(x);
      this.user_data.phone_num = !x[2]
        ? x[1]
        : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    },
    show_policy() {
      this.$router.push({ name: "ProfilePolicy" });
    },
    show_rules() {
      this.$router.push({ name: "ProfileRules" });
    },
  },
  computed: {
    ...mapGetters({
      user_one_id: "loginModules/getUserOneId",
      profile_user: "ProfileModules/getProfileUser",
    }),
  },
};
</script>

<style script>
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

.center {
  margin-left: auto;
  margin-right: auto;
}
</style>