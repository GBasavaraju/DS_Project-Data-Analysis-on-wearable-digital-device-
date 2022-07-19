import { switch_to_darktheme } from './utils';
import { initialise_navbar } from './navbar';
import { initialise_heart_rate } from './heart_rate';
import { initialise_dashboard } from './dashboard';



function initialise() {
    switch_to_darktheme();
    initialise_navbar();
    initialise_dashboard();
    initialise_heart_rate();
}


initialise();