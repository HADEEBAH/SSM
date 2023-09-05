<template>
  <v-container>
    <div v-if="certificates.length == 0" class="mx-5 my-5">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col class="text-center">
              {{ $t("no match information found") }}
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
    <div v-else class="mx-5 my-5">
      <v-card
        v-for="(certificate, certificate_index) in certificates"
        :key="certificate_index"
        class="my-5"
      >
        <div class="mx-5 my-2">
          <label class="text-xl font-bold">{{
            certificate.certificateName
          }}</label>
          <div class="text-slate-400">{{ certificate.race_day }}</div>
          <v-row class="my-2">
            <v-col cols="6" sm="1">
              <img src="@/assets/userManagePage/certificate .png" />
            </v-col>
            <v-col
              @click="openFile(certificate.certificateAttachment)"
              cols="6"
              sm="11"
              align="left"
              class="mt-1 cursor-pointer pink--text underline underline-offer4"
              >{{ certificate.originalFileName }}
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
    this.GetCertificateListByAccount({
      account_id: this.$route.params.account_id,
    });
  },
  methods: {
    ...mapActions({
      GetCertificateListByAccount:
        "UserManageModules/GetCertificateListByAccount",
    }),
    openFile(url) {
      window.open(url, "_blank");
    },
  },
  computed: {
    ...mapGetters({
      certificates: "UserManageModules/getCertificate",
    }),
  },
};
</script>

<style>
</style>