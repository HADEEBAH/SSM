<template>
  <v-container>
    <!-- {{ $route.params.action }} -->

    <!-- Roleparent_view // จะออกข้อมูลของ นักเรียน -->
    <div v-if="$route.params.action == 'Roleparent_view'" class="mb-5">
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
     
      <v-row dense>
        <!--TH NAME -->
        <v-col cols="12" sm="6">
          <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_student_data.firstNameTh }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="isDisabled"
              @keypress="validate($event, 'th')"
              placeholder=""
              v-model="profile_student_data.firstNameTh"
              outlined
              dense
            >
            </v-text-field>
          </div>
        </v-col>
        <!-- TH LNAME -->
        <v-col cols="12" sm="6">
          <label-custom text="นามสกุล (ภาษาไทย)"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_student_data.lastNameTh }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="isDisabled"
              @keypress="validate($event, 'th')"
              placeholder=""
              v-model="profile_student_data.lastNameTh"
              outlined
              dense
            >
            </v-text-field>
          </div>
        </v-col>
        <!-- nationality -->
        <v-col cols="12" sm="6">
          <label-custom text="สัญชาติ"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_student_data.nationality }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="isDisabled"
              @keypress="validate($event, 'th')"
              placeholder=""
              v-model="profile_student_data.nationality"
              outlined
              dense
            >
            </v-text-field>
          </div>
        </v-col>
        <!-- id_card -->
        <v-col cols="12" sm="6">
          <label-custom text="เลขบัตรประชาชน"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_student_data.id_card }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="!isDisabled"
              @keypress="validate($event, 'th')"
              v-model="profile_student_data.id_card"
              outlined
              dense
            >
            </v-text-field>
          </div>
        </v-col>
        <!-- date_of_birth -->
        <v-col cols="12" sm="6">
          <label-custom text="วันเกิด"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_student_data.date_of_birth }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="isDisabled"
              @keypress="validate($event, 'th')"
              placeholder=""
              v-model="profile_student_data.date_of_birth"
              outlined
              dense
            >
              <template v-slot:append>
                <v-icon color="#FF6B81">mdi-calendar</v-icon>
              </template>
            </v-text-field>
          </div>
        </v-col>
        <!-- tel -->
        <v-col cols="12" sm="6">
          <label-custom text="เบอร์โทรศัพท์"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_student_data.tel }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="!isDisabled"
              @keypress="validate($event, 'th')"
              @input="checkPhoneNumber"
              maxlength="12"
              required
              placeholder=""
              v-model="profile_student_data.tel"
              outlined
              dense
            >
            </v-text-field>
          </div>
        </v-col>
        <!-- email -->
        <v-col cols="12" sm="6">
          <label-custom text="อีเมล"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_student_data.email }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="!isDisabled"
              placeholder=""
              v-model="profile_student_data.email"
              outlined
              dense
              :rules="rules.email"
            >
            </v-text-field>
          </div>
        </v-col>
      </v-row>

      <div class="mt-8">
        <label-custom text="คอร์สเรียน"></label-custom>
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
      <v-row dense class="mt-3" @click="show_rules()">
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
      <v-row dense>
        <!--TH NAME -->
        <v-col cols="12" sm="6">
          <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_parent_data.fname_th }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="isDisabled"
              @keypress="validate($event, 'th')"
              placeholder=""
              v-model="profile_parent_data.fname_th"
              outlined
              dense
            >
            </v-text-field>
          </div>
        </v-col>
        <!-- TH LNAME -->
        <v-col cols="12" sm="6">
          <label-custom text="นามสกุล (ภาษาไทย)"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_parent_data.lname_th }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="isDisabled"
              @keypress="validate($event, 'th')"
              placeholder=""
              v-model="profile_parent_data.lname_th"
              outlined
              dense
            >
            </v-text-field>
          </div>
        </v-col>
        <!-- nationality -->
        <v-col cols="12" sm="6">
          <label-custom text="สัญชาติ"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_parent_data.nationality }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="isDisabled"
              @keypress="validate($event, 'th')"
              placeholder=""
              v-model="profile_parent_data.nationality"
              outlined
              dense
            >
            </v-text-field>
          </div>
        </v-col>
        <!-- id_card -->
        <v-col cols="12" sm="6">
          <label-custom text="เลขบัตรประชาชน"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_parent_data.id_card }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="!isDisabled"
              @keypress="validate($event, 'th')"
              v-model="profile_parent_data.id_card"
              outlined
              dense
            >
            </v-text-field>
          </div>
        </v-col>
        <!-- date_of_birth -->
        <v-col cols="12" sm="6">
          <label-custom text="วันเกิด"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_parent_data.date_of_birth }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="isDisabled"
              @keypress="validate($event, 'th')"
              placeholder=""
              v-model="profile_parent_data.date_of_birth"
              outlined
              dense
            >
              <template v-slot:append>
                <v-icon color="#FF6B81">mdi-calendar</v-icon>
              </template>
            </v-text-field>
          </div>
        </v-col>
        <!-- tel -->
        <v-col cols="12" sm="6">
          <label-custom text="เบอร์โทรศัพท์"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_parent_data.tel }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="!isDisabled"
              @keypress="validate($event, 'th')"
              @input="checkPhoneNumber"
              maxlength="12"
              required
              placeholder=""
              v-model="profile_parent_data.tel"
              outlined
              dense
            >
            </v-text-field>
          </div>
        </v-col>
        <!-- email -->
        <v-col cols="12" sm="6">
          <label-custom text="อีเมล"></label-custom>
          <div v-if="!isEnabled">
            {{ profile_parent_data.email }}
          </div>
          <div v-else>
            <v-text-field
              v-bind:disabled="!isDisabled"
              placeholder=""
              v-model="profile_parent_data.email"
              outlined
              dense
              :rules="rules.email"
            >
            </v-text-field>
          </div>
        </v-col>
      </v-row>
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

    this.user_login = JSON.parse(localStorage.getItem("userDetail"))
    this.GetAll(this.user_login.account_id)
    // this.GetProfileStudentData(this.user_login.account_id)
    // this.GetProfileParentData(this.user_login.account_id)
    // this.GetParentData(this.user_login.account_id)
    // this.GetroleParentData({student_id: this.user_login.account_id})
  },

  methods: {
    ...mapActions({
      loginOneId: "loginModules/loginOneId",
      GetAll: "ProfileModules/GetAll",
      // GetProfileStudentData: "ProfileModules/GetProfileStudentData",
      // GetProfileParentData: "ProfileModules/GetProfileParentData"
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
      console.log(x);
      this.user_data.phone_num = !x[2]
        ? x[1]
        : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
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
      profile_student_data: "ProfileModules/getProfileStudentData",
      profile_parent_data: "ProfileModules/getProfileParentData",
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