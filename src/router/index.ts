import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import TagsPage from "@/pages/TagsPage.vue";
import archiversPage from "@/pages/ArchiversPage.vue";
import LinksPage from "@/pages/LinksPage.vue";
import SpacePage from "@/pages/user/SpacePage.vue";
import ArticleDetailPage from "@/pages/ArticleDetailPage.vue";
import EditorPage from "@/pages/user/EditorPage.vue";
import ItIsATest from "@/pages/ItIsATest.vue";
import UserLoginPage from "@/pages/user/UserLoginPage.vue";
import UserRegisterPage from "@/pages/user/UserRegisterPage.vue";
import Test2Page from "@/pages/Test2Page.vue";
import AdminPage from "@/pages/admin/AdminPage.vue";
// import { useAuthStore } from "@/store/useAuthStore";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/tag",
    name: "tag",
    component: TagsPage,
  },
  {
    path: "/archivers",
    name: "archivers",
    component: archiversPage,
  },
  {
    path: "/link",
    name: "link",
    component: LinksPage,
  },
  {
    path: "/me",
    name: "me",
    component: SpacePage
  },
  {
    path: "/editor",
    name: "editor",
    component: EditorPage,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminPage,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../pages/AboutPage.vue"),
  },
  {
    path: "/articles/:id", // 添加匹配文章详情页的路由
    name: "article",
    component: ArticleDetailPage, // 用于展示文章详情的组件
  },
  {
    path: "/user/login", 
    name: "login",
    component: UserLoginPage,
  },
  {
    path: "/user/register", 
    name: "register",
    component: UserRegisterPage,
  },
  {
    path: "/test1", 
    name: "test1",
    component: ItIsATest,
  },
  {
    path: "/test2", 
    name: "test2",
    component: Test2Page,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// router.beforeEach(async (to, from, next) => {
//   const authStore = useAuthStore();
  
//   // 初始化认证状态
//   const isAuthenticated = await authStore.initAuth();
  
//   // 需要认证的路由
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/login');
//   } else {
//     next();
//   }
// });
export default router;
