// Funktion zum Überwachen des Ladefortschritts
function trackLoadingProgress() {
    // Bezieht alle Bilder im Bild-Container mit ein
    const images = document.querySelectorAll('#bild-container img');
    const loadingBar = document.getElementById('loading-bar');
    let loadedCount = 0;
    const totalCount = images.length;

    // Mindestwartezeit, selbst wenn alles sofort im Cache ist (für sichtbaren Ladebalken)
    const MIN_WAIT_TIME = 800;
    const startTime = Date.now();

    // Nur fortfahren, wenn es Bilder gibt
    if (totalCount === 0) {
        // Warte die Mindestzeit, bevor aufgelöst wird
        return new Promise(resolve => setTimeout(resolve, MIN_WAIT_TIME));
    }
    
    // Funktion zum Aktualisieren des Ladebalkens
    const updateProgress = () => {
        const progress = (loadedCount / totalCount) * 100;
        loadingBar.style.width = progress + '%';
    };

    const promises = [];

    images.forEach(img => {
        if (!img.complete) {
            promises.push(new Promise(resolve => {
                const onLoadOrError = () => {
                    loadedCount++;
                    updateProgress();
                    resolve();
                };
                img.onload = onLoadOrError;
                img.onerror = onLoadOrError; 
            }));
        } else {
            // Bereits geladene Bilder müssen trotzdem gezählt werden
            loadedCount++;
            updateProgress();
        }
    });

    // Kombinierter Promise: Alle Ressourcen geladen UND Mindestzeit abgelaufen
    return Promise.all([
        Promise.all(promises),
        new Promise(resolve => {
            const timeElapsed = Date.now() - startTime;
            const remainingTime = MIN_WAIT_TIME - timeElapsed;
            setTimeout(resolve, Math.max(0, remainingTime));
        })
    ]);
}

// Funktion zum Starten der Zoom-Animation
function startZoomAnimation() {
    const bildContainer = document.getElementById('bild-container');
    // Fügt die CSS-Klasse hinzu, die den Endpunkt der Transformation definiert (scale(1.2))
    bildContainer.classList.add('zoom-in');
}

// Funktion zum Verbergen des Preloaders und Starten der Zoom-Animation
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    const bildContainer = document.getElementById('bild-container'); // NEU: Bild-Container holen
    
    // 1. Sanftes Ausblenden des Preloaders
    preloader.style.opacity = '0';
    
    // 2. Startet den Zoom kurz NACHDEM die Transparenz-Animation beginnt. 
    // Eine 100ms Verzögerung stellt sicher, dass der Browser den Startzustand registriert.
    setTimeout(startZoomAnimation, 100);
    
    // 3. Nach dem Ausblenden das Element endgültig deaktivieren
    // (Transition-Dauer ist 1.5s im CSS)
    setTimeout(() => {
        preloader.style.display = 'none';
        preloader.style.pointerEvents = 'none'; 
        
        // NEU: Bild-Container jetzt sichtbar machen!
        bildContainer.style.visibility = 'visible';
        
    }, 1500); 
}

// Hauptlogik, die beim Laden der Seite startet
document.addEventListener('DOMContentLoaded', () => {
    // 1. Warten, bis alle Inhalte geladen sind (und Ladebalken aktualisieren)
    trackLoadingProgress().then(() => {
        // 2. Preloader verbergen und Zoom-Animation starten
        hidePreloader();
    });
});
