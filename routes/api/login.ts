import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { compareSync } from "bcrypt";
import { getUserByEmail } from "../../services/UserService.ts";

const checkCredentials = async (email: string, password: string) => {
	console.log(email);
	const user = await getUserByEmail(email);
  if (!user) {
    return false;
  }

  if (!compareSync(password, user.password)) {
    return false;
  }

  return true;
};

const responsePage = `<!DOCTYPE html>
						<html>
						<head>
							<title>Forbidden</title>
						</head>
						<body>
							<h1>Forbidden</h1>
							<p>Invalid email or password.</p>
						</body>
						</html>`

export const handler: Handlers = {
	async POST(req) {
		const url = new URL(req.url);
		const form = await req.formData();

		const email = form.get("email")?.toString() ?? "";
		const password = form.get("password")?.toString() ?? "";

		if (await checkCredentials(email, password)) {
			const headers = new Headers();
			setCookie(headers, {
				name: "auth",
				value: "bar", // this should be a unique value for each session
				maxAge: 120,
				sameSite: "Lax", // this is important to prevent CSRF attacks
				domain: url.hostname,
				path: "/",
				secure: false, // https "should" be enabled in production
			});

			headers.set("location", "/");
			return new Response(null, {
				status: 303, // "See Other"
				headers,
			});
		} else {
			return new Response(responsePage, {
				status: 403,
				headers: {
					"content-type": "text/html",
				},
			});
		}
	},
};
