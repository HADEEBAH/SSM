<template>
  <v-app>
    <v-layout>
      <v-app-bar
        clipped-left
        app
        dark
        fixed
        elevation="0"
        src="../assets/navbar/bg-nav-bar.png"
      >
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

        <v-menu v-model="notify" :close-on-content-click="false" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-badge
              overlap
              color="#F03D3E"
              content="1"
              message="1"
              class="mx-5"
            >
              <v-icon dark v-bind="attrs" v-on="on">mdi-bell-outline</v-icon>
            </v-badge>
          </template>
          <v-card height="500px" style="overflow-y: scroll; overflow-x: hidden">
            <v-card-title>
              <v-row>
                <v-col cols="8" sm="8">Notifications</v-col>
                <v-col cols="4" sm="4" align="end">
                  <v-icon color="#ff6b81">mdi-email</v-icon>
                </v-col>
              </v-row>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text
              v-for="(notify, index_data) in notifyData"
              :key="index_data"
            >
              <v-row>
                <v-col cols="2" sm="2" align="center" class="mt-2">
                  <v-img :src="notify.avatar" height="30" width="30"></v-img
                ></v-col>
                <v-col cols="8" sm="8">
                  {{ notify.header }} <br />
                  {{ notify.detail }}
                </v-col>
                <v-col
                  cols="2"
                  sm="2"
                  align="center"
                  v-if="notify.read"
                  class="mt-5"
                >
                  <v-tab>
                    <v-badge color="#ff6b81" dot> </v-badge>
                  </v-tab>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>

        <div class="mx-5 pa-2" v-if="!$vuetify.breakpoint.smAndDown">
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
                    <v-img
                      src="../assets/navbar_user/default_image_profile.svg"
                      size="24"
                    />
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
            <v-img
              src="../assets/navbar/drawer_img.png"
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
      { title: "แดชบอร์ด", to: "DashboardList", child: [] }, // to ให้ใส่ name ของ router
      { title: "ตารางเรียน", to: "ManageSchedule", child: [] },
      // { title: "เพิ่มผู้เรียน", to: "Student", child: [] },
      // { title: "ตารางเรียน", to: "Schedule", child: [] },
      { title: "เพิ่มผู้เรียน", to: "Student", child: [] },
      {
        title: "คอร์สเรียน",
        to: "",
        child: [
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

    notify: false,
    // message: false,
    hints: true,

    notifyData: [
      {
        avatar:
          "https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: false,
      },
      {
        avatar:
          "https://cdn.icon-icons.com/icons2/2643/PNG/512/avatar_female_woman_person_people_white_tone_icon_159360.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: true,
      },
      {
        avatar:
          "https://cdn4.iconfinder.com/data/icons/people-avatar-flat-1/64/girl_female_young_people_woman_teenager_avatar-512.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: true,
      },
      {
        avatar:
          "https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent-Picture.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: false,
      },
      {
        avatar:
          "https://w7.pngwing.com/pngs/481/915/png-transparent-computer-icons-user-avatar-woman-avatar-computer-business-conversation-thumbnail.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: true,
      },
      {
        avatar: "https://image.pngaaa.com/414/81414-middle.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: false,
      },
      {
        avatar:
          "https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: false,
      },
      {
        avatar:
          "https://cdn.icon-icons.com/icons2/2643/PNG/512/avatar_female_woman_person_people_white_tone_icon_159360.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: true,
      },
      {
        avatar:
          "https://cdn4.iconfinder.com/data/icons/people-avatar-flat-1/64/girl_female_young_people_woman_teenager_avatar-512.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: true,
      },
      {
        avatar:
          "https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent-Picture.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: false,
      },
      {
        avatar:
          "https://w7.pngwing.com/pngs/481/915/png-transparent-computer-icons-user-avatar-woman-avatar-computer-business-conversation-thumbnail.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: true,
      },
      {
        avatar: "https://image.pngaaa.com/414/81414-middle.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: false,
      },
      {
        avatar:
          "https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: false,
      },
      {
        avatar:
          "https://cdn.icon-icons.com/icons2/2643/PNG/512/avatar_female_woman_person_people_white_tone_icon_159360.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: true,
      },
      {
        avatar:
          "https://cdn4.iconfinder.com/data/icons/people-avatar-flat-1/64/girl_female_young_people_woman_teenager_avatar-512.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: true,
      },
      {
        avatar:
          "https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent-Picture.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: false,
      },
      {
        avatar:
          "https://w7.pngwing.com/pngs/481/915/png-transparent-computer-icons-user-avatar-woman-avatar-computer-business-conversation-thumbnail.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: true,
      },
      {
        avatar: "https://image.pngaaa.com/414/81414-middle.png",
        header: "Congratulation Flora! 🎉",
        detail: "Won the monthly best seller badge",
        read: false,
      },
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