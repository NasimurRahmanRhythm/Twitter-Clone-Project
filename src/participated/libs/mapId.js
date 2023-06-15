export function mapId(obj,id="id"){
  const {_id,__v,...newObj} = obj
  newObj[id] = _id
  return newObj
}
