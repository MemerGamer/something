import * as esbuild from "esbuild";

const isDev = process.env.NODE_ENV !== "production";

try {
  const ctx = await esbuild.context({
    entryPoints: ["src/client.tsx"],
    bundle: true,
    minify: !isDev,
    sourcemap: isDev,
    outfile: "dist/client.js",
    format: "esm",
  });

  if (isDev) {
    await ctx.watch();
    console.log("Watching for changes...");
  } else {
    await ctx.rebuild();
    await ctx.dispose();
    console.log("Build complete");
  }
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}
