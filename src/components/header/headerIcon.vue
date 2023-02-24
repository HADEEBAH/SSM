<template>
  <div>
    <v-row>
      <v-col class="font-bold">
        <v-icon v-if="icon" :color="icon_color" class="mr-3" size="30">{{
          icon
        }}</v-icon>
        {{ title }}
      </v-col>
      <v-col cols="12" sm="auto">
        <slot name="actions"></slot>
      </v-col>
    </v-row>
    <v-divider v-if="divider"></v-divider>
  </div>
</template>
  
  <script>
export default {
  name: "headerIcon",
  props: {
    title: { type: String },
    sub_title: { type: String },
    sub_title_color: { type: String, default: "#8EC6A6" },
    icon: { type: String },
    icon_color: { type: String },
    divider: { type: Boolean, default: false },
  },
  components: {},
  data: () => ({}),
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {},
};
</script>
  