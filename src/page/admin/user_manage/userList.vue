<template>
  <v-app>
    <loading-overlay :loading="filter_role_is_loading"> </loading-overlay>

    <v-container>
      <v-row dense>
        <headerPage :title="$t('add accounts')"></headerPage>
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
                <label-custom :text="$t('all users')"></label-custom>
              </v-col>
              <v-col>
                <v-avatar size="40" color="#FBF3F5"
                  ><div class="pink--text">
                    {{ user_list.amount }}
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
              <!-- @input="search_data(search)" -->

              <v-text-field
                dense
                outlined
                :label="$t('search')"
                color="pink"
                hide-details
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                @input="search_data()"
              ></v-text-field>
            </v-col>
            <label-custom v-if="!MobileSize" :text="$t('role')"></label-custom>
            <v-col cols="12" sm="3">
              <label-custom v-if="MobileSize" :text="$t('role')"></label-custom>
              <!-- @input="FilterGetUserList(searchQuery)" -->

              <template>
                <v-autocomplete
                  v-model="searchQuery"
                  :items="roles"
                  item-text="role"
                  item-value="roleNumber"
                  :placeholder="$t('all')"
                  @change="search_data()"
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
                        <v-icon :color="searchQuery.length > 0 ? 'pink' : ''">
                          {{ icon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ $t("select all") }}
                        </v-list-item-title>
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
                {{ $t("add user") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <div>
        <template>
          <v-data-table
            :headers="headers"
            :items="user_list.data"
            :search="search"
            :selectedRole="selectedRole"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :page-count="pageCount"
            loading-text="Loading... Please wait"
            :loading="filter_role_is_loading"
            class="elevation-1 header-table"
            :options.sync="options"
            :server-items-length="user_list.amount"
            ref="userList"
            :footer-props="{
              'disable-pagination': disable_pagination_btn,
              'items-per-page-options': [10, 20, 30, 40, 50],
              'items-per-page-text': 'Rows per page:',
            }"
          >
            <template v-slot:[`item.count`]="{ item }">
              {{ item.number }}
            </template>

            <template v-slot:[`item.roles`]="{ item }">
              <div v-for="(items, ind_itm) in item.userRoles" :key="ind_itm">
                {{
                  $i18n.locale == "th" ? items.roleNameTh : items.roleNameEng
                }}
              </div>
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
                      from: 'userList',
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
                      from: 'userList',
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
                search
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
              <div class="font-bold">
                {{ $t("no data found in table") }}
              </div>
            </template>

            <template v-slot:no-data>
              <div class="font-bold">
                {{ $t("no data found in table") }}
              </div>
            </template>
          </v-data-table>
        </template>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import LabelCustom from "@/components/label/labelCustom.vue";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import { mapActions, mapGetters } from "vuex";
import Swal from "sweetalert2";
import axios from "axios";
import VueCookie from "vue-cookie";

export default {
  name: "manageUsers",
  components: {
    headerPage,
    LabelCustom,
    loadingOverlay,
  },
  data() {
    return {
      totalDesserts: 0,
      desserts: [],
      loading: true,
      options: {},
      startIndex: 0,
      endIndex: 0,
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

      user_data: {
        users: "",
      },

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
      tabs_change: false,
      disable_pagination_btn: false,
      select_roles: false,
      select_temp: "",
      filtered_datas: false,
      search_data_filter: "",
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    options: {
      handler() {
        this.loadItems();
      },
      deep: true,
    },
  },

  mounted() {},

  computed: {
    ...mapGetters({
      user_list: "UserModules/getUserList",
      show_by_id: "UserModules/getShowById",
      filter_role: "UserModules/getfilterGetUserList",
      filtered_data: "UserModules/getFilteredData",
    }),
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
      if (this.searchQuery.length === 5) return "mdi-close-box";
      if (
        !this.selected_all_bool ||
        this.searchQuery.length < this.roles.length
      )
        return "mdi-checkbox-blank-outline";
      return "mdi-checkbox-blank-outline";
    },
    roles() {
      return [
        {
          role: this.$t("super admin"),
          roleNumber: "R_1",
        },
        { role: this.$t("admin"), roleNumber: "R_2" },
        { role: this.$t("coach"), roleNumber: "R_3" },
        { role: this.$t("parent"), roleNumber: "R_4" },
        { role: this.$t("student"), roleNumber: "R_5" },
      ];
    },
    headers() {
      return [
        {
          text: this.$t("no."),
          value: "count",
          sortable: false,
          align: "start",
        },
        {
          text: this.$t("first name"),
          // value: "firstNameTh",
          value: this.$i18n.locale == "th" ? "firstNameTh" : "firstNameEn",
          sortable: false,
          align: "start",
        },
        {
          text: this.$t("last name"),
          // value: "lastNameEN",
          value: this.$i18n.locale == "th" ? "lastNameTh" : "lastNameEN",
          sortable: false,
          align: "start",
        },
        {
          text: this.$t("email"),
          value: "email",
          sortable: false,
          align: "start",
        },
        {
          text: this.$t("user"),
          value: "userName",
          sortable: false,
          align: "start",
        },
        { text: this.$t("role"), value: "roles", sortable: false },
        {
          text: this.$t("manage"),
          value: "actions",
          sortable: false,
          align: "start",
        },
      ];
    },
  },

  methods: {
    ...mapActions({
      GetUserList: "UserModules/GetUserList",
      GetShowById: "UserModules/GetShowById",
      FilterGetUserList: "UserModules/FilterGetUserList",
      FilteredData: "UserModules/FilteredData",
    }),

    async search_data() {
      this.selected_all_bool = false;
      if (this.select_temp !== this.searchQuery) {
        this.select_roles = true;
      }
      if (this.search_data_filter !== this.search) {
        this.filtered_datas = true;
      }
      if (this.select_roles) {
        this.$refs.userList.$props.options.page = 1;
        this.$refs.userList.$props.options.itemsPerPage = 10;
      }
      this.filter_role_is_loading = true;
      await this.loadItems(this.search, this.searchQuery);
      this.filter_role_is_loading = false;
    },

    async selectedAll() {
      let search_arr = [];

      this.selected_all_bool = !this.selected_all_bool;
      if (this.selected_all_bool) {
        this.searchQuery = this.roles.slice();
      } else {
        this.searchQuery = [];
      }
      for await (let item of this.searchQuery) {
        search_arr.push(item.roleNumber);
      }
      this.FilteredData({
        name: this.search ? this.search : "",
        role: search_arr,
        limit: this.itemsPerPage,
        page: 1,
      });
      // this.FilterGetUserList(
      //   search_arr.length > 0 ? search_arr : this.searchQuery
      // );
    },

    async loadItems() {
      if (this.select_temp !== this.searchQuery) {
        this.select_roles = true;
      }
      this.select_temp = this.searchQuery;

      if (this.search_data_filter !== this.search) {
        this.filtered_datas = true;
      }
      this.search_data_filter = this.search;

      this.filter_role_is_loading = true;
      await this.moreData();
      this.filter_role_is_loading = false;
    },

    async moreData() {
      let { page, itemsPerPage } = this.options;
      let search_arr = [];
      this.disable_pagination_btn = true;
      this.user_list.data = [];

      if (this.selected_all_bool) {
        this.searchQuery = this.roles.slice();
        for await (let item of this.searchQuery) {
          search_arr.push(item.roleNumber);
        }
        this.searchQuery = search_arr;
      }

      this.FilteredData({
        name: this.search,
        role: this.searchQuery,
        limit: this.select_roles ? 10 : itemsPerPage,
        page: page,
      });

      if (this.filtered_datas) {
        this.$refs.userList.$props.options.page = 1;
        this.$refs.userList.$props.options.itemsPerPage = 10;
      }

      this.disable_pagination_btn = false;
      this.select_roles = false;
      this.filtered_datas = false;
      this.filter_role_is_loading = false;
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

    async search_Role(role) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/usermanagement/search?role=${role}`,
          config
        );
      } catch (error) {
        console.log("err", error);
      }
    },
    async deleteAccount(account_id) {
      Swal.fire({
        icon: "question",
        title: this.$t("do you need to delete the data?"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("no"),
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
            if (data.statusCode === 200) {
              if (typeof data.data === "string") {
                throw { message: data };
              } else {
                // this.$store.dispatch("UserModules/GetUserList");
                Swal.fire({
                  icon: "success",
                  title: this.$t("succeed"),
                  text: this.$t("data has been successfully deleted"),
                  timer: 3000,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: false,
                });
              }
              let { page, itemsPerPage } = this.options;
              let search_arr = [];
              this.disable_pagination_btn = true;
              this.user_list.data = [];

              if (this.selected_all_bool) {
                this.searchQuery = this.roles.slice();
                for await (let item of this.searchQuery) {
                  search_arr.push(item.roleNumber);
                }
                this.searchQuery = search_arr;
              }

              this.FilteredData({
                name: this.search,
                role: this.searchQuery,
                limit: this.select_roles ? 10 : itemsPerPage,
                page: page,
              });
            } else {
              throw { message: data.message };
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: this.$t("warning"),
              text: this.$t("failed to delete data"),
              timer: 3000,
              timerProgressBar: true,
              showCancelButton: false,
              showConfirmButton: false,
            });
          }
        } else {
          Swal.fire({
            icon: "info",
            title: this.$t("cancel"),
            text: this.$t("your data will not be saved"),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      });
    },

    async selectedRoles(role) {
      this.query_roles = "";
      role.map((val) => {
        this.query_roles += `roleId=${val}&`;
      });
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        let { data } = await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/usermanagement/search?role=${role}`,
          config
        );
        this.user_lists = data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
