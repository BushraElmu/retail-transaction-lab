import type { ComponentProps } from "react";
import type { ActorDraft, ExecutionMode, InventoryDraft } from "../lib/model";
import { CUSTOMERS } from "../lib/customers";
import ActorEditor from "./ActorEditor";
import InventoryEditor from "./InventoryEditor";

type ConfigureWorkspaceProps = {
	inventory: InventoryDraft[];
	actors: ActorDraft[];
	mode: ExecutionMode;

	productCount: number;
	totalAvailable: number | null;
	actorCount: number;
	basketLineCount: number;

	onInventoryQuantityChange: ComponentProps<typeof InventoryEditor>["onQuantityChange"];
	onResetInventory: ComponentProps<typeof InventoryEditor>["onReset"];

	onActorCountChange: (count: 1 | 2) => void;
	onModeChange: (mode: ExecutionMode) => void;

	onCustomerChange: ComponentProps<typeof ActorEditor>["onCustomerChange"];
	onAddProduct: ComponentProps<typeof ActorEditor>["onAddProduct"];
	onBasketQuantityChange: ComponentProps<typeof ActorEditor>["onQuantityChange"];
	onRemoveProduct: ComponentProps<typeof ActorEditor>["onRemoveProduct"];

	onResetDraft: () => void;
	onReview: () => void;
};

export default function ConfigurationWorkspace({
	inventory,
	actors,
	mode,
	productCount,
	totalAvailable,
	actorCount,
	basketLineCount,
	onInventoryQuantityChange,
	onResetInventory,
	onActorCountChange,
	onModeChange,
	onCustomerChange,
	onAddProduct,
	onBasketQuantityChange,
	onRemoveProduct,
	onResetDraft,
	onReview,
}: ConfigureWorkspaceProps) {
	return (
		<>
			<InventoryEditor
				inventory={inventory}
				productCount={productCount}
				totalAvailable={totalAvailable}
				onQuantityChange={onInventoryQuantityChange}
				onReset={onResetInventory}
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
							onChange={() => onActorCountChange(1)}
						/>
						1 customer
					</label>

					<label>
						<input
							type="radio"
							name="actor-count"
							checked={actorCount === 2}
							onChange={() => onActorCountChange(2)}
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
								onModeChange(event.target.value === "sequential" ? "sequential" : "concurrent")
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
						onCustomerChange={onCustomerChange}
						onAddProduct={onAddProduct}
						onQuantityChange={onBasketQuantityChange}
						onRemoveProduct={onRemoveProduct}
					/>
				))}
			</section>

			<section aria-labelledby="summary-heading">
				<h2 id="summary-heading">Draft summary</h2>

				<p>Execution mode: {mode}</p>
				<p>Active actors: {actorCount}</p>
				<p>Basket lines: {basketLineCount}</p>

				<p>This configuration is frontend-only. No checkout has been executed.</p>

				<button type="button" onClick={onResetDraft}>
					Reset entire draft
				</button>
			</section>

			<button type="button" onClick={onReview}>
				Review Checkout
			</button>
		</>
	);
}
