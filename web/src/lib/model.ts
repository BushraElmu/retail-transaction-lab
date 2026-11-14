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

export type CheckoutDraft = {
	inventory: InventoryDraft[];
	actors: ActorDraft[];
	mode: ExecutionMode;
};

export function createDefaultInventory(): InventoryDraft[] {
	return [
		{ key: "inventory-1", productId: "SKU-001", available: "10" },
		{ key: "inventory-2", productId: "SKU-002", available: "3" },
		{ key: "inventory-3", productId: "SKU-003", available: "1" },
		{ key: "inventory-4", productId: "SKU-004", available: "0" },
		{ key: "inventory-5", productId: "SKU-005", available: "20" },
		{ key: "inventory-6", productId: "SKU-006", available: "5" },
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
