<template>
  <v-row class="mb-4 d-flex align-center">
    <v-col v-if="!breadcrumbs" class="text-xl font-bold"> {{ title }} </v-col>
    <v-col v-if="breadcrumbs"> 
      <v-row>
        <template v-for="( data, index ) in breadcrumbs" >
          <v-col cols="auto" :key="`${index}-col`" @click="data.to ? $router.push({name : data.to}) : ''">
            <label class="text-xl" :class="data.to ? 'cursor-pointer' : 'font-bold' ">{{ data.text }}</label>
          </v-col>
          <v-icon v-if="index !== breadcrumbs.length -1" :key="index">mdi-chevron-right</v-icon>
        </template>
      </v-row>
    </v-col>
    <v-col v-if="slot_tag" cols="12" sm="auto" align="right">
      <slot></slot>
    </v-col>
  </v-row>
</template>  
<script>
export default {
  name: "headerPage",
  props:{
    title:{type : String},
    breadcrumbs : {type: Array},
    slot_tag: {type: Boolean}
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
    