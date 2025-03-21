import { describe, it, expect, beforeEach } from "vitest"
import { Tx, Chain, type Account, types } from "./test-utils"

describe("design-sharing", () => {
  let chain: Chain
  let deployer: Account
  let user1: Account
  let user2: Account
  
  beforeEach(() => {
    chain = new Chain()
    deployer = chain.createAccount("deployer")
    user1 = chain.createAccount("user1")
    user2 = chain.createAccount("user2")
  })
  
  it("should not allow creator to rate their own design", () => {
    // First share a design as user1
    const block1 = chain.mineBlock([
      Tx.contractCall(
          "design-sharing",
          "share-design",
          [
            types.utf8("Adaptive Gloves"),
            types.utf8("Gloves with special grip"),
            types.utf8("Limited hand strength"),
            types.utf8("ipfs://AbCdEf456..."),
            types.utf8("MIT License"),
          ],
          user1.address,
      ),
    ])
    
    // Try to rate own design as user1
    const block2 = chain.mineBlock([
      Tx.contractCall(
          "design-sharing",
          "rate-design",
          [
            types.uint(1), // design-id
            types.uint(5), // rating
            types.utf8("My own design is great!"),
          ],
          user1.address,
      ),
    ])
    
    // Should fail with error 403 (unauthorized)
    block2.receipts[0].result.expectErr().expectUint(403)
  })
  
  it("should reject invalid ratings", () => {
    // First share a design as user1
    const block1 = chain.mineBlock([
      Tx.contractCall(
          "design-sharing",
          "share-design",
          [
            types.utf8("Adaptive Gloves"),
            types.utf8("Gloves with special grip"),
            types.utf8("Limited hand strength"),
            types.utf8("ipfs://AbCdEf456..."),
            types.utf8("MIT License"),
          ],
          user1.address,
      ),
    ])
    
    // Try to submit an invalid rating (6 stars) as user2
    const block2 = chain.mineBlock([
      Tx.contractCall(
          "design-sharing",
          "rate-design",
          [
            types.uint(1), // design-id
            types.uint(6), // invalid rating (> 5)
            types.utf8("These gloves are amazing!"),
          ],
          user2.address,
      ),
    ])
    
    // Should fail with error 400 (bad request)
    block2.receipts[0].result.expectErr().expectUint(400)
  })
})

