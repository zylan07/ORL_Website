import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
const SplitNotFoundComponent = () => /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-6 py-16 text-center", children: [
  /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Record not found" }),
  /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-4 inline-block text-primary hover:underline", children: "Return home" })
] });
export {
  SplitNotFoundComponent as notFoundComponent
};
