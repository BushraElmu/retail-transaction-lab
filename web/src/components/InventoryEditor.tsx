import type { InventoryDraft } from "../lib/model";
import type { ValidationIssue } from "../lib/configuration-validation";
import ValidationIndicator from "./ValidationIndicator";

type InventoryEditorProps = {
	inventory: InventoryDraft[];
	productCount: number;
	totalAvailable: number | null;
	issues: ValidationIssue[];
	onQuantityChange: (key: string, value: string) => void;
	onReset: () => void;
};

export default function InventoryEditor({
	inventory,
	productCount,
	totalAvailable,
	issues,
	onQuantityChange,
	onReset,
}: InventoryEditorProps) {
	const catalogueIssue = issues.find((issue) => issue.field === "inventory")?.message;

	return (
		<section className="inventory-editor" aria-labelledby="inventory-heading">
			<header className="inventory-header">
				<div className="heading-with-issue">
					<h2 id="inventory-heading">Inventory</h2>
					<ValidationIndicator id="inventory-issue" message={catalogueIssue} />
				</div>
				<button type="button" className="quiet-action" onClick={onReset}>
					Reset Inventory
				</button>
			</header>

			<p className="inventory-summary">
				{productCount} {productCount === 1 ? "product" : "products"} ·{" "}
				{totalAvailable === null ? "Invalid stock quantity" : `${totalAvailable} units available`}
			</p>

			<div className="table-scroll">
				<table className="inventory-table">
					<thead>
						<tr>
							<th scope="col">Product ID</th>
							<th scope="col">Available</th>
						</tr>
					</thead>
					<tbody>
						{inventory.map((item) => {
							const issueId = `stock-${item.key}-issue`;
							const message = issues.find(
								(issue) => issue.field === `inventory.${item.key}`,
							)?.message;
							return (
								<tr key={item.key}>
									<td>
										<label htmlFor={`stock-${item.key}`}>{item.productId}</label>
									</td>
									<td>
										<div className="field-with-issue field-align-end">
											<ValidationIndicator id={issueId} message={message} />

											<input
												id={`stock-${item.key}`}
												type="number"
												min="0"
												step="1"
												value={item.available}
												aria-invalid={Boolean(message)}
												aria-describedby={message ? issueId : undefined}
												onChange={(event) => onQuantityChange(item.key, event.target.value)}
											/>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</section>
	);
}
