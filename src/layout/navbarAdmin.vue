<template>
  <v-layout>

    <v-app-bar
      app
      elevation="4"
    >
    </v-app-bar>
    
    <v-content>
      <v-container>
        <v-row>
          <v-col>
            <router-view/>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

  </v-layout>
</template>

<script>
  export default {
    data: () => ({
      name: "สวัสดีครับ"
    }),

    created() {
      
    },

    mounted() {
      
    },

    watch: {

    },

    computed: {

    },
    
    methods: {
      
    },
  }
</script>