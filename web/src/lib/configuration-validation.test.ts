import { describe, expect, it } from "vitest";
import { createDefaultInventory, type CheckoutDraft } from "./model";
import { validateConfiguration } from "./configuration-validation";

function makeValidDraft(): CheckoutDraft {
	return {
		inventory: createDefaultInventory(),
		mode: "single",
		actors: [
			{
				actorId: "A",
				customerId: "C001",
				basket: [
					{
						key: "basket-A-SKU-001",
						productId: "SKU-001",
						quantity: "2",
					},
				],
			},
		],
	};
}

function getIssues(draft: CheckoutDraft) {
	const result = validateConfiguration(draft);

	if (result.ok === true) {
		throw new Error("Expected invalid configuration.");
	}

	return result.issues;
}

describe("configuration validation", () => {
	it("accepts and normalizes valid configuration", () => {
		const result = validateConfiguration(makeValidDraft());

		expect(result.ok).toBe(true);

		if (result.ok === false) {
			throw new Error("Expected valid configuration.");
		}

		expect(result.value.inventory).toHaveLength(6);
		expect(result.value.inventory[0]).toEqual({
			productId: "SKU-001",
			available: 10,
		});
		expect(result.value.checkout.actors[0].basket).toEqual([{ productId: "SKU-001", quantity: 2 }]);
	});

	it("accepts zero available stock", () => {
		const draft = makeValidDraft();
		draft.inventory[0].available = "0";

		expect(validateConfiguration(draft).ok).toBe(true);
	});

	it("accepts requests exceeding available stock", () => {
		const draft = makeValidDraft();
		draft.inventory[0].available = "1";
		draft.actors[0].basket[0].quantity = "999";

		expect(validateConfiguration(draft).ok).toBe(true);
	});

	it("accepts concurrent requests for the same product", () => {
		const draft = makeValidDraft();
		draft.mode = "concurrent";
		draft.inventory[0].available = "1";
		draft.actors.push({
			actorId: "B",
			customerId: "C002",
			basket: [
				{
					key: "basket-B-SKU-001",
					productId: "SKU-001",
					quantity: "1",
				},
			],
		});

		expect(validateConfiguration(draft).ok).toBe(true);
	});

	it("accepts sequential execution with two actors", () => {
		const draft = makeValidDraft();
		draft.mode = "sequential";
		draft.actors.push({
			actorId: "B",
			customerId: "C002",
			basket: [
				{
					key: "basket-B-SKU-002",
					productId: "SKU-002",
					quantity: "1",
				},
			],
		});

		expect(validateConfiguration(draft).ok).toBe(true);
	});

	it.each(["", "-1", "1.5", "01", "9007199254740992"])(
		"rejects invalid stock quantity %j",
		(value) => {
			const draft = makeValidDraft();
			draft.inventory[0].available = value;

			expect(getIssues(draft)).toContainEqual(
				expect.objectContaining({
					field: "inventory.inventory-1",
				}),
			);
		},
	);

	it.each(["", "0", "-1", "1.5", "9007199254740992"])(
		"rejects invalid basket quantity %j",
		(value) => {
			const draft = makeValidDraft();
			draft.actors[0].basket[0].quantity = value;

			expect(getIssues(draft)).toContainEqual(
				expect.objectContaining({
					field: "actors.A.basket.basket-A-SKU-001.quantity",
				}),
			);
		},
	);

	it("rejects an empty basket", () => {
		const draft = makeValidDraft();
		draft.actors[0].basket = [];

		expect(getIssues(draft)).toContainEqual(
			expect.objectContaining({
				field: "actors.A.basket",
			}),
		);
	});

	it("rejects unknown products in baskets", () => {
		const draft = makeValidDraft();
		draft.actors[0].basket[0].productId = "SKU-999";

		expect(getIssues(draft)).toContainEqual(
			expect.objectContaining({
				field: "actors.A.basket.basket-A-SKU-001",
			}),
		);
	});

	it("rejects duplicate products in one basket", () => {
		const draft = makeValidDraft();
		draft.actors[0].basket.push({
			key: "basket-duplicate",
			productId: "SKU-001",
			quantity: "1",
		});

		expect(getIssues(draft)).toContainEqual(
			expect.objectContaining({
				field: "actors.A.basket.basket-duplicate",
			}),
		);
	});

	it("rejects unknown customers", () => {
		const draft = makeValidDraft();
		draft.actors[0].customerId = "C999";

		expect(getIssues(draft)).toContainEqual(
			expect.objectContaining({
				field: "actors.A.customer",
			}),
		);
	});

	it("rejects duplicate customer assignments", () => {
		const draft = makeValidDraft();
		draft.mode = "sequential";
		draft.actors.push({
			actorId: "B",
			customerId: "C001",
			basket: [
				{
					key: "basket-B-SKU-002",
					productId: "SKU-002",
					quantity: "1",
				},
			],
		});

		expect(getIssues(draft)).toContainEqual(
			expect.objectContaining({
				field: "actors.B.customer",
			}),
		);
	});

	it("rejects mismatched actor count and execution mode", () => {
		const draft = makeValidDraft();
		draft.mode = "concurrent";

		expect(getIssues(draft)).toContainEqual(expect.objectContaining({ field: "mode" }));
	});

	it("rejects duplicate inventory product IDs", () => {
		const draft = makeValidDraft();
		draft.inventory[1].productId = "SKU-001";

		expect(getIssues(draft)).toContainEqual(expect.objectContaining({ field: "inventory" }));
	});

	it("rejects empty product IDs", () => {
		const draft = makeValidDraft();
		draft.inventory[0].productId = "";

		expect(getIssues(draft)).toContainEqual(expect.objectContaining({ field: "inventory" }));
	});

	it("rejects empty inventory", () => {
		const draft = makeValidDraft();
		draft.inventory = [];

		expect(getIssues(draft)).toContainEqual(expect.objectContaining({ field: "inventory" }));
	});
});
