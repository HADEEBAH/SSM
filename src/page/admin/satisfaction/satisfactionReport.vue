<template>
  <v-container>
    <headerPage :title="$t('satisfaction score')"></headerPage>
    <v-row class="mb-3">
      <v-col cols="12" lg="3">
        <v-card outlined rounded="lg">
          <v-card-text class="text-left">
            <v-row>
              <v-col class="d-flex justify-center align-center">
                <v-icon size="50" color="#89d767">mdi-chart-areaspline</v-icon>
              </v-col>
              <v-col align="center">
                <div class="text-base font-bold">{{ $t("average") }}</div>
                <span class="text-xl font-bold">{{
                  satisfactions.AverageRate
                }}</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="">
        <v-row>
          <v-col cols="6" lg="">
            <v-card outlined rounded="lg">
              <v-card-text>
                <v-row>
                  <v-col align="center">
                    <v-img
                      height="50"
                      width="50"
                      src="@/assets/star/5-stars.png"
                    ></v-img>
                  </v-col>
                  <v-col class="d-flex align-center justify-center">
                    <span class="text-lg font-bold">{{
                      satisfactions.fiveStar
                    }}</span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" lg="">
            <v-card outlined rounded="lg">
              <v-card-text>
                <v-row>
                  <v-col align="center">
                    <v-img
                      height="50"
                      width="50"
                      src="@/assets/star/4-stars.png"
                    ></v-img>
                  </v-col>
                  <v-col class="d-flex align-center justify-center">
                    <span class="text-lg font-bold">{{
                      satisfactions.fourStar
                    }}</span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" lg="">
            <v-card outlined rounded="lg">
              <v-card-text>
                <v-row>
                  <v-col align="center">
                    <v-img
                      height="50"
                      width="50"
                      src="@/assets/star/3-stars.png"
                    ></v-img>
                  </v-col>
                  <v-col class="d-flex align-center justify-center">
                    <span class="text-lg font-bold">{{
                      satisfactions.threeStar
                    }}</span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" lg="">
            <v-card outlined rounded="lg">
              <v-card-text>
                <v-row>
                  <v-col align="center">
                    <v-img
                      height="25"
                      width="25"
                      src="@/assets/star/star.png"
                    ></v-img>
                    <v-img
                      height="25"
                      width="25"
                      src="@/assets/star/star.png"
                    ></v-img>
                  </v-col>
                  <v-col class="d-flex align-center justify-center">
                    <span class="text-lg font-bold">{{
                      satisfactions.twoStar
                    }}</span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" lg="">
            <v-card outlined rounded="lg">
              <v-card-text>
                <v-row>
                  <v-col align="center">
                    <v-img
                      height="50"
                      width="50"
                      src="@/assets/star/star.png"
                    ></v-img>
                  </v-col>
                  <v-col class="d-flex align-center justify-center">
                    <span class="text-lg font-bold">{{
                      satisfactions.oneStar
                    }}</span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- <pre>{{ getLoop }}</pre> -->
    <div>
      <v-simple-table style="width: 100%" height="289px" class="my-5 table">
        <template v-slot:default>
          <thead fixed-header>
            <tr class="text-center">
              <th class="text-center" colspan="8">
                {{ $t("system satisfaction") }}
              </th>

              <th colspan="4" class="text-center">
                {{ $t("dashboard satisfaction") }}
              </th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th class="text-center" colspan="1">{{ $t("overview") }}</th>
              <th class="text-center" colspan="1">{{ $t("ease of use") }}</th>
              <th class="text-center" colspan="1">
                {{ $t("service stability") }}
              </th>
              <th class="text-center" colspan="5">
                {{ $t("recommendations System satisfaction") }}
              </th>
              <th class="text-center" colspan="1">
                {{ $t("dashboard display and system design") }}
              </th>
              <th class="text-center" colspan="3">
                {{ $t("dashboard Satisfaction Recommendations") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in transformedData" :key="user.accountId">
              <td class="text-center" colspan="1">
                {{ user[$t("overview")] || "0" }}
              </td>
              <td class="text-center" colspan="1">
                {{ user["ความง่ายและดวกในการใช้งาน"] || "0" }}
              </td>
              <td class="text-center" colspan="1">
                {{ user["ความเสถียรภาพของบริการ"] || "0" }}
              </td>
              <td class="text-center" colspan="5">
                {{ user["ความพึงพอใจของระบบ Remark"] || "" }}
              </td>
              <td class="text-center" colspan="1">
                {{
                  user[
                    "การแสดงผลและการออกแบบระบบ เข้าใจง่าย มีข้อมูลครบตามต้องการ"
                  ] || "0"
                }}
              </td>
              <td class="text-center" colspan="3">
                {{ user["ความพึงพอใจของ Dashboard Remark"] || "" }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <!-- <v-data-table
        class="elevation-1 header-table"
        :headers="column"
        :items="satisfactions.list"
      ></v-data-table> -->
    </div>
  </v-container>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import { mapActions, mapGetters } from "vuex";
// const star = require("@/assets/star/star.png")
export default {
  name: "SatifactionReport",
  data() {
    return {
      transformedData: [],
      questionsSet: [],
      surveysSet: [],
    };
  },
  components: { headerPage },
  computed: {
    ...mapGetters({
      satisfactions: "satisfactionModules/satisfactions",
    }),
    column() {
      return [
        {
          text: this.$t("first name - last name"),
          align: "center",
          sortable: false,
          value: this.$i18n.locale == "th" ? "nameTh" : "nameEn",
        },
        {
          text: this.$t("rate"),
          align: "center",
          sortable: true,
          value: "nameEn",
        },
        {
          text: this.$t("suggestions"),
          align: "start",
          sortable: false,
          value: "remark",
        },
      ];
    },
  },
  async created() {
    const user_detail = JSON.parse(localStorage.getItem("userDetail"));
    if (!["yuthyuth", "jirayut2539"].includes(user_detail.username)) {
      await this.$router.push({ name: "Dashboard" });
    }
    await this.GetSatisfactionList();
    await this.transformData();
  },
  async mounted() {
    await this.GetSatisfactionList();
    await this.transformData();
  },
  methods: {
    ...mapActions({
      GetSatisfactionList: "satisfactionModules/GetSatisfactionList",
    }),
    transformData() {
      const surveyList = this.satisfactions.list;
      const normalizedData = [];
      const questionsSet = new Set();
      const surveysSet = new Set();

      surveyList.forEach((user) => {
        const userData = {
          accountId: user.accountId,
          nameTh: user.nameTh,
          nameEn: user.nameEn,
          createdDate: user.createdDate,
        };

        user.surveys.forEach((survey) => {
          if (
            survey.title === "ความพึงพอใจของระบบ" ||
            survey.title === "ความพึงพอใจของ Dashboard"
          ) {
            survey.questions.forEach((question) => {
              const key = `${question.questionText}`;
              userData[key] = question.rate;
              questionsSet.add(key);
            });

            // Add survey remark
            const remarkKey = `${survey.title}`;
            userData[remarkKey] = survey.remark || "";
            surveysSet.add(survey.title);
          }
        });

        normalizedData.push(userData);
      });

      // Sort questionsSet and surveysSet alphabetically
      this.questionsSet = Array.from(questionsSet);
      this.surveysSet = Array.from(surveysSet);

      this.transformedData = normalizedData;
    },
  },
};
</script>

<style scoped>
.table,
th,
td {
  border: 1px solid black;
  /* border-collapse: collapse; */
}
</style>