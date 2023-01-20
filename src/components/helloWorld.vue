<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
            label="Regular"
            v-model="input"
          ></v-text-field>
      </v-col>
      <v-col>
        <v-btn
          class="text-danger"
          elevation="2"
          @click="handle"
        >
         ตกลง
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-[red]">
        {{ name }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      input: "",
      name: "สวัสดี",
      action: "ทดสอบ"
    }),

    created() {
      this.name = "สวัสดีครับ"
    },

    mounted() {

    },

    watch: {
      
    },

    computed: {

    },
    
    methods: {
      handle() {
        this.$store.dispatch("AdminMudules/increment", this.input)
        this.name = this.$store.state.AdminMudules.name
      }
    },

  }
</script>
