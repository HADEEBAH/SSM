<template>
  <v-row class="mb-4">
    <v-col class="sub-menu"> {{ title }} </v-col>
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
.sub-menu{
  font-weight: 600;
  color: #2F3542;
  font-size: 22px;
}
</style>
    