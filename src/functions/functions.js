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
export const generateTimeArray = (timedata) => {
    const startHour = parseInt(timedata.start_time.HH);
    // const endHour = parseInt(timedata.end_time.HH);

    const output = [];
    for (let hour = 0; hour <= 24; hour++) {
        if (hour !== startHour) {
            output.push(hour);
        }
    }

    return output;
}
export const CheckFileSize = (file) => {
    console.log("func File", file);
    const fileSizeInBytes = file.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    console.log("fileSizeInMB", fileSizeInMB);
    if (fileSizeInMB > 10) {
        Swal.fire({
            icon: "error",
            title: "ขนาดไฟล์ต้องไม่เกิน 10 MB",
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
    console.log("fileSizeInMB", fileSizeInMB);
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