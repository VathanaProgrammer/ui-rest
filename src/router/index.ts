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
        meta: { roles: ['ADMIN', 'MANAGER'] }
      },
      {
        path: 'tables',
        name: 'Tables',
        component: () => import('../views/TablesView.vue'),
        meta: { roles: ['ADMIN', 'MANAGER', 'WAITSTAFF', 'SERVER', 'CASHIER'] }
      },
      // POSView
      {
        path: 'pos',
        name: 'POS',
        component: () => import('../components/POS/POSView.vue'),
        meta: { roles: ['ADMIN', 'MANAGER', 'WAITSTAFF', 'CASHIER'] }
      },
      {
        path: 'menu-management',
        name: 'MenuManagement',
        component: () => import('../views/MenuManagementView.vue'),
        meta: { roles: ['ADMIN', 'MANAGER'] }
      },
      {
        path: 'invoices',
        name: 'Invoices',
        component: () => import('../views/InvoiceList.vue'),
        meta: { roles: ['ADMIN', 'MANAGER', 'WAITSTAFF', 'CASHIER'] }
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
        meta: { roles: ['ADMIN', 'MANAGER', 'HEAD_CHEF', 'KITCHEN', 'LINE_COOK'] }
      },
      {
        path: 'tracking',
        name: 'Tracking',
        component: () => import('../components/Tracking/TrackingView.vue'),
        meta: { roles: ['ADMIN', 'MANAGER'] }
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
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('../views/RoleManagementView.vue'),
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
    // Redirect to smart home page if already logged in
    const role = userRole.value?.toUpperCase() || 'WAITSTAFF';
    if (['ADMIN', 'MANAGER'].includes(role)) next('/dashboard');
    else if (['HEAD_CHEF', 'KITCHEN', 'LINE_COOK'].includes(role)) next('/kds');
    else next('/tables');
  } else if (requiresAuth && allowedRoles && userRole.value) {
    // Check if user has required role
    if (allowedRoles.includes(userRole.value.toUpperCase())) {
      next();
    } else {
      // User doesn't have permission
      console.warn(`Access denied. User role ${userRole.value} cannot access ${to.path}`);
      // Redirect to smart home page
      const role = userRole.value?.toUpperCase() || 'WAITSTAFF';
      if (['ADMIN', 'MANAGER'].includes(role)) next('/dashboard');
      else if (['HEAD_CHEF', 'KITCHEN', 'LINE_COOK'].includes(role)) next('/kds');
      else next('/tables');
    }
  } else {
    next();
  }
});

export default router;
