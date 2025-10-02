import { saluda } from './utils.js';

console.log('Main JS cargado');
document.body.insertAdjacentHTML('beforeend', `<p>${saluda('Parcel')}</p>`);