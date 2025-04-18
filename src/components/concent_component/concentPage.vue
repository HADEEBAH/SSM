<template>
  <v-container>
    <loading-overlay :loading="consent_loading"></loading-overlay>
    <v-card class="mt-14">
      <v-card-title class="text-h5 justify-center"
        >เงื่อนไขและนโยบายข้อมูลส่วนบุคคล (PDPA)</v-card-title
      >

      <v-card-text>
        <section>
          <h3 class="text-h6">นิยามข้อมูลส่วนบุคคล</h3>
          <p class="indent-10">
            ข้อมูลส่วนบุคคล หมายถึง
            ข้อมูลเกี่ยวกับบุคคลซึ่งทำให้สามารถระบุตัวบุคคลนั้นได้
            ไม่ว่าทางตรงหรือทางอ้อม
          </p>
        </section>

        <section>
          <h3 class="text-h6">ข้อมูลส่วนบุคคลที่เก็บรวบรวม</h3>
          <p class="indent-10">
            โรงเรียนวรพัฒน์จะใช้วิธีการที่ชอบด้วยกฏหมายและเป็นธรรมในการเก็บรวบรวมข้อมูลส่วนบุคคล
            อย่างจำกัดเพียงเท่าที่จำเป็น ภายใต้วัตถุประสงค์การทำงานของ
            โรงเรียนวรพัฒน์ โดยจะเก็บรวบรวมข้อมูล ส่วนบุคคลของท่าน ดังนี้
          </p>
          <ul>
            <li>- ชื่อ-สกุล</li>
            <li>- เบอร์โทรศัพท์</li>
            <li>- โรคประจำตัว/อาการแพ้</li>
            <li>- รูปถ่าย</li>
          </ul>
          <p class="indent-10">
            ทั้งนี้ข้อมูลส่วนบุคคลดังกล่าวเป็นข้อมูลที่จำเป็นสำหรับการทำงานของ
            โรงเรียนวรพัฒน์ หากไม่มี ข้อมูลดังกล่าว
            ระบบจะไม่สามารถทำงานโดยสมบูรณ์
            ผู้ใช้เป็นผู้เลือกได้ว่าจะบันทึกข้อมูลส่วนบุคคลอื่นใด
            และยินดีจะเปิดเผยข้อมูลดังกล่าวกับบุคคลหรือหน่วยงานอื่นหรือไม่
          </p>
        </section>

        <section>
          <h3 class="text-h6">แหล่งที่มาของข้อมูลส่วนบุคคล</h3>
          <p class="indent-10">
            โรงเรียนวรพัฒน์ ได้รับข้อมูลส่วนบุคคล
            ด้วยความสมัครใจของผู้ใช้เท่านั้น โดยการลงทะเบียนใช้ โรง เรียนวรพัฒน์
            จะถือเป็นการยอมรับเงื่อนไขการใช้งานและอนุญาติให้ระบบจัดเก็บ ใช้
            และเปิดเผยข้อมูล เหล่านั้นได้ตามวัตถุประสงค์
          </p>
        </section>

        <section>
          <h3 class="text-h6">วัตถุประสงค์ในการเก็บรวบรวมข้อมูลส่วนบุคคล</h3>
          <p class="indent-10">
            โรงเรียนวรพัฒน์ จะเก็บรวบรวมข้อมูลส่วนบุคคลของท่าน
            เพื่อนำไปใช้หรือเปิดเผยเท่าที่จำเป็น
            ภายใต้วัตถุประสงค์ในการใช้บริการ
          </p>
          <p class="indent-10">
            โรงเรียนวรพัฒน์ จะไม่ดำเนินการอื่นใดแตกต่างจากที่ระบุในวัตถุประสงค์
            เว้นแต่ มีกฏหมายบัญญัติ ให้กระทำ
            หรือมีหนังสือร้องขอที่สามารถปฏิบัติได้ตามกฏหมาย เช่น
            เพื่อความจำเป็นในการป้องกันด้าน สุขภาพและโรคติดต่ออันตราย
          </p>
        </section>

        <section>
          <h3 class="text-h6">การเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล</h3>
          <p class="indent-10">
            โรงเรียนวรพัฒน์ จะดำเนินการกับข้อมูลส่วนบุคคลของท่าน ในการเก็บรวบรวม
            ใช้ และ เปิดเผย ข้อมูลส่วนบุคคล เมื่อได้รับความยินยอมจากท่าน
            ตามวัตถุประสงค์ที่ระบุไว้เท่านั้น นอกจากนี้ เรียนวรพัฒน์
            อาจจำเป็นต้องเปิดเผยข้อมูลส่วนบุคคลของท่านให้กับเจ้าหน้าที่หรือหน่วยงานที่มีอำนาจหน้าที่ตามกฏหมาย
            เช่น
            การพิจารณาคดีของศาลและการดำเนินงานของเจ้าหน้าที่ในกระบวนการพิจารณาคดี
          </p>
          <p class="indent-10">
            โรงเรียนวรพัฒน์ขออนุญาตถ่ายรูป บันทึกภาพ VDO
            เพื่อใช้ในกิจกรรมต่างๆรวมถึงการจดบันทึก พัฒนาการ
            เพื่อใช้ประกอบการเรียนการสอน
            และใช้เป็นหลักฐานของการปฏิบัติกิจกรรมเพื่อจัดเก็บข้อมูล
            รวมถึงขออนุญาตใช้ภาพและวีดีโอที่ได้บันทึกไว้เผยแพร่ผ่านช่องทางสื่อออนไลน์และการนำเสนอผลงานของ
            โรงเรียนวรพัฒน์ในโอกาสต่างๆ
            เพื่อเป็นประโยชน์แก่การแลกเปลี่ยนเรียนรู้ และพัฒนาคุณภาพการจัด
            การศึกษาต่อ
          </p>
        </section>

        <section>
          <h3 class="text-h6">การเก็บรักษาและระยะเวลา</h3>
          <p class="indent-10">
            โรงเรียนวรพัฒน์
            ตระหนักถึงความสำคัญของการรักษาความปลอดภัยของข้อมูลส่วนบุคคลของท่าน
            โรงเรียนวรพัฒน์
            จึงกำหนดให้มีมาตรการในการรักษาความมั่นคงปลอดภัยของข้อมูลส่วนบุคคลอย่างเหมาะสม
            และสอดคล้องกับการรักษาความลับ และป้องกันการเข้าถึง ทำลาย ใช้ แปลง
            แก้ไข หรือเปิดเผยข้อมูล ส่วนบุคคล
            โดยไม่มีสิทธิหรือโดยไม่ชอบด้วยกฏหมาย
          </p>
          <p class="indent-10">
            โดยมีระยะเวลาการจัดเก็บข้อมูลส่วนบุคคลตลอดระยะเวลาการใช้งาน
            โรงเรียนวรพัฒน์ เพื่อให้ ระบบทำงานได้โดยสมบูรณ์
            ทั้งนี้เมื่อพ้นระยะเวลาการเก็บรักษา
            และไม่มีเหตุให้ต้องเก็บรักษาข้อมูลส่วน บุคคลนั้นต่อไป
            โรงเรียนวรพัฒน์ จะลบหรือทำลายข้อมูลส่วนบุคคลของท่าน
          </p>
        </section>

        <section>
          <h3 class="text-h6">สิทธิของเจ้าของข้อมูล</h3>
          <p class="indent-10">
            ท่านมีสิทธิในการดำเนินการ ได้แก่ สิทธิในการเพิกถอนความยินยอม,
            สิทธิในการเข้าถึงข้อมูลส่วน บุคคล, สิทธิในการคัดค้านการเก็บรวบรวม
            ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล, สิทธิในการลบและแก้ไขข้อมูล ส่วนบุคคล
            เว้นแต่มีข้อจำกัดสิทธิโดยกฏหมาย
          </p>
          <p class="indent-10">
            ท่านสามารถติดต่อ โรงเรียนวรพัฒน์ เพื่อให้ดำเนินการตามสิทธิข้างต้นได้
            โดยไม่มีค่าใช้จ่ายใดๆ และ จะแจ้งผลตามคำร้อง ภายใน 30 วัน
          </p>
        </section>

        <section>
          <h3 class="text-h6">ช่องทางติดต่อ</h3>
          <p>
            ผู้ควบคุมข้อมูลส่วนบุคคล<br />
            โรงเรียนวรพัฒน์<br />
            63 ซอยพัฒโนอุทิศ ตำบลหาดใหญ่ อำเภอหาดใหญ่ จังหวัดสงขลา 90110<br />
            โทร: 074-236-020<br />
            เว็บไซต์:
            <a href="https://www.warraphat.ac.th" target="_blank"
              >www.warraphat.ac.th</a
            >
          </p>
        </section>
      </v-card-text>
    </v-card>
    <v-row class="my-5">
      <v-col cols="6">
        <v-btn
          class="ma-2 w-full font-bold text-white"
          color="grey"
          @click="cancelConsent"
        >
          {{ $t("don't accept") }}
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
          dark
          class="ma-2 w-full white--text font-bold"
          color="#ff6b81"
          @click="saveConsent"
        >
          {{ $t("accept") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import loadingOverlay from "../loading/loadingOverlay.vue";

export default {
  name: "PDPAInformation",
  components: { loadingOverlay },
  data() {
    return {
      consentChecked: false,
      concent_detail: null,
      user_detail: null,
      consent_loading: false,
    };
  },
  computed: {
    ...mapGetters({
      get_concent: "loginModules/getConcent",
    }),
  },
  mounted() {
    this.concent_detail = JSON.parse(localStorage.getItem("dataConcent"));
    this.user_detail = JSON.parse(localStorage.getItem("userDetail"));
  },
  methods: {
    ...mapActions({
      SendConcent: "loginModules/SendConcent",
      GetConcent: "loginModules/GetConcent",
    }),

    async saveConsent() {
      this.consent_loading = true;

      let payload = {
        consent: true,
      };
      await this.SendConcent({ payload });
      if (this.user_detail) {
        await this.GetConcent();
        let payload_concent = { concent_data: this.get_concent };
        localStorage.setItem("dataConcent", JSON.stringify(payload_concent));
      }

      this.$emit("pdpa-accepted");

      this.consent_loading = false;
    },
    async cancelConsent() {
      this.consent_loading = true;
      let payload_concent = { concent_data: true };
      localStorage.setItem("dataConcent", JSON.stringify(payload_concent));
      this.$emit("pdpa-canceled");
      this.consent_loading = false;
    },
  },
};
</script>

<style scoped>
section {
  margin-bottom: 20px;
}
</style>
