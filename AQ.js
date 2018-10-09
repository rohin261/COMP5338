//AQ1
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
		"as": "dates"
	}
}, {
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
}, {
	$match: {
		tag: "neural-networks" //user input
	}
}, {
	$project: {
		Title: "$QuestionTitle",
		TimeDifInHours: {
			$divide: [{
				$subtract: ["$AnswerDate", "$QuestionDate"]
			}, (1000 * 60 * 60)] //convert time difference to Hours
		}
	}
}, {
	$match: {
		TimeDifInHours: {
			"$exists": true,
			"$ne": null
		}
	}
}, {
	$sort: {
		TimeDifInHours: 1 //Fastest time first
	}
}, {
	$limit: 1
}])
///AQ2
db.posts.aggregate([{
	$project: {
		tag: {
			$split: ["$Tags", ","]
		},
		CreationDate: "$CreationDate",
		AnswerCount: "$AnswerCount",
		Question: "$Id",
		Owner: "$OwnerUserId"
	}
}, {
	$unwind: "$tag"
}, {
	$lookup: {
		"from": "posts",
		"let": {
			"yy": "$Question"
		},
		"pipeline": [{
			"$match": {
				"$expr": {
					"$eq": ["$$yy", "$ParentId"]
				}
			},
		}],
		"as": "info"
	}
}, {
	$match: {
		"CreationDate": {
			$gte: ISODate("2017-03-01T00:00:00"),
			$lte: ISODate("2017-03-31T00:00:00")
		}
	}
}, {
	$unwind: "$info"
}, {
	$group: {
		_id: "$tag",
		OOO: {
			$addToSet: "$Owner"
		},
		Answerer: {
			$addToSet: "$info.OwnerUserId"
		}
	}
}, {
	$project: {
		FinalTotal: {
			"$add": [{
				$size: "$OOO"
			}, {
				$size: "$Answerer"
			}]
		}
	}
}, {
	$project: {
		Topic: "$tag",
		TotalUsers: "$FinalTotal"
	}
}, {
	$sort: {
		TotalUsers: -1
	}
}, {
	$limit: 5
}])

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
         tag: "deep-learning"
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
   {$project:{ChampionUserId:"$_id", TotalAnswers:"$count", AllQuestions:"$info"}},
   {
      $sort: {
         TotalAnswers: -1
      }
   },
   {
      $limit: 1
   },
])