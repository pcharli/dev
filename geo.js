// récupèrera ma position, pardéfaut : Delta à Bxl
const myPosition = {
    latitude: 50.818463,
    longitude:4.403008
}

//options pour la géolocalisation de l'user
const options = {
    enableHighAccuracy: true, //précision max
    timeout: 5000, //durée d'attente max
    maximumAge: 0 // efface le cache éventuel
}
const init = () => {
    //quel est l'état actuelle des droits
    navigator.permissions.query({name:"geolocation"})
    .then(response => {
        //console.log(response.state)
        /* a-t-on déjà les droits ?  */
        if(response.state === 'granted') {
            //console.log('active')
            // géolocalisation de l'user
            navigator.geolocation.getCurrentPosition(okPosition, errorPosition, options)
            //si pas les droits mais demande autorisée
        } else if(response.state === 'prompt') {
            //console.log('demande')
            /* demande des droits et géolocalisation de l'user :
            - si ok => appel de la fonction okPosition
            - si pas ok => appel de la fonction errorPosition
            */
            navigator.geolocation.getCurrentPosition(okPosition, errorPosition, options)
        // si bloqué
        } else {
            //console.log('bloqué')
            initMap()
        }
    })
}
//si géolocalisation ok
const okPosition = (position) => {
    //définition d'un objet avec ma position
    myPosition.latitude =  position.coords.latitude
    myPosition.longitude =  position.coords.longitude
   //console.log(myPosition)
   //déclenche la carte
   initMap()
}
//si error de gelocalisation
const errorPosition = () => {
    //console.log('erreur de position')
    initMap()
}
init()

/* Cepegra
50.471117, 4.468500

*/