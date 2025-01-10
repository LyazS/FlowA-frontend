import nunjucks from 'nunjucks';
import { marked } from 'marked'; // 使用命名导入
import katex from 'katex'; // 引入 KaTeX

// 配置 Nunjucks 环境
const nunjucks_env = nunjucks.configure();

// 自定义 Markdown 渲染函数，支持 LaTeX
const renderMarkdownWithLatex = (markdown) => {
    // 使用 marked 渲染 Markdown
    let html = marked.parse(markdown);

    // 渲染行内 LaTeX 公式（$...$）
    html = html.replace(/\$(.*?)\$/g, (match, latex) => {
        try {
            return katex.renderToString(latex, { throwOnError: false });
        } catch (e) {
            return match; // 如果渲染失败，返回原始内容
        }
    });

    // 渲染块级 LaTeX 公式（$$...$$）
    html = html.replace(/\$\$(.*?)\$\$/g, (match, latex) => {
        try {
            return katex.renderToString(latex, { displayMode: true, throwOnError: false });
        } catch (e) {
            return match; // 如果渲染失败，返回原始内容
        }
    });

    return html;
};

// 添加自定义过滤器，用于渲染 Markdown 和 LaTeX
nunjucks_env.addFilter('markdown', function(str) {
    return renderMarkdownWithLatex(str);
});

self.onmessage = function (event) {
    const { tasks } = event.data; // 接收批量任务

    tasks.forEach(({ nid, template, content }) => {
        try {
            // 使用 Nunjucks 渲染模板
            const rendered = nunjucks_env.renderString(template, {
                ...content, // 传递原始内容
                marked,     // 将 marked 暴露给模板，以便在模板中直接使用
            });
            self.postMessage({ nid, success: true, rendered });
        } catch (error) {
            self.postMessage({ nid, success: false, error: error.message });
        }
    });
};