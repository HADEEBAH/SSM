<template>
    <label class="font-semibold text-lg">{{ text }}<span v-if="required" class="red--text">*</span></label>
</template>
  
  <script>
export default {
  name: "LabelCustom",
  props:{
    text : {type: String},
    required : {type: Boolean, default: false}
  },
  components: {
    // registerForm
  },
  data: () => ({}),
  created() {},

  mounted() {},

  watch: {},

  computed: {},

  methods: {},
};
</script>
  