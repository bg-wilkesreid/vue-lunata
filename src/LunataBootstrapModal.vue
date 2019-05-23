<template>
    <div class="modal fade" ref="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">{{ title }}</h2>
                </div>
                <div class="modal-body">
                    <lunata-bootstrap-modal-field v-for="column in visibleColumns" ref="field" :key="column.name" :item="editingItem" :column="column" @update="update($event, column)" />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="confirm">{{ button_text }}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery'
import 'bootstrap'

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
        item: {
            type: Object,
            required: false
        }
    },
    components: {
        LunataBootstrapModalField
    },
    data() {
        return {
            editingItem: {}
        }
    },
    computed: {
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
        }
    },
    methods: {
        resetEditingItem() {
            this.editingItem = this.item ? Object.assign({}, this.item) : {}
        },
        resetInputs() {
            this.$refs.field.forEach(field => {
                field.clear()
            })
        },
        open(item) {
            $(this.$refs.modal).modal()
            this.editingItem = Object.assign({}, item)
        },
        close() {
            $(this.$refs.modal).modal('hide')
        },
        confirm() {
            switch (this.type) {
                case 'create': this.$emit('create', this.editingItem); break;
                case 'edit': this.$emit('update', this.editingItem); break;
                case 'delete': this.$emit('delete', this.item); break;
            }
            this.resetEditingItem()
            this.resetInputs()
            this.close()
        },
        update($event, column) {
            if ($event.target.type == 'checkbox') {
                if (column.hasOwnProperty('set')) {
                    column.set(this.editingItem, $event.target.checked)
                } else {
                    this.editingItem[column.prop] = $event.target.checked;
                }
            } else {
                if (column.hasOwnProperty('set')) {
                    column.set(this.editingItem, $event.target.value)
                } else {
                    this.editingItem[column.prop] = $event.target.value
                }
            }
        }
    }
}
</script>
