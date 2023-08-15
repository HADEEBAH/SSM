<template>
    <v-card-text>
        <v-row>
            <v-col cols="12" class="d-flex align-center justify-center">
                
                <slot v-if="hasFooterSlot" name="img"></slot>
                <template v-else>
                    <v-img v-if="checkmark" max-height="100" max-width="100" src="@/assets/dialog/success_user.png"></v-img>
                    <v-img v-else max-height="206" max-width="206" src="@/assets/dialog/sucess.png"></v-img>
                </template>
            </v-col>
            <v-col cols="12" class="d-flex align-center justify-center text-xl font-bold">
                {{ text }}
            </v-col>
            <v-col cols="12" class="d-flex align-center justify-center text-sm text-[#999999]">
                {{ subtitle }}
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <slot name="btn"></slot>
            </v-col>
        </v-row>
    </v-card-text>
</template>
  
<script>
  export default {
    name:"dialogCard",
    props:{
        icon: {type: String},
        text: {type: String},
        checkmark: {type: Boolean},
        subtitle : {type : String}
    },
    components: {},
    data: () => ({}),
    created() {},
    mounted() {},
    watch: {},
    computed: {
        hasFooterSlot() {
            return !!this.$slots.img;
        }
    },
    methods: {},
  };
</script>
<style scoped>
   
</style>
  