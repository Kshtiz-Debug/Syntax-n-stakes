/* ===== Travelyx — Main Script ===== */

// ===== AUTH CHECK =====
(function checkAuth() {
    const user = JSON.parse(localStorage.getItem('travelyx_user') || 'null');
    if (!user || !user.loggedIn) { window.location.href = 'login.html'; return; }
    document.addEventListener('DOMContentLoaded', () => {
        const nameEl = document.getElementById('userNameDisplay');
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        if (nameEl) nameEl.textContent = user.firstName || user.name || 'Traveler';
        if (profileName) profileName.textContent = user.name || 'Traveler';
        if (profileEmail) profileEmail.textContent = user.email || '';
    });
})();

document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('travelyx_user');
    window.location.href = 'login.html';
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNav();
});

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu?.classList.toggle('active');
});
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('active');
}));

function updateActiveNav() {
    const scrollPos = window.scrollY + 200;
    document.querySelectorAll('section[id]').forEach(sec => {
        const top = sec.offsetTop, h = sec.offsetHeight, id = sec.id;
        const link = document.querySelector(`.nav-link[data-section="${id}"]`);
        if (link) link.classList.toggle('active', scrollPos >= top && scrollPos < top + h);
    });
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section-header,.dest-card,.timeline-item,.feed-post,.wishlist-card,.profile-card,.globe-info-card,.globe-legend').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !e.target.dataset.done) {
                e.target.dataset.done = '1';
                const target = +e.target.dataset.target;
                let cur = 0; const step = target / 60;
                const timer = setInterval(() => {
                    cur += step;
                    if (cur >= target) { cur = target; clearInterval(timer); }
                    e.target.textContent = cur >= 1000 ? Math.floor(cur).toLocaleString() : Math.floor(cur);
                }, 30);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-target]').forEach(c => obs.observe(c));
}
animateCounters();

// ===== DESTINATION MODAL =====
const destData = {
    santorini: { title: 'Aegean Paradise', loc: 'Santorini, Greece', desc: 'Perched on volcanic cliffs, Santorini\'s white buildings and blue domes create one of the world\'s most iconic views. Watch legendary sunsets from Oia, explore Akrotiri ruins, and sail the caldera.', temp: '24°C Avg', time: 'Best: Apr-Oct', lang: 'Greek', img: 'images/santorini.png' },
    tokyo: { title: 'Neon Metropolis', loc: 'Tokyo, Japan', desc: 'Where ancient temples stand beside soaring skyscrapers. From serene Meiji Shrine to electric Shibuya, Tokyo fuses tradition with innovation like nowhere else on Earth.', temp: '16°C Avg', time: 'Best: Mar-May', lang: 'Japanese', img: 'images/tokyo.png' },
    machupicchu: { title: 'Lost City of the Incas', loc: 'Cusco, Peru', desc: 'High in the Andes, this 15th-century Incan citadel remains one of the world\'s most breathtaking archaeological sites. Trek the Inca Trail for an unforgettable arrival.', temp: '18°C Avg', time: 'Best: May-Sep', lang: 'Spanish', img: 'images/machu_picchu.png' },
    iceland: { title: 'Aurora Wonderland', loc: 'Reykjavik, Iceland', desc: 'A land of fire and ice. Witness Northern Lights, soak in the Blue Lagoon, explore ice caves, and drive the Ring Road through otherworldly landscapes.', temp: '2°C Avg', time: 'Best: Sep-Mar', lang: 'Icelandic', img: 'images/iceland.png' },
    maldives: { title: 'Turquoise Paradise', loc: 'Malé, Maldives', desc: '1,192 coral islands in the Indian Ocean. Stay in overwater villas, snorkel with manta rays, and relax on pristine white sand beaches under swaying palms.', temp: '30°C Avg', time: 'Best: Nov-Apr', lang: 'Dhivehi', img: 'images/maldives.png' },
    dubai: { title: 'Desert Futurism', loc: 'Dubai, UAE', desc: 'From the world\'s tallest building to man-made islands, Dubai pushes imagination. Luxury shopping, desert safaris, futuristic architecture, and world-class dining.', temp: '34°C Avg', time: 'Best: Nov-Mar', lang: 'Arabic', img: 'images/dubai.png' }
};

function openDestModal(key) {
    const d = destData[key]; if (!d) return;
    document.getElementById('modalTitle').textContent = d.title;
    document.getElementById('modalLoc').innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + d.loc;
    document.getElementById('modalDesc').textContent = d.desc;
    document.getElementById('modalTemp').textContent = d.temp;
    document.getElementById('modalTime').textContent = d.time;
    document.getElementById('modalLang').textContent = d.lang;
    document.getElementById('modalImg').style.backgroundImage = 'url(' + d.img + ')';
    document.getElementById('destModal').classList.add('active');
}
window.openDestModal = openDestModal;

function closeDestModal() { document.getElementById('destModal')?.classList.remove('active'); }
window.closeDestModal = closeDestModal;

document.getElementById('destModal')?.addEventListener('click', e => { if (e.target.id === 'destModal') closeDestModal(); });

// ===== LIKE TOGGLE =====
function toggleLike(btn) {
    btn.classList.toggle('liked');
    const icon = btn.querySelector('i');
    const span = btn.querySelector('span');
    if (btn.classList.contains('liked')) {
        icon.classList.replace('far', 'fas');
        span.textContent = parseInt(span.textContent) + 1;
    } else {
        icon.classList.replace('fas', 'far');
        span.textContent = parseInt(span.textContent) - 1;
    }
}
window.toggleLike = toggleLike;

// ===== PUBLISH POST =====
function publishPost() {
    const input = document.getElementById('newPostInput');
    const text = input?.value.trim();
    if (!text) return;
    const user = JSON.parse(localStorage.getItem('travelyx_user') || '{}');
    const feed = document.getElementById('communityFeed');
    const post = document.createElement('div');
    post.className = 'feed-post card reveal visible';
    post.innerHTML = `
        <div class="post-header"><div class="post-avatar-img" style="background:var(--gradient);"><i class="fas fa-user"></i></div><div class="post-user-info"><strong>${user.name || 'You'}</strong><span>Just now</span></div></div>
        <p class="post-text">${text}</p>
        <div class="post-reactions"><button class="react-btn" onclick="toggleLike(this)"><i class="far fa-heart"></i> <span>0</span></button><button class="react-btn"><i class="far fa-comment"></i> <span>0</span></button><button class="react-btn"><i class="far fa-share-square"></i> <span>Share</span></button></div>
    `;
    feed?.insertBefore(post, feed.firstChild);
    input.value = '';
}
window.publishPost = publishPost;

// ===== WISHLIST =====
function addWishlistItem() {
    const input = document.getElementById('wishlistInput');
    const text = input?.value.trim();
    if (!text) return;
    const grid = document.getElementById('wishlistGrid');
    const icons = ['fa-map-marker-alt', 'fa-globe', 'fa-mountain', 'fa-umbrella-beach', 'fa-city'];
    const colors = ['#4facfe,#0077b6', '#ff9e6d,#ff7eb3', '#a8edea,#90e0ef', '#d9d4ff,#7c6fff', '#4facfe,#a8edea'];
    const i = Math.floor(Math.random() * icons.length);
    const card = document.createElement('div');
    card.className = 'wishlist-card card reveal visible';
    card.innerHTML = `<div class="wishlist-icon" style="background:linear-gradient(135deg,${colors[i]});"><i class="fas ${icons[i]}"></i></div><div class="wishlist-info"><h4>${text}</h4><p>Added to your dream list</p></div><button class="wishlist-remove" onclick="this.closest('.wishlist-card').remove()"><i class="fas fa-times"></i></button>`;
    grid?.appendChild(card);
    input.value = '';
}
window.addWishlistItem = addWishlistItem;

// ===== 3D GLOBE WITH REAL CONTINENTS =====
function createEarthTexture() {
    const c = document.createElement('canvas');
    c.width = 2048; c.height = 1024;
    const ctx = c.getContext('2d');

    // Ocean gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, c.height);
    oceanGrad.addColorStop(0, '#d6eeff');
    oceanGrad.addColorStop(0.3, '#c2e3fb');
    oceanGrad.addColorStop(0.5, '#b8def8');
    oceanGrad.addColorStop(0.7, '#c2e3fb');
    oceanGrad.addColorStop(1, '#d6eeff');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, c.width, c.height);

    // Lat/lng to pixel
    function toXY(lat, lng) {
        return [(lng + 180) / 360 * c.width, (90 - lat) / 180 * c.height];
    }

    function drawContinent(points, fill, stroke) {
        ctx.beginPath();
        const [sx, sy] = toXY(points[0][0], points[0][1]);
        ctx.moveTo(sx, sy);
        for (let i = 1; i < points.length; i++) {
            const [x, y] = toXY(points[i][0], points[i][1]);
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
    }

    const land = '#a8dda0';
    const landDark = '#8cc584';
    const border = '#7ab872';

    // North America
    drawContinent([
        [70, -165], [72, -130], [70, -100], [60, -95], [55, -80], [50, -65], [45, -55], [42, -65], [35, -75], [28, -80],
        [25, -82], [25, -90], [20, -105], [18, -105], [15, -92], [15, -88], [10, -84], [8, -77], [10, -75], [8, -77],
        [15, -88], [20, -87], [22, -98], [20, -105], [30, -115], [32, -117], [38, -123], [48, -125], [55, -133], [58, -140],
        [60, -147], [62, -152], [65, -168], [70, -165]
    ], land, border);

    // South America
    drawContinent([
        [12, -72], [10, -75], [8, -77], [5, -77], [2, -80], [-5, -81], [-6, -77], [-15, -75], [-18, -70], [-23, -70],
        [-30, -72], [-38, -68], [-45, -65], [-52, -70], [-55, -68], [-55, -64], [-50, -60], [-45, -58], [-40, -55],
        [-35, -55], [-30, -50], [-25, -47], [-22, -40], [-15, -39], [-10, -37], [-5, -35], [0, -50], [5, -60], [8, -63], [10, -67], [12, -72]
    ], land, border);

    // Europe
    drawContinent([
        [72, 20], [70, 30], [65, 30], [60, 30], [55, 28], [50, 25], [48, 17], [46, 15], [43, 12], [42, 3], [43, -5], [44, -9],
        [37, -9], [36, -6], [38, 0], [40, 5], [38, 12], [38, 24], [35, 25], [35, 28], [37, 28], [40, 26], [42, 28], [42, 30],
        [45, 30], [48, 35], [50, 40], [55, 35], [57, 38], [60, 32], [65, 25], [68, 28], [70, 28], [72, 20]
    ], landDark, border);

    // Africa
    drawContinent([
        [37, -9], [36, -6], [35, -1], [33, 10], [30, 10], [25, 35], [20, 38], [15, 42], [12, 44], [10, 42], [5, 42], [0, 42],
        [-5, 40], [-10, 40], [-15, 42], [-20, 35], [-25, 35], [-30, 32], [-35, 28], [-35, 20], [-30, 17], [-25, 15],
        [-20, 12], [-15, 12], [-10, 14], [-5, 10], [0, 10], [5, 2], [5, -5], [8, -5], [10, -10], [15, -17], [20, -17],
        [25, -15], [30, -10], [33, -8], [35, -5], [37, -9]
    ], '#c4dba0', border);

    // Asia (simplified)
    drawContinent([
        [72, 30], [75, 60], [75, 90], [72, 120], [70, 140], [65, 160], [60, 163], [55, 160], [50, 142], [45, 135], [40, 130],
        [35, 130], [30, 120], [25, 120], [22, 115], [20, 110], [15, 108], [10, 105], [8, 100], [5, 103], [0, 105], [-5, 105],
        [-8, 110], [-8, 115], [-5, 120], [0, 120], [5, 118], [8, 108], [10, 100], [15, 100], [20, 95], [22, 90], [20, 85],
        [22, 70], [25, 65], [25, 60], [30, 50], [32, 48], [35, 35], [38, 28], [40, 28], [42, 45], [45, 50], [50, 55], [55, 60],
        [60, 60], [65, 50], [68, 45], [70, 40], [72, 30]
    ], '#b5d8a5', border);

    // Australia
    drawContinent([
        [-12, 130], [-15, 132], [-18, 140], [-20, 148], [-25, 153], [-30, 153], [-35, 150], [-38, 145], [-38, 140],
        [-35, 137], [-35, 135], [-30, 130], [-28, 115], [-25, 114], [-20, 118], [-15, 125], [-12, 130]
    ], '#c1dea8', border);

    // Greenland
    drawContinent([
        [84, -30], [82, -20], [78, -18], [75, -20], [72, -22], [70, -25], [68, -30], [68, -40], [70, -50], [73, -55],
        [76, -60], [78, -65], [80, -60], [82, -50], [83, -40], [84, -30]
    ], '#ddeedd', border);

    // Grid lines (latitude/longitude)
    ctx.strokeStyle = 'rgba(79,172,254,0.08)';
    ctx.lineWidth = 1;
    for (let lat = -80; lat <= 80; lat += 20) {
        ctx.beginPath();
        const y = (90 - lat) / 180 * c.height;
        ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke();
    }
    for (let lng = -180; lng <= 180; lng += 30) {
        ctx.beginPath();
        const x = (lng + 180) / 360 * c.width;
        ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke();
    }

    return new THREE.CanvasTexture(c);
}

function initGlobe() {
    const canvas = document.getElementById('globeCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const w = canvas.clientWidth || 500, h = canvas.clientHeight || 500;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 2.8;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Custom Cursor Logic
    const gCursor = document.getElementById('globeCursor');
    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        if (gCursor) {
            gCursor.style.left = `${e.clientX}px`;
            gCursor.style.top = `${e.clientY}px`;
        }
    });

    // Earth texture
    const earthTex = createEarthTexture();

    // Globe with continent texture
    const globeGeo = new THREE.SphereGeometry(1, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
        map: earthTex,
        shininess: 15,
        specular: new THREE.Color(0xc8e6ff),
        transparent: false
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Subtle wireframe overlay
    const wireGeo = new THREE.SphereGeometry(1.004, 48, 48);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x4facfe, wireframe: true, transparent: true, opacity: 0.04 });
    const wireframe = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireframe);

    // Atmosphere glow
    const atmosGeo = new THREE.SphereGeometry(1.1, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
        vertexShader: 'varying vec3 vN; void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader: 'varying vec3 vN; void main(){float i=pow(0.55-dot(vN,vec3(0,0,1)),3.0);gl_FragColor=vec4(0.31,0.68,1.0,0.7)*i;}',
        blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true
    });
    scene.add(new THREE.Mesh(atmosGeo, atmosMat));

    // Locations
    const locations = [
        { name: 'Santorini', lat: 36.39, lng: 25.46, color: 0xff9e6d, key: 'santorini', price: '$1,299', best: 'Apr-Oct', flights: '3h from Rome', highlights: 'Oia Sunset, Caldera Cruise, Wine Tours' },
        { name: 'Tokyo', lat: 35.68, lng: 139.69, color: 0x4facfe, key: 'tokyo', price: '$1,849', best: 'Mar-May', flights: '12h from LA', highlights: 'Shibuya, Temples, Ramen Streets' },
        { name: 'Machu Picchu', lat: -13.16, lng: -72.54, color: 0xa8edea, key: 'machupicchu', price: '$2,199', best: 'May-Sep', flights: '8h + train', highlights: 'Inca Trail, Sun Gate, Sacred Valley' },
        { name: 'Reykjavik', lat: 64.13, lng: -21.89, color: 0x7c6fff, key: 'iceland', price: '$1,599', best: 'Sep-Mar', flights: '5h from NYC', highlights: 'Northern Lights, Blue Lagoon, Glaciers' },
        { name: 'Maldives', lat: 4.17, lng: 73.50, color: 0x90e0ef, key: 'maldives', price: '$2,899', best: 'Nov-Apr', flights: '10h from London', highlights: 'Overwater Villas, Diving, Sunset Cruise' },
        { name: 'Dubai', lat: 25.20, lng: 55.27, color: 0xff9e6d, key: 'dubai', price: '$1,749', best: 'Nov-Mar', flights: '7h from London', highlights: 'Burj Khalifa, Desert Safari, Gold Souk' },
        { name: 'New York', lat: 40.71, lng: -74.00, color: 0x0077b6, key: null, price: '$999', best: 'May-Oct', flights: 'Direct worldwide', highlights: 'Central Park, Broadway, Statue of Liberty' },
        { name: 'Paris', lat: 48.85, lng: 2.35, color: 0x7c6fff, key: null, price: '$1,199', best: 'Apr-Jun', flights: '1h from London', highlights: 'Eiffel Tower, Louvre, Montmartre' },
        { name: 'Sydney', lat: -33.87, lng: 151.21, color: 0xa8edea, key: null, price: '$1,999', best: 'Dec-Feb', flights: '14h from Tokyo', highlights: 'Opera House, Bondi Beach, Blue Mountains' },
        { name: 'Cape Town', lat: -33.92, lng: 18.42, color: 0xff9e6d, key: null, price: '$1,450', best: 'Oct-Mar', flights: '11h from London', highlights: 'Table Mountain, Penguins, Wine Lands' }
    ];

    function toVec3(lat, lng, r) {
        const phi = (90 - lat) * Math.PI / 180, theta = (lng + 180) * Math.PI / 180;
        return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    }

    // Markers (larger, more visible)
    const markerGroup = new THREE.Group();
    locations.forEach((loc, idx) => {
        const pos = toVec3(loc.lat, loc.lng, 1.02);
        // Pin base
        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.03, 20, 20),
            new THREE.MeshBasicMaterial({ color: loc.color })
        );
        dot.position.copy(pos);
        dot.userData = { index: idx, name: loc.name };
        markerGroup.add(dot);
        // Pulsing ring
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(0.035, 0.05, 32),
            new THREE.MeshBasicMaterial({ color: loc.color, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
        );
        ring.position.copy(pos);
        ring.lookAt(0, 0, 0);
        markerGroup.add(ring);
        // Outer glow ring
        const glow = new THREE.Mesh(
            new THREE.RingGeometry(0.05, 0.065, 32),
            new THREE.MeshBasicMaterial({ color: loc.color, side: THREE.DoubleSide, transparent: true, opacity: 0.2 })
        );
        glow.position.copy(pos);
        glow.lookAt(0, 0, 0);
        markerGroup.add(glow);
    });
    scene.add(markerGroup);

    // Travel arcs
    const arcGroup = new THREE.Group();
    const routes = [[0, 1], [1, 8], [2, 5], [3, 7], [4, 9], [6, 7], [0, 3], [5, 1]];
    const arcColors = [0x4facfe, 0x7c6fff, 0xff9e6d, 0xa8edea, 0x90e0ef, 0x0077b6, 0xd9d4ff, 0xff9e6d];
    routes.forEach(([a, b], i) => {
        const from = toVec3(locations[a].lat, locations[a].lng, 1.02);
        const to = toVec3(locations[b].lat, locations[b].lng, 1.02);
        const mid = from.clone().add(to).multiplyScalar(0.5).normalize().multiplyScalar(1.02 + from.distanceTo(to) * 0.35);
        const pts = new THREE.QuadraticBezierCurve3(from, mid, to).getPoints(60);
        arcGroup.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            new THREE.LineBasicMaterial({ color: arcColors[i], transparent: true, opacity: 0.35, linewidth: 2 })
        ));
    });
    scene.add(arcGroup);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.position.set(5, 3, 5); scene.add(dir);
    const pt2 = new THREE.PointLight(0x4facfe, 0.3, 10);
    pt2.position.set(-3, 2, 4); scene.add(pt2);

    // Rotation
    let dragging = false, pX = 0, pY = 0, rX = 0.3, rY = 0;
    canvas.addEventListener('mousedown', e => { dragging = true; pX = e.clientX; pY = e.clientY; });
    window.addEventListener('mouseup', () => { dragging = false; });
    window.addEventListener('mousemove', e => {
        if (!dragging) return;
        rY += (e.clientX - pX) * 0.005;
        rX += (e.clientY - pY) * 0.005;
        rX = Math.max(-1.2, Math.min(1.2, rX));
        pX = e.clientX; pY = e.clientY;
    });
    canvas.addEventListener('touchstart', e => { dragging = true; pX = e.touches[0].clientX; pY = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchend', () => { dragging = false; });
    window.addEventListener('touchmove', e => {
        if (!dragging) return;
        rY += (e.touches[0].clientX - pX) * 0.005;
        rX += (e.touches[0].clientY - pY) * 0.005;
        rX = Math.max(-1.2, Math.min(1.2, rX));
        pX = e.touches[0].clientX; pY = e.touches[0].clientY;
    }, { passive: true });

    // Click on globe — find nearest destination
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    canvas.addEventListener('click', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        // First check marker hits
        const markerHits = raycaster.intersectObjects(markerGroup.children);
        if (markerHits.length > 0 && markerHits[0].object.userData.name) {
            showTripDetails(markerHits[0].object.userData.index);
            return;
        }

        // Then check globe surface hit — find nearest destination
        const globeHits = raycaster.intersectObject(globe);
        if (globeHits.length > 0) {
            const point = globeHits[0].point;
            // Convert click point to lat/lng
            const rotatedPoint = point.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), -rX).applyAxisAngle(new THREE.Vector3(0, 1, 0), -rY);
            const lat = 90 - Math.acos(rotatedPoint.y) * 180 / Math.PI;
            const lng = Math.atan2(rotatedPoint.z, -rotatedPoint.x) * 180 / Math.PI - 180;

            // Find nearest location
            let minDist = Infinity, nearest = 0;
            locations.forEach((loc, i) => {
                const d = Math.sqrt(Math.pow(lat - loc.lat, 2) + Math.pow(lng - loc.lng, 2));
                if (d < minDist) { minDist = d; nearest = i; }
            });
            showTripDetails(nearest);
        }
    });

    function showTripDetails(idx) {
        const loc = locations[idx];
        const infoEl = document.getElementById('locationInfo');
        if (!infoEl) return;
        infoEl.innerHTML = `
            <div style="text-align:left;">
                <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:4px;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${loc.name}</h3>
                <div style="display:flex;flex-direction:column;gap:10px;margin-top:14px;">
                    <div style="display:flex;justify-content:space-between;font-size:0.85rem;padding:8px 12px;background:var(--bg);border-radius:8px;"><span style="color:var(--text-muted);"><i class="fas fa-tag" style="width:18px;color:var(--sky);"></i> Price</span><strong>${loc.price}</strong></div>
                    <div style="display:flex;justify-content:space-between;font-size:0.85rem;padding:8px 12px;background:var(--bg);border-radius:8px;"><span style="color:var(--text-muted);"><i class="fas fa-calendar" style="width:18px;color:var(--sky);"></i> Best Time</span><strong>${loc.best}</strong></div>
                    <div style="display:flex;justify-content:space-between;font-size:0.85rem;padding:8px 12px;background:var(--bg);border-radius:8px;"><span style="color:var(--text-muted);"><i class="fas fa-plane" style="width:18px;color:var(--sky);"></i> Flights</span><strong>${loc.flights}</strong></div>
                    <div style="font-size:0.85rem;padding:8px 12px;background:var(--bg);border-radius:8px;"><span style="color:var(--text-muted);display:block;margin-bottom:4px;"><i class="fas fa-star" style="width:18px;color:var(--gold);"></i> Highlights</span><strong>${loc.highlights}</strong></div>
                </div>
                ${loc.key ? `<button onclick="openDestModal('${loc.key}')" style="margin-top:14px;width:100%;padding:11px;border-radius:10px;background:var(--gradient);color:#fff;font-weight:600;border:none;cursor:pointer;font-family:var(--font);display:flex;align-items:center;justify-content:center;gap:8px;font-size:0.88rem;box-shadow:0 4px 15px rgba(79,172,254,0.3);"><i class="fas fa-suitcase-rolling"></i> View Full Details</button>` : ''}
            </div>
        `;
    }

    // Animate
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        if (!dragging) rY += 0.002;
        [globe, wireframe, markerGroup, arcGroup].forEach(o => { o.rotation.x = rX; o.rotation.y = rY; });
        markerGroup.children.forEach((ch, i) => {
            if (ch.geometry.type === 'RingGeometry') {
                const s = 1 + 0.35 * Math.sin(time * 2.5 + i * 0.5);
                ch.scale.set(s, s, s);
                ch.material.opacity = 0.2 + 0.4 * Math.abs(Math.sin(time * 2.5 + i * 0.5));
            }
        });
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const nw = canvas.clientWidth, nh = canvas.clientHeight;
        camera.aspect = nw / nh; camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
    });
}

document.addEventListener('DOMContentLoaded', () => setTimeout(initGlobe, 200));
