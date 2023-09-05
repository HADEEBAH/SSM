<template>
  <div>
    <v-row>
      <v-col class="text-right">
        <v-menu v-model="menu_locale"  offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text color="#ff6b81" v-bind="attrs" v-on="on">
              <label>{{ $i18n.locale == 'en' ? $t('english') : $t('thai') }}</label>
              <v-icon dark >
                mdi-web
              </v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-list-item @click="setLocale('en')">
              {{ $t('english') }}
            </v-list-item>
            <v-list-item  @click="setLocale('th')">
              {{ $t('thai') }} 
            </v-list-item>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
    <div
      class="d-flex align-center justify-center"
      style="width: 100%; height: 100%"
    >
      <loginForm image></loginForm>
    </div>
  </div>

</template>

<script>
import loginForm from "@/components/user_menage/loginForm.vue";

export default {
  components: {
    loginForm,
  },
  data: () => ({
    menu_locale:false
  }),
  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale
      localStorage.setItem("lang",locale)
    },
  },
};
</script>

<style scoped></style>
