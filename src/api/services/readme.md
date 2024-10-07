# Services

Here we create functions for the API to call to make database operations. In the ./helpers file we create functions like getOneEntityByField which are used by all services with the help of typecasting. 

## Naming Convention

get[Model]By[Field] for single row returned
get[Model plural]By[Field] for mutiple rows returned 