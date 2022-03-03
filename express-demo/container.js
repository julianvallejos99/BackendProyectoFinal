const fs = require("fs");
const { loadavg } = require("os");

module.exports = class Contenedor{
  constructor(path){
    this.path=path;
  }
  async getData(){
    try {
      const ret = await fs.promises.readFile(this.path,"utf8")
      return JSON.parse(ret)
    }
    catch (error){
      console.log("No hay data");
      return null;
    }
  }
  async save(object){
    try {
      let data = await this.getData()
      data[0]++;
      data[1].push({id:(data[0]),...object});
      await fs.promises.writeFile(this.path,JSON.stringify(data),null,2)
      return data[0];
    } 
    catch (error) {
      console.log("No existe archivo, se creará");
      await fs.promises.writeFile(this.path,JSON.stringify([1,[{id:1,...object}]],null,2))
      return 1;
    }
  }
  async getIndexById(id,data){
    let ret = null;
    try {
      if (data) {
        data[1].forEach((element,index) => {
          if (element.id == id) {
            ret = index
          }
        });
      }
      return ret
    } catch (error) {
      return ret
    }
  }
  async getById(id){
    let ret = null
    try {
      const data = await this.getData()
      const index = await this.getIndexById(id,data)
      if(index)
        ret=data[1][index]
      console.log(`Traigo el objeto con ID ${id}`);
      return ret
    } catch (error) {
      return null
    }
  }
  async deleteById(id){
    try {
      let data = await this.getData()
      let index = await this.getIndexById(id,data)
      if (index!=null) data[1].splice(index,1);
      await fs.promises.writeFile(this.path,JSON.stringify(data),null,2)
      console.log(`Elimino el objeto con ID ${id}`);
    } catch (error) {
    }
  }
  async getAll(){
    let ret;
    try {
      const data = await this.getData();
      data!=null ? ret=data[1]:ret=null
      return ret
    } catch (err) {
      console.log(err);
      return ret
    }
  }
  async deleteAll(){
    await fs.promises.unlink(this.path)
  }
}