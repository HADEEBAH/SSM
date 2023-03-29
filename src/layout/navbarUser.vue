<template>
  <v-app>
    <v-layout>
      <v-app-bar app clipped-right class="bg-navbar-user" dark fixed elevation="0">
        <v-app-bar-nav-icon v-if="$route.name !== 'UserKingdom'" @click="$router.back()"><v-icon>mdi-chevron-left</v-icon></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-app-bar-title class="font-bold">{{ titel_navber }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <template v-if="user_detail">
          <v-badge class="mr-3" overlap color="#F03D3E" >
            <v-icon dark>mdi-bell-outline</v-icon>
          </v-badge>
          <v-badge class="mr-5" overlap color="#F03D3E" >
            <v-icon dark  @click="$router.push({name: 'CartList'})">mdi-cart</v-icon>
          </v-badge>
          <div v-if="!$vuetify.breakpoint.smAndDown">
            <v-avatar class="mx-2" size="24">
              <v-img src="https://cdn.vuetifyjs.com/images/lists/4.jpg" size="24" />
            </v-avatar>
            <span class="text-white mx-2">{{ `${user_detail.first_name_en} ${user_detail.last_name_en}` }}</span>
          </div>
          <v-btn icon @click="drawer =!drawer">
            <v-icon>{{ drawer ? 'mdi-chevron-right':"mdi-menu" }}</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-btn @click="$router.push({name : 'Login'})" class="mr-2" :text="!$vuetify.breakpoint.smAndDown" :icon="$vuetify.breakpoint.smAndDown" small >
            <v-icon>mdi-login</v-icon>
            <template v-if="!$vuetify.breakpoint.smAndDown">เข้าสู่ระบบ</template>
          </v-btn>
          <v-btn  @click="$router.push({name : 'Register'})" :text="!$vuetify.breakpoint.smAndDown" :icon="$vuetify.breakpoint.smAndDown" small>
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
          <v-col class="flex align-center justify-center ">        
            <img class="img-profile" src="@/assets/navbar/drawer_img.png"/>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" class="flex align-center justify-center font-bold text-lg">
            {{ `${user_detail.first_name_en} ${user_detail.last_name_en}` }}
          </v-col>
          <v-col cols="12" class="flex align-center justify-center text-sm">
           {{  user_detail.email  }}
          </v-col>
        </v-row>
        <v-list
          nav
        >
          <div v-for="(list, list_index) in menu_drawer_list" :key="list_index" >
            <v-list-item v-if=" list.to !== 'logOut'" @click="$router.push({name :  list.to })" :class="menu_drawer_list.length-1 !== list_index ? 'list-items-border-bottom' : ''">
              <v-list-item-avatar><v-icon color="#ff6b81">{{ list.icon }}</v-icon></v-list-item-avatar>
              <v-list-item-title :class="$route.name === list.to ? 'text-[#ff6b81]' : ''">{{ list.title }}</v-list-item-title>
            </v-list-item>
            <v-list-item v-if=" list.to === 'logOut'" @click="logOut" :class="menu_drawer_list.length-1 !== list_index ? 'list-items-border-bottom' : ''">
              <v-list-item-avatar><v-icon color="#ff6b81">{{ list.icon }}</v-icon></v-list-item-avatar>
              <v-list-item-title :class="$route.name === list.to ? 'text-[#ff6b81]' : ''">{{ list.title }}</v-list-item-title>
            </v-list-item>
          </div>
        </v-list>
      </v-navigation-drawer>
      <v-main class="bg-admin">
          <router-view />
      </v-main>
    </v-layout>
    <v-footer dark padless class="text-white bg-navbar-user rounded-t-xl">
      <v-container>
        <v-row dense align="center" class="mb-2" > 
            <v-col cols>
              <v-row dense>
                <v-col class="font-bold text-sm">ติดต่อเราได้ที่</v-col>
              </v-row>
              <v-row dense>
                <v-col cols="auto" class="font-bold"><v-icon dark>mdi-email</v-icon></v-col>
                <v-col class="font-medium text-sm"><v-icon dark>mdi-chat</v-icon></v-col>
              </v-row>
              <v-row dense>
                <v-col cols="auto" class="font-bold"><v-icon dark>mdi-facebook</v-icon></v-col>
                <v-col class="font-medium text-sm">Warraphat Learning Sphere</v-col>
              </v-row>
              <v-row dense>
                <v-col cols="auto" ><v-icon dark>mdi-phone</v-icon></v-col>
                <v-col class="font-medium text-sm">074 - 236020, 074-221142, 0649092140</v-col>
              </v-row>
            </v-col>
            <v-col cols="auto" class="pa-4 bg-white" align="center">
              <v-img src="../assets/navbar/qr-footer.png" max-height="96" max-width="89"></v-img>
            </v-col>
          </v-row>
          <v-row dense class="text-caption border-t">
            <v-col col="12" sm> Copyright 2022 Tourish Promp. All rights reserved . Design by UI
              <label v-if="$vuetify.breakpoint.smAndDown" align="right"> All rights reserved .  | Terms and Coditions | Privacy Police</label> 
            </v-col>
            <v-col cols="12" sm="auto"  v-if="!$vuetify.breakpoint.smAndDown">
               All rights reserved .  | Terms and Coditions | Privacy Police
            </v-col>
          </v-row>
      </v-container>
    </v-footer> 
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: "navbarUser",
  data: () => ({
    menu : false,
    drawer : true,
    active_menu : "",
    active_menu_child : "",
    user: {
      full_name: "John Doe",
      email: "john.doe@doe.com",
    },
    menu_drawer_list:[
      { icon: "mdi-account-circle", title : "โปรไฟล์", to:"UserProfile", roles:[]},
      { icon: "mdi-calendar-month", title : "ตารางเรียน", to:"", roles:["student", "parent",  "super admin"]},
      { icon: "mdi-book-cog-outline", title : "การจัดการ", to:"menageCourse", roles:["coach", "super admin"]},
      { icon: "mdi-history", title : "ประวัติการสั่งซื้อ", to:"", roles:["student","parent","super admin"]},
      { icon: "mdi-swap-horizontal-bold", title : "หน้าผู้ดูแลระบบ", to:"Admin", roles: ["super admin"]},
      { icon: "mdi-logout", title : "ออกจากระบบ", to:"logOut", roles:[]},
      
    ],
    user_detail : null
  }),

  created() {
    this.active_menu = this.$route.name
    // localStorage.setItem("userDetail",JSON.stringify({
    //   account_id : "00001",
    //   email : "Test20@gmail.com",
    //   first_name_en : "Test",
    //   first_name_th : "Test",
    //   last_name_en : "Test 01",
    //   last_name_th : "Test 01",
    //   role : { role_id : "01", role_name_th : "โค้ช",role_name_en : "coach" },
    //   roles : ["student"],
    //   tel : "0821241243",
    // }))
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"))
  },
  mounted() {
  
   
  },
  watch: {},
  computed: {
    ...mapGetters({
      titel_navber : "NavberUserModules/getTitleNavber"
    })
  },
  methods: {
    ...mapActions({
      logOut : "loginModules/logOut"
    }),
    selectMenu(type, to, head){
      if(type === "child" && head === this.active_menu ){
        this.active_menu_child = to
        this.$router.push({name: to})
      }else{
        this.active_menu_child = to
      }
      if(type === "head"){
        if(to){
          this.$router.push({name: to})
          this.active_menu_child = ""
          this.active_menu = to
        }
      }
    },
  },
};
</script>
<style>
 
  .bg-navbar-user{
    background: linear-gradient(141.48deg, #FF8092 43%, #FDCB6E 85.47%);
  }
  .menu-list{
    color: #333333 !important;
  }
  .active-menu-list{
    background: #FFF4FB;
    border-radius: 8px 0px 0px 8px;
    font-weight: 700;
    color: #333333 !important;
  }
  .menu-group-list{
    background: transparent;
  }
  .active-menu-group-list{
    background: #FFF4FB;
    border-radius: 8px 0px 0px 8px;
    color: #333333 !important;
  }
  .active-menu-group-list .v-list-item__title{ 
    color: #333333 !important;
  }
  .active-menu-group-list .v-list-item__icon{ 
    color: #333333 !important;
  }
  .active-menu-group-list-child{
    border-radius: 8px 0px 0px 8px;
    margin: 0px 0px 0px 24px;
    font-weight: 700;
    color: #FF6B81 !important;
  }
  .bottom-absolute{
    position: absolute;
    bottom: 0px;
    width: 100%;
  }
  .list-items-border-bottom {
    border-bottom: 1px solid #D9D9D9!important;
  }
  .img-profile{
    width: 112px;
    height: 112px;
    border-radius :100%;
    border: 6px solid #FF6B81;
  }
</style>