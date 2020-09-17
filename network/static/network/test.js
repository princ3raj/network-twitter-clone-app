let objList = [{
    "id" : 5,
    "name" : "June"
  },{
    "id" : 4,
    "name" : "Jane"
  },
  {
    "id" : 4,
    "name" : "Jane"
  }
  ,{
    "id" : 3,
    "name" : "Julia"
  },{
    "id" : 2,
    "name" : "Nancy"
  },{
    "id" : 5,
    "name" : "June"
  },{
    "id" : 5,
    "name" : "June"
  },{
    "id" : 5,
    "name" : "June"
  }];
  
  let uniqueList = [];
  let dupList = [];
  let zzzz=0;
  
  Array.prototype.contains = function(item){
    let filtered_item = this.filter((i) => {
      return i.id === item.id
    });
    return !!filtered_item.length;
  }
  
  function contains(list, item){
    let filtered_item = list.filter((i) => {
      return i.id === item.id
    });
    return !!filtered_item.length;
  }
  
  function pushToUniqueList(item){
    if(!uniqueList.contains(item)) uniqueList.push(item);
  }
  
  function pushToDuplicateList(item){
    if(!dupList.contains(item)) dupList.push(item);
  }
  
  for(let i = 0; i < objList.length; i++){
    if(uniqueList.contains(objList[i])){
      pushToDuplicateList(objList[i]);
      zzzz++;
    } else {
      pushToUniqueList(objList[i]);
    }
  }
  
  console.log('Duplicate list is ', dupList);
  console.log('Unique list is ', uniqueList);
  console.log(zzzz)