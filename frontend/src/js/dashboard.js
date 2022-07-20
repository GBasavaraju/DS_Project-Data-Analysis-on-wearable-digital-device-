import api from './api';
import { MultiSelectDropdown, Select } from './utils';
import { set_graph_data } from './heart_rate';


var dashboard = null;

class Dashboard {
    LABELS_TO_IDS = { 'Avg HR': 'hr-stat', 'HRMax_%': 'hr-max-stat', 'FatBurn_%': 'fat-burn-stat', 'Relax%': 'relax-stat', 'SPO2': 'spo2-stat' };
    constructor(dashboard_id) {
        this.dashboard = document.getElementById(dashboard_id);
        this._initialise_stats();
        // this._load_stats();
    }

    _initialise_stats() {
        this.stats = {}
        for (const [json_key, div_id] of Object.entries(this.LABELS_TO_IDS)) {
            const stat_div = document.getElementById(div_id);
            this.stats[json_key] = stat_div.getElementsByClassName('stat-value')[0];
        }
    }

    async _load_stats() {
        const data = await api.load_dashboard().catch(() => { });
        this.display_stats(data);
    }

    display_stats(data) {
        for (const [key, value] of Object.entries(data)) {
            this.stats[key].textContent = value;
        }
    }
}

class ActivityUserSelection {
    constructor(container_id, activity_selection_id, user_selection_id) {
        this.root = document.getElementById(container_id);
        this.activity_dropdown = new MultiSelectDropdown(activity_selection_id);
        this.btn = this.root.querySelector('button[type=submit]');
        this.btn.addEventListener('click', (event) => this.submit(event));

        this.load_users(user_selection_id);
    }

    async load_users(user_selection_id) {
        const users = await api.get_users();
        this.user_dropdown = new Select(user_selection_id, false,
            users.reduce((acc, curr) => {
                acc[curr['username']] = curr['username'];
                return acc;
            }, {}));

    }

    async submit(event) {
        event.preventDefault();
        const params = { 'username': this.user_dropdown.get_value(), 'activities': this.activity_dropdown.get_values() };
        const data = await api.load_graph_data(params);
        set_graph_data(data);
    }


}


export function initialise_dashboard() {
    dashboard = new Dashboard('dashboard');
    const activity_selection = new ActivityUserSelection('activity-selection',
        'activity-selection-dropdown', 'user-selection-dropdown');
}

export function set_stats(data) {
    dashboard.display_stats(data);
}