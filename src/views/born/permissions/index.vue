<template>
    <fs-page>
        <fs-crud ref="crudRef" v-bind="crudBinding">
            <template #pagination-left>
                <a-tooltip title="批量删除">
                    <fs-button icon="DeleteOutlined" @click="handleBatchDelete"></fs-button>
                </a-tooltip>
            </template>
        </fs-crud>
        <a-modal v-model:visible="dialogShow" destroyOnClose width="80%" title="关联角色">
            <div style="height: 580px; position: relative">
                <!-- 在此处显示fs-crud页面 -->
                <role :nowId="nowId" :nowName="nowName"></role>
            </div>
        </a-modal>
    </fs-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import { message, Modal } from "ant-design-vue";
import createCrudOptions from "./crud";
import { DelObj } from "./api";

import role from "./role/index.vue";

//此处为组件定义
export default defineComponent({
    name: "permission",
    components: { role },
    setup() {
        //  =======以上为fs的初始化代码=========
        //  =======你可以简写为下面这一行========
        const { crudRef, crudBinding, crudExpose, selectedRowKeys } = useFs({ createCrudOptions, context: { openDialog }  });

        // 页面打开后获取列表数据
        onMounted(() => {
            crudExpose.doRefresh();
        });

        const handleBatchDelete = () => {
            if (selectedRowKeys.value?.length > 0) {
                Modal.confirm({
                    title: "确认",
                    content: `确定要批量删除这${selectedRowKeys.value.length}条记录吗`,
                    async onOk() {
                        await DelObj(selectedRowKeys.value);
                        message.info("删除成功");
                        crudExpose.doRefresh();
                        selectedRowKeys.value = [];
                    }
                });
            } else {
                message.error("请先勾选记录");
            }
        };


        const dialogShow = ref(false);
        const nowId = ref('')
        const nowName = ref('')
        function openDialog(roleId: string, name: string) {
            nowId.value = roleId;
            nowName.value = name;
            dialogShow.value = true;
        }

        return {
            crudBinding,
            crudRef,
            handleBatchDelete,

            
            dialogShow,
            openDialog,
            nowId,
            nowName
        };
    }
});
</script>   