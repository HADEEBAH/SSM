<template>
  <v-row class="mb-4 d-flex align-center">
    <v-col v-if="breadcrumbs" class="sub-menu"> {{ title }} </v-col>
    <v-col cols="12" sm="auto" align="right">
      <slot></slot>
    </v-col>
  </v-row>
</template>  
<script>
export default {
  name: "headerPage",
  props:{
    title:{type : String},
    breadcrumbs : {type: Array}
  },
  data: () => ({}),

  created() {},

  mounted() {},

  watch: {},

  computed: {},

  methods: {},
};
</script>
<style scoped>
</style>
    