# Getting Started

## Data Tables

The core component of Lunata is the `<lunata-table>`. Basic usage using the example of a [Single File Component](https://vuejs.org/v2/guide/single-file-components.html) looks like this:

```html
<template>
<div>
    <h1>Users</h1>
    <lunata-table :items="users" :columns="columns" pk="name" />
</div>
</template>

<script>
export default {
    data() {
        return {
            users: [
                {
                    name: 'Bob',
                    age: 26,
                },
                {
                    name: 'Sally',
                    age: 29,
                },
            ],
            columns: [
                {
                    name: 'Name',
                    prop: 'name'
                },
                {
                    name: 'Age',
                    prop: 'age'
                }
            ],
        }
    }
}
</script>
```

### Result {docsify-ignore}

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<template>
<div>
    <h1>Users</h1>
    <lunata-table :items="users" :columns="columns" pk="id" />
</div>
</template>

<script>
export default {
    data() {
        return {
            users: [
                {
                    id: 1,
                    name: 'Bob',
                    age: 26,
                },
                {
                    name: 'Sally',
                    age: 29,
                },
            ],
            columns: [
                {
                    id: 2,
                    name: 'Name',
                    prop: 'name'
                },
                {
                    name: 'Age',
                    prop: 'age'
                }
            ],
        }
    }
}
</script>
</script>

## Explanation

The `<lunata-table>` component uses two fundamental props: `items` and `columns`. The value of the `items` prop is an array of data which will determine the rows that are listed, and the value of the `columns` prop is an array of objects describing the columns of the table. It is also recommended that you specify the primary key of your items by using the `pk` prop. See more about how Vue [maintains state](https://vuejs.org/v2/guide/list.html#Maintaining-State).

### Items

Items must be an array of objects.

### Columns

[Columns](columns.md) must be an array of objects, and each object uses the following api:

```javascript
[
    {
        name: 'Name'
            /**
             * (Required) The heading of the column.
             */
          
        prop: 'name'
            /**
             * (Required) The property of each item that 
             * will be shown in this column.
             */
        
        type: 'text'
            /**
             * (Optional) The schema type of the 
             * column; can be 'text', 'number', 
             * 'select', 'textarea', or 'checkbox'. 
             * This is only necessary if you are
             * going to be using CRUD features.
             */

        component: Component
            /**
             * (Optional) The Vue component
             * to display in the table cell
             * for this column. It will be
             * automatically passed an "item"
             * prop containing the current
             * item.
             */

        get(item) {...}
            /**
             * (Optional) Method to return the value
             * that should show in the table cell.
             * If you define this, then you do not
             * need to provide the 'prop' property, 
             * unless you are using CRUD features,
             * in which case you should always provide 
             * the 'prop' property anyway.
             */

        set(item, val) {...}
            /**
             * (Optional) Method to set the value. 
             * This is only needed if you also set
             * the component prop. This method will
             * be executed when the component emits an
             * 'input' event.
             */

        hidden: false
            /**
             * (Optional) If this is set to true, then
             * this column will not be shown in the table.
             * This can be useful if you want to have a
             * field that only shows up in the CRUD modals 
             * for creating and editing.
             */

        computed: false
            /** 
             * (Optional) If this is set to true, then
             * this column will only show up in the table,
             * not in the CRUD modals for creating or
             * editing.
             */

        readonly: false
            /**
             * (Optional) If this is set to true, then
             * this column will show up in the table and
             * in CRUD modals, but it will be readonly in
             * the modals.
             */
    },
    ...
]
```

## Advanced Usage

```html
<!-- App.vue -->
<template>
<div>
    <div>
        Bob active: {{ users[0].active ? 'Yes' : 'No' }}
    </div>
    <lunata-table :items="users" :columns="columns" pk="id" />
</div>
</template>

<script>
import UserActive from '.UserActive.vue'
export default {
    data() {
        return {
            users: [
                {
                    id: 1,
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
```

```html
<!-- UserActive.vue -->
<template>
<input type="checkbox" :checked="item.active" pk="id" @input="$emit('input', $event.target.checked)" />
</template>

<script>
export default {
    props: ['item']
}
</script>
```

### Result {docsify-ignore}

<vuep template="#advanced-example"></vuep>

<script v-pre type="text/x-template" id="advanced-example">
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
    template: `<input type="checkbox" :checked="item.active" @input="$emit('input', $event.target.checked)" />`
}

export default {
    data() {
        return {
            users: [
                {
                    id: 1,
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
</script>

In this example, you could also omit the `set` method on the Active column and instead just set the checkbox to use `v-model` on the corresponding object property.

>! **Note** Using v-model on a property of an object that's part of an array won't work if you fetch the array from an API, or if the property wasn't part of the object to begin with. See [Vue Reactivity: Change Detection Caveats](https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats).

```html
<input type="checkbox" v-model="item.active" />
```
