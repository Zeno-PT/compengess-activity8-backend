//import  {DynamoDBClient} from "@aws-sdk/client-dynamodb";
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");



const aws_items_table_name = "items_db_99";
const aws_group_members_table_name = "group_members_99";
const AWS_REGION = "us-east-1";
const AWS_ACCESS_KEY_ID = "ASIATMS7XTWS2OC3GM6R";
const AWS_SECRET_ACCESS_KEY = "v31OqKw6/2iCcDxc2BRJZbrvZDgR0u+Jx9hSuyEQ";
const AWS_SESSION_TOKEN =
  "FwoGZXIvYXdzEBEaDNDir8UtAimb1dKpwCLlAVjkGNvoOICJ6TjyJl6UMsJf6CUTxOGNRYPsJQ7N3+91rExvd7rN8b0KOLkmgEbWjFBpvCVLGfQkCs12Vum2jCJpQYPy2u3FEl9T4ASBRgpOxiY+yR3cpmKDoVhkBwTRWWpLEXhe1danQTmJjAD+8I4UGZPxJfonK8aMUPg9DcGu4IzBZUTiVPydPot1H3fuUfnNeF8saDk/rh8bsDSGcu28uVvigoLkKTZPECypXu7UTzsiWNovTr3ZgTKFfrlWPwnP+x8mlFAIXImdbas6IRcAteGDqDmiULgkM/fQ1o5CqqU3mEAoyqG7oAYyLQfWM2LmPwqdIkBMZoBh4zclytJUmGZIO7ZTce+HaK9jDUsHjJPqMp+35/1RYw==";

const docClient = new DynamoDBClient({ regions: "us-east-1" });
exports.getGroupMembers = async (req, res) => {
  const params = {
    TableName: aws_group_members_table_name,
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
    TableName: aws_items_table_name,
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
    TableName: aws_items_table_name,
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
    TableName: aws_items_table_name,
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
