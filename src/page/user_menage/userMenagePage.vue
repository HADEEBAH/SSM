<template>
  <v-container>
    <v-row dense>
      <v-col>
        <headerPage :breadcrumbs="breadcrumbs"></headerPage>
        <v-card class="mx-auto" height="1300">
          <headerCard
            class="ml-6 mt-8"
            :icon="'mdi-card-account-details-outline'"
            :icon_color="'#FF6B81'"
            :title="title"
          ></headerCard>
          <v-divider class="mx-10"></v-divider>
          <v-card class="mt-10 ml-10 mr-10" color="#FCFCFC">
            <v-card-text class="mt-3">
              <v-row align="center">
                <v-col class="ml-5" cols="12" sm="4">
                  <label>Username(English)</label>
                  <v-text-field
                    placeholder="กรุณาระบุชื่อผู้ใช้งาน(ภาษาอังกฤษ)"
                    v-model="username"
                    :rules="rules.name"
                    outlined
                    dense
                  >
                  </v-text-field>
                </v-col>
                <v-col>
                  <label>
                    <span>หากไม่มี กรุณา </span>
                  </label>
                  <label
                    class="primary--text cursor-pointer mt-5"
                    @click="changeDialogRegisterOneId(true)"
                    >สมัคร One ID</label
                  >
                </v-col>
                <v-col
                  ><v-img
                    v-if="$vuetify.breakpoint.smAndUp"
                    class="img-one ml-auto mr-10 mb-2"
                    src="@/assets/manageuser/logo_one platform.svg"
                /></v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card class="mt-10 ml-10 mr-10" color="#FCFCFC">
            <v-card-text class="mt-3">
              <v-row>
                <v-col cols="12" sm="3">
                  <div
                    class="upload-photo pa-7 rounded-circle border-dashed border-2"
                  >
                    <v-card-text class="upload-photo">
                      <v-row v-if="previewUrl">
                        <v-col>
                          <img :src="previewUrl" style="max-height: 200px" />
                        </v-col>
                      </v-row>
                      <v-row v-if="!previewUrl">
                        <v-col
                          cols="12"
                          class="flex align-center justify-center"
                        >
                          <v-img
                            src=""
                            max-height="105"
                            max-width="122"
                          ></v-img>
                        </v-col>
                        <v-col
                          cols="12"
                          class="flex align-center justify-center text-h5"
                        >
                          Upload Photo
                        </v-col>
                        <v-col
                          cols="12"
                          class="flex align-center justify-center text-caption text-center"
                        >
                          ต้องเป็นไฟล์ภาพ( PNG JPG ) เท่านั้น ขนาดภาพไม่เกิน 500
                          Mb
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </div>
                </v-col>
                <v-col class="ml-5" cols="12" sm="4">
                  <label>ชื่อ (ภาษาไทย)</label>
                  <v-text-field
                    placeholder=""
                    v-model="username"
                    :rules="rules.name"
                    outlined
                    dense
                  >
                  </v-text-field>
                </v-col>
                <v-col class="ml-5" cols="12" sm="4">
                  <label>นามสกุล (ภาษาไทย)</label>
                  <v-text-field
                    placeholder=""
                    v-model="username"
                    :rules="rules.name"
                    outlined
                    dense
                  >
                  </v-text-field>
                </v-col>
                <v-col class="ml-5" cols="12" sm="4">
                  <label>First Name (English)</label>
                  <v-text-field
                    placeholder=""
                    v-model="username"
                    :rules="rules.name"
                    outlined
                    dense
                  >
                  </v-text-field>
                </v-col>
                <v-col class="ml-5" cols="12" sm="4">
                  <label>Last Name (English)</label>
                  <v-text-field
                    placeholder=""
                    v-model="username"
                    :rules="rules.name"
                    outlined
                    dense
                  >
                  </v-text-field>
                </v-col>
                <v-col class="ml-5" cols="12" sm="4">
                  <label>อีเมล</label>
                  <v-text-field
                    placeholder=""
                    v-model="username"
                    :rules="rules.name"
                    outlined
                    dense
                  >
                  </v-text-field>
                </v-col>
                <v-col class="ml-5" cols="12" sm="4">
                  <label>เบอร์โทรศัพท์</label>
                  <v-text-field
                    placeholder=""
                    v-model="username"
                    :rules="rules.name"
                    outlined
                    dense
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <headerCard
            class="ml-6 mt-8"
            :icon="'mdi-card-account-details-outline'"
            :icon_color="'#FF6B81'"
            :title="title2"
          ></headerCard>
          <v-divider class="mx-10"></v-divider>
          <v-card class="mt-10 ml-10 mr-10" color="#FCFCFC">
            <v-card-text class="mt-3">
              <v-row class="mr-3 ml-3">
                <v-col cols="12" sm="6">
                  <label>บทบาทผู้ใช้งาน</label>
                  <v-autocomplete
                    dense
                    :items="role"
                    label="กรุณาเลือกบทบาทผู้ใช้งาน"
                    placeholder="กรุณาเลือกบทบาทผู้ใช้งาน"
                    single-line
                    outlined
                    chips
                    multiple
                    deletable-chips
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6">
                  <label>สิทธิ์ผู้ใช้งาน</label>
                  <v-autocomplete
                    dense
                    :items="period"
                    placeholder="กรุณาเลือกสิทธิ์ผู้ใช้งาน"
                    outlined
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-dialog
            persistent
            v-model="show_dialog_register_one_id"
            width="60vw"
          >
            <registerDialogForm
              dialog
              title="สมัคร One ID"
            ></registerDialogForm>
          </v-dialog>
          <v-col cols="auto">
            <v-btn
              dark
              color="#FF6B81"
              class="btn-manage"
              style="width: 120px"
              depressed
              >บันทึก</v-btn
            >
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import headerPage from "../../components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import registerDialogForm from "../../components/user_menage/registerDialogForm.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "userMenagePage",
  components: {
    headerPage,
    headerCard,
    registerDialogForm,
  },
  data: () => ({
    username: "",
    show_dialog: false,
    role: ["ทั้งหมด", "นักเรียน", "ผู้ปกครอง", "โค้ช", "บัญชี", "Admin"],
    breadcrumbs: [
      { text: "จัดการผู้ใช้งาน", to: "Manageuser" },
      { text: "เพิ่มผู้ใช้งาน", to: "" },
    ],
    title: "ข้อมูลผู้ใช้งาน",
    title2: "การจัดการสิทธิ์",
    rules: {
      name: [
        (val) =>
          (val || "").length > 0 ||
          "ชื่อผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง",
      ],
    },
  }),

  created() {},

  mounted() {},
  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
    }),
  },
  computed: {
    ...mapGetters({
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
    }),
  },
  watch: {},
};
</script>
<style scoped>
.img-one {
  width: 140px;
  height: 60px;
}
.btn-manage {
  position: absolute;
  left: 86%;
  top: 95%;
}
.upload-photo {
  border-color: #ff6b81;
}
</style>
