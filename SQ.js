//SQ1
db.posts.aggregate([{
      $lookup: {
         from: "users",
         localField: "OwnerUserId",
         foreignField: "Id",
         as: "UserInfo"
      }
   },
   {
      $match: {
         $or: [{
               ParentId: 2277 //Changed from String to Int because of Pre-Processing function
            },
            {
               Id: 2277
            }
         ]
      }
   },

   {
      $project: {
         CreationDate: {
            $arrayElemAt: ["$UserInfo.CreationDate", 0]
         },
         DisplayName: {
            $arrayElemAt: ["$UserInfo.DisplayName", 0]
         },
         UpVotes: {
            $arrayElemAt: ["$UserInfo.UpVotes", 0]
         },
         DownVotes: {
            $arrayElemAt: ["$UserInfo.DownVotes", 0]
         }
      }
   }


])

//SQ2

db.posts.aggregate([

   {
      $project: {
         Tags: {
            $split: ["$Tags", ","]
         }, //added $split for tags
         _id: "$Id",
         Title: "$Title",
         "views": "$ViewCount"
      }
   },
   {
      $match: {
         Tags: "turing-test"//user-input
      }
   },
   {
      $sort: {
         "views": -1
      }
   } {
      $limit: 1
   }



])

