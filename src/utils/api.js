const baseApiUrl = 'https://norma.nomoreparties.space/api/';

const request = (route, options = {}) =>
  fetch(baseApiUrl + route, options)
    .then(r => r.json())
    .then(r => r.success ? r : Promise.reject(r.message))


export const getIngredientsRequest = () =>
  request('ingredients');

export const createOrderRequest = (bun, fillings) =>
  request('orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredients: [ bun._id, ...fillings.map(n => n._id), bun._id ],
    }),
  });
