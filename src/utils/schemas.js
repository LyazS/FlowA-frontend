import {  cloneDeep } from 'lodash';

function deepFreeze(obj) {
    // 获取对象的属性名称
    const propNames = Object.getOwnPropertyNames(obj);

    // 递归地冻结每一个属性
    for (const name of propNames) {
        const value = obj[name];
        if (typeof value === 'object' && value !== null) {
            deepFreeze(value);
        }
    }

    // 冻结对象本身（浅冻结加递归冻结属性）
    return Object.freeze(obj);
}

export const VariableTypes = deepFreeze([
    { label: "字符串 String", value: "String" },
    { label: "整数 Integer", value: "Integer" },
    { label: "数字 Number", value: "Number" },
    { label: "布尔 Boolean", value: "Boolean" },
    { label: "字典 Dictionary", value: "Dict" },
    { label: "列表 List", value: "List" },
]);

export const FileVariableTypes = deepFreeze([
    { label: "图片 Image", value: "Image" },
    { label: "Word文档 Docx", value: "Docx" },
    { label: "PowerPoint PPT", value: "PPT" },
    { label: "文本文件 Txt", value: "Txt" },
    { label: "Excel表格 Excel", value: "Excel" },
    { label: "音频 Audio", value: "Audio" },
    { label: "压缩包 Zip", value: "Zip" },
    { label: "视频 Video", value: "Video" },
    { label: "PDF文件 PDF", value: "PDF" },
]);

export const LengthTypeSelections = deepFreeze([
    { label: "长度等于", value: "len_eq" },
    { label: "长度不等于", value: "len_ne" },
    { label: "长度大于", value: "len_gt" },
    { label: "长度大于等于", value: "len_gte" },
    { label: "长度小于", value: "len_lt" },
    { label: "长度小于等于", value: "len_lte" },
]);

export const StartEndTypeSelections = deepFreeze([
    { label: "开头是", value: "startwith" },
    { label: "结尾是", value: "endwith" },
]);

export const NullTypeSelections = deepFreeze([
    { label: "为空", value: "isnull" },
    { label: "不为空", value: "notnull" },
]);

export const EqualTypeSelections = deepFreeze([
    { label: "等于", value: "eq" },
    { label: "不等于", value: "ne" },
]);

export const NotEuqalTypeSelections = deepFreeze([
    { label: "大于", value: "gt" },
    { label: "大于等于", value: "gte" },
    { label: "小于", value: "lt" },
    { label: "小于等于", value: "lte" },
]);

export const ContainsTypeSelections = deepFreeze([
    { label: "包含", value: "contains" },
    { label: "不包含", value: "notcontains" },
]);

export const BooleanTypeSelections = deepFreeze([
    { label: "为true", value: "istrue" },
    { label: "为false", value: "isfalse" },
]);

export const typeSelections = deepFreeze([
    { label: "引用", value: "ref" },
    { label: "数值", value: "value" },
]);
export const compTypeSelections = cloneDeep(typeSelections);
export const typeSelectionsWNull = [
    ...typeSelections,
    { label: "缺省", value: "null" },
]