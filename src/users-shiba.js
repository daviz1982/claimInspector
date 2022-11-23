const getUserRange = username => {
  // const client = clientPromise
  // const collection = client.db('test').collection('players')
  // const results = await collection.findOne({ username })
  // if (results) return results
  // return null

  switch (username) {
    case 'JhonShepard':
      return 1
    case 'jesusmpc':
      return 2
    case 'vladimirovich23':
      return 3
    case 'JCC1995':
      return 4
    default:
      return 0
  }
}

export default getUserRange;