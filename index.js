const COHORT = "2412-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/artists`;
const artistList = document.querySelector("#artists");
const form = document.querySelector("form");

// === State ===

const state = {
  artists: [],
};

/** Updates state with artists from API */
async function getArtists() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.artists = json.data;
  } catch (err) {
    console.log(err);
  }
}

/** Asks the API to create a new artist based on the given `artist` */
async function addArtist(artist) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(artist),
    });
    const json = await response.json();
    if (json.error) {
      throw new Error(json.error.message);
    }
  } catch (err) {
    console.log(err);
  }
}

// === Render ===

/** Renders artists from state */
function renderArtists() {
  if (!state.artists.length) {
    artistList.innerHTML = "<li>No artists.</li>";
    return;
  }

  const artistCards = state.artists.map((artist) => {
    const card = document.createElement("li");
    card.innerHTML = `
     <h2>${artist.name}</h2>
     <img src="${artist.imageUrl}" alt="${artist.name}" />
     <p>${artist.description}</p>
   `;
    return card;
  });

  artistList.replaceChildren(...artistCards);
}

/** Syncs state with the API and rerender */
async function render() {
  await getArtists();
  renderArtists();
}

// === Script ===

render();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const artist = {
    name: form.artistName.value,
    description: form.description.value,
    imageUrl: form.imageUrl.value,
  };

  await addArtist(artist);
  render();
});
