const crypto = require("crypto");

const getHash = (param) => {
  return crypto.createHash("sha3-512").update(param).digest("hex")
}

const getDataFromEvent = (event) => {
  let data;

  if (!event) return data; 

  data = !event.partitionKey ? getHash(JSON.stringify(event)) : event.partitionKey;

  return data;
}

const getCandidate = (data) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate = TRIVIAL_PARTITION_KEY;

  if (!data) return candidate;

  data = typeof data !== "string" ?  JSON.stringify(data) : TRIVIAL_PARTITION_KEY
  candidate = data.length > MAX_PARTITION_KEY_LENGTH ? getHash(data) : data;

  return candidate;
}

exports.deterministicPartitionKey = (event) => {
  const data = getDataFromEvent(event);
  const candidate = getCandidate(data);
  return candidate;
};