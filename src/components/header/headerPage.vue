<template>
  <v-row class="mb-8">
    <v-col class="submenu"> {{ title }} </v-col>
  </v-row>
</template>  
<script>
export default {
  name: "headerPage",
  props:{
    title:{type : String}
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
.submenu{
  font-weight: 600;
  color: #2F3542;
  font-size: 22px;
}
</style>
    