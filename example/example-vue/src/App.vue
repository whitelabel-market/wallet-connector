<template>
  <div class="provider-wrapper" v-if="connector">
    <ProviderCard v-for="provider in connector.providers" :key="provider.id" :connector="connector"
                  :provider="provider"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue';
import ProviderCard from "@/components/ProviderCard.vue";
import {Connector, Providers} from "@whitelabel-solutions/wallet-connector"

const {MetaMask, WalletConnect, WalletLink} = Providers

export default defineComponent({
  name: 'App',
  components: {ProviderCard},
  setup() {
    const connector = ref<any>(null)

    onMounted(async () => {
      const options = {
        allowedChainIds: [4],
        cache: {
          enabled: true
        }
      }
      const providers = []
      providers[0] = MetaMask()
      providers[1] = WalletConnect({infuraId: "69b854375f754ababacab55f40fceca8"})
      providers[2] = WalletLink({
        appName: "APP_NAME",
        rpcUrl: "https://mainnet.infura.io/v3/69b854375f754ababacab55f40fceca8",
        chainId: 4
      })
      connector.value = await Connector.init(options, providers)
    })
    return {connector}
  }
});
</script>

<style>

#app {
  font-family: sans-serif;
}
</style>

<style scoped>
.provider-wrapper {
  padding: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  width: calc(100% - 32px);
  margin: 0 auto;
}
</style>
