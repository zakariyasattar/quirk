const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://quirkhealth:gMBBJZYbw346wpk9@quirk-main.yygw4d6.mongodb.net/?retryWrites=true&w=majority&appName=quirk-main";

var axios = require('axios');
var data = JSON.stringify({
    "collection": "main",
    "database": "quirk",
    "dataSource": "quirk-main",
    "projection": {
        "_id": 1
    }
});

var config = {
    method: 'post',
    url: 'https://us-east-2.aws.data.mongodb-api.com/app/data-sqfgkzu/endpoint/data/v1/action/find',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': 'IrYY8klS5K3mTpsZN15pVmYY6DJQTTlPvaj6IVgYelhrABeoTbEEzEqoJHfy5Ur2',
    },
    data: data
};

axios(config)
    .then(function (response) {
        console.log(data);
    })
    .catch(function (error) {
        console.log(error);
    });
