// Point Git at the versioned hooks in .githooks. Runs from the prepare script.
// Deploy builds without a Git checkout skip this silently.
import { execFileSync } from "node:child_process";

try {
	execFileSync("git", ["rev-parse", "--is-inside-work-tree"], {
		stdio: "ignore",
	});
	execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
		stdio: "ignore",
	});
} catch {
	// Not a Git checkout or Git is unavailable; nothing to set up.
}
