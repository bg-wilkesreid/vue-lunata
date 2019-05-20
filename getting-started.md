# Getting Started

### Data Tables

The core component of Lunata is the `<lunata-table>`. Basic usage using the example of a [Single File Component](https://vuejs.org/v2/guide/single-file-components.html) looks like this:

```html
<template>
    <h1>Users</h1>
    <lunata-table :items="users" :columns="columns" />
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

#### Result

| Name | Age |
| :--- | :--- |
| Bob | 26 |
| Sally | 29 |

### Explanation

The `<lunata-table>` component uses two fundamental props: `items` and `columns`. The value of the `items` prop is an array of data which will determine the rows that are listed, and the value of the `columns` prop is an array of objects describing the columns of the table.

#### Items

Items must be an array of objects.

#### Columns

Columns must be an array of objects, and each object uses the following api:

```javascript
[
    {
        name: 'Name'
          /**
           * The heading of the column
           */
        prop: 'name'
          /**
           * The property of each item that 
           * will be shown in this column
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
           * need to provide the 'prop' property.
           */
        set(item, val) {...}
          /**
           * (Optional) Method to set the value. 
           * This is only needed if you also set
           * the component prop. This method will
           * be executed when the component emits an
           * 'input' event.
           */
    },
    ...
]
```

### Advanced Usage

```html
<!-- App.vue -->
<template>
    <lunata-table :items="users" :columns="columns" />
</template>

<script>
import UserActive from '.UserActive.vue'
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
<input type="checkbox" :value="item.active" @input="this.$emit('input', $event.target.checked)" />
</template>

<script>
export default {
    props: ['item']
}
</script>
```

