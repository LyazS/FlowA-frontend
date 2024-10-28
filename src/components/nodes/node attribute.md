# Node Attribute
`node_key`该节点的唯一标记
`node_type`该节点使用的节点类型

# Node Data
加下划线的属性是固有属性，不建议修改。
## 必要参数
`_is_nested`是否可嵌套，可嵌套才可以添加节点

`_is_attached`是否为附属节点，附属节点只能作为其他节点的子节点，不能单独存在，也不可以有点击事件

`size`节点的尺寸，会在创建时自动应用init_width和init_height

`label`节点显示的名字。
`placeholderlabel`节点原本的名字。自动添加

`connections`节点链接端口信息

`input`输入端口

`callbackFunc`回调函数

`callbackUser`回调使用者

`output`输出端口

`payloads`节点实际负载

`results`节点运行结果

## 可选参数
`min_size`节点的最小尺寸

`nested_pad`嵌套节点的padding边距

`attached_pad`附属节点的padding边距

`attached_nodes`附属节点，需要自动设置附属节点的`_is_attached`为`true`

`attached_pos`附属节点的位置

`attached_type`附属节点的类型：`input`、`callbackFunc`、`callbackUser`、`output`


# 右键菜单
## 右击节点
非附属节点可以弹出
嵌套节点可以添加子节点
非附属节点可以删除节点
## 右击空白
添加子节点
## 右击连接
暂无

## 右键菜单项
【添加节点】可嵌套节点，或者空白处
【删除节点】非附属节点

# 节点清单

* 输入
* LLM
* 迭代
* 条件
* 批量
* 输出
* 回调
* 变量

# 节点属性框

* 输入
* 输出
* 选择框
* 代码编辑器