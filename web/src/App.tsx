import { useState } from "react";
import {
	createDefaultInventory,
	createDefaultActors,
	type InventoryDraft,
	type ActorDraft,
	type ActorId,
	type ExecutionMode,
} from "./lib/model";
import "./App.css";
import { CUSTOMERS } from "./lib/customers";
import CheckoutWorkspace from "./components/CheckoutWorkspace";
import ObservationWorkspace from "./components/ObservationWorkspace";
import ConfigurationWorkspace from "./components/ConfigurationWorkspace";
import { validateConfiguration } from "./lib/configuration-validation";

type Workspace = "configure" | "checkout" | "observe";

export default function App() {
	// 1. State
	const [inventory, setInventory] = useState<InventoryDraft[]>(createDefaultInventory);
	const [actors, setActors] = useState<ActorDraft[]>(createDefaultActors);
	const [mode, setMode] = useState<ExecutionMode>("single");
	const [workspace, setWorkspace] = useState<Workspace>("configure");
	const [showValidationHints, setShowValidationHints] = useState(false);

	// 2. Derived Values
	const productCount = inventory.length;
	const quantitiesValid = inventory.every(
		(item) => /^(0|[1-9]\d*)$/.test(item.available) && Number.isSafeInteger(Number(item.available)),
	);
	const calculatedTotal = quantitiesValid
		? inventory.reduce((total, item) => total + Number(item.available), 0)
		: null;
	const totalAvailable =
		calculatedTotal !== null && Number.isSafeInteger(calculatedTotal) ? calculatedTotal : null;
	const basketLineCount = actors.reduce((total, actor) => total + actor.basket.length, 0);
	const actorCount = mode === "single" ? 1 : 2;

	const validation = validateConfiguration({ inventory, actors, mode });
	const validationIssues = validation.ok === false ? validation.issues : [];

	// 3. Handlers
	function handleOpenCheckout() {
		setShowValidationHints(!validation.ok);
		setWorkspace("checkout");
	}

	function handleEditConfiguration() {
		setShowValidationHints(!validation.ok);
		setWorkspace("configure");
	}

	function handleInventoryQuantityChange(key: string, value: string) {
		setInventory((previous) =>
			previous.map((item) => (item.key === key ? { ...item, available: value } : item)),
		);
	}

	function handleResetInventory() {
		setInventory(createDefaultInventory());
	}

	function handleModeChange(nextMode: ExecutionMode) {
		setMode(nextMode);
		setActors((previous) => {
			if (nextMode === "single") {
				return previous.filter((actor) => actor.actorId === "A");
			}
			if (previous.some((actor) => actor.actorId === "B")) {
				return previous;
			}
			const firstUnusedCustomer = CUSTOMERS.find(
				(customer) => !previous.some((actor) => actor.customerId === customer.id),
			);
			if (!firstUnusedCustomer) {
				return previous;
			}
			return [...previous, { actorId: "B", customerId: firstUnusedCustomer.id, basket: [] }];
		});
	}

	function handleActorCountChange(count: 1 | 2) {
		handleModeChange(count === 1 ? "single" : "concurrent");
	}

	function handleCustomerChange(actorId: ActorId, customerId: string) {
		setActors((previous) => {
			const alreadyTaken = previous.some(
				(actor) => actor.actorId !== actorId && actor.customerId === customerId,
			);
			if (alreadyTaken) {
				return previous;
			}
			return previous.map((actor) =>
				actor.actorId === actorId ? { ...actor, customerId } : actor,
			);
		});
	}

	function handleAddProduct(actorId: ActorId, productId: string) {
		if (!inventory.some((item) => item.productId === productId)) {
			return;
		}
		setActors((previous) =>
			previous.map((actor) => {
				if (actor.actorId !== actorId) return actor;
				if (actor.basket.some((item) => item.productId === productId)) return actor;
				return {
					...actor,
					basket: [
						...actor.basket,
						{ key: `basket-${actorId}-${productId}`, productId, quantity: "1" },
					],
				};
			}),
		);
	}

	function handleBasketQuantityChange(actorId: ActorId, basketItemKey: string, value: string) {
		setActors((previous) =>
			previous.map((actor) =>
				actor.actorId === actorId
					? {
							...actor,
							basket: actor.basket.map((item) =>
								item.key === basketItemKey ? { ...item, quantity: value } : item,
							),
						}
					: actor,
			),
		);
	}

	function handleRemoveProduct(actorId: ActorId, basketItemKey: string) {
		setActors((previous) =>
			previous.map((actor) =>
				actor.actorId === actorId
					? { ...actor, basket: actor.basket.filter((item) => item.key !== basketItemKey) }
					: actor,
			),
		);
	}

	function handleResetDraft() {
		setInventory(createDefaultInventory());
		setActors(createDefaultActors());
		setMode("single");
		setShowValidationHints(false);
	}

	// 4. Interface
	return (
		<main className="app">
			<header className="app-header">
				<h1>Retail Transaction Lab</h1>

				<nav className="workspace-nav" aria-label="Lab workspaces">
					<button
						type="button"
						aria-pressed={workspace === "configure"}
						onClick={() => setWorkspace("configure")}
					>
						Configure
					</button>
					<button
						type="button"
						aria-pressed={workspace === "checkout"}
						onClick={handleOpenCheckout}
					>
						Checkout
					</button>
					<button
						type="button"
						aria-pressed={workspace === "observe"}
						onClick={() => setWorkspace("observe")}
					>
						Observe
					</button>
				</nav>
			</header>

			{workspace === "configure" && (
				<ConfigurationWorkspace
					inventory={inventory}
					actors={actors}
					mode={mode}
					productCount={productCount}
					totalAvailable={totalAvailable}
					actorCount={actorCount}
					basketLineCount={basketLineCount}
					validationIssues={showValidationHints ? validationIssues : []}
					onInventoryQuantityChange={handleInventoryQuantityChange}
					onResetInventory={handleResetInventory}
					onActorCountChange={handleActorCountChange}
					onModeChange={handleModeChange}
					onCustomerChange={handleCustomerChange}
					onAddProduct={handleAddProduct}
					onBasketQuantityChange={handleBasketQuantityChange}
					onRemoveProduct={handleRemoveProduct}
					onResetDraft={handleResetDraft}
					onReview={handleOpenCheckout}
				/>
			)}

			{workspace === "checkout" && (
				<CheckoutWorkspace
					inventory={inventory}
					actors={actors}
					mode={mode}
					issueCount={validationIssues.length}
					onEdit={handleEditConfiguration}
				/>
			)}

			{workspace === "observe" && <ObservationWorkspace />}
		</main>
	);
}
