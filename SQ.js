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
	{$match:{Tags:"ai-design"}}, 
	{$project:{_id: "$Id", Title:"$Title", "views":"$ViewCount"}},
	{$sort: {"views": -1}},
	{$limit: 1}
	
])