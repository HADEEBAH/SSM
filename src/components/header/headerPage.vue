<template>
  <v-row class="mb-4 d-flex align-center">
    <v-col v-if="!breadcrumbs" class="sub-menu"> {{ title }} </v-col>
    <v-col v-if="breadcrumbs" class="sub-menu"> 
      <v-row>
        <template v-for="( data, index ) in breadcrumbs" >
          <v-col cols="auto" :key="`${index}-col`" @click="data.to ? $router.push({name : data.to}) : ''">
            <label class="sub-menu" :class="data.to ? 'cursor-pointer' : ''">{{ data.text }}</label>
          </v-col>
          <v-icon v-if="index !== breadcrumbs.length -1 " class="sub-menu" :key="index">mdi-chevron-right</v-icon>
        </template>
      </v-row>
    </v-col>
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
    