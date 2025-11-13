import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue' // Создадим позже

const routes = [
  {
    path: '/',
    redirect: '/login' // Перенаправляем с корня на логин
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true } // Требует авторизации
  },
  {
    path: '/:pathMatch(.*)*', // Обработка 404
    redirect: '/login'
  },
  {
    path: '/admin/users',
    name: 'Users',
    component: () => import('@/views/admin/UsersView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/users/create',
    name: 'CreateUser',
    component: () => import('@/views/admin/UserForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/users/:id',
    name: 'EditUser',
    component: () => import('@/views/admin/UserForm.vue'),
    props: true,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Навигационный guard для проверки авторизации
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router