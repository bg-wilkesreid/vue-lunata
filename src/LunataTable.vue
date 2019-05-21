<template>
<div class="lunata-table">
    <table v-if="hasItems" table-layout="fixed">
        <thead>
            <th v-for="column in columns" :key="column.name">{{ column.name }}</th>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item[pk]" @contextmenu.prevent="contextMenu($event, item)">
                <lunata-cell v-for="column in columns" :key="column.name" :item="item" :column="column" />
            </tr>
        </tbody>
    </table>
    <div v-else>
        <p class="no-items-message">No {{ labels.plural }} were found.</p>
    </div>
    <!-- <lunata-bootstrap-modal ref="createModal" :columns="columns" :labels="labels" type="create" @create="emitCreate" /> -->
    <vue-context ref="menu" v-slot="{ data }">
        <ul>
            <li v-for="(action, name) in contextMenuActions" :key="name" @click="action(data.item)">{{ name }}</li>
        </ul>
    </vue-context>
</div>
</template>
<script>
// import LunataBootstrapModal from './LunataBootstrapModal.vue'
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
            type: Object,
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
        // LunataBootstrapModal
    },
    data() {
        let vm = this

        return {
            contextMenuActions: this.actions != null ? this.actions : {
                Edit(item) {
                    vm.$emit('context-edit', item)
                },
                Delete(item) {
                    vm.$emit('context-delete', item)
                },
                ...this.appendActions
            }
        }
    },
    computed: {
        hasItems() {
            return this.items.length > 0
        },
    },
    methods: {
        contextMenu($event, item) {
            this.$refs.menu.open($event, { item })
        },
        create() {
            this.$refs.createModal.open()
        },
        emitCreate(item) {
            this.$emit('create', item)
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
</style>
