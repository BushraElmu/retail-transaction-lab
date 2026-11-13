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
		<section aria-labelledby="inventory-heading">
			<h2 id="inventory-heading">Inventory</h2>

			<p>Products: {productCount}</p>
			<p>Total available units: {totalAvailable === null ? "Invalid quantity" : totalAvailable}</p>

			<ul>
				{inventory.map((item) => (
					<li key={item.key}>
						<label htmlFor={`stock-${item.key}`}>{item.productId}: </label>

						<input
							id={`stock-${item.key}`}
							type="number"
							min="0"
							step="1"
							value={item.available}
							onChange={(event) => onQuantityChange(item.key, event.target.value)}
						/>
					</li>
				))}
			</ul>

			<button type="button" onClick={onReset}>
				Reset
			</button>
		</section>
	);
}
