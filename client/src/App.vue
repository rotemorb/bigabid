<template>
  <div id="app" class="container">
    <h1>Bigabid Banker</h1>
    <select @change="getSelectedCampaign">
      <option v-for="option in options" :key="option.value">
        {{ option.text }}
      </option>
    </select>
    <pending-bids id="pending" :bidsFinalData="bidsFinalData"></pending-bids>
  </div>
</template>

<script>
import PendingBids from './components/PendingBids.vue';
import Api from './services/Api';

export default {
  data()
  {
    return {
      loading: true,
      selected: '1',
      options: [],
      bids: [],
      bidsIntermittentData: [],
      bidsFinalData: []
    };
  },
  components:
  {
    PendingBids
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
    },
    selectedCampaign:
    {
      get()
      {
        return this.selected;
      },
      set(campaign)
      {
        return this.selected = campaign;
      }
    }
  },
  methods: {

    async getBidsData()
    {
      this.bidsIntermittentData.length = 0;
      let bidsId = {
        bids: []
      };
      //update bidIds to be used in next loop
      for (let i = 0; i < this.updatedBids.length; i++)
      {
        //Only iterate on even values, since odd values hold the 
        //unix timestamp and we want the bidId iteself
        if (i % 2 === 0)
        {
          bidsId.bids.push({
            'bidId': this.updatedBids[i],
            'bidTime': this.updatedBids[i + 1],
          });
        }
      }

      //Push all returnd data to bidsData array

      await Api.getBidsData(bidsId).then(data => //JSON.stringify(bidsId)
      {
        this.bidsIntermittentData.push(...data);
      });
    },
    getSelectedCampaign(e)
    {
      if (e.target.options.selectedIndex > -1)
      {
        this.selectedCampaign = e.target.options[e.target.options.selectedIndex].text;
      }

      this.bidsFinalData = Array.from(this.bidsIntermittentData).filter(bid => bid.campaign === this.selectedCampaign);
    },
    async getBids()
    {
      let bidsData = [];
      await Api.getAllBids().then((res) =>
      {
        bidsData = res;
      });

      return bidsData;
    },
    async resolveAllBids()
    {
      this.updatedBids.length = 0; //Initialize this.updatedBids, to clear the bids table
      await Promise.resolve(this.getBids()).then((res) =>
      {
        res.forEach(bid =>
        {
          this.updatedBids = bid;
        });

      });
    }
  },
  mounted()
  {
    // Set dropdown campaings
    Api.getAllCampaigns().then(campaigns =>
    {
      let value = 0;
      campaigns.sort().forEach(campaign =>
      {
        let campaignData = {
          value,
          text: campaign
        };
        this.updateOptions = campaignData;
        value++;
      });
      // Sets dropdown selected option
      this.selectedCampaign = this.options[0].text;
      this.resolveAllBids().then(() =>
      {
        this.getBidsData().then(() =>
        {
          this.bidsFinalData = Array.from(this.bidsIntermittentData).filter(bid => bid.campaign === this.selectedCampaign);
        });
      });
    });
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
