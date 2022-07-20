import { switch_to_lighttheme, switch_to_darktheme, AlertMessage, Select } from './utils';
import api from './api';
import { set_stats } from './dashboard';
import { set_graph_data } from './heart_rate';

function switch_theme(event) {
    if (event.target.checked) {
        localStorage.theme = 'light';
        switch_to_lighttheme();
    } else {
        localStorage.theme = 'dark';
        switch_to_darktheme();
    }
}


class DataUploadModal {

    constructor(modal_id, trigger_btn_id, file_input_id, user_input_id, activity_input_id) {
        this.modal_id = modal_id
        this.modal = document.getElementById(this.modal_id);
        this.form = this.modal.getElementsByTagName('form')[0];
        this.file_input = document.getElementById(file_input_id);
        this.activity_input = document.getElementById(activity_input_id);
        this.progress_bar = this.modal.getElementsByTagName('progress')[0];
        
        this.error_alert = new AlertMessage(this.modal.getElementsByClassName('alert-error')[0]);


        this.file_input.addEventListener('change', () => this.update_filename());

        document.getElementById(trigger_btn_id).addEventListener('click', () => this.toggle());
        this.modal.getElementsByClassName('modal-success-btn')[0].addEventListener('click', (event) => this.success(event));
        this.modal.getElementsByClassName('modal-cancel-btn')[0].addEventListener('click', () => this.cancel());

        this.load_users(user_input_id);
    }

    async load_users(user_selection_id) {
        const users = await api.get_users();
        this.user_input = new Select(user_selection_id, false,
            users.reduce((acc, curr) => {
                acc[curr['username']] = curr['username'];
                return acc;
            }, {}));
    }

    update_filename() {
        this.modal.getElementsByClassName('modal-message')[0].textContent = this.file_input.files[0].name;
    }

    close() {
        this.error_alert.hide();
        this.modal.classList.remove('modal-open')
        this.modal.getElementsByClassName('modal-message')[0].textContent = 'Please choose a file'
    }

    open() {
        this.modal.classList.add('modal-open');
    }

    toggle() {
        if (this.modal.classList.contains('modal-open')) {
            this.close();
        } else {
            this.open();
        }
    }

    async success(event) {
        event.preventDefault();
        
        if (this.form.checkValidity()) {
            this.progress_bar.classList.remove('hidden');
            const stat_data = await api.upload_file(this.file_input.files[0], this.user_input.get_value(),
                            this.activity_input.value).catch(() => this.error_alert.show_alert('Required inputs are missing'));
                            const health_data = await api.load_graph_data();
            this.progress_bar.classList.add('hidden');
            set_stats(stat_data);
            set_graph_data(health_data);
            this.close();
        } else {
            this.error_alert.show_alert('Required inputs are missing');
        }
    }

    cancel() {
        this.close();
    }
}




function connect_events() {
    document.getElementById('dark-mode-toggle').addEventListener('change', switch_theme);
}

export function initialise_navbar() {
    connect_events();
    var data_upload_modal = new DataUploadModal('data-upload-modal', 
                                                'data-upload-modal-toggle', 
                                                'data-upload-input',
                                                'data-upload-user',
                                                'data-upload-activity');
}