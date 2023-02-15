<template>
    <v-card-text>
        <v-row>
            <v-col cols="12" class="d-flex align-center justify-center">
                <v-img max-height="206" max-width="206" src="../../assets/dialog/sucess.png"></v-img>
            </v-col>
            <v-col cols="12" class="d-flex align-center justify-center text-xl">
                {{ text }}
            </v-col>
        </v-row>
    </v-card-text>
</template>
  
<script>
  export default {
    name:"dialogCard",
    props:{
        icon: {type: String},
        text: {type: String}
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
<style scoped>
   
</style>
  