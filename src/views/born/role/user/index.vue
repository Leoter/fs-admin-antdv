<template>
    <fs-page>
        <span> 角色名称: {{ nowName }}, 角色id: {{ nowId }}</span>
        <fs-crud ref="crudRef" v-bind="crudBinding">
        </fs-crud>
    </fs-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import { message, Modal } from "ant-design-vue";
import createCrudOptions from "./crud";
import { RelateObj } from "./api";


//此处为组件定义
export default defineComponent({
    name: "user",
    props: {
        nowId: {
            type: String,
            required: true
        },
        nowName: {
            type: String,
            required: true
        }
    },

    setup(props) {
        //  =======以上为fs的初始化代码=========
        //  =======你可以简写为下面这一行========
        const { crudRef, crudBinding, crudExpose, selectedRowKeys } = useFs({ createCrudOptions, context: { roleId: props.nowId } });

        // 页面打开后获取列表数据
        onMounted(() => {
            crudExpose.doRefresh();
        });

        const handleBatchRelate = () => {
            if (selectedRowKeys.value?.length > 0) {
                Modal.confirm({
                    title: "确认",
                    content: `确定要批量关联这${selectedRowKeys.value.length}个用户吗`,
                    async onOk() {
                        await RelateObj(props.nowId, selectedRowKeys.value);
                        message.info("关联成功");
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
            handleBatchRelate
        };
    }
});
</script>   