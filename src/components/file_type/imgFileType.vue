<template>
  <v-img
    v-if="mime_type === 'application/pdf'"
    height="35"
    width="26"
    src="@/assets/coachLeave/file-pdf.svg"
  />

  <v-img
    v-else-if="
      mime_type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    "
    height="35"
    width="26"
    src="@/assets/coachLeave/file-doc.svg"
  />

  <v-img
    v-else-if="
      mime_type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    "
    height="35"
    width="26"
    src="@/assets/coachLeave/file-exl.svg"
  />

  <v-img
    v-else-if="mime_type === 'image/jpeg'"
    height="35"
    width="26"
    src="@/assets/coachLeave/file-jpg.svg"
  />

  <v-img
    v-else-if="mime_type === 'image/png'"
    height="35"
    width="26"
    src="@/assets/coachLeave/file-jpg.svg"
  />

  <v-img
    v-else-if="mime_type === 'video/mp4'"
    height="35"
    width="26"
    src="@/assets/coachLeave/file-mp4.svg"
  />

  <v-img
    v-else-if="mime_type === 'video/quicktime'"
    height="35"
    width="26"
    src="@/assets/coachLeave/file-mov.svg"
  />

  <v-img
    v-else
    height="35"
    width="26"
    src="@/assets/coachLeave/file-other.svg"
  />
  <!-- <v-icon
    class="mr-2"
    :color="icon_color"
  >
    mdi-file-document-outline</v-icon
  > -->
  <!-- <v-icon
    class="mr-2"
    :color="icon_color"
  >
    mdi-file-pdf-box</v-icon
  > -->

  <!-- <v-icon
    
    class="mr-2"
    :color="icon_color"
  >
    mdi-file-image-outline</v-icon
  > -->

  <!-- <v-icon
    
    class="mr-2"
    :color="icon_color"
  >
    mdi-file-video-outline</v-icon
  > -->

  <!-- <v-icon
    
    class="mr-2"
    :color="icon_color"
  >
    mdi-file-video-outline</v-icon
  > -->
  <!-- <v-icon v-else class="mr-2" :color="icon_color">
    mdi-file-excel-outline</v-icon
  > -->
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
  