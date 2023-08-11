<template>
    <v-container class="h-full">
      <v-row class="h-full">
        <v-col cols="12" align="center" class="align-self-center">
          <v-img
            max-width="300" 
            src="@/assets/course/course_full.png"
          >
          </v-img>
        </v-col>
        <v-col cols="12" class="font-bold text-lg text-center">
          ไม่สามารถดาวน์โหลดพอร์ตโฟลิโอได้
        </v-col>
      </v-row>
    </v-container>
  </template>
    <script>
    export default {
      name: "errorPortfolio",
      data: () => ({
      }),
      mounted() {
        this.$store.dispatch("NavberUserModules/changeTitleNavber", "");
      },
    }
    </script>
    