<template>
  <v-icon
    v-if="mime_type === 'application/pdf'"
    class="mr-2"
    :color="icon_color"
  >
    mdi-file-document-outline</v-icon
  >
  <v-icon
    v-else-if="mime_type === 'text/plain'"
    class="mr-2"
    :color="icon_color"
  >
    mdi-file-pdf-box</v-icon
  >

  <v-icon
    v-else-if="mime_type === 'image/jpeg'"
    class="mr-2"
    :color="icon_color"
  >
    mdi-file-image-outline</v-icon
  >

  <v-icon
    v-else-if="mime_type === 'video/mp4'"
    class="mr-2"
    :color="icon_color"
  >
    mdi-file-video-outline</v-icon
  >

  <v-icon
    v-else-if="mime_type === 'video/quicktime'"
    class="mr-2"
    :color="icon_color"
  >
    mdi-file-video-outline</v-icon
  >
  <v-icon v-else class="mr-2" :color="icon_color">
    mdi-file-excel-outline</v-icon
  >
</template>
  
<script>
export default {
  name: "imgFileType",
  props: {
    mime_type: {},
  },
  components: {},
  data: () => ({
    mime_type_global: [
      "application/pdf",
      "text/plain",
      "image/jpeg",
      "video/mp4",
      "video/quicktime",
    ],
    icon_color: "#ff6b81",
  }),
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {},
};
</script>
  