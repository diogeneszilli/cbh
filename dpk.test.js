const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the literal '0' when given event with no partitionKey within MAX_PARTITION_KEY_LENGTH", () => {
    const trivialKey = deterministicPartitionKey({ event: "abc" });
    expect(trivialKey).toBe("0");
  });

  it("Returns the literal '0' when given event with partitionKey within MAX_PARTITION_KEY_LENGTH with type == string", () => {
    const trivialKey = deterministicPartitionKey({ partitionKey: "abc" });
    expect(trivialKey).toBe("0");
  });

  it("Returns the eventPartition when given event with partitionKey within MAX_PARTITION_KEY_LENGTH and type != string", () => {
    const trivialKey = deterministicPartitionKey({ partitionKey: 123456789 });
    expect(trivialKey).toBe("123456789");
  });

  it("Returns hash when given event with partitionKey > MAX_PARTITION_KEY_LENGTH", () => {
    const event = [];
    for (i = 0; i < 100; i++) {
      event.push(i);
    }
    const trivialKey = deterministicPartitionKey({ partitionKey: event });
    expect(trivialKey).toBe("9e1c4493ae1375e6810dddef11c881ab852537214c87f99c8491351276ed4ebd85d525dcc78c53c2781bd5e66a5458e86cd538fa39b3eaa04b00dd886d33dec7");
  });
});
