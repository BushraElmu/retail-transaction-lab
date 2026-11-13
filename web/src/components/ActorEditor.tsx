import { useState } from "react";
import type { ActorDraft, ActorId, CustomerProfile, InventoryDraft } from "../lib/model";

type ActorEditorProps = {
	actor: ActorDraft;
	customers: CustomerProfile[];
	inventory: InventoryDraft[];
	takenCustomerIds: string[];

	onCustomerChange: (actorId: ActorId, customerId: string) => void;
	onAddProduct: (actorId: ActorId, productId: string) => void;
	onQuantityChange: (actorId: ActorId, basketItemKey: string, value: string) => void;
	onRemoveProduct: (actorId: ActorId, basketItemKey: string) => void;
};

export default function ActorEditor({
	actor,
	customers,
	inventory,
	takenCustomerIds,
	onCustomerChange,
	onAddProduct,
	onQuantityChange,
	onRemoveProduct,
}: ActorEditorProps) {
	const [selectedProduct, setSelectedProduct] = useState("");

	const availableProducts = inventory.filter(
		(product) => !actor.basket.some((item) => item.productId === product.productId),
	);

	const selectableCustomers = customers.filter(
		(customer) => customer.id === actor.customerId || !takenCustomerIds.includes(customer.id),
	);

	function handleAddProduct() {
		if (!selectedProduct) {
			return;
		}

		onAddProduct(actor.actorId, selectedProduct);
		setSelectedProduct("");
	}

	return (
		<section className="actor-panel" aria-labelledby={`actor-${actor.actorId}-heading`}>
			<h3 id={`actor-${actor.actorId}-heading`}>Actor {actor.actorId}</h3>

			<div className="form-row">
				<label htmlFor={`customer-${actor.actorId}`}>Customer:</label>

				<select
					id={`customer-${actor.actorId}`}
					value={actor.customerId}
					onChange={(event) => onCustomerChange(actor.actorId, event.target.value)}
				>
					{selectableCustomers.map((customer) => (
						<option key={customer.id} value={customer.id}>
							{customer.firstName} {customer.lastName} ({customer.id})
						</option>
					))}
				</select>
			</div>

			<h4>Basket</h4>

			{actor.basket.length === 0 ? (
				<p>No products selected.</p>
			) : (
				<ul>
					{actor.basket.map((item) => (
						<li key={item.key}>
							<div className="form-row">
								<label htmlFor={`quantity-${item.key}`}>{item.productId}:</label>

								<input
									id={`quantity-${item.key}`}
									type="number"
									min="1"
									step="1"
									value={item.quantity}
									onChange={(event) =>
										onQuantityChange(actor.actorId, item.key, event.target.value)
									}
								/>

								<button type="button" onClick={() => onRemoveProduct(actor.actorId, item.key)}>
									Remove
								</button>
							</div>
						</li>
					))}
				</ul>
			)}

			<div className="form-row">
				<label htmlFor={`add-product-${actor.actorId}`}>Add product:</label>

				<select
					id={`add-product-${actor.actorId}`}
					value={selectedProduct}
					disabled={availableProducts.length === 0}
					onChange={(event) => setSelectedProduct(event.target.value)}
				>
					<option value="">Choose a product</option>

					{availableProducts.map((product) => (
						<option key={product.key} value={product.productId}>
							{product.productId}
						</option>
					))}
				</select>

				<button type="button" disabled={!selectedProduct} onClick={handleAddProduct}>
					Add item
				</button>
			</div>
		</section>
	);
}
