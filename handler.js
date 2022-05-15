const AWS = require("aws-sdk");
const config = require('./config/config');
const awsServerlessExpress = require("aws-serverless-express");
const express = require("express");
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
var cors = require('cors');
app.use(cors());

app.post('/api/add', (req, res, next) => {
  AWS.config.update(config.aws_remote_config);
  console.log("123");
  var reg_date = req.body.reg_date;
  var totalAsset = req.body.totalAccountSum;
  var spend = req.body.spendSum;
  var dividend = req.body.dividendSum;

  console.log(totalAsset)
  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
      TableName : config.aws_tabgle_name,
      Item : {
          reg_date : reg_date,
          reg_id : "asset",
          totalAsset : totalAsset,
          spend : spend,
          dividend : dividend
      }
  }
  
  docClient.put(params, function (err, data) {
      if (err) {
          console.log(err);
          res.send({
              success : false,
              message : 'Error: Server error',
              statusCode : 400
          })
      } else {
          const {Items } = data;
          res.send({
              success : true,
              message : 'Added fruit',
              statusCode : 200
          })
      }

  })
})


app.get('/api/getData', (req, res, next) => {
  AWS.config.update(config.aws_remote_config);
  
  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
      TableName : config.aws_tabgle_name,
      KeyConditionExpression : '#reg_id = :reg_id AND #reg_date BETWEEN :fromDateTime AND :toDateTime',
      ExpressionAttributeNames : {
          '#reg_id' : 'reg_id',
          '#reg_date' : 'reg_date'
      },
      ExpressionAttributeValues: {
          ':reg_id' : 'asset',
          ':fromDateTime' : '20151019',
          ':toDateTime' : '20220610'
      }
  }

  docClient.query(params, function (err, data) {
      if (err) {
          res.send({
              success : false,
              message : 'Error: Server error',
              statusCode : 400
          })
      } else {
          const { Items } = data;
          res.send({
              success : true,
              message : Items,
              statusCode : 200
          })
      }
  })
})

const server = awsServerlessExpress.createServer(app)

module.exports.index = (event, context) =>
  awsServerlessExpress.proxy(server, event, context)
