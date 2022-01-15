# Compound-interests-with-nodejs

To run the application on docker:
1. make sure that the docker daemon is running
2. Type the command
  docker-compose up

## Endpoints:
1. http://{HOST}/api/deposit/ ===> The request body should have the following parameters, Calculates coumpound interest
  {
    deposit,
    customer_id,
    Interest_rate,
    yearly_compound_times
  }
2. http://{HOST}/api/customers/:customer_id/history/ ===> Takes customer_id as parameter. Retriveves customers transactions
3. http://{HOST}/api/customers/:customer_id/ ===> Takes customer_id as parameter. Deletes customer records by id
