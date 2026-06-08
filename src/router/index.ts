import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useLogin } from '../composables/useLogin';
import DashboardLayout from '../layouts/DashboardLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/result',
    name: 'TestResult',
    component: () => import('../views/TestResultView.vue'),
    meta: { requiresAuth: false } // Public for testing
  },
  {
    path: '/help',
    name: 'HelpHub',
    component: () => import('../views/HelpHubView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/help/api',
    name: 'ApiHelp',
    component: () => import('../views/ApiHelpView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/help/flow',
    name: 'FlowHelp',
    component: () => import('../views/FlowHelpView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
      },
      {
        path: 'tables',
        name: 'Tables',
        component: () => import('../views/TablesView.vue'),
      },
      // POSView
      {
        path: 'pos',
        name: 'POS',
        component: () => import('../components/POS/POSView.vue'),
      },
      {
        path: 'menu-management',
        name: 'MenuManagement',
        component: () => import('../views/MenuManagementView.vue'),
        meta: { roles: ['ADMIN', 'MANAGER'] }
      },
      {
        path: 'settings/menu',
        name: 'MenuSettings',
        component: () => import('../views/MenuManagementView.vue'),
        meta: { roles: ['ADMIN', 'MANAGER'] }
      },
      {
        path: 'kds',
        name: 'KDS',
        component: () => import('../components/KDS/KDSView.vue'),
        meta: { roles: ['ADMIN', 'MANAGER', 'KITCHEN'] }
      },
      {
        path: 'tracking',
        name: 'Tracking',
        component: () => import('../components/Tracking/TrackingView.vue'),
      },
      // StaffView
      {
        path: 'staff',
        name: 'Staff',
        component: () => import('../components/Staff/StaffView.vue'),
        meta: { roles: ['ADMIN', 'MANAGER'] }
      },

      // SettingView 
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/SettingsView.vue'),
        meta: { roles: ['ADMIN', 'MANAGER'] }
      },
      // SupportView
      {
        path: 'support',
        name: 'Support',
        component: () => import('../views/SupportView.vue'),
      },
      //CategoryView
      {
        path: '/category',
        name: 'Category',
        component: () => import('../components/Category/CategoryView.vue'),
        meta: { roles: ['ADMIN', 'MANAGER'] }
      },
      {
        path: "/show",
        name: "Show",
        component: () => import('../components/POS/components/Show.vue'),
      },
      {
        path: 'shift',
        name: 'Shift',
        component: () => import('../views/ShiftView.vue'),
        meta: { roles: ['ADMIN', 'MANAGER', 'CASHIER'] }
      }
      
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Authentication and RBAC guard
router.beforeEach((
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const { isAuthenticated, userRole } = useLogin();
  const requiresAuth = to.meta.requiresAuth !== false;
  const allowedRoles = to.meta.roles as string[] | undefined;

  if (requiresAuth && !isAuthenticated()) {
    // Redirect to login if trying to access protected route
    next('/login');
  } else if (to.path === '/login' && isAuthenticated()) {
    // Redirect to dashboard if already logged in
    next('/tables');
  } else if (requiresAuth && allowedRoles && userRole.value) {
    // Check if user has required role
    if (allowedRoles.includes(userRole.value.toUpperCase())) {
      next();
    } else {
      // User doesn't have permission
      console.warn(`Access denied. User role ${userRole.value} cannot access ${to.path}`);
      // Redirect to a safe page like tables (or a 403 page if you make one)
      next('/tables'); 
    }
  } else {
    next();
  }
});

export default router;
