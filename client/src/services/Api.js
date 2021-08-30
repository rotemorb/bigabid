import axios from "axios";
const BASE_URL = "http://localhost:8081";

const funcs = {
  async getBidsData(bidIdList)
  {
    try 
    {
      let res = axios.post(`${BASE_URL}/getBidsData`, bidIdList);
      let bids = {};

      await Promise.resolve(res).then((result) => 
      {
        if (result.status == 200) 
        {
          bids = result.data;
        }
      });
      
      return bids;
    }
    catch (err)
    {
      console.error(err);
    }
  },
  async getBidsDataById(bidId) 
  {
    try 
    {
      let res = axios.get(`${BASE_URL}/getBidById?bidId=${bidId}`);
      let bid = {};
      
      await Promise.resolve(res).then((result) => 
      {
        if (result.status == 200) 
        {
          bid = result.data;
        }
      });
      
      return bid;
    }
    catch (err)
    {
      console.error(err);
    }
  }, 
  async getBidById(bidId) 
  {
    try 
    {
      let res = axios.get(`${BASE_URL}/getBidById?bidId=${bidId}`);
      let bid = {};
      
      await Promise.resolve(res).then((result) => 
      {
        if (result.status == 200) 
        {
          bid = result.data;
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
      const response = await axios.get(`${BASE_URL}/bids`);
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
      const response = await axios.get(`${BASE_URL}/campaigns`);
      return response.data;
    }
    catch (err)
    {
      console.error(err);
    }
  }
};

export default funcs;

