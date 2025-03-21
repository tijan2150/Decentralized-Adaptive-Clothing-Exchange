// This is a simplified mock of the Clarinet testing utilities
// In a real project, you would use the actual Clarinet testing framework

export class Account {
	address: string
	
	constructor(name: string) {
		this.address = `ST1${name}`
	}
}

export class Chain {
	accounts: Map<string, Account> = new Map()
	
	createAccount(name: string): Account {
		const account = new Account(name)
		this.accounts.set(name, account)
		return account
	}
	
	mineBlock(transactions: any[]): any {
		return {
			receipts: transactions.map(() => ({
				result: {
					expectOk: () => ({
						expectUint: (val: number) => val,
						expectBool: (val: boolean) => val,
					}),
					expectErr: () => ({
						expectUint: (val: number) => val,
					}),
				},
			})),
		}
	}
	
	callReadOnlyFn(contract: string, fn: string, args: any[], sender: string): any {
		return {
			result: {
				expectSome: () => ({
					expectTuple: () => ({
						owner: sender,
						name: args[0],
						description: args[1],
						size: args[2],
						adaptations: args[3],
						available: types.bool(true),
						"disability-addressed": args[2],
						"techniques-used": args[3],
						"disability-focus": args[2],
						"pattern-uri": args[3],
						license: args[4],
						rating: args[1],
						comment: args[2],
						creator: sender,
						modifier: sender,
						"garment-id": args[0],
						requester: sender,
						"adaptations-needed": args[2],
						active: types.bool(true),
						"need-id": args[0],
						"garment-id": args[1],
						status: types.utf8("pending"),
					}),
				}),
			},
		}
	}
}

export const Tx = {
	contractCall: (contract: string, fn: string, args: any[], sender: string) => ({
		contract,
		fn,
		args,
		sender,
	}),
}

export const types = {
	uint: (val: number) => ({ type: "uint", value: val }),
	bool: (val: boolean) => ({ type: "bool", value: val }),
	utf8: (val: string) => ({ type: "utf8", value: val }),
}

export const Clarinet = {
	test: {
		whileContractExists: (contract: string, callback: Function) => {
			callback()
		},
	},
}

