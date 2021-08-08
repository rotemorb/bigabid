Purpose:

Load bids into a Redis DB, and then display those bids upon selecting a related campaign from a Dropdown. Once a bid is resolved by the Seeder, UI should display it with the appropriate status.
This project Has 3 parts:

Seeder: Seeds bids into Redis DB

Client: UI to see the bids and thier respective status. Also contains an API to communicate with the server side (using Axios)

Server: Coomunicate with the Redis DB using redisClient and returns the bids/campaings
