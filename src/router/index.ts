import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import { useAuthStore } from '../stores/authStore'
import LoginPageVue from '@/auth/pages/LoginPage.vue';
import OperatorPageVue from '@/views/OperatorPage.vue';
import MaintainerPageVue from '@/views/MaintainerPage.vue';
import { VAR_MAINTAINER, VAR_OPERATOR } from '@/constants/constants';
import RulesPagesVue from '@/views/operator/RulesPages.vue';
import UserGroupsPageVue from '@/views/operator/UserGroupsPage.vue';
import User from '@/modules/userAndGroup/users/User.vue';
import UdsGroup from '@/modules/userAndGroup/udsGroups/UdsGroup.vue';
import ShcGroup from '@/modules/userAndGroup/shcGroups/ShcGroup.vue';
import ActivityLogsPages from '@/views/operator/ActivityLogsPages.vue';
import SettingsPage from '@/views/operator/SettingsPage.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: () => {
        const authStore = useAuthStore();
        const isAuthenticated = authStore.isAuthenticated;
        const isOperator = authStore.hasRole(VAR_OPERATOR);
        const isMaintainer = authStore.hasRole(VAR_MAINTAINER);
        if (!isAuthenticated)  return '/login';
        return isOperator ? '/operator' : isMaintainer ? '/maintainer' : '/login';
      },
    },
    {
      path: '/login',
      component: LoginPageVue
    },
    {
      path: '/operator',
      component: OperatorPageVue,
      meta: { requiresAuth: true, role: VAR_OPERATOR }, 
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (authStore.isAuthenticated && authStore.role === VAR_OPERATOR) {
          next(); 
        } else {
          next('/login'); 
          //next(); 
        }
      },
      children: [
        {
          path: '', 
          redirect: '/operator/rules'
        },
        {
          path: 'rules',
          component: RulesPagesVue,
          meta: { requiresAuth: true, role: VAR_OPERATOR }
        }
        ,
        {
          path: 'usergroups',
          component: UserGroupsPageVue,
          meta: { requiresAuth: true, role: VAR_OPERATOR },
          children: [
            {
              path: 'users',
              component: User,
              meta: { requiresAuth: true, role: VAR_OPERATOR }
            },
            {
              path: 'uds',
              component: UdsGroup,
              meta: { requiresAuth: true, role: VAR_OPERATOR }
            },
            {
              path: 'shc',
              component: ShcGroup,
              meta: { requiresAuth: true, role: VAR_OPERATOR }
            }
          ]
        },
        {
          path: 'activity-logs',
          component: ActivityLogsPages,
          meta: { requiresAuth: true, role: VAR_MAINTAINER }
        }
      ]
    },
    {
      path: '/maintainer',
      component: MaintainerPageVue,
      meta: { requiresAuth: true, role: VAR_MAINTAINER }, 
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (authStore.isAuthenticated && authStore.role === VAR_MAINTAINER ) {
          next(); 
        } else {
          next('/login'); 
        }
      },
      children: [
        {
          path: '', 
          redirect: '/maintainer/activity-logs'
        },
        {
          path: 'activity-logs',
          component: ActivityLogsPages,
          meta: { requiresAuth: true, role: VAR_MAINTAINER }
        },
        {
          path: 'settings',
          component: SettingsPage,
          meta: { requiresAuth: true, role: VAR_MAINTAINER }
        },
      ]
    }
  ]
})

export default router
