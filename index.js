/* console.log(dataOriginal[1]['HeroID']);
var test = dataOriginal[1]['BanRate']; */

/* almost constant variables, initialization, functions*/
var numHero = 88;
var dataMap = [];
var dataMapRole = [];
var dataFiltered1 = [];
var dataFiltered2 = [];
var dataSorted = [];
var cbxPerHeroList = [];

var body = document.getElementsByTagName("body");
var tbl = document.getElementById("tableMain");
var sltMap = document.getElementById("sltMap");
var sltDifficulty = document.getElementById("sltDifficulty");
var rgRatio = document.getElementById("rgRatio");
var cbxRoleTank = document.getElementById("cbxRoleTank");
var cbxRoleBruiser = document.getElementById("cbxRoleBruiser");
var cbxRoleMelee = document.getElementById("cbxRoleMelee");
var cbxRoleRanged = document.getElementById("cbxRoleRanged");
var cbxRoleHealer = document.getElementById("cbxRoleHealer");
var cbxRoleSupport = document.getElementById("cbxRoleSupport");
var btnClear = document.getElementById("btnClear");

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

function showAll() {
  var currentMap = document.getElementById("sltMap").value;
  /*var currentDifficulty = document.getElementById("sltDifficulty").value;*/
  var currentRatio = document.getElementById("rgRatio").value;

  var idxStart = currentMap * numHero;
  var idxEnd = currentMap * numHero + numHero;
  dataMap = dataOriginal.slice(idxStart, idxEnd);

  /* about Ratio */
  for (var i = 0; i < numHero; i++) {
    dataMap[i]["Point"] =
      (100 - currentRatio) * (dataMap[i]["WinRate"] / 50 / stdWinRate) +
      currentRatio *
        ((((dataMap[i]["PlayRate"] + dataMap[i]["BanRate"]) / 100) * 88) /
          16 /
          stdGame);
  }
  dataSorted = dataMap.sort(compaireFunc("Point"));

  while (tbl.rows.length > 1) {
    tbl.deleteRow(1);
  }

  for (var i = 0; i < numHero; i++) {
    var row = tbl.insertRow(i + 1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    row.classList.add("rowTableMain");
    row.setAttribute("id", "rowHeroID" + dataSorted[i]["HeroID"]);
    row.classList.add("rowDifficulty" + dataSorted[i]["Difficulty"]);
    row.classList.add("rowRole" + dataSorted[i]["Role"]);

    cell1.innerHTML =
      "<img src=" + "heroImages/" + dataSorted[i]["HeroID"] + ".png" + ">";

    switch (dataSorted[i]["Role"]) {
      case "Tank":
        roleInitial = "T";
        break;
      case "Bruiser":
        roleInitial = "B";
        break;
      case "Melee":
        roleInitial = "M";
        break;
      case "Ranged":
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
    rectRole.setAttribute("class", "role" + dataSorted[i]["Role"]);
    rectRole.innerHTML = roleInitial;
    divRoleTd.appendChild(rectRole);
    cell2.appendChild(divRoleTd);

    for (var k = 0; k < parseInt(dataSorted[i]["Difficulty"]); k++) {
      var rectDifficulty = [];
      rectDifficulty[k] = document.createElement("div");
      cell3.appendChild(rectDifficulty[k]);
    }
    cell3.setAttribute("class", "difficulty" + dataSorted[i]["Difficulty"]);

    cell4.setAttribute("class", "cellMain");
    var rectMain = document.createElement("div");
    var rectMainWidth = (dataSorted[i]["WinRate"] - 35) * numSizeWin;
    var rectMainHeight =
      (dataSorted[i]["PlayRate"] + dataSorted[i]["BanRate"]) * numSizePlay;

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
    cell4.appendChild(rectMain);

    var divText = document.createElement("div");
    var txtGames = (100 / dataSorted[i]["PlayRate"]).toFixed(1);
    var txtWinRate = dataSorted[i]["WinRate"].toFixed(1);
    divText.innerHTML = txtWinRate + "%" + "<br> 1 in " + txtGames + "G";
    divText.setAttribute("class", "divRectText");
    cell4.appendChild(divText);

    /* var txtPoint = dataSorted[i]["Point"].toFixed(1); */

    cell5.innerHTML = "<input type='checkbox' class = 'cbxPerHero'>";
  }

  cbxPerHeroList = document.getElementsByClassName("cbxPerHero");
  for (var i = 0; i < numHero; i++) {
    cbxPerHeroList[i].addEventListener("change", checkSome);
  }
}

function hideSome() {
  var rows = document.getElementsByClassName("rowTableMain");

  var currentDifficulty = document.getElementById("sltDifficulty").value;
  var currentRatio = document.getElementById("rgRatio").value;

  var currentRoleCheckedTank = cbxRoleTank.checked;
  var currentRoleCheckedBruiser = cbxRoleBruiser.checked;
  var currentRoleCheckedMelee = cbxRoleMelee.checked;
  var currentRoleCheckedRanged = cbxRoleRanged.checked;
  var currentRoleCheckedHealer = cbxRoleHealer.checked;
  var currentRoleCheckedSupport = cbxRoleSupport.checked;

  /* about Ratio */
  for (var i = 0; i < numHero; i++) {
    dataMap[i]["Point"] =
      (100 - currentRatio) * (dataMap[i]["WinRate"] / 50 / stdWinRate) +
      currentRatio *
        ((((dataMap[i]["PlayRate"] + dataMap[i]["BanRate"]) / 100) * 88) /
          16 /
          stdGame);
  }
  dataSorted = dataMap.sort(compaireFunc("Point"));
  console.log(rows[3]);
  /*just check https://stackoverflow.com/questions/31831651/javascript-filter-array-multiple-conditions*/
  for (var rowNum = 1; rowNum <= numHero; rowNum++) {
    var rowNum2 = rowNum + 1;
    var currentrow = document.querySelector(
      "#tableMain > tr:nth-child(" + rowNum2 + ")"
    );
    console.log(currentrow);
    switch (currentDifficulty) {
      case "All":
        currentrow.classList.remove("rowHide");
        break;
      case "2":
        /* https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript/29447130 */
        /* 한 배열에 여러 특정 값들이 있는지 확인 */
        if (
          ["rowDifficulty3", "rowDifficulty4", "rowDifficulty5"].some(element =>
            Array.from(rows[rowNum].classList).includes(element)
          )
        ) {
          /* https://stackoverflow.com/questions/11444640/add-a-class-to-a-div-with-javascript */
          currentrow.classList.add("rowHide");
        } else {
          currentrow.classList.remove("rowHide");
        }
        break;
      case "3":
        if (
          ["rowDifficulty4", "rowDifficulty5"].some(element =>
            Array.from(rows[rowNum].classList).includes(element)
          )
        ) {
          currentrow.classList.add("rowHide");
        } else {
          currentrow.classList.remove("rowHide");
        }
        break;
      case "4":
        if (
          ["rowDifficulty5"].some(element =>
            Array.from(rows[rowNum].classList).includes(element)
          )
        ) {
          currentrow.classList.add("rowHide");
        } else {
          currentrow.classList.remove("rowHide");
        }
        break;
    }

    if (currentRoleCheckedTank == false) {
      if (Array.from(rows[rowNum].classList).includes("rowRoleTank")) {
        currentrow.classList.add("rowHide");
      } else {
        currentrow.classList.remove("rowHide");
      }
    } else {
      if (Array.from(rows[rowNum].classList).includes("rowRoleTank")) {
        currentrow.classList.remove("rowHide");
      } else {
        currentrow.classList.add("rowHide");
      }
    }

    if (currentRoleCheckedBruiser == false) {
      if (Array.from(rows[rowNum].classList).includes("rowRoleBruiser")) {
        currentrow.classList.add("rowHide");
      } else {
        currentrow.classList.remove("rowHide");
      }
    } else {
      if (Array.from(rows[rowNum].classList).includes("rowRoleBruiser")) {
        currentrow.classList.remove("rowHide");
      } else {
        currentrow.classList.add("rowHide");
      }
    }

    if (currentRoleCheckedMelee == false) {
      if (Array.from(rows[rowNum].classList).includes("rowRoleMelee")) {
        currentrow.classList.add("rowHide");
      } else {
        currentrow.classList.remove("rowHide");
      }
    } else {
      if (Array.from(rows[rowNum].classList).includes("rowRoleMelee")) {
        currentrow.classList.remove("rowHide");
      } else {
        currentrow.classList.add("rowHide");
      }
    }

    if (currentRoleCheckedRanged == false) {
      if (Array.from(rows[rowNum].classList).includes("rowRoleRanged")) {
        currentrow.classList.add("rowHide");
      } else {
        currentrow.classList.remove("rowHide");
      }
    } else {
      if (Array.from(rows[rowNum].classList).includes("rowRoleRanged")) {
        currentrow.classList.remove("rowHide");
      } else {
        currentrow.classList.add("rowHide");
      }
    }

    if (currentRoleCheckedHealer == false) {
      if (Array.from(rows[rowNum].classList).includes("rowRoleHealer")) {
        currentrow.classList.add("rowHide");
      } else {
        currentrow.classList.remove("rowHide");
      }
    } else {
      if (Array.from(rows[rowNum].classList).includes("rowRoleHealer")) {
        currentrow.classList.remove("rowHide");
      } else {
        currentrow.classList.add("rowHide");
      }
    }

    if (currentRoleCheckedSupport == false) {
      if (Array.from(rows[rowNum].classList).includes("rowRoleSupport")) {
        currentrow.classList.add("rowHide");
      } else {
        currentrow.classList.remove("rowHide");
      }
    } else {
      if (Array.from(rows[rowNum].classList).includes("rowRoleSupport")) {
        currentrow.classList.remove("rowHide");
      } else {
        currentrow.classList.add("rowHide");
      }
    }
  }
}

function checkSome() {
  var currentHero = this.parentElement.parentElement.getAttribute("id");
  if (this.checked == true) {
    document.getElementById(currentHero).classList.add("rowCheck");
  } else {
    document.getElementById(currentHero).classList.remove("rowCheck");
  }
}

window.onload = showAll();
sltMap.addEventListener("change", showAll);
btnClear.addEventListener("click", function() {
  location.reload();
});

rgRatio.addEventListener("change", hideSome);
sltDifficulty.addEventListener("change", hideSome);

cbxRoleTank.addEventListener("change", hideSome);
cbxRoleBruiser.addEventListener("change", hideSome);
cbxRoleMelee.addEventListener("change", hideSome);
cbxRoleRanged.addEventListener("change", hideSome);
cbxRoleHealer.addEventListener("change", hideSome);
cbxRoleSupport.addEventListener("change", hideSome);
