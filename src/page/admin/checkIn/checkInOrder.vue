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
          @keypress.enter="HandleInputOrderNumber(orderNumder)"
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
        <v-card v-if="order_number_detail.length === 0" outlined>
          <v-card-text class="text-center font-bold">
            {{ $t("enter order number") }}
          </v-card-text>
        </v-card>
        <v-card
          v-for="(order, index) in order_number_detail"
          :key="`${index}-order`"
          :class="getCardClass(order.orderItemId)"
          outlined
          @click="SelectCourse(order)"
        >
          <!-- courseTypeId -->
          <v-card-text>
            <v-row dense>
              <v-col class="font-bold text-lg">
                {{
                  $i18n.locale == "th" ? order.courseNameTh : order.courseNameEn
                }}
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
                {{
                  $i18n.locale == "th"
                    ? order.cpo?.optionName
                    : order.cpo?.optionNameEn
                }}
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
                {{ $i18n.locale == "th" ? order.coachName : order.coachNameEn }}
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
                {{ $i18n.locale == "th" ? student.name : student.nameEn }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-form ref="form" v-model="valid">
      <v-row v-if="seletedCourse && checkCourseType == 'CT_1'">
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
                      :max="maxNumber"
                      :min="1"
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
    <div v-if="checkCourseType == 'CT_2' && clickActive">
      <div>{{ verifyGeneralCourse() }}</div>
    </div>
  </v-container>
</template>

<script>
import { inputValidation } from "@/functions/functions";
import headerPage from "@/components/header/headerPage.vue";
import Swal from "sweetalert2";
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
      checkCourseType: "",
      clickActive: false,
      getCpo: "",
      maxNumber: 0,
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
      return [
        (val) => (val || "").length > 0 || this.$t("enter last time"),
        (val) =>
          this.getCpo === null
            ? parseInt(val) <= 100 || `${this.$t("number must be")} ${100}`
            : parseInt(val) <= this.maxNumber ||
              `${this.$t("number must be")} ${this.maxNumber}`,
        (val) => parseInt(val) >= 1 || this.$t("number must be 1"),
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

    containsDecimal(value) {
      return value.includes(".");
    },

    async SelectCourse(orders) {
      orders.active = true;
      this.clickActive = await orders.active;
      this.seletedCourse = orders.orderItemId;
      this.checkCourseType = orders.courseTypeId;
      this.maxNumber = orders?.cpo?.HPT;
      this.getCpo = orders?.cpo;
      if (orders.courseTypeId == "CT_2") {
        await this.verifyGeneralCourse();
        orders.active = false;
        this.clickActive = await orders.active;
      }
    },
    verifyGeneralCourse() {
      Swal.fire({
        icon: "warning",
        title: this.$t("warning"),
        text: this.$t("this item cannot be made. Because it is a short course"),
        timer: 3000,
        timerProgressBar: true,
        showCancelButton: false,
        showConfirmButton: false,
      });
    },
    getCardClass(orderItemId) {
      return {
        "card-selected": this.seletedCourse === orderItemId,
        "list-hover": true,
        "mb-3": true,
      };
    },
    HandleInputOrderNumber(orderNumber) {
      this.GetOrderDetailByOrderNumber({
        orderNumber,
      });
      this.checkCourseType = "";
      this.type = "";
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
        Swal.fire({
          icon: "question",
          title: this.$t("do you want to save it?"),
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: this.$t("agree"),
          cancelButtonText: this.$t("cancel"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.UpdateScheduleAndCheckIn({
              orderNumber: this.orderNumder,
              orderItemId: this.seletedCourse,
              lastTime: this.lastTime,
              type: this.type,
              endDate: this.endClassDate,
            });
          }
          this.type = "";
        });
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
