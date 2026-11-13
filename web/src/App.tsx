import { useState } from "react";
import {
	createDefaultInventory,
	createDefaultActors,
	type InventoryDraft,
	type ActorDraft,
	type ActorId,
	type ExecutionMode,
} from "./lib/model";
import "./App.css";
import { CUSTOMERS } from "./lib/customers";
import InventoryEditor from "./components/InventoryEditor";
import ActorEditor from "./components/ActorEditor";

export default function App() {
	// 1. State
	const [inventory, setInventory] = useState<InventoryDraft[]>(createDefaultInventory);

	const [actors, setActors] = useState<ActorDraft[]>(createDefaultActors);

	const [mode, setMode] = useState<ExecutionMode>("single");

	// 2. Derived Values
	const productCount = inventory.length;

	const quantitiesValid = inventory.every(
		(item) => /^(0|[1-9]\d*)$/.test(item.available) && Number.isSafeInteger(Number(item.available)),
	);

	const calculatedTotal = quantitiesValid
		? inventory.reduce((total, item) => total + Number(item.available), 0)
		: null;

	const totalAvailable =
		calculatedTotal !== null && Number.isSafeInteger(calculatedTotal) ? calculatedTotal : null;

	const basketLineCount = actors.reduce((total, actor) => total + actor.basket.length, 0);

	const actorCount = mode === "single" ? 1 : 2;

	// 3. Inventory Handlers
	function handleInventoryQuantityChange(key: string, value: string) {
		setInventory((previous) =>
			previous.map((item) => (item.key === key ? { ...item, available: value } : item)),
		);
	}

	function handleResetInventory() {
		setInventory(createDefaultInventory());
	}

	// 4. Execution mode
	function handleModeChange(nextMode: ExecutionMode) {
		setMode(nextMode);

		setActors((previous) => {
			if (nextMode === "single") {
				return previous.filter((actor) => actor.actorId === "A");
			}

			if (previous.some((actor) => actor.actorId === "B")) {
				return previous;
			}

			const firstUnusedCustomer = CUSTOMERS.find(
				(customer) => !previous.some((actor) => actor.customerId === customer.id),
			);

			if (!firstUnusedCustomer) {
				return previous;
			}

			return [
				...previous,
				{
					actorId: "B",
					customerId: firstUnusedCustomer.id,
					basket: [],
				},
			];
		});
	}

	function handleActorCountChange(count: 1 | 2) {
		handleModeChange(count === 1 ? "single" : "concurrent");
	}

	// 5. Customer Selection
	function handleCustomerChange(actorId: ActorId, customerId: string) {
		setActors((previous) => {
			const alreadyTaken = previous.some(
				(actor) => actor.actorId !== actorId && actor.customerId === customerId,
			);

			if (alreadyTaken) {
				return previous;
			}

			return previous.map((actor) =>
				actor.actorId === actorId ? { ...actor, customerId } : actor,
			);
		});
	}

	// 6. Basket handlers
	function handleAddProduct(actorId: ActorId, productId: string) {
		if (!inventory.some((item) => item.productId === productId)) {
			return;
		}

		setActors((previous) =>
			previous.map((actor) => {
				if (actor.actorId !== actorId) {
					return actor;
				}

				if (actor.basket.some((item) => item.productId === productId)) {
					return actor;
				}

				return {
					...actor,
					basket: [
						...actor.basket,
						{
							key: `basket-${actorId}-${productId}`,
							productId,
							quantity: "1",
						},
					],
				};
			}),
		);
	}

	function handleBasketQuantityChange(actorId: ActorId, basketItemKey: string, value: string) {
		setActors((previous) =>
			previous.map((actor) =>
				actor.actorId === actorId
					? {
							...actor,
							basket: actor.basket.map((item) =>
								item.key === basketItemKey ? { ...item, quantity: value } : item,
							),
						}
					: actor,
			),
		);
	}

	function handleRemoveProduct(actorId: ActorId, basketItemKey: string) {
		setActors((previous) =>
			previous.map((actor) =>
				actor.actorId === actorId
					? {
							...actor,
							basket: actor.basket.filter((item) => item.key !== basketItemKey),
						}
					: actor,
			),
		);
	}

	// 7. Reset the complete frontend draft
	function handleResetDraft() {
		setInventory(createDefaultInventory());
		setActors(createDefaultActors());
		setMode("single");
	}

	// 8. Interface
	return (
		<main className="app">
			<h1>Retail Transaction Lab</h1>

			<InventoryEditor
				inventory={inventory}
				productCount={productCount}
				totalAvailable={totalAvailable}
				onQuantityChange={handleInventoryQuantityChange}
				onReset={handleResetInventory}
			/>

			<section aria-labelledby="execution-heading">
				<h2 id="execution-heading">Execution configuration</h2>

				<fieldset>
					<legend>Number of customers</legend>

					<label>
						<input
							type="radio"
							name="actor-count"
							checked={actorCount === 1}
							onChange={() => handleActorCountChange(1)}
						/>
						1 customer
					</label>

					<label>
						<input
							type="radio"
							name="actor-count"
							checked={actorCount === 2}
							onChange={() => handleActorCountChange(2)}
						/>
						2 customers
					</label>
				</fieldset>

				{actorCount === 2 && (
					<div className="form-row">
						<label htmlFor="execution-method">Execution method:</label>

						<select
							id="execution-method"
							value={mode}
							onChange={(event) =>
								handleModeChange(event.target.value === "sequential" ? "sequential" : "concurrent")
							}
						>
							<option value="concurrent">Concurrent</option>
							<option value="sequential">Sequential</option>
						</select>
					</div>
				)}

				<p>Switching to one customer removes Actor B and their basket.</p>
			</section>

			<section aria-labelledby="actors-heading">
				<h2 id="actors-heading">Selected customers and baskets</h2>

				{actors.map((actor) => (
					<ActorEditor
						key={actor.actorId}
						actor={actor}
						customers={CUSTOMERS}
						inventory={inventory}
						takenCustomerIds={actors
							.filter((other) => other.actorId !== actor.actorId)
							.map((other) => other.customerId)}
						onCustomerChange={handleCustomerChange}
						onAddProduct={handleAddProduct}
						onQuantityChange={handleBasketQuantityChange}
						onRemoveProduct={handleRemoveProduct}
					/>
				))}
			</section>

			<section aria-labelledby="summary-heading">
				<h2 id="summary-heading">Draft summary</h2>

				<p>Execution mode: {mode}</p>
				<p>Active actors: {actorCount}</p>
				<p>Basket lines: {basketLineCount}</p>

				<p>This configuration is frontend-only. No checkout has been executed.</p>

				<button type="button" onClick={handleResetDraft}>
					Reset entire draft
				</button>
			</section>
		</main>
	);
}
