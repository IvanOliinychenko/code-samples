import {
  HttpClient,
  json
} from 'aurelia-fetch-client';
import {
  Guid
} from 'services/guid';
import * as environment from 'environment';

let _apiUrl = '';
let _client = new HttpClient();

export class ApiClient {

  constructor() {

    if (environment.default.apiUrl) {
      _apiUrl = environment.default.apiUrl;
    }

    this.currentRequests = [];
  }

  get(options) {
    let o = options || {};
    o.method = 'get';

    return this.execute(o);
  }

  post(options) {
    let o = options || {};
    o.method = 'post';

    return this.execute(o);
  }

  put(options) {
    let o = options || {};
    o.method = 'put';

    return this.execute(o);
  }

  delete(options) {
    let o = options || {};
    o.method = 'delete';

    return this.execute(o);
  }

  execute(options) {
    let o = {
      method: options && options.method ? options.method : 'get',
      headers: options && options.headers ? options.headers : {},
      body: options && options.data ? json(options.data) : null,
      apiUrl: options && options.apiUrl ? options.apiUrl : _apiUrl
    };

    if (options && options.formData) {
      o.body = options.formData;
    }

    if (options && options.headers && options.headers['Content-Type']) {
      o.body = options.data;
    }

    let token = localStorage.getItem('token');
    if (token) {
      o.headers['Authorization'] = `Bearer ${token}`;
    }

    let url = options && options.url ? options.url : '';
    url = o.apiUrl + url;
    let apiRequest = this._addRequest(url, o.method);

    let promise = new Promise((resolve, reject) => {
      _client.fetch(url, o)
        .then(response => {
          this._removeRequest(apiRequest.id);
          if (response && !response.ok) {
            return response.text().then((text) => {
              reject(new Error(JSON.stringify({
                status: response.status,
                body: text
              })));
            });
          }
          resolve(response);
        })
        .catch(error => {
          this._removeRequest(apiRequest.id);
          reject(error);
        });
    });

    return promise;
  }

  static downloadToBlob(options, onprogress) {

    let promise = new Promise((resolve, reject) => {
      if (!options || !options.url || !options.url.length) reject('bad xhr arguments');

      let xhr = new XMLHttpRequest();
      xhr.open('GET', options.url, true);
      xhr.responseType = 'blob';

      if (options.headers) {
        Object.keys(options.headers).forEach(key => {
          xhr.setRequestHeader(key, options.headers[key]);
        });
      }

      xhr.onload = (event) => {
        options.xhr = null;
        if (xhr.status >= 200 && xhr.status < 300) {
          console.info('downloadToBlob : ' + options.url);
          let result = URL.createObjectURL(xhr.response);
          console.info('result', result);
          resolve(result);
        } else {
          console.info('1st reject:', xhr);
          reject(new Error(xhr.statusText));
        }
      };

      xhr.onerror = (error, x) => {
        options.xhr = null;
        console.info('2nd reject:', error, x, xhr);
        reject(new Error(xhr.statusText));
      };

      xhr.onprogress = onprogress;

      // xhr.onprogress = (event) => {
      //     if (event.lengthComputable) {
      //         ref.loadedBytes = event.loaded;
      //         ref.size = event.total;
      //     }
      // };

      options.xhr = xhr;

      xhr.send();
    });

    return promise;
  }

  _addRequest(url, method) {
    let apiRequest = new ApiRequest(url, method);
    this.currentRequests.push(apiRequest);
    return apiRequest;
  }

  _removeRequest(id) {
    this.currentRequests = this.currentRequests.filter(item => item.id !== id);
  }
}

class ApiRequest {
  constructor(url, method) {
    this.id = Guid.New();
    this.url = url;
    this.method = method;
  }
}
