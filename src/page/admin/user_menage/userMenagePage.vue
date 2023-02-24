<template>
  <v-container class="overflow-x-hidden overflow-y-hidden">
    <v-row dense>
      <v-col>
        <headerPage :breadcrumbs="breadcrumbs"></headerPage>
        <v-card class="mx-auto">
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
                <v-col cols="12" sm="4">
                  <label-custom text="Username(English)"></label-custom>
                  <v-text-field
                    placeholder="กรุณาระบุชื่อผู้ใช้งาน(ภาษาอังกฤษ)"
                    @keypress="validate($event, 'en')"
                    v-model="username_en"
                    hide-details
                    outlined
                    dense
                    @keyup.enter="checkData"
                    :color="isMatch ? 'blue' : 'pink'"
                  >
                    <template #append>
                      <v-icon v-if="isMatch">mdi-check</v-icon>
                    </template>
                  </v-text-field>

                  <span class="text-sm red--text" v-if="isNotMatch"
                    >{{ username_alert }}
                  </span>
                </v-col>
                <v-col cols="12" sm="4">
                  <label>หากไม่มี กรุณา </label>
                  <label
                    class="primary--text cursor-pointer mt-5"
                    @click="changeDialogRegisterOneId(true)"
                    >สมัคร One ID
                  </label>
                </v-col>
                <v-col cols="12" sm="auto">
                  <v-img
                    class="img-one ml-auto mr-10 mb-2"
                    src="@/assets/manageuser/logo_one platform.svg"
                /></v-col>
              </v-row>
            </v-card-text>
          </v-card>
<div v-if="isMatch === true">
          <v-card class="mt-10 ml-10 mr-10" color="#FCFCFC">
            <v-card-text class="mt-3">
              <v-row >
                <v-col cols="12" sm="3">
                  <v-card class="rounded-circle border-8">
                    <div
                    @click="openFileSelector"
                      class="upload-photo rounded-circle border-dashed border-4"
                    >
                    
                      <v-card-text class="upload-photo pa-3">
                        <img
                          :src="previewUrl"
                          v-if="previewUrl"
                          class="rounded-full"
                          style="height: 150px; width: 200px"
                        />
                        <v-row v-if="!previewUrl" class="rounded-circle">
                          <v-col
                            cols="12"
                            class="flex align-center justify-center"
                          >
                            <v-img
                              
                              src="@/assets/userManagePage/uploadPhoto.png"
                              max-height="30"
                              max-width="30"
                            >
                            </v-img>
                          </v-col>
                          <v-col
                            cols="12"
                            class="flex align-center justify-center text-h5"
                          >
                            Upload Photo
                          </v-col>
                          <v-col
                            cols="12"
                            class="flex align-center justify-center text-caption text-center text-sm"
                          >
                            ต้องเป็นไฟล์ภาพ( PNG JPG ) เท่านั้น ขนาดภาพไม่เกิน
                            500 Mb
                          </v-col>
                          <input
                            ref="fileInput"
                            type="file"
                            @change="uploadFile"
                            style="display: none"
                            class="rounded-full"
                          />
                        </v-row>
                      </v-card-text>
                      <!-- <v-card-text v-if="">

                      </v-card-text> -->
                    </div>
                  </v-card>
                </v-col>

                <v-col>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
                      <v-text-field
                        @keypress="validate($event, 'th')"
                        placeholder=""
                        v-model="username_th"
                        :rules="rules.name"
                        outlined
                        dense
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <label-custom text="นามสกุล (ภาษาไทย)"></label-custom>
                      <v-text-field
                        @keypress="validate($event, 'th')"
                        placeholder=""
                        v-model="last_name"
                        :rules="rules.name"
                        outlined
                        dense
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" sm="6">
                      <label-custom text="First Name (English)"></label-custom>
                      <v-text-field
                        @keypress="validate($event, 'en')"
                        placeholder=""
                        v-model="fname_en"
                        :rules="rules.name"
                        outlined
                        dense
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <label-custom text="Last Name (English)"></label-custom>
                      <v-text-field
                        @keypress="validate($event, 'en')"
                        placeholder=""
                        v-model="lname_en"
                        :rules="rules.name"
                        outlined
                        dense
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" sm="6">
                      <label-custom text="อีเมล"></label-custom>
                      <v-text-field
                        @keypress="validate($event, 'en', 'number')"
                        placeholder=""
                        v-model="email"
                        :rules="rules.name"
                        outlined
                        dense
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <label-custom text="เบอร์โทรศัพท์"></label-custom>
                      <v-text-field
                        @keypress="validate($event, 'number')"
                        v-model="phone_num"
                        :rules="rules.name"
                        outlined
                        dense
                        required
                        @input="checkPhoneNumber"
                        maxlength="12"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- การจัดการสิทธิ์ -->
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
                <v-col cols="12">
                  <label-custom text="บทบาทผู้ใช้งาน"></label-custom>
                  <v-autocomplete
                    dense
                    v-model="sortBy"
                    :items="roles"
                    item-text="role"
                    item-value="roles"
                    label="กรุณาเลือกบทบาทผู้ใช้งาน"
                    placeholder="กรุณาเลือกบทบาทผู้ใช้งาน"
                    single-line
                    outlined
                    chips
                    multiple
                    deletable-chips
                    color="pink"
                    item-color="pink"
                    @change="selectRole()"
                  >
                    <template v-slot:item="{ item }">
                      <v-list-item-content>
                        <v-list-item-title
                          ><span
                            :class="
                              // check array ว่ามี stringไหม
                              sortBy.includes(item) ? 'font-bold' : ''
                            "
                            >{{ item.role }}</span
                          ></v-list-item-title
                        >
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-icon>
                          {{
                            sortBy.includes(item)
                              ? "mdi-checkbox-marked"
                              : "mdi-checkbox-blank-outline"
                          }}</v-icon
                        >
                      </v-list-item-action>
                    </template>
                  </v-autocomplete>
                </v-col>
                <!-- <v-col cols="12" sm="6">
                  <label-custom text="สิทธิ์ผู้ใช้งาน"></label-custom>
                  <v-autocomplete
                    dense
                    v-model="privilege"
                    :disabled="
                      privilege === 'ผู้ปกครอง' && sortBy[0] === 'ผู้ปกครอง'
                    "
                    :items="period"
                    placeholder="กรุณาเลือกสิทธิ์ผู้ใช้งาน"
                    outlined
                    color="pink"
                    item-color="pink"
                  >
                  </v-autocomplete>
                </v-col> -->
              </v-row>
            </v-card-text>
          </v-card>

          <!-- check box -->
          <v-row>
            <v-col
              cols="12"
              sm="6"
              class="ml-10"
              v-if="privilege === 'ผู้ปกครอง'"
            >
              <v-checkbox
                v-model="selectedbox"
                label="ต้องการเพิ่มนักเรียนในการดูแล"
                value="Jacob"
                color="pink"
                item-color="pink"
                @change="onCheckboxChange"
              ></v-checkbox>
            </v-col>
          </v-row>

          <!-- Card Add Students -->
          <div v-if="isCardOpen">
            <headerCard
              class="ml-6 mt-8"
              :icon="'mdi-file-plus-outline'"
              :icon_color="'#FF6B81'"
              :title="addStudentData"
            ></headerCard>
            <v-divider class="mx-10"></v-divider>
            <v-card
              class="mt-10 ml-10 mr-10"
              color="#FCFCFC"
              v-for="(student, student_index) in students"
              :key="`${student_index}-student`"
            >
              <v-card-text class="mt-3">
                <v-row dense>
                  <v-col align="right">
                    <v-icon
                      larg
                      color="#FF6B81"
                      @click="removeCardStudent(student_index)"
                      v-if="students.length >= 2"
                    >
                      mdi-delete
                    </v-icon>
                  </v-col>
                </v-row>

                <v-row dense align="center">
                  <v-col cols="12" sm="6">
                    <label-custom
                      text="Student’s Username (English)"
                    ></label-custom>
                    <v-text-field
                      @keypress="validate($event, 'en', 'number')"
                      hide-details
                      v-model="students.username"
                      :rules="rules.name"
                      outlined
                      dense
                      @keyup.enter="checkData"
                      :color="isMatch ? 'blue' : 'red'"
                    >
                      <template #append>
                        <v-icon v-if="isMatch">mdi-check</v-icon>
                      </template>
                    </v-text-field>
                    <span class="text-sm red--text" v-if="isNotMatch"
                      >{{ username_alert }}
                    </span>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <label>หากไม่มี กรุณา </label>
                    <label
                      class="primary--text cursor-pointer mt-5"
                      @click="changeDialogRegisterOneId(true)"
                      >สมัคร One ID
                    </label>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <label-custom text="First Name (English)"></label-custom>
                    <v-text-field
                      @keypress="validate($event, 'en')"
                      placeholder=""
                      v-model="student.firstname"
                      :rules="rules.name"
                      outlined
                      dense
                      disabled
                      filled
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <label-custom text="Last Name (English)"></label-custom>
                    <v-text-field
                      @keypress="validate($event, 'en')"
                      placeholder=""
                      v-model="student.lastname"
                      :rules="rules.name"
                      outlined
                      dense
                      disabled
                      filled
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <label-custom text="เบอร์โทรศัพท์"></label-custom>
                    <v-text-field
                      @keypress="validate($event, 'number')"
                      placeholder=""
                      disabled
                      v-model="student.tel"
                      :rules="rules.name"
                      outlined
                      filled
                      dense
                      required
                      @input="checkPhoneNumberStudent"
                      maxlength="12"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" align="right">
                    <v-btn
                      outlined
                      class="btn3 mt-10 centerbtn"
                      color="#ff6b81"
                      @click="addStudents"
                    >
                      <span class="mdimdi-plus-circle-outline">เพิ่มคอร์ส</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <!-- TABLE -->
            <div class="my-5 mx-10">
              <!-- :items="datausers"
                :search="search"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                :sort-by="sortBy" -->
              <v-data-table
                :headers="headers"
                @page-count="pageCount = $event"
                class="elevation-1 header-table"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon small color="#FF6B81"> mdi-eye-outline </v-icon>
                  <v-icon
                    small
                    class="ml-5"
                    color="#FF6B81"
                    @click="editItem(item)"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    class="ml-5"
                    small
                    color="#FF6B81"
                    @click="deleteItem(item)"
                  >
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </div>
          </div>
        </div>
          <!-- Dialog ONE ID -->
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

          <!-- BUTTON -->
          <v-col class="text-right mt-5">
            <v-btn dark color="#FF6B81" 
            class="white--text" 
            @click="onClick()"
            >
              {{ buttonText }}</v-btn
            >
          </v-col>
        </v-card>
      </v-col>
    </v-row>

    <!-- DIALOG -->
    <v-dialog class="pa-2" width="50vw" v-model="dialog_show" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="12" align="right">
              <v-btn icon @click="dialog_show = false">
                <v-icon color="#ff6b81">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <dialogCard text="บันทึกข้อมูลสำเร็จ"></dialogCard>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { inputValidation } from "@/functions/functions";
import LabelCustom from "@/components/label/labelCustom.vue";
import headerPage from "@/components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import registerDialogForm from "@/components/user_menage/registerDialogForm.vue";
import dialogCard from "@/components/dialog/dialogCard.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "userMenagePage",
  components: {
    headerPage,
    headerCard,
    registerDialogForm,
    LabelCustom,
    dialogCard,
  },
  data: () => ({
    previewUrl: null,
    inputValue: "",
    username_alert: "",
    dataArray: ["apple", "banana", "orange"],
    isMatch: false,
    isNotMatch: true,
    searchTerm: "",
    username_en: "",
    username_th: "",
    last_name: "",
    fname_en: "",
    lname_en: "",
    email: "",
    phone_num: "",
    dialog_show: false,
    show_dialog: false,
    selectedItem: false,
    sortBy: [],
    privileges: ["admin", "Super admin", "โค้ช", "ผู้ปกครอง"],
    privilege: "",
    roles: [
      { role: "ทั้งหมด", privilege: "Super admin" },
      { role: "นักเรียน", privilege: "" },
      { role: "ผู้ปกครอง", privilege: "ผู้ปกครอง" },
      { role: "โค้ช", privilege: "โค้ช" },
      { role: "บัญชี", privilege: "admin" },
      { role: "Admin", privilege: "admin" },
    ],
    people: [
      { id: 1, name: "John Doe", email: "johndoe@example.com", age: 30 },
      { id: 2, name: "Jane Doe", email: "janedoe@example.com", age: 25 },
      { id: 3, name: "Bob Smith", email: "bobsmith@example.com", age: 40 },
    ],
    headers: [
      { text: "ชื่อ-นามสกุล", value: "name,lastname", sortable: false },
      { text: "ชื่อคอร์ส", value: "lastname", sortable: false },
      { text: "แพ็คเกจ", value: "email", sortable: false },
      { text: "โค้ช", value: "username", sortable: false },
      { text: "ประเภท", value: "oneid", sortable: false },
      { text: "ระยะเวลา", value: "role", sortable: false },
      { text: "วัน - เวลา", value: "actions", sortable: false },
    ],
    period: ["admin", "Super admin", "โค้ช", "ผู้ปกครอง"],
    breadcrumbs: [
      { text: "จัดการผู้ใช้งาน", to: "Manageuser" },
      { text: "เพิ่มผู้ใช้งาน", to: "" },
    ],
    title: "ข้อมูลผู้ใช้งาน",
    title2: "การจัดการสิทธิ์",
    addStudentData: "เพิ่มข้อมูลผู้ใช้นักเรียน",
    rules: {
      name: [
        (val) =>
          (val || "").length > 0 ||
          "ชื่อผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง",
      ],
      username: [
        () =>
          !this.isMatch ? "ชื่อผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง " : "",
      ],
    },

    clickCount: 0,
    selectedbox: false,
    isCardOpen: false,

    students: [
      {
        username: "",
        firstname: "",
        lastname: "",
        tel: "",
      },
    ],
  }),

  created() {},

  mounted() {},
  methods: {
    openFileSelector() {
      this.$refs.fileInput.click();
    },
    uploadFile() {
      this.file = this.$refs.fileInput.files[0];
      if (!this.file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.file);
    },
    checkUsername() {
      return this.isMatch == false
        ? "ชื่อผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง"
        : "";
    },

    checkData() {
      if (this.dataArray.includes(this.username_en || this.students.username)) {
        this.isMatch = true;
        this.isNotMatch = false;
      } else {
        this.isMatch = false;
        this.isNotMatch = true;
        this.username_alert = "ชื่อผู้ใช้ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง ";
        console.log(this.username_alert, "--> false");
      }
    },
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
    }),
    selectRole() {
      this.privilege = this.roles.filter(
        (v) => v.role === this.sortBy[0]
      )[0].privilege;
    },
    validate(e, type) {
      inputValidation(e, type);
    },
    checkPhoneNumber() {
      let x = this.phone_num.replace(/\D/g, "");
      x = x.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      console.log(x);
      this.phone_num = !x[2]
        ? x[1]
        : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    },
    checkPhoneNumberStudent() {
      let x = this.phone_num_student.replace(/\D/g, "");
      x = x.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      console.log(x);
      this.phone_num_student = !x[2]
        ? x[1]
        : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    },
    openDialog() {
      this.dialog_show = true;
    },
    onClick() {
      if (this.clickCount === 0) {
        // Show modal on the first click
        this.dialog_show = true;
        this.clickCount++;
      } else {
        // Navigate to another page on the second click
        this.$router.push({ name: "Finance" });
      }
    },

    onCheckboxChange() {
      if (this.selectedbox) {
        // Checkbox is selected, open the card
        this.isCardOpen = true;
      } else {
        // Checkbox is unselected, close the card
        this.isCardOpen = false;
      }
    },

    addStudents() {
      this.students.push({
        username: "",
        firstname: "",
        lastname: "",
        tel: "",
      });
    },

    removeCardStudent(index) {
      this.students.splice(index, 1);
    },
  },
  computed: {
    ...mapGetters({
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
    }),

    disableSubItems() {
      let disable = false;
      if ((this.sortBy === this.privilege) === "ผู้ปกครอง") {
        disable = true;
      } else {
        disable = false;
      }
      return disable;
    },

    buttonText() {
      return this.clickCount === 0 ? "บันทึก" : "แก้ไข";
    },
    showModal() {
      return this.clickCount === 0;
    },

    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
    },
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
