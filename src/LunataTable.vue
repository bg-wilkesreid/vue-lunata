<template>
<div class="lunata-table">
    <div v-if="hasItems">
        <table :border="hasBorder">
            <thead>
                <th>
                    <input type="checkbox" v-model="tableSelectionStatus" />
                </th>
                <template v-for="column in visibleColumns">
                    <th :key="column.name" v-show="!column.collapsed && groupBy != columnKey(column)" :data-column-name="column.name">{{ column.name }}</th>
                </template>
                <th v-if="crudEnabled" />
            </thead>
            <template v-if="groupingEnabled">
                <lunata-row-group v-for="(rows, label) in groups" :key="label" :columns="visibleColumns" :pk="pk" :rows="rows" :label="label" :aggregateProps="groupAggregates" :crud-enabled="crudEnabled" :row-actions="rowActions" :group-by="groupBy" :selected="selected" ref="rowGroup" @select="onGroupSelect" @deselect="onGroupDeselect" @row-select="onRowSelect" />
            </template>
            <tbody v-else>
                <lunata-row v-for="row in rows" :key="row.item[pk]" :row="row" :pk="pk" :columns="visibleColumns" :crud-enabled="crudEnabled" :row-actions="rowActions" :group-by="groupBy" :selected="selected" ref="row" @select="onRowSelect" />
            </tbody>
            <tbody>
                <tr v-for="(method, name) in aggregates" :key="name" class="aggregate-row">
                    <td :colspan="columns.length" class="aggregate-cell">{{ name }}: {{ method(items) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-else>
        <p class="no-items-message">No {{ labels.plural }} were found.</p>
    </div>
    <template v-if="crudEnabled">
        <lunata-bootstrap-modal ref="createModal" :columns="columns" :labels="labels" type="create" @create="emitCreate" />
        <lunata-bootstrap-modal ref="editModal" :columns="columns" :labels="labels" type="edit" @update="emitUpdate" />
        <lunata-bootstrap-confirm-delete-modal ref="deleteModal" @delete="emitDelete" />
    </template>
</div>
</template>

<script>
import Vue from 'vue'
import { Promised } from 'vue-promised'
import LunataBootstrapModal from './LunataBootstrapModal.vue'
import LunataBootstrapConfirmDeleteModal from './LunataBootstrapConfirmDeleteModal.vue'
import { Row, columnKey } from './helpers'
import LunataRow from './LunataRow.vue'
import LunataRowGroup from './LunataRowGroup.vue'
import toCamelCase from './toCamelCase'
import _groupBy from 'lodash/groupBy'
import _reject from 'lodash/reject'
import _union from 'lodash/union'

Vue.component('promised', Promised)

window.Row = Row

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
        },
        'groupBy': {
            type: String,
            required: false
        },
        'groupAggregates': {
            type: Array,
            required: false,
            default() {
                return []
            }
        },
        'aggregates': {
            type: Object,
            required: false,
            default() {
                return {}
            }
        },
        'crudEnabled': Boolean,
        'hasBorder': {
            type: Boolean,
            required: false,
            default() {
                return false
            }
        }
    },
    components: {
        LunataRow,
        LunataRowGroup,
        LunataBootstrapModal,
        LunataBootstrapConfirmDeleteModal
    },
    data() {
        return {
            rows: [],
            selected: []
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
        },
        groups() {
            if (!this.groupBy) {
                return null
            }

            return _groupBy(this.rows, row => {
                return row.cells[this.groupBy].value
            })
        },
        groupingEnabled() {
            return this.groupBy !== null && this.groupBy !== undefined
        },
        tableSelectionStatus: {
            get() {
                let pks = this.items.map(item => item[this.pk])
                return pks.reduce((acc, pk) => {
                    if (!acc) {
                        return false
                    } else {
                        return this.selected.includes(pk)
                    }
                }, true)
            },
            set(val) {
                if (val) {
                    this.selected = this.items.map(item => item[this.pk])
                } else {
                    this.selected = []
                }
            }
        }
    },
    mounted() {
        this.$emit('mounted')
        this.rows = this.items.map(item => {
            let row = new Row(item, this.visibleColumns)
            
            return row
        })
    },
    watch: {
        visibleColumns(cols) {
            this.rows = this.items.map(item => {
                let row = new Row(item, cols)
                
                return row
            })
        },
        items(items) {
            this.rows = items.map(item => {
                let row = new Row(item, this.visibleColumns)
                
                return row
            })
        },
        selected(selected) {
            this.$emit('select', selected)
        }
    },
    methods: {
        columnKey,
        rowActions(row) {
            let vm = this
            let actions
            if (this.actions != null) {
                if (typeof this.actions == 'function') {
                    actions = this.actions(row)
                } else {
                    actions = this.actions
                }
            } else {
                let appendActions
                if (typeof this.appendActions == 'function') {
                    appendActions = vm.appendActions(row)
                } else {
                    appendActions = vm.appendActions
                }

                actions = {
                    Edit(row) {
                        vm.edit(row)
                        vm.$emit('context-edit', row.item)
                    },
                    Delete(row) {
                        vm.delete(row.item)
                        vm.$emit('context-delete', row.item)
                    },
                    ...appendActions
                }
            }

            return Object.keys(actions).map(key => {
                let action = actions[key]
                if (typeof action == 'function') {
                    action = {
                        name: key,
                        do: action
                    }
                }
                if (typeof action == 'object') {
                    action = {
                        name: key,
                        ...action
                    }
                }
                return action
            })
        },
        create() {
            this.$refs.createModal.open()
        },
        delete(item) {
            this.$refs.deleteModal.open(item)
        },
        edit(row) {
            this.$refs.editModal.open(row.item)
        },
        emitCreate(item) {
            this.$emit('create', item)
        },
        emitUpdate(item) {
            // let row = this.rows.find(row => {
            //     return row.item[this.pk] == item[this.pk]
            // })
            // row.item = item
            // row.evaluateCells()
            
            this.$emit('update', item)
        },
        emitDelete(item) {
            this.$emit('delete', item)
        },
        toCamelCase(val) {
            return toCamelCase(val)
        },
        onGroupSelect(rows) {
            let rowPks = rows.map(row => row.item[this.pk])
            this.selected = _union(this.selected, rowPks)
        },
        onGroupDeselect(rows) {
            let rowPks = rows.map(row => row.item[this.pk])
            this.selected = _reject(this.selected, i => rowPks.includes(i))
        },
        onRowSelect(row) {
            if (!this.selected.includes(row.item[this.pk])) {
                this.selected = [...this.selected, row.item[this.pk]]
            } else {
                this.selected = _reject(this.selected, i => i == row.item[this.pk])
            }
        },
    },
}
</script>
<style lang="scss" scoped>
table {
    width: 100%;
    border-color: #d4d4d4;
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
th {
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
