import Swal from 'sweetalert2';
import VueI18n from '../i18n';
export const inputValidation = (e, type) => {
    switch (type) {
        //เคสเป็น false มันจะไม่ทำงาน จะทำต่อเมื่อเป็นทรู
        case "th":
            if (!(/^[a-zA-Z]+$/).test(e.key) || e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 9) {
                // TODO
            } else {
                e.preventDefault()
            }
            break;
        case "th-special":
            if ((/^[ก-๏\t]+$/).test(e.key) || e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 9) {
                // TODO
            } else {
                e.preventDefault()
            }
            break;
        case "en-special":
            if ((/^[A-Za-z\t]+$/u).test(e.key) || e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 9) {
                // TODO
            } else {
                e.preventDefault()
            }
            break;
        case "en-number":
            if ((/^[A-Za-z0-9\t]+$/u).test(e.key) || e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 9) {
                // TODO
            } else {
                e.preventDefault()
            }
            break;
        case "en":
            if (!(/^[ก-๏\s]+$/u).test(e.key) || e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 9) {
                // TODO
            } else {
                e.preventDefault()
            }
            break;
        case "en-spcebar":
            if (!(/^[ก-๏]+$/u).test(e.key) || e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 9) {
                // TODO
            } else {
                e.preventDefault()
            }
            break;
        case "number":
            if ((/^[0-9\t]*$/).test(e.key) || e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 9) {
                // TODO
            } else {
                e.preventDefault()
            }
            break;
        case "email":
            if ((/^[A-Za-z0-9@.]+$/).test(e.key) || e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 9) {
                // TODO
            } else {
                e.preventDefault()
            }
            break;
        case "free-nonum":
            if ((/^[a-zA-Zก-๙\s]+$/).test(e.key) || e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 9) {
                // TODO
            } else {
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
    let date_string = ""
    switch (formatter) {
        case "DD MT YYYYT":
            date_string = date.toLocaleDateString(VueI18n.locale == 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', })
            break;
        case "DD MMT YYYYT": //เต็มเดือน
            date_string = date.toLocaleDateString(VueI18n.locale == 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', })
            break;
        case "DW DD MMT YYYYT": //เต็มเดือน
            date_string = date.toLocaleDateString(VueI18n.locale == 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
            break;
    }
    return date_string

}
export const generateTimeArrayHours = (timedata) => {
    const startHour = timedata;
    const output = [];
    for (let hour = 0; hour <= 23; hour++) {
        if (startHour.length > 0) {
            if (!startHour.some(v => v === hour)) {
                output.push(hour.toString().padStart(2, '0'));
            }
        } else {
            output.push(hour.toString().padStart(2, '0'));
        }
    }
    return output;
}

// export const CheckFileSize = (file, id) => {
//     console.log('file :>> ', file);
//     const key = document.getElementById(id)
//     const fileSizeInBytes = file.size;
//     const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
//     if (fileSizeInMB >= 5 && (file.type === 'image/png' || file.type === 'image/jpeg')) {
//         key.value = ''
//         Swal.fire({
//             icon: "error",
//             title: VueI18n.t('something went wrong'),
//             text: VueI18n.t('file size must not exceed 5 MB'),
//             timer: 3000,
//             timerProgressBar: true,
//             showCancelButton: false,
//             showConfirmButton: false,
//         })
//         return false
//     } else if (fileSizeInMB >= 10 && (file.type === 'video/mp4' || file.fileType === 'video/x-matroska')) {
//         Swal.fire({
//             icon: "error",
//             title: VueI18n.t('something went wrong'),
//             text: VueI18n.t('file size must not exceed 10 MB'),
//             timer: 3000,
//             timerProgressBar: true,
//             showCancelButton: false,
//             showConfirmButton: false,
//         })
//     }
//     return true
// }



export const CheckFileSize = (file, id) => {
    const key = document.getElementById(id);
    const fileSizeInBytes = file.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    // Check for image file size limit (5 MB)
    if (fileSizeInMB >= 5 && (file.type === 'image/png' || file.type === 'image/jpeg')) {
        key.value = '';
        Swal.fire({
            icon: "error",
            title: VueI18n.t('something went wrong'),
            text: VueI18n.t('file size must not exceed 5 MB'),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
        });
        return false; // Prevent adding this file
    }

    // Check for video file size limit (10 MB)
    if (fileSizeInMB >= 10 && (file.type === 'video/mp4' || file.type === 'video/x-matroska')) {
        Swal.fire({
            icon: "error",
            title: VueI18n.t('something went wrong'),
            text: VueI18n.t('file size must not exceed 10 MB'),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
        });
        return false; // Prevent adding this file
    }

    return true; // Allow the file if no issues
}

export const CheckFileSizeType = (file, id) => {
    const format = [
        "image/png",
        "image/jpeg"
    ]
    const key = document.getElementById(id)
    if (!format.includes(file.type)) {
        key.value = ""
        Swal.fire({
            icon: "error",
            title: VueI18n.t('invalid file format'),
            text: VueI18n.t('please attach file extensions jpg, jpeg, png'),
            timer: 3000,
            timerProgressBar: true,
            showCancelButton: false,
            showConfirmButton: false,
        })
        return false
    }
    return true
}

export const convertToThaiBaht = (number) => {
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
    } else {
        thai_baht += no_decimal_part;
    }

    return thai_baht;
}
export const convertToEnglishCurrency = (number) => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const thousandNames = ['', 'thousand', 'million', 'billion', 'trillion']; // You can extend this array for larger numbers if needed

    const toWords = (num) => {
        if (num === 0) return 'zero';

        const parts = [];
        let i = 0;

        do {
            const part = num % 1000;
            if (part !== 0) {
                parts.push(toWordsThreeDigits(part) + ' ' + thousandNames[i]);
            }
            num = Math.floor(num / 1000);
            i++;
        } while (num > 0);

        return parts.reverse().join(' ');
    };

    const toWordsThreeDigits = (num) => {
        const parts = [];

        const hundredsDigit = Math.floor(num / 100);
        if (hundredsDigit > 0) {
            parts.push(ones[hundredsDigit] + ' hundred');
        }

        const lastTwoDigits = num % 100;
        if (lastTwoDigits >= 20) {
            parts.push(tens[Math.floor(lastTwoDigits / 10)]);
            if (lastTwoDigits % 10 > 0) {
                parts.push(ones[lastTwoDigits % 10]);
            }
        } else if (lastTwoDigits > 0) {
            if (lastTwoDigits === 10) {
                parts.push('ten');
            } else if (lastTwoDigits < 10) {
                parts.push(ones[lastTwoDigits])
            } else {
                parts.push(teens[lastTwoDigits - 11]);
            }
        }

        return parts.join(' ');
    };

    const integerPart = Math.floor(number);
    const decimalPart = Math.round((number - integerPart) * 100);

    let englishCurrency = toWords(integerPart) + ' bath';

    if (decimalPart > 0) {
        englishCurrency += ' and ' + toWords(decimalPart) + ' satang';
    }

    return englishCurrency;
};

export const shortMonthToLongMonth = (shortMonth) => {
    const thaiMonths = {
        'ม.ค.': 'มกราคม',
        'ก.พ.': 'กุมภาพันธ์',
        'มี.ค.': 'มีนาคม',
        'เม.ย.': 'เมษายน',
        'พ.ค.': 'พฤษภาคม',
        'มิ.ย.': 'มิถุนายน',
        'ก.ค.': 'กรกฎาคม',
        'ส.ค.': 'สิงหาคม',
        'ก.ย.': 'กันยายน',
        'ต.ค.': 'ตุลาคม',
        'พ.ย.': 'พฤศจิกายน',
        'ธ.ค.': 'ธันวาคม',
    };

    return thaiMonths[shortMonth] || shortMonth;
};