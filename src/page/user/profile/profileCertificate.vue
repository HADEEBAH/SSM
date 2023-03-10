<template>
  <v-container>
    <div class="mx-5 my-5">
      <v-card
        v-for="(certificate, certificate_index) in certificate_data"
        :key="certificate_index"
        class="my-5"
      >
        <div class="mx-5 my-2">
          <label class="text-xl font-bold">{{
            certificate.certificate_title
          }}</label>
          <div class="text-slate-400">{{ certificate.race_day }}</div>
          <v-row class="my-2">
            <v-col cols="6" sm="1">
              <img src="../../../assets/userManagePage/certificate .png" />
            </v-col>
            <v-col
              cols="6"
              sm="11"
              align="left"
              class="mt-1 cursor-pointer pink--text underline underline-offer4"
              @click="downloadCertificate(certificate.certificate_card)"
              >{{ certificate.certificate_card }}
            </v-col>
          </v-row>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  components: {},
  data: () => ({}),
  mounted() {
    this.$store.dispatch(
      "NavberUserModules/changeTitleNavber",
      "การแข่งขันและ..."
    );
  },
  methods: {
    ...mapActions({
      ChangeCertificateData: "ProfileModules/ChangeCertificateData",
    }),
    downloadCertificate(url) {
console.log(url);
      },
  },
  computed: {
    ...mapGetters({
      certificate_data: "ProfileModules/getCertificateData",
    }),
  },
};
</script>

<style>
</style>