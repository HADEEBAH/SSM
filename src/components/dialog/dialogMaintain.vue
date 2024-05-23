<template>
  <v-dialog
    :value="alertMaintain.isAlert"
    class="rounded-xl"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title>
        <v-row dense>
          <v-col align="end">
            <v-btn icon @click="CloseAlert(false)"
              ><v-icon color="red">mdi-close</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <div align="center" class="mb-3">
          <v-img
            src="@/assets/dialog/schedule_maintain.png"
            width="120"
            height="120"
          ></v-img>
        </div>
        <div class="text-center mb-3">
          <strong class="text-lg">{{ alertMaintain?.title }}</strong>
        </div>
        <div class="text-base text-center">
          {{ alertMaintain?.detail }}
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from "vuex/dist/vuex.common.js";

export default {
  props: {
    alertMaintain: {
      type: Object,
    },
  },
  data: () => ({}),
  methods: {
    ...mapMutations({
      CloseAlert: "alertMaintainModules/CloseAlert",
    }),
  },
};
</script>

<style>
</style>