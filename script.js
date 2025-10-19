// Funktion zum Überwachen des Ladefortschritts
function trackLoadingProgress() {
    const images = document.querySelectorAll('#bild-container img');
    const loadingBar = document.getElementById('loading-bar');
    let loadedCount = 0;
    const totalCount = images.length;

    // Nur fortfahren, wenn es Bilder gibt
    if (totalCount === 0) {
        return Promise.resolve();
    }
    
    // Funktion zum Aktualisieren des Ladebalkens
    const updateProgress = () => {
        const progress = (loadedCount / totalCount) * 100;
        loadingBar.style.width = progress + '%';
    };

    const promises = [];

    images.forEach(img => {
        // Nur fortfahren, wenn das Bild noch nicht komplett geladen ist
        if (!img.complete) {
            promises.push(new Promise(resolve => {
                const onLoadOrError = () => {
                    loadedCount++;
                    updateProgress();
                    resolve();
                };
                img.onload = onLoadOrError;
                img.onerror = onLoadOrError; // Fehler zählen auch als "erledigt"
            }));
        } else {
            // Bilder, die bereits im Cache sind, müssen trotzdem gezählt werden
            loadedCount++;
            updateProgress();
        }
    });

    // Wenn alle Bilder schon geladen waren (promises.length ist 0), 
    // muss die Ladebalken-Breite manuell auf 100% gesetzt werden und eine minimale Wartezeit eingehalten werden.
    if (promises.length === 0 && totalCount > 0) {
        loadingBar.style.width = '100%';
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    // Warten auf alle Promises
    return Promise.all(promises);
}

// Funktion zum Starten der Zoom-Animation
function startZoomAnimation() {
    const bildContainer = document.getElementById('bild-container');
    // Fügt die CSS-Klasse hinzu, die den Endpunkt der Transformation definiert (scale(1.2))
    // Die im CSS definierte 'transition' sorgt für die weiche Animation
    bildContainer.classList.add('zoom-in');
}

// Funktion zum Verbergen des Preloaders und Starten der Zoom-Animation
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    
    // Zoom-Animation starten, bevor der Preloader ausgeblendet wird, 
    // damit der Zoom im Hintergrund beginnt.
    startZoomAnimation();
    
    // Sanftes Ausblenden des Preloaders
    preloader.style.opacity = '0';
    
    // Nach dem Ausblenden das Element endgültig deaktivieren
    setTimeout(() => {
        preloader.style.display = 'none';
        preloader.style.pointerEvents = 'none'; // Gibt Interaktionen mit dem Bild frei
    }, 1500); // Entspricht der Transition-Dauer im CSS
}

// Hauptlogik, die beim Laden der Seite startet
document.addEventListener('DOMContentLoaded', () => {
    // 1. Warten, bis alle Inhalte geladen sind (und Ladebalken aktualisieren)
    trackLoadingProgress().then(() => {
        // 2. Preloader verbergen und Zoom-Animation starten
        hidePreloader();
    });
});
