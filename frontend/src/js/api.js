

class Api {
    constructor() {
        this.base_url = 'http://localhost:3000/'
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
        if (params) {
            const activity_string = params.activities.map((activity) => `activity=${activity}`).join('&');
            return this._request(`health/?username=${params.username}&${activity_string}`, { method: 'GET' })
        }
        return this._request('health/', { method: 'GET' });
    }

    async get_users() {
        return this._request('users/', { method: 'GET' });
    }

    upload_file(file, username, activity, success_callback, failure_callback) {
        let formData = new FormData()

        formData.append('file', file)
        formData.append('username', username);
        formData.append('activity', activity);

        fetch(this.base_url + 'upload/', {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        })
            .then((response) => {
                if (response.ok) {
                    success_callback(response);
                } else {
                    failure_callback(response);
                }
            })
            .catch((response) => {
                failure_callback(response);
            });
    }

}

const api = new Api();

export default api;