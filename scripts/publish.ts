import { execSync } from "child_process";
import consola from "consola";
import { version } from "../package.json";
import { packages } from "../meta/packages";

execSync("yarn build", { stdio: "inherit" });

let command = "npm publish --access public";

if (version.includes("beta")) command += " --tag beta";

for (const { name } of packages) {
    execSync(command, { stdio: "inherit", cwd: "./dist" });
    consola.success(`Published ${name}`);
}
