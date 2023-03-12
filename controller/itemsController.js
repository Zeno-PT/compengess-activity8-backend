//import  {DynamoDBClient} from "@aws-sdk/client-dynamodb";
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });

const docClient = new DynamoDBClient({ regions: process.env.aws_region });
const aws_remote_config = {
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  sessionToken: process.env.aws_session_token,
  region: process.env.aws_region,
};

exports.getGroupMembers = async (req, res) => {
  const params = {
    TableName: process.env.aws_group_members_table_name,
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
exports.getItems = async (req, res) => {
  const params = {
    TableName: process.env.aws_items_table_name,
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.addItem = async (req, res) => {
  const item = { ...req.body };
  const params = {
    TableName: process.env.aws_items_table_name,
    Item: item,
  };
  try {
    await docClient.send(new PutCommand(params));
    res.send(`Item id ${item.item_id} was created successfully.`);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.deleteItem = async (req, res) => {
  var params = {
    TableName: process.env.aws_items_table_name,
    Key: { item_id: req.params.item_id },
  };
  try {
    await docClient.send(new DeleteCommand(params));
    res.send(`Item id ${req.params.item_id} was deleted successfully.`);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
