const redis = require("redis");
const Promise = require("bluebird");
const { v4 } = require("uuid");
const moment = require("moment");
const _ = require("lodash");
const {
  uniqueNamesGenerator,
  colors,
  animals,
} = require("unique-names-generator");

const redisClient = Promise.promisifyAll(redis.createClient());

const REDIS_KEYS = {
  LIST_OF_BIDS: "LIST_OF_BIDS",
  LIST_OF_CAMPAIGNS: "LIST_OF_CAMPAIGNS",
};

const STATUS = {
  PENDING: 0,
  ERROR: 1,
  LOSE: 2,
  WIN: 3,
};

const bidsToResolve = {};

function createCampaigns(numberOfCampaigns) {
  const campaigns = [];

  for (let index = 0; index < numberOfCampaigns; index++) {
    campaigns.push(uniqueNamesGenerator({ dictionaries: [colors, animals] }));
  }

  return campaigns;
}

function createBids(numberOfBids, campaigns) {
  const bids = {};

  for (let index = 0; index < numberOfBids; index++) {
    const bidId = v4();
    const bidObject = {
      price: _.random(1, 100),
      campaign: campaigns[_.random(0, campaigns.length - 1)],
      status: STATUS.PENDING,
    };

    bids[bidId] = bidObject;

    const resolveTime = moment()
      .add(_.random(0, 60), "seconds")
      .unix();

    if (!bidsToResolve[resolveTime]) {
      bidsToResolve[resolveTime] = {};
    }

    bidsToResolve[resolveTime][bidId] = bidObject;
  }

  return bids;
}

async function resolveBids(now) {
  const bids = bidsToResolve[now];

  if (!bids) {
    return;
  }
   
  await Promise.map(Object.entries(bids), async ([bidId, bid]) => {
    bid.status = _.random(1, STATUS.WIN);
    await redisClient.setAsync(bidId, JSON.stringify(bid));
  });

  delete bidsToResolve[now];
}

async function run(numberOfCampaigns, minBPS, maxBPS) {
  console.log("Running...");

  const campaigns = createCampaigns(numberOfCampaigns);

  await Promise.each(campaigns, (campaign) =>
    redisClient.saddAsync(REDIS_KEYS.LIST_OF_CAMPAIGNS, campaign)
  );

  while (true) {
    const now = moment().unix();
    const numberOfBids = _.random(minBPS, maxBPS);
    const bids = createBids(numberOfBids, campaigns);

    await Promise.map(Object.entries(bids), async ([bidId, bid]) => {
      await redisClient.setAsync(bidId, JSON.stringify(bid));
      await redisClient.zaddAsync(REDIS_KEYS.LIST_OF_BIDS, now, bidId);
    });

    await resolveBids(now);
    // redisClient.zrange(REDIS_KEYS.LIST_OF_BIDS, 0, 100, 'WITHSCORES', redis.print);
    /*     redisClient.zrange(REDIS_KEYS.LIST_OF_BIDS, 0, 10, (err, result) =>
    {
      try
      {
        console.log(result);
      }
      catch
      {
        console.log(err);
      }
    }); */

   //redisClient.smembers(REDIS_KEYS.LIST_OF_CAMPAIGNS, redis.print);

    // redisClient.zscore(REDIS_KEYS.LIST_OF_BIDS, '01435a46-9e97-4255-93e1-6607d3e1394d', redis.print);
    //redisClient.get('1e750996-37d0-4889-9bbc-43b7780ab973', redis.print);
    await Promise.delay(moment.duration(1, "second").asMilliseconds());
  }
}

const [numberOfCampaigns, minBPS, maxBPS] = process.argv.slice(2);

if (!numberOfCampaigns || !minBPS || !maxBPS) {
  console.error("Please include all three parameters");

  process.exit(1);
}

run(parseInt(numberOfCampaigns), parseInt(minBPS), parseInt(maxBPS)).catch(
  (err) => {
    console.error(`Failed seeding: ${err}`);
  }
);


[1, 2, 3, 4].map(function(n){
    return Math.pow(n, 2)
}).reduce((a, b) => a + b, 0)