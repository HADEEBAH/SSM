<template>
  <v-app>
    <v-layout>
      <v-app-bar
        app
        clipped-right
        class="bg-navbar-user"
        dark
        fixed
        elevation="0"
      >
        <v-app-bar-nav-icon
          v-if="$route.name !== 'UserKingdom'"
          @click="$router.back()"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-app-bar-nav-icon>
        <v-app-bar-nav-icon
          v-if="$route.name !== 'UserKingdom'"
          @click="$router.push({ name: 'UserKingdom' })"
        >
          <v-icon>mdi-home</v-icon>
        </v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-app-bar-title class="font-bold flex align-center justify-center">{{
          titel_navber
        }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <template v-if="user_detail">
          <v-menu v-model="notify" :close-on-content-click="false" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-badge
                color="pink"
                dot
                :value="
                  get_notifications_all.filter(
                    (item) => item.notificationRead === false
                  ).length
                "
                class="mx-5"
              >
                <v-icon dark v-bind="attrs" v-on="on">
                  mdi-bell-outline
                </v-icon>
              </v-badge>
            </template>

            <v-card width="360px" max-height="500px" style="overflow: auto">
              <div style="position: sticky; top: 0; z-index: 1">
                <v-toolbar dense elevation="0">
                  <v-row dense height="500">
                    <v-col cols="8">
                      <div class="my-2 font-bold">การแจ้งเตือน</div>
                    </v-col>
                    <v-col cols="4" align="end">
                      <v-icon size="32" color="#ff6b81">
                        <!-- mdi-email-open -->
                        mdi-email
                        <!-- mdi-email-outline -->
                        <!-- mdi-email-open-outline -->
                      </v-icon>
                    </v-col>
                  </v-row>
                  <!-- <span
                  class="flex text-center"
                  style="
                    font-weight: 700;
                    font-size: 16px;
                    line-height: 24px;
                    color: #2a70c3;
                  "
                >
                </span>
                <v-btn icon dark @click="closeDialog()">
                  <v-icon color="#2A70C3">mdi-close</v-icon>
                </v-btn> -->
                </v-toolbar>
                <v-divider></v-divider>
              </div>

              <!-- <v-card-title style="position: sticky; top: 0; z-index: 1">
                <v-row dense height="500">
                  <v-col cols="8">การแจ้งเตือน</v-col>
                  <v-col cols="4" align="end">
                    <v-icon size="32" color="#ff6b81">
                      mdi-email
                    </v-icon>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-divider></v-divider>
                  </v-col>
                </v-row>
              </v-card-title> -->

              <v-card-text>
                <v-list three-line>
                  <v-list-item
                    class="pl-0"
                    link
                    v-for="(item, index) in get_notifications_all"
                    :key="index"
                    @click="readNotification(item)"
                  >
                    <v-list-item-avatar class="align-self-center">
                      <v-icon size="32" color="#ff6b81">
                        {{
                          item.notificationRead ? "mdi-email-open" : "mdi-email"
                        }}
                      </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold">
                        {{ item.notificationName }}
                      </v-list-item-title>
                      <v-list-item-subtitle>{{
                        item.notificationDescription
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon
                        v-if="!item.notificationRead"
                        color="#ff6b81"
                        size="10"
                      >
                        mdi-checkbox-blank-circle
                      </v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-menu>

          <v-badge
            v-if="cart_list.length > 0"
            class="mr-5"
            color="red"
            :content="cart_list.length"
          >
            <v-icon dark @click="$router.push({ name: 'CartList' })"
              >mdi-cart</v-icon
            >
          </v-badge>
          <v-icon
            v-else
            class="mr-5"
            dark
            @click="$router.push({ name: 'CartList' })"
            >mdi-cart</v-icon
          >
          <div v-if="profile_detail.image !== ''">
            <div v-if="!$vuetify.breakpoint.smAndDown">
              <v-avatar class="mx-2" size="24">
                <v-img :src="profile_detail.image" size="24" />
              </v-avatar>

              <!-- <div v-else>
              <v-avatar class="mx-2" size="24">
                <v-img
                  src="../assets/navbar_user/default_image_profile.svg"
                  size="24"
                />
              </v-avatar>
            </div> -->

              <span class="text-white mx-2">
                {{ show_profile_detail.firstNameTh }}
                {{ show_profile_detail.lastNameTh }}
                <!-- {{ user_detail.first_name_en }} {{ user_detail.last_name_en }} -->
              </span>
            </div>
          </div>

          <div v-else>
            <div v-if="!$vuetify.breakpoint.smAndDown">
              <v-avatar class="mx-2" size="24">
                <v-img
                  src="../assets/navbar_user/default_image_profile.svg"
                  size="24"
                />
              </v-avatar>

              <span class="text-white mx-2">
                {{ show_profile_detail.firstNameTh }}
                {{ show_profile_detail.lastNameTh }}
                <!-- {{ user_detail.first_name_en }} {{ user_detail.last_name_en }} -->
              </span>
            </div>
          </div>
          <v-btn icon @click="drawer = !drawer">
            <v-icon>{{ drawer ? "mdi-chevron-right" : "mdi-menu" }}</v-icon>
          </v-btn>
          <!-- ALERT v-if="get_notifications"-->
          <!-- <v-alert
            v-if="alertVisible"
            type="success"
            dismissible
            @input="alertVisible = false"
          >
            This alert will automatically close after 3 seconds.
          </v-alert> -->
          <!-- END ALRT -->
        </template>
        <template v-else>
          <v-btn
            @click="$router.push({ name: 'Login' })"
            class="mr-2"
            :text="!$vuetify.breakpoint.smAndDown"
            :icon="$vuetify.breakpoint.smAndDown"
            small
          >
            <v-icon>mdi-login</v-icon>
            <template v-if="!$vuetify.breakpoint.smAndDown"
              >เข้าสู่ระบบ</template
            >
          </v-btn>
          <v-btn
            @click="$router.push({ name: 'Register' })"
            :text="!$vuetify.breakpoint.smAndDown"
            :icon="$vuetify.breakpoint.smAndDown"
            small
          >
            <v-icon>mdi-account-plus</v-icon>
            <template v-if="!$vuetify.breakpoint.smAndDown">ลงทะเบียน</template>
          </v-btn>
        </template>
      </v-app-bar>

      <v-navigation-drawer
        v-if="user_detail"
        right
        clipped
        app
        v-model="drawer"
        :temporary="$vuetify.breakpoint.smAndDown"
      >
        <v-row class="pt-8 pb-6">
          <v-col class="flex align-center justify-center">
            <div
              v-if="profile_detail.image !== ''"
              class="cicle"
              style="text-align: -webkit-center"
            >
              <v-img
                class="image-cropper"
                :src="profile_detail.image"
                size="24"
              />
            </div>
            <div v-else class="cicle" style="text-align: -webkit-center">
              <v-img
                class="image-cropper"
                src="../assets/navbar_user/default_image_profile.svg"
                style="max-width: 300px; max-height: 300px"
              />
            </div>
            <!-- <img class="img-profile" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC_N_JBXW49fAT5BDrX0izmY5Z8lx-we3Oag&usqp=CAU"/> -->
          </v-col>
        </v-row>
        <v-row dense>
          <v-col
            cols="12"
            class="flex align-center justify-center font-bold text-md"
          >
            {{ show_profile_detail.firstNameTh }}
            {{ show_profile_detail.lastNameTh }}
          </v-col>
          <!-- <v-col
            cols="12"
            sm="6"
            class="flex align-center justify-center font-bold text-md"
          >
            {{ show_profile_detail.lastNameTh }}
          </v-col> -->
          <v-col cols="12" class="flex align-center justify-center text-sm">
            {{ show_profile_detail.email }}
          </v-col>
        </v-row>
        <v-list nav>
          <div v-for="(list, list_index) in menu_drawer_list" :key="list_index">
            <template v-if="list.to !== 'logOut'">
              <v-list-item
                v-if="
                  list.roles.length > 0
                    ? list.roles.filter((v) => user_detail?.roles.includes(v))
                        .length > 0
                    : true
                "
                @click="nextpage(list)"
                :class="
                  menu_drawer_list.length - 1 !== list_index
                    ? 'list-items-border-bottom'
                    : ''
                "
              >
                <v-list-item-avatar>
                  <v-icon color="#ff6b81">{{ list.icon }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-title
                  :class="$route.name === list.to ? 'text-[#ff6b81]' : ''"
                >
                  {{ list.title }}
                </v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item
              v-if="list.to === 'logOut'"
              @click="logOut"
              :class="
                menu_drawer_list.length - 1 !== list_index
                  ? 'list-items-border-bottom'
                  : ''
              "
            >
              <v-list-item-avatar>
                <v-icon color="#ff6b81">{{ list.icon }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-title
                :class="$route.name === list.to ? 'text-[#ff6b81]' : ''"
                >{{ list.title }}
              </v-list-item-title>
            </v-list-item>
          </div>
        </v-list>
      </v-navigation-drawer>
      <v-main class="bg-admin">
        <v-overlay :value="loading">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <router-view />
      </v-main>
    </v-layout>
    <v-footer dark padless class="text-white bg-navbar-user rounded-t-xl">
      <v-container>
        <v-row dense align="center" class="mb-2">
          <v-col cols>
            <v-row dense>
              <v-col class="font-bold text-sm">ติดต่อเราได้ที่</v-col>
            </v-row>
            <v-row dense>
              <v-col cols="auto" class="font-bold">
                <v-icon dark>mdi-email</v-icon>
              </v-col>
              <v-col class="font-medium text-sm">
                <v-icon dark>mdi-chat</v-icon>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="auto" class="font-bold">
                <v-icon dark>mdi-facebook</v-icon>
              </v-col>
              <v-col class="font-medium text-sm"
                >Warraphat Learning Sphere</v-col
              >
            </v-row>
            <v-row dense>
              <v-col cols="auto">
                <v-icon dark>mdi-phone</v-icon>
              </v-col>
              <v-col class="font-medium text-sm"
                >074 - 236020, 074-221142, 0649092140</v-col
              >
            </v-row>
          </v-col>
          <v-col cols="auto" class="pa-4 bg-white" align="center">
            <v-img
              src="../assets/navbar/qr-footer.png"
              max-height="96"
              max-width="89"
            ></v-img>
          </v-col>
        </v-row>

        <v-row dense class="text-caption border-t">
          <v-col col="12" sm>
            Copyright 2022 Tourish Promp. All rights reserved . Design by UI
            <label v-if="$vuetify.breakpoint.smAndDown" align="right">
              All rights reserved . | Terms and Coditions | Privacy
              Police</label
            >
          </v-col>
          <v-col cols="12" sm="auto" v-if="!$vuetify.breakpoint.smAndDown">
            All rights reserved . | Terms and Coditions | Privacy Police
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import mixin from "../mixin";
import { mapActions, mapGetters } from "vuex";

export default {
  mixins: [mixin],
  name: "navbarUser",
  data: () => ({
    menu: false,
    drawer: true,
    active_menu: "",
    active_menu_child: "",
    user: {
      full_name: "John Doe",
      email: "john.doe@doe.com",
    },
    menu_drawer_list: [
      {
        icon: "mdi-account-circle",
        title: "โปรไฟล์",
        to: "UserProfile",
        params: null,
        roles: [],
      },
      {
        icon: "mdi-calendar-month",
        title: "ตารางเรียน",
        to: "StudentsSchedule",
        params: { action: "MySchedule" },
        roles: ["R_4", "R_5"],
      },
      {
        icon: "mdi-book-cog-outline",
        title: "การจัดการ",
        to: "menageCourse",
        params: null,
        roles: ["R_1", "R_2", "R_3"],
      },
      {
        icon: "mdi-history",
        title: "ประวัติการลงทะเบียน",
        to: "orderHistory",
        params: null,
        roles: [],
      },
      {
        icon: "mdi-swap-horizontal-bold",
        title: "หน้าผู้ดูแลระบบ",
        to: "DashboardList",
        params: null,
        roles: ["R_1", "R_2"],
      },
      { icon: "mdi-logout", title: "ออกจากระบบ", to: "logOut", roles: [] },
    ],
    user_detail: null,
    show_profile_detail: {
      firstNameTh: "",
      lastNameTh: "",
      firstNameEng: "",
      lastNameEng: "",
      nation: "",
      mobileNo: "",
      email: "",
    },

    notify: false,
    hints: true,
    alert: true,

    alertVisible: true,
    alertNotify: true,
  }),

  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
    console.log("object", this.user_detail.account_id);
    if (this.user_detail?.account_id) {
      this.GetProfileDetail(this.user_detail.account_id);
    }
    this.active_menu = this.$route.name;
    if (this.user_detail?.account_id) {
      this.GetCartList(this.user_detail.account_id);
    }
  },
  beforeMount() {
    if (this.MobileSize) {
      this.drawer = false;
    } else {
      this.drawer = true;
    }
  },
  mounted() {
    if (this.user_detail?.account_id) {
      this.GetProfileDetail(this.user_detail.account_id);
    }
    if (this.user_detail?.account_id) {
      this.GetCartList(this.user_detail.account_id);
    }
    this.GetNotificationsAll(this.user_detail.account_id);

    setTimeout(() => {
      this.alertVisible = false;
    }, 3000); // Set the timeout to 3 seconds
  },
  beforeUpdate() {
    this.show_profile_detail.firstNameTh = this.profile_detail.firstNameTh;
    this.show_profile_detail.lastNameTh = this.profile_detail.lastNameTh;
    this.show_profile_detail.firstNameEng = this.profile_detail.firstNameEng;
    this.show_profile_detail.lastNameEng = this.profile_detail.lastNameEng;
    this.show_profile_detail.nation = this.profile_detail.nation;
    this.show_profile_detail.mobileNo = this.profile_detail.mobileNo;
    this.show_profile_detail.email = this.profile_detail.email;
  },
  watch: {},
  computed: {
    ...mapGetters({
      cart_list: "OrderModules/getCartList",
      titel_navber: "NavberUserModules/getTitleNavber",
      profile_detail: "ProfileModules/getProfileDetail",
      get_notifications: "NotificationsModules/getNotifications",
      get_notifications_all: "NotificationsModules/getNotificationsAll",
      notifications_read: "NotificationsModules/readNotifications",
      loading: "LoadingModules/getLoading"
    }),
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
  },
  methods: {
    ...mapActions({
      GetCartList: "OrderModules/GetCartList",
      logOut: "loginModules/logOut",
      GetProfileDetail: "ProfileModules/GetProfileDetail",
      GetNotifications: "NotificationsModules/GetNotifications",
      GetNotificationsAll: "NotificationsModules/GetNotificationsAll",
      ReadNotifications: "NotificationsModules/ReadNotifications",
    }),
    selectMenu(type, to, head) {
      if (type === "child" && head === this.active_menu) {
        this.active_menu_child = to;
        this.$router.push({ name: to });
      } else {
        this.active_menu_child = to;
      }
      if (type === "head") {
        if (to) {
          this.$router.push({ name: to });
          this.active_menu_child = "";
          this.active_menu = to;
        }
      }
    },
    readNotification(params) {
      this.ReadNotifications({
        notification_id: params.notificationId,
        account_id: params.accountId,
      });
    },
    nextpage(list) {
      if (this.$route.name !== list.to) {
        if (list.params) {
          this.$router.push({ name: list.to, params: { ...list.params } });
        } else {
          this.$router.push({ name: list.to });
        }
      }
    },
  },
};
</script>
<style scoped>
.bg-navbar-user {
  background: linear-gradient(141.48deg, #ff8092 43%, #fdcb6e 85.47%);
}

.menu-list {
  color: #333333 !important;
}

.active-menu-list {
  background: #fff4fb;
  border-radius: 8px 0px 0px 8px;
  font-weight: 700;
  color: #333333 !important;
}

.menu-group-list {
  background: transparent;
}

.active-menu-group-list {
  background: #fff4fb;
  border-radius: 8px 0px 0px 8px;
  color: #333333 !important;
}

.active-menu-group-list .v-list-item__title {
  color: #333333 !important;
}

.active-menu-group-list .v-list-item__icon {
  color: #333333 !important;
}

.active-menu-group-list-child {
  border-radius: 8px 0px 0px 8px;
  margin: 0px 0px 0px 24px;
  font-weight: 700;
  color: #ff6b81 !important;
}

.bottom-absolute {
  position: absolute;
  bottom: 0px;
  width: 100%;
}

.list-items-border-bottom {
  border-bottom: 1px solid #d9d9d9 !important;
}

.img-profile {
  width: 112px;
  height: 112px;
  border-radius: 100%;
  border: 6px solid #ff6b81;
}
.image-cropper {
  width: 125px;
  height: 125px;
  position: relative;
  overflow: hidden;
  border-radius: 100%;
  margin: -1%;
}
.cicle {
  /* margin: 25px 0; */
  /* padding: 1px; */
  width: 140px;
  height: 140px;
  border-radius: 100%;
  border: 8px solid transparent;
  /* background-size: 100% 100%, 50% 50%, 50% 50%, 50% 50%, 50% 50%; */
  background-repeat: no-repeat;
  background-image: linear-gradient(white, white),
    linear-gradient(30deg, #ff6b81 36%, #ff6b81 30%),
    linear-gradient(120deg, #ff6b81 36%, #ff6b81 30%),
    linear-gradient(300deg, #ff6b81 36%, #ff6b81 30%),
    linear-gradient(210deg, #ff6b81 36%, #ff6b81 30%);
  background-position: center center, left top, right top, left bottom,
    right bottom;
  background-origin: content-box, border-box, border-box, border-box, border-box;
  background-clip: content-box, border-box, border-box, border-box, border-box;
  /* transform: rotate(30deg); */
}

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #c7c7c7;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #c7c7c7;
}
</style>
