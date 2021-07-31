const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const redis = require("redis");
const redisClient = redis.createClient();
const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

app.post("/getBidById", (req, res) => {
  try {
    redisClient.get("01435a46-9e97-4255-93e1-6607d3e1394d", (err, data) => {
      if (err) {
        console.error(err);
        throw err;
      }

      if (data) {
        res.status(200).send(JSON.parse(data));
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/getAllBids", (req, res) => {
  try {
    redisClient.zrange("LIST_OF_BIDS", 0, 100, "WITHSCORES", (err, data) => {
      if (err) {
        console.error(err);
        throw err;
      }

      if (data)
      {
        res.status(200).send(data);
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/getAllCampaigns", (req, res) => {
  try {
    redisClient.smembers('LIST_OF_CAMPAIGNS', (err, data) => {
      if (err) {
        console.error(err);
        throw err;
      }

      if (data)
      {
        res.status(200).send(data);
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.listen(8081);
