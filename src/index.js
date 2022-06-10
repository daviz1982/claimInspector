import './css/index.scss'

let arrResults = []
let parsedData = []
let playerList = []
let minClaimSize = 4000
let filterLargeClaims = false
const type = {
  CLAIM: 'griefdefender:basic',
  SUBCLAIM: 'griefdefender:subdivision',
  TOWN: 'griefdefender:town'
}
const showSubclaims = false
const sizeColorScale = {
  0: 0,
  300: 30,
  1500: 60,
  4000: 90,
  10000: 120,
  20000: 135
}

let json = {}
const proxyAntiCors = 'https://api.allorigins.win/raw?url='
const urlRemoteMap = 'https://mapa.shibacraft.net/tiles/_markers_/marker_world.json'

const parseMap = (jsonData) => {
  const { areas } = jsonData.sets['griefdefender.markerset']
  let data = Object.keys(areas).map((el) => areas[el])
  data = data.map((el) => {
    const { desc, label, x, z } = el
    return {
      desc,
      label,
      x,
      z,
    }
  })
  return data
}

const getRemoteMap = async (url) => {
  const response = await fetch(url, {
    headers: { origin: "kartofen" }
  })
  if (response.ok) {
    const jsonValue = await response.json()
    return Promise.resolve(jsonValue)
  }
  return Promise.reject('Not found')
}

const mapPreview = (url) => `<iframe src="${url}"></iframe>`

const findDataInDesc = ({ text, regex }) => {
  const parser = new DOMParser()
  const str = parser.parseFromString(text, 'text/html').body.firstChild.firstChild.textContent
  return regex.exec(str)
}

const orderResults = ({ key, order }) => {
  arrResults.sort((a, b) => {
    if (order === 'asc') {
      return a[key] - b[key]
    }
    return b[key] - a[key]
  })
}

const calculateClaimSize = ({ x, z }) => ({ x: (x[2] - x[0]), z: (z[2] - z[0]), size: (x[2] - x[0]) * (z[2] - z[0]) })

const calculateTime = ({ claimDate, interval }) => {
  const now = new Date().valueOf()
  const deadlineDate = now - 45 * 86400 * 1000
  const limitDate = deadlineDate + interval
  return claimDate - limitDate
}

const calculateDeadlineDate = (claimDate) => {
  const fortyFiveDaysToMs = 45 * 86400 * 1000
  return new Date(claimDate + fortyFiveDaysToMs)
}

const calculateCenter = ({ x, z }) => ({ x: (x[2] + x[0]) / 2, z: (z[2] + z[0]) / 2 })

const buildLink = ({ x, z }) => `https://mapa.shibacraft.net/#world;flat;${x},64,${z};10`

const printCoords = ({ x, z }) => ({ NW: `${x[0]}, ${z[0]}`, NE: `${x[1]}, ${z[1]}`, SE: `${x[2]}, ${z[2]}`, SW: `${x[3]}, ${z[3]}`, center: `${(x[2] + x[0]) / 2}, ${(z[2] + z[0]) / 2}` })

const getColorScale = size => {
  const breakpoints = Object.keys(sizeColorScale).filter(key => +(key) <= size)
  return sizeColorScale[breakpoints[breakpoints.length - 1]]
}

const filterMap = ({ mapData, numDays = 5, callback }) => {
  const timeInterval = numDays * 86400000
  mapData.forEach(e => {
    if (e.label === 'administrador' || e.label === '[desconocido]') {
      return
    }
    let dateStr = findDataInDesc({ text: e.desc, regex: new RegExp(/login: (.*)Manager/, 'gi') })
    let claimType = findDataInDesc({ text: e.desc, regex: new RegExp(`(${type.CLAIM}|${type.SUBCLAIM}|${type.TOWN})`, 'gi') })
    if (dateStr) {
      [, dateStr] = dateStr
    } else {
      return
    }
    if (claimType) {
      [, claimType] = claimType
    }
    if (claimType === type.SUBCLAIM && !showSubclaims) {
      return
    }
    const [, m, d, h, , y] = dateStr.split(' ')
    const fechaStr = `${d} ${m} ${y} ${h}`
    const fecha = Date.parse(fechaStr)
    const diffTime = calculateTime({
      claimDate: fecha,
      interval: timeInterval,
    })
    const claimSize = calculateClaimSize(e)
    if (diffTime < 0) {
      const center = calculateCenter(e)
      const mapUrl = buildLink(center)
      const claimInfo = {
        user: e.label,
        claimSize: claimSize.size,
        date: fecha,
        text: `
        <li class="claim">
          <div class="ribbon" style="background-color: hsl(${getColorScale(claimSize.size)}, 100%, 50%)"></div>
          <div class="claim-info">
            <label>User: ${e.label}</label><br/>
            <label>Coords: <a href="${mapUrl}" class="open_modal" target="_blank">${printCoords(e).center}</a> (NW)</label><br/>
            <label>Tamaño claim: ${claimSize.size} [${claimSize.x} &times ${claimSize.z}]</label><br/>
            <label>Caducidad: ${calculateDeadlineDate(fecha).toString()}</label><br/>
            <details><summary>Info:</summary>${e.desc}</details>
          </div>
        </li>`,
      }
      arrResults.push(claimInfo)
    }
  })

  orderResults({
    key: 'date',
    order: 'desc',
  })

  callback()
}

const toggleLoader = () => {
  const IS_HIDDEN = 'is-hidden'
  const loader = document.querySelector('#results > .loader')
  return loader && loader.classList.toggle(IS_HIDDEN)
}

const cleanPreviousResults = () => {
  toggleLoader()
  const resultContent = document.querySelectorAll('#results')[0]
  Array.from(resultContent.children).forEach((item) => {
    if (!item.classList.contains('loader')) {
      resultContent.removeChild(item)
    }
  })
}

const closeModal = () => {
  document.getElementById('modal_content').innerHTML = ''
  document.getElementById('modal_back').style.display = 'none'
  document.getElementById('modal').style.display = 'none'
}

const openMap = (url) => {
  const back = document.getElementById('modal_back')
  const modal = document.getElementById('modal')
  const content = document.getElementById('modal_content')

  content.innerHTML = mapPreview(url)
  back.style.display = 'block'
  modal.style.display = 'flex'

  modal.addEventListener('click', closeModal)
  document.addEventListener('keydown', (evt) => {
    const ESC = 'Escape'
    if (evt.key === ESC) {
      closeModal()
    }
  })
}

const bindMapLinks = () => {
  const modalLinks = Array.from(document.getElementsByClassName('open_modal'))
  modalLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      const url = event.target.href
      openMap(url)
    })
  })
}

const showResults = () => {
  const filterListResult = arrResults.filter(item => !filterLargeClaims ? true : item.claimSize > minClaimSize)
  setTimeout(() => {
    const element = document.getElementById('results')
    element.innerHTML += `<h3>${filterListResult.length
      } resultados:</h3><ul>${filterListResult.map(({ text }) => text).join('')}</ul>`
    bindMapLinks()
    toggleLoader()
  }, 500)
}

const getBlockNumberByUser = () => {
  const mapData = parsedData
  let playerData = []
  const pList = []

  mapData.forEach(e => {
    const { label, x, z, desc } = e
    let claimType = findDataInDesc({ text: desc, regex: new RegExp(`(${type.CLAIM}|${type.SUBCLAIM}|${type.TOWN})`, 'gi') })
    if (claimType) {
      [, claimType] = claimType
    }
    if (claimType === type.SUBCLAIM) {
      return
    }
    if (!pList.includes(label)) {
      pList.push(label)
      playerData.push({
        label,
        size: calculateClaimSize({ x, z }).size,
        claims: 1
      })
    } else {
      const found = playerData.find(item => item.label === label)
      found.size += calculateClaimSize({ x, z }).size
      found.claims += 1
    }
  })

  playerData = playerData.sort((a, b) => b.size - a.size)
  return playerData
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
    return match
  })
  return `<ul id="autocomplete-list"><li class="player">${filteredList.join('</li><li class="player">')}</li></ul>`
}

const hideAutocompletePlayerList = () => document.getElementById('autocomplete_playerlist').remove()

const fillPlayerName = (event) => {
  const field = document.getElementById('player_name')
  const name = event.target.textContent
  field.value = name
  hideAutocompletePlayerList()
}

const loadListeners = () => {
  document.getElementById('claims_player').addEventListener('click', () => {
    arrResults = []
    cleanPreviousResults()
    toggleLoader()
    filterMap({
      mapData: parsedData,
      numDays: 100,
      callback: () => getClaimsByPlayer(document.getElementById('player_name').value)
    })
  })

  document.getElementById('top_players').addEventListener('click', () => {
    let list = ''
    const top = getBlockNumberByUser()
    const element = document.getElementById('results')
    top.forEach(({ label, size, claims }) => { list += `<li><strong>${label}:</strong><span>${size}</span> (${claims} claims)</li>` })
    element.innerHTML = `<ol>${list}</ol>`
  })

  document.getElementById('search').addEventListener('click', () => {
    const numDays = document.getElementById('numDays').value
    arrResults = []
    cleanPreviousResults()
    filterMap({
      mapData: parsedData,
      numDays,
      callback: showResults
    })
  })

  const field = document.getElementById('player_name')
  field.addEventListener('keyup', event => {

    const playerListContainer = document.getElementById('autocomplete_playerlist') ?? document.createElement('div')
    playerListContainer.setAttribute("id", "autocomplete_playerlist")
    const str = event.target.value
    if (str.length > 0) {
      playerListContainer.innerHTML = filterPlayerList(str)
      field.insertAdjacentElement('afterend', playerListContainer)
      document.querySelectorAll('#autocomplete_playerlist .player').forEach(item => {
        item.removeEventListener('click', fillPlayerName)
        item.addEventListener('click', fillPlayerName)
      })
    }
  })

  const buttons = Array.from(document.getElementsByClassName('order-button'))
  buttons.forEach((button) => {
    button.addEventListener('click', (evt) => {
      let order = {
        key: '',
        order: '',
      }
      switch (evt.target.id) {
        case 'order_date_asc':
          order = {
            key: 'date',
            order: 'asc',
          }
          break
        case 'order_date_desc':
          order = {
            key: 'date',
            order: 'desc',
          }
          break
        case 'order_size_asc':
          order = {
            key: 'claimSize',
            order: 'asc',
          }
          break
        case 'order_size_desc':
        default:
          order = {
            key: 'claimSize',
            order: 'desc',
          }
          break
      }
      cleanPreviousResults()
      orderResults(order)
      showResults()
    })
  })

  document.getElementById("only-large").addEventListener("change", evt => {
    filterLargeClaims = evt.target.checked
    minClaimSize = +(document.getElementById("min-size").value)
    cleanPreviousResults()
    showResults()
  })

  document.getElementById("min-size").addEventListener("blur", evt => {
    minClaimSize = +(evt.target.value)
    cleanPreviousResults()
    showResults()
  })
}

window.onload = async () => {
  json = await getRemoteMap(proxyAntiCors + encodeURIComponent(urlRemoteMap))
  parsedData = parseMap(json)
  playerList = getPlayerList()
  loadListeners()
}
