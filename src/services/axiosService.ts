import axios from 'axios';

class AxiosService {
  async processGetRequest(
    apiUrl: string,
    params = {},
    headers =  {}
  ) {
    try {
      const { data } = await axios.get(apiUrl, {
        params: params,
        headers: headers,
        validateStatus: function (status: number) {
          return status >= 200 && status <= 500;
        },
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async processPostRequest(
    apiUrl: string,
    params = {},
    headers =  {},
  ) {
    try {
      const resp = await axios.post(apiUrl, params, {
        headers: headers,
        validateStatus: function (status: number) {
          return status >= 200 && status <= 500;
        },
      });
      return resp.data;
      } catch (error) {
      console.error(error);
    }
  }
}

export default new AxiosService();
