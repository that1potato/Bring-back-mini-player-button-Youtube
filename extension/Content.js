(() => {
	const BUTTON_ID = "myext-miniplayer-btn";
	const SELECTOR_CONTROLS = ".html5-video-player .ytp-right-controls";

	function buildButton() {
		const btn = document.createElement("button");
		btn.id = BUTTON_ID;
		btn.className = "ytp-button";
		btn.title = "Miniplayer";
		btn.setAttribute("aria-label", "Miniplayer");
		Object.assign(btn.style, {
			width: "36px",
			height: "36px",
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			color: "#fff", // drives currentColor
		});

		btn.innerHTML = `
            <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
                <rect x="6" y="2" width="26" height="20" rx="1" fill="none"
                    stroke="currentColor" stroke-width="3"/>
                <rect x="18" y="12" width="10" height="6" rx="1" fill="currentColor"/>
            </svg>
        `;

		btn.addEventListener("click", () => {
			// Prefer native button if present, else use the keyboard shortcut
			const native = document.querySelector(".ytp-miniplayer-button");
			if (native) native.click();
			else {
				const ev = new KeyboardEvent("keydown", {
					key: "i",
					code: "KeyI",
					keyCode: 73,
					which: 73,
					bubbles: true,
				});
				document.dispatchEvent(ev);
			}
		});
		return btn;
	}

	function injectInto(controls) {
		if (!controls || controls.querySelector("#" + BUTTON_ID)) return;
		const btn = buildButton();
		// place near size/fullscreen
		const sizeBtn = controls.querySelector(".ytp-size-button");
		if (sizeBtn && sizeBtn.nextSibling)
			controls.insertBefore(btn, sizeBtn.nextSibling);
		else controls.appendChild(btn);
	}

	function scan(root = document) {
		root.querySelectorAll(SELECTOR_CONTROLS).forEach(injectInto);
	}

	scan();

	// YouTube is an SPA; reinject on navigation and DOM rebuilds
	window.addEventListener(
		"yt-navigate-finish",
		() => setTimeout(scan, 0),
		true
	);
	new MutationObserver((muts) => {
		for (const m of muts)
			for (const n of m.addedNodes) {
				if (n.nodeType === 1) {
					if (n.matches?.(SELECTOR_CONTROLS)) injectInto(n);
					else scan(n);
				}
			}
	}).observe(document.documentElement, { childList: true, subtree: true });
})();
