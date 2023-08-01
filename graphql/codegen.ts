import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://countries.trevorblades.com/',
  documents: ['graphql/resolvers/**/*.ts'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    'graphql/generated/graphql.ts': {
      config: {
        withComposition: true,
      },
      plugins: [
        'typescript',
        'typescript-operations',
        //'typescript-urql',
        'typescript-vue-urql',
      ],
    },
    'graphql/generated/graphql.schema.ts': {
      plugins: [
        'urql-introspection',
      ],
    },
  },
};

export default config;
