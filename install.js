const installBtn = document.querySelector('.install-btn')
let defferredPrompt = null

window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault()
    defferredPrompt = event
    installBtn.classList.remove('hidden')
})

installBtn.addEventListener('click', event => {
    event.preventDefault()
    installBtn.classList.add('hidden')
    defferredPrompt.prompt()

    defferredPrompt.userChoice.then(choice => {
        console.log(choice)
    })
    defferredPrompt = null
})