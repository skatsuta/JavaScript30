class Notifier {
  constructor() {
    this.handlers = [];
  }

  observe(handler) {
    this.handlers.push(handler);
  }

  fire() {
    this.handlers.forEach(handler => handler());
  }
}

class Model {
  constructor() {
    this._cities = [];
    this._matchedCities = [];
    this.matchedCitiesChanged = new Notifier;
  }

  get matchedCities() {
    return this._matchedCities;
  }

  set matchedCities(cities) {
    this._matchedCities = cities;
    this.matchedCitiesChanged.fire();
  }

  loadCities() {
    const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29' +
      '/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
    fetch(endpoint)
      .then(resp => resp.json())
      .then(data => this._cities.push(...data));
  }

  match(wordRegex) {
    this.matchedCities = this._cities.filter(place =>
      wordRegex.test(place.city) || wordRegex.test(place.state)
    );
  }
}

class ViewModel {
  constructor() {
    this.model = new Model();
    this.matchedCities = this.model.matchedCities;

    // register handler to observer
    this.model.matchedCitiesChanged.observe(() => this.matchedCities = this.model.matchedCities);

    // add event handlers
    this.searchInput = document.querySelector('input.search');
    this.suggestions = document.querySelector('ul.suggestions');
    ['change', 'keyup'].forEach(event =>
      this.searchInput.addEventListener(event, () => this.render(this.searchInput.value))
    );

    this.model.loadCities();
  }

  render(wordToMatch) {
    const regex = new RegExp(wordToMatch, 'gi');
    this.model.match(regex);

    this.suggestions.innerHTML = this.matchedCities.map(place => {
      const highlight = `<span class="hl">${wordToMatch}</span>`;
      const cityName = place.city.replace(regex, highlight);
      const stateName = place.state.replace(regex, highlight);
      return `<li><span class="name">${cityName}, ${stateName}</span></li>`;
    }).join("\n");
  }
}

new ViewModel();
