import { Form } from './form';
import { ACTIVATIONS_DISPLAY_FORM } from './../constants/activations-display';
import { Image } from "./image";

export class Activation {

    id : number;
    name: string;
    create_date : string;
    modified_date : string;
    background_image: string;
    event : Form;
    is_active: boolean;
    activation_capture_form_after : boolean;
    display_capture_form : number;
    url : string;
    capture_screen_url : string;
    submit_button_background_color: string;
    submit_button_text_color: string;
    submit_button_text: string;

    public static parseActivation(dbActivation: any, form : Form) {
        let act = new Activation();
        act.id = dbActivation.id;
        act.background_image = dbActivation.background_image;
        act.create_date = dbActivation.create_date;
        act.modified_date = dbActivation.modified_date;
        act.event = form;
        act.name = dbActivation.name;
        act.is_active = dbActivation.is_active;
        act.activation_capture_form_after = dbActivation.activation_capture_form_after;
        act.url = dbActivation.url;
        act.capture_screen_url = dbActivation.capture_screen_url;
        act.display_capture_form = dbActivation.display_capture_form;
        act.submit_button_background_color = dbActivation.submit_button_background_color;
        act.submit_button_text = dbActivation.submit_button_text;
        act.submit_button_text_color = dbActivation.submit_button_text_color
        return act;
    }

    public static parseActivations(dbActivations: any[] , form :Form) {
        return dbActivations.map((e) => this.parseActivation(e,form));
    }

    public static encodeActivation(activation: Activation) {
        let act: any = activation;
        act.event = JSON.stringify(activation.event);
        return act;
    }

    public static encodeActivations(activations: Activation[]) {
        return activations.map((e) => this.encodeActivation(e));
    }

}