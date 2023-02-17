<template>
    <v-card :flat="flat" :outlined="outlined">
        <v-card-text :class="`bg-[${color}]`">
            <v-row>
                <v-col :cols="vertical ? '12':'auto'" align="center">
                    <slot name="img"></slot>
                </v-col>
                <v-col v-if="!vertical">
                    <v-row dense>
                        <v-col>
                            <slot name="header"></slot>
                        </v-col>
                    </v-row>
                    <v-row dense class="d-flex align-center">
                        <v-col>
                             <slot name="detail"></slot>
                        </v-col>
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
        flat : {type: Boolean},
        outlined : {type: Boolean},
        color : {type: String},
        vertical : {type: Boolean, default: false},  
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
  