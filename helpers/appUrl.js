exports.appUrl =
  process.env.NODE_ENV === "dev"
    ? "http://localhost:3000/"
    : "your-prod-url.com";
