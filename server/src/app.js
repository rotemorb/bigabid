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

app.get("/getBidById", (req, res) => {
  try
  {
    console.log(req.params);
    redisClient.get("1e750996-37d0-4889-9bbc-43b7780ab973", (err, data) => {
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
