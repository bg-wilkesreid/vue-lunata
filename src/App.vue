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
                {
                    name: 'Sally',
                    age: 9,
                },
                {
                    columns: [
                        {
                            width: 2,
                            get: ""
                        },
                        {
                            get(items) {
                                let total = items.reduce((acc, item) => {
                                    return item.age + acc
                                }, 0)

                                return 'Average: ' + total / items.length
                            }
                        }
                    ]
                }
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
                        item.active = val
                    }
                },
                {
                    name: 'Age',
                    prop: 'age'
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