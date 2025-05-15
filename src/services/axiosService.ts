import axios from 'axios';

class AxiosService {
  async processGetRequest(
    apiUrl: string,
    params = {},
    headers =  {}
  ) {
    try {
      const token = localStorage.getItem("authToken");
      const headersData =  {
        "Authorization": `Bearer ${token}`,
        ...headers
      } 
      const { data } = await axios.get(apiUrl, {
        params: params,
        headers: headersData,
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
      const token = localStorage.getItem("authToken");
      const headersData =  {
        "Authorization": `Bearer ${token}`,
        ...headers
      } 
      const resp = await axios.post(apiUrl, params, {
        headers: headersData,
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
