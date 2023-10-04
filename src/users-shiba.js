const getUserRange = username => {
  // const client = clientPromise
  // const collection = client.db('test').collection('players')
  // const results = await collection.findOne({ username })
  // if (results) return results
  // return null

  // 0: 45, // Normal  - 200
  // 1: 50, // Elite   - 400
  // 2: 55, // Ultra   - 550
  // 3: 60, // Mega    - 700
  // 4: 65, // Supremo - 850

  switch (username) {
    case 'EllieDevil':
    case 'JhonShepard':
    case 'Marietepete_07':
      return 1
    case 'bru509':
    case 'jesusmpc':
    case 'LaChurryFlower':
    case 'minecrafconedu':
    case 'Soldado_74':
      return 2
    case 'Davido_SsS':
    case 'ladronderecursos':
    case 'Locurita':
    case 'LOLO23':
    case 'Mario':
    case 'MrTroy77':
    case 'Nievsassy':
    case 'VBruno30':
    case 'vladimirovich23':
    case 'ZorrilloEstepa':
      return 3
    case '1_V3LF0R_1':
    case '8Hiru8':
    case 'Arparchancla':
    case 'Celi511':
    case 'daviz667':
    case 'deltafire777YT':
    case 'Frank1200Tv':
    case 'G19TheGreat':
    case 'GolfilloGTI':
    case 'Gorka35gg':
    case 'JaviYoQueSe':
    case 'JCC1995':
    case 'Lgm_16':
    case 'oliver':
    case 'pinkroster68':
    case 'rociomlg96':
    case 'Unmalaje':
    case 'Sagres_V':
    case 'SapSD':
    case 'vayix':
    case 'Victxrius718':
    case 'vizucv':
    case 'Wito8':
    case 'YTFocusMK4':
      return 4
    default:
      return 0
  }
}

export const RANGE = [
  "Normal",
  "Elite",
  "Ultra",
  "Mega",
  "Supremo",
]

export default getUserRange;
