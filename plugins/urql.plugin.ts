import { createClient, ssrExchange, dedupExchange, fetchExchange, Client } from '@urql/core';
import { CacheExchangeOpts, cacheExchange as graphCacheExchange } from '@urql/exchange-graphcache'
import { defineNuxtPlugin } from '#app'
import schema from '../graphql/generated/graphql.schema';
import { ref } from "vue";
import { SSRData } from '@urql/vue';

const ssrKey = '__URQL_DATA__'

export default defineNuxtPlugin(nuxt => {
  const { vueApp } = nuxt

  const ssr = ssrExchange({
    isClient: process.client
  })

  // when app is created in browser, restore SSR state from nuxt payload
  if (process.client) {
    nuxt.hook('app:created', () => {
      ssr.restoreData(nuxt.payload[ssrKey] as SSRData)
    })
  }

  // when app has rendered in server, send SSR state to client
  if (process.server) {
    nuxt.hook('app:rendered', () => {
      nuxt.payload[ssrKey] = ssr.extractData()
    })
  }

  // use urql graphcache
  const cacheConfig: CacheExchangeOpts = {
    schema,
    keys: {
      Country: (data) => (data as any).code,
    },
    resolvers: { Query: {}}
    // storage: process.client ? makeDefaultStorage() : undefined
  }
  const cache = graphCacheExchange(cacheConfig)

  const client = createClient({
    url: 'https://countries.trevorblades.com/',
    exchanges: [
      dedupExchange,
      cache,
      ssr, // Add `ssr` in front of the `fetchExchange`
      fetchExchange,
    ]
  })

  nuxt.provide('urql', client)
  vueApp.provide('$urql', ref(client))

})

declare module '#app' {
  interface NuxtApp {
    $urql: Client
  }
}
