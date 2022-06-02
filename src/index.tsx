import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from './app/store';
import { usersSlice } from "./features/users/usersSlice";
import { postsSlice } from "./features/posts/postsSlice";


store.dispatch(usersSlice.endpoints.getUsers.initiate());
store.dispatch(postsSlice.endpoints.getPosts.initiate());


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
