import nunjucks from 'nunjucks';

self.onmessage = function (event) {
    const { tasks } = event.data; // 接收批量任务

    tasks.forEach(({ nid, template, content }) => {
        try {
            // 使用 Nunjucks 渲染模板
            const rendered = nunjucks.renderString(template, content);
            self.postMessage({ nid, success: true, rendered });
        } catch (error) {
            self.postMessage({ nid, success: false, error: error.message });
        }
    });
};