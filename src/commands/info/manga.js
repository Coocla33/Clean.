exports.data = {
  'name': 'Manga',
  'desc': 'Showing all the Manga information you want!',
  'usage': 'manga (query)',
  'dm': true,
  'new': true
}

const kitsu = require('node-kitsu')

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Check if query
    if (data.suffix) {
      msg.channel.send('Getting your manga...').then((Msg) => {

        //Get manga data trough kitsu.io api
        kitsu.searchManga(data.suffix, 0).then((results) => {

          //Check if there are more then 0 results
          if (results.length > 0) {

            //Setup variables
            let manga = results[0]
            let messageArray = []
            let title = ''

            //Title
            if (manga.attributes.titles.ja_jp) {
              title = ':sparkles: **' + manga.attributes.canonicalTitle + ' (' + manga.attributes.titles.ja_jp + ')**'
            } else {
              title = ':sparkles: **' + manga.attributes.canonicalTitle + '**'
            }

            //Synopsis
            if (manga.attributes.synopsis) {
              messageArray.push('**__Synopsis__**\n' + manga.attributes.synopsis.split(' ', 64).join(' ') + ' [Show More](' + manga.links.self + ')\n')
            }

            //Rating
            if (manga.attributes.averageRating) {
              messageArray.push('► Rating **' + manga.attributes.averageRating + '** *(#' + manga.attributes.ratingRank + ')*')
            }

            //Popularity Rank
            if (manga.attributes.popularityRank) {
              messageArray.push('► **#' + manga.attributes.popularityRank + '** most popular Manga!')
            }

            //Age Rating
            if (manga.attributes.ageRating) {
              if (manga.attributes.ageRatingGuide) {
                messageArray.push('► Age Rating: **' + manga.attributes.ageRating + '**')
                messageArray.push('► Age Guide: **' + manga.attributes.ageRatingGuide + '**')
              } else {
                messageArray.push('► Age Rating: **' + manga.attributes.ageRating + '**')
              }
            }

            //Publishing
            if  (manga.attributes.startDate) {
              if  (manga.attributes.endDate) {
                messageArray.push('► Publishing Dates: **' + manga.attributes.startDate + '/' + manga.attributes.endDate + '**')
              } else {
                messageArray.push('► Started Publishing: **' + manga.attributes.startDate + '**')
              }
            } else {
              messageArray.push('► Not started Publishing')
            }

            //Create Embed
            let embed = {
              'description': messageArray.join('\n'),
              'color': handlers.misc.embedColor(msg),
              'timestamp': new Date(),
              'footer': {
                'text': '© Clean.'
              }
            }

            //Edit message with Embed
            Msg.edit(title, {embed})
          } else {
            Msg.edit('Could not find any manga series according to your query...')
          }
        })
      })
    } else {
      resolve('No Query')
    }
  })
}
