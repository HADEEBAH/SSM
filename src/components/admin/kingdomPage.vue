<template>
    <v-container>
      <div class="titlekingdom">
        <v-title>สร้างอาณาจักร</v-title>
      </div>
      <v-card-text>
        <v-col cols="12" sm="8">
          <h2 class="title">ชื่ออาณาจักร</h2>
          <v-text-field placeholder="กรอกชื่ออาณาจักร" outlined></v-text-field>
        </v-col>
        <v-col cols="12" sm="8">
          <h2 class="title">รายละเอียด</h2>
          <v-text-field placeholder="กรอกรายละเอียด..." outlined></v-text-field>
        </v-col>
      </v-card-text>
    </v-container>
  </template>
  
  <script>
  export default {};
  </script>
  
  <style>
  .titlekingdom {
    position: absolute;
    width: 175px;
    height: 34px;
    left: 239px;
  
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    font-size: 28px;
    line-height: 34px;
  
    color: #000000;
  }
  </style>
  