import Chart from 'chart.js/auto';
import api from "./api";



let graphs = null;

class Colors {
    constructor() {
        this.colors_by_activity = {
            'dark': {
                'idle': {
                    'hr': 'rgba(210, 101, 85, 0.85)',
                    'spo2': 'rgba(102, 93, 200, 0.85)'
                },
                'jogging': {
                    'hr': 'rgba(237, 101, 85, 0.85)',
                    'spo2': 'rgba(102, 93, 222, 0.85)'
                },
                'exercise': {
                    'hr': 'rgba(237, 101, 85, 0.85)',
                    'spo2': 'rgba(102, 93, 222, 0.85)'
                }
            }
        }
    }

    get_hr_color(activity) {
        return this._get_color(activity, 'hr');
    }

    get_spo2_color(activity) {
        return this._get_color(activity, 'spo2');
    }

    _get_color(activity, signal) {
        const is_dark = document.documentElement.dataset.theme == 'dark' ? true : false;
        if (is_dark) {
            return this.colors_by_activity['dark'][activity][signal]
        }
    }
}

function get_random_color() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r}, ${g}, ${b}, 0.8)`;
}

class Graphs {
    constructor(hr_canvas_id, spo2_canvas_id) {
        this.hr_chart = this.get_hr_chart(hr_canvas_id);
        this.spo2_chart = this.get_spo2_chart(spo2_canvas_id);
        this.colors = new Colors();
        this._load_data();
    }

    get_spo2_chart(canvas_id) {
        const ctx = document.getElementById(canvas_id).getContext('2d');
        return new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    data: [],
                    fill: true
                }],
                labels: []
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Oxygen Saturation',
                        padding: 30
                    }
                },
                scales: {
                    y : {
                        suggestedMin: 85
                    }
                },
                elements: {
                    point : {
                        radius: 0
                    }
                },
                interaction: {
                    intersect: false
                }
            }
        });
    }

    get_hr_chart(canvas_id) {
        const ctx = document.getElementById(canvas_id).getContext('2d');
        return new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    data: [],
                    fill: true
                }],
                labels: []
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Heart Rate',
                        padding: 30
                    }
                },
                scales: {
                    y : {
                        suggestedMin: 40
                    }
                },
                elements: {
                    point : {
                        radius: 0
                    }
                },
                interaction: {
                    intersect: false
                }
            }
        });
    }

    set_hr_data(datalist, max_length) {
        const labels = Array.from({ length: max_length }, (x, i) => i);

        const graph_datasets = datalist.map((data) => {
            const color = get_random_color();
            return {
                label: data.activity,
                data: data.HR,
                tension: 0.4,
                backgroundColor: color,
                borderColor: color
            }
        })
        const graph_data = {
            datasets: graph_datasets,
            labels: labels
        }
        this.hr_chart.data = graph_data;
        this.hr_chart.update();
    }

    set_spo2_data(datalist, max_length) {
        const labels = Array.from({ length: max_length }, (x, i) => i);
        const graph_datasets = datalist.map((data) => {
            const color = get_random_color();
            return {
                label: data.activity,
                data: data.SPO2,
                tension: 0.1,
                backgroundColor: color,
                borderColor: color
            }
        })
        const graph_data = {
            datasets: graph_datasets,
            labels: labels
        }
        this.spo2_chart.data = graph_data;
        this.spo2_chart.update();
    }

    set_data(data) {
        let max_hr_length = 0;
        let max_spo2_length = 0;
        for (const dataset of data) {
            max_hr_length = Math.max(max_hr_length, dataset['HR'].length)
            max_spo2_length = Math.max(max_spo2_length, dataset['SPO2'].length)
        }

        this.set_hr_data(data, max_hr_length);
        this.set_spo2_data(data, max_spo2_length);
    }

    async _load_data() {
        const data = await api.load_graph_data();
        this.set_data(data);
    }
}



export function initialise_heart_rate() {
    graphs = new Graphs('hr-canvas', 'spo2-canvas');
}

export function set_graph_data(data) {
    graphs.set_data(data);
}