SQ1

db.posts.aggregate([ 
	{$lookup:
		{from:"users", 
		localField:"OwnerUserId", 
		foreignField:"Id", 
		as:"UserInfo"}}, 
	{$match:
		{$or:[{ParentId:"2261"},
		{Id:2261}]}}, 
	{$project:
		{CreationDate:"$UserInfo.CreationDate",	
		DisplayName:"$UserInfo.DisplayName", 
		UpVotes:"$UserInfo.UpVotes",
		DownVotes:"$UserInfo.DownVotes"}}

])

SQ2

db.posts.aggregate([ 

	{ $project:
	  {Tags:{$split:["$Tags", ","] }, //added $split for tags
	    _id: "$Id", Title:"$Title", "views":"$ViewCount" }
	},
	{$match:{Tags:"turing-test"}}, 
	{$sort: {"views": -1}}
	{$limit:1}


	
])





AQ2

db.posts.aggregate([
        {$project:{tag:{$split:["$Tags",","]},CreationDate:"$CreationDate"}},
        {$unwind:"$tag"},
        {$match:{"CreationDate": {$gte: ISODate("2018-08-01T00:00:00"), $lte:ISODate("2018-08-31T00:00:00")}}},
        {$group:{_id:{Topic:"$tag"},numOfUser: {$sum:1}}},
        {$sort:{"numOfUser":-1}},
        {$limit:5}
])

