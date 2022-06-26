import { switch_to_lighttheme, switch_to_darktheme } from './utils';

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

    constructor(modal_id, trigger_btn_id) {
        this.modal_id = modal_id
        this.modal = document.getElementById(this.modal_id);
        document.getElementById(trigger_btn_id).addEventListener('click', () => this.toggle());
        this.modal.getElementsByClassName('modal-success-btn')[0].addEventListener('click', () => this.success());
        this.modal.getElementsByClassName('modal-cancel-btn')[0].addEventListener('click', () => this.cancel());
    }

    close() {
        this.modal.classList.remove('modal-open')
    }

    open() {
        this.modal.classList.add('modal-open')
    }

    toggle() {
        if (this.modal.classList.contains('modal-open')) {
            this.close();
        } else {
            this.open();
        }
    }

    success() {
        this.close();
    }

    cancel() {
        this.close();
    }
}

function upload_data() {

}

function toggle_data_upload_modal() {
    const modal = document.getElementById('data-upload-modal');
    if (modal.classList.contains('modal-open')) {
        modal.classList.remove('modal-open');
    } else {
        modal.classList.add('modal-open');
    }
}


function connect_events() {
    document.getElementById('dark-mode-toggle').addEventListener('change', switch_theme);
}

export function initialise_navbar() {
    connect_events();
    var data_upload_modal = new DataUploadModal('data-upload-modal', 'data-upload-modal-toggle');
}