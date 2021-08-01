<template>
  <div id="app" class="container">
    <h1>Bigabid Banker</h1>
    <select @change="getSelectedCampaign">
      <option v-for="option in options" :key="option.value">
        {{ option.text }}
      </option>
    </select>
    <pending-bids id="pending" :bidsFinalData="bidsFinalData"></pending-bids>
    <resolved-bids id="resolved"></resolved-bids>
  </div>
</template>

<script>
import PendingBids from './components/PendingBids.vue';
import ResolvedBids from './components/ResolvedBids.vue';
import Api from './services/Api';

export default {
  data()
  {
    return {
      selected: '1',
      options: [],
      bids: [],
      bidsFinalData: []
    };
  },
  components:
  {
    PendingBids,
    ResolvedBids
  },
  computed:
  {
    updatedBids:
    {
      get()
      {
        return this.bids;
      },
      set(newBids)
      {
        return this.bids.push(newBids);
      }
    },
    updateOptions:
    {
      get()
      {
        return this.options;
      },
      set(option)
      {
        return this.options.push(option);
      }
    }

  },
  methods: {
    async getBids()
    {
      let bidsData = [];
      await Api.getAllBids().then((res) =>
      {
        bidsData = res;
      });

      return bidsData;
    },
    getBidsData()
    {
      for (let i = 0; i < this.updatedBids.length; i++)
      {
        if (i % 2 === 0)
        {
          const bidJSON = this.getBidDataById(this.updatedBids[i]);
          const bidData = {
            bidId: this.updatedBids[i],
            bidTime: this.updatedBids[i + 1],
            bidPrice: bidJSON.price,
            campaign: bidJSON.campaign,
            status: bidJSON.status
          };
          this.bidsFinalData.push(bidData);
        }
      }
      console.log(this.selected);
      this.bidsFinalData = [...new Map(this.bidsFinalData.map(item =>
        [item.bidId, item])).values()].filter(bid =>
        {
          return bid.campaign === this.selected;
        });
    },
    getBidDataById() //TODO: pass bidID as parameter
    {
      return JSON.parse('{ "price": 50, "campaign": "jade_beaver", "status": 1 }'); // TODO:  Api.getBidById(bidId);
    },
    getSelectedCampaign(e)
    {
      if (e.target.options.selectedIndex > -1)
      {
        this.selected = e.target.options[e.target.options.selectedIndex].text;
      }
      this.setAllBIds();
    },
    setAllBIds()
    {
      Promise.resolve(this.getBids()).then((res) =>
      {
        res.forEach(bid =>
        {
          this.updatedBids = bid;
        });
        this.getBidsData();
      });
    }
  },
  mounted()
  {
    // Set dropdown campaings
    Api.getAllCampaigns().then(campaigns =>
    {

      let value = 0;
      campaigns.forEach(campaign =>
      {
        let campaignData = {
          value,
          text: campaign
        };
        this.updateOptions = campaignData;
        value++;
      });
    });

    // Sets dropdown selected option
    this.selected = this.options[0];
    this.setAllBIds();
    /* 
        setInterval(() =>
        {
          Promise.resolve(this.getBids()).then((res) =>
          {
            res.forEach(bid =>
            {
              this.updatedBids = bid;
            });
            this.getBidsData();
          });
    
        }, 3000); */
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  grid-column: 1 / 3;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 10vh 10vh 80vh;
  padding: 1.5rem;
}

h1 {
  grid-column: 2;
  grid-row: 1;
  justify-self: center;
  align-self: center;
}

select {
  grid-column: 2;
  grid-row: 2;
  justify-self: center;
  align-self: center;
}

#pending {
  grid-column: 1;
  grid-row: 3;
  justify-self: center;
}

#resolved {
  grid-column: 3;
  grid-row: 3;
  justify-self: center;
}
</style>
