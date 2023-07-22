import * as fs from "fs"

interface Parser{
  [key: string]: object
}

type KeyValuePair = Record<string, any>;

class INIParser{
  path: string;

  constructor(path: string){
    this.path = path;
  }

  readFile(path: string): string{
    try {
      const data = fs.readFileSync(path, "utf-8")
      return data
    } catch (err) {
      return err as unknown as string;
    }
  }
  
  getLineType(line: string){
    if (line.startsWith("[") && line?.endsWith("]")) {
      return "header"
    }
  
    if (line.startsWith(";")) {
      return "comment"
    }
  
    if (line.trim() === "") {
      return;
    }
  
    return "key-value"
  }
  
  parse(){
    let header: string;
    const file = this.readFile(this.path);
    const lines = file.trim().split("\n")
    const parsedData: Parser = {};
  
    for(let line of lines){
      let type = this.getLineType(line);
      switch (type) {
        case "header":
          line = line.replace(/[\[\]\s]/g, "");
          header = line;
          parsedData[line] = {}
          break;
        case "key-value":
          const [key, value] = line.split("=").map(item => item.trim());
          parsedData[header!] = {...parsedData[header!], [key]: value}
          break;
      }
    }
    return parsedData;
  }
  
  getSections(data: string){
    const sections:Array<string> = [];
    const lines = data.split("\n")
    for(let line of lines){
      const type = this.getLineType(line);
      if (type === "header") {
        line = line.replace(/[\[\]]/g, "");
        sections.push(line)
      }
    }
    return sections;
  }
  
  getSection(section: string){
    const data = this.parse();
    const values = data[section];
    return values;
  }
  
  updateSection(section: string, record: KeyValuePair){
    const data = this.parse();
    data[section] = record;
    console.log("data", data);    
  }
}

const parser = new INIParser("./conf.ini");
const person = {
  name: "Amira",
  age: 25
}

parser.updateSection("account", person)
// getSection("./conf.ini", "account")
// const file = readFile("./conf.ini");
// getSections(file as unknown as string);

