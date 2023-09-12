<template>
  <div>
    <div class="flex align-center justify-center my-10" style="width: 100%; height: 100%;">
      <register-dialog-form
          :style="$vuetify.breakpoint.smAndDown ? 'width: 85vw'  : 'width: 50vw'"
          :title="$t('register')"
      ></register-dialog-form>
    </div>
  </div>
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
  