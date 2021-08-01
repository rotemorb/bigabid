import axios from "axios";
const BASE_URL = "http://localhost:8081";

const funcs = {
  async getBidById(bidId) 
  {
    try 
    {
      let res = axios.get(`${BASE_URL}/getBidById/${bidId}`);

      let bid = await Promise.resolve(res).then((result) => 
      {
        if (result.status == 200) 
        {
          return result.data;
        }
      });

      return bid;
    }
    catch (err)
    {
      console.error(err);
    }
  },
  async getAllBids() 
  {
    try 
    {
      const response = await axios.post(`${BASE_URL}/getAllBids`);
      return response.data;
    }
    catch (err)
    {
      console.error(err);
    }
  },
  async getAllCampaigns()
  {
    try 
    {
      const response = await axios.post(`${BASE_URL}/getAllCampaigns`);
      return response.data;
    }
    catch (err)
    {
      console.error(err);
    }
  }
};

export default funcs;
