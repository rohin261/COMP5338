# COMP5338 - Advanced Data Models

Connection to DB:

**To connect using the mongo shell:**\
mongo ds115193.mlab.com:15193/comp5338assignment -u <dbuser> -p <dbpassword>

**To connect using a driver via the standard MongoDB URI**:\
mongodb://<dbuser>:<dbpassword>@ds115193.mlab.com:15193/comp5338assignment

**DB Admin details:**

username: admin\
password: **password1**

**Settings for Robo 3T/Studio 3T:**

 1. Connection Tab:

	Connection type = Direct Connection\
	Name: COMP5338Assignment\
	Address = ds115193.mlab.com: 15193

2. Authentication:

	Database: comp5338assignment\
	User Name: admin\
	Password: **password1**\
	Auth Mechanism: SCRAM-SHA-1

#Simple Query 1 and 2
[SQ1] Find all users involved in a given question (identified by id) and their respective
profiles including the creationDate, DisplayName, upVote and DownVote. Note, we
are only interested in existing users who either posted or answered the question. You
may ignore users that do not have an id.

db.posts.aggregate([
{$lookup:{
from:"users",
localField:"OwnerUserId",
foreignField:"Id",
as:"UserInfo"}},
{$match:{$or:[{ParentId:"2261"},{Id:2261}]}},
{$project:{CreationDate:"$UserInfo.CreationDate",DisplayName:"$UserInfo.DisplayName",
 UpVotes:"$UserInfo.UpVotes",DownVotes:"$UserInfo.DownVotes"}}

])


• [SQ2] Assuming each tag represents a topic, find the most viewed question in a given
topiC
db.posts.aggregate([
{$match:{Tags:"ai-design"}},
{$project:{id:"$Id",count:{$toInt:"$ViewCount"}}},
{$sort: {count:-1} },
{$limit: 1}
])

Qustion: Can u use $toInt operator in your mongodb(version4.0 or newver)
It is wierd that I cannot use it in my laplop, even though my version is 4.0. can u try it, thanx!
