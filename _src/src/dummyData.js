 const uuid = () =>{
    return Math.floor(Math.random() * 10000000).toString()
}
export const dummyData = {
    id: uuid(),
    name: 'ボード名',
    categories: [
    ]
}