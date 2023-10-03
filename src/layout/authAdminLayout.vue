<template>
    <v-app>
      <v-row dense class="auth-bar">
        <v-col cols="6" sm="" :class="$vuetify.breakpoint.smAndUp ? 'text-right' : 'text-left'">
          <v-menu v-model="menu_locale" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn :color="$vuetify.breakpoint.smAndUp?  '#ff6b81' : '#ffffff' " class="mr-2" text v-bind="attrs" v-on="on">
                <v-img
                  class="mr-2"
                  v-if="$i18n.locale == 'en'"
                  src="@/assets/profile/usaFlag.png"
                ></v-img>
                <v-img
                  class="mr-2"
                  v-else
                  src="@/assets/profile/thaiFlag.png"
                ></v-img>
                <label>{{
                  $i18n.locale == "en" ? $t("english") : $t("thai")
                }}</label>
              </v-btn>
            </template>
            <v-card>
              <v-list-item @click="setLocale('en')">
                <v-list-item-avatar size="sm">
                  <v-img src="@/assets/profile/usaFlag.png"></v-img>
                </v-list-item-avatar>
                {{ $t("english") }}
              </v-list-item>
              <v-list-item @click="setLocale('th')">
                <v-list-item-avatar size="sm">
                  <v-img src="@/assets/profile/thaiFlag.png"></v-img>
                </v-list-item-avatar>
                {{ $t("thai") }}
              </v-list-item>
            </v-card>
          </v-menu>
        </v-col>
        <v-col cols="6" sm="auto" class="text-right">
          <v-btn
            @click="backToHome()"
            text
            dark
            color="#FF6B81"
          >
            <v-icon class="mr-2">mdi mdi-home</v-icon> {{ $t('return to home page') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-app>
  </template>
  <script>
  import router from "@/router";
  export default {
    components: {},
    data: () => ({
      menu_locale:false
    }),
    created(){
    },
    mounted() {},
    watch: {},
    computed: {},
    methods: {
      backToHome() {
        router.push({ name: "UserKingdom" });
      },
      setLocale(locale) {
        this.$i18n.locale = locale
        localStorage.setItem("lang",locale)
      },
    },
  };
  </script>
  <style scoped>
  #app {
    background: url("@/assets/login/login-bg.jpg") no-repeat !important;
    background-size: cover;
  }
  </style>