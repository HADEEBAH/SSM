<template>
  <v-app>
    <v-container>
      <v-row dense>
        <headerPage title="จัดการผู้ใช้งาน"></headerPage>
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
                  ><div class="pink--text">
                    {{ user_list.length }}
                    <!-- {{ itemsPerPage !== 0 ? itemsPerPage : user_list.length }} -->
                  </div></v-avatar
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-row>
      <!-- search -->
      <v-card flat class="my-5">
        <v-card-text class="border">
          <v-row class="d-flex align-center">
            <v-col>
              <v-text-field
                dense
                outlined
                label="ค้นหา"
                color="pink"
                hide-details
                v-model="search"
                @input="search_data(search)"
                prepend-inner-icon="mdi-magnify"
              ></v-text-field>
            </v-col>
            <label-custom v-if="!MobileSize" text="บทบาท"></label-custom>
            <v-col cols="12" sm="3">
              <label-custom v-if="MobileSize" text="บทบาท"></label-custom>
              <template>
                <!-- <v-autocomplete
                  dense
                  :items="roles"
                  item-text="role"
                  item-value="roleNumber"
                  @input="search_Role(searchQuery)"
                  v-model="searchQuery"
                  placeholder="ทั้งหมด"
                  outlined
                  hide-details
                  color="pink"
                  item-color="pink"
                >
                </v-autocomplete> -->
                <v-autocomplete
                  v-model="searchQuery"
                  :items="roles"
                  item-text="role"
                  item-value="roleNumber"
                  placeholder="ทั้งหมด"
                  @input="FilterGetUserList(searchQuery)"
                  outlined
                  dense
                  multiple
                  hide-details
                  color="pink"
                  item-color="pink"
                >
                  <template v-slot:prepend-item>
                    <v-list-item
                      ripple
                      @mousedown.prevent
                      @click="selectedAll()"
                    >
                      <v-list-item-action>
                        <v-icon
                          :color="
                            searchQuery.length > 0 ? 'indigo darken-4' : ''
                          "
                        >
                          {{ icon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title> Select All </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>

                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                      <span>{{ item.role }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ searchQuery.length - 1 }} others)
                    </span>
                  </template>
                </v-autocomplete>
              </template>
            </v-col>

            <!-- เพิ่มผู้ใช้ -->
            <v-col cols="12" sm="2">
              <v-btn
                block
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
      <!-- table selectedRole == null -->
      <div>
        <!-- :loading="filter_role_is_loading"-->
        <!-- :items="selectedRole == null ? user_list : filter_role" -->
        <template>
          <v-data-table
            :headers="headers"
            :items="user_list"
            :search="search"
            :selectedRole="selectedRole"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :page-count="pageCount"
            loading-text="Loading... Please wait"
            :loading="user_list.length < 0"
            class="elevation-1 header-table"
          >
            <template v-slot:[`item.count`]="{ item }">
              {{ item.index }}
            </template>

            <template v-slot:[`item.roles`]="{ item }">
              {{ item.roleNameTh }}
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                small
                color="#FF6B81"
                @click="
                  $router.push({
                    name: 'UserDetail',
                    params: {
                      action: 'view',
                      account_id: item.accountId
                        ? item.accountId
                        : item.userOneId,
                    },
                  })
                "
              >
                mdi-eye-outline
              </v-icon>
              <v-icon
                small
                class="ml-5"
                color="#FF6B81"
                @click="
                  $router.push({
                    name: 'UserDetail',
                    params: {
                      action: 'edit',
                      account_id: item.accountId
                        ? item.accountId
                        : item.userOneId,
                    },
                  })
                "
              >
                mdi-pencil
              </v-icon>
              <v-icon
                class="ml-5"
                small
                color="#FF6B81"
                @click="
                  deleteAccount(
                    item.accountId ? item.accountId : item.userOneId
                  )
                "
              >
                mdi-delete
              </v-icon>
            </template>

            <template v-slot:[`no-results`]>
              <div class="font-bold">ไม่พบข้อมูลในตาราง</div>
            </template>

            <!-- </div> -->
          </v-data-table>
        </template>
      </div>

      <!-- :loading="LoadingTable"  -->

      <!-- <v-data-table
      
        class="elevation-1 header-table"
        :headers="headers"
        :items="user_list"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn text color="#FF6B81" @click="$router.push({name:'EditKingdom', params:{category_id : item.categoryId}})">
            <v-icon>mdi-text-box-search-outline</v-icon>
            ดูรายละเอียด
          </v-btn>
        </template>
      </v-data-table> -->
    </v-container>
  </v-app>
</template>


<script>
import headerPage from "@/components/header/headerPage.vue";
import LabelCustom from "@/components/label/labelCustom.vue";
import { mapActions, mapGetters } from "vuex";
import Swal from "sweetalert2";
import axios from "axios";
import VueCookie from "vue-cookie";

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
      filter_role_is_loading: true,
      page: 1,
      itemsPerPage: 10,
      pageCount: 0,
      filter: {},
      searchQuery: [],
      selectedRole: null, // Selected role from the autocomplete

      roles: [
        { role: "Super Admin", privilege: "superAdmin", roleNumber: "R_1" },
        { role: "Admin", privilege: "admin", roleNumber: "R_2" },
        { role: "โค้ช", privilege: "โค้ช", roleNumber: "R_3" },
        { role: "ผู้ปกครอง", privilege: "ผู้ปกครอง", roleNumber: "R_4" },
        { role: "นักเรียน", privilege: "นักเรียน", roleNumber: "R_5" },
      ],
      // roles: ["R_1", "R_2", "R_3", "R_4", "R_5"],
      user_data: {
        users: "",
      },
      headers: [
        { text: "ลำดับ", value: "count", sortable: false, align: "start" },
        { text: "ชื่อ", value: "firstNameTh", sortable: false, align: "start" },
        {
          text: "นามสกุล",
          value: "lastNameTh",
          sortable: false,
          align: "start",
        },
        { text: "อีเมล", value: "email", sortable: false, align: "start" },
        { text: "ผู้ใช้", value: "userName", sortable: false, align: "start" },
        // { text: "One ID", value: "oneid", sortable: false },
        { text: "บทบาท", value: "roles", sortable: false },
        { text: "จัดการ", value: "actions", sortable: false, align: "start" },
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
      selected_all_bool: false,
      query_roles: "",
      user_lists: [],
      selectedFruits: [],
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    // this.GetUserList()
    this.$store.dispatch("UserModules/GetUserList");
    this.local_data = JSON.parse(localStorage.getItem("userDetail"));

    // this.GetShowById(this.local_data.account_id);
  },
  created() {
    this.GetUserList();
    // this.initialize();
  },

  methods: {
    ...mapActions({
      GetUserList: "UserModules/GetUserList",
      GetShowById: "UserModules/GetShowById",
      FilterGetUserList: "UserModules/FilterGetUserList",
    }),

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

    async search_data(name) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // setTimeout(() => {

        // }, 1000);
        await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/usermanagement/search?name=${name}`,
          config
        );
      } catch (error) {
        // // console.log("err", error);
      }
    },

    async search_Role(role) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        // // console.log("role-role", role);
        await axios.get(
          // `http://localhost:3000/api/v1/getrole/query?roleId=${role}&roleId=${role}`,
          `${process.env.VUE_APP_URL}/api/v1/usermanagement/search?role=${role}`,
          config
        );
      } catch (error) {
        // // console.log("err", error);
      }
    },
    async deleteAccount(account_id) {
      // // console.log("accountId", account_id);
      Swal.fire({
        icon: "question",
        title: "คุณต้องลบข้อมูลหรือไม่",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let config = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "Application/json",
                Authorization: `Bearer ${VueCookie.get("token")}`,
              },
            };

            let { data } = await axios.delete(
              `${process.env.VUE_APP_URL}/api/v1/usermanagement/${account_id}`,
              config
            );
            // console.log(data);
            if (data.statusCode === 200) {
              if (typeof data.data === "string") {
                throw { message: data };
              } else {
                Swal.fire({
                  icon: "success",
                  title: "ลบข้อมูลสำเร็จ",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    this.$store.dispatch("UserModules/GetUserList");
                  }
                });
              }
            } else {
              throw { message: data.message };
            }
          } catch (error) {
            // // console.log(error);
            Swal.fire({
              icon: "error",
              title: "ลบข้อมูลไม่สำเร็จ",
            });
          }
        } else {
          Swal.fire("ข้อมูลของคุณจะไม่บันทึก", "", "info");
        }
      });
    },
    async selectedAll() {
      // this.$nextTick(() => {
      //     if (this.likesAllFruit) {
      //       this.selectedFruits = []
      //     } else {
      //       this.selectedFruits = this.fruits.slice()
      //     }
      //   })
      let search_arr = [];
      this.selected_all_bool = !this.selected_all_bool;
      if (this.selected_all_bool) {
        this.searchQuery = this.roles.slice();
      } else {
        this.searchQuery = [];
      }
      for await (let item of this.searchQuery) {
        search_arr.push(item.roleNumber);
        // // console.log("ITEM", item);
      }
      // // console.log("searchQuery", params);
      this.FilterGetUserList(
        search_arr.length > 0 ? search_arr : this.searchQuery
      );
    },
    async selectedRoles(role) {
      // // console.log("objectROLE", role);
      this.query_roles = "";
      role.map((val) => {
        this.query_roles += `roleId=${val}&`;
      });
      // // console.log("options_temp", this.query_roles);
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let { data } = await axios.get(
          // `http://localhost:3000/api/v1/getrole/filter?${this.query_roles}`,
          `${process.env.VUE_APP_URL}/api/v1/usermanagement/search?role=${role}`,
          config
        );
        this.user_lists = data.data;
        // if (data.data.length > 0) {
        // } else {
        // }
        // // console.log("data=>", data);
      } catch (error) {
        // // console.log("err", error);
      }
    },
  },

  computed: {
    ...mapGetters({
      user_list: "UserModules/getUserList",
      show_by_id: "UserModules/getShowById",
      filter_role: "UserModules/getfilterGetUserList",
    }),
    // filterUserList() {
    //   if (this.searchQuery.length > 0) {
    //     // // console.log(
    //       this.searchQuery.includes(this.user_list[0].userRoles[0].roleId)
    //     );
    //     // // console.log(
    //       this.user_list.filter((v) => {
    //         this.searchQuery.includes(v.userRoles[0].roleId);
    //       })
    //     );
    //     return this.user_list.filter((v) => {
    //       // // console.log(v.userRoles[0].roleId);
    //       this.searchQuery.includes(v.userRoles[0].roleId);
    //     });
    //   } else {
    //     return this.user_list;
    //   }
    // },
    formTitle() {
      return this.editedIndex === -1 ? "Edit" : "Edit";
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },

    icon() {
      if (this.selected_all_bool) return "mdi-close-box";
      if (
        !this.selected_all_bool ||
        this.searchQuery.length < this.roles.length
      )
        return "mdi-checkbox-blank-outline";
      return "mdi-checkbox-blank-outline";
    },

    // likesAllFruit() {
    //   return this.selectedFruits.length === this.user_list.length;
    // },
    // likesSomeFruit() {
    //   return this.selectedFruits.length > 0 && !this.likesAllFruit;
    // },
    // icon() {
    //   if (this.likesAllFruit) return "mdi-close-box";
    //   if (this.likesSomeFruit) return "mdi-minus-box";
    //   return "mdi-checkbox-blank-outline";
    // },
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
