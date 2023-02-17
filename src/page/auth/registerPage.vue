<template>
  <div class="flex align-center justify-center my-10" style="width: 100%; height: 100%;">
    <register-dialog-form
        :style="$vuetify.breakpoint.smAndDown ? 'width: 85vw'  : 'width: 50vw'"
        title="ลงทะเบียน"
    ></register-dialog-form>
  </div>
</template>
  
  <script>
import RegisterDialogForm from "../../components/user_menage/registerDialogForm.vue";
export default {
  components: {
    RegisterDialogForm,
  },
  data: () => ({}),
  mounted() {},
  watch: {},
  computed: {},
  methods: {},
};
</script>
<style scoped>

</style>
  