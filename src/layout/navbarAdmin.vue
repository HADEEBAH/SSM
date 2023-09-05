<template>
  <v-app>
    <v-layout>
      <v-app-bar clipped-left app dark fixed elevation="0" :src="navbar_img">
        <v-app-bar-nav-icon @click="drawer = !drawer">
          <v-icon>{{
            drawer ? "mdi-chevron-double-left" : "mdi-dots-vertical"
          }}</v-icon>
        </v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <div id="google_translate_element"></div>
        <div class="mx-5">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-row v-bind="attrs" v-on="on">
                <!-- <v-row class=""> -->
                <v-menu v-model="menu_locale" offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn text v-bind="attrs" v-on="on">
                      <label>{{
                        $i18n.locale == "en" ? $t("english") : $t("thai")
                      }}</label>
                      <v-icon dark> mdi-web </v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-list-item @click="$i18n.locale = 'en'">
                      {{ $t("english") }}
                    </v-list-item>
                    <v-list-item @click="$i18n.locale = 'th'">
                      {{ $t("thai") }}
                    </v-list-item>
                  </v-card>
                </v-menu>
                <!-- </v-row> -->

                <div v-if="user_detail.image !== ''">
                  <v-avatar class="mr-2" size="24">
                    <v-img :src="user_detail.image" size="24" />
                  </v-avatar>
                </div>
                <div v-else>
                  <v-avatar class="mr-2" size="24">
                    <v-img :src="logo" size="24" />
                  </v-avatar>
                </div>

                <span class="text-white">{{
                  `${user_detail.first_name_en} ${user_detail.last_name_en}`
                }}</span>
              </v-row>
            </template>
            <v-list dense>
              <v-subheader>{{ $t("choice") }}</v-subheader>
              <v-list-item link @click="selectMenu('head', 'UserKingdom')">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ $t("user page") }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-app-bar>
      <v-navigation-drawer
        clipped
        app
        v-model="drawer"
        :temporary="$vuetify.breakpoint.smAndDown"
      >
        <v-row>
          <v-col class="flex align-center justify-center">
            <v-img
              src="@/assets/navbar/logo.svg"
              max-height="115"
              max-width="115"
            ></v-img>
          </v-col>
        </v-row>
        <v-list class="pr-0" nav flat>
          <div v-for="(list, list_index) in menu_drawer_list" :key="list_index">
            <v-list-item
              :class="active_menu === list.to ? 'active-menu-list' : ''"
              @click="selectMenu('head', list.to)"
              link
              v-if="
                list.child.length === 0 &&
                (list.roles.length > 0
                  ? list.roles.filter((v) => user_detail?.roles.includes(v))
                      .length > 0
                  : false)
              "
            >
              <v-list-item-title>{{ $t(list.title)}}</v-list-item-title>
            </v-list-item>
            <v-list-group
              v-else-if="
                list.roles.length > 0
                  ? list.roles.filter((v) => user_detail?.roles.includes(v))
                      .length > 0
                  : false
              "
              :value="active_menu === list.title"
              :active-class="
                active_menu === list.title ? 'active-menu-list' : ''
              "
              @click="active_menu = list.title"
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ $t(list.title) }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                @click="selectMenu('child', child.to, list.title)"
                :class="
                  $route.name === child.to
                    ? 'active-menu-group-list-child'
                    : 'ml-8 menu-group-list'
                "
                v-for="(child, index_child) in list.child"
                :key="index_child"
                link
              >
                <v-list-item-title>{{ $t(child.title) }}</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </div>
        </v-list>
        <template v-slot:append>
          <v-divider></v-divider>
          <v-list-item link @click="logOut">
            <v-list-item-icon><v-icon>mdi-login</v-icon></v-list-item-icon>
            <v-list-item-title>ออกจากระบบ</v-list-item-title>
          </v-list-item>
        </template>
      </v-navigation-drawer>
      <v-main class="bg-admin">
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "navbarAdmin",
  data: () => ({
    navbar_img: `${process.env.VUE_APP_URL}/navbar_img.svg`,
    logo: `${process.env.VUE_APP_URL}/logo.svg`,
    menu: false,
    drawer: false,
    active_menu: "",
    active_menu_child: "",
    user: {
      full_name: "John Doe",
      email: "john.doe@doe.com",
    },
    user_detail: null,
    menu_drawer_list: [
      { title: "dashboard", to: "Dashboard", child: [], roles: ["R_1", "R_2"] }, // to ให้ใส่ name ของ router
      {
        title: "study schedule",
        to: "ManageSchedule",
        child: [],
        roles: ["R_1", "R_2"],
      },
      {
        title: "add a learner",
        to: "Student",
        child: [],
        roles: ["R_1", "R_2"],
      },
      {
        title: "course",
        to: "",
        roles: ["R_1"],
        child: [
          { title: "manage reservations", to: "CourseReserveList", roles: ["R_1"] },
          { title: "manage all courses", to: "CourseList", roles: ["R_1"] },
          { title: "create a course", to: "CourseCreate", roles: ["R_1"] },
        ],
      },
      {
        title: "kingdom",
        to: "",
        roles: ["R_1"],
        child: [
          { title: "manage a kingdom", to: "ManageKingdom", roles: ["R_1"] },
          { title: "create a kingdom", to: "Kingdom", roles: ["R_1"] },
        ],
      },
      { title: "finance", to: "Finance", child: [], roles: ["R_1", "R_2"] },
      {
        title: "manage user",
        to: "",
        roles: ["R_1"],
        child: [{ title: "manage user", to: "UserList", roles: ["R_1"] }],
      },
      { title: "approval of leave", to: "LeaveList", child: [], roles: ["R_1"] },
      {
        title: "banner management",
        to: "Banner",
        child: [],
        roles: ["R_1", "R_2"],
      },
    ],
    menu_locale: false,
  }),

  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
     // Function called when the Google Translate Element script is loaded
     window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: this.$i18n.locale, // Change to the default language of your website
          includedLanguages: 'en,th',
        },
        'google_translate_element'
      );
    };

    // Load the Google Translate Element script dynamically
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
  },
  mounted() {
    this.menu_drawer_list.forEach((list) => {
      if (list.to === this.$route.name) {
        this.active_menu = this.$route.name;
      } else {
        list.child.forEach((child) => {
          if (child.to === this.$route.name) {
            this.active_menu_child = this.$route.name;
            this.active_menu = list.title;
          }
        });
      }
    });
  },
  watch: {},
  computed: {},
  methods: {
    ...mapActions({
      logOut: "loginModules/logOut",
    }),
    selectMenu(type, to, head) {
      if (type === "child" && head === this.active_menu) {
        this.active_menu_child = to;
        if (this.$route.name !== to) {
          this.$router.push({ name: to });
        }
      } else {
        this.active_menu_child = to;
      }
      if (type === "head") {
        if (to) {
          if (this.$route.name !== to) {
            this.$router.push({ name: to });
            this.active_menu_child = "";
            this.active_menu = to;
          }
        }
      }
    },
  },
};
</script>
<style>
.bg-admin .v-container {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04)),
    linear-gradient(141.48deg, #fffafb 14.35%, #fffdfa 85.47%);
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
</style>
