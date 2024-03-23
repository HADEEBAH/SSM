<template>
    <v-container>
        <headerPage :title="$t('import user')" slot_tag>
          <template>
            <v-row dense>
                <v-col>
                    <v-btn outlined dense color="#ff6b81" @click="downloadTemplateFile()">
                        <v-icon>mdi-download-box-outline</v-icon>
                        <span>download template</span>
                    </v-btn>
                </v-col>
                <!-- <v-col>
                    <v-btn depressed dark dense color="#ff6b81">
                        <v-icon>mdi mdi-upload-box</v-icon>
                        <span>upload template</span>
                    </v-btn>
                </v-col> -->
            </v-row>
          </template>
        </headerPage>
        <v-card outlined class="text-center">
            <v-card-text>
                <v-row>
                    <v-col>
                        กรุณาอัพโหลดไฟล์
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-btn depressed dark dense color="#ff6b81" @click="openFileSeleter()">
                            <v-icon>mdi mdi-upload-box</v-icon>
                            <span>upload template</span>
                        </v-btn>
                    </v-col>
                    <input
                        ref="fileInput"
                        type="file"
                        accept="image/png, image/jpeg"
                        @change="uploadFile"
                        id="excel"
                        style="display: none"
                    />
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import headerPage from "@/components/header/headerPage.vue";
import { mapActions } from 'vuex';
export default {
    components: { headerPage },
    methods:{
        ...mapActions({
            downloadfile : "importUserModules/downloadfile"
        }),
        downloadTemplateFile () {
            this.downloadfile()
        },
        openFileSeleter(){
            this.$refs.fileInput.click();
        },
        uploadFile(event){
            console.log(event)
        }
    }
}
</script>

<style>

</style>