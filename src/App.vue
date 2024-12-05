<template>
  <n-config-provider :theme="darkTheme" :hljs="hljs">
    <n-message-provider>
      <div :style="{ height: '100vh', width: '100vw' }">
        <vflow />
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import {
  NMessageProvider,
  darkTheme,
  NConfigProvider,
} from 'naive-ui';
import vflow from '@/components/vflow.vue';
import hljs from 'highlight.js/lib/core'
import python_hljs from 'highlight.js/lib/languages/python'
import javascript_hljs from 'highlight.js/lib/languages/javascript'

hljs.registerLanguage('python', python_hljs)
hljs.registerLanguage('javascript', javascript_hljs)

</script>