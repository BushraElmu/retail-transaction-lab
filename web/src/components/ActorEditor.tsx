
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
	const availableProducts = inventory.filter(
		(product) => !actor.basket.some((item) => item.productId === product.productId),
	);

	const selectableCustomers = customers.filter(
		(customer) => customer.id === actor.customerId || !takenCustomerIds.includes(customer.id),
	);

	return (
		<section className="actor-panel" aria-labelledby={`actor-${actor.actorId}-heading`}>
			<header className="actor-header">
				<h3 id={`actor-${actor.actorId}-heading`}>Actor {actor.actorId}</h3>

				<div className="actor-customer-control">
					<label htmlFor={`customer-${actor.actorId}`}>Customer</label>

					<select
						id={`customer-${actor.actorId}`}
						value={actor.customerId}
						onChange={(event) => onCustomerChange(actor.actorId, event.target.value)}
					>
						{selectableCustomers.map((customer) => (
							<option key={customer.id} value={customer.id}>
								{customer.firstName} {customer.lastName}
							</option>
						))}
					</select>
				</div>
			</header>

			<div className="actor-basket">
				<p className="basket-status">
					{actor.basket.length === 0
						? "Basket empty"
						: `Basket · ${actor.basket.length} ${
								actor.basket.length === 1 ? "product" : "products"
							}`}
				</p>

				{actor.basket.length > 0 && (
					<ul className="basket-lines">
						{actor.basket.map((item) => (
							<li key={item.key}>
								<label htmlFor={`quantity-${item.key}`}>{item.productId}</label>

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

								<button
									type="button"
									className="quiet-action"
									onClick={() => onRemoveProduct(actor.actorId, item.key)}
								>
									Remove
								</button>
							</li>
						))}
					</ul>
				)}
			</div>

			<div className="actor-add-product">
				<label htmlFor={`add-product-${actor.actorId}`}>Add product</label>

				<select
					id={`add-product-${actor.actorId}`}
					value=""
					disabled={availableProducts.length === 0}
					onChange={(event) => {
						const productId = event.target.value;

						if (productId !== "") {
							onAddProduct(actor.actorId, productId);
						}
					}}
				>
					<option value="">
						{availableProducts.length === 0 ? "No products to add" : "Choose a product"}
					</option>

					{availableProducts.map((product) => (
						<option key={product.key} value={product.productId}>
							{product.productId}
						</option>
					))}
				</select>
			</div>
		</section>
	);
}
