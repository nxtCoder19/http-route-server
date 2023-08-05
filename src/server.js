import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();

const pagesPath = "./pages";

function resolveRoute(p) {
  const x = path.relative(pagesPath, p);
  //   console.log("value of x is", x);
  //   console.log("value of p is", p);
  if (x.endsWith("index")) {
    const sp = x.split("/");
    return sp.slice(0, sp.length - 1).join("/");
  }
  return x;
}

async function walk(dirPath) {
  const ls = await fs.readdir(dirPath);
  await Promise.all(
    ls.map(async (item) => {
      const stat = await fs.lstat(path.resolve(dirPath, item));
      if (stat.isFile()) {
        console.log(
          "here",
          item,
          item.replace(".html", ""),
          resolveRoute(path.resolve(dirPath, item.replace(".html", "")))
        );

        app.get(
          "/" + resolveRoute(path.resolve(dirPath, item.replace(".html", ""))),
          async (req, res) => {
            const b = await fs.readFile(path.resolve(dirPath, item));
            return res.setHeader("Content-Type", "text/html").send(b);
          }
        );
      }

      if (stat.isDirectory()) {
        walk(path.resolve(dirPath, item));
      }
    })
  );
}

await walk(pagesPath);

// app.use("/", (req, res) => {
//   res.send("My world");
// });

app.listen(4000, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("server is listening on port 4000");
});
