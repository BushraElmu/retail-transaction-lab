const INSPECTORS = [
	{
		title: "Event Timeline",
		description:
			"Review recorded execution stages and distinguish Actor A, Actor B, and shared events.",
	},
	{
		title: "Transaction Inspector",
		description:
			"Inspect recorded SQL statements, parameters, returned values, row counts, and errors.",
	},
	{
		title: "Database-state Inspector",
		description:
			"Compare recorded inventory, orders, and order-items observations at known points.",
	},
] as const;

export default function ObservationWorkspace() {
	return (
		<section className="observation-workspace" aria-labelledby="observe-heading">
			<header className="workspace-heading workspace-lead">
				<h2 id="observe-heading">Execution & Observability</h2>

				<p>Inspect recorded outcomes and evidence from checkout executions.</p>
			</header>

			<div className="observation-empty">
				<h3>No executions recorded</h3>

				<p>Not Implemented Yet</p>
			</div>

			<section className="observation-planned" aria-labelledby="planned-heading">
				<div className="planned-heading">
					<h3 id="planned-heading">Planned Inspection Views</h3>
				</div>

				<div className="inspector-grid">
					{INSPECTORS.map((inspector, index) => (
						<article className="inspector-card" key={inspector.title}>
							<span className="inspector-number" aria-hidden="true">
								0{index + 1}
							</span>

							<h4>{inspector.title}</h4>
							<p>{inspector.description}</p>
						</article>
					))}
				</div>
			</section>
		</section>
	);
}
