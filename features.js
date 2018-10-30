/**
 * Principe d'innondation pour déterminer la coastline.
 * On part d'un coin (très faible proba d'être dans un lac), puis on innonde les voisins pour définir le type (ocean, lac)
 */
function generateFeatures(){

    let initPoints =[[0,0],[width_canvas,0],[0,height_canvas],[width_canvas,height_canvas]],
    startPoint = [0,0];
    initPoints.forEach(coord => {
        if(sites[delaunay.find(coord[0],coord[1])].height < 0.2){
            startPoint = [coord[0],coord[1]];
        }
    });

    let explorationPolygonIDQueue = new Array(),
    exploredPolygonID = new Array(),
    startpolygonID = delaunay.find(startPoint[0],startPoint[1]),
    type = 'Ocean',
    description;

    explorationPolygonIDQueue.push(startpolygonID);
    exploredPolygonID.push(startpolygonID);

    if(sites[startpolygonID].type === 'Ocean'){
        description = sites[startpolygonID].description;
    } else {
        description = adjectifs[Math.floor(Math.random() * adjectifs.length)];
    }
    sites[startpolygonID].type = type;
    sites[startpolygonID].description = description;

    while (explorationPolygonIDQueue.length > 0) {
        let exploredID = explorationPolygonIDQueue.shift();
        for (let neighborID of delaunay.neighbors(exploredID)) {
            if(exploredPolygonID.indexOf(neighborID) < 0 && sites[neighborID].height < 0.2){
                sites[neighborID].type = type;
                sites[neighborID].description = description;
                explorationPolygonIDQueue.push(neighborID);
                exploredPolygonID.push(neighborID);
            }
        }
    }

    let islandCounter = 1,
    lakeCounter = 1,
    numberID = 0,
    minHeight = 0,
    maxHeight = 0;

    let unmarked = new Array();
    for (let i = 0; i < sites.length; i++) {
        if(exploredPolygonID.indexOf(i) < 0 && (typeof sites[i].type === "undefined" || true) ){
            unmarked.push(i);
        }
        
    }

    while (unmarked.length > 0) {
        startpolygonID = unmarked[0];

        if(sites[startpolygonID].height >= 0.2){
            type = "Island";
            numberID = islandCounter;
            islandCounter += 1;
            minHeight = 0.2;
            maxHeight = 10;
        } else {
            type = "Lake";
            numberID = lakeCounter;
            lakeCounter += 1;
            minHeight = -10;
            maxHeight = 0.2;
        }

        if(sites[startpolygonID].description && sites[startpolygonID].type == type){
            description = sites[startpolygonID].description;
        }
        else {
            description = adjectifs[Math.floor(Math.random() * adjectifs.length)];
        }
        sites[startpolygonID].type = type;
        sites[startpolygonID].description = description;
        sites[startpolygonID].number = numberID;

        explorationPolygonIDQueue.push(startpolygonID);
        exploredPolygonID.push(startpolygonID);
        while (explorationPolygonIDQueue.length > 0) {
            let exploredID = explorationPolygonIDQueue.shift();
            for (let neighborID of delaunay.neighbors(exploredID)) {
                if(exploredPolygonID.indexOf(neighborID) < 0 && sites[neighborID].height < maxHeight && sites[neighborID].height >= minHeight){
                    sites[neighborID].type = type;
                    sites[neighborID].description = description;
                    sites[neighborID].number = numberID;
                    explorationPolygonIDQueue.push(neighborID);
                    exploredPolygonID.push(neighborID);
                }
            }
        }
        unmarked = new Array();
        for (let i = 0; i < sites.length; i++) {
            if(exploredPolygonID.indexOf(i) < 0 && (typeof sites[i].type === "undefined" || true)){
                unmarked.push(i);
            }
        }

    }

}