import { CodegenConfig } from "@graphql-codegen/cli";
import { schema } from "./src/schema";

const config: CodegenConfig = {
  schema: schema,
  documents: ["src/docs/**/*.gql"],
  generates: {
    "./src/gql/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  hooks: {
    afterOneFileWrite: ["npx prettier --write"],
  },
};

export default config;
