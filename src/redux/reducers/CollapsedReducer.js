export const CollApsedReducer=(prevState={
  isCollapsed:false
},action)=>{

  let {type}=action
  switch(type){
    case "change_collapsed":
      let newsState={...prevState}
      newsState.isCollapsed=!newsState.isCollapsed
      return newsState
    default:
      return prevState
  }

}