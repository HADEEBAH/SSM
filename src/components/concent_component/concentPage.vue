<template>
  <v-container>
    <loading-overlay :loading="consent_loading"></loading-overlay>
    <v-card class="mt-14">
      <!-- <v-card-text>
        <h5 class="text-h5 text-center mt-5">
          ความยินยอมในการเก็บรวบรวม ใช้ และ/หรือเปิดเผยข้อมูลส่วนบุคคล
        </h5>
        <br />
        <p class="text-h3 text-center">
          สำหรับระบบ Smart School Management ของโรงเรียนวรพัฒน์
        </p>
      </v-card-text> -->

      <v-card-text>
        <section>
          <h5 class="text-h5 text-center mt-5">
            ความยินยอมในการเก็บรวบรวม ใช้ และ/หรือเปิดเผยข้อมูลส่วนบุคคล
          </h5>
          <br />
          <p class="text-h3 text-center">
            สำหรับระบบ Smart School Management ของโรงเรียนวรพัฒน์
          </p>
        </section>
        <section>
          <p class="">
            ข้าพเจ้าขอให้ความยินยอมในการเก็บรวบรวม ใช้ ประมวลผล
            และ/หรือเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าแก่โรงเรียนวรพัฒน์
            <span class="font-bold">(“โรงเรียน”)</span>
            ตามรายละเอียดและเพื่อวัตถุประสงค์ดังต่อไปนี้
          </p>
        </section>
        <section>
          <h5 class="text-h5">
            1. ข้อมูลส่วนบุคคลที่เก็บรวบรวม ใช้ ประมวลผล และ/หรือเปิดเผย:
          </h5>
          <ul class="indent-10">
            <li>1.1 ชื่อ-นามสกุลของผู้เรียน</li>
            <li>1.2 ข้อมูลสุขภาพของผู้เรียน</li>
            <li>
              1.3 ข้อมูลผู้ปกครอง (ชื่อ-นามสกุล, ความสัมพันธ์, เบอร์ติดต่อ)
            </li>
            <li>1.4 ภาพถ่าย / ภาพเคลื่อนไหว</li>
          </ul>
        </section>

        <section>
          <h5 class="text-h5">
            2. วัตถุประสงค์ในการเก็บรวบรวม ใช้ ประมวลผล
            และ/หรือเปิดเผยข้อมูลส่วนบุคคล:
          </h5>
          <ul class="indent-10">
            <li>2.1 เพื่อการลงทะเบียนและจัดการเรียนการสอน</li>
            <li>
              2.2 เพื่อความจำเป็นในการป้องกันด้านสุขภาพและโรคติดต่ออันตราย
            </li>
            <li>2.3 เพื่อติดต่อสื่อสารกับผู้ปกครอง</li>
            <li>
              2.4
              เพื่อนำภาพถ่าย/ภาพเคลื่อนไหวใช้ในการประชาสัมพันธ์กิจกรรมของโรงเรียน
              การจัดทำสื่อการเรียนรู้ รายงานประจำปี เว็บไซต์
              และช่องทางการสื่อสารของโรงเรียน
            </li>
          </ul>
        </section>

        <section>
          <h5 class="text-h5">3. ระยะเวลาการเก็บข้อมูล</h5>
          <p class="indent-10">
            จัดเก็บข้อมูลจนกว่าวัตถุประสงค์ของการเก็บรวบรวม ใช้
            และเผยแพร่สิ้นสุด
            หรือจนกว่าผู้ปกครองจะเพิกถอนความยินยอมโดยแจ้งเป็นลายลักษณ์อักษรต่อโรงเรียน
          </p>
        </section>

        <section>
          <h5 class="text-h5">
            4. รายละเอียดในการเก็บรวบรวม ใช้ ประมวลผล
            และ/หรือเปิดเผยข้อมูลส่วนบุคคล
          </h5>
          <p class="indent-10">
            โรงเรียนจะเก็บรวบรวม ใช้ ประมวลผล
            และ/หรือเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าดังรายละเอียดที่ปรากฎในนโยบายการคุ้มครองข้อมูลส่วนบุคคล
            ซึ่งข้าพเจ้าได้อ่าน รับทราบ และตกลงปฏิบัติตามโดยเคร่งครัด
          </p>
        </section>

        <section>
          <h5 class="text-h5">5. ช่องทางการติดต่อ</h5>
          <p class="indent-10">
            ข้าพเจ้าสามารถติดต่อสอบถามรายละเอียดการเก็บรวบรวม ใช้ ประมวลผล
            และ/หรือเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า
            หรือใช้สิทธิของข้าพเจ้าในฐานะเจ้าของข้อมูลส่วนบุคคล
            หรือเพิกถอนความยินยอมที่ได้ให้ไว้ตามหนังสือฉบับนี้
            โดยติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของโรงเรียน
            ตามรายละเอียดด้านล่างนี้
          </p>
        </section>

        <section>
          <p>
            ผู้ควบคุมข้อมูลส่วนบุคคล<br />
            โรงเรียนวรพัฒน์<br />
            63 ซอยพัฒโนอุทิศ ตำบลหาดใหญ่ อำเภอหาดใหญ่ จังหวัดสงขลา 90110<br />
            074-236-020<br />
            <span>
              <a href="https://warraphat.ac.th" target="_blank"
                >https://warraphat.ac.th</a
              >
            </span>
          </p>
        </section>
        <section>
          <p class="indent-10">
            ข้าพเจ้าขอให้ความยินยอมแก่บริษัทในการเก็บรวบรวม ใช้ ประมวลผล
            และ/หรือเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า
            และตกลงที่จะผูกพันตามข้อกำหนดและเงื่อนไขที่ปรากฏในหนังสือฉบับนี้
            และนโยบายการคุ้มครองข้อมูลส่วนบุคคล รายละเอียดปรากฏตาม
            <span>
              <a href="https://warraphat.one.th/profileRules" target="_blank"
                >https://warraphat.one.th/profileRules</a
              >
            </span>
            ทุกประการ
          </p>
        </section>
      </v-card-text>
    </v-card>
    <v-row class="my-5">
      <v-col cols="6" align="end">
        <v-btn
          dark
          class="ma-2 white--text font-bold"
          color="#ff6b81"
          @click="saveConsent"
        >
          {{ $t("assent") }}
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
          class="ma-2 font-bold text-white"
          color="grey"
          @click="cancelConsent"
        >
          {{ $t("don't consent") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import loadingOverlay from "../loading/loadingOverlay.vue";
import Swal from "sweetalert2";

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
      cancelConcent: "loginModules/cancelConcent",
    }),

    async saveConsent() {
      Swal.fire({
        icon: "question",
        title: this.$t("do you want to assent"),
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: this.$t("agree"),
        cancelButtonText: this.$t("no"),
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.consent_loading = true;
          let payload = {
            consent: true,
          };
          await this.SendConcent({ payload });
          if (this.user_detail) {
            await this.GetConcent();
            let payload_concent = { concent_data: this.get_concent };
            localStorage.setItem(
              "dataConcent",
              JSON.stringify(payload_concent)
            );
          }
          this.$emit("pdpa-accepted");
          this.consent_loading = false;
        }
      });
    },
    async cancelConsent() {
      this.consent_loading = true;
      let payload_concent = { concent_data: true };
      localStorage.setItem("dataConcent", JSON.stringify(payload_concent));
      this.cancelConcent();
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
