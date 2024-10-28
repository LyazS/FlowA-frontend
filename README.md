# cyberflow

## 设计思路

前端通过connections.input来获取输入，然后展示输入内容
节点其他设置用payloads来承担，并根据payloads来展示设置

后端通过connections来构建图，并根据输入输出来运行这个图