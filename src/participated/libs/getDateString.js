export function getDateFormatString(date){
  let dateFormatString = new Date(date)
  let year =  dateFormatString.getFullYear().toString()
  let month = (dateFormatString.getMonth()+1).toString()
  let day = dateFormatString.getDay().toString()
  if(month.length === 1) month = '0'+month
  if(day.length === 1) day = '0' + day
  dateFormatString = year +'-' + month +'-' + day
  return dateFormatString
}
