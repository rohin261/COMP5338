//AQ1
db.posts.aggregate([

   {
      "$lookup": {
         "from": "posts",
         "let": {
            "answerId": "$AcceptedAnswerId"
         },
         "pipeline": [{
            "$match": {
               "$expr": {
                  "$eq": ["$Id", "$$answerId"]
               }
            }
         }],
         "as": "dates"
      }
   },
   {
      $project: {
         QuestionTitle: "$Title",
         QuestionDate: "$CreationDate",
         AnswerDate: {
            $arrayElemAt: ["$dates.CreationDate", 0]
         },
         tag: {
            $split: ["$Tags", ","]
         }
      }
   },
   {
      $match: {
         tag: "neural-networks" //user input
      }
   },
   {
      $project: {
         Title: "$QuestionTitle",
         TimeDifInHours: {
            $divide: [{
               $subtract: ["$AnswerDate", "$QuestionDate"]
            }, (1000 * 60 * 60)] //convert time difference to Hours
         }

      }
   },
   {
      $match: {
         TimeDifInHours: {
            "$exists": true,
            "$ne": null
         }
      }
   },
   {
      $sort: {
         TimeDifInHours: 1 //Fastest time first
      }
   }, {
      $limit: 1 
   }

])
//AQ2

db.posts.aggregate([{
      $project: {
         tag: {
            $split: ["$Tags", ","]
         },
         CreationDate: "$CreationDate"
      }
   },
   {
      $unwind: "$tag"
   },
   {
      $match: {
         "CreationDate": {
            $gte: ISODate("2018-08-01T00:00:00"),
            $lte: ISODate("2018-08-31T00:00:00")
         }
      }
   },
   {
      $group: {
         _id: {
            Topic: "$tag"
         },
         numOfUser: {
            $sum: 1
         }
      }
   },
   {
      $sort: {
         "numOfUser": -1
      }
   },
   {
      $limit: 5
   }
])

//AQ3

db.posts.aggregate([{
      "$lookup": {
         "from": "posts",
         "let": {
            "answerId": "$AcceptedAnswerId"
         },
         "pipeline": [{
            "$match": {
               "$expr": {
                  "$eq": ["$Id", "$$answerId"]
               }
            }
         }],
         "as": "info"
      }
   },
   {
      $match: {
         AcceptedAnswerId: {
            "$exists": true,
            "$ne": null
         }
      }
   },

   {
      $project: {
         tag: {
            $split: ["$Tags", ","]
         },
         OwnerId: {
            $arrayElemAt: ["$info.OwnerUserId", 0]
         },
         QuestionId: "$Id",
         Questions: "$Title"


      }
   },
   {
      $sort: {
         QuestionId: 1
      }
   },
   {
      $match: {
         tag: "neural-networks"
      }
   },
   {
      $group: {
         _id: "$OwnerId",
         count: {
            $sum: 1
         },
         info: {
            $push: {
               QuestionId: "$QuestionId",
               Question: "$Questions"
            }
         }
      }
   },
   {
      $sort: {
         count: -1
      }
   },
   {
      $limit: 1
   },


])