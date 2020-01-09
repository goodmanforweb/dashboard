export default class Store {
  constructor(hasSort) {
    this.hasSort = !!hasSort;
    this.container = hasSort ? [] : Object.create(null);
  }
  add(type, obj) {
    if(this.hasSort) {
      this.container.push(arguments[0]);
    }
    else if(!this.hasSort && arguments.length == 2) {
      this.container[type] = obj;
    }
    return this;
  }
  remove(type) {
    if(!type) return false;
    if(this.hasSort) {
      for(let i=0;i<this.container.length;i++) {
        if(this.container[i].id == type) {
          this.container.splice(i,1);
          break;
        }
      }
    }
    else {
      delete this.container[type];
    }
    return this;
  }
  has(type) {
    if(!type) return false;
    let isExit = false;
    if(this.hasSort) {
      let tempArr = this.container.filter(el => el.id == type);
      if(tempArr.length > 0 ) {isExit = true;}
    }
    else {
      isExit = !!this.container[type]
    }
    return isExit;
  }
  get(type) {
    if(!type) return false;
    if(this.hasSort) {
      let tempArr = this.container.filter(el => el.id == type);
      if(tempArr.length >0 ) {return tempArr[0]}
    }
    else {
      return this.container[type]
    }
    
  }
  getAll() {
    return this.container;
  }
}