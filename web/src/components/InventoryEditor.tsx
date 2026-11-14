import type { InventoryDraft } from "../lib/model";

type InventoryEditorProps = {
	inventory: InventoryDraft[];
	productCount: number;
	totalAvailable: number | null;
	onQuantityChange: (key: string, value: string) => void;
	onReset: () => void;
};

export default function InventoryEditor({
	inventory,
	productCount,
	totalAvailable,
	onQuantityChange,
	onReset,
}: InventoryEditorProps) {
  return (
		<section className="inventory-editor" aria-labelledby="inventory-heading">
			<header className="inventory-header">
				<h2 id="inventory-heading">Inventory</h2>

				<button type="button" className="quiet-action" onClick={onReset}>
					Reset inventory
				</button>
			</header>

			<p className="inventory-summary">
				{productCount} {productCount === 1 ? "product" : "products"} ·{" "}
				{totalAvailable === null ? "Invalid quantity" : `${totalAvailable} units available`}
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
						{inventory.map((item) => (
							<tr key={item.key}>
								<td>
									<label htmlFor={`stock-${item.key}`}>{item.productId}</label>
								</td>

								<td>
									<input
										id={`stock-${item.key}`}
										type="number"
										min="0"
										step="1"
										value={item.available}
										onChange={(event) =>
											onQuantityChange(item.key, event.target.value)
										}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
  }
