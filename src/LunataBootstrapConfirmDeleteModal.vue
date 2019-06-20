<template>
    <div class="modal fade" ref="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Delete Item</h2>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to permamently delete this?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="close">Close</button>
                    <button type="button" class="btn btn-danger" @click="confirm">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    props: ['labels'],
    data() {
        return {
            item: null
        }
    },
    methods: {
        open(item) {
            this.item = item
            $(this.$refs.modal).modal({
                backdrop: false
            })
        },
        close() {
            $(this.$refs.modal).modal('hide')
        },
        confirm() {
            this.$emit('delete', this.item)
            this.close()
        }
    }
}
</script>
