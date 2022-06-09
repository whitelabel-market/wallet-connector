<template>
  <table>
    <tr>
      <td>Id</td>
      <td>
        {{ connection.activeConnector?.id ?? 'None' }}
      </td>
    </tr>
    <tr>
      <td>Status</td>
      <td>
        <StatusIndicator
          :connected="connection.activeConnector?.connected"
          :error="!!connection.activeConnector?.error"
          :loading="connection.activeConnector?.loading"/>
      </td>
    </tr>
    <tr>
      <td>Selected Address</td>
      <td>{{ connection.activeConnector?.selectedAccount ?? 'None' }}</td>
    </tr>
    <tr>
      <td>Error</td>
      <td>{{ connection.activeConnector?.error ? connection.activeConnector.error.message : 'None' }}</td>
    </tr>
    <tr>
      <td>Chain Id</td>
      <td>{{ connection.activeConnector?.chainId ?? 'None' }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue';
import {IConnection} from "@whitelabel-solutions/wallet-connector";
import StatusIndicator from "@/components/StatusIndicator.vue";

export default defineComponent({
  name: 'ConnectionCardTable',
  components: {StatusIndicator},
  props: {
    connection: Object as PropType<IConnection>
  },
});
</script>