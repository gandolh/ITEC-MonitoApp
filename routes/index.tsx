import type { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import Layout from "../components/Layout.tsx";
// import Login from "../islands/Login.tsx";
import Login from "../islands/Login.tsx";
interface Data {
  isAllowed: boolean;
}

export default function Home({ data }: PageProps<Data>) {
  return (
    <div>
    {/* <div>
      You currently {data.isAllowed ? "are" : "are not"} logged in.
    </div> */}
    <Layout>
      <h1>Home</h1>
      <p>Welcome to your new app!</p>
    </Layout>
    {/* {!data.isAllowed ? <Login /> : <a href="/api/logout">Logout</a>} */}
  </div>
  );
}

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);

    return ctx.render!({ isAllowed: cookies.auth === "bar" });
  },
};