export class MenuButtons {
    is_show : boolean;
    buttons : Button[];
}

class Button{
    type : string;
    show : number;
    label : string;
    order : number;
}