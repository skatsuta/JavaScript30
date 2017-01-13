class Notifier {
  constructor() {
    this.handlers = [];
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  notify() {
    this.handlers.forEach(handler => handler());
  }
}

class ItemsStore {
  constructor(notifier) {
    this.notifier = notifier;
    this.key = 'items';
    this.items = JSON.parse(localStorage.getItem(this.key)) || [];
  }

  addHandler(handler) {
    this.notifier.addHandler(handler);
  }

  persistAndNotify() {
    localStorage.setItem(this.key, JSON.stringify(this.items));
    this.notifier.notify();
  }

  add(item) {
    this.items.push(item);
    this.persistAndNotify();
  }

  toggle(index) {
    this.items[index].done = !this.items[index].done;
    this.persistAndNotify();
  }
}

class ViewModel {
  constructor(itemsList, addItemInput) {
    this.itemsList = itemsList;
    this.addItemInput = addItemInput;
    this.itemsStore = new ItemsStore(new Notifier());

    this.itemsStore.addHandler(() => {
      this.items = this.itemsStore.items;
    });
    this.itemsStore.persistAndNotify();

    this.populateList = () => {
      const html = this.items.map((item, i) => {
        const checked = item.done ? 'checked' : '';
        return `
          <li>
            <input id="item${i}" type="checkbox" data-index="${i}" ${checked}/>
            <label for="item${i}">${item.text}</label>
          </li>`;
      }).join('\n');

      this.itemsList.innerHTML = html;
    };
    this.populateList();
  }

  addItem(ev) {
    ev.preventDefault();

    const item = {
      text: this.addItemInput.value,
      done: false,
    };
    this.itemsStore.add(item);

    this.populateList();

    // clear input form
    this.addItemInput.value = '';
  }

  toggle(ev) {
    if (!ev.target.matches('input[type="checkbox"]')) { return; }

    const index = ev.target.dataset.index;
    this.itemsStore.toggle(index);

    this.populateList();
  }
}

const itemsList = document.querySelector('ul.plates');
const addItemForm = document.querySelector('form.add-items');
const addItemInput = addItemForm.querySelector('input[name="item"]');
const vm = new ViewModel(itemsList, addItemInput);

addItemForm.addEventListener('submit', ev => vm.addItem(ev));
itemsList.addEventListener('click', ev => vm.toggle(ev));
