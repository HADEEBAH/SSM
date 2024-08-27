<template>
  <v-dialog v-model="dialog_detail" persistent max-width="600px">
    <v-card>
      <v-card-text class="pa-2">
        <v-row dense>
          <v-col></v-col>
          <v-col class="pa-0" cols="auto">
            <v-btn icon color="red" @click="closeDialogAssessment()"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <pre>{{ assessment_data }}</pre>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
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
    ...mapGetters({
      assessment_data: "CourseModules/getAssessmentStudent",
    }),
    dialog_detail: {
      get() {
        return this.statusBool;
      },
      set(val) {
        this.$emit("input", val); // Emit input event to update parent component
      },
    },
  },
  mounted() {
    this.GetAssessmentStudent({ checkIn_student_id: this.checkInStudentId });
  },
  methods: {
    ...mapActions({
      GetAssessmentStudent: "CourseModules/GetAssessmentStudent",
    }),
    closeDialogAssessment() {
      this.dialog_detail = false;
    },
  },
};
</script>

<style>
</style>