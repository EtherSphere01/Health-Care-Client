import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
    // Custom rules
    {
        rules: {
            // Disable error-boundaries rule for Server Components
            // JSX in try/catch is valid in Next.js server components for error handling
            "react-hooks/error-boundaries": "off",
        },
    },
]);

export default eslintConfig;
