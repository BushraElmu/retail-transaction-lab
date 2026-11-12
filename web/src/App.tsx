import { useState } from "react";
import { createDefaultInventory, type InventoryDraft } from "./lib/model";
import "./App.css";

export default function App() {
	const [inventory] = useState<InventoryDraft[]>(createDefaultInventory);

	return (
		<main className="app">
			<h1>retail-transaction-lab</h1>

			<h2>Inventory</h2>

			{inventory.map((item) => (
				<p key={item.key}>
					{item.productId}: {item.available} available
				</p>
			))}
		</main>
	);
}
