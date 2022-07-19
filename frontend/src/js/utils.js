import { LineController } from "chart.js";

export function switch_to_lighttheme() {
    document.documentElement.classList.remove('dark')
    document.documentElement.dataset.theme = 'cupcake'
}

export function switch_to_darktheme() {
    document.documentElement.classList.add('dark')
    document.documentElement.dataset.theme = 'dark'
}


export class AlertMessage {
    constructor(alert) {
        this.alert = alert;
    }

    hide() {
        this.alert.classList.add('hidden');
    }

    show() {
        this.alert.classList.remove('hidden');
    }

    set_message(msg) {
        this.alert.getElementsByClassName('alert-message')[0].textContent = msg;
    }

    show_alert(msg) {
        this.set_message(msg);
        this.show();
    }
}

export class MultiSelectDropdown {
    constructor(div_id, dom_ready = true, label_values = {}) {
        this.root = document.getElementById(div_id);
        this.label = this.root.getElementsByClassName('dropdown-label')[0];
        if (!dom_ready) {
            const ul = this.root.getElementsByTagName('ul')[0];
            for (const [key, value] of Object.entries(label_values)) {
                ul.appendChild(this._construct(key, value));
            }
        }
        this.checkboxes = this.root.querySelectorAll('input[type=checkbox]');
        this.values = new Set();
        for (const checkbox of this.checkboxes) {
            checkbox.addEventListener('change', (event) => this.update_values(event));
            if (checkbox.checked) {
                this.values.add(checkbox.value);
            }
        }
        this.update_label();
    }

    update_values(event) {
        if (event.target.checked) {
            this.values.add(event.target.value);
        } else {
            this.values.delete(event.target.value)
        }

        this.update_label();
    }

    update_label() {
        if (this.values.size > 0) {
            this.label.innerHTML = Array.from(this.values).join(', ')
        } else {
            this.label.innerHTML = 'Please select...'
        }
    }

    get_values() {
        return Array.from(this.values);
    }

    _construct(label, value) {
        const elem = document.createElement('li');
        elem.innerHTML = `<label class="label cursor-pointer">
            <span class="label-text">${label}</span>
            <input type="checkbox" class="checkbox" value="${value}" />
            </label>`;
        return elem;
    }
}

export class Select {
    constructor(select_id, dom_ready = false, label_values) {
        this.select = document.getElementById(select_id);
        if (!dom_ready) {
            for (const [key, value] of Object.entries(label_values)) {
                this.select.appendChild(this._construct(key, value));
            }
        }
    }

    _construct(label, value) {
        const elem = document.createElement('option', {'value': value});
        elem.innerHTML = label;
        return elem;
    }

    get_value() {
        return this.select.value;
    }

}