Purpose:

Load bids into a Redis DB, and then display those bids upon selecting a related campaign from a Dropdown. Once a bid is resolved by the Seeder, UI should display it with the appropriate status.

This project Has 3 parts:

Seeder: Seeds bids into Redis DB (Client/Index.js)

Client: UI to see the bids and thier respective status. Also contains an API to communicate with the server side (using Axios)

Server: Coomunicate with the Redis DB using redisClient and returns the bids/campaings


In order to run the project:
- Browse here https://github.com/dmajkic/redis/downloads and download Redis
- Once downloaded, browse to the 64bit folder, and run redis-server. The server should now run locally.
- First run "npm install" to install the packages in package.json.

1) Under VS Code, open a Bash terminal, and browse to /server. Execute "npm start". The server side should run and be ready to accept incoming connections.
2) Open another powershell terminal, browse to /client and run "npm install redis".
3) In the same terminal run the following command: node index.js [numberOfCampaigns], [minBPS], [maxBPS]. Index.js should start populating the DB with bids and respective Campagins' data. (for ex. node index.js 200 1 100)
4) Open another powershell terminal, browse to /client, and run the UI (npm run serve)

