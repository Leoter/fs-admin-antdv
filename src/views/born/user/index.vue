<template>
    <fs-page>
        <fs-crud ref="crudRef" v-bind="crudBinding">
            <template #pagination-left>
                <a-tooltip title="用户管理1">
                    <fs-button icon="DeleteOutlined" @click="handleBatchDelete"></fs-button>
                </a-tooltip>
            </template>
            <template #toolbar-left>
                <span class="ml-2" style="width: 100px;">
                    导出文件类型
                    <a-select v-model:value="fileType">
                        <a-select-option value="XLSX">XLSX</a-select-option>
                        <a-select-option value="XLS">XLS</a-select-option>
                    </a-select>
                </span>
                <span class="ml-2" style="width: 100px;">
                    导出文件名称
                    <input type="text"  style="width: 100px;">
                </span>
            </template>
        </fs-crud>
    </fs-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import { message, Modal } from "ant-design-vue";
import createCrudOptions from "./crud";
import { DelObj } from "./api";


//此处为组件定义
export default defineComponent({
    name: "user",

    setup() {
        const fileType = ref("XLSX");
        const dataFrom = ref("search");


        // 页面打开后获取列表数据
        onMounted(() => {
            crudExpose.doRefresh();
        });

        const context = {
            fileType,
            dataFrom
        };


        //  =======以上为fs的初始化代码=========
        //  =======你可以简写为下面这一行========
        const { crudRef, crudBinding, crudExpose, selectedRowKeys } = useFs({ createCrudOptions, context });

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

        return {
            crudBinding,
            crudRef,
            ...context,
            handleBatchDelete
        };
    }
});
</script>   