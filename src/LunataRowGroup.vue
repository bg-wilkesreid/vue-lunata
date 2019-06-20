<template>
    <tbody>
        <tr>
            <td>
                <input type="checkbox" v-model="groupSelectionStatus" />
            </td>
            <td :colspan="columns.length" class="lunata-row-group-cell"><span class="lunata-row-group-label">{{ rows[0].cells[groupBy].column.name }}: <b>{{ label }}</b></span></td>
        </tr>
        <lunata-row v-for="row in rows" :key="row.item[pk]" :row="row" :pk="pk" :columns="columns" :crud-enabled="crudEnabled" :row-actions="rowActions" :group-by="groupBy" :selected="selected" ref="row" @select="onRowSelect" />
        <tr v-for="aggregate in aggregates" :key="aggregate.prop">
            <td :colspan="columns.length" class="lunata-row-group-aggregate-cell">
                {{ aggregate.label }}: <span v-html="aggregate.display" />
            </td>
        </tr>
        <tr><td :colspan="colspan"><hr /></td></tr>
    </tbody>
</template>

<script>
import LunataRow from './LunataRow.vue'
export default {
    props: ['rows', 'pk', 'columns', 'label', 'aggregateProps', 'crudEnabled', 'rowActions', 'groupBy', 'selected'],
    components: {
        LunataRow
    },
    data() {
        return {}
    },
    computed: {
        colspan() {
            if (this.crudEnabled) {
                return this.columns.length + 1
            } else {
                return this.columns.length
            }
        },
        aggregates() {
            return this.aggregateProps.map(obj => {
                let value = this.rows.reduce((acc, row) => {
                    return acc + row.cells[obj.prop].value
                }, 0)
                return {
                    label: obj.label,
                    prop: obj.prop,
                    value,
                    display: this.rows[0].cells[obj.prop].column.display(value)
                }
            })
        },
        groupSelectionStatus: {
            get() {
                let myRowPks = this.rows.map(row => {
                    return row.item[this.pk]
                })
                return myRowPks.reduce((acc, pk) => {
                    if (!acc) {
                        return false
                    } else {
                        return this.selected.includes(pk)
                    }
                }, true)
            },
            set(val) {
                this.emitSelect(val)
            }
        }
    },
    methods: {
        emitSelect(select) {
            if (select) {
                this.$emit('select', this.rows)
            } else {
                this.$emit('deselect', this.rows)
            }
        },
        onRowSelect(row) {
            this.$emit('row-select', row)
        }
    }
}
</script>

<style lang="scss">
.lunata-row-group-label {
    font-size: 1rem;
}
.lunata-row-group-aggregate-cell {
    text-align: right;
    font-size: .8rem;
    font-weight: bold;
}
</style>
