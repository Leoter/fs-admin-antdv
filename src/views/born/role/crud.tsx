import * as api from "./api";
import { AddReq, CreateCrudOptionsProps, CreateCrudOptionsRet, DelReq, EditReq, UserPageQuery, UserPageRes, dict } from "@fast-crud/fast-crud";
import { ref } from "vue";
import { encryptPass } from "/@/utils/util.pass";
import { message } from "ant-design-vue";

export default function ({ crudExpose, context: { openDialog, authz } }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }: EditReq) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }: DelReq) => {
    return await api.DelObj(row.id);
  };

  const addRequest = async ({ form }: AddReq) => {
    return await api.AddObj(form);
  };
  const selectedRowKeys = ref([]);

  const onSelectChange = (changed: any) => {
    console.log("selection", changed);
    selectedRowKeys.value = changed;
  };

  return {
    selectedRowKeys, //返回给index.vue去使用
    crudOptions: {
      toolbar: {
        compact: false
      },
      search: {
        debounce: false
      },
      request: {
        // pageRequest请求参数转换
        transformQuery: ({ page, form, sort }) => {
          let queryIndex = [];

          let query = []
          for (var x in form) {
            if (form[x] != null && form[x] != undefined) {
              let queryItem = { prop: x, value: form[x], lr: 'and', operate: 'LIKE' };
              query.push(queryItem)
            }
          }
          let queryIndexItem = { exps: query }
          if (query.length > 0) {
            queryIndex.push(queryIndexItem);
          }

          // const sorts = sort == null ? undefined : [{ orderProp: sort.prop, orderAsc: sort.asc }]
          let sorts = [];

          if (sort != null && sort.prop != undefined && sort.order != undefined) {
            let sortItem = {
              orderField: sort.prop,
              orderType: sort.asc ? "ASC" : "DESC"
            };
            sorts.push(sortItem);
          }
          //改造成你的后端所能接受的参数结构
          return { page: page.currentPage - 1, size: page.pageSize, ...form, sorts, query: queryIndex };
        },
        // pageRequest请求结果转换
        transformRes: ({ res }) => {
          //将后端返回的结果，改造成fs所需要的结构
          return { records: res.content, pageSize: res.size, currentPage: res.number + 1, total: res.totalElements };
        },
        pageRequest,
        addRequest,
        editRequest: async ({ form, row }) => {
          form.password = encryptPass(form.password);
          return await api.UpdateObj(form);
        },
        delRequest
      },
      rowHandle: {
        width: 300,
        buttons: {
          orderExample: {
            text: "关联用户",
            title: "按钮排序示例",
            type: "link",
            order: 1, //数字越小，越靠前,默认排序号为1
            click(context) {
              openDialog(context.record.id, context.record.displayName);
            }
          },
          authz: {
            type: "link",
            text: "授权",
            async click(context) {
              await authz.authzOpen(context.record.id);
            }
          }
        },
      },
      form: {
        wrapper: {
          buttons: {
            ok: {}, // fs-button配置
            cancel: {}
          }
        }
      },
      table: {
        rowKey: "id",
        rowSelection: {
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: (record: any) => ({
            disabled: record.id === 1 // 此处演示第一行禁用
          })
        }
      },
      columns: {
        _index: {
          title: "序号",
          type: "text",
          form: { show: false },
          column: {
            // type: "index",
            align: "center",
            width: "55px",
            columnSetDisabled: true, //禁止在列设置中选择
            formatter: (context) => {
              //计算序号,你可以自定义计算规则，此处为翻页累加
              const index = context.index ?? 1;
              const pagination = crudExpose.crudBinding.value.pagination;
              return ((pagination.current ?? 1) - 1) * pagination.pageSize + index + 1;
            }
          }
        },
        id: {
          title: "id",
          type: "text",
          form: { show: false }, // 表单配置
          column: {
            width: 70,
            sorter: true,
            show: false
          }
        },
        displayName: {
          title: "角色名称",
          type: "text",
          search: { show: true },
          form: {
            rules: [
              { required: true, message: "请输入角色名称" },
              { max: 50, message: "最大50个字符" }
            ]
          }, // 表单配置
          column: {
            sorter: true
          }
        },
        description: {
          title: "描述",
          type: "text",
          search: { show: true },
          form: {
            rules: [
              { required: true, message: "请输入描述" },
              { max: 50, message: "最大50个字符" }
            ]
          }, // 表单配置
          column: {
            sorter: true
          }
        },
        createdAt: {
          title: "创建时间",
          type: "datetime",
          column: {
            sorter: true
          },
          form: {
            show: false
          }
        },
        lastTime: {
          title: "更新时间",
          type: "datetime",
          column: {
            sorter: true
          },
          form: { show: false } // 表单配置
        }
      }
    }
  };
}
