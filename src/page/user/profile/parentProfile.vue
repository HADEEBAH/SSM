<template>
  <v-container>
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
    <div class="text-center font-bold">{{ data_local.first_name_en }}</div>

    <div class="my-3 text-center">
      <v-btn depressed color="#FF6B81" class="white--text rounded-xl ">
        ดูข้อมูลส่วนตัว
      </v-btn>
    </div>
    <div class="ml-10 mt-8">
      <label-custom text="ทั่วไป"></label-custom>
    </div>
    <v-divider class="mx-10"></v-divider>
    <!-- password -->
    <v-row dense class="ml-8 mt-3 mr-8">
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
    <v-row dense class="ml-8 mt-3 mr-8">
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
    <div class="ml-10 mt-8">
      <label-custom text="ข้อมูลนักเรียนในความดูแล"></label-custom>
    </div>
    <v-divider class="mx-10"></v-divider>
    <!-- card Students -->
    <v-card class=" mt-8 mx-10" v-for="item in items" :key="item.id">
      <v-row dense class="my-5">
        <!-- col avatar -->
        <v-col cols="12" sm="2">
          <img
            :src="item.imageUrl"
            alt="Card image"
            class="rounded-full ml-3"
            style="max-width: 100px; max-height: 100px"
          />
        </v-col>
        <!-- col name -->
        <v-col cols="10" sm="8" class="mt-5">
          <v-row dense>
            <v-col cols="12">{{ item.title }}</v-col>
            <v-col cols="12" class="pink--text">{{ item.id }}คอร์ส</v-col>
          </v-row>
        </v-col>
        <!-- col arrow -->
        <v-col cols="2" sm="2" class="mt-5">
          <span class="mdi mdi-chevron-right"></span>
        </v-col>
      </v-row>
    </v-card>

    <div class="ml-10 mt-8">
      <label-custom text="คอร์สเรียน"></label-custom>
    </div>
    <v-divider class="mx-10"></v-divider>
    <!-- policy -->
    <v-row dense class="ml-8 mt-3 mr-8">
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
    <v-row dense class="ml-8 mt-3 mr-8">
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
    >
    ออกจากระบบ
    </v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import labelCustom from "@/components/label/labelCustom.vue";
export default {
  components: { labelCustom },
  data: () => ({
    data_local: JSON.parse(localStorage.getItem("userDetail")),
    items: [
      {
        id: 1,
        title: "Card 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        imageUrl: "https://picsum.photos/id/1/200/200",
      },
      {
        id: 2,
        title: "Card 2",
        description:
          "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl: "https://picsum.photos/id/2/200/200",
      },
      {
        id: 3,
        title: "Card 3",
        description:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        imageUrl: "https://picsum.photos/id/3/200/200",
      },
    ],
  }),
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "บัญชีผู้ใช้");
  },

  methods: {
    ...mapActions({
      loginOneId: "loginModules/loginOneId",
    }),
  },
  computed: {
    ...mapGetters({
      user_one_id: "loginModules/getUserOneId",
    }),
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
</style>