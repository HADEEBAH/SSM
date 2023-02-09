<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="auto" >
                    <slot name="img"></slot>
                </v-col>
                <v-col>
                    <v-row dense>
                        <v-col align="center" class="font-bold">{{ title }}</v-col>
                    </v-row>
                    <v-row dense class="d-flex align-center">
                        <v-col align="center" class="text-3xl font-bold">{{ count }}</v-col>
                        <v-col class="text-sm">{{ units }}</v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
  
  <script>
  export default {
    name:"imgCard",
    props:{
      title : {type:String},
      count : {type:String},
      units : {type:String},
    },
    components: {},
    data: () => ({}),
    created() {},
    mounted() {},
    watch: {},
    computed: {},
    methods: {},
  };
  </script>
  