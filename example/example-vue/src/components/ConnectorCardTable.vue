<template>
  <table>
    <tr>
      <td>Id</td>
      <td>{{ connector?.id }}</td>
    </tr>
    <tr>
      <td>Status</td>
      <td>
        <StatusIndicator
          :connected="connector?.connected"
          :error="!!connector?.error"
          :loading="connector?.loading"/>
      </td>
    </tr>
    <tr>
      <td>Selected Account</td>
      <td>{{ connector?.selectedAccount ?? 'None' }}</td>
    </tr>
    <tr>
      <td>Error</td>
      <td>{{ connector.error ? connector.error.message : 'None' }}</td>
    </tr>
    <tr>
      <td>Chain Id</td>
      <td>{{ connector?.chainId ?? 'None' }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {IConnectorWrapper} from "@whitelabel-solutions/wallet-connector";
import StatusIndicator from "@/components/StatusIndicator.vue";

export default defineComponent({
  name: 'ConnectorCardTable',
  components: {StatusIndicator},
  props: {
    connector: Object as PropType<IConnectorWrapper>,
  },
  setup() {
  }
});
</script>