<template>
  <div>
    <h2>Pending Bids</h2>
    <table>
      <thead>
        <tr>
          <th>Bid Id</th>
          <th>Bid Time</th>
          <th>Price</th>
          <th>campaign Id</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bid, index) in bidsFinalData" :key="index">
          <th>{{ bid.bidId }}</th>
          <th>{{ bid.bidTime }}</th>
          <th>{{ bid.price }}</th>
          <th>{{ bid.campaign }}</th>
          <th>{{ bid.status }}</th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "pendingBids",
  data: () => ({ name: "", score: "", allScores: [1, 2, 4] }),
  props: {
    bidsFinalData: []
  }
};
</script>

<style scoped>
table,
th,
td {
  border: 1px solid black;
}

table {
  border-collapse: collapse;
}
</style>
