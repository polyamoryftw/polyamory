async function loadData(){
  const res = await fetch('data/site.json');
  return await res.json();
}

function card(feature){
  return `<a class="card" href="${feature.url}">
    <img src="${feature.image}" alt="${feature.title}">
    <div class="cardText"><span>${feature.subtitle}</span><h3>${feature.title}</h3></div>
  </a>`;
}

function dateRow(show){
  return `<div class="dateRow"><strong>${show.date}</strong><span>${show.city}</span><span>${show.venue}</span><a href="#">+</a></div>`;
}

function product(item){
  return `<a class="product" href="#"><img src="${item.image}" alt="${item.name}"><div class="productText"><h3>${item.name}</h3><p>${item.price}</p></div></a>`;
}

function videoItem(video, index){
  return `<button class="videoItem ${index === 0 ? 'is-active' : ''}" data-video="${video.youtubeId}" type="button">
    <img src="${video.image}" alt="${video.title}">
    <span>${video.label}</span><strong>${video.title}</strong>
  </button>`;
}

loadData().then(data => {
  document.title = data.siteTitle;
  document.querySelector('.brand').textContent = data.siteTitle;
  document.querySelector('#featureGrid').innerHTML = data.features.map(card).join('');
  document.querySelector('#dateRows').innerHTML = data.shows.map(dateRow).join('');
  document.querySelector('#storeGrid').innerHTML = data.merch.map(product).join('');
  const videoList = document.querySelector('#videoList');
  const frame = document.querySelector('#youtubeFrame');
  videoList.innerHTML = data.videos.map(videoItem).join('');
  videoList.addEventListener('click', event => {
    const button = event.target.closest('.videoItem');
    if(!button) return;
    videoList.querySelectorAll('.videoItem').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
    frame.src = `https://www.youtube.com/embed/${button.dataset.video}?autoplay=1`;
  });
});

// Integration placeholders:
// Meta Pixel: insert fbq base code here and track ViewContent / Subscribe / AddToCart.
// Shopify: replace product anchors with Shopify Buy Button SDK or Hydrogen routes.
// Mailing list: post .signup to Klaviyo, Mailchimp, Shopify Forms, or your API endpoint.
