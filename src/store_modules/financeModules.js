import axios from "axios";
import VueCookie from "vue-cookie"
var XLSX = require("xlsx");
import moment from 'moment'
import Swal from "sweetalert2";
const financeModules = {
  namespaced: true,
  state: {
    finance_detail : {},
    finance_filter : [],
    finance_filter_loading : false,
  },
  mutations: {
    SetFinanceLoading (state, payload){
      state.finance_filter_loading = payload
    },
    SetFinanceDetail(state, payload){
      state.finance_detail = payload
    },
    SetFinanceFilter(state, payload){
      state.finance_filter = payload
    }
  },
  actions: {
    async financeDetail(context,{order_number}){
      try{
        let {data} = await axios.get(`${process.env.VUE_APP_URL}/api/v1/adminpayment/${order_number}`)
        if(data.stateCode == 200){
          // // console.log(data)
        }
      }catch(error){
        // // console.log(error)
      }
    },
    async financeFilter(context,{filter}){
      context.commit("SetFinanceLoading",true)
      try{
        let config = {
          headers:{
              "Access-Control-Allow-Origin" : "*",
              "Content-type": "Application/json",
              'Authorization' : `Bearer ${VueCookie.get("token")}`
          }
        }
        // console.log("37 =>",filter)
        // let localhost = "http://localhost:3000"
        let endpoint = `${process.env.VUE_APP_URL}/api/v1/adminpayment/filter?`
        endpoint = endpoint + `studentName=${filter.students}&`
        endpoint = endpoint + `status=${filter.payment_status}&`
        endpoint = endpoint + `type=${filter.payment_type}&`
        endpoint = endpoint + `courseName=${filter.course_id}&`
        endpoint = endpoint + `courseType=${filter.course_type_id}&`
        endpoint = endpoint + `package=${filter.package_id}&`
        endpoint = endpoint + `option=${filter.option_id}&`
        endpoint = endpoint + `createdDateStart=${filter.date_doc_start}&`
        endpoint = endpoint + `createdDateEnd=${filter.date_doc_end}&`
        endpoint = endpoint + `paymentDateStart=${filter.date_pay_start}&`
        endpoint = endpoint + `paymentDateEnd=${filter.date_pay_end}&`
        endpoint = endpoint + `priceMin=${filter.service_charge_start}&`
        endpoint = endpoint + `priceMax=${filter.service_charge_end}`
        // console.log(endpoint)
        let {data} = await axios.get( endpoint, config)
        if(data.statusCode == 200){
          // console.log(data.data)
          let reports = []
          let sumPrice = 0
          let sumPending = 0
          let sumSuccess = 0
          let sumCancel = 0
          let sumfail = 0
          if(data.data.length > 0){
            data.data.forEach(order => {
              sumPrice = sumPrice + parseFloat(order.price)
              if(order.payment_status === 'success'){
                sumSuccess = sumSuccess + parseFloat(order.price)
              }
              if(order.payment_status === 'pending'){
                sumPending = sumPending + parseFloat(order.price)
              }
              if(order.payment_status === 'cancel'){
                sumCancel = sumCancel + parseFloat(order.price)
              }
              if(order.payment_status === 'fail'){
                sumfail = sumfail + parseFloat(order.price)
              }
              reports.push({
                "วันที่ออกเอกสาร" : moment(order.created_date).format("DD/MM/YYYY HH:mm"),
                "หมายเลขออเดอร์" : order.order_number,
                "สถานะ" : order.payment_status,
                "วันที่ชำระ" : order.paid_date,
                "ประเภทการชำระเงิน" : order.payment_type? order.payment_type == 'cash' ? 'เงินสด' : 
                order.payment_type == 'Credit Card'? 'บัตเครดิต/เดบิต' : 'โอนเงินเข้าบัญชี' :'',
                "ราคา" : parseFloat(order.price).toLocaleString(undefined,{minimumFractionDigits:2}),
                "ผู้รับเงิน" : order.payment?.recipient ? `${order.accountRecipientFirstNameTh} ${order.accountRecipientLastNameTh}` : '',
                "คอร์ส" : order.courseNameTh,
                "ประเภทคอร์ส" : order.courseTypeNameTh,
                "แพคเก็จ" : order.packageName, 
                "ระยะเวลา" : order.optionName,
                "โค้ช" : order.coach_name,
                "นักเรียน" : order.student_name,
                "ผู้ซื้อ" : order.created_by_name,
              })
            });
            if(data.data.length === reports.length){
              reports.push({
                "วันที่ออกเอกสาร" : 'ยอดชำระแล้ว',
                "หมายเลขออเดอร์" : sumSuccess,
                "สถานะ" :"ยอดรอดำเนินการ",
                "วันที่ชำระ" : sumPending,
                "ประเภทการชำระเงิน" :"ยอดยกเลิก",
                "ราคา" : sumCancel,
                "ผู้รับเงิน" : 'ยอดเกิดข้อผิดพลาด',
                "คอร์ส" : sumfail,
                "ประเภทคอร์ส" : 'รวม',
                "แพคเก็จ" : sumPrice, 
                "ระยะเวลา" : '',
                "โค้ช" : '',
                "นักเรียน" : '',
                "ผู้ซื้อ" : '',
              })
            }
          }
           // // console.log(report);
           if(reports.length > 0){
              var workbook = XLSX.utils.book_new();
              var worksheet = XLSX.utils.json_to_sheet(reports);
              XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');
              var excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
              var blob = new Blob([excelBuffer], { type: "application/octet-stream" });
              var url = URL.createObjectURL(blob);
              var link = document.createElement("a");
              link.href = url;
              link.download = `financeReport.xlsx`;
              link.click();
              URL.revokeObjectURL(url);
              context.commit("SetFinanceFilter",data.data)
              context.commit("SetFinanceLoading",false)
           }else{
            context.commit("SetFinanceLoading",false)
            Swal.fire({
              icon:"error",
              title: "ไม่พบข้อมูล",
              showDenyButton: false,
              showCancelButton: false,
              confirmButtonText: "ตกลง",
            })
          }
        }
      }catch(error){
        context.commit("SetFinanceLoading",false)
        // console.log(error)
      }
    }
  },
  getters: {
    getFinanceDetail(state){
      return state.finance_detail
    },
    getFinanceFilter(state){
      return state.finance_filter
    },
    getFinanceLoading(state){
      return state.finance_filter_loading
    }
  },
};

export default financeModules;
