const QuoteRepo = require('./quote.repository');

module.exports = {
   ProductRepo: require('./product.repository'),
   UserRepo: require('./user.repository'),
   OrderRepo: require('./order.repository'),
   StatsRepo: require('./stats.repository'),
   FeedbackRepo: require('./feedback.repository'),
   QuoteRepo: require('./quote.repository'),
   ProductVoteRepo: require('./productVote.repository')
}