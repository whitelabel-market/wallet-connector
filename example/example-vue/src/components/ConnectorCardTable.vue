<template>
  <table>
    <tr>
      <td>Id</td>
      <td>{{ connector?.id }}</td>
    </tr>
    <tr>
      <td>Status</td>
      <td>
        <div class="status-wrapper">
          <span class="status" :style="{backgroundColor: wrapperColor[connector.status]}"></span>
          <span>{{ connector.status }}</span>
        </div>
      </td>
    </tr>
    <tr>
      <td>Selected Address</td>
      <td>{{ connector?.selectedAccount ?? 'None' }}</td>
    </tr>
    <tr>
      <td>Error</td>
      <td>{{ connector.status === 'error' ? connector.error.message : 'None' }}</td>
    </tr>
    <tr>
      <td>Chain Id</td>
      <td>{{ connector?.chainId ?? 'None' }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';

export default defineComponent({
  name: 'ConnectorCardTable',
  props: {
    connector: Object,
  },
  setup() {
    const wrapperColor = {
      disconnected: "#e5e5e5",
      loading: "#f0ad4e",
      connected: "#5cb85c",
      error: "#d9534f",
    }
    return {wrapperColor}
  }
});
</script>

<style scoped>
table {
  font-size: 14px;
  line-height: 1.2em;
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}

td, th {
  border: 2px solid #f3f3f3;
  text-align: left;
  padding: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

td:first-child {
  font-weight: bold;
  width: 50%;
}

td:last-child {
  width: 50%;
}

.status-wrapper {
  display: flex;
  align-items: center;
  text-transform: capitalize;
}

.status {
  display: block;
  border-radius: 100%;
  width: 8px;
  height: 8px;
  margin-right: 4px;
}
</style>
