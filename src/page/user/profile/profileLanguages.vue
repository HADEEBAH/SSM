<template>
  <v-container>
    <v-row>
      <v-col align="center">
        <img src="../../../assets/profile/profileLanguages.png" />
      </v-col>
    </v-row>
    <!-- TH -->
    <v-card class="my-10">
      <v-row>
        <v-col cols="2" sm="1" class="mx-3 my-4">
          <img src="../../../assets/profile/thaiFlag.png" />
        </v-col>
        <v-col cols="7" sm="8" class="my-4 text-xl font-bold">
          <label>ภาษาไทย</label>
        </v-col>
        <v-col cols="2" sm="auto">
          <v-radio-group>
            <input
              class="form-check-input"
              type="radio"
              v-model="selectedOption"
              name="radioGroup"
              value="option2"
            />
          </v-radio-group>
        </v-col>
      </v-row>
    </v-card>
    <!-- US -->
    <v-card>
      <v-row>
        <v-col cols="2" sm="1" class="mx-3 my-4">
          <img src="../../../assets/profile/usaFlag.png" />
        </v-col>
        <v-col cols="7" sm="8" class="my-4 text-xl font-bold">
          <label>English</label>
        </v-col>
        <v-col cols="2" sm="auto">
          <v-radio-group>
            <input
              class="form-check-input"
              type="radio"
              v-model="selectedOption"
              name="radioGroup"
              value="option3"
            />
          </v-radio-group>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({ selectedOption: "" }),
  mounted() {
    this.$store.dispatch("NavberUserModules/changeTitleNavber", "เลือกภาษา");
  },
  methods: {
    ...mapActions({
      ChangePassword: "ProfileModules/ChangePassword",
    }),
  },
  computed: {
    ...mapGetters({
      password: "ProfileModules/getPassword",
    }),
  },
};
</script>

<style scoped></style>
