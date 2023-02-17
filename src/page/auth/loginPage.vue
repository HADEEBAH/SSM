<template>
  <!-- <v-app> -->
    <!-- <v-container> -->
      <div
        class="d-flex align-center justify-center"
        style="width: 100%; height: 100%"
      >
      <loginForm image></loginForm>
      </div>

    <!-- </v-container> -->
  <!-- </v-app> -->
</template>

<script>
import loginForm from"@/components/user_menage/loginForm.vue"

export default {
  components:{
    loginForm,
  },
 
};
</script>

<style scoped>

</style>