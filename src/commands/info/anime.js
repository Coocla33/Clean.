exports.data = {
  'name': 'Anime',
  'desc': 'Search your favorite anime series through the Kitsu.io api!',
  'usage': 'anime (query)',
  'dm': true,
  'indev': true
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
            let anime = results[0]

            //Create basic embed
            let embed = {
              'color': handlers.misc.embedColor(msg),
              'timestamp': new Date(),
              'footer': {
                'text': '© Clean.'
              },
              'fields': []
            }

            //Title
            if (anime.attributes.titles.ja_jp) {
              embed.title = anime.attributes.canonicalTitle + ' (' + anime.attributes.titles.ja_jp + ')'
            } else {
              embed.title = anime.attributes.canonicalTitle
            }

            //Synopsis
            if (anime.attributes.synopsis) {
              embed.description = anime.attributes.synopsis.split(' ', 64).join(' ') + ' [Show More...](' + anime.links.self + ')'
            }

            //Average Rating
            if (anime.attributes.averageRating) {
              embed.fields.push({'inline': true, 'name': 'Average Rating', 'value': '`' + anime.attributes.averageRating + '`'})
            }

            //Rating Rank
            if (anime.attributes.ratingRank) {
              embed.fields.push({'inline': true, 'name': 'Rating Rank', 'value': '`' + anime.attributes.ratingRank + '`'})
            }

            //Popularity Rank
            if (anime.attributes.popularityRank) {
              embed.fields.push({'inline': true, 'name': 'Popularity Rank', 'value': '`' + anime.attributes.popularityRank + '`'})
            }

            //Age Rating
            if (anime.attributes.ageRating) {
              if (anime.attributes.ageRatingGuide) {
                embed.fields.push({'inline': true, 'name': 'Age Rating', 'value': '`' + anime.attributes.ageRatingGuide + '`'})
              } else {
                embed.fields.push({'inline': true, 'name': 'Age Rating', 'value': '`' + anime.attributes.ageRating + '`'})
              }
            }

            //Show Type
            if (anime.attributes.showType) {
              embed.fields.push({'inline': true, 'name': 'Show Type', 'value': '`' + anime.attributes.showType + '`'})
            }

            //Airing
            if (anime.attributes.startDate) {
              if (anime.attributes.endDate) {
                embed.fields.push({'inline': true, 'name': 'Airing Dates', 'value': '`' + anime.attributes.startDate + ' / ' + anime.attributes.endDate + '`'})
              } else {
                embed.fields.push({'inline': true, 'name': 'Airing Dates', 'value': '`' + anime.attributes.startDate + '`'})
              }
            }

            //Episode Count/Length
            if (anime.attributes.episodeCount) {
              if (anime.attributes.episodeLength) {
                embed.fields.push({'inline': false, 'name': 'Episode Count/Length', 'value': '`' + anime.attributes.episodeCount + ' episode(s) at ' + anime.attributes.episodeLength + ' minutes.`'})
              } else {
                embed.fields.push({'inline': false, 'name': 'Episode Count', 'value': '`' + anime.attributes.episodeCount + ' episode(s)`'})
              }
            }

            //Send final embed
            Msg.edit('', {embed})
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
