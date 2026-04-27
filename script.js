async function loadData(){
  // Always request the latest CloudCannon/GitHub content.
  // This prevents stale Cloudflare/browser cache from hiding editor changes.
  const cacheBust = `v=${Date.now()}`;
  const res = await fetch(`data/site.json?${cacheBust}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache'
    }
  });

  if (!res.ok) {
    throw new Error(`Could not load data/site.json: ${res.status}`);
  }

  return await res.json();
}

function getPath(obj, path){
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

function applyEditableText(data){
  document.querySelectorAll('[data-edit]').forEach(el => {
    const value = getPath(data, el.dataset.edit);
    if(value !== undefined && value !== null) el.textContent = value;
  });

  document.querySelectorAll('[data-placeholder]').forEach(el => {
    const value = getPath(data, el.dataset.placeholder);
    if(value !== undefined && value !== null) el.setAttribute('placeholder', value);
  });

  const sectionsById = Object.fromEntries((data.sections || []).map(section => [section.id, section]));

  document.querySelectorAll('[data-section-text]').forEach(el => {
    const [sectionId, field] = el.dataset.sectionText.split('.');
    const value = sectionsById[sectionId] && sectionsById[sectionId][field];
    if(value !== undefined && value !== null) el.textContent = value;
  });

  document.querySelectorAll('[data-section-placeholder]').forEach(el => {
    const [sectionId, field] = el.dataset.sectionPlaceholder.split('.');
    const value = sectionsById[sectionId] && sectionsById[sectionId][field];
    if(value !== undefined && value !== null) el.setAttribute('placeholder', value);
  });

  const scroll = document.querySelector('[data-scroll-link]');
  if(scroll && data.hero && data.hero.scrollTarget){
    scroll.href = `#${data.hero.scrollTarget}`;
  }
}

function applyNavigation(data){
  const nav = document.querySelector('#mainNav');
  if(!nav || !data.nav || !Array.isArray(data.nav.items)) return;

  nav.innerHTML = data.nav.items
    .filter(item => item.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(item => `<a href="#${item.target}">${item.label}</a>`)
    .join('');
}

function applySectionOrder(data){
  const root = document.querySelector('[data-section-root]');
  if(!root || !Array.isArray(data.sections)) return;

  // Reorder by physically moving sections in the DOM so existing CSS/grid formatting stays intact.
  const orderedSections = [...data.sections]
    .filter(section => section && section.id)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  orderedSections.forEach(section => {
    const el = document.querySelector(`#${section.id}`);
    if(!el) return;
    el.hidden = section.visible === false;
    root.appendChild(el);
  });
}

function card(feature){
  return `<a class="card" href="${feature.url || '#'}">
    <img src="${feature.image}" alt="${feature.title}">
    <div class="cardText"><span>${feature.subtitle || ''}</span><h3>${feature.title}</h3></div>
  </a>`;
}

function dateRow(show){
  return `<div class="dateRow"><strong>${show.date}</strong><span>${show.city}</span><span>${show.venue}</span><a href="${show.url || '#'}">+</a></div>`;
}

function product(item){
  return `<a class="product" href="${item.url || '#'}"><img src="${item.image}" alt="${item.name}"><div class="productText"><h3>${item.name}</h3><p>${item.price || ''}</p></div></a>`;
}

function videoItem(video, index){
  return `<button class="videoItem ${index === 0 ? 'is-active' : ''}" data-video="${video.youtubeId}" type="button">
    <img src="${video.image}" alt="${video.title}">
    <span>${video.label || ''}</span><strong>${video.title}</strong>
  </button>`;
}

loadData().then(data => {
  document.title = data.siteTitle || 'POLYAMORY';

  applyEditableText(data);
  applyNavigation(data);
  applySectionOrder(data);

  const featureGrid = document.querySelector('#featureGrid');
  if(featureGrid) featureGrid.innerHTML = (data.features || []).map(card).join('');

  const dateRows = document.querySelector('#dateRows');
  if(dateRows) dateRows.innerHTML = (data.shows || []).map(dateRow).join('');

  const storeGrid = document.querySelector('#storeGrid');
  if(storeGrid) storeGrid.innerHTML = (data.merch || []).map(product).join('');

  const videoList = document.querySelector('#videoList');
  const frame = document.querySelector('#youtubeFrame');

  if(videoList && frame){
    videoList.innerHTML = (data.videos || []).map(videoItem).join('');

    const firstVideo = (data.videos || [])[0];
    if(firstVideo && firstVideo.youtubeId){
      frame.src = `https://www.youtube.com/embed/${firstVideo.youtubeId}`;
    }

    videoList.addEventListener('click', event => {
      const button = event.target.closest('.videoItem');
      if(!button) return;
      videoList.querySelectorAll('.videoItem').forEach(item => item.classList.remove('is-active'));
      button.classList.add('is-active');
      frame.src = `https://www.youtube.com/embed/${button.dataset.video}?autoplay=1`;
    });
  }
}).catch(error => {
  console.error('Polyamory content failed to load', error);
});

// Integration placeholders:
// Meta Pixel: insert fbq base code here and track ViewContent / Subscribe / AddToCart.
// Shopify: replace product anchors with Shopify Buy Button SDK or Hydrogen routes.
// Mailing list: post .signup to Klaviyo, Mailchimp, Shopify Forms, or your API endpoint.
