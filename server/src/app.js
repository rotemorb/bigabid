
const Promise = require("bluebird");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const redis = require("redis");
const redisClient = Promise.promisifyAll(redis.createClient());


const app = express();
app.use(morgan("combined"));
app.use(cors());
app.use(express.urlencoded({limit: '50mb'})); // to support URL-encoded bodies
app.use(express.json({limit: '50mb', extended: true, parameterLimit:50000}));      // to support JSON-encoded bodies
    
app.post("/getBidsData", (req, res) => {
  try
  {
    let response = [];
    var bidInfo = new Promise((resolve) => {
      Array.from(req.body.bids).forEach(bid =>
      {
        getBidData(bid["bidId"], bid["bidTime"]).then(res =>
        {
          response.push(JSON.parse(res));
          resolve();
        });
      });
    });

    bidInfo.then(() => {
      res.status(200).send(response);
    });
    
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

async function getBidData(bidID, bidTime)
{
  let bidData = {};
  await redisClient.getAsync(bidID).then(data =>
  {
    if (data)
    {
      let bidDataObj = JSON.parse(data);
      bidDataObj.bidId = bidID;
      bidDataObj.bidTime = bidTime;
      bidData = JSON.stringify(bidDataObj);  
    }
  })

  return bidData;
}

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

app.get("/bids", (req, res) => {
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

app.get("/campaigns", (req, res) => {
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