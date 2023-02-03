<template>
    <div>
        <v-card-title>
            <v-row>
                <v-col class="font-bold"> 
                    <v-icon v-if="icon" :color="icon_color" size="30">{{ icon }}</v-icon>
                    {{ title }}
                </v-col>
                <v-col cols="auto">
                    <slot name="actions"></slot>
                </v-col>
            </v-row>
        </v-card-title>
        <v-divider v-if="divider"></v-divider>
    </div>
  </template>  
  <script>
    export default {
      name: "headerCard",
      props:{
        title:{type : String},
        sub_title:{type : String},
        sub_title_color:{type : String, default:"#8EC6A6"},
        icon : {type : String,},
        icon_color : {type : String,},
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
        