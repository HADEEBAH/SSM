<template>
    <div>
        <v-card
            v-for="(coach, coach_index) in course_data.coachs"
            class="bg-grey-card mb-5"
            :key="coach_index"
        >
            <!-- TEACH DAY -->
            <template
                v-for="(teach_day, teach_day_index) in coach.teach_day_data"
            >
                <v-card-text :key="`${teach_day_index}-day`">
                <v-divider
                    v-if="teach_day_index > 0"
                    :key="teach_day_index"
                ></v-divider>
                <v-row dense>
                    <v-col cols="12" class="flex align-center justify-end">
                    <v-switch
                        v-model="teach_day.class_open"
                        color="green"
                        hide-details
                        label="เปิดสอน"
                    ></v-switch>
                    </v-col>
                </v-row>
                <v-row dense class="flex align-center justify-end">
                    <v-col cols="12" sm="4">
                    <label-custom required text="โค้ช"></label-custom>
                    <v-autocomplete 
                        dense
                        v-model="coach.coach_name"
                        color="#FF6B81"
                        :items="courses"
                        item-color="pink"
                        outlined
                        :rules="rules.course"
                        placeholder="โค้ช"
                    >
                        <template v-slot:no-data>
                        <v-list-item>
                            <v-list-item-title>
                            ไม่พบข้อมูล
                            </v-list-item-title>
                        </v-list-item>
                        </template>
                        <template v-slot:item="{ item }" >
                        <v-list-item-content >
                            <v-list-item-title ><span :class="coach.coach_name === item ? 'font-bold':''">{{ item }}</span></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-icon v-if="coach.coach_name === item">mdi-check-circle</v-icon>
                        </v-list-item-action>
                        </template>  
                    </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="4">
                    <label-custom required text="วันสอน"></label-custom>
                    <v-autocomplete 
                        dense
                        outlined
                        chips
                        :rules="rules.class_date"
                        deletable-chips
                        item-color="#FF6B81"
                        multiple
                        small-chips
                        color="#FF6B81"
                        :items="days"
                        item-text="label"
                        placeholder="โปรดเลือกเวลา"></v-autocomplete>
                    </v-col>
                    <v-col cols="6" sm="2">
                        <v-btn
                            text
                            v-if="
                            teach_day_index === coach.teach_day_data.length - 1"
                            color="green"
                            @click="addTeachDay(coach)"
                        >
                            <v-icon>mdi-calendar-plus-outline</v-icon>
                            เพิ่มวันสอน
                        </v-btn>
                    </v-col>
                    <v-col cols="6" sm="2">
                        <v-btn
                            text
                            color="red"
                            v-if="coach.teach_day_data.length > 1"
                            @click="
                            removeTeachDay(coach.teach_day_data,teach_day_index)"
                        >
                            <v-icon>mdi-calendar-plus-outline</v-icon>
                            ลบวันสอน
                        </v-btn>
                    </v-col>
                </v-row>
                <!-- CLASS TIME -->
                <template
                    v-for="(class_date, class_date_index ) in teach_day.class_date">
                    <v-row dense
                        class="flex align-center justify-end"
                        :key="`${class_date_index}-date`"
                    >
                        <v-col cols="12" sm="4">
                            <label-custom required text="ช่วงเวลา"></label-custom>
                            <v-row>
                                <v-col>
                                    <v-menu
                                    v-model="class_date.class_date_range.menu_start_time"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                    >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                        dense
                                        outlined
                                        :rules="rules.start_time"
                                        placeholder="โปรดเลือกเวลา"
                                        v-model="class_date.class_date_range.start_time"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        >
                                        <template v-slot:append>
                                            <v-icon :color="class_date.class_date_range.start_time ? '#FF6B81': ''">mdi-clock-outline</v-icon>
                                        </template>
                                        </v-text-field>
                                    </template>
                                    <v-time-picker
                                        v-model="class_date.class_date_range.start_time"
                                    ></v-time-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="auto" class="mt-2 px-0"
                                    ><v-icon>mdi-minus</v-icon></v-col
                                >
                                <v-col>
                                    <v-menu
                                    v-model="class_date.class_date_range.menu_end_time"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                    >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                        dense
                                        outlined
                                        :rules="rules.end_time"
                                        placeholder="โปรดเลือกเวลา"
                                        v-model="class_date.class_date_range.end_time"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        >
                                        <template v-slot:append>
                                            <v-icon :color="class_date.class_date_range.end_time? '#FF6B81': ''">mdi-clock-outline</v-icon>
                                        </template>
                                        </v-text-field>
                                    </template>
                                    <v-time-picker
                                        v-model="class_date.class_date_range.end_time"
                                    ></v-time-picker>
                                    </v-menu>
                                </v-col>
                                </v-row>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <label-custom
                                required
                                text="นักเรียนที่รับได้"
                            ></label-custom>
                            <v-text-field
                                class="input-text-right"
                                dense
                                type="number"
                                suffix="คน"
                                outlined
                                @focus="$event.target.select()"
                                :rules="rules.students"
                                v-model="class_date.students"
                                placeholder="ระบุนักเรียนที่รับได้"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="2">
                            <v-btn
                                text
                                v-if="class_date_index === teach_day.class_date.length - 1"
                                color="green"
                                @click="addTime(teach_day)"
                            >
                                <v-icon>mdi-timer-plus-outline</v-icon>
                                เพิ่มเวลา
                            </v-btn>
                        </v-col>
                        <v-col cols="6" sm="2">
                            <v-btn
                                v-if="teach_day.class_date.length > 1"
                                text
                                color="red"
                                @click="removeTime(teach_day.class_date, class_date_index)"
                            >
                                <v-icon>mdi-timer-minus-outline</v-icon>
                                ลบเวลา
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>
                </v-card-text>
            </template>
        </v-card>
    </div>
</template>
  
<script>
    import LabelCustom from "../label/labelCustom.vue";
    import { mapGetters, mapActions } from 'vuex';
    export default {
        components: {
            LabelCustom
        },
        data: () => ({
            days: [
                { label: "วันอาทิตย์", value: "Sunday" },
                { label: "วันจันทร์", value: "Monday" },
                { label: "วันอังคาร", value: "Tuesday" },
                { label: "วันพุท", value: "Wednesday" },
                { label: "วันพฤหัสบดี", value: "Thursday" },
                { label: "วันศุกร์", value: "Friday" },
                { label: "วันเสาร์", value: "Saturday" },
            ],
            courses: ["โค้ชหนุ่ม", "โค้ชพอล"],
            rules: {  
                course: [val => (val || '').length > 0 || 'โปรดเลือกโค้ช'],
                class_date: [val => (val || '').length > 0 || 'โปรดเลือกวันที่'],
                start_time : [val => (val || '').length > 0 || 'โปรดเลือกเวลาเริ่ม'],
                end_time : [val => (val || '').length > 0 || 'โปรดเลือกเวลาสิ้นสุด'],
                students : [val => (val || '').length > 0 || 'โปรดระบุจำนวนนักเรียน'],
            },
        }),

        created() {},

        mounted() {},

        watch: {},
        computed: {
            ...mapGetters({
                course_data : "CourseModules/getCourseData",
            })
        },
        methods: {
            ...mapActions({
                ChangeCourseData : "CourseModules/ChangeCourseData"
            }),
            addTeachDay(data) {
                console.log(data)
                data.teach_day_data.push({
                    teach_day: [],
                    class_date: [
                    {
                        class_date_range: {
                            start_date: "",
                            menu_start_date: false,
                            end_date: "",
                            menu_end_date: false,
                        },
                        students: 0,
                    },
                    ],
                });
                this.ChangeCourseData(this.course_data)
            },
            removeTeachDay(data, index) {
                data.splice(index, 1);
                this.ChangeCourseData(this.course_data)
            },
            addTime(data) {
                data.class_date.push({
                    class_date_range: {
                    start_date: "",
                    menu_start_date: false,
                    end_date: "",
                    menu_end_date: false,
                    },
                    students: 0,
                });
                this.ChangeCourseData(this.course_data)
            },
            removeTime(data, index) {
                data.splice(index, 1);
                this.ChangeCourseData(this.course_data)
            },
        },
    };
</script>
<style>
.sub-menu {
  font-weight: 600;
  color: #2f3542;
  font-size: 22px;
}
.bg-grey-card {
  background-color: #fcfcfc;
}
/deep/.input-text-right input {
  text-align: right !important;
}
.img-header {
  position: absolute;
  right: 0px;
  max-height: 180px;
  max-width: 250px;
}
</style>
  