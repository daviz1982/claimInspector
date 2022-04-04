import json from './20220404_marker_world.json';
import './css/index.scss';
let arrResults = [];
let parsedData = [];
let playerList = [];
const type = {
  CLAIM: 'griefdefender:basic',
  SUBCLAIM: 'griefdefender:subdivision',
  TOWN: 'griefdefender:town'
};
let showSubclaims = false;

// let json = {};
// const urlRemoteMap = 'https://mapa.shibacraft.net/tiles/_markers_/marker_world.json';

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

const mapPreview = (url) => `<iframe src="${url}"></iframe>`;

const filterMap = ({ mapData, numDays = 5, callback }) => {

  const timeInterval = numDays * 86400000;

  for (const e of mapData) {
    if (e.label === 'administrador') {
      continue;
    }
    let dateStr = findDataInDesc({ text: e.desc, regex: new RegExp(/login: (.*)Manager/, 'gi') });
    let claimType = findDataInDesc({ text: e.desc, regex: new RegExp(`(${type.CLAIM}|${type.SUBCLAIM}|${type.TOWN})`, 'gi') });
    if (dateStr) {
      dateStr = dateStr[1];
    } else {
      return console.error(str);
    }
    if (claimType) {
      claimType = claimType[1]
    }
    if (claimType === type.SUBCLAIM && !showSubclaims) {
      continue;
    }
    const [w, m, d, h, t, y] = dateStr.split(' ');
    const fechaStr = `${d} ${m} ${y} ${h}`;
    const fecha = Date.parse(fechaStr);
    const diffTime = calculateTime({
      claimDate: fecha,
      interval: timeInterval,
    });
    const claimSize = calculateClaimSize({
      x: e.x,
      z: e.z,
    });
    if (diffTime < 0) {
      const mapUrl = buildLink({
        x: e.x,
        z: e.z,
      });
      arrResults.push({
        user: e.label,
        claimSize,
        date: fecha,
        text: `
        <li class="claim">
          <div class="claim-info">
            <label>User:<label> ${e.label}<br/>
            <label>Coords:<label> <a href="${mapUrl}" class="open_modal" target="_blank">${printCoords({ x: e.x, z: e.z })}</a><br/>
            <label>Tamaño claim:<label> ${claimSize}<br/>
            <label>Caducidad:<label> ${calculateDeadlineDate(fecha).toString()}<br/>
            <details><summary>Info:</summary>${e.desc}</details>
          </div>
        </li>`,
      });
    }
  }

  orderResults({
    key: 'date',
    order: 'desc',
  });

  callback()
};

const findDataInDesc = ({ text, regex }) => {
  const parser = new DOMParser();
  const str = parser.parseFromString(text, 'text/html').body.firstChild.firstChild.textContent;
  return regex.exec(str);
}

const orderResults = ({ key, order }) => {
  arrResults.sort((a, b) => {
    if (order === 'asc') {
      return a[key] - b[key];
    } else {
      return b[key] - a[key];
    }
  });
};

const buildLink = ({ x, z }) => {
  return `https://mapa.shibacraft.net/#world;flat;${x[0]},64,${z[0]};10`
  // return `https://mapa.shibacraft.net/?worldname=world&zoom=10&x=${x[0]}&z=${z[0]}`;
};

const printCoords = ({ x, z }) => `${x[0]}, ${z[0]}`;

const calculateTime = ({ claimDate, interval }) => {
  const now = new Date().valueOf();
  const deadlineDate = now - 45 * 86400 * 1000;
  const limitDate = deadlineDate + interval;
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
  setTimeout(() => {
    const element = document.getElementById('results')
    element.innerHTML += `<h3>${arrResults.length
      } resultados:</h3><ul>${arrResults.map(({ text }) => text).join('')}</ul>`;
    bindMapLinks();
    toggleLoader();
  }, 500);
};

const cleanPreviousResults = () => {
  toggleLoader()
  const resultContent = document.querySelectorAll('#results')[0]
  Array.from(resultContent.children).forEach((item, index) => {
    if (!item.classList.contains('loader')) {
      // console.log(item.classList.contains('loader'))
      resultContent.removeChild(item)
    }
  })
};

const bindMapLinks = () => {
  const modalLinks = Array.from(document.getElementsByClassName('open_modal'));
  modalLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      // console.log(event.target);
      const url = event.target.href;
      openMap(url);
    });
  });
};

const openMap = (url) => {
  const back = document.getElementById('modal_back');
  const modal = document.getElementById('modal');
  const content = document.getElementById('modal_content');

  content.innerHTML = mapPreview(url);
  back.style.display = 'block';
  modal.style.display = 'flex';

  modal.addEventListener('click', closeModal);
  document.addEventListener('keydown', (evt) => {
    const ESC = 'Escape';
    if (evt.key === ESC) {
      closeModal();
    }
  });
};

const closeModal = () => {
  document.getElementById('modal_content').innerHTML = '';
  document.getElementById('modal_back').style.display = 'none';
  document.getElementById('modal').style.display = 'none';
};

const getBlockNumberByUser = () => {
  const mapData = parsedData;
  let playerData = [];
  let playerList = [];
  for (const e of mapData) {
    const { label, x, z, desc } = e;
    let claimType = findDataInDesc({ text: desc, regex: new RegExp(`(${type.CLAIM}|${type.SUBCLAIM}|${type.TOWN})`, 'gi') });
    if (claimType) {
      claimType = claimType[1]
    }
    if (claimType === type.SUBCLAIM) {
      continue;
    }
    if (!playerList.includes(label)) {
      playerList.push(label)
      playerData.push({
        label,
        size: calculateClaimSize({ x, z })
      })
    } else {
      const found = playerData.find(item => item.label === label)
      found.size += calculateClaimSize({ x, z })
    }
  }
  playerData = playerData.sort((a, b) => b.size - a.size)
  return playerData;
}

const getClaimsByPlayer = (playerName) => {
  arrResults = arrResults.filter(({ user }) => user.toLowerCase() === playerName)
  cleanPreviousResults()
  showResults()
}

const getPlayerList = () => (
  parsedData.map(({ label }) => label.toLowerCase())
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort()
)

const filterPlayerList = (str) => {
  const filteredList = playerList.filter(name => {
    const expression = `${str}`
    const regex = new RegExp(expression, 'gi')
    const match = regex.test(name)
    return match;
  })
  return `<ul id="autocomplete-list"><li class="player">${filteredList.join('</li><li class="player">')}</li></ul>`
}

const fillPlayerName = (event) => {
  const field = document.getElementById('player_name')
  const name = event.target.textContent
  field.value = name
  hideAutocompletePlayerList()
}

const hideAutocompletePlayerList = () => document.getElementById('autocomplete_playerlist').remove()

window.onload = () => {
  parsedData = parseMap(json)
  playerList = getPlayerList()
  loadListeners()
}

const loadListeners = () => {
  document.getElementById('claims_player').addEventListener('click', () => {
    arrResults = [];
    cleanPreviousResults()
    toggleLoader()
    filterMap({
      mapData: parsedData,
      numDays: 100,
      callback: () => getClaimsByPlayer(document.getElementById('player_name').value)
    });

  })

  document.getElementById('top_players').addEventListener('click', () => {
    let list = ''
    const top = getBlockNumberByUser()
    const element = document.getElementById('results')
    top.forEach(({ label, size }) => { list += `<li><strong>${label}:</strong><span>${size}</span></li>` })
    element.innerHTML = `<ol>${list}</ol>`
  })

  document.getElementById('search').addEventListener('click', () => {
    const numDays = document.getElementById('numDays').value;
    // json = window.jsonImported;
    arrResults = [];
    cleanPreviousResults()
    // getRemoteMap(urlRemoteMap).then((json) => {
    filterMap({
      mapData: parsedData,
      numDays,
      callback: showResults
    });
    // });
  })

  const field = document.getElementById('player_name');
  field.addEventListener('keyup', event => {

    const playerListContainer = document.getElementById('autocomplete_playerlist') ?? document.createElement('div')
    playerListContainer.setAttribute("id", "autocomplete_playerlist")
    const str = event.target.value;
    if (str.length > 0) {
      playerListContainer.innerHTML = filterPlayerList(str)
      field.insertAdjacentElement('afterend', playerListContainer)
      document.querySelectorAll('#autocomplete_playerlist .player').forEach(item => {
        item.removeEventListener('click', fillPlayerName);
        item.addEventListener('click', fillPlayerName)
      });
    }
  })

  const buttons = Array.from(document.getElementsByClassName('order-button'));
  buttons.forEach((button) => {
    button.addEventListener('click', (evt) => {
      let order = {
        key: '',
        order: '',
      };
      switch (evt.target.id) {
        case 'order_date_asc':
          order = {
            key: 'date',
            order: 'asc',
          };
          break;
        case 'order_date_desc':
          order = {
            key: 'date',
            order: 'desc',
          };
          break;
        case 'order_size_asc':
          order = {
            key: 'claimSize',
            order: 'asc',
          };
          break;
        case 'order_size_desc':
          order = {
            key: 'claimSize',
            order: 'desc',
          };
          break;
      }
      cleanPreviousResults();
      orderResults(order);
      showResults();
    });
  });
}

const toggleLoader = () => {
  const IS_HIDDEN = 'is-hidden'
  const loader = document.querySelector('#results > .loader')
  loader && loader.classList.toggle(IS_HIDDEN)
}


// TODO LIST:

// Change 'Claim' info by creating a kind of "card" where info is more graphic
//    eg: user name like in a profile picture (random generated character illustrations)
//        user info encapsulated in a "details / summary" element
//        for coords, we can use an earth like image and make it clickable to open a modal with the map
//        for claim size, we can use a color scale (red to green, or kind of)
//        finally to show the type (claim/subclaim) and also make a filter in the top bar buttons (indicating wether to show up or not)

// When showing player's claims, show total of claimblocks 

// Fix sum of claimblocks: not counting the subclaims