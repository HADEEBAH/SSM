<template>
    <v-container>
        <headerPage :title="$t('check in later')" />
        <v-card class="mb-3" outlined rounded="lg">
            <v-card-text>
                <v-row>
                    <v-col>
                        <v-autocomplete dense outlined hide-details :placeholder="$t('course')"></v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-autocomplete dense outlined hide-details :placeholder="$t('coach')"></v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-autocomplete dense outlined hide-details :placeholder="$t('date')"></v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-autocomplete dense outlined hide-details :placeholder="$t('time')"></v-autocomplete>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card class="mb-3" dense outlined rounded="lg" color="#ffe1e5">
            <v-card-text>
                <v-row>
                    <v-col class="d-flex align-center font-bold text-[#ff6b81]"> รายการวันที่ </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card dense outlined class="mb-3" rounded="lg">
            <v-card-text class="border-left-10">
                <v-row>
                    <v-col class="d-flex align-center"> 01/02/2024 </v-col>
                    <v-col cols="auto">
                        <v-btn depressed color="#ff6b81" dark> check in </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-expand-transition>
            <div class="pl-6 mb-3">
                <v-card class="mb-3" dense outlined rounded="lg" color="#ffe1e5">
                    <v-card-text>
                        <v-row>
                            <v-col cols="" class="font-bold text-[#ff6b81]" align="center">ชื่อ สกุล</v-col>
                            <v-col cols="3" class="font-bold text-[#ff6b81]" align="center">package</v-col>
                            <v-col cols="2" class="font-bold text-[#ff6b81]" align="center">จำนวนครั้ง</v-col>
                            <v-col cols="3"></v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-card class="mb-3" dense outlined rounded="lg">
                    <v-card-text>
                        <v-row>
                            <v-col class="d-flex justify-center align-center">นักเรียน หนึ่ง</v-col>
                            <v-col class="d-flex justify-center align-center" cols="3">
                                <v-chip>Package</v-chip>
                            </v-col>
                            <v-col class="d-flex justify-center align-center" cols="2">1/8</v-col>
                            <v-col cols="3">
                                <v-select hide-details outlined dense></v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-card class="mb-3" dense outlined rounded="lg">
                    <v-card-text>
                        <v-row>
                            <v-col class="d-flex justify-center align-center">นักเรียน สอง</v-col>
                            <v-col class="d-flex justify-center align-center" cols="3">
                                <v-chip>Package</v-chip>
                            </v-col>
                            <v-col class="d-flex justify-center align-center" cols="2">1/8</v-col>
                            <v-col class="d-flex justify-center align-center" cols="3">
                                <v-select hide-details outlined dense></v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </div>
        </v-expand-transition>
        <v-card dense outlined class="mb-3" rounded="lg">
            <v-card-text class="border-left-10">
                <v-row>
                    <v-col class="d-flex align-center"> 02/02/2024 </v-col>
                    <v-col cols="auto">
                        <v-btn depressed> check in </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";

export default {
    name: "AdminCheckin",
    components : {headerPage},
    data() {
        return {
            packages_color : [
                {
                    value : "PACK_1",
                    color: "primary"
                },
                {
                    value : "PACK_2",
                    color: "pink"
                },
                {
                    value : "PACK_3",
                    color: "#ED7D2B"
                },
            ]
        }
    },
    computed: {
        breadcrumbs() {
            return [
                { text: this.$t("admin"), to: "" },
                { text: this.$t("check in"), to: "" },
            ];
        },
        check_in_status_options() {
            return [
                {
                    label: this.$t("punctual"),
                    value: "punctual",
                    color: "#58A144",
                    bg_color: "#F0F9EE",
                },
                {
                    label: this.$t("late"),
                    value: "late",
                    color: "#FCC419",
                    bg_color: "#FFF9E8",
                },
                {
                    label: this.$t("leave"),
                    value: "leave",
                    color: "#43A4F5",
                    bg_color: "#CFE2F3",
                },
                {
                    label: this.$t("emergency leave"),
                    value: "emergency leave",
                    color: "#43A4F5",
                    bg_color: "#CFE2F3",
                },
                {
                    label: this.$t("absent"),
                    value: "absent",
                    color: "#F03D3E",
                    bg_color: "#F4CCCC",
                },
            ];
        }
    }
};
</script>

<style></style>
