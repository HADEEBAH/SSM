<template>
  <v-app>
    <v-container>
      <v-row dense>
        <headerPage title="จัดการผู้ใช้งาน">
          <v-card outlined>
            <v-card-text class="pa-2">
              <v-row dense class="d-flex align-center">
                <v-col cols="auto">
                  <v-img
                    src="@/assets/manageuser/image 78.svg"
                    height="37px"
                    width="37px"
                  ></v-img>
                </v-col>
                <v-col cols="auto">
                  <label-custom text="ผู้ใช้งานทั้งหมด"></label-custom>
                </v-col>
                <v-col>
                  <v-avatar size="40" color="#FBF3F5"
                    ><div class="pink--text">5</div></v-avatar
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </headerPage>
      </v-row>

      <!-- search -->
      <v-card flat class="mb-3">
        <v-card-text class="border">
          <v-row class="d-flex align-center">
            <v-col>
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="ค้นหา"
                single-line
                hide-details
                dense
                outlined
              ></v-text-field>
            </v-col>
            <label-custom text="บทบาท"></label-custom>
            <v-col cols="12" sm="3">
              <template v-if="$vuetify.breakpoint.mdAndUp">
                <v-autocomplete
                  dense
                  v-model="sortBy"
                  :items="role"
                  placeholder="ทั้งหมด"
                  outlined
                  hide-details
                  multiple
                  color="pink"
                  item-color="pink"
                >
                  <!-- <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-title> ไม่พบข้อมูล </v-list-item-title>
                        </v-list-item>
                      </template> -->

                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title
                        ><span
                          :class="
                            // check array ว่ามี stringไหม
                            sortBy.includes(item) ? 'font-bold' : ''
                          "
                          >{{ item }}</span
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
              </template>
            </v-col>

            <v-col cols="12" sm="2">
              <v-btn
                color="#FF6B81"
                dark
                @click="$router.push({ name: 'UserCreate' })"
              >
                <v-icon left> mdi-plus </v-icon>
                เพิ่มผู้ใช้
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- table -->
      <template>
        <v-data-table
          :headers="headers"
          :items="datausers"
          :search="search"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          :sort-by="sortBy"
          @page-count="pageCount = $event"
          class="elevation-1 header-table"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small color="#FF6B81" @click="viewUserDetail">
              mdi-eye-outline
            </v-icon>
            <v-icon small class="ml-5" color="#FF6B81" @click="editUserDetail">
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
        <!-- <v-pagination
          class="mt-5 pb-10 page"
          v-model="page"
          color="#FF6B81"
          :length="pageCount"
        ></v-pagination> -->
      </template>
    </v-container>
  </v-app>
</template>


<script>
import headerPage from "@/components/header/headerPage.vue";
import LabelCustom from "@/components/label/labelCustom.vue";
export default {
  name: "manageUsers",
  components: {
    headerPage,
    LabelCustom,
  },
  data() {
    return {
      search: "",
      dialog: false,
      dialogDelete: false,
      page: 1,
      itemsPerPage: 10,
      pageCount: 0,
      filter: {},
      sortBy: ["ทั้งหมด"],
      role: ["ทั้งหมด", "นักเรียน", "ผู้ปกครอง", "โค้ช", "บัญชี", "Admin"],
      user_data: {
        users: "",
      },
      headers: [
        { text: "ชื่อ", value: "name", sortable: false },
        { text: "นามสกุล", value: "lastname", sortable: false },
        { text: "อีเมล", value: "email", sortable: false },
        { text: "ผู้ใช้", value: "username", sortable: false },
        { text: "One ID", value: "oneid", sortable: false },
        { text: "บทบาท", value: "role", sortable: false },
        { text: "", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        number: "",
        lastname: "",
        email: "",
        username: "",
        oneid: "",
        role: "",
      },
      defaultItem: {
        number: "",
        lastname: "",
        email: "",
        username: "",
        oneid: "",
        role: "",
      },
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Edit" : "Edit";
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.datausers = [
        {
          number: 1,
          name: "arm",
          lastname: "arm",
          email: "arm",
          username: "arm",
          oneid: "arm",
          role: "Admin",
        },
        {
          number: 2,
          name: "mie",
          lastname: "mie",
          email: "mie",
          username: "mie",
          oneid: "mie",
          role: "นักเรียน",
        },
        {
          number: 3,
          name: "racha",
          lastname: "kolo",
          email: "aaaa",
          username: "armmie",
          oneid: "3310",
          role: "โค้ช",
        },
        {
          number: 4,
          name: "robert",
          lastname: "gogo",
          email: "vbbbbb",
          username: "nuunam",
          oneid: "mie",
          role: "นักเรียน",
        },
        {
          number: 5,
          name: "koko",
          lastname: "arrr",
          email: "dodm@hotmail.com",
          username: "summer",
          oneid: "hukio",
          role: "บัญชี",
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.datausers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.datausers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.datausers.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.datausers[this.editedIndex], this.editedItem);
      } else {
        this.datausers.push(this.editedItem);
      }
      this.close();
    },

    viewUserDetail() {
      this.$router.push({ name: "UserDetail",params:{action: "view", account_id: "0001"} });
    },
    editUserDetail() {
      this.$router.push({ name: "UserDetail",params:{action: "edit", account_id: "0001"} });
    },
  },
};
</script>
<!-- <style scoped>
.card-user {
  width: 222px;
  height: 58px;
  border-radius: 8px;
}

.btn-user {
  position: absolute;
  left: 80%;
}
.page {
  position: absolute;
  left: 80%;
}

.alluser {
  position: absolute;
  bottom: 25%;
  left: 25%;
}
::v-deep .v-data-table-header {
  background-color: #fce0e7;
}
</style> -->
