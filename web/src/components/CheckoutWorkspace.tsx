import type { ActorDraft, ExecutionMode, InventoryDraft } from "../lib/model";
import { CUSTOMERS } from "../lib/customers";

type CheckoutWorkspaceProps = {
	inventory: InventoryDraft[];
	actors: ActorDraft[];
	mode: ExecutionMode;
	issueCount: number;
	onEdit: () => void;
};

const EXECUTION_LABELS: Record<ExecutionMode, string> = {
	single: "Single customer",
	sequential: "Sequential",
	concurrent: "Concurrent",
};

export default function CheckoutWorkspace({
	inventory,
	actors,
	mode,
	issueCount,
	onEdit,
}: CheckoutWorkspaceProps) {
	const basketLineCount = actors.reduce((total, actor) => total + actor.basket.length, 0);

	return (
		<section className="checkout-workspace" aria-labelledby="checkout-heading">
			<header className="workspace-heading workspace-lead">
				<h2 id="checkout-heading">Review Checkout</h2>
				<p>Review the customer and basket configuration.</p>
			</header>

			<div className="checkout-overview" aria-label="Checkout summary">
				<div>
					<span>Execution</span>
					<strong>{EXECUTION_LABELS[mode]}</strong>
				</div>
				<div>
					<span>Customers</span>
					<strong>{actors.length}</strong>
				</div>
				<div>
					<span>Basket Lines</span>
					<strong>{basketLineCount}</strong>
				</div>
			</div>

			<div className="checkout-columns">
				<section className="surface-panel" aria-labelledby="checkout-requests-heading">
					<h3 id="checkout-requests-heading">Customer Requests</h3>
					<div className="checkout-actor-list">
						{actors.map((actor) => {
							const customer = CUSTOMERS.find((profile) => profile.id === actor.customerId);
							const customerName = customer
								? `${customer.firstName} ${customer.lastName} (${customer.id})`
								: `Unknown customer (${actor.customerId})`;

							return (
								<section className="checkout-actor" key={actor.actorId}>
									<header className="checkout-actor-heading">
										<h4>Actor {actor.actorId}</h4>
										<span>{customerName}</span>
									</header>
									{actor.basket.length === 0 ? (
										<p className="muted-text">Basket empty</p>
									) : (
										<ul className="checkout-lines">
											{actor.basket.map((item) => (
												<li key={item.key}>
													<span>{item.productId}</span>
													<span>
														Requested: <strong>{item.quantity}</strong>
													</span>
												</li>
											))}
										</ul>
									)}
								</section>
							);
						})}
					</div>
				</section>

				<section className="surface-panel" aria-labelledby="checkout-inventory-heading">
					<h3 id="checkout-inventory-heading">Inventory</h3>
					<div className="table-scroll">
						<table className="data-table">
							<thead>
								<tr>
									<th scope="col">Product</th>
									<th scope="col">Available</th>
								</tr>
							</thead>
							<tbody>
								{inventory.map((item) => (
									<tr key={item.key}>
										<td>{item.productId}</td>
										<td>{item.available}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</div>

			<footer className="checkout-footer">
				<div className="checkout-notice">
					<strong className="checkout-notice">Preview only</strong>
				</div>
				<div className="checkout-actions">
					<button type="button" onClick={onEdit}>
						Edit Configuration
					</button>
					<button
						type="button"
						className="primary-action checkout-execute-button"
						aria-disabled="true"
						aria-describedby={issueCount > 0 ? "checkout-config-warning" : undefined}
					>
						{issueCount > 0 && (
							<span className="validation-indicator" aria-hidden="true">
								!
							</span>
						)}
						Confirm
					</button>
				</div>
			</footer>
		</section>
	);
}
