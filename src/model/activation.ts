import { Form } from './form';
import { ACTIVATIONS_DISPLAY_FORM } from './../constants/activations-display';
import { Image } from "./image";

export class Activation {

    id: number;
    name: string;
    create_date: string;
    modified_date: string;
    background_image: string;
    event: Form;
    is_active: boolean;
    activation_capture_form_after: boolean;
    display_capture_form: number;
    url: string;
    capture_screen_url: string;
    submit_button_background_color: string;
    submit_button_text_color: string;
    submit_button_text: string;
    activation_style: activationStyle;
    instructions_content: string;
    instructions_mobile_mode: number;

    public static parseActivation(dbActivation: any, form: Form) {
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
        act.submit_button_text_color = dbActivation.submit_button_text_color;
        act.activation_style = new activationStyle(dbActivation.activation_style);
        act.instructions_content = dbActivation.instructions_content;
        act.instructions_mobile_mode =dbActivation.instructions_mobile_mode;
        return act;
    }

    public static parseActivations(dbActivations: any[], form: Form) {
        return dbActivations.map((e) => this.parseActivation(e, form));
    }

    public static encodeActivation(activation: Activation) {
        let act: any = activation;
        act.event = JSON.stringify(activation.event);
        act.activationStyle = JSON.stringify(activation.activation_style);
        return act;
    }

    public static encodeActivations(activations: Activation[]) {
        return activations.map((e) => this.encodeActivation(e));
    }

}

class activationStyle {
    is_enable_screensaver: boolean;
    is_event_screensaver: boolean;
    screensaver_rotation_period: number;
    screensaver_media_items: Image[];
    is_randomize: boolean;
    switch_frequency: number;
    transition_effect: string;

    constructor(data: any) {
        this.is_enable_screensaver = data.is_enable_screensaver;
        this.is_event_screensaver = data.is_event_screensaver;
        this.is_randomize = data.is_randomize;
        this.switch_frequency = data.switch_frequency;
        this.transition_effect = data.transition_effect;
        this.screensaver_rotation_period = data.rotation_period;
        this.screensaver_media_items = data.screensaver_media_items.map((e) => {
            return { path: '', url: e }

        })
    }
}