<template>
  <v-card hover class="w-[270px] h-full">
    <v-img
      @click="selectedCategory(category)"
      :aspect-ratio="16 / 9"
      :src="
        category.categoryImg && category.categoryImg !== ''
          ? category.categoryImg
          : require('@/assets/userKingdom/default_category_img.svg')
      "
      class="cursor-pointer"
      ><template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="#ff6b81"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <v-card-title
      :class="$vuetify.breakpoint.smAndUp ? 'text-md' : 'text-sm'"
      class="font-bold cursor-pointer"
      @click="selectedCategory(category)"
    >
      {{ $i18n.locale == "th" ? category.categoryNameTh : category.categoryNameEng }}
    </v-card-title>

    <v-card-subtitle>
      <div class="mb-2">{{ $t("by") }} {{ category.taughtBy }}</div>
      <div>
        {{
          category.show
            ? `${category.categoryDescription}`
            : `${category.categoryDescription?.slice(0, 15).trim()}`
        }}
        <span
          v-if="category.categoryDescription?.length > 15"
          class="text-red-500 cursor-pointer"
          @click="SetShowMore(category)"
          >{{ category.show ? $t("lesser") : $t("read more") + `...` }}</span
        >
      </div>
    </v-card-subtitle>
  </v-card>
</template>

<script>
import { mapActions, mapMutations,mapGetters } from "vuex";
export default {
    props: {
        category: {
            type: Object
        }
    },
    data: ()=>({}),
    computed: {
        ...mapGetters({
            course_order: "OrderModules/getCourseOrder" 
        })
    },
    methods:{
        ...mapMutations({
            SetShowMore : "CategoryModules/SetShowMore"
        }),
        ...mapActions({
            changeCourseOrderData: "OrderModules/changeCourseOrderData",
        }),
        selectedCategory(category) {
            this.course_order.kingdom = category.categoryNameTh;
            this.course_order.category_id = category.categoryId;
            this.changeCourseOrderData(this.course_order);
            localStorage.setItem("Order", JSON.stringify(this.course_order));
            this.$router.push({
                name: "userCourseList_categoryId",
                params: { category_id: category.categoryId },
            });
        },
    }
};
</script>

<style>
</style>