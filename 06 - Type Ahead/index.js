class Suggester {
  constructor() {
    this.cities = [];
    const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
    fetch(endpoint)
      .then(resp => resp.json())
      .then(data => this.cities.push(...data));
  }

  listMatches(wordToMatch) {
    const regex = new RegExp(wordToMatch, 'gi');
    const html = this.cities
      .filter(place => regex.test(place.city) || regex.test(place.state))
      .map(place => {
        const highlight = `<span class="hl">${wordToMatch}</span>`;
        const cityName = place.city.replace(regex, highlight);
        const stateName = place.state.replace(regex, highlight);
        return `<li><span class="name">${cityName}, ${stateName}</span></li>`;
      })
      .join("\n");
    return html;
  }
}

const searchInput = document.querySelector('input.search');
const suggestions = document.querySelector('ul.suggestions');
const suggester = new Suggester();
const displayMatches = () => suggestions.innerHTML = suggester.listMatches(searchInput.value);
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);
