export const inputValidation = (e, type)=>{
    if(type === "en"){
        if(!(/^[a-zA-Z\s]+$/).test(e.key)){
            e.preventDefault()
          }
    }else if(type === "th"){
        if(!(/^[ก-๏\s]+$/u).test(e.key)){
            e.preventDefault()
        }
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