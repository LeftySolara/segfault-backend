import usersRoutes from "./users/users.routes";
import boardCategoriesRoutes from "./boardCategories/boardCategories.routes";
import boardsRoutes from "./boards/boards.routes";
import threadsRoutes from "./threads/threads.routes";
import postsRoutes from "./posts/posts.routes";
import authRoutes from "./auth/auth.routes";
import healthCheckRoutes from "./healthCheck/healthCheck.routes";

export default {
  users: usersRoutes,
  boardCategories: boardCategoriesRoutes,
  boards: boardsRoutes,
  threads: threadsRoutes,
  posts: postsRoutes,
  auth: authRoutes,
  healthCheck: healthCheckRoutes,
};
