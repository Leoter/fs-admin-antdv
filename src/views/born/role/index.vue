<template>
    <fs-page>
        <fs-crud ref="crudRef" v-bind="crudBinding">
            <template #pagination-left>
                <a-tooltip title="批量关联">
                    <fs-button icon="DeleteOutlined" @click="handleBatchDelete"></fs-button>
                </a-tooltip>
            </template>
        </fs-crud>
        <a-modal v-model:visible="dialogShow" destroyOnClose width="80%" title="关联用户">
            <div style="height: 580px; position: relative">
                <!-- 在此处显示fs-crud页面 -->
                <user :nowId="nowId" :nowName="nowName"></user>
            </div>
        </a-modal>
        <a-modal v-model:visible="authzDialogVisible" width="860px" title="分配权限">
            <!-- <fs-permission-tree ref="permissionTreeRef" v-model:checkedKeys="checkedKeys" :tree="permissionTreeData"
                :editable="false" checkable :replace-fields="{ key: 'id', label: 'title' }"> </fs-permission-tree> -->
        </a-modal>
    </fs-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { message, Modal, Row } from "ant-design-vue";
import { useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";
import { DelObj } from "./api";
import * as api from "./api";
import * as permissionApi from "../menus/api"

import user from "./user/index.vue";


//此处为组件定义
export default defineComponent({
    name: "用户管理",
    components: { user },
    setup() {
        //  =======以上为fs的初始化代码=========
        //授权配置
        const authz = useAuthz();
        //  =======你可以简写为下面这一行========
        const { crudRef, crudBinding, crudExpose, selectedRowKeys } = useFs({ createCrudOptions, context: { openDialog, authz } });

        // 页面打开后获取列表数据
        onMounted(() => {
            crudExpose.doRefresh();
        });

        const handleBatchDelete = () => {
            if (selectedRowKeys.value?.length > 0) {
                Modal.confirm({
                    title: "确认",
                    content: `确定要批量关联这${selectedRowKeys.value.length}条记录吗`,
                    async onOk() {
                        await DelObj(selectedRowKeys.value);
                        message.info("关联成功");
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

        const authzDialogVisible = ref(false);
        return {
            crudBinding,
            crudRef,
            handleBatchDelete,

            dialogShow,
            openDialog,
            nowId,
            nowName,

            authzDialogVisible,
            ...authz
        };
    }
});



function useAuthz() {
    const checkedKeys = ref();
    const permissionTreeData = ref();
    const permissionTreeRef = ref();
    const authzDialogVisible = ref(false);
    const currentRoleId = ref();

    // 如果勾选节点中存在非叶子节点，tree组件会将其所有子节点全部勾选
    // 所以要找出所有叶子节点，仅勾选叶子节点，tree组件会将父节点同步勾选
    function getAllCheckedLeafNodeId(tree: any, checkedIds: any, temp: any) {
        for (let i = 0; i < tree.length; i++) {
            const item = tree[i];
            if (item.children && item.children.length !== 0) {
                getAllCheckedLeafNodeId(item.children, checkedIds, temp);
            } else {
                if (checkedIds.indexOf(item.id) !== -1) {
                    temp.push(item.id);
                }
            }
        }
        return temp;
    }
    function authzClose() {
        authzDialogVisible.value = false;
    }
    async function authzOpen(roleId: any) {
        permissionTreeData.value = await permissionApi.GetTree();
        console.log("@value", permissionTreeData.value);
        console.log("roleId", roleId);
        
        
        checkedKeys.value = [];
        currentRoleId.value = roleId;
        // this.treeData = ret.data
        await updateChecked(roleId);
        authzDialogVisible.value = true;
    }
    async function updateChecked(roleId: any) {
        let checkedIds = await api.getPermissionIds(roleId);
        // 找出所有的叶子节点
        checkedIds = getAllCheckedLeafNodeId(permissionTreeData.value, checkedIds, []);
        checkedKeys.value = checkedIds;
    }
    async function updatePermission() {
        const roleId = currentRoleId.value;
        const { checked, halfChecked } = permissionTreeRef.value.getChecked();
        const allChecked = [...checked, ...halfChecked];
        await api.DoAuthz(roleId, allChecked);
        authzClose();
        //await updateChecked(roleId);

        message.success("授权成功");
    }

    return {
        authzOpen,
        updatePermission,
        authzDialogVisible,
        permissionTreeData,
        checkedKeys,
        permissionTreeRef
    };
}
</script>   