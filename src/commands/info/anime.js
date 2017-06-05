exports.data = {
  'name': 'Anime',
  'desc': 'Search your favorite anime series through the Kitsu.io api!',
  'usage': 'anime (query)',
  'dm': true,
  'new': true
}

const kitsu = require('node-kitsu')

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Check query
    if (data.suffix) {
      msg.channel.send('Getting your anime...').then((Msg) => {

        //Get Anime object trough Kitsu API
        kitsu.searchAnime(data.suffix, 0).then((results) => {

          //Check if there are any results
          if (results.length > 0) {

            //Setup Variables
            let anime = results[0]
            let messageArray = []
            let title = ''

            //Title
            if (anime.attributes.titles.ja_jp) {
              title = ':white_flower: **' + anime.attributes.canonicalTitle + ' (' + anime.attributes.titles.ja_jp + ')**'
            } else {
              title = ':white_flower: **' + anime.attributes.canonicalTitle + '**'
            }

            //Synopsis
            if (anime.attributes.synopsis) {
              messageArray.push('***Synopsis***\n' + anime.attributes.synopsis.split(' ', 64).join(' ') + ' [Show More...](' + anime.links.self + ')\n')
            }

            //Rating
            if (anime.attributes.averageRating) {
              messageArray.push('► Rating **' + anime.attributes.averageRating + '** *(#' + anime.attributes.ratingRank + ')*')
            }

            //Popularity Rank
            if (anime.attributes.popularityRank) {
              messageArray.push('► **#' + anime.attributes.popularityRank + '** most popular Anime!')
            }

            //Age Rating
            if (anime.attributes.ageRating) {
              if (anime.attributes.ageRatingGuide) {
                messageArray.push('► ' + anime.attributes.ageRatingGuide + '')
              } else {
                messageArray.push('► Age Rating: **' + anime.attributes.ageRating + '**')
              }
            }

            //Show Type
            if (anime.attributes.showType) {
              messageArray.push('► Show Type: **' + anime.attributes.showType + '**')
            }

            //Airing
            if (anime.attributes.startDate) {
              if (anime.attributes.endDate) {
                messageArray.push('► Airing Dates: **' + anime.attributes.startDate + '/' + anime.attributes.endDate + '**')
              } else {
                messageArray.push('► Started Airing: **' + anime.attributes.startDate + '**')
              }
            } else {
              messageArray.push('► Not started Airing')
            }

            //Episode Count/Length
            if (anime.attributes.episodeCount) {
              if (anime.attributes.episodeLength) {
                messageArray.push('► **' + anime.attributes.episodeCount + '** Episodes(s) at **' + anime.attributes.episodeLength + '** Minutes')
              } else {
                messageArray.push('► **' + anime.attributes.episodeCount + '** Episodes(s)')
              }
            }

            //Create embed
            embed = {
              'description': messageArray.join('\n'),
              'color': handlers.misc.embedColor(msg),
              'timestamp': new Date(),
              'footer': {
                'text': '© Clean.'
              }
            }

            //Send final embed
            Msg.edit(title, {embed})
          } else {
            Msg.edit('Could not find any anime series according to your query...')
          }
        })
      })
    } else {
      resolve('No Query')
    }
  })
}
