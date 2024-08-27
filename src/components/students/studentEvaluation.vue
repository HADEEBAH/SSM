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
        <v-row dense class="mb-3">
          <v-col align="center" class="font-bold text-lg">
            {{ $t("assessment") }}
            {{ date }}
          </v-col>
        </v-row>
        <v-card
          class="mb-3"
          v-for="(assess, index) in assessment_data"
          :key="`${index}-assess`"
        >
          <!-- <pre>{{ assess }}</pre> -->
          <v-card-text>
            <v-row dense>
              <v-col cols="auto">
                <v-icon color="#ff6b81">mdi-calendar-month</v-icon>
              </v-col>
              <v-col class="font-bold">
                {{
                  new Date(assess.date).toLocaleDateString(
                    $i18n.locale == "th" ? "th-TH" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )
                }}
              </v-col>
              <v-col cols="auto">
                <v-chip
                  class="font-bold"
                  :color="
                    check_in_status_options.filter(
                      (v) => v.value === assess.status
                    )[0].bg_color
                  "
                  :style="`color:${
                    check_in_status_options.filter(
                      (v) => v.value === assess.status
                    )[0].color
                  }`"
                  v-if="
                    check_in_status_options.filter(
                      (v) => v.value === assess.status
                    )?.length > 0
                  "
                  >{{
                    $t(
                      check_in_status_options.filter(
                        (v) => v.value === assess.status
                      )[0].label
                    )
                  }}
                </v-chip>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col> {{ $t("developmental level") }}</v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-select
                  outlined
                  dense
                  v-model="assess.evolution"
                  :items="evolution_options"
                  hide-details
                  readonly
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-rating
                          readonly
                          :length="item.num_value"
                          :value="item.num_value"
                          color="#ff6b81"
                        ></v-rating>
                      </v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <template v-slot:selection="{ item }">
                    <v-rating
                      readonly
                      :length="item.num_value"
                      :value="item.num_value"
                      color="#ff6b81"
                    ></v-rating>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col> {{ $t("interest level") }}</v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-select
                  outlined
                  dense
                  v-model="assess.interest"
                  :items="interest_options"
                  hide-details
                  readonly
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-rating
                          readonly
                          :length="item.num_value"
                          :value="item.num_value"
                          color="#ff6b81"
                        ></v-rating>
                      </v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <template v-slot:selection="{ item }">
                    <v-rating
                      readonly
                      :length="item.num_value"
                      :value="item.num_value"
                      color="#ff6b81"
                    ></v-rating>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <span class="text-[#999999]"> {{ $t("comments") }}: </span
                >{{ assess.remark }}
              </v-col>
            </v-row>
            <v-card
              outlined
              flat
              class="mb-3"
              v-for="(file, index_file) in assess.attachmentAssessment"
              @click="openFile(file.attachmentFiles)"
              :key="index_file"
            >
              <v-card-text class="border-2 border-[#ff6b81] rounded-lg">
                <v-row>
                  <v-col align="center">
                    <imgFileType :mime_type="file.filesType"></imgFileType>
                  </v-col>
                  <v-col cols="12" sm="10" align="start">
                    <span class="font-bold">{{ file.attachmentFiles }}</span
                    ><br />
                    <span class="text-caption"
                      >{{ $t("file size") }} :
                      {{ (file.filesSize / 1000000).toFixed(2) }}
                      MB</span
                    >
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import imgFileType from "@/components/file_type/imgFileType.vue";

export default {
  components: { imgFileType },
  props: {
    statusBool: {
      type: Boolean,
      required: true,
    },
    checkInId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    check_in_status_options: [
      {
        label: "punctual",
        value: "punctual",
        color: "#58A144",
        bg_color: "#F0F9EE",
      },
      { label: "late", value: "late", color: "#FCC419", bg_color: "#FFF9E8" },
      { label: "leave", value: "leave", color: "#43A4F5", bg_color: "#CFE2F3" },
      {
        label: "emergency leave",
        value: "emergency leave",
        color: "#43A4F5",
        bg_color: "#CFE2F3",
      },
      {
        label: "absent",
        value: "absent",
        color: "#F03D3E",
        bg_color: "#F4CCCC",
      },
    ],
    evolution_options: [
      { label: "ดีมาก", value: "very good", num_value: 5 },
      { label: "ดี", value: "good", num_value: 4 },
      { label: "ปรับปรุง", value: "adjust", num_value: 3 },
    ],
    interest_options: [
      { label: "ดีมาก", value: "very good", num_value: 5 },
      { label: "ดี", value: "good", num_value: 4 },
      { label: "ปรับปรุง", value: "adjust", num_value: 3 },
    ],
  }),
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
    this.GetAssessmentStudent({
      checkin_id: this.checkInId,
      date: this.date,
    });
  },
  methods: {
    ...mapActions({
      GetAssessmentStudent: "CourseModules/GetAssessmentStudent",
    }),
    closeDialogAssessment() {
      this.dialog_detail = false;
    },
    openFile(file) {
      let fileName = `${process.env.VUE_APP_URL}/api/v1/files/${file}`;
      window.open(fileName, "_blank");
    },
  },
};
</script>

<style>
</style>