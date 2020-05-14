export class DateTimeOptions{
   static datePicker = [
        {id : 1 ,label : "Standard", value: "standard"},
        {id : 2, label : "Month day year (October 20 2016) ", value: "mdy"},
        {id : 3 ,label : "Day Name Mon day year (Tue Nov 1 2015) ", value: "dnmdy"},
        {id : 4, label : "Calendar", value: "calendar"}
    ]

    static timePicker = [
        {id : 1, label : "Standard", value: "standard"},
        {id : 2, label : "Hour Minute AM/PM (9:45 PM) ", value: "hm-12h"},
        {id : 3, label : "24 Hours (21:45) ", value: "24h"}
    ]

    static dateTimePicker = [
        {id : 1, label : "Standard", value: "standard"},
        {id : 2, label : "Month day year - Hour Minute AM/PM (October 20 2016 9:45 PM) ", value: "mdy-12h"},
        {id : 3, label : "Month day year - 24 Hours (October 20 2016 21 45) ", value: "mdy-24h"},
        {id : 4, label : "Day Name Mon day year - Hour Minute AM/PM (Tue Nov 1 2016 9 45 PM)", value: "dnmdy-12h"},
        {id : 5, label : "Day Name Mon day year - 24 Hours (Tue Nov 1 2016 21 45)", value: "dnmdy-24h"},
        {id : 6, label : "Calendar", value: "calendar"}
    ]

  
}