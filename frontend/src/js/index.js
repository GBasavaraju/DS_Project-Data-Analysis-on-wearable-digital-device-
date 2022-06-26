import { switch_to_darktheme } from './utils';
import { initialise_navbar } from './navbar';
import { initialise_heart_rate } from './heart_rate';



function initialise() {
    switch_to_darktheme();
    initialise_navbar();
    initialise_heart_rate();
}


initialise();