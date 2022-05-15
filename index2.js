const AWS = require("aws-sdk");
const config = require('./config/config');

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
        ':reg_id' : 'totalAccount',
        ':fromDateTime' : '20220409',
        ':toDateTime' : '20220610'
    }
}

docClient.query(params, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        const {Items } = data;
        console.log(Items);
    }
})