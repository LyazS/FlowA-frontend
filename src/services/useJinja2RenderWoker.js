import nunjucks from 'nunjucks';
import { marked } from 'marked'; // 使用命名导入
import katex from 'katex'; // 引入 KaTeX

// 配置 Nunjucks 环境
const nunjucks_env = nunjucks.configure();

const renderMarkdownWithLatex = (markdown) => {
    // 用于存储捕获的 LaTeX 公式
    const latexBlocks = [];
    const inlineLatex = [];
    const displayLatex = []; // 用于存储 \[ ... \] 的行间公式
    const inlineParenLatex = []; // 用于存储 \( ... \) 的行内公式

    // 捕获 ```latex ... ``` 代码块并处理其中的 LaTeX 公式
    let processedMarkdown = markdown.replace(/```latex\s*([\s\S]*?)\s*```/g, (match, latex) => {
        // 检查代码块中是否包含其他类型的 LaTeX 公式
        const containsOtherLatex = /(\$\$.*?\$\$|\\\[.*?\\\]|\$.*?\$|\\\(.*?\\\)|\\begin\{.*?\}.*?\\end\{.*?\})/gs.test(latex);

        if (containsOtherLatex) {
            // 如果包含其他类型的 LaTeX 公式，则按原逻辑处理
            let processedLatex = latex.replace(/\$\$(.*?)\$\$/gs, (match, innerLatex) => {
                latexBlocks.push(innerLatex); // 存储捕获的 LaTeX
                return `@@BLOCK${latexBlocks.length - 1}@@`; // 使用占位符替换
            });

            processedLatex = processedLatex.replace(/\\\[(.*?)\\\]/gs, (match, innerLatex) => {
                displayLatex.push(innerLatex); // 存储捕获的 LaTeX
                return `@@DISPLAY${displayLatex.length - 1}@@`; // 使用占位符替换
            });

            processedLatex = processedLatex.replace(/\$(.*?)\$/g, (match, innerLatex) => {
                inlineLatex.push(innerLatex); // 存储捕获的 LaTeX
                return `@@INLINE${inlineLatex.length - 1}@@`; // 使用占位符替换
            });

            processedLatex = processedLatex.replace(/\\\((.*?)\\\)/g, (match, innerLatex) => {
                inlineParenLatex.push(innerLatex); // 存储捕获的 LaTeX
                return `@@INLINEPAREN${inlineParenLatex.length - 1}@@`; // 使用占位符替换
            });

            processedLatex = processedLatex.replace(/\\begin{(\w+\*?)}(.*?)\\end{\1}/gs, (match, env, innerLatex) => {
                latexBlocks.push(`\\begin{${env}}${innerLatex}\\end{${env}}`); // 存储整个 LaTeX 块
                return `@@BLOCK${latexBlocks.length - 1}@@`; // 使用占位符替换
            });

            return processedLatex; // 返回处理后的 LaTeX 代码块
        } else {
            // 如果不包含其他类型的 LaTeX 公式，则根据是否包含换行符决定块级或行内
            const containsNewline = /\n/.test(latex);

            if (containsNewline) {
                // 如果包含换行符，视为块级 LaTeX 公式
                latexBlocks.push(latex.trim()); // 存储捕获的 LaTeX
                return `@@BLOCK${latexBlocks.length - 1}@@`; // 使用占位符替换
            } else {
                // 如果不包含换行符，视为行内 LaTeX 公式
                inlineLatex.push(latex.trim()); // 存储捕获的 LaTeX
                return `@@INLINE${inlineLatex.length - 1}@@`; // 使用占位符替换
            }
        }
    });

    // 捕获块级 LaTeX 公式（$$...$$）并替换为占位符
    processedMarkdown = processedMarkdown.replace(/\$\$(.*?)\$\$/gs, (match, latex) => {
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

    // 捕获行内 LaTeX 公式（\(...\)）并替换为占位符
    processedMarkdown = processedMarkdown.replace(/\\\((.*?)\\\)/g, (match, latex) => {
        inlineParenLatex.push(latex); // 存储捕获的 LaTeX
        return `@@INLINEPAREN${inlineParenLatex.length - 1}@@`; // 使用占位符替换
    });

    // 捕获所有 \begin{...}...\end{...} 环境并替换为占位符
    processedMarkdown = processedMarkdown.replace(/\\begin{(\w+\*?)}(.*?)\\end{\1}/gs, (match, env, latex) => {
        latexBlocks.push(`\\begin{${env}}${latex}\\end{${env}}`); // 存储整个 LaTeX 块
        return `@@BLOCK${latexBlocks.length - 1}@@`; // 使用占位符替换
    });

    // 使用 marked 渲染 Markdown
    let html = marked.parse(processedMarkdown);

    // 将块级 LaTeX 占位符替换为 KaTeX 渲染结果
    html = html.replace(/@@BLOCK(\d+)@@/g, (match, index) => {
        const latex = latexBlocks[parseInt(index)];
        try {
            return katex.renderToString(latex, { displayMode: true, throwOnError: false, output: 'mathml' });
        } catch (e) {
            return `$$${latex}$$`; // 如果渲染失败，返回原始公式
        }
    });

    // 将行间 LaTeX 占位符替换为 KaTeX 渲染结果
    html = html.replace(/@@DISPLAY(\d+)@@/g, (match, index) => {
        const latex = displayLatex[parseInt(index)];
        try {
            return katex.renderToString(latex, { displayMode: true, throwOnError: false, output: 'mathml' });
        } catch (e) {
            return `\\[${latex}\\]`; // 如果渲染失败，返回原始公式
        }
    });

    // 将行内 LaTeX 占位符替换为 KaTeX 渲染结果
    html = html.replace(/@@INLINE(\d+)@@/g, (match, index) => {
        const latex = inlineLatex[parseInt(index)];
        try {
            return katex.renderToString(latex, { throwOnError: false, output: 'mathml' });
        } catch (e) {
            return `$${latex}$`; // 如果渲染失败，返回原始公式
        }
    });

    // 将行内 LaTeX 占位符（\(...\)）替换为 KaTeX 渲染结果
    html = html.replace(/@@INLINEPAREN(\d+)@@/g, (match, index) => {
        const latex = inlineParenLatex[parseInt(index)];
        try {
            return katex.renderToString(latex, { throwOnError: false, output: 'mathml' });
        } catch (e) {
            return `\\(${latex}\\)`; // 如果渲染失败，返回原始公式
        }
    });

    return html;
};

// 添加自定义过滤器，用于渲染 Markdown 和 LaTeX
nunjucks_env.addFilter('markdown', function (str) {
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