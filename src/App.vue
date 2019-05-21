<template>
<div>
    <div>
        Bob active: {{ users[0].active ? 'Yes' : 'No' }}
    </div>
    <lunata-table :items="users" :columns="columns" />
</div>
</template>

<script>

let UserActive = {
    props: ['item'],
    render() {
        return (
            <input type="checkbox" checked={this.item.active} onInput={(e) => {this.$emit('input', e.target.checked)}} />
        )
    },
}

export default {
    data() {
        return {
            users: [
                {
                    name: 'Bob',
                    age: 26,
                    active: true,
                },
            ],
            columns: [
                {
                    name: 'Name',
                    prop: 'name'
                },
                {
                    name: 'Active',
                    component: UserActive,
                    set(item, val) {
                        window.console.log(item, val)
                        item.active = val
                    }
                },
                {
                    name: 'Old Enough to Drink',
                    get(item) {
                        return item.age >= 18 ? 'Yes' : 'No'
                    }
                },
            ],
        }
    }
}
</script>