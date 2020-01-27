/* console.log(dataOriginal[1]['HeroID']);
var test = dataOriginal[1]['BanRate']; */

/* almost constant variables, initialization, functions*/
var numHero = 88;
var numShowingHero;
var numShowingHeroMax = 30;
var dataMap = [];
var dataMapRole = [];
var dataFiltered1 = [];
var dataFiltered2 = [];
var dataSorted = [];
var dataSliced = [];

var body = document.getElementsByTagName("body");
var tbl = document.getElementById("tblGood");
var sltMap = document.getElementById("sltMap");
var sltDifficulty = document.getElementById("sltDifficulty");
var sltRole = document.getElementById("sltRole");
var ipRatio = document.getElementById("rgRatio");

var numSizeWin = 4.6;
var numSizePlay = 0.3;
var stdWinRate = 3.6;
var stdGame = 19;

var roleInitial;
var roleColor;

function compaireFunc(key) {
  return function(a, b) {
    return b[key] - a[key];
  };
}

function listToMatrix(list, elementsPerSubArray) {
  var matrix = [],
    i,
    k;
  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }
    matrix[k].push(list[i]);
  }
  return matrix;
}

function updatePage() {
  var currentMap = document.getElementById("sltMap").value;
  var currentDifficulty = document.getElementById("sltDifficulty").value;
  var currentRole = document.getElementById("sltRole").value;
  var ratio = document.getElementById("rgRatio").value;

  var idxStart = currentMap * numHero;
  var idxEnd = currentMap * numHero + numHero;
  dataMap = dataOriginal.slice(idxStart, idxEnd);

  for (var i = 0; i < 88; i++) {
    dataMap[i]["Point"] =
      (100 - ratio) * (dataMap[i]["WinRate"] / 50 / stdWinRate) +
      ratio *
        ((((dataMap[i]["PlayRate"] + dataMap[i]["BanRate"]) / 100) * 88) /
          16 /
          stdGame);
  }
  /*just check https://stackoverflow.com/questions/31831651/javascript-filter-array-multiple-conditions*/

  switch (currentDifficulty) {
    case "All":
      dataFiltered1 = dataMap;
      break;
    case "2":
      dataFiltered1 = dataMap.filter(function(heroObject) {
        return heroObject["Difficulty"] == 1 || heroObject["Difficulty"] == 2;
      });
      break;
    case "3":
      dataFiltered1 = dataMap.filter(function(heroObject) {
        return (
          heroObject["Difficulty"] == 1 ||
          heroObject["Difficulty"] == 2 ||
          heroObject["Difficulty"] == 3
        );
      });
      break;
    case "4":
      dataFiltered1 = dataMap.filter(function(heroObject) {
        return heroObject["Difficulty"] != 5;
      });
      break;
  }

  if (currentRole == "All") {
    dataFiltered2 = dataFiltered1;
  } else {
    dataFiltered2 = dataFiltered1.filter(function(heroObject) {
      return heroObject["Role"] == currentRole;
    });
  }

  dataSorted = dataFiltered2.sort(compaireFunc("Point"));

  /*console.log(dataSorted.length);*/

  if (dataSorted.length <= numShowingHeroMax) {
    dataSliced = dataSorted;
    numShowingHero = dataSorted.length;
  } else {
    dataSliced = dataSorted.slice(0, numShowingHeroMax);
    numShowingHero = numShowingHeroMax;
  }

  /*console.log(ratio);*/

  while (tbl.rows.length > 1) {
    tbl.deleteRow(1);
  }

  for (var i = 0; i < numShowingHero; i++) {
    var row = tbl.insertRow(i + 1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);

    var rank = i + 1;
    cell1.innerHTML = "#" + rank;
    cell2.innerHTML =
      "<img src=" + "heroImages/" + dataSliced[i]["HeroID"] + ".png" + ">";

    switch (dataSliced[i]["Role"]) {
      case "Tank":
        roleInitial = "T";
        break;
      case "Bruiser":
        roleInitial = "B";
        break;
      case "Melee Assassin":
        roleInitial = "M";
        break;
      case "Ranged Assassin":
        roleInitial = "R";
        break;
      case "Healer":
        roleInitial = "H";
        break;
      case "Support":
        roleInitial = "S";
        break;
    }
    var divRoleTd = document.createElement("div");
    var rectRole = document.createElement("div");
    rectRole.setAttribute("class", "role" + dataSliced[i]["Role"]);
    rectRole.innerHTML = roleInitial;
    divRoleTd.appendChild(rectRole);
    cell3.appendChild(divRoleTd);

    for (var k = 0; k < parseInt(dataSliced[i]["Difficulty"]); k++) {
      var rectDifficulty = [];
      rectDifficulty[k] = document.createElement("div");
      cell4.appendChild(rectDifficulty[k]);
    }
    console.log(dataSliced[i]["Difficulty"]);
    cell4.setAttribute("class", "difficulty" + dataSliced[i]["Difficulty"]);

    cell5.setAttribute("class", "cellMain");
    var rectMain = document.createElement("div");
    var rectMainWidth = (dataSliced[i]["WinRate"] - 35) * numSizeWin;
    var rectMainHeight =
      (dataSliced[i]["PlayRate"] + dataSliced[i]["BanRate"]) * numSizePlay;

    rectMain.style =
      "width:" +
      rectMainWidth +
      "px;height:" +
      rectMainHeight +
      "px; background: linear-gradient(200deg, rgba(105,245,168,1) 0%, rgba(17,226,97,1) 40%, rgba(17,226,97,1) 100%); ";
    rectMain.setAttribute("class", "rectMain");
    /* followings don't work
        Rect.style.width = RectWidth + "px;" ;
        Rect.style.height = RectHeight + "px;" ;
        Rect.setAttribute("class", "boxWG");
        */
    cell5.appendChild(rectMain);

    var divText = document.createElement("div");
    var txtGames = (100 / dataSliced[i]["PlayRate"]).toFixed(1);
    var txtWinRate = dataSliced[i]["WinRate"].toFixed(1);
    divText.innerHTML = txtWinRate + "%" + "<br> 1 in " + txtGames + "G";
    divText.setAttribute("class", "divRectText");
    cell5.appendChild(divText);

    var txtPoint = dataSliced[i]["Point"].toFixed(1);
    cell6.innerHTML = txtPoint;
  }
}

window.onload = updatePage();
sltMap.addEventListener("change", updatePage);
sltDifficulty.addEventListener("change", updatePage);
sltRole.addEventListener("change", updatePage);
ipRatio.addEventListener("change", updatePage);
