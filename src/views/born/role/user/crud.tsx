import * as api from "./api";
import { AddReq, CreateCrudOptionsProps, CreateCrudOptionsRet, DelReq, EditReq, UserPageQuery, UserPageRes, dict } from "@fast-crud/fast-crud";
import { ref } from "vue";
import { encryptPass } from "/@/utils/util.pass";

export default function ({ crudExpose, context: { roleId } }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
    query.roleId = roleId;
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

  let sexOption = [
    { value: 1, label: "男" },
    { value: 2, label: "女" },
    { value: 3, label: "保密" }
  ]



  return {
    selectedRowKeys, //返回给index.vue去使用
    crudOptions: {
      toolbar: {
        compact: false
      },
      search: {
        debounce: false
      },
      tabs: {
        name: "isRelate",
        show: true,
        type: 'card', //tabs类型
        defaultOption: { //第一个tab页签显示
          show: true,
          value: 1, //点击第一个页签，查询值
          label: '已关联', // 第一个页签的名称
        },
        options: [
          { //第一个tab页签显示
            show: true,
            value: 0, //点击第一个页签，查询值
            label: '未关联', // 第一个页签的名称
          }
        ],
        onChange(context) {
          // crudExpose.doRefresh();
          if (context === 0) {
            crudExpose.crudBinding.value.rowHandle.buttons.relate.show = true
            crudExpose.crudBinding.value.rowHandle.buttons.unRelate.show = false
            crudExpose.crudBinding.value.actionbar.buttons.batchRelate.show = true
            crudExpose.crudBinding.value.actionbar.buttons.batchUnRelate.show = false
            crudExpose.doRefresh();
          } else {
            crudExpose.crudBinding.value.rowHandle.buttons.relate.show = false
            crudExpose.crudBinding.value.rowHandle.buttons.unRelate.show = true
            crudExpose.crudBinding.value.actionbar.buttons.batchRelate.show = false
            crudExpose.crudBinding.value.actionbar.buttons.batchUnRelate.show = true
            crudExpose.doRefresh();
          }

        }
      },
      request: {
        // pageRequest请求参数转换
        transformQuery: ({ page, form, sort }) => {
          let ignoreItem = ["isRelate"]
          let queryIndex = [];

          let query = []
          for (var x in form) {
            if (form[x] && !ignoreItem.includes(x)) {
              let queryItem = { prop: x, value: form[x], lr: 'and', operate: 'LIKE' };
              query.push(queryItem)
            }
          }

          let queryIndexItem = { exps: query }
          if (query.length > 0) {
            queryIndex.push(queryIndexItem);
          }

          
          let sorts = [];
          if(sort.prop){
            let sortItem = { orderField: sort.prop, orderType: sort.asc == true ? "ASC" : "DESC" }
            sorts.push(sortItem);
          }
          //改造成你的后端所能接受的参数结构
          return { page: page.currentPage - 1, size: page.pageSize, ...form, sorts: sorts, query: queryIndex };
        },
        // pageRequest请求结果转换
        transformRes: ({ res }) => {
          //将后端返回的结果，改造成fs所需要的结构
          return { records: res.content, pageSize: res.size, currentPage: res.number + 1, total: res.totalElements };
        },
        pageRequest,
        addRequest: async ({ form, row }) => {
          form.password = encryptPass(form.password);
          return await api.AddObj(form);
        },
        editRequest: async ({ form, row }) => {
          form.password = encryptPass(form.password);
          return await api.UpdateObj(form);
        },
        delRequest
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
        realname: {
          title: "姓名",
          type: "text",
          search: { show: true },
          form: {
            rules: [
              { required: true, message: "请输入姓名" },
              { max: 50, message: "最大50个字符" }
            ]
          }, // 表单配置
          column: {
            sorter: true
          }
        },
        username: {
          title: "用户名",
          type: "text",
          search: { show: true },
          form: {
            rules: [
              { required: true, message: "请输入用户名" },
              { max: 50, message: "最大50个字符" }
            ]
          }, // 表单配置
          column: {
            sorter: true
          }
        },
        phone: {
          title: "联系方式",
          type: "text",
          search: { show: true },
          form: { show: true },
          column: {
            sorter: true
          }
        },
        password: {
          title: "密码",
          type: "text",
          search: { show: false },
          form: { show: false },
          column: {
            show: false
          },
          addForm: { show: true },
          editForm: {
            show: true
          }
        },
        sex: {
          title: "性别",
          search: {
            show: true
          },
          type: 'dict-select',//字段类型
          dict: dict({
            data: sexOption
          })
        },
        lastIp: {
          title: "最后登录ip",
          type: "text",
          search: { show: true },
          form: { show: false },
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
      },
      rowHandle: {
        show: true,
        buttons: {
          view: { show: false },
          edit: { show: false },
          remove: { show: false },
          relate: {
            text: "关联",
            icon: "ion:logo-github",
            show: false,
            async click(context) {
              let userIds = [];
              userIds.push(context.record.id);
              await api.RelateObj(roleId, userIds);
              crudExpose.doRefresh();
            }
          },
          unRelate: {
            text: "取消关联",
            icon: "ion:logo-github",
            show: true,
            async click(context) {
              let userIds = [];
              userIds.push(context.record.id);
              await api.UnRelateObj(roleId, userIds);
              crudExpose.doRefresh();

            }
          }
        }
      },
      actionbar: {
        buttons: {
          add: {
            show: false
          },
          batchRelate: {
            text: "批量关联",
            show: false,
            async click() {
              await api.RelateObj(roleId, selectedRowKeys.value);
              crudExpose.doRefresh();
              selectedRowKeys.value = [];
            }
          },
          batchUnRelate: {
            text: "批量取消关联",
            show: true,
            async click() {
              await api.UnRelateObj(roleId, selectedRowKeys.value);
              crudExpose.doRefresh();
              selectedRowKeys.value = [];
            }
          }
        }
      }
    }
  };
}
