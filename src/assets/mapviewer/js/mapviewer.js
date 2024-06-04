/* globals _, UIkit, visioweb, VisioWebEssential */
var essential;

const primary = '#00c5eb';

window.addEventListener('load', init);
window.addEventListener('beforeunload', destroy);
let salles
let sallesObscures
let intV = setInterval(() => {
  if(localStorage.getItem("ListRooms")){
    salles = JSON.parse(localStorage.getItem('ListRooms'))
    //window.location.reload()
    //console.log(salles)
    clearInterval(intV)
  }
}, 500)



let tableauCles;
//console.log('Sales', salles)


function setRoomColor(room) {
  const currentRoomId = tableauCles.find((element) => {
    return room.zone.mapwizeId === element;
  });

  if (currentRoomId) {
    let color = '#009242';

    switch (room.reservationStatus.state) {
      case 'available':
        if(!room.occupation){
          color = '#009242';
        }else{
          color = '#be0024'
        }

        break;
      case 'unavailable':
        if(room.occupation === true){
          color = '#be0024'
        }else{
          color = '#d04f19';
        }
        break;
      case 'busy':
        color = '#be0024';

    }

    essential.content.setPlaceColor({
      id: currentRoomId,
      color
    });

  }
}

function refreshColorCarto() {
  setInterval(() => {
    if(localStorage.getItem("ListRooms")){
      salles = JSON.parse(localStorage.getItem('ListRooms'))
      salles.map((sal) => {
        setRoomColor(sal)
        /* if(sal.type.key === 'office' || sal.type.key === 'bulle'){
           if(sal.occupation !== null){
             let urlIcons = sal.occupation ? './supprimer.png' : './coche.png'
             essential.content.setPlaceIcon({id: sal.zone.mapwizeId, url: urlIcons})
           }
         }*/
      })
    }
  }, 3000)
}

function defaultColorSall(mapId){
  essential.content.setPlaceColor({
    id: mapId,
    color: '#222'
  });
}

function allDefaultColorSall(){
  sallesObscures = JSON.parse(localStorage.getItem("ObscuresRooms"))

  sallesObscures.map((s) => {
    if(s !== "3B34" && s !=="5A12"){
      essential.content.setPlaceName({
        id: s,
        name: ''
      })
    }

  })
}



function setColorsalles(goto = false) {
  tableauCles = Object.keys(essential.content.places);


  salles.map(currentRoom => {
    setRoomColor(currentRoom);
    /*if(currentRoom.type.key === 'office' || currentRoom.type.key === 'bulle'){
      if(currentRoom.occupation !== null){
        let urlIcons = currentRoom.occupation ? './supprimer.png' : './coche.png'
        essential.content.setPlaceIcon({id: currentRoom.zone.mapwizeId, url: urlIcons})
      }
    }*/


  })

  if (localStorage.getItem('roomid')) {
    let selectedRoomId = localStorage.getItem('roomid');

    const selectedRoom = tableauCles.find((element) => {
      return selectedRoomId === element
    });

    if(selectedRoom){
      essential.venue.goToPlace({
        id: selectedRoom
      });
      essential.content.setPlaceIcon({id: selectedRoom, url: './marker_position.png'})
      localStorage.removeItem('roomid')
    }

  }



  allDefaultColorSall()





}

function logVisioWebEssentialTitle() {
  console.log('%c VisioWeb Essential%c v' + VisioWebEssential.version + ' %c',
    'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff; font-weight: bold;',
    'background:#00c5eb ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
    'background:transparent');
};

function logVisioWebTitle() {
  console.log('%c VisioWeb%c v' + essential._mapviewer.version + '-' + essential._mapviewer.revision +' %c',
    'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff; font-weight: bold;',
    'background:#00c5eb ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
    'background:transparent');
};

function init() {
  if (visioweb === undefined || VisioWebEssential === undefined)
  {
    console.log('ERROR: Missing VisioWeb or VisioWebEssential SDK. Make sure you included visioweb.js and visioweb.essential.js scripts to your html entry point.');
    return;
  }

  essential = new VisioWebEssential({
    element: document.getElementById('container'),
    imagePath: '../media'
  });

  essential.setParameters({
    parameters: {
      hash: 'kd70a2310732d706899bf90a9762726ccea4a827e',
      setPlaceNameOptions: {
        zoomScaleFactor: 0.7
      },
      /*setActivePlace: {
        id: 'Accueil'
      },*/
      locale: {
        language: navigator.language
      }
    }
  });

  const urlParameters = visioweb.Utils.getURLParameters();
  essential.setParameters({parameters: urlParameters});
  setupProgress();
  // logVisioWebEssentialTitle();
  const intervalId = setInterval(() => {
    if(localStorage.getItem("Etages") && localStorage.getItem("ListRooms")){

      essential.createMapviewer()
        .then(() => {
          logVisioWebTitle();
          essential.content.placeBubbleEnabled = true;
          setupNavigation();
          setupPlaceBubble();
          setupSelectors();
          setupSearch();

          setColorsalles(true);

          setTimeout(() => {
            refreshColorCarto()
          }, 4000)

          if (urlParameters.initial) {
            handleInitialParameters(urlParameters.initial);
          }
        })
        .catch(e => { // eslint-disable-line
          console.log(e);
          console.log('Could not load map. Check your config or get in touch with Visioglobe team.'); // eslint-disable-line
        });


      clearInterval(intervalId);
    }
  }, 1500)
  /*if(localStorage.getItem("Etage")){

  }*/



};

function destroy() {
  //essential.off('exploreStateWillChange');
  //essential.off('navigationComputed');
  essential.destroyMapviewer();
};

function addListItem(listItem, list, action) {
  let item = document.createElement('li');
  let link = document.createElement('a');
  link.classList.add(...['uk-flex', 'uk-flex-middle']);
  item.appendChild(link);
  list.appendChild(item);
  let textPadding = '';
  if (listItem.icon) {
    if (listItem.icon !== 'placeholder') {
      let img = document.createElement('img');
      img.src = listItem.icon;
      img.style.width = '32px';
      img.style.height = '32px';
      img.style.margin = '0px 8px';
      link.appendChild(img);
    }
    else {
      textPadding = '0 0 0 48px';
    }
  }
  if (listItem.name) {
    let span = document.createElement('span');
    let text = document.createTextNode(listItem.name);
    span.style.padding = textPadding;
    span.appendChild(text);
    link.appendChild(span);
  }
  if (listItem.detail) {
    let spacer = document.createElement('div');
    spacer.classList.add('uk-flex-1');
    link.appendChild(spacer);
    let span = document.createElement('span');
    let text = document.createTextNode(listItem.detail);
    span.classList.add(...['uk-text-muted', 'uk-text-small', 'uk-padding-small', 'uk-padding-remove-vertical']);
    span.appendChild(text);
    link.appendChild(span);
  }
  if (listItem.id) {
    item.id = listItem.id;
  }
  UIkit.util.on(link, 'click', action);
};

let previousSelectedRoom = null;

function setActivePlace(place) {
  essential.content.setActivePlace({
    place
  });

  /*if (typeof place.setColor === 'function') {
    place.setColor('#fff');
  }*/

  requestAnimationFrame(() => {
    var p = {}

    if (essential.content.activePlaceID) {
      p = essential.content.places[essential.content.activePlaceID];
    }

    //console.log(p)
    let Rooms = JSON.parse(localStorage.getItem('ListRooms'))

    const myRoom = Rooms.find((element) => {
      return element.zone.mapwizeId === p.id
    });

    if (myRoom) {

      setRoomColor(myRoom);

    }else{

      essential.content.setPlaceColor({
        id: p.id,
        color: '#7fb4b0'
      });
    }

    allDefaultColorSall()
    setColorsalles(true)



    previousSelectedRoom = myRoom;

    let btnReservation = document.getElementById('btnReserver')
    let btnConstat = document.getElementById('btnConstat')
    let etatSall = document.getElementById('etatSalle')
    //console.log(myRoom)
    if(!myRoom){
      btnReservation.style.display = "none"
      btnConstat.style.display = "none"
      etatSall.style.display = "none"
    }else if(!myRoom.type.reservable || myRoom.reservationStatus.state !== 'available'){
      btnReservation.style.display = "none"
      etatSall.style.display = "none"
    }else{
      btnConstat.style.display = "block"
    }

    if(myRoom){
      if(myRoom.reservationStatus.state === 'available' && myRoom.occupation){
        etatSall.style.display = "block"
      }else{
        etatSall.style.display = "none"
      }
    }

    const pop = document.getElementById('my-pop-serv');
    const NameRoom = document.getElementById('NameRoom');
    const contentPop = document.getElementById('content-pop');



    if(localStorage.getItem('Action Carto') !== 'moving') {
      switch (localStorage.getItem('theme')){
        case 'red': contentPop.style.background = 'rgb(171, 49, 13)'
          break;
        case 'green':  contentPop.style.background = 'rgb(1, 62, 23)'
          break;
      }
      NameRoom.innerText = p.name
      //pop.style.background =

      if(myRoom){
        pop.style.display = 'flex';
      }else if(sallesObscures.includes(p.id)){
        pop.style.display = 'none';
      }else{
        pop.style.display = 'flex';
      }

    }


    let btnClose = document.getElementById('closeBottom')
    btnClose.addEventListener("click", () =>  {
      pop.style.display = 'none'
      localStorage.removeItem('Action Carto')
      btnReservation.style.display = 'block'
      btnConstat.style.display = 'block'
    });


    btnReservation.addEventListener("click", () =>  {
      pop.style.display = 'none'
      localStorage.setItem('IdSalleCarto', myRoom.id)
      localStorage.setItem('RoomToReserve', JSON.stringify(myRoom))
    });

    btnConstat.addEventListener("click", () =>  {
      pop.style.display = 'none'
      localStorage.setItem('IdSalleCartoConstat', myRoom.id)
    });

    const placeTitle = document.getElementById('placeTitle');
    const placeDescription = document.getElementById('placeDescription');
    if (essential.content.activePlace && essential.content.places[essential.content.activePlaceID]) {
      // if (essential.content.places[essential.content.activePlaceID]) {
      const placeContent = essential.content.places[essential.content.activePlaceID];
      let span = document.createElement('span');
      let text = document.createTextNode(placeContent.name || placeContent.id);
      span.appendChild(text);

      const mybuble = document.getElementById('mybuble');
      //mybuble.style.display = 'block';

      let btnDeplacer = document.getElementById('btnDeplacer')
      btnDeplacer.addEventListener("click", () =>  {
        pop.style.display = 'none'
        mybuble.style.display = 'block';
        localStorage.setItem('Action Carto', 'moving')
      });

      placeTitle.querySelectorAll('span').forEach(item => item.remove());
      let placeIcon = '';
      if (placeContent.icon) {
        placeIcon = placeContent.icon;
      } else if (!placeIcon && placeContent.categories.length > 0) {
        const category = essential.content.categories[placeContent.categories[0]];
        if (category.icon) {
          placeIcon = category.icon;
        }
      }
      if (placeIcon) {
        //document.getElementById('placeIcon').src = placeIcon;
      }
      placeTitle.appendChild(span);
      if (placeContent.description) {
        placeDescription.innerHTML = placeContent.description + ' ' + '- RESERVE';
        placeDescription.parentElement.style.display = '';
      } else {
        placeDescription.innerHTML = '';
        placeDescription.parentElement.style.display = 'none';
      }
    } else {
      let span = document.createElement('span');
      let text = document.createTextNode(essential.content.activePlaceID);
      span.appendChild(text);
      placeTitle.querySelectorAll('span').forEach(item => item.remove());
      placeTitle.appendChild(span);
      placeDescription.innerHTML = '';
      placeDescription.parentElement.style.display = 'none';
    }
    document.getElementById('routeFrom').disabled = essential.route.hasFrom();
    document.getElementById('routeTo').disabled = essential.route.hasTo();
  });
};

function setupProgress() {
  let progress = document.getElementById('loadProgress');
  essential.onLoadProgress = value => {
    progress.value = value;
    if (value === 1) {
      setTimeout(() => progress.style.display = 'none', 500);
    }
  };
};

function setupSelectors() {
  const venueLayout = essential.venue.layout;
  if (venueLayout.buildings.length > 0) {
    if (venueLayout.hasGlobalLayer) {
      UIkit.util.on('#global_button > a', 'click', () => essential.venue.goToGlobal());
    } else {
      document.querySelector('#global_button').style.display = 'none';
    }

    var currentBuildingElement = document.getElementById('buildingName');
    var buildingsElement = document.getElementById('buildings');
    var defaultBuilding = venueLayout.buildings[venueLayout.defaultBuildingIndex];
    currentBuildingElement.innerText = essential.venue.getLocalizedName({
      id: defaultBuilding.id
    });
    UIkit.util.on('#building_selector > a', 'click', () =>
      {
        essential.venue.goToBuilding({
          id: essential.venue.currentBuildingID
        })
      }
    );

    if (venueLayout.buildings.length > 1) {
      var buildingNames = _.mapValues(venueLayout.buildingByID, (building, id) => essential.venue.getLocalizedName({
        id
      }));
      const goToBuilding = id => essential.venue.goToBuilding({
        id
      });
      var listElement = buildingsElement.querySelector('ul');
      _.each(buildingNames, (name, id) => addListItem({
        id,
        name
      }, listElement, () => goToBuilding(id)));
    } else {
      buildingsElement.remove();
    }

    var currentFloorElement = document.getElementById('floorName');
    var floorsElement = document.getElementById('floors');

    /*
    ICI
     */
    UIkit.util.on('#floor_selector > a', 'click', () => essential.venue.goToFloor({
      id: essential.venue.currentFloorID
    }));
    var insertFloors = function (buildingID) {
      if (venueLayout.buildingByID[buildingID].floors.length > 1) {
        let bfloors = venueLayout.buildingByID[buildingID].floors;
        let sortedFloors = _.reverse(_.sortBy(venueLayout.buildingByID[buildingID].floors, 'levelIndex'));

        var floorNames = _.map(sortedFloors, floor => ({
          id: floor.id,
          name: essential.venue.getLocalizedName({
            id: floor.id
          })
        }));
        const liste2 = JSON.parse(localStorage.getItem("Etages"))

        const goToFloor = id => essential.venue.goToFloor({
          id
        });

        let rezDeChausse = floorNames[8]
        var listElement = floorsElement.querySelector('ul');
        floorNames = floorNames.filter(x => liste2.includes(x.name) /*x.name === 'Etage 1'*/);
        floorNames.push(rezDeChausse)

        var defaultFloor = defaultBuilding.floors[defaultBuilding.defaultFloorIndex];

        currentFloorElement.innerText = floorNames[floorNames.length-1].name //'REZ-DE-CHAUSSÉE';
        essential.venue.goToFloor({
          id: floorNames[floorNames.length-1].id //defaultFloor.id //'B1-UL37'
        });

        _.each(floorNames, ({
                              id,
                              name
                            }) => addListItem({
          id,
          name
        }, listElement, () => goToFloor(id)));
        floorsElement.style.display = '';
      } else {

        floorsElement.style.display = 'none';
      }
    };

    insertFloors(defaultBuilding.id);

    var globalIcon = document.querySelector('.uk-navbar .visio-global');
    var buildingIcon = document.querySelector('.uk-navbar .visio-building');
    var floorIcon = document.querySelector('.uk-navbar .visio-floor');
    essential.on('exploreStateWillChange', event => {
      const targetExploreState = event.args.target;
      const currentExploreState = event.args.current;

      const targetBuildingID = targetExploreState.buildingID;
      const currentBuildingID = currentExploreState.buildingID;
      if (targetBuildingID && currentBuildingID && targetBuildingID !== currentBuildingID) {
        currentBuildingElement.innerText = essential.venue.getLocalizedName({
          id: targetBuildingID
        });
        floorsElement.querySelectorAll('ul > li').forEach(item => item.remove());
        insertFloors(targetBuildingID);
      }

      const targetFloorID = targetExploreState.floorID;
      const currentFloorID = currentExploreState.floorID;
      if (targetFloorID && currentFloorID && targetFloorID !== currentFloorID) {
        currentFloorElement.innerText = essential.venue.getLocalizedName({
          id: targetFloorID
        });
      }

      switch (targetExploreState.mode) {
        case 'global':
          globalIcon.style.color = primary;
          buildingIcon.style.color = 'inherit';
          floorIcon.style.color = 'inherit';
          break;
        case 'building':
          globalIcon.style.color = 'inherit';
          buildingIcon.style.color = primary;
          floorIcon.style.color = 'inherit';
          break;
        case 'floor':
          globalIcon.style.color = 'inherit';
          buildingIcon.style.color = 'inherit';
          floorIcon.style.color = primary;
          break;
      }
    });
  } else {

    document.querySelector('#global_button').style.display = 'none';
    document.querySelector('#building_selector').style.display = 'none';
    document.querySelector('#floor_selector').style.display = 'none';
  }
};


function setupSearch() {
  let search = '';
  let categoryPlaces = Object.values(essential.content.places);
  let nameSalles = []
  salles.map((r) => {
    nameSalles.push(r.zone.mapwizeId.toLowerCase())
  })
  let oldCat =  categoryPlaces

  categoryPlaces = []
  oldCat.map((x) => {
    if(nameSalles.includes(x.id.toLowerCase())){
      categoryPlaces.push(x)
    }
  })


  //const categoriesTabNameElement = document.getElementById('categoriesTabName');
  const placesTabNameElement = document.getElementById('placesTabName');
  const resetCategoryButton = document.getElementById('resetCategory');
  const searchInput = document.getElementById('searchInput');

  //categoriesTabNameElement.innerText =  essential.parameters.locale.search.categories;
  placesTabNameElement.innerText = 'SALLES' //essential.parameters.locale.search.places;
  searchInput.placeholder = 'Rechercher une salle' //essential.parameters.locale.search.placeholder;

  let filterPlacesByCategoryID = categoryID => {
    categoryPlaces = _.filter(essential.content.places, place => place.categories.indexOf(categoryID) !== -1);
    updatePlaces();
  };

  let resetCategory = () => {
    categoryPlaces = Object.values(essential.content.places);
    let nameSalles = []
    salles.map((r) => {
      nameSalles.push(r.zone.mapwizeId.toLowerCase())
    })
    let oldCat =  categoryPlaces

    categoryPlaces = []
    oldCat.map((x) => {
      if(nameSalles.includes(x.id.toLowerCase())){
        categoryPlaces.push(x)
      }
    })

    updatePlaces();
    placesTabNameElement.innerText =  essential.parameters.locale.search.places;
    resetCategoryButton.style.display = 'none';
  };

  let closePanel = () => {
    UIkit.offcanvas('#searchPanel').hide();
    UIkit.tab('#searchTabs').show(1); //Pour choisir le tab actif par défaut dans menu search
    searchInput.value = '';
    search = '';
    updateCategories();
    resetCategory();
  };

  let clearSearch = () => {
    if (search !== '' && searchInput.value !== '') {
      searchInput.value = '';
      search = '';
      updateCategories();
      updatePlaces();
    }
  };

  UIkit.util.on('#closePanel', 'click', closePanel);
  UIkit.util.on('#resetCategory', 'click', resetCategory);
  UIkit.util.on('#clearSearch', 'click', clearSearch);

  let addCategories = categories => {
    let categoryListElement = document.getElementById('categoryList');
    categoryListElement.querySelectorAll('li').forEach(item => item.remove());
    _.each(categories, category => {
      const nbPlacesDetail = category.nbPlaces + ' ' +
        (category.nbPlaces > 1 ?
          essential.parameters.locale.search.places :
          essential.parameters.locale.search.place);
      let categoryItem = {
        id: category.id,
        name: category.name,
        icon: category.icon,
        detail: nbPlacesDetail
      };
      addListItem(categoryItem, categoryListElement, () => {
        filterPlacesByCategoryID(category.id);
        UIkit.tab('#searchTabs').show(1); //Pour choisir le tab actif par defaut dans menu search
        placesTabNameElement.innerText = category.name;
        resetCategoryButton.style.display = '';
      });
    });
  };

  let searchCategory = category => {
    const name = category.name.toLowerCase();
    const searchText = search.toLowerCase();
    return name.indexOf(searchText) > -1;
  };

  let updateCategories = () => addCategories(_.filter(essential.content.categories, searchCategory));

  const buildingNames = _.fromPairs(_.map(Object.keys(essential.venue.layout.buildingByID), buildingID => [
    buildingID,
    essential.venue.getLocalizedName({id:buildingID})
  ]));
  const floorNames = _.fromPairs(_.flatMap(essential.venue.layout.buildings, building => {
    return _.map(building.floors, floor => [
      floor.id,
      essential.venue.getLocalizedName({id:floor.id})
    ]);
  }));
  const buildingIDByFloorID = _.fromPairs(_.flatMap(essential.venue.layout.buildings, building => {
    return _.map(building.floors, floor => [
      floor.id,
      building.id
    ]);
  }));

  let addPlaces = places => {
    let placeListElement = document.getElementById('placeList');
    placeListElement.querySelectorAll('li').forEach(item => item.remove());
    _.each(places, place => {
      let placeItem = {
        id: place.id,
        name: place.name,
        icon: 'placeholder'
      };
      if (place.categories.length > 0) {
        const category = essential.content.categories[place.categories[0]];
        if (category.icon && category.icon !== '') {
          placeItem.icon = category.icon;
        }
      }
      const buildingName = buildingNames[buildingIDByFloorID[place.floor]];
      if (buildingName !== undefined && buildingName !== 'default') {
        placeItem.detail = buildingName + ' / ';
      }

      const floorName = floorNames[place.floor];
      if (floorName !== undefined) {
        placeItem.detail = (placeItem.detail || '') + floorName;
      }
      addListItem(placeItem, placeListElement, () => {
        essential.venue.goToPlace({id: place.id})
          .then(() => {
            setActivePlace(place.id);
            closePanel();
          });
      });
    });
  };

  let searchPlace = place => {
    const name = place.name.toLowerCase();
    const id = place.id.toLowerCase();
    const categoryNames = place.categories ? _.map(place.categories, categoryID => essential.content.categories[categoryID].name.toLowerCase()) : [];
    const searchText = search.toLowerCase();
    return id.indexOf(searchText) > -1 ||
      name.indexOf(searchText) > -1 ||
      categoryNames.some(categoryName => categoryName.indexOf(searchText) > -1);
  };

  let updatePlaces = () => addPlaces(_.filter(categoryPlaces, searchPlace));

  let update = () => {
    updateCategories();
    updatePlaces();
    if (document.querySelectorAll('#categoryList > li').length < 2) {
      UIkit.tab('#searchTabs').show(1);
    }
  };

  searchInput.addEventListener('input', _.debounce(e => {
    search = e.target.value;
    update();
  }, 500, {maxWait: 2000}));

  update();
};

function setupPlaceBubble() {

  const routeFromElement = document.getElementById('routeFrom');
  const routeToElement = document.getElementById('routeTo');
  // routeFromElement.innerText =  essential.parameters.locale.route.start;
  // routeToElement.innerText =  essential.parameters.locale.route.destination;
  routeFromElement.innerText = 'Départ';
  routeToElement.innerText = 'Arrivée';
  //console.log(essential.content.activePlaceID)

  UIkit.util.on('#routeFrom', 'click', () => {
    essential.route.setFrom({
      from: essential.content.activePlaceID
    });
    document.getElementById('routeFrom').disabled = true;
  });

  UIkit.util.on('#routeTo', 'click', () => {
    essential.route.setTo({
      to: essential.content.activePlaceID
    });
    document.getElementById('routeTo').disabled = true;
    mybuble.style.display = 'none';
  });

  UIkit.util.on('#closeBubble', 'click', () => {
    mybuble.style.display = 'none';
    localStorage.removeItem('Action Carto')
    essential.content.resetActivePlace()

  });

  // essential.content.placeBubbleEnabled = true;
  essential.onObjectMouseUp = ({targetElement}) => {
    setActivePlace(targetElement)
  };

  essential.onObjectMouseOver = ({targetElement}) => {
    //This prevents color from resetting to default
    //console.log(targetElement)
  };
};


function setupNavigation() {

  const prevInstructionElement = document.getElementById('prevInstruction');
  const nextInstructionElement = document.getElementById('nextInstruction');
  const clearRouteElement = document.getElementById('clearRoute');
  // prevInstructionElement.innerText =  essential.parameters.locale.route.previous;
  // prevInstructionElement.innerText =  'precedent';
  // nextInstructionElement.innerText =  essential.parameters.locale.route.next;
  // nextInstructionElement.innerText = 'suivant';
  // clearRouteElement.innerText =  essential.parameters.locale.route.clear;
  // clearRouteElement.innerText = 'supprimer la route';

  const instructionIcon = document.getElementById('instructionIcon');
  const instructionBrief = document.getElementById('instructionBrief');
  const instructionDetail = document.getElementById('instructionDetail');
  let updateInstructionData = () => {
    instructionIcon.src = essential.navigation.getCurrentInstructionIcon();
    instructionBrief.innerHTML = essential.navigation.getCurrentInstructionBrief();
    instructionDetail.innerHTML = essential.navigation.getCurrentInstructionDetail();
    document.getElementById('prevInstruction').disabled = (essential.navigation.currentInstructionIndex === 0);
    document.getElementById('nextInstruction').disabled = (essential.navigation.currentInstructionIndex === essential.navigation.nbInstructions - 1);
  };

  UIkit.util.on('#prevInstruction', 'click', () => {
    essential.navigation.goToPreviousInstruction();
    updateInstructionData();
  });

  UIkit.util.on('#nextInstruction', 'click', () => {
    essential.navigation.goToNextInstruction();
    updateInstructionData();
  });

  UIkit.util.on('#clearRoute', 'click', () => {
    document.getElementById('navigation').style.display = 'none';
    essential.route.clear();
    localStorage.removeItem('Action Carto')
  });

  essential.on('navigationComputed', () => {
    updateInstructionData();
    document.getElementById('navigation').style.display = '';
    document.getElementById('prevInstruction').style.display = essential.navigation.nbInstructions > 1 ? '' : 'none';
    document.getElementById('nextInstruction').style.display = essential.navigation.nbInstructions > 1 ? '' : 'none';
  });
};

function handleInitialParameters(initialParameters) {
  //console.log(initialParameters.place)
  if (initialParameters.place) {
    /* essential.venue.goToFloor({
       id: 'B1-UL37'
     });*/
    //console.log(initialParameters)
    essential.venue.goToPlace({
      id: initialParameters.place,
      animationDuration: 0
    });
  } else if (initialParameters.route) {
    /*essential.venue.goToFloor({
      id: 'B1-UL37'
    });*/
    if (initialParameters.route.from) {
      essential.route.setFrom({
        from: initialParameters.route.from
      });
    }
    if (initialParameters.route.to) {
      essential.route.setTo({
        to: initialParameters.route.to
      });
    }
  }
};
