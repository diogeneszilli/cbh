const crypto = require("crypto");

const getDataFromEvent = (event) => {
  let data;

  if (event) {
    data = !event.partitionKey ? crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex")
                               : event.partitionKey;
  }
  return data;
}

const getCandidate = (data) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate = TRIVIAL_PARTITION_KEY;

  if (data) {
    data = typeof data !== "string" ?  JSON.stringify(data) : TRIVIAL_PARTITION_KEY
    candidate = data.length > MAX_PARTITION_KEY_LENGTH ? crypto.createHash("sha3-512").update(data).digest("hex") 
                                                       : data;
  }
  return candidate;
}

exports.deterministicPartitionKey = (event) => {
  const data = getDataFromEvent(event);
  const candidate = getCandidate(data);
  return candidate;
};