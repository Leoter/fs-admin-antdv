<template>
    <fs-page>
        <fs-crud ref="crudRef" v-bind="crudBinding">
        </fs-crud>
    </fs-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { message, Modal, Row } from "ant-design-vue";
import { useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";
import { DelObj } from "./api";



//此处为组件定义
export default defineComponent({
    name: "角色管理",
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
        const { crudRef, crudBinding, crudExpose, selectedRowKeys } = useFs({ createCrudOptions, context: { permissionId: props.nowId } });

        // 页面打开后获取列表数据
        onMounted(() => {
            crudExpose.doRefresh();
        });


        return {
            crudBinding,
            crudRef
        };
    }
});
</script>   