<template>
    <v-app>
      <v-container>
        <v-row dense>
            <v-col cols="12">
                <v-text-field  outlined hide-details dense prepend-inner-icon="mdi-magnify" placeholder="ค้นหาอาณาจัดรการเรียนรู้ที่คุณสนใจได้ที่นี่"></v-text-field>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col class="text-lg font-bold">{{ category.categoryNameTh }}</v-col>
        </v-row>
        <v-row dense>
            <v-col cols="5" v-for="(type, type_index) in course_types" :key="type_index">
                <v-card flat @click="selectCourseType(type)" class="rounded-lg">
                    <v-card-text :class="type_selected === type.course_type_id ? 'bg-[#FF6B81]' : 'bg-[#F5F5F5]'" class="rounded-lg flex justify-center align-center pa-2">
                        <label :class="type_selected === type.course_type_id ? 'text-white' : ' text-[#B3B3B3]' " class="font-bold mr-2">{{type.course_type_name_th}}</label>
                        <v-avatar size="32" color="white" class="font-bold" :class="type_selected === type.course_type_id ? 'text-[#ff6b81]' : 'text-[#B3B3B3]'"> {{ type.total_course }} </v-avatar>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row dense>
            <template v-if="!courses_is_loading">
                <v-col cols="6" sm="4" v-for="(course, course_index) in courses" :key="course_index">
                    <v-card @click="selectedCourse(course)">
                        <v-img
                            height="109"
                            :src="course.course_url ? course.course_url : 'https://cdn.vuetifyjs.com/images/cards/cooking.png'"
                        >
                        <v-row>
                            <v-col class="pa-4" align="right"> <v-chip  color="#F9B320" text-color="white">{{ `${course.period}ชั่วโมง`  }}</v-chip></v-col>
                        </v-row>
                        </v-img>
                        <v-card-title class="  font-bold text-sm pa-2">
                        <v-row dense class="d-flex align-center">
                            <v-col>{{ `${course.course_name_th} (${course.course_name_en})` }}</v-col>
                            <v-col class="d-flex align-center text-[#ff6b81]" cols="auto">
                                <v-icon color="#ff6b81" size="18">mdi-account-group-outline</v-icon>
                                {{ `${course.course_studant_amount ? course.course_studant_amount : 0 }/${course.course_student_recived}` }}</v-col>
                        </v-row>  
                        </v-card-title>
                        <v-card-text class="text-xs pa-2">
                            {{  course.course_detail  }}
                        </v-card-text>
                    </v-card>
                </v-col>
            </template>
            <template v-else>
                <v-col cols="4" v-for="(course, course_index) in 6" :key="course_index">
                    <v-card>
                        <v-skeleton-loader
                            type="image, list-item"
                        ></v-skeleton-loader>
                    </v-card>
                </v-col>
            </template>
        </v-row>
      </v-container>
    </v-app>
  </template>
  <script>
import { mapGetters, mapActions } from 'vuex';
    export default {
  components: {},
        name:"userCourseList",  
        data: () => ({
            loading : true,
            course_type : [{course_type_id : "CT_1", name : "คอร์สทั่วไป", amount : "8", value:"general_course"},{course_type_id : "CT_2",name : "คอร์สระยะสั้น", amount : "2", value:'short_course'}],
            type_selected :"",
        }),
        created() {
            this.GetCourseTypes({category_id : this.$route.params.category_id})
            this.$store.dispatch("CourseModules/GetCoursesFilter",{ category_id : this.$route.params.category_id, status : "Active", })  
        },
        mounted() {
            this.GetCategory(this.$route.params.category_id)
            this.$store.dispatch("NavberUserModules/changeTitleNavber","คอร์สเรียน")
            if(this.course_types.length > 0){
                this.type_selected = this.course_types[0].course_type_id
            }
        },
        watch: {
            
        },
        computed: {
            ...mapGetters({
                courses_is_loading : "CourseModules/getCoursesIsLoading",
                courses : "CourseModules/getCourses",
                course_order : "OrderModules/getCourseOrder",
                category : "CategoryModules/getCategory",
                course_types : "CourseModules/getCourseTypes"
            })
            
        },
        methods: {
            ...mapActions({
                GetCourseTypes : "CourseModules/GetCourseTypes",
                GetCategory : "CategoryModules/GetCategory",
                changeCourseOrderData : "OrderModules/changeCourseOrderData",
                GetCoursesFilter : 'CourseModules/GetCoursesFilter'
            }),
            selectCourseType(course_type){
                this.type_selected = course_type.course_type_id
                this.GetCoursesFilter({
                    category_id: this.$route.params.category_id, 
                    status : "Active", 
                    course_type_id : course_type.course_type_id})
            },
            selectedCourse(course){
                this.course_order.course_id = course.course_id
                this.course_order.course_name = `${course.course_name_th}(${course.course_name_en})`
                this.course_order.course_type = course.course_type_th
                this.course_order.course_type_id = course.course_type_id
                this.course_order.detail = course.course_detail
                this.course_order.period = course.period
                this.changeCourseOrderData(this.course_order)
                localStorage.setItem("Order", JSON.stringify(this.course_order))
                this.$router.push({name : "userCourseDetail_courseId", params:{course_id:course.course_id}})
            }
        },
    };
  </script>
  