const minimist = require("minimist");
const fs = require("fs");
const prettier = require("prettier");
const objectPath = require("object-path");
const log = console.log;

const generateComponent = () => {
  const args = minimist(process.argv.slice(2));
  const name = objectPath.get(args, "n", null);
  if (!name) throw new Error("No name specified");
  else {
    const path = `src/Components/${name}`;
    fs.mkdirSync(path, true);
    const files = [
      {
        name: `${name}.tsx`,
        parser: "typescript",
        content: `
        import styles from './${name}.module.scss'; \n
        const ${name} = () => {
         return (
           <div>${name}</div>
         )
       }\n
       export default ${name}`,
      },
      {
        name: `index.tsx`,
        parser: "typescript",
        content: `import ${name} from "./${name}";

      export default ${name};`,
      },
      {
        name: `${name}.module.scss`,
        content: `@import "styles/variables.module.scss";
         .container {}`,
        parser: "scss",
      },
    ];
    files.forEach((file) => {
      fs.writeFileSync(
        `${path}/${file.name}`,
        prettier.format(file.content, { parser: file.parser })
      );
    });
  }
};

generateComponent();