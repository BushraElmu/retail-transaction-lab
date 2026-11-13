export type ActorId = "A" | "B";

export type ExecutionMode = "single" | "sequential" | "concurrent";

export type InventoryDraft = {
	key: string;
	productId: string;
	available: string;
};

export type BasketItemDraft = {
	key: string;
	productId: string;
	quantity: string;
};

export type ActorDraft = {
	actorId: ActorId;
	customerId: string;
	basket: BasketItemDraft[];
};

export type CustomerProfile = {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
};

export function createDefaultInventory(): InventoryDraft[] {
	return [
		{
			key: "inventory-1",
			productId: "SKU-001",
			available: "10",
		},
		{
			key: "inventory-2",
			productId: "SKU-002",
			available: "3",
		},
	];
}

export function createDefaultActors(): ActorDraft[] {
	return [
		{
			actorId: "A",
			customerId: "C001",
			basket: [],
		},
	];
}
