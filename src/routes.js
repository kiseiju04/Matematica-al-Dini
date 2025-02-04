import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import Home from "./pages/Home.vue";
import Courses from "@/pages/Courses.vue";
import Course from "@/pages/Course.vue";
import Exams from "@/pages/Exams.vue";
import Share from "@/pages/Share.vue";
import Generate from "@/pages/Generate.vue";

const routes = [
  { path: "/", component: Home, name: "home" },
  { path: "/courses/:type", component: Courses, name: "courses", props: true },
  { path: "/course/:id/:type", component: Course, name: "course", props: true },
  { path: "/exams/:type/:id/:name", component: Exams, name: "exams", props: true },
  { path: "/share", component: Share, name: "share" },
  { path: "/generate", component: Generate, name: "generate" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;