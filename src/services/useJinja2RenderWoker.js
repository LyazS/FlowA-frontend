// worker.js
import nunjucks from 'nunjucks';
self.onmessage = (event) => {
    const { template, context } = event.data;

    try {
        // 使用 nunjucks 渲染模板
        const rendered = nunjucks.renderString(template, context);
        self.postMessage({ status: 'success', rendered });
    } catch (error) {
        self.postMessage({ status: 'error', message: error.message });
    }
};