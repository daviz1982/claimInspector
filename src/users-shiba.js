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
      return 2
    case 'Davido_SsS':
    case 'Frank1200tv':
    case 'ladronderecursos':
    case 'Locurita':
    case 'LOLO23':
    case 'Mario':
    case 'MrTroy77':
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
    case 'G19TheGreat':
    case 'GolfilloGTI':
    case 'JaviYoQueSe':
    case 'JCC1995':
    case 'Lgm_16':
    case 'oliver':
    case 'rociomlg96':
    case 'Unmalaje':
    case 'Sagres_V':
    case 'Victxrius718':
    case 'vizucv':
    case 'YTFocusMK4':
    case 'vayix':
      return 4
    default:
      return 0
  }
}

export default getUserRange;
