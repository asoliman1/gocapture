import { Image } from "./image";

export class Activation {

    id: number;
    create_date: string;
    modified_date: string;
    activation_identifier: {
        background_image: Image;
    };
    event: {
        form_id: number;
    };
    is_active: boolean;
    name: string;

}