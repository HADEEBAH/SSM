<template>
  <v-container grid-list-xs>
    <v-slide-group center-active>
      <v-slide-item
        v-for="(option, index) in items"
        :key="index"
        v-slot="{ active, toggle }"
      >
        <v-card
          :class="active ? '' : ''"
          class="ma-4 card-package-size"
          @click="toggle"
        >
          <v-card-text align="center">
            <v-row dense>
              <v-col class="text-lg font-bold"
                >
                <v-img src="../"></v-img>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-slide-item>
    </v-slide-group>
  </v-container>
</template>

<script>
  export default {
    components: {
    },
    data() {
      return {
        items: [
          {id:"1", name: "ทดสอบ"}
        ]
      }
    },
  }
</script>
<style scoped>
.card-package-size {
  width: 380px;
  height: 254px;
  border-radius: 8px;
}
.line-card-package {
  width: 218px;
  height: 4px;
  background: linear-gradient(141.48deg, #ff6b81 14.35%, #fdcb6e 85.47%);
}
</style>