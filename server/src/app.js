const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const redis = require("redis");
const redisClient = redis.createClient();
const app = express();
app.use(morgan("combined"));
app.use(cors());

app.get("/getBidById", (req, res) => {
  try
  {
     redisClient.get(req.query.bidId, (err, data) => {
      if (err) {
        console.error(err);
        throw err;
      }

      if (data)
      {
        res.status(200).send(JSON.parse(data));
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/getAllBids", (req, res) => {
  try {
    redisClient.zrange("LIST_OF_BIDS", 0, 2000, "WITHSCORES", (err, data) => {
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
