<template>
  <div class="navbar-container d-flex content align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link class="nav-link" @click="toggleVerticalMenuActive">
          <feather-icon icon="MenuIcon" size="21" />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div
      class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex"
    >
      <dark-Toggler class="d-none d-lg-block" />
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content>
          <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">
              {{ quviauser.username ? quviauser.username : 'Guest' }}
            </p>
            <span class="user-status">{{ role }}</span>
          </div>
          <b-link @click="wantPurl">
            <b-avatar
              size="40"
              variant="light-primary"
              badge
              :text="
                quviauser.username
                  ? quviauser.username.split(' ')[0][0] +
                    (quviauser.username.split(' ')[1]
                      ? quviauser.username.split(' ')[1][0]
                      : '')
                  : 'I'
              "
              :src="Purl"
              class="badge-minimal"
              badge-variant="success"
            />
          </b-link>
        </template>

        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon size="16" icon="UserIcon" class="mr-50" />
          <span>Profile</span>
        </b-dropdown-item>

        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon size="16" icon="MailIcon" class="mr-50" />
          <span>Inbox</span>
        </b-dropdown-item>

        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon size="16" icon="CheckSquareIcon" class="mr-50" />
          <span>Task</span>
        </b-dropdown-item>

        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon size="16" icon="MessageSquareIcon" class="mr-50" />
          <span>Chat</span>
        </b-dropdown-item>

        <b-dropdown-divider />

        <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon size="16" icon="LogOutIcon" class="mr-50" />
          <span>Logout</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink,
  BNavbarNav,
  BNavItemDropdown,
  BDropdownItem,
  BDropdownDivider,
  BAvatar,
} from 'bootstrap-vue';
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue';

export default {
  data() {
    return {
      role: '...',
      Purl: '',
      sDate: '',
      i: 0, 
    };
  },
  watch: {
    quviauser: {
      handler: function (newVal, oldVal) {
        // watch it
        console.log('Prop changed: ', newVal, ' | was: ', oldVal);
      },
      deep: true,
    },
  },
  components: {
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,

    // Navbar Components
    DarkToggler,
  },
  async created() {
    this.role = (await this.quviauser.getHighestRole()).name;
    this.pic();
  },
  methods: {
    wantPurl() {
      if (!this.sDate) {
        console.log('No date');
        this.sDate = new Date();
      }
      if ((Date.now() - this.sDate.getTime()) > 230){
      console.log('No small')
      this.i = 1
      return this.sDate = new Date()
      }
      if (this.i < 1) return this.i++;

      localStorage.setItem(
        'wantPurl',
        !JSON.parse(localStorage.getItem('wantPurl'))
      );
      this.i = 0
      this.pic();
    },
    async pic() {
      let wantPurl = JSON.parse(localStorage.getItem('wantPurl'));
      this.Purl = wantPurl ? await this.quviauser.getProfilePictrueUrl() : '';
    },
  },

  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
};
</script>
