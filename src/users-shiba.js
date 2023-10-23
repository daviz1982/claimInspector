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

  switch (username.toLowerCase()) {
    case 'elliedevil':
    case 'jhonshepard':
    case 'marietepete_07':
      return 1
    case 'bru509':
    case 'jesusmpc':
    case 'lachurryflower':
    case 'minecrafconedu':
    case 'soldado_74':
      return 2
    case 'davido_sss':
    case 'eledechino':
    case 'ladronderecursos':
    case 'locurita':
    case 'lolo23':
    case 'mario':
    case 'mrtroy77':
    case 'nievsassy':
    case 'vbruno30':
    case 'vladimirovich23':
    case 'zorrilloestepa':
      return 3
    case '1_v3lf0r_1':
    case '8hiru8':
    case 'arparchancla':
    case 'atkelo':
    case 'brokenfj':
    case 'bantic_4':
    case 'celi511':
    case 'daviz667':
    case 'deltafire777yt':
    case 'frank1200tv':
    case 'g19thegreat':
    case 'golfillogti':
    case 'gorka35gg':
    case 'javiyoquese':
    case 'jcc1995':
    case 'joseng':
    case 'lgm_16':
    case 'mimijaen':
    case 'oliver':
    case 'pinkroster68':
    case 'rociomlg96':
    case 'unmalaje':
    case 'sagres_v':
    case 'sapsd':
    case 'sergiius':
    case 'srhachiko':
    case 'trripe1':
    case 'turly04':
    case 'vayix':
    case 'victxrius718':
    case 'vizucv':
    case 'wito8':
    case 'youdontmeanmuch':
    case 'ytfocusmk4':
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
