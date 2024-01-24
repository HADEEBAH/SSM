<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <headerPage :title="$t('manage check in later')" slot_tag />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-text-field v-model="orderNumder" :rules="RulesOrderNumber" dense outlined
                    placeholder="กรุณากรอกเลขออเดอร์">
                </v-text-field>
            </v-col>
            <v-col>
                <v-btn depressed color="#ff6b81" dark @click="HandleInputOrderNumber(orderNumder)">
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="8">
                <v-card outlined v-for="(order, index) in order_number_detail" :key="`${index}-order`">
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
                        <v-row v-for="(student, indexStudent) in order.students" :key="`${indexStudent}-student`" outlined>
                            <v-col class="pl-8 font-bold">
                                {{ student.name }}
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col v-if="order_number_detail" cols="4" >
                <v-radio-group v-model="type">
                    <v-radio label="ระบุวันที่เรียนจบ" value="end-class"></v-radio>
                    <v-radio label="ระบุจำนวนครั้งคงเหลือ" value="last-time"></v-radio>
                </v-radio-group>
                <template  v-if="type">
                    <v-card outlined class="mb-3">
                        <v-card-text>
                            <v-row dense>
                                <v-col class="font-bold">
                                    {{
                                        type == "end-class"
                                        ? "ระบุวันที่เรียนจบ"
                                        : "ระบุจำนวนครั้งคงเหลือ"
                                    }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-menu v-if="type === 'end-class'" v-model="menuEndClassDate"
                                        :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="endClassDate" dense outlined readonly
                                                :placeholder="$t('choose a date')" v-bind="attrs" v-on="on" color="#FF6B81">
                                                <template v-slot:append>
                                                    <v-icon>mdi-calendar</v-icon>
                                                </template>
                                            </v-text-field>
                                        </template>
                                        <v-date-picker v-model="endClassDate" locale="th-TH"></v-date-picker>
                                    </v-menu>
                                    <v-text-field v-if="type === 'last-time'" v-model="lastTime" :rules="RulesLastTime" dense
                                        outlined type="number" placeholder="กรุณาระบุจำนวนครั้งคงเหลือ">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                    <v-btn class="w-full" depressed color="#ff6b81" dark 
                        @click="save()"
                    >
                        {{ $t("save") }}
                    </v-btn>
                </template>
             
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
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
            lastTime: "",
        };
    },
    computed: {
        ...mapGetters({
            order_number_detail: "OrderModules/getOrderNumberDetail",
        }),
        RulesLastTime() {
            return [(val) => (val || "").length > 0 || this.$t("enter last time")];
        },
        RulesOrderNumber() {
            return [(val) => (val || "").length > 0 || this.$t("enter order number")];
        },
    },
    created() { },
    methods: {
        ...mapActions({
            GetOrderDetailByOrderNumber: "OrderModules/GetOrderDetailByOrderNumber",
            UpdateScheduleAndCheckIn: "OrderModules/UpdateScheduleAndCheckIn",
        }),
        HandleInputOrderNumber(orderNumber) {
            this.GetOrderDetailByOrderNumber({
                orderNumber,
            });
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
        save() {
            this.UpdateScheduleAndCheckIn({
                orderNumber: this.orderNumder,
                lastTime: this.lastTime,
                type: this.type,
                endDate: this.endClassDate,
            });
        },
    },
};
</script>

<style></style>
