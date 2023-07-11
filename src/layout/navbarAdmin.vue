<template>
  <v-app>
    <v-layout>
      <v-app-bar clipped-left app dark fixed elevation="0" :src="navbar_img">
        <!-- {{ navbar_img }} -->
        <v-app-bar-nav-icon @click="drawer = !drawer">
          <v-icon>{{
            drawer ? "mdi-chevron-double-left" : "mdi-dots-vertical"
          }}</v-icon>
        </v-app-bar-nav-icon>
        <!-- <v-app-bar-title><v-img max-height="37" max-width="51" src="../assets/navbar/title_img.jpg"></v-img></v-app-bar-title> -->
        <v-spacer></v-spacer>
        <!-- <v-badge class="mx-5" overlap color="#F03D3E" content="1" message="1">
          <v-icon dark>mdi-bell-outline</v-icon>
        </v-badge> -->

        <!-- <div class="mx-5" v-if="$vuetify.breakpoint.smAndDown"> -->
        <div class="mx-5">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-row v-bind="attrs" v-on="on">
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
              <v-subheader>ตัวเลือก</v-subheader>
              <v-list-item link @click="selectMenu('head', 'UserKingdom')">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>หน้าผู้ใช้งาน</v-list-item-title>
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
            <v-img :src="logo" max-height="115" max-width="115"></v-img>
          </v-col>
        </v-row>
        <v-list class="pr-0" nav flat>
          <div v-for="(list, list_index) in menu_drawer_list" :key="list_index">
            <v-list-item
              :class="active_menu === list.to ? 'active-menu-list' : ''"
              @click="selectMenu('head', list.to)"
              link
              v-if="list.child.length === 0"
            >
              <v-list-item-title>{{ list.title }}</v-list-item-title>
            </v-list-item>
            <v-list-group
              v-else
              :value="active_menu === list.title"
              :active-class="
                active_menu === list.title ? 'active-menu-list' : ''
              "
              @click="active_menu = list.title"
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ list.title }}</v-list-item-title>
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
                <v-list-item-title>{{ child.title }}</v-list-item-title>
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
    // navbar_img: `http://localhost:8080/navbar_img.svg`,
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
      // { title: "แดชบอร์ด", to: "Dashboard", child: [] }, // to ให้ใส่ name ของ router
      // { title: "แดชบอร์ด", to: "", child: [] }, // to ให้ใส่ name ของ router
      { title: "ตารางเรียน", to: "ManageSchedule", child: [] },
      // { title: "เพิ่มผู้เรียน", to: "Student", child: [] },
      // { title: "ตารางเรียน", to: "Schedule", child: [] },
      { title: "เพิ่มผู้เรียน", to: "Student", child: [] },
      {
        title: "คอร์สเรียน",
        to: "",
        child: [
          { title: "จัดการการจอง", to: "CourseReserveList" },
          { title: "จัดการคอร์สทั้งหมด", to: "CourseList" },
          { title: "สร้างคอร์สเรียน", to: "CourseCreate" },
        ],
      },
      {
        title: "อาณาจักร",
        to: "",
        child: [
          { title: "จัดการอาณาจักร", to: "ManageKingdom" },
          { title: "สร้างอาณาจักร", to: "Kingdom" },
        ],
      },
      { title: "การเงิน", to: "Finance", child: [] },
      {
        title: "จัดการผู้ใช้งาน",
        to: "",
        child: [{ title: "จัดการผู้ใช้งาน", to: "UserList" }],
      },
      { title: "การอนุมัติลา", to: "LeaveList", child: [] },
      // { title: "หน้าผู้ใช้งาน", to: "UserKingdom", child: [] },
      { title: "จัดการแบนเนอร์", to: "Banner", child: [] },
    ],
  }),

  created() {
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
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