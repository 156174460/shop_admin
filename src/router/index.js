import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
// import Users form ''
import Users from '../components/Users.vue'
import Roles from '../components/Roles.vue'
import Rights from '../components/Rights.vue'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/', redirect: '/index' },
  {
    path: '/index',
    name: 'index',
    component: Index,

    children: [
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights }
    ]

    // children: [
    //   { path: '/users', component: Users }

    // ]

  },

  { path: '/login', name: 'login', component: Login }
  // { path: '/users', component: Users }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
