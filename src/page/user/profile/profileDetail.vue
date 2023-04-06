<template>
  <v-container>
    {{ profile_user }}
    <!-- <div class="profileCard my-5 center">
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
    </div> -->
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
    <!-- Button -->
    <div v-if="!isEnabled">
      <v-row>
        <v-col class="my-3 text-center">
          <v-btn
            class="white--text mb-5"
            depressed
            color="#ff6b81"
            @click="edit()"
          >
            <span class="mdi mdi-pencil-outline">แก้ไข</span>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <!-- <div class="text-center font-bold">{{ data_local.first_name_en }}</div> -->
    <v-row dense>
      <!--TH NAME -->
      <v-col cols="12" sm="6">
        <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
        <div v-if="!isEnabled">
          {{ user_detail.first_name_th }}
        </div>
        <div v-else>
          <v-text-field
            v-bind:disabled="isDisabled"
            @keypress="validate($event, 'th')"
            placeholder=""
            v-model="user_detail.first_name_th"
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
          {{ user_detail.last_name_th }}
        </div>
        <div v-else>
          <v-text-field
            v-bind:disabled="isDisabled"
            @keypress="validate($event, 'th')"
            placeholder=""
            v-model="user_detail.last_name_th"
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
          {{ user_data.nationality }}
        </div>
        <div v-else>
          <v-text-field
            v-bind:disabled="isDisabled"
            @keypress="validate($event, 'th')"
            placeholder=""
            v-model="user_data.nationality"
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
          {{ user_data.id_card }}
        </div>
        <div v-else>
          <v-text-field
            v-bind:disabled="!isDisabled"
            @keypress="validate($event, 'th')"
            v-model="user_data.id_card"
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
          {{ user_data.date_of_birth }}
        </div>
        <div v-else>
          <v-text-field
            v-bind:disabled="isDisabled"
            @keypress="validate($event, 'th')"
            placeholder=""
            v-model="user_data.date_of_birth"
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
          {{ user_detail.tel }}
        </div>
        <div v-else>
          <v-text-field
            v-bind:disabled="!isDisabled"
            @keypress="validate($event, 'th')"
            @input="checkPhoneNumber"
            maxlength="12"
            required
            placeholder=""
            v-model="user_detail.tel"
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
          {{ user_detail.email }}
        </div>
        <div v-else>
          <v-text-field
            v-bind:disabled="!isDisabled"
            placeholder=""
            v-model="user_detail.email"
            outlined
            dense
            :rules="rules.email"
          >
          </v-text-field>
        </div>
      </v-col>
      <!-- BTN -->

      <v-col cols="12" sm="12" v-if="isEnabled">
        <v-btn
          class="white--text my-5 w-full"
          depressed
          color="#ff6b81"
          @click="submitEdit()"
        >
          บันทึก
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
  
  <script>
import { mapActions, mapGetters } from "vuex";
import { inputValidation } from "@/functions/functions";
import LabelCustom from "@/components/label/labelCustom.vue";
import VueCookie from "vue-cookie"
import Swal from "sweetalert2";
import axios from "axios";
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

    user_detail:{}
  }),

  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"))
    this.GetAll(this.user_detail.account_id)

    // console.log("userDetail", this.user_detail);
  },
  mounted() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "ข้อมูลส่วนตัว"
    );
  },

  methods: {
    ...mapActions({
      loginOneId: "loginModules/loginOneId",
      GetUserData: "ProfileModules/GetUserData",
      GetAll: "ProfileModules/GetAll"
      // GetParentData: "ProfileModules/GetParentData",
    }),
    edit() {
      this.isDisabled = false;
      this.isEnabled = true;
      this.buttonName = "บันทึก";
    },
    submitEdit(account_id) {
      Swal.fire({
        icon: "question",
        title: "คุณต้องการแก้ไขอาณาข้อมูลส่วนตัวหรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // console.log("preview_url", this.file);
            let bodyFormData = new FormData();
            // bodyFormData.append("categoryImg", this.file ?  this.file : null);
            bodyFormData.append("parent_firstname_th",this.profile_user.parent_firstname_th );
            bodyFormData.append("parent_lastname_th", this.profile_user.parent_lastname_th);
            bodyFormData.append("nation", this.profile_user.nation);
            bodyFormData.append( "tel", this.profile_user.tel);
            bodyFormData.append("email", this.profile_user.email);
          
            
            let config = {
                    headers:{
                        "Access-Control-Allow-Origin" : "*",
                        "Content-type": "Application/json",
                        'Authorization' : `Bearer ${VueCookie.get("token")}`
                    }
                }
                let { data } = await axios.post(`${process.env.VUE_APP_URL}/api/v1/relations/user?student_id${account_id}`,config)
            if (data.statusCode === 200) {
              this.dialog_show = true;
              this.isDisabled = true;
              this.isEnabled = false;
              this.buttonName = "แก้ไข";
            } else {
              throw { message: data.message };
            }
          } catch (error) {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: error.message,
            });
          }
        } else {
          Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
        }
      });


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
  },
  computed: {
    ...mapGetters({
      user_one_id: "loginModules/getUserOneId",
      user_data: "ProfileModules/getUserData",
      profile_user: "ProfileModules/getProfileUser",
      // parent_data: "ProfileModules/getParentData",
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
.image-cropper {
  width: 180px;
  height: 180px;
  position: relative;
  overflow: hidden;
  border-radius: 100%;
  margin-top: -2%;
}

</style>