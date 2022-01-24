import './css/index.css';
import json from './marker_world.json';

let arrResults = [];
const urlRemoteMap = 'https://mapa.shibacraft.net/tiles/_markers_/marker_world.json';

const parseMap = (jsonData) => {
  const areas = jsonData.sets['griefdefender.markerset'].areas;
  let data = Object.keys(areas).map((el) => {
    return areas[el];
  });
  data = data.map((el) => {
    const { desc, label, x, z } = el;
    return {
      desc,
      label,
      x,
      z,
    };
  });
  return data;
};

const getRemoteMap = async (url) => {
  const response = await fetch(url);
  if (response.ok) {
    const jsonValue = await response.json();
    return Promise.resolve(jsonValue);
  } else {
    return Promise.reject('Not found');
  }
};

const mapPreview = (url) => `<div class="claim-map"><iframe src="${url}"></iframe></div>`;

const filterMap = ({ mapData, numDays = 5 }) => {
  const parser = new DOMParser();
  const timeInterval = numDays * 86400000;

  for (const e of mapData) {
    if (e.label === 'administrador') {
      continue;
    }
    const regex = new RegExp(/login: (.*)Manager/, 'gi');
    const str = parser.parseFromString(e.desc, 'text/html').body.firstChild.firstChild.textContent;
    let dateStr = regex.exec(str);
    if (dateStr) {
      dateStr = dateStr[1];
    } else {
      return console.error(str);
    }
    const [w, m, d, h, t, y] = dateStr.split(' ');
    const fechaStr = `${d} ${m} ${y} ${h}`;
    const fecha = Date.parse(fechaStr);
    const diffTime = calculateTime({ claimDate: fecha, interval: timeInterval });
    const claimSize = calculateClaimSize({ x: e.x, z: e.z });
    if (diffTime < 0) {
      const mapUrl = buildLink({
        x: e.x,
        z: e.z,
      });
      arrResults.push({
        claimSize,
        date: fecha,
        text: `
        <li class="claim">
          <div class="claim-info">
            User: ${e.label}<br/>
            Coords: <a href="${mapUrl}" target="_blank">${printCoords({ x: e.x, z: e.z })}</a><br/>
            Tamaño claim: ${claimSize}<br/>
            Caducidad: ${calculateDeadlineDate(fecha).toDateString()}<br/>
            Info: ${e.desc}
          </div>
          <!-- ${mapPreview(mapUrl)} -->
        </li>`,
      });
    }
  }

  orderResults({ key: 'date', order: 'desc' });
};

const orderResults = ({ key, order }) => {
  arrResults.sort((a, b) => {
    if (order === 'desc') {
      return a[key] - b[key];
    } else {
      return b[key] - a[key];
    }
  });
};

const printArrResults = () => {
  let str = '';
  arrResults.forEach((el) => (str += el.text));
  return str;
};

const buildLink = ({ x, z }) => {
  return `https://mapa.shibacraft.net/?worldname=world&zoom=10&x=${x[0]}&z=${z[0]}`;
};

const printCoords = ({ x, z }) => `${x[0]}, ${z[0]}`;

const calculateTime = ({ claimDate, interval }) => {
  const now = new Date().valueOf();
  const deadlineDate = now - 45 * 86400000;
  const limitDate = deadlineDate + interval;
  // console.log({ now, interval, limitDate, claimDate });
  // console.log(new Date(limitDate).toString());
  return claimDate - limitDate;
};

const calculateDeadlineDate = (claimDate) => {
  const fortyFiveDaysToMs = 45 * 86400 * 1000;
  return new Date(claimDate + fortyFiveDaysToMs);
};

const calculateClaimSize = ({ x, z }) => {
  return (x[2] - x[0]) * (z[2] - z[0]);
};

const showResults = () => {
  document.getElementById('results').innerHTML = `<h3>${
    arrResults.length
  } resultados:</h3><ul>${printArrResults()}</ul>`;
};

const cleanPreviousResults = () => {
  document.getElementById('results').innerHTML = '';
};

document.getElementById('search').addEventListener('click', () => {
  const numDays = document.getElementById('numDays').value;
  arrResults = [];
  cleanPreviousResults();
  getRemoteMap(urlRemoteMap).then((json) => {
    filterMap({ mapData: parseMap(json), numDays });
    showResults();
  });
});

const buttons = Array.from(document.getElementsByClassName('order-button'));
buttons.forEach((button) => {
  button.addEventListener('click', (evt) => {
    let order = { key: '', order: '' };
    switch (evt.target.id) {
      case 'order_date_asc':
        order = { key: 'date', order: 'asc' };
        break;
      case 'order_date_desc':
        order = { key: 'date', order: 'desc' };
        break;
      case 'order_size_asc':
        order = { key: 'claimSize', order: 'asc' };
        break;
      case 'order_size_desc':
        order = { key: 'claimSize', order: 'desc' };
        break;
    }
    cleanPreviousResults();
    orderResults(order);
    showResults();
  });
});
