<template>
    <v-card flat>
        <v-card-text :class="`bg-[${bg_color}] border`">
            <v-row>
                <v-col cols="auto">
                    <slot name="img"></slot>
                </v-col>
                <v-col>
                    <v-row>
                        <v-col>
                            <div class="text-md font-bold"> {{ title }} </div>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col v-if="course_name" cols="12" sm="4" class="pa-0">
                            <rowData mini  icon="mdi-bookshelf">{{ course_name }}</rowData>
                        </v-col>
                        <v-col v-if="package_name" cols="12" sm="4"  class="pa-0"> 
                            <rowData mini  icon=" mdi-account-box-multiple">{{ package_name }}</rowData>
                        </v-col>
                        <v-col v-if="course_per_time" cols="12" sm="4" class="pa-0">
                            <rowData mini  icon="mdi-clock-outline">{{ course_per_time }} ชม.</rowData>
                        </v-col>
                        <v-col v-if="period" cols="12" sm="4" class="pa-0">
                            <v-chip small color="#F9B320" dark>{{ period }}น.</v-chip>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
  
  <script>
  import rowData from '../label/rowData.vue';
  export default {
    name:"courseCardList",
    props:{
        title : {type: String},
        course_name : {type: String},
        course_per_time : {type : String},
        period : {type: String},
        package_name : {type: String,},
        bg_color : {type: String, default:'#FBF3F5'} 
    },
    components: {rowData},
    data: () => ({}),
    created() {},
    mounted() {},
    watch: {},
    computed: {},
    methods: {},
  };
  </script>
  