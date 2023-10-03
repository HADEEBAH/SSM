
<template>
  <div style="overflow-y: hidden">
    <v-app>
      <v-img
        src="@/assets/login/logo.png"
        class="logo"
        max-height="40"
        max-width="50"
      ></v-img>
      <v-container>
        <v-img
          src="@/assets/login/boy.png"
          :class="MobileSize ? 'boysm' : 'boypc'"
        ></v-img>

        <v-row class="d-flex align-center justify-center">
          <v-col cols="12" sm="4">
            <loginForm
              bottomtext
              :class="MobileSize ? 'cardsm' : 'cardpc'"
            ></loginForm>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>
  
  <script>
import loginForm from "@/components/user_menage/loginForm.vue";

export default {
  components: {
    loginForm,
  },

  computed: {
    MobileSize() {
      const { xs } = this.$vuetify.breakpoint;
      return !!xs;
    },
    IpadSize() {
      const { sm } = this.$vuetify.breakpoint;
      return !!sm;
    },
  },
};
</script>
  
  <style scoped>
/* #app {
    background: url("@/assets/login/user-login-bg.png") 
    no-repeat !important;
    background-size: cover;
  } */

#app {
  background-image: url("@/assets/login/bgUserLogin.png");
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}

.logo {
  margin-top: 10px;
  margin-right: 5px;
}

.boysm {
  margin-top: 10px;
  margin: auto;
  display: block;
  max-height: 200px;
  max-width: 150px;
}

.boypc {
  margin-top: 10px;
  margin: auto;
  display: block;
  max-height: 250px;
  max-width: 200px;
}

.cardsm {
  margin-top: -30px;
}
.cardpc {
  margin-top: -80px;
}
</style>