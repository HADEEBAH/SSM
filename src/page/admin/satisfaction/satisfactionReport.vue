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
                                <div class="text-base font-bold">{{ $t('average') }}</div>
                                <span class="text-xl font-bold">{{ satisfactions.AverageRate }}</span>
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
                                        <v-img height="50" width="50" src="@/assets/star/5-stars.png"></v-img>
                                    </v-col>
                                    <v-col class="d-flex align-center justify-center">
                                        <span class="text-lg font-bold">{{ satisfactions.fiveStar }}</span>
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
                                        <v-img height="50" width="50" src="@/assets/star/4-stars.png"></v-img>
                                    </v-col>
                                    <v-col class="d-flex align-center justify-center">
                                        <span class="text-lg font-bold">{{ satisfactions.fourStar }}</span>
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
                                        <v-img height="50" width="50" src="@/assets/star/3-stars.png"></v-img>
                                    </v-col>
                                    <v-col class="d-flex align-center justify-center">
                                        <span class="text-lg font-bold">{{ satisfactions.threeStar }}</span>
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
                                        <v-img height="25" width="25" src="@/assets/star/star.png"></v-img>
                                        <v-img height="25" width="25" src="@/assets/star/star.png"></v-img>
                                    </v-col>
                                    <v-col class="d-flex align-center justify-center">
                                        <span class="text-lg font-bold">{{ satisfactions.twoStar }}</span>
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
                                        <v-img height="50" width="50" src="@/assets/star/star.png"></v-img>
                                    </v-col>
                                    <v-col class="d-flex align-center justify-center">
                                        <span class="text-lg font-bold">{{ satisfactions.oneStar }}</span>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <div>
            <v-data-table
                class="elevation-1 header-table"
                :headers="column"
                :items="satisfactions.list"
            ></v-data-table>
        </div>
    </v-container>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue"
import { mapActions, mapGetters } from "vuex";
// const star = require("@/assets/star/star.png")
export default {
    name: "SatifactionReport",
    components:{ headerPage },
    computed:{
        ...mapGetters({
            satisfactions : "satisfactionModules/satisfactions"
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
                    value: "rate",
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
    created(){
        const user_detail = JSON.parse(localStorage.getItem("userDetail"));
        if(!['yuthyuth'].includes(user_detail.username)){
            this.$router.push({ name: "Dashboard" });
        }
        this.GetSatisfactionList()
    },
    methods: {
        ...mapActions({
            GetSatisfactionList : "satisfactionModules/GetSatisfactionList"
        })
    }
}
</script>

<style>

</style>