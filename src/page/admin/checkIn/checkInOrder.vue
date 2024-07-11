<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <headerPage :title="$t('check in later by order number')" slot_tag />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="orderNumder"
          :rules="RulesOrderNumber"
          dense
          outlined
          color="#ff6b81"
          :placeholder="$t('enter order number')"
        >
        </v-text-field>
      </v-col>
      <v-col>
        <v-btn
          depressed
          color="#ff6b81"
          dark
          @click="HandleInputOrderNumber(orderNumder)"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-card
          v-for="(order, index) in order_number_detail"
          :key="`${index}-order`"
          :class="seletedCourse ? 'card-selected list-hover' : 'list-hover'"
          outlined
          @click="SelectCourse(order.orderItemId)"
        >
          <v-card-text>
            <v-row dense>
              <v-col class="font-bold text-lg">
                {{ order.courseNameTh }}
              </v-col>
              <v-col class="font-bold">
                {{ order.cpo?.packageName }}
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="2">
                {{ $t("periods") }}
              </v-col>
              <v-col class="font-bold">
                {{ order.cpo?.optionName }}
              </v-col>
              <v-col cols="2">
                {{ $t("class date") }}
              </v-col>
              <v-col class="font-bold">
                {{ dayOfWeekArray(order.dayOfWeekName) }}
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="2">
                {{ $t("coach") }}
              </v-col>
              <v-col class="font-bold">
                {{ order.coachName }}
              </v-col>
              <v-col cols="2">
                {{ $t("class time") }}
              </v-col>
              <v-col class="font-bold">
                {{ order.timeStart + "-" + order.timeEnd }}
              </v-col>
            </v-row>
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col class="text-lg font-bold">
                {{ $t("student list") }}
              </v-col>
            </v-row>
            <v-row
              dense
              v-for="(student, indexStudent) in order.students"
              :key="`${indexStudent}-student`"
              outlined
            >
              <v-col class="pl-8 font-bold">
                {{ student.name }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card v-if="order_number_detail.length === 0" outlined>
          <v-card-text class="text-center font-bold">
            {{ $t("enter order number") }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-form ref="form" v-model="valid">
      <v-row v-if="seletedCourse">
        <v-col>
          <v-radio-group v-model="type">
            <v-row>
              <v-col cols="12" md="6">
                <v-radio
                  :label="$t('specify graduation date')"
                  value="end-class"
                  color="#ff6b81"
                ></v-radio>
              </v-col>
              <v-col cols="12" md="6">
                <v-radio
                  :label="$t('specify the remaining number of times')"
                  value="last-time"
                  color="#ff6b81"
                ></v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
          <template v-if="type">
            <v-card outlined class="mb-3">
              <v-card-text>
                <v-row dense>
                  <v-col class="font-bold">
                    {{
                      type == "end-class"
                        ? $t("specify graduation date")
                        : $t("specify the remaining number of times")
                    }}
                  </v-col>
                </v-row>
                <!-- <pre>{{ order_number_detail }}</pre> -->
                <v-row>
                  <v-col>
                    <v-menu
                      v-if="type === 'end-class'"
                      v-model="menuEndClassDate"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="endClassDates"
                          dense
                          outlined
                          readonly
                          :placeholder="$t('choose a date')"
                          v-bind="attrs"
                          v-on="on"
                          color="#FF6B81"
                          :rules="ruleSelectDate"
                        >
                          <template v-slot:append>
                            <v-icon>mdi-calendar</v-icon>
                          </template>
                        </v-text-field>
                      </template>
                      <v-date-picker
                        v-model="endClassDate"
                        locale="th-TH"
                        @input="inputDate(endClassDate)"
                      ></v-date-picker>
                    </v-menu>
                    <v-text-field
                      v-if="type === 'last-time'"
                      color="#ff6b81"
                      v-model="lastTime"
                      :rules="RulesLastTime"
                      dense
                      outlined
                      type="number"
                      :max="maximumCountCourse(order_number_detail)"
                      :min="0"
                      :placeholder="$t('specify the remaining number of times')"
                    ></v-text-field>
                    <!-- @input="checkInput" -->
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-row>
              <v-col cols="12" align="end">
                <v-btn
                  depressed
                  @click="save()"
                  :disabled="!valid"
                  :dark="valid"
                  :color="!valid ? '' : '#ff6b81'"
                >
                  {{ $t("save") }}
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { inputValidation } from "@/functions/functions";
import headerPage from "@/components/header/headerPage.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "ManageCheckInLater",
  components: {
    headerPage,
  },
  data() {
    return {
      orderNumder: "",
      type: "",
      menuEndClassDate: false,
      endClassDate: "",
      endClassDates: "",
      lastTime: "",
      seletedCourse: "",
      countNumber: "",
      valid: false,
    };
  },
  mounted() {
    this.valid = false;
  },
  watch: {
    order_number_detail: {
      handler() {
        this.$forceUpdate(); // Force update to re-evaluate the computed property
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapGetters({
      order_number_detail: "OrderModules/getOrderNumberDetail",
    }),
    ruleSelectDate() {
      return [(val) => (val || "").length > 0 || this.$t("enter last date")];
    },
    RulesLastTime() {
      const maxRemain = this.getMaxRemain();
      const checkCpo = this.getCpo();
      return [
        (val) => (val || "").length > 0 || this.$t("enter last time"),
        (val) =>
          checkCpo === null
            ? parseInt(val) <= 100 || `${this.$t("number must be")} ${100}`
            : parseInt(val) <= maxRemain ||
              `${this.$t("number must be")} ${maxRemain}`,
        (val) => parseInt(val) >= 0 || this.$t("number must be 1"),
        (val) => !this.containsDecimal(val) || this.$t("can not use"),
      ];
    },
    RulesOrderNumber() {
      return [(val) => (val || "").length > 0 || this.$t("enter order number")];
    },
  },
  created() {
    this.$store.commit("OrderModules/SetOrderNumberDetail", []);
  },
  methods: {
    ...mapActions({
      GetOrderDetailByOrderNumber: "OrderModules/GetOrderDetailByOrderNumber",
      UpdateScheduleAndCheckIn: "OrderModules/UpdateScheduleAndCheckIn",
    }),
    validate(e, type) {
      inputValidation(e, type);
    },
    inputDate(item) {
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      this.endClassDates = new Date(item).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        options
      );
    },
    GenDate(date) {
      return new Date(date).toLocaleDateString(
        this.$i18n.locale == "th" ? "th-TH" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    },
    // checkInput(value) {
    //   const maxRemain = this.getMaxRemain();
    //   if (parseInt(value) > maxRemain) {
    //     this.lastTime = ""; // Clear the input if it exceeds the maxRemain
    //   } else {
    //     this.lastTime = value; // Set the input if it's valid
    //   }
    // },
    containsDecimal(value) {
      return value.includes(".");
    },
    getMaxRemain() {
      let maxRemain = 0;
      for (const itemData of this.order_number_detail) {
        for (const itemStudent of itemData?.students) {
          if (itemStudent.remain > maxRemain) {
            maxRemain = itemStudent.remain;
          }
        }
      }
      return maxRemain;
    },
    getCpo() {
      let dataCpo = {};
      for (const itemData of this.order_number_detail) {
        dataCpo = itemData.cpo;
        // for (const itemStudent of itemData?.students) {
        //   if (itemStudent.remain > maxRemain) {
        //     maxRemain = itemStudent.remain;
        //   }
        // }
      }
      return dataCpo;
    },

    maximumCountCourse() {
      for (const itemData of this.order_number_detail) {
        for (const itemStudent of itemData?.students) {
          this.countNumber = itemData.cpo ? itemStudent.remain : 100;
        }
      }
      return this.countNumber;
    },
    SelectCourse(orderItemId) {
      this.seletedCourse = orderItemId;
    },
    HandleInputOrderNumber(orderNumber) {
      this.GetOrderDetailByOrderNumber({
        orderNumber,
      });
      this.endClassDate = "";
      this.lastTime = "";
    },
    dayOfWeekArray(day) {
      let days = day.split(",");
      const weekdays = [
        this.$t("sunday"),
        this.$t("monday"),
        this.$t("tuesday"),
        this.$t("wednesday"),
        this.$t("thursday"),
        this.$t("friday"),
        this.$t("saturday"),
      ];
      days.sort();
      let ranges = [];
      if (days[0]) {
        let rangeStart = parseInt(days[0]);
        let prevDay = rangeStart;
        for (let i = 1; i < days.length; i++) {
          const day = parseInt(days[i]);
          if (day === prevDay + 1) {
            prevDay = day;
          } else {
            const rangeEnd = prevDay;
            ranges.push({ start: rangeStart, end: rangeEnd });
            rangeStart = day;
            prevDay = day;
          }
        }
        ranges.push({ start: rangeStart, end: prevDay });
        return ranges
          .map(({ start, end }) =>
            start === end
              ? weekdays[start]
              : `${weekdays[start]} - ${weekdays[end]}`
          )
          .join(", ");
      }
    },
    async save() {
      if (this.$refs.form.validate()) {
        await this.UpdateScheduleAndCheckIn({
          orderNumber: this.orderNumder,
          orderItemId: this.seletedCourse,
          lastTime: this.lastTime,
          type: this.type,
          endDate: this.endClassDate,
        });
        this.type = "";
      }
    },
  },
};
</script>

<style>
.card-selected {
  border: 4px #ff6b81 solid !important;
}
.list-hover :hover {
  background: #e4eae8;
}
</style>
