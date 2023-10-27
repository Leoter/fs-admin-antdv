/** 搜索类型 */
export interface Query {
    /** 搜索关联 */
    lr?: 'and' | 'or' | string;
    /** 搜索方式 */
    operate: 'EQ' | 'LIKE' | 'BTW' | 'IN' | string;
    /** 搜索字段 */
    prop: string;
    /** 搜索值 */
    value: any;
}


/** index 接口查询参数类型 */
export type IndexQuery = { exps: Query[] }[];