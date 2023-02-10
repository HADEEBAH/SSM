export const inputValidation = (e, type)=>{
    switch (type) {
        case "th":
            if((/^[a-zA-Z\s]+$/).test(e.key)){
                e.preventDefault()
              }
            break;
        case "en":
            if((/^[ก-๏\s]+$/u).test(e.key)){
                e.preventDefault()
            }
            break;
        case "number":
            if(!(/^[0-9]*$/).test(e.key)){
                e.preventDefault()
            }
            break;
    }
}
export const dateFormatter = (date, formatter)=>{
    date = new Date(date)
    const months_th = [ "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม", ]
    const months_th_mini = [ "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.", ]
    let date_string = ""
    switch(formatter) {
        case "DD MT YYYYT":
            date_string = date.getDate()+" "+ months_th_mini[date.getMonth()]+" "+(date.getFullYear() + 543)
            break;
        case "DD MMT YYYYT":
            date_string = date.getDate()+" "+ months_th[date.getMonth()]+" "+(date.getFullYear()+543)
            break;
    }
    return date_string

}