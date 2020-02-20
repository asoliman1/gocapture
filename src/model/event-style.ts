import { Image } from './image';
import { MenuButtons } from './menuButton';

export class EventStyle {
    // A.S
    event_record_background: Image;
    event_text_color: string;
    elements_label_color: string;
    // A.S GOC-333
    is_enable_screensaver: true;
    screensaver_rotation_period: number;
    screensaver_media_items: Image[];
    transition_effect: string;
    switch_frequency: number;
    is_randomize : boolean;
    // A.S GOC-330
    buttons_menu : MenuButtons;
    floating_buttons : MenuButtons;
    // A.S GOC-353
    capture_background_color : string;
    // A.S GOC-374
    capture_background_image : Image;
    element_background_color : string;
    element_background_opacity : number;
    element_background_mode : string;
}