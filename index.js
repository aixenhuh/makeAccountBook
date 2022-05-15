const AWS = require("aws-sdk");
const config = require('./config/config');
const express = require('express');
const app = express();
const port = 3000;

app.get('/api/add', (req, res, next) => {
    AWS.config.update(config.aws_remote_config);
    var reg_date = req.body.reg_date;
    var totalAsset = req.body.totalAccountSum;
    var spend = req.body.spendSum;
    var dividend = dividendSum;

    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName : config.aws_tabgle_name,
        Item : {
            reg_date : "asset",
            reg_id : reg_date,
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
                message : 'Error: Server error'
            })
        } else {
            const {Items } = data;
            res.send({
                success : true,
                message : 'Added fruit'
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
            ':fromDateTime' : '20220409',
            ':toDateTime' : '20220610'
        }
    }
    
    docClient.query(params, function (err, data) {
        if (err) {
            res.send({
                success : false,
                message : 'Error: Server error'
            })
        } else {
            const { Items } = data;
            res.send({
                success : true,
                message : Items
            })
        }
    })
})

app.listen(port, () => {
    console.log("123123");
})