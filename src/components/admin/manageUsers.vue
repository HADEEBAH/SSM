<template>
  <v-app>
    <v-container>
      <headerPage title="จัดการผู้ใช้งาน"></headerPage>
      <childHeader title="ผู้ใช้งานทั้งหมด"></childHeader>
      <v-divider></v-divider>
      <v-col cols="12" sm="8">
        <v-row class="mt-5" cols="12" md="8">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="ค้นหา"
            single-line
            hide-details
            dense
            outlined
          ></v-text-field>
          <label class="ml-10 mt-2">บทบาท :</label>
          <label class="ml-20 mt-2">ทั้งหมด</label>
          <v-btn class="btn-user" to="/user/menage" fab dark color="success">
            <v-icon dark> mdi-plus </v-icon>
          </v-btn>
        </v-row>
      </v-col>
      <template>
        <v-data-table
          :headers="headers"
          :items="datausers"
          :search="search"
          class="elevation-1 mt-10"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.number"
                            label="ลำดับ"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.name"
                            label="ชื่อ"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.lastname"
                            label="นามสกุล"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.email"
                            label="อีเมล"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.username"
                            label="ชื่อผู้ใช้"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.oneid"
                            label="ONEID"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.role"
                            label="บทบาท"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this user?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>
        </v-data-table>
      </template>
    </v-container>
  </v-app>
</template>
<script>
import headerPage from "@/components/header/headerPage.vue";
import childHeader from "@/components/header/childHeader.vue";
export default {
  name: "manageUsers",
  components: {
    headerPage,
    childHeader,
  },
  data() {
    return {
      search: "",
      dialog: false,
      dialogDelete: false,
      filter: {},
      sortBy: "role",
      headers: [
        {
          text: "ลำดับ",
          align: "center",
          value: "number",
          sortable: false,
        },
        { text: "ชื่อ", value: "name" },
        { text: "นามสกุล", value: "lastname" },
        { text: "อีเมล", value: "email" },
        { text: "ชื่อผู้ใช้งาน", value: "username" },
        { text: "ONEID", value: "oneid" },
        { text: "บทบาท", value: "role" },
        { text: "Actions", value: "actions", sortable: false },
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
      return this.keys.filter((key) => key !== "Role");
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
  },
};
</script>
<style scoped>
.btn-user {
    position: absolute;
  left: 94%;
}
</style>