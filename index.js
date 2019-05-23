import LunataTable from './src/LunataTable.vue'

const VueLunata = {
    install(Vue) {
        Vue.component('lunata-table', LunataTable)
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VueLunata)
}

export default VueLunata