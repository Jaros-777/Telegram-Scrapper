export function sorting(BigArr) {
  let dict = {};

  for (let index in BigArr) {
    //console.log(BigArr[index]);

    for(let i in BigArr[index]){
        let key = BigArr[index][i];
        //console.log(BigArr[index][i])
        BigArr[index][i] in dict? dict[key]++ : dict[key]=1
    }

  }
  //console.log(BigArr)
  let sortedArray = Object.keys(dict).map(key => { return { key: key, count: dict[key] }; });

  sortedArray.sort((a,b) => b.count - a.count)

  console.log(sortedArray);
}

const arr = [
  [ 'JavaScript', 'HTML', 'CSS' ],
  [ 'Java', 'Vue.js', 'Spring Framework', 'Hibernate', 'JavaScript' ],
  [
    'C#', 'SQL','HTML','JavaScript', 'Json', 'Java',
  ]
];

//sorting(arr);
