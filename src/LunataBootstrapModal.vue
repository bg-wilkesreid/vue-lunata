<template>
    <div class="modal fade" ref="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">{{ title }}</h2>
                </div>
                <div class="modal-body">
                    <div v-for="column in columns" :key="column.name" class="form-group">
                        <label :for="column.name">{{ column.name }}</label>
                        <select v-if="column.type == 'select'" ref="input" class="form-control" @input="update($event, column)" />
                        <textarea v-if="column.type == 'textarea'" ref="input" class="form-control" @input="update($event, column)" />
                        <input v-else :type="column.type" ref="input" class="form-control" @input="update($event, column)">
                    </div>
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
    data() {
        return {
            newItem: this.item ? Object.assign({}, this.item) : {}
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
    },
    methods: {
        resetNewItem() {
            this.newItem = this.item ? Object.assign({}, this.item) : {}
        },
        resetInputs() {
            this.$refs.input.forEach(input => {
                input.value = ''
            })
        },
        open() {
            $(this.$refs.modal).modal()
        },
        close() {
            $(this.$refs.modal).modal('hide')
        },
        confirm() {
            switch (this.type) {
                case 'create': this.$emit('create', this.newItem); break;
                case 'edit': this.$emit('update', this.newItem); break;
                case 'delete': this.$emit('delete', this.item); break;
            }
            this.resetNewItem()
            this.resetInputs()
            this.close()
        },
        update($event, column) {
            if ($event.target.type == 'checkbox') {
                column.set(this.newItem, $event.target.checked)
            } else {
                column.set(this.newItem, $event.target.value)
            }
        }
    }
}
</script>
