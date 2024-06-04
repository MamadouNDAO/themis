/* globals _, UIkit, visioweb, VisioWebEssential */
var essential;

const primary = '#00c5eb';

window.addEventListener('load', init);
window.addEventListener('beforeunload', destroy);

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

    // loading a local bundle: application/data.bundles/com.visioglobe.sdk/visio.island
    // essential.setParameters({parameters: {baseURL: '../data.bundles/com.visioglobe.sdk/visio.island', hash: ''}});

    //essential.setParameters({parameters: {baseURL: '../data.bundles/data_test', hash: '', setPlaceNameOptions:{zoomScaleFactor:0.5} }});

    // loading a remote bundle: com.visioglobe.sdk/visio.island hosted on mapserver.visioglobe.com
    // essential.setParameters({parameters: {baseURL: 'https://mapserver.visioglobe.com/', hash: 'kd9426d8cb3f1c532f22b5bcbd325c280bd351feb'}});

    // loading your own map using a web hash. NB: default baseURL is 'https://mapserver.visioglobe.com/' so no need to set it unless your map is hosted somewhere else
    // essential.setParameters({parameters: {hash: 'your_map_hash'}});

    // or you could refer to your own domain if you want to host your own maps
    // essential.setParameters({parameters: {baseURL: 'https://your.domain.com/', hash: 'your_map_hash'}});
    // VisioWeb will then try to download your map's bundle from https://your.domain.com/your_map_hash/

    essential.setParameters({parameters: {locale: {language: navigator.language}}});

    const urlParameters = visioweb.Utils.getURLParameters();
    essential.setParameters({parameters: urlParameters});

    // logVisioWebEssentialTitle();

    setupProgress();

    essential.createMapviewer()
        .then(() => {
            logVisioWebTitle();
            setupNavigation();
            setupPlaceBubble();
            setupSelectors();
            setupSearch();

            if (urlParameters.initial) {
                handleInitialParameters(urlParameters.initial);
            }
        })
        .catch(e => { // eslint-disable-line
            console.log(e);
            console.log('Could not load map. Check your config or get in touch with Visioglobe team.'); // eslint-disable-line
        });
};

function destroy() {
    essential.off('exploreStateWillChange');
    essential.off('navigationComputed');
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

function setActivePlace(place) {
  alert('y')
    essential.content.setActivePlace({place});
    requestAnimationFrame(() => {
        const placeTitle = document.getElementById('placeTitle');
        const placeDescription = document.getElementById('placeDescription');
        if (essential.content.activePlace && essential.content.places[essential.content.activePlaceID]) {
            const placeContent = essential.content.places[essential.content.activePlaceID];
            let span = document.createElement('span');
            let text = document.createTextNode(placeContent.name || placeContent.id);
            span.appendChild(text);
            placeTitle.querySelectorAll('span').forEach(item => item.remove());
            let placeIcon = '';
            if (placeContent.icon) {
                placeIcon = placeContent.icon;
            }
            else if (!placeIcon && placeContent.categories.length > 0) {
                const category = essential.content.categories[placeContent.categories[0]];
                if (category.icon) {
                    placeIcon = category.icon;
                }
            }
            if (placeIcon) {
                document.getElementById('placeIcon').src = placeIcon;
            }
            placeTitle.appendChild(span);
            if (placeContent.description) {
                placeDescription.innerHTML = placeContent.description;
                placeDescription.parentElement.style.display = '';
            }
            else {
                placeDescription.innerHTML = '';
                placeDescription.parentElement.style.display = 'none';
            }
        }
        else {
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
}

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
        }
        else {
            document.querySelector('#global_button').style.display = 'none';
        }

        var currentBuildingElement = document.getElementById('buildingName');
        var buildingsElement = document.getElementById('buildings');
        var defaultBuilding = venueLayout.buildings[venueLayout.defaultBuildingIndex];
        currentBuildingElement.innerText = essential.venue.getLocalizedName({id: defaultBuilding.id});
        UIkit.util.on('#building_selector > a', 'click', () => essential.venue.goToBuilding({id: essential.venue.currentBuildingID}));

        if (venueLayout.buildings.length > 1) {
            var buildingNames = _.mapValues(venueLayout.buildingByID, (building, id) => essential.venue.getLocalizedName({id}));
            const goToBuilding = id => essential.venue.goToBuilding({id});
            var listElement = buildingsElement.querySelector('ul');
            _.each(buildingNames, (name, id) => addListItem({id, name}, listElement, () => goToBuilding(id)));
        }
        else {
            buildingsElement.remove();
        }

        var currentFloorElement = document.getElementById('floorName');
        var floorsElement = document.getElementById('floors');
        var defaultFloor = defaultBuilding.floors[defaultBuilding.defaultFloorIndex];
        currentFloorElement.innerText = essential.venue.getLocalizedName({id: defaultFloor.id});
        UIkit.util.on('#floor_selector > a', 'click', () => essential.venue.goToFloor({id: essential.venue.currentFloorID}));

        var insertFloors = function(buildingID) {
            if (venueLayout.buildingByID[buildingID].floors.length > 1) {
                let sortedFloors = _.reverse(_.sortBy(venueLayout.buildingByID[buildingID].floors, 'levelIndex'));
                var floorNames = _.map(sortedFloors, floor => ({
                    id: floor.id,
                    name: essential.venue.getLocalizedName({id: floor.id})
                }));
                const goToFloor = id => essential.venue.goToFloor({id});
                var listElement = floorsElement.querySelector('ul');
                _.each(floorNames, ({id, name}) => addListItem({id, name}, listElement, () => goToFloor(id)));
                floorsElement.style.display = '';
            }
            else {
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
                currentBuildingElement.innerText = essential.venue.getLocalizedName({id: targetBuildingID});
                floorsElement.querySelectorAll('ul > li').forEach(item => item.remove());
                insertFloors(targetBuildingID);
            }

            const targetFloorID = targetExploreState.floorID;
            const currentFloorID = currentExploreState.floorID;
            if (targetFloorID && currentFloorID && targetFloorID !== currentFloorID) {
                currentFloorElement.innerText = essential.venue.getLocalizedName({id: targetFloorID});
            }

            switch(targetExploreState.mode) {
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
    }
    else {
        document.querySelector('#global_button').style.display = 'none';
        document.querySelector('#building_selector').style.display = 'none';
        document.querySelector('#floor_selector').style.display = 'none';
    }
};

function setupSearch() {
    let search = '';
    let categoryPlaces = Object.values(essential.content.places);
    const categoriesTabNameElement = document.getElementById('categoriesTabName');
    const placesTabNameElement = document.getElementById('placesTabName');
    const resetCategoryButton = document.getElementById('resetCategory');
    const searchInput = document.getElementById('searchInput');

    categoriesTabNameElement.innerText =  essential.parameters.locale.search.categories;
    placesTabNameElement.innerText =  essential.parameters.locale.search.places;
    searchInput.placeholder = essential.parameters.locale.search.placeholder;

    let filterPlacesByCategoryID = categoryID => {
        categoryPlaces = _.filter(essential.content.places, place => place.categories.indexOf(categoryID) !== -1);
        updatePlaces();
    };

    let resetCategory = () => {
        categoryPlaces = Object.values(essential.content.places);
        updatePlaces();
        placesTabNameElement.innerText =  essential.parameters.locale.search.places;
        resetCategoryButton.style.display = 'none';
    };

    let closePanel = () => {
        UIkit.offcanvas('#searchPanel').hide();
        UIkit.tab('#searchTabs').show(0);
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
                UIkit.tab('#searchTabs').show(1);
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
    routeFromElement.innerText =  essential.parameters.locale.route.start;
    routeToElement.innerText =  essential.parameters.locale.route.destination;

    UIkit.util.on('#routeFrom', 'click', () => {
        essential.route.setFrom({from: essential.content.activePlaceID});
        document.getElementById('routeFrom').disabled = true;
    });
    UIkit.util.on('#routeTo', 'click', () => {
        essential.route.setTo({to: essential.content.activePlaceID});
        document.getElementById('routeTo').disabled = true;
    });
    UIkit.util.on('#closeBubble', 'click', () => essential.content.resetActivePlace());

    essential.content.placeBubbleEnabled = true;
    essential.onObjectMouseUp = ({targetElement}) => {
      console.log(targetElement);
      setActivePlace(targetElement)
    };
};

function setupNavigation() {
    const prevInstructionElement = document.getElementById('prevInstruction');
    const nextInstructionElement = document.getElementById('nextInstruction');
    const clearRouteElement = document.getElementById('clearRoute');
    prevInstructionElement.innerText =  essential.parameters.locale.route.previous;
    nextInstructionElement.innerText =  essential.parameters.locale.route.next;
    clearRouteElement.innerText =  essential.parameters.locale.route.clear;

    const instructionIcon = document.getElementById('instructionIcon');
    const instructionBrief = document.getElementById('instructionBrief');
    const instructionDetail = document.getElementById('instructionDetail');
    let updateInstructionData = () => {
        instructionIcon.src = essential.navigation.getCurrentInstructionIcon();
        instructionBrief.innerHTML = essential.navigation.getCurrentInstructionBrief();
        instructionDetail.innerHTML = essential.navigation.getCurrentInstructionDetail();
        document.getElementById('prevInstruction').disabled = (essential.navigation.currentInstructionIndex === 0);
        document.getElementById('nextInstruction').disabled = (essential.navigation.currentInstructionIndex === essential.navigation.nbInstructions-1);
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
    });

    essential.on('navigationComputed', () => {
        updateInstructionData();
        document.getElementById('navigation').style.display = '';
        document.getElementById('prevInstruction').style.display = essential.navigation.nbInstructions > 1 ? '' : 'none';
        document.getElementById('nextInstruction').style.display = essential.navigation.nbInstructions > 1 ? '' : 'none';
    });
};

function handleInitialParameters(initialParameters) {
    // here you can handle parameters passed in the URL
    // examples:
    // http://.../mapviewer.html?initial[place]=parking04
    // http://.../mapviewer.html?initial[route][from]=parking04&initial[route][to]=parking02

    if (initialParameters.place) {
        essential.venue.goToPlace({id: initialParameters.place, animationDuration:0});
    }
    else if (initialParameters.route) {
        if (initialParameters.route.from) {
            essential.route.setFrom({from: initialParameters.route.from});
        }
        if (initialParameters.route.to) {
            essential.route.setTo({to: initialParameters.route.to});
        }
    }
};
