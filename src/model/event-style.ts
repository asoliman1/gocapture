import { Image } from './image';
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
    is_randomize : boolean
}