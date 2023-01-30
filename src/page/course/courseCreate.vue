<template>
  <v-app>
    <v-container>
      <headerPage title="สร้างคอร์ดเรียน"></headerPage>
    </v-container>
  </v-app>
</template>  
  <script>
  import headerPage from "@/components/header/headerPage.vue"
export default {
  name: "CourseCreate",
  components:{
    headerPage
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
.sub-menu {
  font-weight: 600;
  color: #2f3542;
  font-size: 22px;
}
</style>
      