import Vue from 'vue'
import FeatherIcon from '@core/components/feather-icon/FeatherIcon.vue'
import QFo from '@/views/plugin/QFo'
import flatPickr from 'vue-flatpickr-component';

import '@core/scss/vue/libs/vue-flatpicker.scss';

Vue.component(FeatherIcon.name, FeatherIcon)
Vue.component('qform', QFo)
Vue.component('flatpickr', flatPickr)