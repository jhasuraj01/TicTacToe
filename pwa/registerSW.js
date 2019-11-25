let registerSW = () => {
    // first check if service worker is supported in the browser
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('../serviceworker2.js', { scope: '/TicTacToe/' })
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.log('Service Worker Registeration error: ' + err));
    }
}
window.addEventListener('load', registerSW);
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('APP installation prompt will be called')
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can add to home screen
    showInstallPromotion();
});