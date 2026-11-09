import { tmpdir } from "node:os";
import { join } from "node:path";

export const TEST_KEY_DIR = join(tmpdir(), "mylocalon-platform-test-keys");
