<template>
  <n-config-provider :theme="darkTheme" :hljs="hljs">
    <n-dialog-provider>
      <n-message-provider>
        <div :style="{ height: '100vh', width: '100vw' }">
          <vflow />
        </div>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup>
import {
  NMessageProvider,
  darkTheme,
  NConfigProvider,
  NDialogProvider,
} from 'naive-ui';
import vflow from '@/components/vflow.vue';
import hljs from 'highlight.js/lib/core'
import python_hljs from 'highlight.js/lib/languages/python'
import javascript_hljs from 'highlight.js/lib/languages/javascript'
import json_hljs from 'highlight.js/lib/languages/json'

hljs.registerLanguage('json', json_hljs)
hljs.registerLanguage('python', python_hljs)
hljs.registerLanguage('javascript', javascript_hljs)

</script>