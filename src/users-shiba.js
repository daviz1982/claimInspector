const getUserRange = username => {
  // const client = clientPromise
  // const collection = client.db('test').collection('players')
  // const results = await collection.findOne({ username })
  // if (results) return results
  // return null

  switch (username) {
    case 'JhonShepard':
    case 'EllieDevil':
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
      return 4
    default:
      return 0
  }
}

export default getUserRange;