import type { ComponentProps } from "react";
import type { ActorDraft, ExecutionMode, InventoryDraft } from "../lib/model";
import type { ValidationIssue } from "../lib/configuration-validation";
import { CUSTOMERS } from "../lib/customers";
import ActorEditor from "./ActorEditor";
import InventoryEditor from "./InventoryEditor";
import ValidationIndicator from "./ValidationIndicator";

type ConfigureWorkspaceProps = {
	inventory: InventoryDraft[];
	actors: ActorDraft[];
	mode: ExecutionMode;
	productCount: number;
	totalAvailable: number | null;
	actorCount: number;
	basketLineCount: number;
	validationIssues: ValidationIssue[];
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
	validationIssues,
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
	const modeIssue = validationIssues.find((issue) => issue.field === "mode")?.message;

	return (
		<div className="configuration-workspace">
			<section className="configuration-execution" aria-labelledby="execution-heading">
				<div className="heading-with-issue">
					<h2 id="execution-heading">Execution Configuration</h2>
					<ValidationIndicator id="mode-issue" message={modeIssue} />
				</div>

				<div className="configuration-controls">
					<fieldset className="customer-count-control">
						<legend>Number of Customers</legend>
						<div className="customer-count-buttons">
							<button
								type="button"
								aria-pressed={actorCount === 1}
								onClick={() => {
									if (actorCount !== 1) onActorCountChange(1);
								}}
							>
								1 Customer
							</button>
							<button
								type="button"
								aria-pressed={actorCount === 2}
								onClick={() => {
									if (actorCount !== 2) onActorCountChange(2);
								}}
							>
								2 Customers
							</button>
						</div>
					</fieldset>
					{actorCount === 2 && (
						<div className="execution-method-control">
							<label htmlFor="execution-method">Execution Method</label>
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
				</div>
			</section>

			<div className="configuration-columns">
				<div className="configuration-inventory">
					<InventoryEditor
						inventory={inventory}
						productCount={productCount}
						totalAvailable={totalAvailable}
						issues={validationIssues}
						onQuantityChange={onInventoryQuantityChange}
						onReset={onResetInventory}
					/>
				</div>

				<section className="configuration-actors" aria-labelledby="actors-heading">
					<h2 id="actors-heading">Customers &amp; Baskets</h2>
					<div className="configuration-actor-list">
						{actors.map((actor) => (
							<ActorEditor
								key={actor.actorId}
								actor={actor}
								customers={CUSTOMERS}
								inventory={inventory}
								takenCustomerIds={actors
									.filter((other) => other.actorId !== actor.actorId)
									.map((other) => other.customerId)}
								issues={validationIssues}
								onCustomerChange={onCustomerChange}
								onAddProduct={onAddProduct}
								onQuantityChange={onBasketQuantityChange}
								onRemoveProduct={onRemoveProduct}
							/>
						))}
					</div>
				</section>
			</div>

			<footer className="configuration-footer">
				<p className="configuration-summary">
					<strong>Current Setup</strong>
					<span>
						{actorCount} {actorCount === 1 ? "customer" : "customers"} · {mode} · {productCount}{" "}
						products · {basketLineCount} basket lines
					</span>
				</p>
				<div className="configuration-actions">
					<button type="button" className="quiet-action" onClick={onResetDraft}>
						Reset Setup
					</button>
					<button type="button" className="primary-action" onClick={onReview}>
						Checkout
					</button>
				</div>
			</footer>
		</div>
	);
}
