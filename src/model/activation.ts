import { Image } from "./image";

export class Activation {

    id: number;
    name: string;
    create_date: string;
    modified_date: string;
    activation_identifier: {
        background_image: Image;
    };
    event: {
        form_id: number;
    };
    is_active: boolean;

    public static parseActivation(dbActivation: any) {
        let act = new Activation();
        act.id = dbActivation.id;
        act.activation_identifier = dbActivation.activation_identifier ?
            JSON.parse(dbActivation.activation_identifier) : { background_image: { path: '', url: '' } };
        act.create_date = dbActivation.create_date;
        act.modified_date = dbActivation.modified_date;
        act.event = dbActivation.event ? JSON.parse(dbActivation.event) : { form_id: null };
        act.name = dbActivation.name;
        act.is_active = dbActivation.is_active;
        return act;
    }

    public static parseActivations(dbActivations: any[]) {
        return dbActivations.map((e) => this.parseActivation(e));
    }

    public static encodeActivation(activation: Activation) {
        let act: any = activation;
        act.activation_identifier = JSON.stringify(activation.activation_identifier);
        act.event = JSON.stringify(activation.event);
        return act;
    }

    public static encodeActivations(activations: Activation[]) {
        return activations.map((e) => this.encodeActivation(e));
    }

}