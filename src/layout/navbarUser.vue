<template>
  <v-app>
    <v-layout>
      <v-app-bar app clipped-right class="bg-navbar-user" dark fixed elevation="0" >
        <v-app-bar-nav-icon><v-icon>mdi-chevron-left</v-icon></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-app-bar-title>{{ $route.name }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-badge class="mr-5" overlap color="#F03D3E" content="1" message="1">
          <v-icon dark>mdi-bell-outline</v-icon>
        </v-badge>
        <v-badge class="mr-5" overlap color="#F03D3E" content="1" message="1">
          <v-icon dark>mdi-cart</v-icon>
        </v-badge>
        <div v-if="!$vuetify.breakpoint.smAndDown">
          <v-avatar class="mx-2" size="24">
            <v-img src="https://cdn.vuetifyjs.com/images/lists/4.jpg" size="24" />
          </v-avatar>
          <span class="text-white mx-2">{{ user.full_name }}</span>
        </div>
        <v-btn icon @click="drawer =!drawer">
          <v-icon>{{ drawer ? 'mdi-chevron-right':"mdi-menu" }}</v-icon>
        </v-btn>
       
      </v-app-bar>
      <v-navigation-drawer 
        right
        clipped 
        app
        v-model="drawer"
        :temporary="$vuetify.breakpoint.smAndDown"
      >
        <v-row class="pt-8 pb-6">
          <v-col class="flex align-center justify-center ">        
            <img class="img-profile" src="../assets/navbar/drawer_img.png"/>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" class="flex align-center justify-center font-bold text-lg">
            จิตรลดา  สุวรรณโชค
          </v-col>
          <v-col cols="12" class="flex align-center justify-center text-sm">
            jittalada197@gmail.com
          </v-col>
        </v-row>
        <v-list
          nav
        >
          <div v-for="(list, list_index) in menu_drawer_list" :key="list_index" >
            <v-list-item :class="menu_drawer_list.length-1 !== list_index ? 'list-items-border-bottom' : ''">
              <v-list-item-avatar><v-icon color="#ff6b81">{{ list.icon }}</v-icon></v-list-item-avatar>
              <v-list-item-title>{{ list.title }}</v-list-item-title>
            </v-list-item>
          </div>
        </v-list>
      </v-navigation-drawer>
      <v-main class="bg-admin">
          <router-view />
          <v-footer dark padless class="text-white bg-navbar-user rounded-t-xl">
            <v-container>
              <v-row dense align="center" class="mb-2" > 
                  <v-col cols>
                    <v-row dense>
                      <v-col class="font-bold">ติดต่อเราได้ที่</v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="auto" class="font-bold"><v-icon dark>mdi-email</v-icon></v-col>
                      <v-col class="font-medium"><v-icon dark>mdi-chat</v-icon></v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="auto" class="font-bold"><v-icon dark>mdi-facebook</v-icon></v-col>
                      <v-col class="font-medium">Warraphat Learning Sphere</v-col>
                    </v-row>
                    <v-row dense>
                      <v-col cols="auto" ><v-icon dark>mdi-phone</v-icon></v-col>
                      <v-col class="font-medium">074 - 236020, 074-221142, 0649092140</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="auto" class="pa-4 bg-white" align="center">
                    <v-img src="../assets/navbar/qr-footer.png" max-height="96" max-width="89"></v-img>
                  </v-col>
                </v-row>
                <v-row dense class="text-caption border-t">
                  <v-col col="12" sm=""> Copyright 2022 Tourish Promp. All rights reserved . Design by UI</v-col>
                  <v-col col="12" sm="auto">
                     All rights reserved .  | Terms and Coditions | Privacy Police
                  </v-col>
                </v-row>
            </v-container>
          </v-footer> 
      </v-main>
    </v-layout>
    
  </v-app>
</template>

<script>
export default {
  name: "navbarUser",
  data: () => ({
    menu : false,
    drawer : false,
    active_menu : "",
    active_menu_child : "",
    user: {
      full_name: "John Doe",
      email: "john.doe@doe.com",
    },
    menu_drawer_list:[
      { icon: "mdi-account-circle", title : "โปรไฟล์", to:""},
      { icon: "mdi-calendar-month", title : "ตารางเรียน", to:""},
      { icon: "mdi-history", title : "ประวัติการสั่งซื้อ", to:""},
      { icon: "mdi-logout", title : "ออกจากระบบ", to:""},
    ]
  }),

  created() {
    this.active_menu = this.$route.name
  },
  mounted() {
    
  },
  watch: {},
  computed: {},
  methods: {
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
  .bg-admin .v-container{
    background :linear-gradient(0deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04)), linear-gradient(141.48deg, #FFFAFB 14.35%, #FFFDFA 85.47%);
  }
  .bg-navbar-user{
    background: linear-gradient(141.48deg, #FF6B81 14.35%, #FDCB6E 85.47%);
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