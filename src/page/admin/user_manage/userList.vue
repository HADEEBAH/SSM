<template>
  <v-app>
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
                    {{ user_list.length }}
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
                :label="$t('search')"
                color="pink"
                hide-details
                v-model="search"
                @input="search_data(search)"
                prepend-inner-icon="mdi-magnify"
              ></v-text-field>
            </v-col>
            <label-custom v-if="!MobileSize" :text="$t('role')"></label-custom>
            <v-col cols="12" sm="3">
              <label-custom v-if="MobileSize" :text="$t('role')"></label-custom>
              <template>
                <v-autocomplete
                  v-model="searchQuery"
                  :items="roles"
                  item-text="role"
                  item-value="roleNumber"
                  :placeholder="$t('all')"
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
      <!-- <div>
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
            :server-items-length="user_list.amount"
            @update:options="loadItems"
          >
            <template v-slot:[`item.count`]="{ item }">
              {{ item.index }}
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
              <div class="font-bold">{{ $t("no data found in table") }}</div>
            </template>
          </v-data-table>
        </template>
      </div> -->

      <div>
        <template>
          <v-data-table
            :headers="headers"
            :items="data_table.data"
            :search="search"
            :selectedRole="selectedRole"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :page-count="pageCount"
            disable-pagination
            loading-text="Loading... Please wait"
            :loading="loading"
            class="elevation-1 header-table"
            :server-items-length="data_table.amount"
            @update:options="loadItems"
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
              <div class="font-bold">{{ $t("no data found in table") }}</div>
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
      data_table: {
        amount: 100,
        data: [
          {
            accountId: "1335419642465165",
            email: "jirayut.ch@thai.com",
            firstNameTh: "จิรายุทธ",
            lastNameTh: "ช่างเรือ",
            firstNameEn: "JIRAYUT",
            lastNameEN: "CHANGRUAE",
            userName: "yuthyuth",
            tel: "0622545944",
            number: 1,
            userRoles: [
              {
                accountId: "1335419642465165",
                roleId: "R_1",
                roleNameTh: "ผู้ดูแลระบบสูงสุด",
                roleNameEng: "Super admin",
              },
            ],
          },
          {
            accountId: "169467498031104",
            email: "laz.on@thai.com",
            firstNameTh: "ลาส",
            lastNameTh: "วัน",
            firstNameEn: "Laz",
            lastNameEN: "One",
            userName: "Lazzz1",
            tel: "0998908900",
            number: 2,

            userRoles: [
              {
                accountId: "169467498031104",
                roleId: "R_3",
                roleNameTh: "โค้ช",
                roleNameEng: "Coach",
              },
            ],
          },
          {
            accountId: "21713809369680802",
            email: "nane.ad@thai.com",
            firstNameTh: "นานี",
            lastNameTh: "แอดมิน",
            firstNameEn: "nane",
            lastNameEN: "admin",
            userName: "naneadmin01",
            tel: "0124812441",
            number: 3,

            userRoles: [
              {
                accountId: "21713809369680802",
                roleId: "R_1",
                roleNameTh: "ผู้ดูแลระบบสูงสุด",
                roleNameEng: "Super admin",
              },
            ],
          },
          {
            accountId: "86422468556877832",
            email: "coach.di@thai.com",
            firstNameTh: "โค้ช",
            lastNameTh: "ดี๊บ",
            firstNameEn: "coach",
            lastNameEN: "dieb",
            userName: "coachdieb",
            tel: "0985674976",
            number: 4,

            userRoles: [
              {
                accountId: "86422468556877832",
                roleId: "R_3",
                roleNameTh: "โค้ช",
                roleNameEng: "Coach",
              },
            ],
          },
          {
            accountId: "671712608843725",
            email: "testssm.te@thai.com",
            firstNameTh: "ทดสอบ",
            lastNameTh: "ทดสอบ",
            firstNameEn: "testssm",
            lastNameEN: "testssm",
            userName: "testssm99",
            tel: "0999990003",
            number: 5,

            userRoles: [
              {
                accountId: "671712608843725",
                roleId: "R_4",
                roleNameTh: "ผู้ปกครอง",
                roleNameEng: "Parent",
              },
            ],
          },
          {
            accountId: "2716334438435864",
            email: "sutdentthretythree.no@thai.com",
            firstNameTh: "นักเรียนสามสาม",
            lastNameTh: "น๊อต",
            firstNameEn: "sutdentThretythree",
            lastNameEN: "Not",
            userName: "surachet033",
            tel: "0127482194",
            number: 6,

            userRoles: [
              {
                accountId: "2716334438435864",
                roleId: "R_5",
                roleNameTh: "นักเรียน",
                roleNameEng: "Student",
              },
            ],
          },
          {
            accountId: "33954179429355",
            email: "studentthretytwo.no@thai.com",
            firstNameTh: "นักเรียนสามสอง",
            lastNameTh: "น๊อต",
            firstNameEn: "studentThretytwo",
            lastNameEN: "not",
            userName: "surachet032",
            tel: "0127489142",
            number: 7,
            userRoles: [
              {
                accountId: "33954179429355",
                roleId: "R_5",
                roleNameTh: "นักเรียน",
                roleNameEng: "Student",
              },
            ],
          },
          {
            accountId: "337552592218227",
            email: "hadeebah@thai.com",
            firstNameTh: "ดี๊บ",
            lastNameTh: "งับ",
            firstNameEn: "doop",
            lastNameEN: "dieb",
            userName: "hadeebah",
            tel: "0972341670",
            number: 8,
            userRoles: [
              {
                accountId: "337552592218227",
                roleId: "R_5",
                roleNameTh: "นักเรียน",
                roleNameEng: "Student",
              },
            ],
          },
          {
            accountId: "169639185091556",
            email: "not.ad@thai.com",
            firstNameTh: "น๊อต",
            lastNameTh: "แอทมิน",
            firstNameEn: "not",
            lastNameEN: "admin",
            userName: "surachetadmin01",
            tel: "0127481242",
            number: 9,
            userRoles: [
              {
                accountId: "169639185091556",
                roleId: "R_1",
                roleNameTh: "ผู้ดูแลระบบสูงสุด",
                roleNameEng: "Super admin",
              },
            ],
          },
          {
            accountId: "21650734425639024",
            email: "student.pa@thai.com",
            firstNameTh: "ผปค",
            lastNameTh: "นร",
            firstNameEn: "student",
            lastNameEN: "parent",
            userName: "studentpar",
            tel: "0548157825",
            number: 10,
            userRoles: [
              {
                accountId: "21650734425639024",
                roleId: "R_4",
                roleNameTh: "ผู้ปกครอง",
                roleNameEng: "Parent",
              },
            ],
          },
          // {
          //   accountId: "1335419642465165",
          //   email: "jirayut.ch@thai.com",
          //   firstNameTh: "จิรายุทธ",
          //   lastNameTh: "ช่างเรือ",
          //   firstNameEn: "JIRAYUT",
          //   lastNameEN: "CHANGRUAE",
          //   userName: "yuthyuth",
          //   tel: "0622545944",
          //   number: 11,
          //   userRoles: [
          //     {
          //       accountId: "1335419642465165",
          //       roleId: "R_1",
          //       roleNameTh: "ผู้ดูแลระบบสูงสุด",
          //       roleNameEng: "Super admin",
          //     },
          //   ],
          // },
          // {
          //   accountId: "169467498031104",
          //   email: "laz.on@thai.com",
          //   firstNameTh: "ลาส",
          //   lastNameTh: "วัน",
          //   firstNameEn: "Laz",
          //   lastNameEN: "One",
          //   userName: "Lazzz1",
          //   tel: "0998908900",
          //   number: 12,

          //   userRoles: [
          //     {
          //       accountId: "169467498031104",
          //       roleId: "R_3",
          //       roleNameTh: "โค้ช",
          //       roleNameEng: "Coach",
          //     },
          //   ],
          // },
          // {
          //   accountId: "21713809369680802",
          //   email: "nane.ad@thai.com",
          //   firstNameTh: "นานี",
          //   lastNameTh: "แอดมิน",
          //   firstNameEn: "nane",
          //   lastNameEN: "admin",
          //   userName: "naneadmin01",
          //   tel: "0124812441",
          //   number: 13,

          //   userRoles: [
          //     {
          //       accountId: "21713809369680802",
          //       roleId: "R_1",
          //       roleNameTh: "ผู้ดูแลระบบสูงสุด",
          //       roleNameEng: "Super admin",
          //     },
          //   ],
          // },
          // {
          //   accountId: "86422468556877832",
          //   email: "coach.di@thai.com",
          //   firstNameTh: "โค้ช",
          //   lastNameTh: "ดี๊บ",
          //   firstNameEn: "coach",
          //   lastNameEN: "dieb",
          //   userName: "coachdieb",
          //   tel: "0985674976",
          //   number: 14,

          //   userRoles: [
          //     {
          //       accountId: "86422468556877832",
          //       roleId: "R_3",
          //       roleNameTh: "โค้ช",
          //       roleNameEng: "Coach",
          //     },
          //   ],
          // },
          // {
          //   accountId: "671712608843725",
          //   email: "testssm.te@thai.com",
          //   firstNameTh: "ทดสอบ",
          //   lastNameTh: "ทดสอบ",
          //   firstNameEn: "testssm",
          //   lastNameEN: "testssm",
          //   userName: "testssm99",
          //   tel: "0999990003",
          //   number: 15,

          //   userRoles: [
          //     {
          //       accountId: "671712608843725",
          //       roleId: "R_4",
          //       roleNameTh: "ผู้ปกครอง",
          //       roleNameEng: "Parent",
          //     },
          //   ],
          // },
          // {
          //   accountId: "2716334438435864",
          //   email: "sutdentthretythree.no@thai.com",
          //   firstNameTh: "นักเรียนสามสาม",
          //   lastNameTh: "น๊อต",
          //   firstNameEn: "sutdentThretythree",
          //   lastNameEN: "Not",
          //   userName: "surachet033",
          //   tel: "0127482194",
          //   number: 16,

          //   userRoles: [
          //     {
          //       accountId: "2716334438435864",
          //       roleId: "R_5",
          //       roleNameTh: "นักเรียน",
          //       roleNameEng: "Student",
          //     },
          //   ],
          // },
          // {
          //   accountId: "33954179429355",
          //   email: "studentthretytwo.no@thai.com",
          //   firstNameTh: "นักเรียนสามสอง",
          //   lastNameTh: "น๊อต",
          //   firstNameEn: "studentThretytwo",
          //   lastNameEN: "not",
          //   userName: "surachet032",
          //   tel: "0127489142",
          //   number: 17,
          //   userRoles: [
          //     {
          //       accountId: "33954179429355",
          //       roleId: "R_5",
          //       roleNameTh: "นักเรียน",
          //       roleNameEng: "Student",
          //     },
          //   ],
          // },
          // {
          //   accountId: "337552592218227",
          //   email: "hadeebah@thai.com",
          //   firstNameTh: "ดี๊บ",
          //   lastNameTh: "งับ",
          //   firstNameEn: "doop",
          //   lastNameEN: "dieb",
          //   userName: "hadeebah",
          //   tel: "0972341670",
          //   number: 18,
          //   userRoles: [
          //     {
          //       accountId: "337552592218227",
          //       roleId: "R_5",
          //       roleNameTh: "นักเรียน",
          //       roleNameEng: "Student",
          //     },
          //   ],
          // },
          // {
          //   accountId: "169639185091556",
          //   email: "not.ad@thai.com",
          //   firstNameTh: "น๊อต",
          //   lastNameTh: "แอทมิน",
          //   firstNameEn: "not",
          //   lastNameEN: "admin",
          //   userName: "surachetadmin01",
          //   tel: "0127481242",
          //   number: 19,
          //   userRoles: [
          //     {
          //       accountId: "169639185091556",
          //       roleId: "R_1",
          //       roleNameTh: "ผู้ดูแลระบบสูงสุด",
          //       roleNameEng: "Super admin",
          //     },
          //   ],
          // },
          // {
          //   accountId: "21650734425639024",
          //   email: "student.pa@thai.com",
          //   firstNameTh: "ผปค",
          //   lastNameTh: "นร",
          //   firstNameEn: "student",
          //   lastNameEN: "parent",
          //   userName: "studentpar",
          //   tel: "0548157825",
          //   number: 20,
          //   userRoles: [
          //     {
          //       accountId: "21650734425639024",
          //       roleId: "R_4",
          //       roleNameTh: "ผู้ปกครอง",
          //       roleNameEng: "Parent",
          //     },
          //   ],
          // },
        ],
      },
      loading: true,
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
    // this.$store.dispatch("UserModules/GetUserList");
    this.local_data = JSON.parse(localStorage.getItem("userDetail"));
  },
  handler() {
    this.getDessertsFromApi();
  },
  created() {
    this.GetUserList({
      limit: 10,
      page: 1,
    });
  },

  computed: {
    ...mapGetters({
      user_list: "UserModules/getUserList",
      show_by_id: "UserModules/getShowById",
      filter_role: "UserModules/getfilterGetUserList",
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
    }),

    loadItems() {
      // this.GetUserList({
      //   limit: 10,
      //   page: 1,
      // });
      console.log("testssss :>> ");
      this.loading = false;
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

    async search_data(name) {
      try {
        let config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${VueCookie.get("token")}`,
          },
        };
        await axios.get(
          `${process.env.VUE_APP_URL}/api/v1/usermanagement/search?name=${name}`,
          config
        );
      } catch (error) {
        console.log(error);
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
        await axios.get(
          // `http://localhost:3000/api/v1/getrole/query?roleId=${role}&roleId=${role}`,
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
        cancelButtonText: this.$t("cancel"),
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
                this.$store.dispatch("UserModules/GetUserList");
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
      this.FilterGetUserList(
        search_arr.length > 0 ? search_arr : this.searchQuery
      );
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
          // `http://localhost:3000/api/v1/getrole/filter?${this.query_roles}`,
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
