import type { ActorDraft, ExecutionMode, InventoryDraft } from "../lib/model";
import { CUSTOMERS } from "../lib/customers";

type CheckoutWorkspaceProps = {
	inventory: InventoryDraft[];
	actors: ActorDraft[];
	mode: ExecutionMode;
	onEdit: () => void;
};

export default function CheckoutWorkspace({
	inventory,
	actors,
	mode,
	onEdit,
}: CheckoutWorkspaceProps) {
	return (
		<section aria-labelledby="checkout-heading">
			<h2 id="checkout-heading">Review Checkout</h2>

			<p>Execution mode: {mode}</p>
			<p>Customers: {actors.length}</p>

			<h3>Draft Inventory</h3>

			<ul>
				{inventory.map((item) => (
					<li key={item.key}>
						{item.productId}: {item.available} available
					</li>
				))}
			</ul>

			<h3>Customer Requests</h3>

			{actors.map((actor) => {
				const customer = CUSTOMERS.find((customer) => customer.id === actor.customerId);

				if (customer === undefined) {
					throw new Error(`Unknown customer: ${actor.customerId}`);
				}

				return (
					<section key={actor.actorId}>
						<h4>
							Actor {actor.actorId}: {customer.firstName} {customer.lastName}
						</h4>

						{actor.basket.length === 0 ? (
							<p>Basket is empty.</p>
						) : (
							<ul>
								{actor.basket.map((item) => (
									<li key={item.key}>
										{item.productId}: {item.quantity} requested
									</li>
								))}
							</ul>
						)}
					</section>
				);
			})}

			<button type="button" onClick={onEdit}>
				Edit Configuration
			</button>

			<button type="button" disabled>
				Checkout
			</button>
		</section>
	);
}
