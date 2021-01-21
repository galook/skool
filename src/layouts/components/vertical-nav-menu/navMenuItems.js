/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import Swal from 'sweetalert2'
var routes = [
  {
    header: 'Main',
    icon: 'PackageIcon',
    i18n: 'Main',
    items: [
      {
        url: "/",
        name: "Home",
        slug: "home",
        icon: "HomeIcon",
      },
      {
        url: null,
        name: 'Fund',
        tag: 0,
        tagColor: 'warning',
        icon: 'DollarSignIcon',
        submenu: [

          {
            url: "/Fund",
            name: "About",
            slug: "About",
            icon: "DollarSignIcon",
          },
          {
            url: "/Payments",
            name: "Payments",
            slug: "Payments",
            icon: "DollarSignIcon",
          },
        ]
      }
    ]
  },
  

]
async function getRoutes() {
  if (user) {
    try {
      let roles = await user.getRoleNames()
      let adminRoles = ['Quvia Team', 'Fund Manager']
      if (roles.filter(x => adminRoles.includes(x)).length > 0) {

        console.log('Admin-Capable User Detected');

        let adminRoutes = {
          url: null,
          name: 'Management',
          tag: 0,
          tagColor: 'warning',
          icon: 'SettingsIcon',
          submenu: []
        }

        roles.forEach(role => {
          switch (role) {
            case adminRoles[0]:
              adminRoutes.submenu.unshift({
                url: "/AdminTools",
                name: "Admin Tools",
                slug: "Fund",
                icon: "DollarSignIcon",
              })
              break;

            case adminRoles[1]:
              adminRoutes.submenu.unshift({
                url: "/Financial",
                name: "Financial",
                slug: "Fund",
                icon: "DollarSignIcon",
              })
              break;

            default:
              break;
          }
        });
        routes.push(adminRoutes)

      } else {
        routes = []
        Swal.fire({
          title: "You are not an admin",
          html: "Therefore, you <b>do not have access to SKOOL by Quvia.</b><br>If you'd like to gain access, please contact the server administrators to get this sorted out for you.",
          showConfirmButton: false,
          allowOutsideClick: false,
          icon: 'error'

        })
      }





    } catch (e) {
 
      if (e.message == "Account suspended!") {
        Swal.fire({
          title: "Suspended",
          html: "<b>Your Account Has Been Suspended.</b><br>You cannot use SKOOL by Quvia. Please contact server administrators to get this sorted out for you.",
          showConfirmButton: false,
          allowOutsideClick: false,
          icon: 'error'

        })
      } else Swal.fire('Could not retrieve role information', e.message, 'error')

    }
  }
}

getRoutes()
export default routes