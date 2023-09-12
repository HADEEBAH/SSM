<template>
  <div>
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
