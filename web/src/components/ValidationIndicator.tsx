type ValidationIndicatorProps = {
	id: string;
	message?: string;
};

/** Shown only after validation has been requested; hover or focus reveals the message. */
export default function ValidationIndicator({ id, message }: ValidationIndicatorProps) {
	if (!message) {
		return null;
	}

	return (
		<span
			className="validation-indicator"
			id={id}
			tabIndex={0}
			role="img"
			aria-label={`Validation issue: ${message}`}
		>
			<span aria-hidden="true">!</span>
			<span className="validation-tooltip" aria-hidden="true">
				{message}
			</span>
		</span>
	);
}
