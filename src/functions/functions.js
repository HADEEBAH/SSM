import Swal from 'sweetalert2';
export const inputValidation = (e, type) => {
    switch (type) {
        case "th":
            if ((/^[a-zA-Z]+$/).test(e.key)) {
                e.preventDefault()
            }
            break;
        case "th-special":
            if (!(/^[ก-๏\t]+$/).test(e.key)) {
                e.preventDefault()
            }
            break;
        case "en-special":
            if (!(/^[A-Za-z\t]+$/u).test(e.key)) {
                e.preventDefault()
            }
            break;
        case "en-number":
            if (!(/^[A-Za-z0-9\t]+$/u).test(e.key)) {
                e.preventDefault()
            }
            break;
        case "en":
            if ((/^[ก-๏\s]+$/u).test(e.key)) {
                if (e.key !== " ") {
                    e.preventDefault()
                }
            }
            break;
        case "number":
            if (!(/^[0-9\t]*$/).test(e.key)) {
                e.preventDefault()
            }
            break;
    }
}
export const dateDMY = (date) => {
    const currentDate = new Date(date);
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear());

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
}
export const dateFormatter = (date, formatter) => {
    date = new Date(date)
    // const months_th = [ "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม", ]
    // const months_th_mini = [ "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.", ]
    let date_string = ""
    switch (formatter) {
        case "DD MT YYYYT":
            date_string = date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', })
            break;
        case "DD MMT YYYYT": //เต็มเดือน
            date_string = date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', })
            break;
        case "DW DD MMT YYYYT": //เต็มเดือน
            date_string = date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
            break;
    }
    return date_string

}
export const generateTimeArrayHours = (timedata) => {
    const startHour = timedata;
    const output = [];
    for (let hour = 0; hour <= 23; hour++) {
        if(startHour.length > 0){
            if (!startHour.some(v => v === hour)) {
                output.push(hour.toString().padStart(2, '0'));
            }
        }else{
            output.push(hour.toString().padStart(2, '0'));
        }  
    }
    return output;
}
export const CheckFileSize = (file) => {
    const fileSizeInBytes = file.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    if (fileSizeInMB > 10) {
        Swal.fire({
            icon: "error",
            text: "ขนาดไฟล์ต้องไม่เกิน 10 MB",
            confirmButtonText: "ตกลง"
        })
        return false
    }
    return true
}

export const CheckFileSizeV2 = (file, id) => { //check file รอ merge กับ พี่น๊อต
    const key = document.getElementById(id)
    const fileSizeInBytes = file.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    if (fileSizeInMB > 10) {
        key.value = ''
        Swal.fire({
            icon: "error",
            text: "ขนาดไฟล์ต้องไม่เกิน 10 MB",
            confirmButtonText: "ตกลง"
        })
        return false
    }
    return true
}

export const CheckFileSizeType = (file, id) => { //check file รอ merge กับ พี่น๊อต
  const format = [
    "image/png",
    "image/jpeg"
  ]
  const key = document.getElementById(id)
  if (!format.includes(file.type)) {
    key.value = ""
    Swal.fire({
      icon: "error",
      title: "รูปแบบไฟล์ไม่ถูกต้อง",
      text: "( กรุณาแนบไฟล์นามสกุล jpg, jpeg, png )",
      confirmButtonText: "ตกลง"
    })
    return false
  }
  return true
}

export const  convertToThaiBaht = (number) => {
    const digits = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
    const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
    const unit = 'บาท';
    const decimal_separator = 'สตางค์';
    const no_decimal_part = 'ถ้วน';
    const [integer_part, decimal_part] = number.toFixed(2).split('.');
    let thai_baht = '';
    for (let i = 0; i < integer_part.length; i++) {
    const digit = parseInt(integer_part[i]);
    const position = integer_part.length - i - 1;

    if (digit !== 0) {
        if (digit === 1 && position === 1) {
        thai_baht += positions[position];
        } else if (digit === 2 && position === 1) {
            thai_baht += 'ยี่' + positions[position];
        } else {
            thai_baht += digits[digit] + positions[position];
        }
    }
    }
    thai_baht += unit;
    if (decimal_part && parseInt(decimal_part) !== 0) {
    const decimal_digits = decimal_part.split('');

    if (decimal_digits.length === 1) {
        thai_baht += digits[parseInt(decimal_digits[0])] + decimal_separator;
    } else {
        thai_baht += digits[parseInt(decimal_digits[0])] + 'สิบ' + digits[parseInt(decimal_digits[1])] + decimal_separator;
    }
    }else{
        thai_baht += no_decimal_part;
    }

    return thai_baht;
}