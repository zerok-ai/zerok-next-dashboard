const minimist = require("minimist");
const fs = require("fs");
const prettier = require("prettier");
const objectPath = require("object-path");


const generateComponent = () => {
  const args = minimist(process.argv.slice(2));
  const name = objectPath.get(args, "n", null);
  const type = objectPath.get(args, "t", null);
  if (!name || !type) throw new Error("No name or type specified");
  else {
    const formattedName =  name.charAt(0).toUpperCase() + name.slice(1)
    const path = `src/${type === "component" ? "components" : "pages"}/${
      type === "component" ? formattedName : name
    }`;
    fs.mkdirSync(path, true);
    const files = [
      {
        name: `${formattedName}.tsx`,
        parser: "typescript",
        content: `
        import styles from './${formattedName}.module.scss'; \n
        const ${formattedName} = () => {
         return (
           <div>${formattedName}</div>
         )
       }\n
       export default ${formattedName}`,
      },
      {
        name: `index.tsx`,
        parser: "typescript",
        content: `import ${formattedName} from "./${formattedName}";

      export default ${formattedName};`,
      },
      {
        name: `${formattedName}.module.scss`,
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
