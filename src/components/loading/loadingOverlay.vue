<template>
  <v-overlay :value="loading">
    <v-progress-circular
      indeterminate
      size="64"
      color="#ff6b81"
    ></v-progress-circular>
  </v-overlay>
</template>  
<script>
export default {
  name: "loadingOverlay",
  props: {
    loading: { type: Boolean, default: false },
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
  