import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts/MainLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/Home.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      {
        path: 'repair',
        name: 'Repair',
        component: () => import('@/views/repair/Repair.vue'),
        meta: { title: '线上报修', icon: 'Tools' }
      },
      {
        path: 'repair/list',
        name: 'RepairList',
        component: () => import('@/views/repair/RepairList.vue'),
        meta: { title: '报修记录', icon: 'List' }
      },
      {
        path: 'visitor',
        name: 'Visitor',
        component: () => import('@/views/visitor/Visitor.vue'),
        meta: { title: '访客预约', icon: 'User' }
      },
      {
        path: 'visitor/list',
        redirect: '/visitor'
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/Profile.vue'),
        meta: { title: '个人中心', icon: 'UserFilled' }
      },
      {
        path: 'profile/info',
        name: 'ProfileInfo',
        component: () => import('@/views/profile/ProfileInfo.vue'),
        meta: { title: '个人信息', icon: 'Edit' }
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('@/views/messages/Messages.vue'),
        meta: { title: '消息中心', icon: 'Bell' }
      },
      {
        path: 'payment',
        name: 'Payment',
        component: () => import('@/views/payment/Payment.vue'),
        meta: { title: '物业缴费', icon: 'Wallet' }
      },
      {
        path: 'payment/success',
        name: 'PaymentSuccess',
        component: () => import('@/views/payment/PaymentSuccess.vue'),
        meta: { title: '支付成功' }
      },
      {
        path: 'payment/list',
        name: 'PaymentList',
        component: () => import('@/views/payment/PaymentList.vue'),
        meta: { title: '缴费记录', icon: 'Document' }
      },
      {
        path: 'parking',
        name: 'Parking',
        component: () => import('@/views/parking/Parking.vue'),
        meta: { title: '车位管理', icon: 'Car' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 小区物业管理系统` : '小区物业管理系统'
  next()
})

export default router
