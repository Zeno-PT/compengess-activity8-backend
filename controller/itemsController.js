const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });

const aws_remote_config = {
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  sessionToken: process.env.aws_session_token,
  region: process.env.aws_region,
};
const docClient = new AWS.DynamoDB.DocumentClient();
exports.getItems = async (req, res) => {
  AWS.config.update(aws_remote_config);
  const params = {
    TableName: process.env.aws_table_name,
  };
  try {
    const data = await docClient.scan(params).promise();
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

exports.addItem = async (req, res) => {
  AWS.config.update(aws_remote_config);
  const item = { ...req.body };
  const params = {
    TableName: process.env.aws_table_name,
    Item: item,
  };
  try {
    await docClient.put(params).promise();
    res.send(`Item id ${item.item_id} was created successfully.`);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

exports.deleteItem = async (req, res) => {
  AWS.config.update(aws_remote_config);
  var params = {
    TableName: process.env.aws_table_name,
    Key: { item_id: req.params.item_id },
  };
  try {
    await docClient.delete(params).promise();
    res.send(`Item id ${req.params.item_id} was deleted successfully.`);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
