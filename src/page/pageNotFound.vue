<template>
  <v-row class="absolute top-0 right-0 bottom-0 left-0">
    <v-col class="m-auto"> 
      <div class="text-center">
        <p class="text-9xl font-semibold">404</p>
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{{$t("page not found")}}</h1>
        <p class="mt-6 text-base leading-7 text-gray-600">{{$t("sorry, we couldn't find the page you were looking for")}}</p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <v-btn color="#000" text class="rounded-md " @click="goHome" dark>
            <span class="mdi mdi-arrow-left font-weight-bold">{{ $t('return to home page') }}</span>
          </v-btn>
        </div>
      </div>
     </v-col>
  </v-row>
</template>
<script>
import router from "@/router";

export default {
methods: {
    goHome() {
      router.replace({name: "UserKingdom"})
    }
  },
}

</script>
