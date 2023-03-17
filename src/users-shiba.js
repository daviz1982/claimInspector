const getUserRange = username => {
  // const client = clientPromise
  // const collection = client.db('test').collection('players')
  // const results = await collection.findOne({ username })
  // if (results) return results
  // return null
  
  /*
  const daysToAbandon = {
    0: 45, // Normal  - 200
    1: 50, // Elite   - 400
    2: 55, // Ultra   - 550
    3: 60, // Mega    - 700
    4: 65, // Supremo - 850
  }
  */

  switch (username) {
    case 'JhonShepard':
    case 'EllieDevil':
    case 'LaChurryFlower':
      return 1
    case 'jesusmpc':
    case 'bru509':
    case 'minecrafconedu':
      return 2
    case 'vladimirovich23':
    case 'ZorrilloEstepa':
    case 'Davido_SsS':
    case 'Locurita':
    case 'MrTroy77':
    case 'vizucv':
    case 'ladronderecursos':
    case 'VBruno30':
      return 3
    case 'JCC1995':
    case '8Hiru8':
    case 'oliver':
    case 'Arparchancla':
    case 'daviz667':
    case 'G19TheGreat':
    case 'Sagres_V':
    case 'Celi511':
    case 'JaviYoQueSe':
    case 'GolfilloGTI':
    case 'Victxrius718':
    case 'rociomlg96':
    case 'Unmalaje':
    case 'Lgm_16':
    case 'YTFocusMK4':
    case 'deltafire777YT':
    case 'vayix':
    case '1_V3LF0R_1':
      return 4
    default:
      return 0
  }
}

export default getUserRange;
