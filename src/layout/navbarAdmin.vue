<template>
  <v-app>
    <v-layout>
      <v-app-bar clipped-left app dark fixed elevation="0" src="../assets/navbar/bg-nav-bar.png">
        <v-app-bar-nav-icon @click="drawer = !drawer" > <v-icon >{{ drawer ? 'mdi-chevron-double-left':'mdi-dots-vertical' }}</v-icon>  </v-app-bar-nav-icon>
        <!-- <v-app-bar-title><v-img max-height="37" max-width="51" src="../assets/navbar/title_img.jpg"></v-img></v-app-bar-title> -->
        <v-spacer></v-spacer>
        <v-badge class="mr-5" overlap color="#F03D3E" content="1" message="1">
          <v-icon dark>mdi-bell-outline</v-icon>
        </v-badge>
        <div v-if="!$vuetify.breakpoint.smAndDown">
          <v-avatar class="mr-2" size="24">
            <v-img src="https://cdn.vuetifyjs.com/images/lists/4.jpg" size="24" />
          </v-avatar>
          <span class="text-white">{{ user.full_name }}</span>
        </div>
        <v-menu 
          v-model="menu"
          :close-on-content-click="false"
          bottom 
          min-width="200px" 
          rounded 
          offset-y>
          <template v-slot:activator="{ on }">
            <v-btn  icon x-large v-on="on" dark>
              <v-icon>{{$vuetify.breakpoint.smAndDown? "mdi-dots-vertical" : menu ? "mdi-chevron-up":"mdi-chevron-down" }}</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar color="brown">
                  <v-img src="https://cdn.vuetifyjs.com/images/lists/4.jpg" size="24" />
                </v-avatar>
                <h3>{{ user.full_name }}</h3>
                <p class="text-caption mt-1">
                  {{ user.email }}
                </p>
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text> Edit Profile 
                  <v-icon>mdi-account-edit-outline</v-icon>
                </v-btn>
                <v-divider class="my-3"></v-divider>  
                <v-btn depressed rounded text> Login
                  <v-icon>mdi-logout</v-icon>
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
      </v-app-bar>
      <v-navigation-drawer 
        clipped
        app
        v-model="drawer"
        :temporary="$vuetify.breakpoint.smAndDown"
      >
        <v-row>
          <v-col class="flex align-center justify-center">
            <v-img src="../assets/navbar/drawer_img.png" max-height="115" max-width="115"></v-img>
          </v-col>
        </v-row>
        <v-list
          class="pr-0"
          nav
          flat
        >
          <div v-for="(list, list_index) in menu_drawer_list" :key="list_index" >
            <v-list-item  :class="active_menu === list.to ? 'active-menu-list' : ''" @click="selectMenu('head',list.to)" link v-if="list.child.length === 0">
              <v-list-item-title>{{ list.title }}</v-list-item-title>
            </v-list-item>
            <v-list-group v-else 
              :value="active_menu === list.title "
              :active-class="active_menu === list.title ? 'active-menu-list' : ''"
              @click="active_menu = list.title"
              >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ list.title }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                @click="selectMenu('child',child.to, list.title)"
                :class="active_menu_child === child.to ? 'active-menu-group-list-child' : 'ml-8 menu-group-list'" 
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
          <v-list-item link >
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
export default {
  name: "navbarAdmin",
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
      { title : "แดชบอร์ด", to:"", child :[], }, // to ให้ใส่ name ของ router
      { title : "ตารางเรียน", to:"", child :[]},
      { title : "เพิ่มผู้เรียน", to:"Addlearn", child :[]},
      { title : "คอร์สเรียน", to:"", child :[
        { title : "จัดการคอร์สทั้งหมด", to:"CourseList" },
        { title : "สร้างคอร์สเรียน", to:"CourseCreate" },
        { title : "สร้างอาณาจักร", to:"Kingdom" },
      ]},
      { title : "การเงิน", to:"Finance", child :[]},
      { title : "จัดการผู้ใช้งาน", to:"", child :[
        {title : "จัดการผู้ใช้งาน", to:"UserMenagePage"},
        {title : "จัดการสิทธิ์", to:"A"},
      ]},
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
        this.$router.push({name: to})
        this.active_menu_child = ""
        this.active_menu = to
      }
    },
  },
};
</script>
<style>
  .bg-admin .v-container{
    background :linear-gradient(0deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04)), linear-gradient(141.48deg, #FFFAFB 14.35%, #FFFDFA 85.47%);
    
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
  
</style>