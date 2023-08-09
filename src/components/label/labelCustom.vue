<template>
    <label class="font-semibold ">{{ text }}<span v-if="required" class="red--text">*</span></label>
</template>
  
  <script>
export default {
  name: "LabelCustom",
  props:{
    text : {type: String},
    required : {type: Boolean, default: false}
  },
  components: {
  },
  data: () => ({}),
  created() {},

  mounted() {},

  watch: {},

  computed: {},

  methods: {},
};
</script>
  