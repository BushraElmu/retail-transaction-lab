import type { ActorDraft, ActorId, CustomerProfile, InventoryDraft } from "../lib/model";
import type { ValidationIssue } from "../lib/configuration-validation";
import ValidationIndicator from "./ValidationIndicator";

type ActorEditorProps = {
	actor: ActorDraft;
	customers: CustomerProfile[];
	inventory: InventoryDraft[];
	takenCustomerIds: string[];
	issues: ValidationIssue[];
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
	issues,
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
	const customerIssue = issues.find(
		(issue) => issue.field === `actors.${actor.actorId}.customer`,
	)?.message;
	const basketIssue = issues.find(
		(issue) => issue.field === `actors.${actor.actorId}.basket`,
	)?.message;

	return (
		<section className="actor-panel" aria-labelledby={`actor-${actor.actorId}-heading`}>
			<header className="actor-header">
				<h3 id={`actor-${actor.actorId}-heading`}>Actor {actor.actorId}</h3>
				<div className="actor-customer-control">
					<label htmlFor={`customer-${actor.actorId}`}>Customer</label>
					<select
						id={`customer-${actor.actorId}`}
						value={actor.customerId}
						aria-invalid={Boolean(customerIssue)}
						aria-describedby={customerIssue ? `customer-${actor.actorId}-issue` : undefined}
						onChange={(event) => onCustomerChange(actor.actorId, event.target.value)}
					>
						{selectableCustomers.map((customer) => (
							<option key={customer.id} value={customer.id}>
								{customer.firstName} {customer.lastName}
							</option>
						))}
					</select>
					<ValidationIndicator id={`customer-${actor.actorId}-issue`} message={customerIssue} />
				</div>
			</header>

			<div className="actor-basket">
				<div className="heading-with-issue">
					<p className="basket-status">
						{actor.basket.length === 0
							? "Basket empty"
							: `Basket · ${actor.basket.length} ${actor.basket.length === 1 ? "product" : "products"}`}
					</p>
					<ValidationIndicator id={`basket-${actor.actorId}-issue`} message={basketIssue} />
				</div>

				{actor.basket.length > 0 && (
					<ul className="basket-lines">
						{actor.basket.map((item) => {
							const field = `actors.${actor.actorId}.basket.${item.key}`;
							const productIssue = issues.find((issue) => issue.field === field)?.message;
							const quantityIssue = issues.find(
								(issue) => issue.field === `${field}.quantity`,
							)?.message;
							const quantityIssueId = `quantity-${item.key}-issue`;
							return (
								<li key={item.key}>
									<div className="heading-with-issue basket-product">
										<label htmlFor={`quantity-${item.key}`}>{item.productId}</label>
										<ValidationIndicator id={`product-${item.key}-issue`} message={productIssue} />
									</div>
									<ValidationIndicator id={quantityIssueId} message={quantityIssue} />
									<div className="field-with-issue">
										<input
											id={`quantity-${item.key}`}
											type="number"
											min="1"
											step="1"
											value={item.quantity}
											aria-invalid={Boolean(quantityIssue)}
											aria-describedby={quantityIssue ? quantityIssueId : undefined}
											onChange={(event) =>
												onQuantityChange(actor.actorId, item.key, event.target.value)
											}
										/>
									</div>
									<button
										type="button"
										className="quiet-action"
										onClick={() => onRemoveProduct(actor.actorId, item.key)}
									>
										Remove
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</div>

			<div className="actor-add-product">
				<label htmlFor={`add-product-${actor.actorId}`}>Add Product</label>
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
