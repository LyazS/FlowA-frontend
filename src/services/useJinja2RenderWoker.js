import nunjucks from 'nunjucks';

self.onmessage = function (event) {
    const { nid, template, content } = event.data;

    try {
        // 使用 Nunjucks 渲染模板
        const rendered = nunjucks.renderString(template, content);
        self.postMessage({ nid, success: true, rendered });
    } catch (error) {
        self.postMessage({ nid, success: false, error: error.message });
    }
};