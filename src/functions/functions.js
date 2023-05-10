import Swal from 'sweetalert2';
export const inputValidation = (e, type) => {
    switch (type) {
        case "th":
            if ((/^[a-zA-Z\s]+$/).test(e.key)) {
                e.preventDefault()
            }
            break;
        case "th-special":
            if (!(/^[ก-ฮ]+$/).test(e.key)){
                e.preventDefault()
            }
            break;
        case "en-special":
            if(!(/^[A-Za-z]+$/u).test(e.key)){
                e.preventDefault()
            }
            break;
        case "en-number":
            if(!(/^[A-Za-z0-9]+$/u).test(e.key)){
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
            if (!(/^[0-9]*$/).test(e.key)) {
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