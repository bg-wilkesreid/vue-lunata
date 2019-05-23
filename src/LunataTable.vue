<template>
<div class="lunata-table">
    <table v-if="hasItems" table-layout="fixed">
        <thead>
            <th v-for="column in visibleColumns" :key="column.name">{{ column.name }}</th>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item[pk]" @contextmenu.prevent="contextMenu($event, item)">
                <lunata-cell v-for="column in visibleColumns" :key="column.name" :item="item" :column="column" />
            </tr>
        </tbody>
    </table>
    <div v-else>
        <p class="no-items-message">No {{ labels.plural }} were found.</p>
    </div>
    <lunata-bootstrap-modal ref="createModal" :columns="columns" :labels="labels" type="create" @create="emitCreate" />
    <lunata-bootstrap-modal ref="editModal" :columns="columns" :labels="labels" type="edit" @update="emitUpdate" />
    <vue-context ref="menu" v-slot="{ data }">
        <ul v-if="data && data.hasOwnProperty('item')">
            <li v-for="(action, name) in contextMenuActions(data.item)" :key="name" @click="action(data.item)">{{ name }}</li>
        </ul>
    </vue-context>
</div>
</template>
<script>
import LunataBootstrapModal from './LunataBootstrapModal.vue'
import LunataCell from './LunataCell.vue'
import { VueContext } from 'vue-context'
export default {
    name: 'lunata-table',
    props: {
        'items': {
            type: Array, 
            required: true
        },
        'columns': {
            type: Array,
            required: true
        },
        'actions': {
            type: Object,
            default() {
                return null
            }
        },
        'appendActions': {
            default() {
                return {}
            }
        },
        'pk': {
            type: String,
            required: false,
            default: 'id'
        },
        'labels': {
            type: Object,
            required: false,
            default() {
                return {
                    singular: "item",
                    plural: "items"
                }
            }
        }
    },
    components: {
        VueContext,
        LunataCell,
        LunataBootstrapModal
    },
    data() {
        return {
            // editingItem: null,
        }
    },
    computed: {
        hasItems() {
            return this.items.length > 0
        },
        visibleColumns() {
            return this.columns.filter(column => {
                return !column.hidden
            })
        }
    },
    methods: {
        contextMenuActions(item) {
            let vm = this
            if (this.actions != null) {
                if (typeof this.actions == 'function') {
                    return this.actions(item)
                } else {
                    return this.actions
                }
            } else {
                if (typeof this.appendActions == 'function') {
                    return {
                        Edit(item) {
                            vm.edit(item)
                            vm.$emit('context-edit', item)
                        },
                        Delete(item) {
                            vm.$emit('context-delete', item)
                        },
                        ...vm.appendActions(item)
                    }
                } else {
                    return {
                        Edit(item) {
                            vm.edit(item)
                            vm.$emit('context-edit', item)
                        },
                        Delete(item) {
                            vm.$emit('context-delete', item)
                        },
                        ...vm.appendActions
                    }
                }
            }
        },
        contextMenu($event, item) {
            this.$refs.menu.open($event, { item })
        },
        create() {
            this.$refs.createModal.open()
        },
        edit(item) {
            this.$refs.editModal.open(item)
        },
        emitCreate(item) {
            this.$emit('create', item)
        },
        emitUpdate(item) {
            this.$emit('update', item)
        }
    }
}
</script>
<style lang="scss" scoped>
table {
    width: 100%;
}
thead {
    background: #F5F6FA;
    height: 45px;
}
th {
    font-size: 1rem;
    color: #A3A6B4;
    font-weight: bold;
    text-transform: uppercase;
}
th, td {
    padding: 10px 15px;
}
td {
    color: #4D4F5C;
    font-size: 1rem;
}
tr:hover {
    background: rgba(0,0,0,0.05);
}
tr + tr {
    border-top: 1px solid #F1F1F3;
}
.no-items-message {
    font-size: 1rem;
}

.v-context {

    ul { 
        list-style: none;
        padding-left: 0;

        li {
            padding: 7px 10px;
            cursor: pointer;

            &:hover {
                background: #f0f0f0;
            }
        }
    }
}
</style>
