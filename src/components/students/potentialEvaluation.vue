<template>
  <v-dialog v-model="dialog_detail" persistent max-width="600px">
    <v-card>
      <v-card-text v-if="dataLoading" class="pa-2">
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="#ff6b81"
          ></v-progress-circular>
        </v-row>
      </v-card-text>
      <v-card-text class="pa-2" v-else>
        <v-row dense>
          <v-col></v-col>
          <v-col class="pa-0" cols="auto">
            <v-btn icon color="red" @click="closePotentialDialog()"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <v-row dense class="mb-3">
          <v-col align="center" class="font-bold text-lg">
            {{ $t("assessment") }}
          </v-col>
        </v-row>
        <v-card class="mb-3" outlined>
          <v-card-text>
            <v-row>
              <v-col cols="auto">
                <v-img
                  width="40"
                  height="40"
                  src="@/assets/course/potential.png"
                ></v-img>
              </v-col>
              <v-col cols class="font-bold text-lg"
                >{{ $t("assess the overview") }}
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-card flat>
                  <v-card-text class="bg-[#FBF3F5]">
                    <v-row dense>
                      <v-col>{{ $t("developmental level") }} </v-col>
                    </v-row>
                    <!-- ระดับพัฒนาการ -->
                    <!-- <v-row dense>
                      <v-col>
                        <v-select
                          outlined
                          dense
                          v-model="student_data_assessment.evolution"
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
                    </v-row> -->
                    <!-- ระดับความสนใจ -->
                    <!-- <v-row dense>
                      <v-col>
                        <span class="text-[#999999]">
                          {{ $t("interest level") }}:
                        </span>
                        {{ student_data_assessment.Interest || "-" }}
                      </v-col>
                    </v-row> -->
                    <!-- ความคิดเห็น -->
                    <!-- <v-row dense>
                      <v-col>
                        <span class="text-[#999999]"
                          >{{ $t("comments") }}:
                        </span>
                        {{ student_data_assessment.remark || "-" }}
                      </v-col>
                    </v-row> -->
                    <!-- ไฟล์แนบ -->
                    <!-- <v-row dense>
                          <v-col cols="12">
                            <b>{{ $t("attachments") }}: </b>
                            <v-card
                              outlined
                              @click="openFile(file.attachmentFiles)"
                              flat
                              class="mb-3"
                              v-for="(
                                file, index_file
                              ) in student_data_assessment.attachmentPotential"
                              :key="index_file"
                            >
                              <v-card-text
                                class="border-2 border-[#ff6b81] rounded-lg"
                              >
                                <v-row>
                                  <v-col align="center">
                                    <imgFileType
                                      :mime_type="file.filesType"
                                    ></imgFileType>
                                  </v-col>
                                  <v-col cols="12" sm="10" align="start">
                                    <span class="font-bold">{{
                                      file.originalFilesName
                                    }}</span
                                    ><br />
                                    <span class="text-caption"
                                      >{{ $t("file size") }} :
                                      {{
                                        (file.filesSize / 1000000).toFixed(2)
                                      }}
                                      MB</span
                                    >
                                  </v-col>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row> -->
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
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
    checkInId: {
      type: String,
      required: true,
    },
    // date: {
    //   type: String,
    //   required: true,
    // },
  },
  data: () => ({
    dataLoading: false,
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
  mounted() {},
  methods: {
    ...mapActions({
      GetAssessmentStudent: "CourseModules/GetAssessmentStudent",
    }),
    closePotentialDialog() {
      this.dialog_detail = false;
    },
  },
};
</script>

<style>
</style>