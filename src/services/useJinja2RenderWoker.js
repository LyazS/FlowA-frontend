import nunjucks from 'nunjucks';
import { marked } from 'marked'; // 使用命名导入
import katex from 'katex'; // 引入 KaTeX

// 配置 Nunjucks 环境
const nunjucks_env = nunjucks.configure();

// 自定义 Markdown 渲染函数，支持 LaTeX
const renderMarkdownWithLatex = (markdown) => {
    // 用于存储捕获的 LaTeX 公式
    const latexBlocks = [];
    const inlineLatex = [];
    const displayLatex = []; // 用于存储 \[ ... \] 的行间公式

    // 捕获块级 LaTeX 公式（$$...$$）并替换为占位符
    let processedMarkdown = markdown.replace(/\$\$(.*?)\$\$/gs, (match, latex) => {
        latexBlocks.push(latex); // 存储捕获的 LaTeX
        return `@@BLOCK${latexBlocks.length - 1}@@`; // 使用占位符替换
    });

    // 捕获行间 LaTeX 公式（\[...\]）并替换为占位符
    processedMarkdown = processedMarkdown.replace(/\\\[(.*?)\\\]/gs, (match, latex) => {
        displayLatex.push(latex); // 存储捕获的 LaTeX
        return `@@DISPLAY${displayLatex.length - 1}@@`; // 使用占位符替换
    });

    // 捕获行内 LaTeX 公式（$...$）并替换为占位符
    processedMarkdown = processedMarkdown.replace(/\$(.*?)\$/g, (match, latex) => {
        inlineLatex.push(latex); // 存储捕获的 LaTeX
        return `@@INLINE${inlineLatex.length - 1}@@`; // 使用占位符替换
    });

    // 使用 marked 渲染 Markdown
    let html = marked.parse(processedMarkdown);

    // 将块级 LaTeX 占位符替换为 KaTeX 渲染结果
    html = html.replace(/@@BLOCK(\d+)@@/g, (match, index) => {
        const latex = latexBlocks[parseInt(index)];
        try {
            return katex.renderToString(latex, { displayMode: true, throwOnError: false, output: 'mathml',  });
        } catch (e) {
            return `$$${latex}$$`; // 如果渲染失败，返回原始公式
        }
    });

    // 将行间 LaTeX 占位符替换为 KaTeX 渲染结果
    html = html.replace(/@@DISPLAY(\d+)@@/g, (match, index) => {
        const latex = displayLatex[parseInt(index)];
        try {
            return katex.renderToString(latex, { displayMode: true, throwOnError: false, output: 'mathml',  });
        } catch (e) {
            return `\\[${latex}\\]`; // 如果渲染失败，返回原始公式
        }
    });

    // 将行内 LaTeX 占位符替换为 KaTeX 渲染结果
    html = html.replace(/@@INLINE(\d+)@@/g, (match, index) => {
        const latex = inlineLatex[parseInt(index)];
        try {
            return katex.renderToString(latex, { throwOnError: false, output: 'mathml',  });
        } catch (e) {
            return `$${latex}$`; // 如果渲染失败，返回原始公式
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