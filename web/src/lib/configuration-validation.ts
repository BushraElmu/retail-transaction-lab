import { CUSTOMERS } from "./customers";
import type { ActorId, CheckoutDraft, ExecutionMode } from "./model";

/** A field path identifies the control that can explain or correct the issue. */
export type ValidationIssue = {
	field: string;
	message: string;
};

export type ValidatedConfiguration = {
	inventory: { productId: string; available: number }[];
	checkout: {
		mode: ExecutionMode;
		actors: {
			actorId: ActorId;
			customerId: string;
			basket: { productId: string; quantity: number }[];
		}[];
	};
};

export type ValidationResult =
	{ ok: true; value: ValidatedConfiguration } | { ok: false; issues: ValidationIssue[] };

function parseQuantity(value: string, minimum: number): number | null {
	if (!/^(0|[1-9]\d*)$/.test(value)) {
		return null;
	}

	const quantity = Number(value);
	return Number.isSafeInteger(quantity) && quantity >= minimum ? quantity : null;
}

export function validateConfiguration(draft: CheckoutDraft): ValidationResult {
	const issues: ValidationIssue[] = [];
	const inventory: ValidatedConfiguration["inventory"] = [];
	const productIds = new Set<string>();

	if (draft.inventory.length === 0) {
		issues.push({ field: "inventory", message: "Inventory cannot be empty." });
	}

	for (const item of draft.inventory) {
		if (!item.productId.trim()) {
			issues.push({ field: "inventory", message: "A product ID cannot be empty." });
		}
		if (productIds.has(item.productId)) {
			issues.push({ field: "inventory", message: `Duplicate product ID: ${item.productId}.` });
		}
		productIds.add(item.productId);

		const available = parseQuantity(item.available, 0);
		if (available === null) {
			issues.push({
				field: `inventory.${item.key}`,
				message: `${item.productId}: stock must be a non-negative whole number.`,
			});
		} else {
			inventory.push({ productId: item.productId, available });
		}
	}

	const correctActors =
		draft.mode === "single"
			? draft.actors.length === 1 && draft.actors[0]?.actorId === "A"
			: draft.actors.length === 2 &&
				draft.actors.some((actor) => actor.actorId === "A") &&
				draft.actors.some((actor) => actor.actorId === "B");

	if (!correctActors) {
		issues.push({ field: "mode", message: "Active actors do not match the execution mode." });
	}

	const customerIds = new Set(CUSTOMERS.map((customer) => customer.id));
	const assignedCustomers = new Set<string>();
	const actors: ValidatedConfiguration["checkout"]["actors"] = [];

	for (const actor of draft.actors) {
		if (!customerIds.has(actor.customerId)) {
			issues.push({
				field: `actors.${actor.actorId}.customer`,
				message: `Actor ${actor.actorId} has an unknown customer.`,
			});
		}
		if (assignedCustomers.has(actor.customerId)) {
			issues.push({
				field: `actors.${actor.actorId}.customer`,
				message: `Customer ${actor.customerId} is assigned more than once.`,
			});
		}
		assignedCustomers.add(actor.customerId);

		if (actor.basket.length === 0) {
			issues.push({
				field: `actors.${actor.actorId}.basket`,
				message: `Actor ${actor.actorId} needs at least one basket item.`,
			});
		}

		const basketProducts = new Set<string>();
		const basket: ValidatedConfiguration["checkout"]["actors"][number]["basket"] = [];

		for (const item of actor.basket) {
			if (!productIds.has(item.productId)) {
				issues.push({
					field: `actors.${actor.actorId}.basket.${item.key}`,
					message: `Unknown product ${item.productId} in Actor ${actor.actorId}'s basket.`,
				});
			}
			if (basketProducts.has(item.productId)) {
				issues.push({
					field: `actors.${actor.actorId}.basket.${item.key}`,
					message: `Actor ${actor.actorId} has duplicate product ${item.productId}.`,
				});
			}
			basketProducts.add(item.productId);

			const quantity = parseQuantity(item.quantity, 1);
			if (quantity === null) {
				issues.push({
					field: `actors.${actor.actorId}.basket.${item.key}.quantity`,
					message: `${item.productId}: quantity must be a positive whole number.`,
				});
			} else {
				basket.push({ productId: item.productId, quantity });
			}
		}

		actors.push({ actorId: actor.actorId, customerId: actor.customerId, basket });
	}

	if (issues.length > 0) {
		return { ok: false, issues };
	}

	return { ok: true, value: { inventory, checkout: { mode: draft.mode, actors } } };
}
