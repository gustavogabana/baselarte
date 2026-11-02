// Browser entry. The pages arrive as finished HTML; this only adds behaviour on top.
import { enhanceCodeBlocks } from "./code-blocks.ts";
import { hydrateIslands } from "./islands.ts";
import { keepPreferencesApplied } from "./preferences.ts";
import { enhanceReading } from "./reading.ts";

keepPreferencesApplied();
hydrateIslands();
enhanceCodeBlocks();
enhanceReading();

if (document.querySelector(".aws-guide")) {
  import("../notes/aws/interactions.ts").catch((loadError: unknown) => {
    console.error("The AWS note's interactive parts failed to load; the text still works.", loadError);
  });
}
