<template>
    <div class="modal fade" ref="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">{{ title }}</h2>
                </div>
                <div class="modal-body">
                    <lunata-bootstrap-modal-field v-for="(cell, key) in visibleCells" ref="field" :key="key" :item="item" :cell="cell" :cells="cells" @update="update($event, cell)" />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="close">Close</button>
                    <button type="button" class="btn" :class="buttonClass" @click="confirm">{{ button_text }}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery'
import 'bootstrap'
import { Row } from './helpers'

import LunataBootstrapModalField from './LunataBootstrapModalField.vue'
export default {
    props: {
        type: {
            type: String,
            required: true,
            validator(val) {
                return ['create', 'edit', 'delete'].indexOf(val) !== -1
            }
        },
        columns: {
            type: Array,
            required: true
        },
        labels: Object,
    },
    components: {
        LunataBootstrapModalField
    },
    // mixins: [rowMixin], // References 'columns' and 'item', and defines 'evaluating' and 'cells'
    data() {
        return {
            item: {},
            row: null
        }
    },
    computed: {
        cells() {
            return this.row ? this.row.cells : {}
        },
        title() {
            switch (this.type) {
                case 'create': return 'Create ' + this.labels.singular; 
                case 'edit': return 'Edit ' + this.labels.singular; 
                case 'delete': return 'Delete ' + this.labels.singular; 
                default: return ''; 
            }
        },
        button_text() {
            switch (this.type) {
                case 'create': return 'Create'; 
                case 'edit': return 'Save'; 
                case 'delete': return 'Delete'; 
                default: return ''; 
            }
        },
        visibleColumns() {
            return this.columns.filter(column => {
                return !column.computed
            })
        },
        visibleCells() {
            return Object.keys(this.cells).reduce((obj, key) => {
                if (!this.cells[key].column.computed) {
                    obj[key] = this.cells[key]
                }
                return obj
            }, {})
        },
        buttonClass() {
            return {
                'btn-success': this.type == 'create',
                'btn-primary': this.type == 'edit',
                'btn-danger': this.type == 'delete',
            }
        }
    },
    methods: {
        resetItem() {
            this.item = {}
        },
        resetInputs() {
            this.$refs.field.forEach(field => {
                field.clear()
            })
        },
        resetRow() {
            this.row = null
        },
        open(item) {
            $(this.$refs.modal).modal({
                backdrop: false
            })
            this.item = Object.assign({}, item)
            this.row = new Row(this.item, this.visibleColumns)
        },
        close() {
            $(this.$refs.modal).modal('hide')
        },
        confirm() {
            switch (this.type) {
                case 'create': this.$emit('create', this.item); break;
                case 'edit': this.$emit('update', this.item); break;
                case 'delete': this.$emit('delete', this.item); break;
            }
            this.resetItem()
            this.resetInputs()
            this.resetRow()
            this.close()
        },
        update(val, cell) {
            let column = cell.column
            let obj = {...this.item}
            
            if (column.hasOwnProperty('set')) {
                column.set(obj, val)
            } else {
                if (column.hasOwnProperty('prop')) {
                    this.$set(obj, column.prop, val)
                }
            }

            this.item = Object.assign({}, this.item, obj)
            this.row.item = this.item
            this.row.evaluateCells()
        }
    }
}
</script>
