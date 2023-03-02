<template>
  <v-container class="overflow-x-hidden overflow-y-hidden">
    <div v-if="$route.params.action == 'view'">
      <v-row dense>
        <!-- {{ $route.params.action }} {{ $route.params.account_id }} -->
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
                  <v-col>
                    <label-custom text="Username(English)"></label-custom>
                    <div v-if="!isEnabled">
                      {{ user_data.username_en }}
                      <v-icon class="ml-5">mdi-check</v-icon>
                    </div>
                    <div v-else>
                      <v-text-field
                        v-bind:disabled="isDisabled"
                        placeholder="กรุณาระบุชื่อผู้ใช้งาน(ภาษาอังกฤษ)"
                        @keypress="validate($event, 'en')"
                        v-model="user_data.username_en"
                        hide-details
                        outlined
                        dense
                        @keyup.enter="checkData"
                        :color="isMatch ? 'pink' : 'blue'"
                      >
                        <template #append>
                          <v-icon v-if="isMatch">mdi-check</v-icon>
                        </template>
                      </v-text-field>
                    </div>
                  </v-col>

                  <v-col sm="auto">
                    <v-img
                      class="img-one mb-2"
                      align="center"
                      src="@/assets/manageuser/logo_one platform.svg"
                  /></v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card class="mt-10 ml-10 mr-10" color="#FCFCFC">
              <v-card-text class="mt-3">
                <v-row>
                  <v-col cols="12" sm="3">
                    <v-card class="rounded-circle border-1">
                      <div
                        class="upload-photo rounded-circle border-4"
                        color="#FF6B81"
                      >
                        <v-card-text class="upload-photo pa-3">
                          <img
                            :src="user_data.previewUrl"
                            class="rounded-full"
                            style="height: 150px; width: 200px"
                          />
                        </v-card-text>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col class="ml-5">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <label-custom text="ชื่อ (ภาษาไทย)"></label-custom>
                        <!-- <v-text-field
                          v-bind:disabled="isDisabled"
                          @keypress="validate($event, 'th')"
                          placeholder=""
                          v-model="user_data.fname_th"
                          outlined
                          dense
                        >
                        </v-text-field> -->
                        <div>{{ user_data.fname_th }}</div>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <label-custom text="นามสกุล (ภาษาไทย)"></label-custom>
                        <div>{{ user_data.lname_th }}</div>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="6">
                        <label-custom
                          text="First Name (English)"
                        ></label-custom>
                        <div>{{ user_data.fname_en }}</div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom text="Last Name (English)"></label-custom>

                        <div>{{ user_data.lname_en }}</div>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="6">
                        <label-custom text="อีเมล"></label-custom>
                        <div>{{ user_data.email }}</div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <label-custom text="เบอร์โทรศัพท์"></label-custom>
                        <div>{{ user_data.phone_num }}</div>
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
                  <v-col cols="12" sm="6">
                    <label-custom text="บทบาทผู้ใช้งาน"></label-custom>
                    <div>{{ user_data.privilege }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- check box -->
            <v-row>
              <v-col
                cols="12"
                sm="6"
                class="ml-10"
                v-if="user_data.privilege.includes('ผู้ปกครอง')"
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

            <v-row>
              <v-col
                cols="12"
                sm="6"
                class="ml-10"
                v-if="user_data.privilege.includes('นักเรียน')"
              >
                <v-checkbox
                  v-model="selectedbox"
                  label="ต้องการเพิ่มผู้ปกครอง"
                  value="parent"
                  color="pink"
                  item-color="pink"
                  @change="onCheckboxChangeParent"
                ></v-checkbox>
              </v-col>
            </v-row>

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
                  <!-- Student Data -->
                  <v-row dense align="center">
                    <v-col cols="12" sm="6">
                      <label-custom
                        text="Student’s Username (English)"
                      ></label-custom>
                      <div>{{ students.username }}</div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <label-custom text="First Name (English)"></label-custom>
                      <div>
                        {{ students.firstname }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <label-custom text="Last Name (English)"></label-custom>
                      <div>{{ students.lastname }}</div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <label-custom text="เบอร์โทรศัพท์"></label-custom>
                      <div>{{ students.tel }}</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <!-- TABLE -->
              <!-- :items="datausers"
                  :search="search"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  :sort-by="user_data.sortBy" -->
              <div class="my-5 mx-10">
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

            <!-- Card Add Parent -->
            <div v-if="isCardParentOpen">
              <headerCard
                class="ml-6 mt-8"
                :icon="'mdi-file-plus-outline'"
                :icon_color="'#FF6B81'"
                :title="addParentData"
              ></headerCard>
              <v-divider class="mx-10"></v-divider>
              <v-card class="mt-10 ml-10 mr-10" color="#FCFCFC">
                <v-card-text class="mt-3">
                  <v-row dense align="center">
                    <v-col cols="12" sm="6">
                      <label-custom
                        text="Parent’s Username (English)"
                      ></label-custom>
                      <div>{{ parents.username }}</div>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <label-custom text="First Name (English)"></label-custom>
                      <div>{{ parents.firstname }}</div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <label-custom text="Last Name (English)"></label-custom>
                      <div>{{ parents.lastname }}</div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <label-custom text="เบอร์โทรศัพท์"></label-custom>
                      <div>{{ parents.tel }}</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <v-row>
              <v-col class="text-right mt-5 mr-10"  v-if="!isEnabled">
                <v-btn
                  class="white--text mb-5"
                  depressed
                  color="#ff6b81"
                  @click="edit()"
                >
                
                  <span class="mdi mdi-pencil-outline">แก้ไข</span>
                </v-btn>
                 
              </v-col >

              
              <v-col class="text-right mt-5 mr-10" v-else>

                <v-btn
                  class="white--text mb-5"
                  depressed
                  color="error"
                  @click="cancel()"
                >
                  ยกเลิก
                </v-btn>

                <v-btn
                  class="white--text mb-5"
                  depressed
                  color="#ff6b81"
                  @click="submit()"
                >
                  บันทึก
                </v-btn>

             

              </v-col>

           

            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-else>
      <userManageForm></userManageForm>
    </div>
  </v-container>
</template>

<script>
import LabelCustom from "@/components/label/labelCustom.vue";
import headerPage from "@/components/header/headerPage.vue";
import headerCard from "@/components/header/headerCard.vue";
import userManageForm from "@/components/user_menage/userManageForm.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    headerPage,
    headerCard,
    userManageForm,
    LabelCustom,
  },
  data: () => ({
    breadcrumbs: [
      { text: "จัดการผู้ใช้งาน", to: "UserList" },
      { text: "เพิ่มผู้ใช้งาน", to: "" },
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

    title: "ข้อมูลผู้ใช้งาน",
    title2: "การจัดการสิทธิ์",
    addStudentData: "เพิ่มข้อมูลผู้ใช้นักเรียน",
    addParentData: "เพิ่มข้อมูลผู้ใช้ของผู้ปกครอง",
    selectRoles: [],
    isDisabled: false,
    isEnabled: false,
    previewUrl: null,
    selectedbox: false,
    isCardOpen: false,
    selectedboxParent: false,
    isCardParentOpen: false,
  }),
  created() {},
  mounted() {
    if (this.selectedbox == this.user_data.privilege.includes("นักเรียน")) {
      console.log("นักเรียน");
      this.isCardOpen = true;
    } else if (
      this.selectedbox == this.user_data.privilege.includes("ผู้ปกครอง")
    ) {
      console.log("ผู้ปกครอง");
      this.isCardParentOpen = true;
    } else {
      console.log("outt");
    }
  },
  methods: {
    ...mapActions({
      changeDialogRegisterOneId: "RegisterModules/changeDialogRegisterOneId",
      changeStudentsData: "UserManageModules/changeStudentsData",
      changeUserData: "UserManageModules/changeUserData",
      changeParentData: "UserManageModules/changeParentData",
    }),

    openFileSelector() {
      this.$refs.fileInput.click();
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

    onCheckboxChangeParent() {
      if (this.selectedboxParent) {
        // Checkbox is selected, open the card
        this.isCardParentOpen = true;
      } else {
        // Checkbox is unselected, close the card
        this.isCardParentOpen = false;
      }
    },
    edit() {
      this.isDisabled = false;
      this.isEnabled = true;
      this.buttonName = "บันทึก"
    },
  },
  computed: {
    ...mapGetters({
      show_dialog_register_one_id: "RegisterModules/getShowDialogRegisterOneId",
      students: "UserManageModules/getStudent",
      user_data: "UserManageModules/getUserData",
      parents: "UserManageModules/getParent",
    }),
  },
  watch: {},
};
</script>

<style scoped>
.upload-photo {
  border-color: #ff6b81;
}
</style>