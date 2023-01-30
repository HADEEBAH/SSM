<template>
  <div>
    <v-row>
      <v-col class="child-header"> 
        <v-icon v-if="arrow_left" size="30">mdi-chevron-left</v-icon>
        {{ title }} <span v-if="sub_title" class="sub-title" :style="`color:${sub_title_color};`">{{`( ${sub_title} )`}}</span>
      </v-col>
    </v-row>
    <v-divider v-if="divider" class="my-2"></v-divider>
  </div>
</template>  
<script>
  export default {
    name: "childHeader",
    props:{
      title:{type : String},
      sub_title:{type : String},
      sub_title_color:{type : String, default:"#8EC6A6"},
      arrow_left : {type : Boolean, default:false},
      divider : {type : Boolean, default:false},
    },
    data: () => ({}),

    created() {},

    mounted() {},

    watch: {},

    computed: {},

    methods: {},
  };
</script>
<style>
  .child-header{
    font-weight: 600;
    font-size: 22px;
  }
  .sub-title{
    font-weight: 700;
    font-size: 12px;
  }
</style>
      