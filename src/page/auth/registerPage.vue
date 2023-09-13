<template>
  <v-container>
    <register-dialog-form
      class="form-register-page"
      :style="$vuetify.breakpoint.smAndUp ?'width: 60vw' :'width: 100%' "
      :title="$t('register')"
    ></register-dialog-form>
  </v-container>
</template>
  
  <script>
import RegisterDialogForm from "@/components/user_menage/registerDialogForm.vue";
export default {
  components: {
    RegisterDialogForm,
  },
  data: () => ({
    menu_locale:false
  }),
  created(){
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale
      localStorage.setItem("lang",locale)
    },
  },
};
</script>
<style scoped>

</style>
  