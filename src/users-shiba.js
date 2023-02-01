const getUserRange = username => {
  // const client = clientPromise
  // const collection = client.db('test').collection('players')
  // const results = await collection.findOne({ username })
  // if (results) return results
  // return null

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
    case 'unmalaje':
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