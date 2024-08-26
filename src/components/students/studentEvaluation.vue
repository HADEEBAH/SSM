<template>
  <v-dialog v-model="dialog_detail" persistent max-width="600px">\ </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    statusBool: {
      type: Boolean,
      required: true,
    },
    checkInStudentId: {
      type: String,
      required: true,
    },
  },
  data: () => ({}),
  computed: {
    ...mapGetters({}),
    dialogStatus: {
      get() {
        return this.statusBool;
      },
      set(val) {
        this.$emit("input", val); // Emit input event to update parent component
      },
    },
  },
  mounted() {
    this.GetStudentData();
  },
  methods: {
    ...mapActions({}),
  },
};
</script>

<style>
</style>