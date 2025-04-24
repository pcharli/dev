//définition des icones
const iconPosition = L.icon({
    iconUrl: 'icons/icon-map-user-location.svg',
    iconSize: [53, 53],
    iconAnchor: [16, 55],
    popupAnchor: [10,-37]
})

const iconStop = L.icon({
    iconUrl: 'icons/icon-map-bus-stop.svg',
    iconSize: [53, 53],
    iconAnchor: [16, 55],
    popupAnchor: [10,-37]
})

const iconStart = L.icon({
    iconUrl: 'icons/icon-map-bus-start.svg',
    iconSize: [53, 53],
    iconAnchor: [16, 55],
    popupAnchor: [10,-37]
})

const iconEnd = L.icon({
    iconUrl: 'icons/icon-map-bus-end.svg',
    iconSize: [53, 53],
    iconAnchor: [16, 55],
    popupAnchor: [10,-37]
})

//stock de la carte
let  map = null
//stock du layer pour les markers après click de souris sur la carte
let stopsLayer = null 

//initialisation de la carte
const initMap = () => {
    //console.log('initMap', myPosition)
    // cicle de la div id="map" dans le code HTML
    const $map = document.querySelector('#map')
    //création de la carte ciblée sur la position de l'utilisateur
    map = L.map('map').setView([myPosition.latitude, myPosition.longitude], 17);
    //L.tileLayer('http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', { 
    L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', { //ajoute un fond de carte
        maxZoom: 19,
        attribution: 'Cepegra'
    }).addTo(map);
    //ajout d'un calque à la carte et stockage du calque dans la vaiable
    stopsLayer = L.layerGroup().addTo(map)
    //ajout de la légende
    L.control.scale({imperial: false, updateWhenIdle: true}).addTo(map);
    //options pour le marker positionnant l'utilisateur
    const optionsMarker = {
        title: "Vous êtes ici",
        icon: iconPosition
      }
      //ajout du marker user sur la carte en utilisant ses optionss
    L.marker([myPosition.latitude, myPosition.longitude], optionsMarker).addTo(map)
    
    //appel des arrêts de bus en passant : la carte, la position user et le fait qu'on est au début
    affStops(map, myPosition, true)
    
 
    //click sur la carte
    map.on('click', function(e) {
        //récup des coordonnées du point cliqué
        const clickedLatLng = e.latlng;
        const clickedPosition = {
            latitude: clickedLatLng.lat,
            longitude: clickedLatLng.lng
        };
    
        // Supprimer les anciens marqueurs du calque
        stopsLayer.clearLayers();
    
        // création d'un nouveau marqueur à l'endroit cliqué s
        let marker = L.marker([clickedPosition.latitude, clickedPosition.longitude])
            .bindPopup("Arrêts proches ici")
            .openPopup();
           //ajout ce marker sur le calque
            stopsLayer.addLayer(marker)
    
        // Afficher les arrêts autour du point cliqué
        affStops(map, clickedPosition)
    })
}
//récupère les arrêts via api des tec et les affiche. Paramètre start pour savoir si arrêts affiché sur la map ou sur le layer
const affStops = (map,position, start = false) => {
    //console.log('affStops',position)
    // rayon autour du point ciblé
    const distance = 1
    
    //requête sur l'api des Tec en passant une position et une distance
   fetch(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/poteaux-tec/records?where=within_distance(geo_point_2d%2C%20geom%27POINT(${position.longitude}%20${position.latitude})%27%2C%20${distance}km)&limit=20&lang=fr`)
   .then(resp => resp.json()) //traitement du json
   .then(resp => {
        console.log(resp) 
        //si pas de bus    
        if(resp.total_count == 0) {
            alert('Pas de bus autour de vous.')
        }   
        //si bus, boucler les arrêts de bus
        resp.results.forEach(stop => {
            //deconstruction de l'objet, génère variables lat, lon et pot_nom_ha
           const {lat, lon} = stop.geo_point_2d
           const {pot_nom_ha, pot_id } = stop
            //créer un marker qui utilise ces variables
             let marker = L.marker([lat-0.000617, lon+0.0011], {icon:iconStop})
                .on('click', event => {
                    getBus(pot_id, marker, pot_nom_ha)
                })
             //si on n'est pas au début (start = false), on ajoute le marker au layer
             if (start == false) {
                stopsLayer.addLayer(marker)
            } else { //si on est au début, on ajout le marker à la carte
                marker.addTo(map)
            }
        })

    })
   .catch(err => {
       console.log(err)//si la requête ne fonctionne pas
       alert('Erreur serveur')
   })
}


const getBus =  (pot_id, marker,pot_nom_ha) => {
     fetch(`https://cepegra-frontend.xyz/bootcamp/stops/${pot_id}`)
    .then(resp => resp.json())
    .then(resp => {
        console.log(resp)
        let template = `
        <p><strong>${pot_nom_ha}</strong></p>
        `
        if(resp.code == "ok" && resp.nbhits > 0) { 
            resp.content.forEach(line => {
                template += `<p><a href="">${line.route_short_name} - ${line.route_long_name}</a></p>`
            })
        } else {
            template += `<p class="error">Pas de bus</p>`
        }
        marker.bindPopup(template).openPopup()
    })
    .catch(err => {
        console.log(err)
        alert('Erreur serveur')
    })
}