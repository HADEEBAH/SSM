<template>
  <v-container>
    <loading-overlay :loading="categorys_is_loading"></loading-overlay>
    <v-row>
      <v-col cols="12" class="webkit-center">
        <img src="@/assets/profile/policyAndrule.png" class="my-10" />
      </v-col>
      <v-col cols="12" class="text-center">
        <label class="font-weight-bold text-xl"
          >เงื่อนไขการใช้บริการและนโยบายการคุ้มครองข้อมูลส่วนบุคคล</label
        >
      </v-col>
      <v-col cols="12" class="text-center">
        <label class="font-weight-bold text-xl"
          >Term of Use and Personal Data Protection Policy</label
        >
      </v-col>
      <v-col cols="12">
        <TermOfUse />
      </v-col>
    </v-row>
  </v-container>
</template>
    
  <script>
import { mapActions, mapGetters } from "vuex";
import loadingOverlay from "@/components/loading/loadingOverlay.vue";
import TermOfUse from "@/components/termOfUse.vue";
export default {
  components: {
    loadingOverlay,
    TermOfUse,
  },
  data: () => ({}),
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "ข้อกำหนด");
  },
  methods: {
    ...mapActions({}),
  },
  computed: {
    ...mapGetters({
      categorys_is_loading: "CategoryModules/getCategorysIsLoading",
    }),
  },
};
</script>

  <style>
.webkit-center {
  text-align: -webkit-center;
}
</style>