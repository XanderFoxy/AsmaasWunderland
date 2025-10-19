// Funktion zum Warten auf das Laden aller Ressourcen (Bilder)
function waitForAllResources() {
    // Sammelt alle Bild-Elemente, die geladen werden müssen
    const elements = document.querySelectorAll('#bild-container img');
    const promises = [];

    elements.forEach(el => {
        // Nur fortfahren, wenn das Element noch nicht komplett geladen ist
        if (!el.complete) {
            promises.push(new Promise(resolve => {
                el.onload = resolve;
                el.onerror = resolve; // Fehler lösen das Warten auf, um Blockaden zu vermeiden
            }));
        }
    });

    // Fängt den Fall ab, wenn kein Warten nötig ist (alles geladen)
    if (promises.length === 0) {
        // Warte eine Mindestzeit, damit die Animation sichtbar ist (500ms)
        return new Promise(resolve => setTimeout(resolve, 500)); 
    }

    // Warten auf alle Promises
    return Promise.all(promises);
}

// Funktion für die animierten Punkte
function startLoadingAnimation() {
    const dots = document.querySelectorAll('#dots-container .dot');
    let currentIndex = 0;
    
    // Setzt ein Intervall für die Punkt-Animation
    const interval = setInterval(() => {
        // Alle Punkte verbergen
        dots.forEach(dot => dot.style.opacity = '0');
        
        // Den aktuellen Punkt einblenden
        dots[currentIndex].style.opacity = '1';
        
        // Zum nächsten Punkt wechseln (0 -> 1 -> 2 -> 0 -> ...)
        currentIndex = (currentIndex + 1) % dots.length;
    }, 400); // 400ms Verzögerung zwischen den Punkten

    return interval; 
}

// Funktion zum Verbergen des Preloaders
function hidePreloader(animationInterval) {
    clearInterval(animationInterval); // Stoppt die Punkt-Animation
    const preloader = document.getElementById('preloader');
    
    // Setzt das CSS auf 0, um die Ausblend-Animation (Transition) zu starten
    preloader.style.opacity = '0';
    
    // Nach dem Ausblenden (1s transition im CSS) das Element endgültig deaktivieren
    setTimeout(() => {
        preloader.style.display = 'none';
        preloader.style.pointerEvents = 'none'; // Gibt Interaktionen mit dem Bild frei
    }, 1000); 
}

// Hauptlogik, die beim Laden der Seite startet
document.addEventListener('DOMContentLoaded', () => {
    // 1. Animation starten
    const animation = startLoadingAnimation();

    // 2. Warten, bis alle Inhalte geladen sind
    waitForAllResources().then(() => {
        // 3. Preloader verbergen
        hidePreloader(animation);
    });
});
