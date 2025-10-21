// Message model builder for WhatsApp Cloud API (official)
// Interactive buttons message per https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#interactive-object
// Example usage:
//  buildInteractiveButtonMessage({
//    to: "<recipient_phone_e164>",
//    bodyText: "Hello! Choose an option:",
//    footerText: "Powered by Vannia",
//    buttons: [
//      { id: "opt_yes", title: "Yes" },
//      { id: "opt_no", title: "No" },
//    ]
//  })

export function buildInteractiveButtonMessage(
		{
			to,
			bodyText,
			footerText,
			buttons
		}
) {
	if (!to) throw new Error("'to' (E.164 phone) is required");
	if (!bodyText) throw new Error("'bodyText' is required");
	if (!Array.isArray(buttons) || buttons.length === 0) {
		throw new Error("'buttons' must be a non-empty array");
	}

	const normalizedButtons = buttons.slice(0, 3).map((b, idx) => {
		if (!b || !b.id || !b.title) throw new Error(`Invalid button at index ${idx}`);
		const title = String(b.title).slice(0, 20); // WhatsApp UI limits title length
		const id = String(b.id).slice(0, 256); // payload id limit
		return {type: "reply", reply: {id, title}};
	});

	const payload = {
		messaging_product: "whatsapp",
		recipient_type: "individual",
		to,
		type: "interactive",
		interactive: {
			type: "button",
			body: {text: bodyText},
			...(footerText ? {footer: {text: footerText}} : {}),
			action: {buttons: normalizedButtons},
		},
	};

	return payload;
}

// Optionally extend with quick replies or list messages as needed in the future.
