

class Api {
    constructor() {
        this.base_url = 'http://localhost:5000/'
        this.mock = false;
    }

    async _request(url_slug, request_obj) {
        const response = await fetch(this.base_url + url_slug, request_obj)
            .catch((response) => {
                throw new Error(`An error has occured: ${response.status}`);
            });

        if (!response.ok) {
            throw new Error(`An error has occured: ${response.status}`);
        }

        return response.json();
    }

    async load_dashboard() {
        return this._request('dashboard/', { method: 'GET' });
    }

    async load_graph_data(params) {
        let data = null;
        if (params) {
            const activity_string = params.activities.map((activity) => `activity=${activity}`).join('&');
            data = await this._request(`healthbyparam?user_name=${params.username}&${activity_string}`, { method: 'GET' });
            data = this.format_graph_data(data);
            return data;
        }
        data = await this._request('health', { method: 'GET' });
        data = this.format_graph_data(data);
        return data;
    }

    async get_users() {
        let data =  await this._request('users', { method: 'GET' });
        data = this.format_user_data(data);
        return data;
    }

    async upload_file(file, username, activity) {
        let formData = new FormData()

        formData.append('file', file)
        formData.append('user_name', username);
        formData.append('activity', activity);

        return this._request('upload', {
            method: 'POST',
            mode: 'cors',
            body: formData
        });
    }

    format_user_data(data) {
        return data.map(user_data => ({'username': user_data[1]}));
    }

    format_graph_data(data) {
        // Data looks like
        // [485, '2022-07-17 15:53:47', 176, 98, 1, 'sleeping', 'divesh']
        console.log(data)
        var hr;
        var spo2;
        var username;
        var activity;
        var run_id;
        var formatted_data = {};

        for (const line of data) {
            run_id = line[4];
            hr = line[2];
            spo2 = line[3];
            activity = line[5];
            username = line[6];

            if (run_id in formatted_data) {
                formatted_data[run_id]['HR'].push(hr);
                formatted_data[run_id]['SPO2'].push(spo2);
            } else {
                formatted_data[run_id] = {'runId': run_id, 'activity': activity, 'username': username, 'HR': [hr], 'SPO2': [spo2]};
            }
        }
        return Object.values(formatted_data);
    }
}

const api = new Api();

export default api;