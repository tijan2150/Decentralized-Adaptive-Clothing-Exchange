import { describe, it, expect, beforeEach } from "vitest"
import { Tx, Chain, type Account, types } from "./test-utils"

describe("garment-registration", () => {
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
 
  it("should not allow non-owner to update availability", () => {
    // First register a garment as user1
    const block1 = chain.mineBlock([
      Tx.contractCall(
          "garment-registration",
          "register-garment",
          [types.utf8("Test Garment"), types.utf8("Description"), types.utf8("Large"), types.utf8("None")],
          user1.address,
      ),
    ])
    
    block1.receipts[0].result.expectOk().expectUint(1)
    
    // Try to update availability as user2
    const block2 = chain.mineBlock([
      Tx.contractCall("garment-registration", "update-availability", [types.uint(1), types.bool(false)], user2.address),
    ])
    
    // Should fail with error 403 (unauthorized)
    block2.receipts[0].result.expectErr().expectUint(403)
  })
})

