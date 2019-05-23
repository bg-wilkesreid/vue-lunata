# Installation

#### NPM

```bash
npm install vue-lunata
```

#### Yarn

```bash
yarn add vue-lunata
```

Usage with a module bundler like Webpack looks like this:

```javascript
import Vue from 'vue'
import VueLunata from 'vue-lunata'

Vue.use(VueLunata)
```

!> **NOTE**: Lunata currently uses [Bootstrap](https://getbootstrap.com) to open [modals](https://getbootstrap.com/docs/4.3/components/modal) for creating and editing. Because Bootstrap depends on [jQuery](https://jquery.com/) and [Popper.js](https://popper.js.org/), Lunata defines Bootstrap, jQuery, and Popper.js as [peer dependencies](https://nodejs.org/es/blog/npm/peer-dependencies/), meaning your project will need to include those packages. You can do so by running `npm install bootstrap jquery popper.js` or `yarn add bootstrap jquery popper.js` depending on which package manager you use.