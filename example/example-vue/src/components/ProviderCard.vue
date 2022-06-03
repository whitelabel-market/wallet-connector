<template>
  <div class="provider-item">
    <div class="provider-item-header">
      <!--      <div class="provider-item-logo" v-html="provider.logo"></div>-->
      <h2>{{ provider.name }}</h2>
    </div>

    <div class="provider-item-body">
      <ProviderCardTable :provider="provider"/>
      <button @click="provider.status === 'connected' ? provider.disconnect() : provider.connect()" v-if="!highlight">
        {{ provider.status === 'connected' ? 'Disconnect' : 'Connect' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ProviderCardTable from "@/components/ProviderCardTable.vue";

export default defineComponent({
  name: 'ProviderCard',
  components: {ProviderCardTable},
  props: {
    provider: Object,
    connector: Object,
    highlight: Boolean
  },
  setup() {
    const connect = async (provider: any) => {
      try {
        const currentProvider = await provider.connect()
        console.info("Success connecting to provider", currentProvider)
      } catch (err: any) {
        console.error("Error connecting to provider", err)
      }
    }

    return {connect}
  }
});
</script>

<style scoped>
.provider-item {
  width: 100%;
  max-width: 364px;
  padding: 16px;
  border: 2px dashed #f3f3f3;
  border-radius: 4px;
  margin: 16px;
}

.provider-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.provider-item-body {
  margin-top: 16px;
}

.provider-item-logo {
  display: block;
  width: 1em;
  height: 1em;
  overflow: hidden;
}

h2 {
  display: block;
  font-size: 18px;
  margin: 0;
}

button {
  display: block;
  padding: 10px;
  margin-top: 16px;
  width: 100%;
  border: none;
  border-radius: 4px;
  background-color: #f3f3f3;
  cursor: pointer;
}
</style>
