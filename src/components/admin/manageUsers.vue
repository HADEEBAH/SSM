<template>
    <v-app>
      <v-container>
        <headerPage title="จัดการผู้ใช้งาน"></headerPage>
        <childHeader title="ผู้ใช้งานทั้งหมด" divider arrow_left></childHeader>
        
      </v-container>
    </v-app>
  </template>
  
  <script>
  import headerPage from "@/components/header/headerPage.vue";
  import childHeader from '@/components/header/childHeader.vue';
  export default {
    name: "manageUsers",
    components: {
      headerPage,
      childHeader,
    },
    props: {
      title: { type: String },
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
  